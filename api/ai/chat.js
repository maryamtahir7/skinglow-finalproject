import Groq from 'groq-sdk';
import { sanitizeAIResponse, buildUserContext } from './_response-utils.js';
import { previewShoppingAction, executeConfirmedAction } from './_shopping-intent.js';

import { processOrderFlow, selectProductForOrder, executeOrderConfirmation, handleOrderSourceChoice } from './_order-flow.js';
import { previewProductRecommendations as previewRecs } from './_recommend-intent.js';

const apiKey = process.env.GROQ_API_KEY;
if (!apiKey) {
    console.error('CRITICAL: GROQ_API_KEY is not set in environment variables.');
}
const groq = new Groq({ apiKey });

const BASE_SYSTEM_INSTRUCTION = `You are the SkinGlow Virtual Esthetician — warm, professional, expert skincare consultant.
Give concise skincare advice in natural language only.
For shopping/orders, the app handles structured flows — do NOT claim orders are placed unless confirmed by the system.
IMPORTANT:
- Never invent product names. Only mention products shown as cards or already named by the customer.
- NEVER output function calls, tool calls, XML, JSON tool syntax, or code blocks like <function=...>, tool_call, or searchProducts(...).
- Reply only with normal conversational text for the customer.
Never show code or internal details.`;

function mapHistory(history) {
    const messages = [];
    for (const msg of history) {
        const role = msg.role === 'model' ? 'assistant' : msg.role;
        let content = Array.isArray(msg.parts) ? msg.parts[0].text : (msg.content || msg.text || '');
        content = sanitizeAIResponse(content);
        if (content) messages.push({ role, content });
    }
    return messages;
}

async function runCompletion(messages) {
    return groq.chat.completions.create({
        messages,
        model: 'llama-3.3-70b-versatile',
        temperature: 0.65,
        max_tokens: 600,
    });
}

function buildConfirmationReply(pendingConfirmation) {
    if (pendingConfirmation?.type === 'add_to_cart') {
        return `I found this product for you! Is this the one you'd like to add to your cart? ✨`;
    }
    if (pendingConfirmation?.type === 'place_order') {
        return `Here's your order summary. Please review everything and tap **Yes, Place Order** to confirm. ✨`;
    }
    return null;
}

function buildFlowResponse(result, history, userMessage) {
    const reply = result.reply || '';
    const updatedHistory = userMessage
        ? [...history, { role: 'user', parts: [{ text: userMessage }] }, { role: 'model', parts: [{ text: reply }] }]
        : history;

    return {
        reply,
        updatedHistory,
        actions: result.actions || [],
        pendingConfirmation: result.pendingConfirmation || null,
        orderDraft: result.orderDraft ?? null,
        productPicker: result.productPicker || null,
        orderProgress: result.orderProgress || null,
        orderSourceChoice: result.orderSourceChoice || null,
        confirmed: result.confirmed,
        orderId: result.orderId || null,
    };
}

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const {
        message,
        history = [],
        userId,
        userName,
        userPrefs,
        confirmAction,
        orderDraft,
        selectProductId,
        orderSourceChoice,
    } = req.body;

    try {
        const context = { userId, userName, userPrefs };

        // ── Confirm cart / order (button tap) ──
        if (confirmAction) {
            let result;
            if (confirmAction.type === 'place_order') {
                result = await executeOrderConfirmation(confirmAction, context);
            } else {
                result = await executeConfirmedAction(confirmAction, context);
            }

            const reply = result.message || (result.success ? 'Done!' : 'Something went wrong.');
            return res.status(200).json(buildFlowResponse({
                ...result,
                reply,
                orderDraft: result.orderDraft ?? null,
                confirmed: result.success,
                orderId: result.orderDetails?.orderId?.slice(0, 8)?.toUpperCase(),
            }, history));
        }

        // ── Cart vs skin-type choice (button tap) ──
        if (orderSourceChoice) {
            const result = await handleOrderSourceChoice(orderSourceChoice, orderDraft, context);
            const label = orderSourceChoice === 'cart'
                ? 'Order from cart'
                : `${orderSourceChoice} skin products`;
            return res.status(200).json(buildFlowResponse(result, history, label));
        }

        // ── Product selection from picker ──
        if (selectProductId) {
            const result = await selectProductForOrder(selectProductId, orderDraft, context);
            return res.status(200).json(buildFlowResponse(result, history, `Selected product`));
        }

        if (!message) {
            return res.status(400).json({ message: 'Message is required' });
        }

        // ── Structured order flow (place order, collect details) ──
        const orderResult = await processOrderFlow({ message, orderDraft, context });
        if (orderResult?.handled) {
            return res.status(200).json(buildFlowResponse(orderResult, history, message));
        }

        // ── Product recommendations (real catalog + clickable cards) ──
        // Reload recommend module so edits apply in dev (Removed for Vercel support)
        const recommendOutcome = await previewRecs(message);
        if (recommendOutcome?.handled && recommendOutcome.productPicker?.products?.length) {
            return res.status(200).json(buildFlowResponse({
                ...recommendOutcome,
                orderDraft: orderDraft || null,
            }, history, message));
        }
        if (recommendOutcome?.handled) {
            return res.status(200).json(buildFlowResponse({
                ...recommendOutcome,
                orderDraft: orderDraft || null,
            }, history, message));
        }

        // ── Cart add preview ──
        const actions = [];
        let pendingConfirmation = null;
        const shoppingOutcome = await previewShoppingAction(message, context);

        if (shoppingOutcome?.actions?.length) actions.push(...shoppingOutcome.actions);
        if (shoppingOutcome?.pendingConfirmation) pendingConfirmation = shoppingOutcome.pendingConfirmation;

        // Block fake "yes" order claims — if user says yes without active confirmation card
        const isYes = /^(yes|yep|yeah|haan|han|ji|ok|confirm|bilkul|sure)$/i.test(message.trim());
        if (isYes && !orderDraft?.step) {
            return res.status(200).json(buildFlowResponse({
                handled: true,
                reply: 'Please use the **confirmation card** above to confirm your order or cart action. I need your explicit tap on **Yes, Place Order** to proceed. ✨',
                orderDraft: null,
            }, history, message));
        }

        let shoppingNote = '';
        if (shoppingOutcome?.summary) {
            shoppingNote = `\n\n**System note:** ${shoppingOutcome.summary}`;
        }

        // Paused mid-order — answer freely, keep draft, gentle reminder
        if (orderDraft?.step) {
            const waiting = orderDraft.askingField
                || (orderDraft.step === 'select_product' ? 'product selection' : null)
                || (orderDraft.step === 'choose_source' ? 'cart or skin-type choice' : null)
                || (orderDraft.step === 'confirm' ? 'order confirmation' : 'order details');
            shoppingNote += `\n\n**Paused order in progress:** Waiting for ${waiting}. Answer the customer's current question helpfully (skincare advice, etc.). Do NOT ask for phone/address unless they want to continue the order. Do NOT claim an order was placed. End with one short line like: "Whenever you're ready, we can continue your order — just share your ${orderDraft.askingField || 'details'} or say place my order."`;
        }

        const systemInstruction = `${BASE_SYSTEM_INSTRUCTION}${shoppingNote}\n\n**User context:** ${buildUserContext({ userId, userName, userPrefs })}`;

        const messages = [
            { role: 'system', content: systemInstruction },
            ...mapHistory(history),
            { role: 'user', content: message },
        ];

        // No tool declarations — shopping/search is handled by structured flows.
        // Enabling tools caused the model to leak <function=...> into chat text.
        const completion = await runCompletion(messages);
        let textResponse = sanitizeAIResponse(completion.choices[0].message.content || '');

        if (pendingConfirmation) {
            textResponse = buildConfirmationReply(pendingConfirmation) || textResponse;
        }

        if (!textResponse) {
            textResponse = "I'm here to help with your skincare! What would you like to know? ✨";
        }

        return res.status(200).json({
            reply: textResponse,
            updatedHistory: [
                ...history,
                { role: 'user', parts: [{ text: message }] },
                { role: 'model', parts: [{ text: textResponse }] },
            ],
            actions,
            pendingConfirmation,
            // Keep paused order draft so user can resume later
            orderDraft: orderDraft || null,
        });
    } catch (error) {
        console.error('Chat API Error:', error);
        res.status(500).json({ message: 'Error processing your request', error: error.message });
    }
}

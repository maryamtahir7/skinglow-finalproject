import Groq from 'groq-sdk';
import { adminTools, adminToolDeclarations } from './admin-tools.js';

const apiKey = process.env.GROQ_API_KEY;
if (!apiKey) {
    console.error('CRITICAL: GROQ_API_KEY is not set in environment variables.');
}
const groq = new Groq({ apiKey });

const systemInstruction = `You are the SkinGlow Business Intelligence Analyst, an AI employee dedicated to helping the store owner manage their business.
You have access to live database analytics through your tools.
You can answer questions about revenue, top-selling products, and low inventory.
Be concise, professional, and data-driven. Always base your answers on the data returned by your tools. Use markdown tables where appropriate to display data nicely.`;

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { message, history = [] } = req.body;

    if (!message) {
        return res.status(400).json({ message: 'Message is required' });
    }

    try {
        let messages = [
            { role: 'system', content: systemInstruction }
        ];

        // Format history
        for (const msg of history) {
            const role = msg.role === 'model' ? 'assistant' : msg.role;
            const content = Array.isArray(msg.parts) ? msg.parts[0].text : (msg.content || msg.text || '');
            if (content) {
                messages.push({ role, content });
            }
        }

        messages.push({ role: 'user', content: message });

        console.log(`[Admin AI] Received message: "${message}"`);
        
        let completion = await groq.chat.completions.create({
            messages,
            model: 'llama-3.3-70b-versatile',
            tools: adminToolDeclarations,
            tool_choice: 'auto'
        });

        let responseMessage = completion.choices[0].message;
        let toolCalls = responseMessage.tool_calls;

        if (toolCalls && toolCalls.length > 0) {
            console.log('[Admin AI] Requested tool calls:', toolCalls.map(t => t.function.name));
            
            messages.push(responseMessage);
            
            for (const toolCall of toolCalls) {
                const name = toolCall.function.name;
                const args = JSON.parse(toolCall.function.arguments);
                let apiResponse;
                
                if (adminTools[name]) {
                    apiResponse = await adminTools[name](args);
                } else {
                    apiResponse = { error: `Tool ${name} not found` };
                }
                
                messages.push({
                    tool_call_id: toolCall.id,
                    role: 'tool',
                    name: name,
                    content: JSON.stringify(apiResponse)
                });
            }
            
            console.log('[Admin AI] Sending function responses back to Groq...');
            completion = await groq.chat.completions.create({
                messages,
                model: 'llama-3.3-70b-versatile'
            });
            responseMessage = completion.choices[0].message;
        }

        const textResponse = responseMessage.content;
        
        const updatedHistory = [...history, { role: 'user', parts: [{ text: message }] }, { role: 'model', parts: [{ text: textResponse }] }];
        
        res.status(200).json({ 
            reply: textResponse,
            updatedHistory
        });

    } catch (error) {
        console.error('[Admin AI] Error:', error);
        res.status(500).json({ message: 'Error processing your request', error: error.message });
    }
}

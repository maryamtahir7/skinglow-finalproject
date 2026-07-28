import React, { useState, useRef, useEffect } from 'react';
import { Bot, User, Send, Sparkles, X, Minimize2, Mic, Volume2, VolumeX } from 'lucide-react';
import VoiceInterface, { speakText, stopSpeaking } from './VoiceInterface';
import { useUser } from '@/context/UserContext';
import { useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import ProductConfirmCard from '../pages/AIChat/components/ProductConfirmCard';
import OrderConfirmCard from '../pages/AIChat/components/OrderConfirmCard';
import ProductPickerCard from '../pages/AIChat/components/ProductPickerCard';
import OrderProgressCard from '../pages/AIChat/components/OrderProgressCard';
import OrderSourceChoiceCard from '../pages/AIChat/components/OrderSourceChoiceCard';

let msgIdCounter = 0;
const newId = () => `msg-${++msgIdCounter}-${Date.now()}`;

const YES_RE = /^(yes|yep|yeah|haan|han|ji|ok|okay|confirm|bilkul|sure|kar do|kr do)$/i;
const NO_RE = /^(no|nope|cancel|nahi|nah|mat)$/i;

export default function FloatingAI({ isOpen: externalIsOpen, onClose }) {
    // If no external props, we can fallback to internal state (for pages that use it standalone), but we prefer external.
    const [internalIsOpen, setInternalIsOpen] = useState(false);

    const isControlled = externalIsOpen !== undefined;
    const isOpen = isControlled ? externalIsOpen : internalIsOpen;
    const setIsOpen = isControlled ? (val) => val ? null : onClose?.() : setInternalIsOpen;

    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    const navigate = useNavigate();
    const { user } = useUser();

    const [messages, setMessages] = useState([
        {
            id: newId(),
            text: '✨ Hello! I’m your personal SkinGlow Esthetician. I can help you build a routine, track orders, or find the perfect ingredients for your skin type. How can I help you glow today?',
            sender: 'bot',
            type: 'text'
        }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [orderDraft, setOrderDraft] = useState(null);
    const [products, setProducts] = useState([]);
    const [speakingIndex, setSpeakingIndex] = useState(null);
    const [voiceLang, setVoiceLang] = useState('en-US');

    // History format for Gemini
    const [chatHistory, setChatHistory] = useState([]);

    useEffect(() => {
        if (isOpen) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [messages, isOpen]);

    useEffect(() => {
        if (isOpen) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
            // Small delay to ensure render before focus, especially on mobile
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [messages, isOpen]);

    const toggleChat = () => setIsOpen(!isOpen);

    const handleClose = () => {
        stopSpeaking();
        setSpeakingIndex(null);
        if (onClose) onClose();
        else setIsOpen(false);
    };

    const handleSpeak = (text, idx) => {
        if (speakingIndex === idx) {
            stopSpeaking();
            setSpeakingIndex(null);
            return;
        }

        speakText(text, voiceLang, {
            onStart: () => setSpeakingIndex(idx),
            onEnd: () => setSpeakingIndex(null),
        });
    };

    const handleStopVoice = () => {
        stopSpeaking();
        setSpeakingIndex(null);
    };

    const buildConfirmAction = (pending) => {
        if (pending.type === 'add_to_cart') {
            return {
                type: 'add_to_cart',
                productId: pending.product.id,
                productName: pending.product.name,
                quantity: 1,
            };
        }
        if (pending.type === 'place_order') {
            return {
                type: 'place_order',
                useCart: pending.useCart ?? false,
                productId: pending.productId,
                phone: pending.shipping?.phone,
                address: pending.shipping?.address,
                city: pending.shipping?.city,
                postalCode: pending.shipping?.postalCode,
                paymentMethod: pending.shipping?.paymentMethod || 'COD',
            };
        }
        return null;
    };

    const handleConfirm = async (msgId, confirmAction) => {
        if (confirmLoading) return;
        setConfirmLoading(true);

        try {
            const response = await fetch('/api/ai/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    confirmAction,
                    history: chatHistory,
                    userId: user?.$id || user?.id || 'guest',
                    userName: user?.name || null,
                    userPrefs: user?.prefs || null,
                    orderDraft,
                }),
            });

            const data = await response.json();

            if (data.orderDraft !== undefined) {
                setOrderDraft(data.orderDraft);
            }

            setMessages((prev) =>
                prev.map((m) => (m.id === msgId ? {
                    ...m,
                    confirmed: data.confirmed !== false,
                    orderId: data.orderId || null,
                } : m))
            );

            if (data.reply) {
                const cleanReply = String(data.reply)
                    .replace(/<function=\w+\s*\{[\s\S]*?\}\s*<\/function>/gi, '')
                    .replace(/<function=[^>\n]+>[\s\S]*?<\/function>/gi, '')
                    .replace(/<\/?function[^>]*>/gi, '')
                    .replace(/\b(searchProducts|addToCart|placeOrder)\s*[({][\s\S]*?[)}]/gi, '')
                    .trim();
                setMessages(prev => [...prev, { id: newId(), text: cleanReply, sender: 'bot' }]);
            }

            if (data.confirmed) {
                window.dispatchEvent(new Event('cart-updated'));
                setOrderDraft(null);
            }

            if (data.actions?.length) {
                for (const action of data.actions) {
                    if (action.type === 'cart_updated' || action.type === 'order_placed') {
                        window.dispatchEvent(new Event('cart-updated'));
                    }
                }
            }
        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, { id: newId(), text: 'Could not complete that action. Please try again.', sender: 'bot' }]);
        } finally {
            setConfirmLoading(false);
        }
    };

    const handleCancelConfirm = (msgId) => {
        setMessages((prev) =>
            prev.map((m) => (m.id === msgId ? { ...m, confirmed: false } : m))
        );
        setOrderDraft(null);
        setMessages(prev => [...prev, { id: newId(), text: 'Order cancelled. Let me know if you\'d like to start again or need skincare advice. ✨', sender: 'bot' }]);
    };

    const handleOrderSourceChoice = async (choice) => {
        if (confirmLoading || loading) return;

        const labels = {
            cart: 'Order from my cart',
            dry: 'Dry skin products',
            oily: 'Oily skin products',
            combination: 'Combination skin products',
            sensitive: 'Sensitive skin products',
            hydrating: 'Hydration products',
            browse: 'Browse products',
        };

        setMessages((prev) => [...prev, {
            id: newId(), sender: 'user', type: 'text', text: labels[choice] || choice,
        }]);
        setConfirmLoading(true);

        try {
            const response = await fetch('/api/ai/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    orderSourceChoice: choice,
                    orderDraft,
                    history: chatHistory,
                    userId: user?.$id || user?.id || 'guest',
                    userName: user?.name || null,
                    userPrefs: user?.prefs || null,
                }),
            });
            const data = await response.json();
            handleApiResponse(data, labels[choice] || choice);
        } catch {
            setMessages(prev => [...prev, { id: newId(), text: 'Could not process your choice. Please try again.', sender: 'bot' }]);
        } finally {
            setConfirmLoading(false);
        }
    };

    const handleProductSelect = async (product) => {
        if (confirmLoading || loading) return;
        setMessages((prev) => [...prev, {
            id: newId(), sender: 'user', type: 'text', text: `I'll order ${product.name}`,
        }]);
        setConfirmLoading(true);

        try {
            const response = await fetch('/api/ai/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    selectProductId: product.id,
                    orderDraft,
                    history: chatHistory,
                    userId: user?.$id || user?.id || 'guest',
                    userName: user?.name || null,
                    userPrefs: user?.prefs || null,
                }),
            });
            const data = await response.json();
            handleApiResponse(data, `Selected ${product.name}`);
        } catch {
            setMessages(prev => [...prev, { id: newId(), text: 'Could not select that product. Please try again.', sender: 'bot' }]);
        } finally {
            setConfirmLoading(false);
        }
    };

    const handleApiResponse = (data, userText) => {
        if (data.orderDraft !== undefined) {
            setOrderDraft(data.orderDraft);
        }

        if (data.reply) {
            const cleanReply = String(data.reply)
                .replace(/<function=\w+\s*\{[\s\S]*?\}\s*<\/function>/gi, '')
                .replace(/<function=[^>\n]+>[\s\S]*?<\/function>/gi, '')
                .replace(/<\/?function[^>]*>/gi, '')
                .replace(/\b(searchProducts|addToCart|placeOrder)\s*[({][\s\S]*?[)}]/gi, '')
                .trim();
                
            const botMsg = {
                id: newId(),
                sender: 'bot',
                type: data.pendingConfirmation ? data.pendingConfirmation.type : 'text',
                text: cleanReply,
                pendingConfirmation: data.pendingConfirmation || null,
                productPicker: data.productPicker || null,
                orderProgress: data.orderProgress || null,
                orderSourceChoice: data.orderSourceChoice || null,
                confirmed: data.pendingConfirmation ? null : undefined,
                orderId: null,
            };
            setMessages(prev => [...prev, botMsg]);
            
            if (userText) {
                setChatHistory(data.updatedHistory || [...chatHistory, { role: 'user', parts: [{ text: userText }] }, { role: 'model', parts: [{ text: cleanReply }] }]);
            }
        }

        if (data.actions?.length) {
            for (const action of data.actions) {
                if (action.type === 'cart_updated' || action.type === 'order_placed') {
                    window.dispatchEvent(new Event('cart-updated'));
                }
            }
        }
    };

    const handleSend = async (txt = input) => {
        const text = (txt || '').trim();
        if (!text || loading || confirmLoading) return;

        const pendingMsg = [...messages].reverse().find(
            (m) => m.pendingConfirmation && m.confirmed === null
        );

        if (pendingMsg && YES_RE.test(text)) {
            setMessages((prev) => [...prev, { id: newId(), sender: 'user', type: 'text', text }]);
            setInput('');
            await handleConfirm(pendingMsg.id, buildConfirmAction(pendingMsg.pendingConfirmation));
            return;
        }

        if (pendingMsg && NO_RE.test(text)) {
            setMessages((prev) => [...prev, { id: newId(), sender: 'user', type: 'text', text }]);
            setInput('');
            handleCancelConfirm(pendingMsg.id);
            return;
        }

        const userMsg = { id: newId(), text, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        const newHistory = [...chatHistory, { role: 'user', parts: [{ text }] }];
        setChatHistory(newHistory);

        try {
            const response = await fetch('/api/ai/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: text,
                    history: chatHistory,
                    userId: user?.$id || user?.id || 'guest',
                    userName: user?.name || null,
                    userPrefs: user?.prefs || null,
                    orderDraft,
                })
            });

            const data = await response.json();
            handleApiResponse(data, text);
        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, { id: newId(), text: 'Network error. Could not reach the AI server.', sender: 'bot' }]);
        } finally {
            setLoading(false);
        }
    };

    const handleVoiceInterim = (text) => {
        setInput(text);
    };

    const handleVoiceInput = (transcript) => {
        setInput(transcript);
        setTimeout(() => inputRef.current?.focus(), 50);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') handleSend();
    };

    // We only render the chat window itself when open.
    // The trigger button is now external (Navbar).
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[9999] pointer-events-none flex items-end justify-end">
            {/* Backdrop for mobile to close on click outside, optional but good UX */}
            <div className="absolute inset-0 pointer-events-auto bg-black/20 backdrop-blur-[1px] md:hidden" onClick={handleClose} />

            {/* Chat Interface Popup */}
            <div
                className="pointer-events-auto w-full h-[85vh] md:w-[500px] md:h-[750px] md:max-h-[85vh] md:mr-8 md:mb-8 bg-white/95 md:bg-white/90 backdrop-blur-2xl md:backdrop-blur-3xl rounded-t-[2.5rem] md:rounded-[2.5rem] shadow-2xl border border-white/50 flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300 origin-bottom-right ring-1 ring-black/5"
                style={{
                    paddingBottom: 'safe-area-inset-bottom'
                }}
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-primary/10 via-pink-500/5 to-purple-500/10 px-6 py-4 md:py-6 flex items-center justify-between border-b border-primary/5 shrink-0">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-tr from-primary to-pink-500 p-[2px] shadow-sm">
                                <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                                    <Sparkles className="w-6 h-6 md:w-7 md:h-7 text-primary fill-primary/20" />
                                </div>
                            </div>
                            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></span>
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-800 text-lg md:text-xl leading-tight">SkinGlow AI</h3>
                            <div className="flex items-center gap-1.5 opacity-80">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary/60"></span>
                                <p className="text-slate-500 text-xs font-semibold tracking-wide uppercase">Esthetician</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Language Selector Pill */}
                        <div className="flex bg-white/80 backdrop-blur-md rounded-full border border-slate-200 p-0.5 shadow-sm mr-1">
                            <button
                                onClick={() => setVoiceLang('en-US')}
                                className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full transition-all ${voiceLang === 'en-US' ? 'bg-primary text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                            >
                                EN
                            </button>
                            <button
                                onClick={() => setVoiceLang('ur-PK')}
                                className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full transition-all ${voiceLang === 'ur-PK' ? 'bg-primary text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                            >
                                اردو
                            </button>
                        </div>
                        {speakingIndex !== null && (
                            <button
                                onClick={handleStopVoice}
                                className="w-10 h-10 flex items-center justify-center rounded-full bg-red-50 hover:bg-red-100 text-red-500 transition-colors"
                                title="Stop voice"
                            >
                                <VolumeX className="w-5 h-5" />
                            </button>
                        )}
                        <button
                            onClick={handleClose}
                            className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100/50 hover:bg-slate-200/50 transition-colors"
                        >
                        {/* Close Icon */}
                        <Minimize2 className="w-5 h-5 text-slate-600 block md:hidden" />
                        <X className="w-5 h-5 text-slate-600 hidden md:block" />
                        </button>
                    </div>
                </div>

                {/* Chat Area */}
                <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-50/50 flex flex-col gap-6 relative scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
                    <div className="text-center text-[10px] text-slate-400 my-2 font-bold uppercase tracking-widest opacity-60">Today</div>

                    {messages.map((msg, idx) => (
                        <div key={idx} className={`flex gap-3 max-w-[85%] ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'} group`}>
                            {msg.sender === 'bot' && (
                                <div className="w-8 h-8 rounded-full bg-white border border-primary/20 flex items-center justify-center flex-shrink-0 shadow-sm self-end mb-1">
                                    <Sparkles className="w-4 h-4 text-primary" />
                                </div>
                            )}

                            {(() => {
                                const isMsgUrdu = /[\u0600-\u06FF]/.test(msg.text);
                                return (
                                    <div className="flex flex-col gap-2 min-w-0 relative">
                                        <div className={`p-4 rounded-2xl shadow-sm text-sm leading-relaxed relative ${
                                            isMsgUrdu ? 'urdu-text' : ''
                                        } ${msg.sender === 'user'
                                            ? 'bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-br-none shadow-slate-900/10'
                                            : 'bg-white border border-primary/5 text-slate-700 rounded-bl-none shadow-sm prose prose-sm prose-slate max-w-none'
                                        }`}>
                                            <div className={isMsgUrdu ? 'urdu-text' : ''}>
                                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                    {msg.text}
                                                </ReactMarkdown>
                                            </div>
                                            {msg.sender === 'bot' && msg.type === 'text' && (
                                                <button
                                                    onClick={() => handleSpeak(msg.text, idx)}
                                                    className={`absolute -right-8 bottom-0 p-1.5 rounded-full transition-colors ${
                                                        speakingIndex === idx
                                                            ? 'bg-red-100 text-red-500 hover:bg-red-200 animate-pulse'
                                                            : 'bg-slate-100 text-slate-400 hover:text-slate-600'
                                                    }`}
                                                    title={speakingIndex === idx ? 'Stop voice' : 'Read aloud'}
                                                >
                                                    {speakingIndex === idx ? (
                                                        <VolumeX className="w-4 h-4" />
                                                    ) : (
                                                        <Volume2 className="w-4 h-4" />
                                                    )}
                                                </button>
                                            )}
                                        </div>

                                        {msg.orderSourceChoice && (
                                            <OrderSourceChoiceCard choice={msg.orderSourceChoice} loading={confirmLoading} onChoose={handleOrderSourceChoice} />
                                        )}

                                        {msg.productPicker?.products?.length > 0 && (
                                            <ProductPickerCard products={msg.productPicker.products} hint={msg.productPicker.hint} mode={msg.productPicker.mode || 'order'} loading={confirmLoading} onSelect={handleProductSelect} />
                                        )}

                                        {msg.orderProgress && (
                                            <OrderProgressCard progress={msg.orderProgress} />
                                        )}

                                        {msg.pendingConfirmation?.type === 'add_to_cart' && (
                                            <ProductConfirmCard product={msg.pendingConfirmation.product} confirmed={msg.confirmed ?? null} loading={confirmLoading} onConfirm={() => handleConfirm(msg.id, buildConfirmAction(msg.pendingConfirmation))} onCancel={() => handleCancelConfirm(msg.id)} />
                                        )}

                                        {msg.pendingConfirmation?.type === 'place_order' && (
                                            <OrderConfirmCard order={msg.pendingConfirmation} confirmed={msg.confirmed ?? null} loading={confirmLoading} orderId={msg.orderId} onConfirm={() => handleConfirm(msg.id, buildConfirmAction(msg.pendingConfirmation))} onCancel={() => handleCancelConfirm(msg.id)} />
                                        )}
                                    </div>
                                );
                            })()}
                        </div>
                    ))}

                    {loading && (
                        <div className="flex gap-3 max-w-[85%] mr-auto">
                            <div className="w-8 h-8 rounded-full bg-white border border-primary/20 flex items-center justify-center flex-shrink-0 shadow-sm self-end mb-1">
                                <Sparkles className="w-4 h-4 text-primary" />
                            </div>
                            <div className="bg-white border border-primary/5 px-4 py-3 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-1.5 min-h-[44px]">
                                <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce"></span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 md:p-5 bg-white/90 backdrop-blur-xl border-t border-slate-100 shrink-0 mb-safe">
                    {/* Suggested Prompts Carousel */}
                    <div className="flex gap-2 overflow-x-auto pb-4 pt-1 no-scrollbar mask-gradient-right">
                        {["🚚 Track my order", "🧴 Build a Routine", "💧 Best for Dry Skin"].map((prompt, i) => (
                            <button
                                key={i}
                                onClick={() => handleSend(prompt)}
                                className="whitespace-nowrap px-4 py-2 bg-slate-50 hover:bg-primary/5 border border-slate-200 hover:border-primary/30 text-slate-600 hover:text-primary text-xs font-bold rounded-full transition-all shadow-sm hover:shadow-md"
                            >
                                {prompt}
                            </button>
                        ))}
                    </div>

                    <div className="relative flex items-center gap-2">
                        <VoiceInterface
                            onResult={handleVoiceInput}
                            onInterim={handleVoiceInterim}
                            disabled={loading}
                            lang={voiceLang}
                        />
                        <input
                            ref={inputRef}
                            className="flex-1 bg-slate-50 border-0 text-slate-800 text-sm rounded-2xl px-5 py-4 focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all placeholder:text-slate-400 shadow-inner"
                            placeholder="Ask about routines, ingredients..."
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={handleKeyPress}
                            // Prevent zoom on iOS inputs
                            style={{ fontSize: '16px' }}
                        />
                        <button
                            onClick={() => handleSend()}
                            disabled={!input.trim()}
                            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-lg active:scale-95 ${input.trim()
                                ? 'bg-primary text-white hover:bg-primary/90 hover:scale-105'
                                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                }`}
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="flex justify-center mt-3 gap-2">
                        <div className="flex -space-x-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 ring-1 ring-white animate-pulse"></span>
                        </div>
                        <span className="text-[10px] uppercase font-bold text-slate-300 tracking-widest">Esthetician Online</span>
                    </div>
                </div>
            </div>
        </div>

    );
}



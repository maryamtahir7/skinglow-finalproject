import React, { useState, useRef, useEffect } from 'react';
import { Bot, User, Send, Sparkles, X, MessageCircle, ChevronDown, Minimize2, Check } from 'lucide-react';
import { Button } from "@/components/ui/button";

export default function FloatingAI() {
    const [isOpen, setIsOpen] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    const [messages, setMessages] = useState([
        {
            text: '✨ Hello! I’m your personal SkinGlow Esthetician. I can help you build a routine, track orders, or find the perfect ingredients for your skin type. How can I help you glow today?',
            sender: 'bot',
            type: 'text'
        }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
            // Small delay to ensure render before focus, especially on mobile
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [messages, isOpen]);

    const toggleChat = () => setIsOpen(!isOpen);

    const suggestedPrompts = [
        "🚚 Track my order",
        "🧴 Build a Routine",
        "❓ Return Policy",
        "💧 Best for Dry Skin",
        "☀️ Sunscreen Guide"
    ];

    const getAIResponse = async (message) => {
        const text = message.toLowerCase();

        // --- CORE WEBSITE INFO ---
        if (text.includes('track') || text.includes('order') || text.includes('shipping'))
            return '🚚 **Shipping & Tracking:**\nWe offer free express shipping on all orders over Rs. 2000! You can track your order in the "My Orders" section of your profile. Shipping usually takes 2-4 business days.';

        if (text.includes('return') || text.includes('refund') || text.includes('exchange'))
            return '🔄 **Returns made easy:**\nWe accept returns within 30 days of purchase if the product is unused. Just email support@skinglow.com with your order ID to start a return.';

        if (text.includes('contact') || text.includes('support') || text.includes('help'))
            return '📞 **We are here for you:**\nYou can reach our support team at support@skinglow.com or call us at +91-800-GLOW-NOW (Mon-Fri, 9am-6pm).';

        // --- SKINCARE KNOWLEDGE ---
        if (text.includes('acne') || text.includes('pimple') || text.includes('breakout'))
            return '✨ **For Acne:**\nLook for **Salicylic Acid** (BHA) to unclog pores and **Niacinamide** to reduce inflammation. \n\n👉 I recommend our **Clarifying Serum** and **Oil-Free Moisturizer**. Avoid heavy oils!';

        if (text.includes('dry') || text.includes('flakey') || text.includes('tight'))
            return '💧 **For Dry Skin:**\nHydration is key! You need **Hyaluronic Acid** to draw water in and **Ceramides** to lock it in. \n\n👉 Try our **Deep Hydration Cream** and **Gentle Milk Cleanser**.';

        if (text.includes('dull') || text.includes('bright') || text.includes('glow'))
            return '🌟 **Get that Glow:**\n**Vitamin C** is your best friend for brightness! Use it in the morning. Exfoliating 1-2 times a week with **AHA/BHA** also reveals fresh skin. \n\n👉 Check out our **Vitamin C Glow Serum**.';

        if (text.includes('routine') || text.includes('steps'))
            return '🧴 **Basic Routine Guide:**\n\n☀️ **AM:** Cleanser ➔ Vitamin C ➔ Moisturizer ➔ Sunscreen (SPF 50)\n🌙 **PM:** Cleanser ➔ Treatment (Retinol/Acne) ➔ Moisturizer\n\nConsistency is the secret to glowing skin!';

        if (text.includes('sunscreen') || text.includes('spf'))
            return '☀️ **Sunscreen is Non-Negotiable!**\nUV rays cause 90% of premature aging. Use at least SPF 30 every single day, inside or outside. Reapply every 2 hours if outdoors.';

        // --- FALLBACK ---
        const fallbackResponses = [
            '🤔 That’s a great question! I recommend checking our "Shop by Concern" filters to find exactly what you need.',
            '✨ Skincare is personal! Could you tell me a bit more about your skin type (Oily, Dry, Combination)?',
            '💖 I\'m your virtual esthetician! Ask me about specific ingredients like Retinol, Vitamin C, or Hyaluronic Acid.'
        ];
        return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
    };

    const handleSend = async (txt = input) => {
        if (!txt.trim()) return;

        const userMsg = { text: txt, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        // Simulate typing delay for "human" feel
        setTimeout(async () => {
            const botReply = await getAIResponse(txt);
            setMessages(prev => [...prev, { text: botReply, sender: 'bot' }]);
            setLoading(false);
        }, 1200);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') handleSend();
    };

    return (
        <>
            {/* Floating Toggle Button - Optimized for Mobile */}
            <button
                type="button"
                onClick={toggleChat}
                className={`fixed bottom-6 right-6 md:bottom-8 md:right-8 z-[60] flex items-center justify-center rounded-full shadow-2xl transition-all duration-500 hover:scale-110 active:scale-95 group
                ${isOpen
                        ? 'w-12 h-12 bg-white/80 backdrop-blur-md border border-slate-200 text-slate-600 rotate-90'
                        : 'w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-primary to-pink-600 text-white animate-bounce-slow shadow-primary/40'
                    }`}
            >
                {isOpen ? (
                    <X className="w-6 h-6" />
                ) : (
                    <>
                        {/* Ping Animation */}
                        <div className="absolute inset-0 rounded-full bg-white/30 animate-ping opacity-75"></div>
                        <Sparkles className="w-7 h-7 md:w-8 md:h-8 relative z-10" />

                        {/* Notification Dot */}
                        <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-red-500 border-2 border-white rounded-full"></span>
                    </>
                )}
            </button>

            {/* Chat Interface Popup - Full Screen on Mobile */}
            {isOpen && (
                <div
                    className="fixed bottom-0 right-0 md:bottom-28 md:right-8 z-[60] w-full h-[100dvh] md:w-[400px] md:h-[600px] md:max-h-[80vh] bg-white/95 md:bg-white/90 backdrop-blur-2xl md:backdrop-blur-xl md:rounded-[2.5rem] shadow-2xl border border-white/50 flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300 origin-bottom-right"
                    style={{
                        // Prevents iOS keyboard messing up layout
                        paddingBottom: 'safe-area-inset-bottom'
                    }}
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-primary/10 via-pink-500/5 to-purple-500/10 px-6 py-4 md:py-5 flex items-center justify-between border-b border-primary/5 shrink-0">
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-primary to-pink-500 p-[2px] shadow-sm">
                                    <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                                        <Sparkles className="w-6 h-6 text-primary fill-primary/20" />
                                    </div>
                                </div>
                                <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></span>
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-800 text-lg leading-tight">SkinGlow AI</h3>
                                <p className="text-slate-500 text-xs font-semibold tracking-wide uppercase">Esthetician</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1 md:hidden">
                            <button
                                onClick={toggleChat}
                                className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100/50 hover:bg-slate-200/50 transition-colors"
                            >
                                <ChevronDown className="w-6 h-6 text-slate-600" />
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

                                <div className={`p-4 rounded-2xl shadow-sm text-sm leading-relaxed whitespace-pre-line relative ${msg.sender === 'user'
                                    ? 'bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-br-none shadow-slate-900/10'
                                    : 'bg-white border border-primary/5 text-slate-700 rounded-bl-none shadow-sm'
                                    }`}>
                                    {msg.text}
                                </div>
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
                    <div className="p-4 bg-white/90 backdrop-blur-xl border-t border-slate-100 shrink-0 mb-safe">
                        {/* Suggested Prompts Carousel */}
                        <div className="flex gap-2 overflow-x-auto pb-4 pt-1 no-scrollbar mask-gradient-right">
                            {suggestedPrompts.map((prompt, i) => (
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
            )}
        </>
    );
}



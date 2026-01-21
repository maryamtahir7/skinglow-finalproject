import React, { useState, useRef, useEffect } from 'react';
import { Bot, User, Send, Sparkles, X, MessageCircle, ChevronDown, Minimize2, Check } from 'lucide-react';
import { Button } from "@/components/ui/button";

const FloatingAI = () => {
    const [isOpen, setIsOpen] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    const [messages, setMessages] = useState([
        {
            text: '✨ Hello! I’m your personal SkinGlow Esthetician. I can help you build a routine, find products, or answer skincare questions. How can I help you glow today?',
            sender: 'bot'
        }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [messages, isOpen]);

    const toggleChat = () => setIsOpen(!isOpen);

    const suggestedPrompts = [
        "🧴 Build a Morning Routine",
        "💧 Best moisturizer?",
        "☀️ Do I need sunscreen?",
        "✨ Treat acne marks?"
    ];

    const getAIResponse = async (message) => {
        const text = message.toLowerCase();

        // Skincare Responses (Same as AIChat Page)
        if (text.includes('hi') || text.includes('hello')) return '👋 Hi there! Ready to achieve your best skin? Ask me about products, ingredients, or routines!';
        if (text.includes('acne') || text.includes('pimple')) return '✨ For acne-prone skin, I recommend looking for products with Salicylic Acid or Niacinamide. Our "Clear Skin Serum" is a great choice!';
        if (text.includes('dry') || text.includes('flakey')) return '💧 Hydration is key! Look for Hyaluronic Acid and Ceramides. Our "Deep Hydration Moisturizer" locks in moisture for 24 hours.';
        if (text.includes('routine')) return '🧴 A basic routine order is: Cleanser ➝ Toner ➝ Serum ➝ Moisturizer ➝ Sunscreen (AM). Consistency is the secret!';
        if (text.includes('glow')) return '✨ To get that glow, try Vitamin C in the morning! It brightens skin and protects against pollution.';
        if (text.includes('sunscreen')) return '☀️ Yes! Sunscreen is the most important step. Wear SPF 30+ every day, even when it\'s cloudy.';

        const fallbackResponses = [
            '🤔 That’s a great question! While I’m an AI, I suggest checking our "Skin Concern" filters to find exactly what you need.',
            '✨ I’d love to help with that. Could you tell me a bit more about your skin type (Oily, Dry, Combination)?',
            '💖 Skincare is a journey! If you are looking for specific ingredients, let me know.'
        ];
        return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
    };

    const handleSend = async (txt = input) => {
        if (!txt.trim()) return;

        const userMsg = { text: txt, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        // Simulate typing delay
        setTimeout(async () => {
            const botReply = await getAIResponse(txt);
            setMessages(prev => [...prev, { text: botReply, sender: 'bot' }]);
            setLoading(false);
        }, 1500);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') handleSend();
    };

    return (
        <>
            {/* Floating Toggle Button */}
            <button
                type="button"
                onClick={toggleChat}
                className={`fixed bottom-6 right-6 z-[60] flex items-center justify-center rounded-full shadow-2xl transition-all duration-500 hover:scale-105 active:scale-95 group
                ${isOpen
                        ? 'w-12 h-12 bg-white/80 backdrop-blur-md border border-white/20 text-slate-600 rotate-90'
                        : 'w-16 h-16 bg-gradient-to-br from-primary to-pink-600 text-white animate-bounce-slow'
                    }`}
            >
                {isOpen ? (
                    <X className="w-6 h-6" />
                ) : (
                    <>
                        <div className="absolute inset-0 rounded-full bg-white/20 animate-pulse"></div>
                        <Sparkles className="w-8 h-8 relative z-10" />

                        {/* Notification Dot */}
                        <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 border-2 border-white rounded-full"></span>
                    </>
                )}
            </button>

            {/* Chat Interface Popup */}
            {isOpen && (
                <div
                    className="fixed bottom-0 right-0 md:bottom-24 md:right-8 z-[60] w-full h-[100dvh] md:w-[400px] md:h-[600px] md:max-h-[80vh] bg-white/95 md:bg-white/90 backdrop-blur-xl md:rounded-[2rem] rounded-none shadow-2xl border border-white/50 flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300 origin-bottom-right"
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-primary/10 to-pink-500/10 px-6 py-5 flex items-center justify-between border-b border-primary/5">
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-primary to-pink-500 p-[2px]">
                                    <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                                        <Sparkles className="w-6 h-6 text-primary" />
                                    </div>
                                </div>
                                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></span>
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-800 text-lg">SkinGlow AI</h3>
                                <p className="text-slate-500 text-xs font-medium">Always here to glow ✨</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1">
                            <button
                                onClick={toggleChat}
                                className="p-2 hover:bg-black/5 rounded-full transition-colors"
                            >
                                <Minimize2 className="w-5 h-5 text-slate-400" />
                            </button>
                        </div>
                    </div>

                    {/* Chat Area */}
                    <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50 flex flex-col gap-6 relative scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
                        <div className="text-center text-xs text-slate-400 my-2 font-medium uppercase tracking-widest">Today</div>

                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex gap-3 max-w-[85%] ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'} group`}>
                                {msg.sender === 'bot' && (
                                    <div className="w-8 h-8 rounded-full bg-white border border-primary/20 flex items-center justify-center flex-shrink-0 shadow-sm self-end mb-1">
                                        <Sparkles className="w-4 h-4 text-primary" />
                                    </div>
                                )}

                                <div className={`p-4 rounded-2xl shadow-sm text-sm leading-relaxed relative ${msg.sender === 'user'
                                    ? 'bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-br-none'
                                    : 'bg-white border border-primary/5 text-slate-700 rounded-bl-none'
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
                    <div className="p-4 bg-white/80 backdrop-blur-md border-t border-slate-100">
                        {/* Suggested Prompts Carousel */}
                        <div className="flex gap-2 overflow-x-auto pb-4 pt-1 no-scrollbar mask-gradient-right">
                            {suggestedPrompts.map((prompt, i) => (
                                <button
                                    key={i}
                                    onClick={() => handleSend(prompt)}
                                    className="whitespace-nowrap px-4 py-2 bg-slate-50 hover:bg-primary/5 border border-slate-200 hover:border-primary/30 text-slate-600 hover:text-primary text-xs font-semibold rounded-full transition-all shadow-sm hover:shadow-md"
                                >
                                    {prompt}
                                </button>
                            ))}
                        </div>

                        <div className="relative flex items-center gap-2">
                            <input
                                ref={inputRef}
                                className="flex-1 bg-slate-50 border-0 text-slate-800 text-sm rounded-2xl px-5 py-4 focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all placeholder:text-slate-400 shadow-inner"
                                placeholder="Type a message..."
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                onKeyDown={handleKeyPress}
                            />
                            <button
                                onClick={() => handleSend()}
                                disabled={!input.trim()}
                                className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-lg ${input.trim()
                                    ? 'bg-primary text-white hover:bg-primary/90 hover:scale-105 hover:rotate-6'
                                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                    }`}
                            >
                                <Send className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="flex justify-center mt-3 gap-2">
                            <div className="flex -space-x-1">
                                <span className="w-2 h-2 rounded-full bg-green-500 ring-1 ring-white"></span>
                            </div>
                            <span className="text-[10px] uppercase font-bold text-slate-300 tracking-widest">Online Now</span>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default FloatingAI;

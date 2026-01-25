import React, { useState, useRef, useEffect } from 'react';
import { Bot, User, Send, Sparkles, X, MessageCircle, ChevronDown, Minimize2, Check } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { getProducts } from "../backend/database";
import { useNavigate } from 'react-router-dom';

export default function FloatingAI({ isOpen: externalIsOpen, onClose }) {
    // If no external props, we can fallback to internal state (for pages that use it standalone), but we prefer external.
    const [internalIsOpen, setInternalIsOpen] = useState(false);

    const isControlled = externalIsOpen !== undefined;
    const isOpen = isControlled ? externalIsOpen : internalIsOpen;
    const setIsOpen = isControlled ? (val) => val ? null : onClose?.() : setInternalIsOpen;

    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    const navigate = useNavigate();

    const [messages, setMessages] = useState([
        {
            text: '✨ Hello! I’m your personal SkinGlow Esthetician. I can help you build a routine, track orders, or find the perfect ingredients for your skin type. How can I help you glow today?',
            sender: 'bot',
            type: 'text'
        }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState([]);

    // Fetch products for smart recommendations
    useEffect(() => {
        async function loadProducts() {
            try {
                const res = await getProducts();
                if (res.documents) setProducts(res.documents);
            } catch (err) {
                console.error("AI failed to load products", err);
            }
        }
        loadProducts();
    }, []);

    useEffect(() => {
        if (isOpen) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
            // Small delay to ensure render before focus, especially on mobile
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [messages, isOpen]);

    const toggleChat = () => setIsOpen(!isOpen);

    const handleClose = () => {
        if (onClose) onClose();
        else setIsOpen(false);
    };

    const suggestedPrompts = [
        "🚚 Track my order",
        "🧴 Build a Routine",
        "❓ Return Policy",
        "💧 Best for Dry Skin",
        "☀️ Sunscreen Guide"
    ];

    const findProducts = (keyword) => {
        return products.filter(p => {
            const searchStr = `${p.name} ${p.description} ${typeof p.category === 'string' ? p.category : p.category?.name}`.toLowerCase();
            return searchStr.includes(keyword.toLowerCase());
        }).slice(0, 2); // Top 2
    };

    const getAIResponse = async (message) => {
        const text = message.toLowerCase();

        // 1. GREETINGS & SMALL TALK
        if (text.match(/^(hi|hello|hey|yo|greetings)/))
            return "👋 **Hello gorgeous!**\nI'm so happy to see you. I can help you build a routine, explain ingredients, or find products. What's on your mind?";

        if (text.includes('thank'))
            return "💖 **You are so welcome!**\nYour glow is my priority. Let me know if you need anything else!";

        if (text.includes('bye') || text.includes('goodbye'))
            return "✨ **Glow on!**\nDon't forget your SPF. See you soon!";

        // 2. CORE WEBSITE INFO
        if (text.includes('track') || text.includes('order') || text.includes('shipping'))
            return '🚚 **Shipping & Tracking:**\nWe offer **Free Express Shipping** on all orders over Rs. 2000! \n\n• **Standard:** 3-5 Business Days\n• **Express:** 1-2 Business Days\n\nYou can track your order in the "My Orders" section of your profile.';

        if (text.includes('return') || text.includes('refund') || text.includes('exchange'))
            return '🔄 **Hassle-Free Returns:**\nWe want you to love your skin! We accept returns within **30 days** of purchase if the product is unused. \n\n📧 Email support@skinglow.com with your order ID to start.';

        if (text.includes('contact') || text.includes('support') || text.includes('help'))
            return '📞 **We are here for you:**\nOur skincare experts are available Mon-Fri, 9am-6pm.\n\n• **Email:** support@skinglow.com\n• **Phone:** +91-800-GLOW-NOW';

        // 3. INGREDIENT KNOWLEDGE BASE
        if (text.includes('retinol')) {
            const matches = findProducts('retinol');
            return `🧬 **Ingredient Spotlight: Retinol**\nThe gold standard for anti-aging! It speeds up cell turnover, reduces fine lines, and smooths texture.\n\n⚠️ *Use only at night and always wear SPF the next day.*${matches.length ? `\n\n👉 **Try:** ${matches.map(p => `*${p.name}*`).join(", ")}` : ''}`;
        }
        if (text.includes('vitamin c')) {
            const matches = findProducts('vitamin c') || findProducts('bright');
            return `🍊 **Ingredient Spotlight: Vitamin C**\nA powerful antioxidant that brightens dull skin, fades dark spots, and protects against pollution.\n\n☀️ *Best used in the morning under sunscreen.*${matches.length ? `\n\n👉 **Try:** ${matches.map(p => `*${p.name}*`).join(", ")}` : ''}`;
        }
        if (text.includes('hyaluronic')) {
            const matches = findProducts('hyaluronic') || findProducts('hydrat');
            return `💧 **Ingredient Spotlight: Hyaluronic Acid**\nA moisture magnet! It holds 1000x its weight in water to plump and hydrate thirsty skin instantly.\n\n💧 *Apply on damp skin for best results.*${matches.length ? `\n\n👉 **Try:** ${matches.map(p => `*${p.name}*`).join(", ")}` : ''}`;
        }
        if (text.includes('niacinamide')) {
            const matches = findProducts('niacinamide') || findProducts('pore');
            return `🛡️ **Ingredient Spotlight: Niacinamide**\nThe multitasker! It strengthens the skin barrier, controls oil, and reduces redness/pores.\n\n✅ *Great for all skin types.*${matches.length ? `\n\n👉 **Try:** ${matches.map(p => `*${p.name}*`).join(", ")}` : ''}`;
        }
        if (text.includes('salicylic') || text.includes('bha')) {
            const matches = findProducts('salicylic') || findProducts('acne');
            return `🍃 **Ingredient Spotlight: Salicylic Acid (BHA)**\nOil-soluble exfoliant that dives deep into pores to clear breakouts and blackheads.\n\n⚠️ *Perfect for oily/acne-prone skin.*${matches.length ? `\n\n👉 **Try:** ${matches.map(p => `*${p.name}*`).join(", ")}` : ''}`;
        }

        // 4. ROUTINE BUILDER
        if (text.includes('oily') && (text.includes('routine') || text.includes('suggest'))) {
            return "🧴 **Routine for Oily Skin:**\n\n☀️ **AM:**\n1. Gel Cleanser\n2. Niacinamide Serum (Control oil)\n3. Lightweight Gel Moisturizer\n4. Matte Sunscreen\n\n🌙 **PM:**\n1. Salicylic Acid Cleanser\n2. BHA Exfoliant (2-3x week)\n3. Oil-Free Moisturizer";
        }
        if (text.includes('dry') && (text.includes('routine') || text.includes('suggest'))) {
            return "🧴 **Routine for Dry Skin:**\n\n☀️ **AM:**\n1. Cream Cleanser (or just water)\n2. Vitamin C Serum\n3. Hyaluronic Acid\n4. Rich Cream + SPF\n\n🌙 **PM:**\n1. Oil Cleanser\n2. Hydrating Toner\n3. Facial Oil or Thick Cream";
        }
        if (text.includes('sensitive') && (text.includes('routine') || text.includes('suggest'))) {
            return "🧴 **Routine for Sensitive Skin:**\n\n☀️ **AM:**\n1. Gentle Milk Cleanser\n2. Soothing Mist\n3. Barrier Repair Cream\n4. Mineral SPF\n\n🌙 **PM:**\n1. Gentle Cleanser\n2. Centella/Cica Serum\n3. Ceramide Moisturizer\n\n🚫 *Avoid fragrance and alcohol!*";
        }


        // 5. DYNAMIC CONCERN MATCHING
        const concernMap = {
            'acne': ['acne', 'pimple', 'breakout', 'clogged'],
            'aging': ['aging', 'wrinkle', 'lines', 'sagging'],
            'dryness': ['dry', 'flakey', 'tight', 'dehydrated'],
            'dullness': ['dull', 'bright', 'glow', 'radiance', 'dark spot'],
            'sensitivity': ['sensitive', 'redness', 'irritation', 'stinging']
        };

        for (const [concern, keywords] of Object.entries(concernMap)) {
            if (keywords.some(k => text.includes(k))) {
                const matches = findProducts(concern) || findProducts(keywords[0]);
                let advice = "";

                switch (concern) {
                    case 'acne': advice = "Focus on **Salicylic Acid** and **Niacinamide**. Keep hydrated (don't skip moisturizer!) to prevent excess oil production."; break;
                    case 'aging': advice = "Incorporating **Retinol** at night and **Vitamin C** in the morning is the dynamic duo for youthful skin."; break;
                    case 'dryness': advice = "Layer your hydration! Start with **Hyaluronic Acid** on damp skin and seal it in with a **Ceramide** rich cream."; break;
                    case 'dullness': advice = "**Exfoliation** is key! Use an **AHA** (like Glycolic Acid) to sweep away dead cells and reveal fresh skin."; break;
                    case 'sensitivity': advice = "Less is more. focus on **Barrier Repair** ingredients like **Centella** and **Oats**. Avoid harsh scrubs."; break;
                }

                return `✨ **Let's tackle ${concern}!**\n${advice}\n\n👉 **Recommended for you:**\n${matches.length ? matches.map(p => `• [${p.name}](/products/${p.$id})`).join("\n") : "Check our 'Shop by Concern' section for a full list!"}`;
            }
        }

        // 6. SMART SEARCH (If no specific concern matched but user mentions "serum", "cleaner")
        const productTypes = ['serum', 'cleanser', 'moisturizer', 'sunscreen', 'oil', 'toner', 'mask'];
        const foundType = productTypes.find(t => text.includes(t));
        if (foundType) {
            const matches = findProducts(foundType);
            if (matches.length > 0) {
                return `🔎 **I found these ${foundType}s for you:**\n\n${matches.map(p => `• *${p.name}* (Rs. ${p.price})`).join("\n")}`;
            }
        }

        // --- FALLBACK ---
        const fallbackResponses = [
            "🤔 **I'm listening...**\nCould you tell me a bit more about your skin type? (e.g., Oily, Dry, Sensitive)",
            "✨ **Skincare is a journey!**\nI'm not exactly sure about that, but I can help you build a routine or find specific ingredients like Retinol or Vitamin C.",
            "💖 **Good question.**\nI'm still learning everything about beauty! Try asking me about 'Acne', 'Dryness', or to 'Suggest a routine'."
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

    // We only render the chat window itself when open.
    // The trigger button is now external (Navbar).
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[9999] pointer-events-none flex items-end justify-end">
            {/* Backdrop for mobile to close on click outside, optional but good UX */}
            <div className="absolute inset-0 pointer-events-auto bg-black/20 backdrop-blur-[1px] md:hidden" onClick={handleClose} />

            {/* Chat Interface Popup */}
            <div
                className="pointer-events-auto w-full h-[85vh] md:w-[450px] md:h-[600px] md:max-h-[80vh] md:mr-6 md:mb-6 bg-white/95 md:bg-white/90 backdrop-blur-2xl md:backdrop-blur-3xl rounded-t-[2.5rem] md:rounded-[2.5rem] shadow-2xl border border-white/50 flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300 origin-bottom-right ring-1 ring-black/5"
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

                    <button
                        onClick={handleClose}
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100/50 hover:bg-slate-200/50 transition-colors"
                    >
                        {/* Close Icon */}
                        <Minimize2 className="w-5 h-5 text-slate-600 block md:hidden" />
                        <X className="w-5 h-5 text-slate-600 hidden md:block" />
                    </button>
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
                <div className="p-4 md:p-5 bg-white/90 backdrop-blur-xl border-t border-slate-100 shrink-0 mb-safe">
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
        </div>

    );
}



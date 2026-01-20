// src/pages/AIChat/index.jsx
import React, { useState, useRef, useEffect } from 'react';
import './styles.css';
import { Bot, User, Send, Sparkles, Star, Heart, Smile, CheckCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";

const AIChat = () => {
  const messagesEndRef = useRef(null);

  const [messages, setMessages] = useState([
    {
      text: '✨ Hello! I’m your personal SkinGlow Esthetician. I can help you build a routine, find the perfect products for your skin type, or answer any skincare questions. How can I help you glow today?',
      sender: 'bot'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const suggestedPrompts = [
    "🧴 Build a Morning Routine",
    "💧 Best moisturizer for dry skin?",
    "☀️ Do I need sunscreen indoors?",
    "✨ How to treat acne marks?"
  ];

  const getAIResponse = async (message) => {
    const text = message.toLowerCase();

    // Skincare Responses
    if (text.includes('hi') || text.includes('hello')) {
      return '👋 Hi there! Ready to achieve your best skin? Ask me about products, ingredients, or routines!';
    }
    if (text.includes('acne') || text.includes('pimple') || text.includes('breakout')) {
      return '✨ For acne-prone skin, I recommend looking for products with Salicylic Acid or Niacinamide. Our "Clear Skin Serum" is a great choice! Would you like to see it?';
    }
    if (text.includes('dry') || text.includes('flakey')) {
      return '💧 Hydration is key! Look for Hyaluronic Acid and Ceramides. Our "Deep Hydration Moisturizer" locks in moisture for 24 hours. Try layering it over a damp face!';
    }
    if (text.includes('routine') || text.includes('order')) {
      return '🧴 A basic routine order is: Cleanser ➝ Toner ➝ Serum ➝ Moisturizer ➝ Sunscreen (AM). Consistency is the secret to glowing skin!';
    }
    if (text.includes('glow') || text.includes('dull')) {
      return '✨ To get that glow, try Vitamin C in the morning! It brightens skin and protects against pollution. Our "Radiance Vitamin C Serum" is a customer favorite.';
    }
    if (text.includes('sunscreen') || text.includes('spf')) {
      return '☀️ Yes! Sunscreen is the most important step. Wear SPF 30+ every day, even when it\'s cloudy, to prevent premature aging and dark spots.';
    }
    if (text.includes('delivery') || text.includes('shipping')) {
      return '🚚 We offer free shipping on orders over $50! Most orders arrive within 2-3 business days.';
    }

    const fallbackResponses = [
      '🤔 That’s a great question! While I’m an AI, I suggest checking our "Skin Concern" filters to find exactly what you need.',
      '✨ I’d love to help with that. Could you tell me a bit more about your skin type (Oily, Dry, Combination)?',
      '💖 Skincare is a journey! If you are looking for specific ingredients, let me know.'
    ];
    return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
  };

  const handleSend = async (txt = input) => {
    if (!txt.trim()) return;

    const userMessage = { text: txt, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    // Simulate network delay for realism
    setTimeout(async () => {
      const botReply = await getAIResponse(txt);
      setMessages(prev => [...prev, { text: botReply, sender: 'bot' }]);
      setLoading(false);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] bg-background py-6 px-4 font-sans">
      <div className="w-full max-w-4xl bg-card rounded-3xl shadow-2xl overflow-hidden border border-border flex flex-col h-[700px]">

        {/* Header */}
        <div className="bg-primary/10 p-6 flex items-center justify-between border-b border-primary/10">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-rose-200 to-indigo-200 flex items-center justify-center shadow-inner">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">SkinGlow AI</h1>
              <p className="text-muted-foreground text-sm flex items-center gap-1">
                Virtual Esthetician
              </p>
            </div>
          </div>
          <div className="hidden sm:flex gap-2">
            <span className="text-xs font-medium px-3 py-1 bg-white/50 rounded-full text-foreground border border-black/5">24/7 Support</span>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-secondary/20 flex flex-col gap-6 relative">
          <div className="absolute inset-0 opacity-5 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

          {messages.map((msg, idx) => (
            <div key={idx} className={`flex gap-4 relative z-10 ${msg.sender === 'user' ? 'flex-row-reverse' : ''} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${msg.sender === 'user' ? 'bg-primary text-secondary' : 'bg-white text-primary border border-primary/20'}`}>
                {msg.sender === 'user' ? <User className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
              </div>

              <div className={`max-w-[75%] px-6 py-4 rounded-3xl text-sm leading-relaxed shadow-sm ${msg.sender === 'user'
                ? 'bg-primary text-primary-foreground rounded-tr-none'
                : 'bg-white text-foreground border border-border rounded-tl-none'
                }`}>
                {msg.text}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex gap-4 relative z-10">
              <div className="w-10 h-10 rounded-full bg-white border border-primary/20 flex items-center justify-center flex-shrink-0 shadow-sm">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <div className="bg-white border border-border px-6 py-4 rounded-3xl rounded-tl-none text-muted-foreground text-sm flex items-center gap-2 shadow-sm">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce"></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-6 bg-card border-t border-border">
          {/* Suggested Prompts */}
          <div className="flex gap-3 overflow-x-auto pb-4 custom-scrollbar mb-2 no-scrollbar">
            {suggestedPrompts.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSend(prompt)}
                className="whitespace-nowrap px-4 py-2 bg-secondary/50 hover:bg-primary/10 border border-border hover:border-primary/30 text-muted-foreground hover:text-primary text-xs font-semibold rounded-full transition-all flex items-center gap-2"
              >
                {prompt}
              </button>
            ))}
          </div>

          <div className="flex gap-3 relative">
            <input
              className="flex-1 bg-secondary/20 border border-border text-foreground text-sm rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary block w-full p-4 pl-6 outline-none transition-all placeholder:text-muted-foreground"
              placeholder="Ask for a routine recommendation..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
            />
            <Button
              onClick={() => handleSend()}
              disabled={!input.trim()}
              className="bg-primary hover:bg-primary/90 h-[54px] w-[54px] rounded-2xl shadow-lg shadow-primary/20 p-0 flex items-center justify-center transition-all hover:scale-105 active:scale-95"
            >
              <Send className="w-5 h-5 text-primary-foreground ml-0.5" />
            </Button>
          </div>
          <p className="text-center text-[10px] text-muted-foreground mt-4 flex items-center justify-center gap-1">
            <Sparkles className="w-3 h-3" /> Expert advice powered by SkinGlow Intelligence
          </p>
        </div>
      </div>
    </div>
  );
};

export default AIChat;

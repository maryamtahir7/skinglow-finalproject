// src/pages/AIChat/index.jsx
import React, { useState, useRef, useEffect } from 'react';
import './styles.css';
import { User, Send, Sparkles } from 'lucide-react';
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-background py-10 px-4 font-sans">
      <div className="relative w-full max-w-4xl rounded-3xl shadow-xl border border-border bg-card flex flex-col h-[700px] overflow-hidden">

        {/* Header */}
        <div className="relative z-10 bg-primary/5 px-6 py-5 flex items-center justify-between border-b border-primary/10">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shadow-sm">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-card rounded-full"></span>
            </div>
            <div>
              <h1 className="text-xl font-semibold text-foreground tracking-tight">SkinGlow AI</h1>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" /> Virtual esthetician for your routine
              </p>
            </div>
          </div>
          <div className="hidden sm:flex gap-2 items-center">
            <span className="text-[10px] font-medium px-3 py-1.5 bg-background rounded-full text-foreground border border-border">
              24/7 glow guidance
            </span>
          </div>
        </div>

        {/* Chat Area */}
        <div className="relative z-10 flex-1 overflow-y-auto px-4 sm:px-6 py-5 flex flex-col gap-5 bg-background">

          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex gap-3 sm:gap-4 relative z-10 ${
                msg.sender === 'user' ? 'flex-row-reverse' : ''
              } animate-in fade-in slide-in-from-bottom-2 duration-300`}
            >
              <div
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${
                  msg.sender === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-primary border border-border'
                }`}
              >
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-[78%] sm:max-w-[75%] px-4 sm:px-5 py-3.5 rounded-3xl text-[13px] sm:text-sm leading-relaxed shadow-sm ${
                  msg.sender === 'user'
                    ? 'bg-primary text-primary-foreground rounded-tr-sm'
                    : 'bg-muted text-foreground border border-border rounded-tl-sm'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex gap-3 sm:gap-4 relative z-10">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-secondary border border-border flex items-center justify-center flex-shrink-0 shadow-sm">
                <Sparkles className="w-4 h-4 text-primary" />
              </div>
              <div className="bg-muted border border-border px-4 sm:px-5 py-3.5 rounded-3xl rounded-tl-sm text-muted-foreground text-[13px] sm:text-sm flex items-center gap-2 shadow-sm">
                <div className="flex gap-1.5">
                  <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="relative z-10 px-4 sm:px-6 pb-5 pt-4 bg-card border-t border-border">
          {/* Suggested Prompts */}
          <div className="flex gap-2.5 overflow-x-auto pb-3 custom-scrollbar mb-1.5 no-scrollbar">
            {suggestedPrompts.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSend(prompt)}
                className="whitespace-nowrap px-3.5 py-2 bg-secondary hover:bg-secondary/80 border border-border text-[11px] font-semibold rounded-full transition-all flex items-center gap-2 text-foreground"
              >
                {prompt}
              </button>
            ))}
          </div>

          <div className="flex gap-3 relative mt-1">
            <input
              className="flex-1 bg-background border border-border text-foreground text-sm rounded-2xl focus:ring-2 focus:ring-primary/30 focus:border-primary block w-full py-3.5 px-4 sm:px-5 outline-none transition-all placeholder:text-muted-foreground"
              placeholder="Ask for a glow routine, ingredient advice, or product match..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
            />
            <Button
              onClick={() => handleSend()}
              disabled={!input.trim()}
              className="h-[52px] w-[52px] rounded-2xl p-0 flex items-center justify-center transition-all hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5 text-primary-foreground ml-0.5" />
            </Button>
          </div>
          <p className="text-center text-[10px] text-muted-foreground mt-3 flex items-center justify-center gap-1.5">
            <Sparkles className="w-3 h-3 text-primary" /> Expert guidance powered by SkinGlow Intelligence
          </p>
        </div>
      </div>
    </div>
  );
};

export default AIChat;

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  User, Send, Sparkles, Volume2, VolumeX, ShoppingCart,
  Leaf, Droplets, Sun, LogIn, Mic, ChevronLeft
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import VoiceInterface, { speakText, stopSpeaking } from '@/components/VoiceInterface';
import { useUser } from '@/context/UserContext';
import { useToast } from '@/context/ToastContext';
import { getCart } from '@/backend/database';
import Navbar from '@/components/navbar';
import ProductConfirmCard from './components/ProductConfirmCard';
import OrderConfirmCard from './components/OrderConfirmCard';
import ProductPickerCard from './components/ProductPickerCard';
import OrderProgressCard from './components/OrderProgressCard';
import OrderSourceChoiceCard from './components/OrderSourceChoiceCard';
import './styles.css';

let msgIdCounter = 0;
const newId = () => `msg-${++msgIdCounter}-${Date.now()}`;

function cleanBotText(text) {
  if (!text) return '';
  return String(text)
    .replace(/<function=\w+\s*\{[\s\S]*?\}\s*<\/function>/gi, '')
    .replace(/<function=[^>\n]+>[\s\S]*?<\/function>/gi, '')
    .replace(/<\/?function[^>]*>/gi, '')
    .replace(/<\/?tool_call>/gi, '')
    .replace(/\b(searchProducts|addToCart|placeOrder|getOrderStatus|updateSkinProfile)\s*[({][\s\S]*?[)}]/gi, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

const WELCOME = {
  id: 'welcome',
  sender: 'bot',
  type: 'text',
  text: '✨ Hello! I\'m your personal SkinGlow Esthetician. Ask me about routines, ingredients, products — or say "add [product] to cart" and I\'ll show it for your confirmation before adding. How can I help you glow today?',
};

const SIDEBAR_PROMPTS = [
  { icon: Droplets, label: 'Best moisturizer for dry skin?', text: 'Best moisturizer for dry skin?' },
  { icon: Sun, label: 'Morning routine with SPF', text: 'Build a morning routine with sunscreen' },
  { icon: Leaf, label: 'Treat acne marks naturally', text: 'How to treat acne marks?' },
  { icon: ShoppingCart, label: 'Add cleanser to cart', text: 'Hydra Balance Cleanser cart mein daalo' },
];

const YES_RE = /^(yes|yep|yeah|haan|han|ji|ok|okay|confirm|bilkul|sure|kar do|kr do)$/i;
const NO_RE = /^(no|nope|cancel|nahi|nah|mat)$/i;

const QUICK_PROMPTS = [
  { label: '📦 Want to order', text: 'I want to order' },
  { label: '🧴 Build morning routine', text: 'Build a morning skincare routine' },
  { label: '💧 Dry skin help', text: 'Best moisturizer for dry skin?' },
  { label: '🛒 Add to cart', text: 'Hydra Balance Cleanser cart mein daalo' },
];

export default function AIChat() {
  const navigate = useNavigate();
  const { user } = useUser();
  const { showToast } = useToast();
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const [messages, setMessages] = useState([WELCOME]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [speakingId, setSpeakingId] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [cartPulse, setCartPulse] = useState(false);
  const [orderDraft, setOrderDraft] = useState(null);
  const [voiceAgentOn, setVoiceAgentOn] = useState(false);
  const [voiceSpeaking, setVoiceSpeaking] = useState(false);
  const voiceAgentOnRef = useRef(false);
  const handleSendRef = useRef(null);

  const userId = user?.$id || user?.id || 'guest';
  const firstName = user?.name?.trim().split(/\s+/)[0];

  const refreshCartCount = useCallback(async (pulse = false) => {
    if (!userId || userId === 'guest') {
      setCartCount(0);
      return;
    }
    try {
      const cart = await getCart(userId);
      setCartCount(cart.documents?.length || 0);
      if (pulse) {
        setCartPulse(true);
        setTimeout(() => setCartPulse(false), 700);
      }
    } catch {
      // ignore
    }
  }, [userId]);

  useEffect(() => {
    refreshCartCount();
    const onCartUpdate = () => refreshCartCount(true);
    window.addEventListener('cart-updated', onCartUpdate);
    return () => window.removeEventListener('cart-updated', onCartUpdate);
  }, [refreshCartCount]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const dispatchCartUpdate = () => {
    window.dispatchEvent(new Event('cart-updated'));
    refreshCartCount(true);
  };

  useEffect(() => {
    voiceAgentOnRef.current = voiceAgentOn;
    if (!voiceAgentOn) {
      stopSpeaking();
      setVoiceSpeaking(false);
      setSpeakingId(null);
    }
  }, [voiceAgentOn]);

  const speakBotReply = useCallback((text) => {
    if (!voiceAgentOnRef.current || !text) return;
    stopSpeaking();
    speakText(text, 'en-US', {
      onStart: () => {
        setVoiceSpeaking(true);
        setSpeakingId('voice-agent');
      },
      onEnd: () => {
        setVoiceSpeaking(false);
        setSpeakingId(null);
      },
    });
  }, []);

  const appendBotMessage = (text, extra = {}) => {
    const clean = cleanBotText(text);
    setMessages((prev) => [...prev, { id: newId(), sender: 'bot', type: 'text', text: clean, ...extra }]);
    if (voiceAgentOnRef.current) {
      speakBotReply(clean);
    }
  };

  const handleApiResponse = (data, userText) => {
    if (data.orderDraft !== undefined) {
      setOrderDraft(data.orderDraft);
    }

    if (data.reply) {
      const cleanReply = cleanBotText(data.reply);
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
      setMessages((prev) => [...prev, botMsg]);
      setChatHistory(data.updatedHistory || [
        ...chatHistory,
        { role: 'user', parts: [{ text: userText }] },
        { role: 'model', parts: [{ text: cleanReply }] },
      ]);
      if (voiceAgentOnRef.current) {
        speakBotReply(cleanReply);
      }
    }

    if (data.actions?.length) {
      for (const action of data.actions) {
        if (action.type === 'login_required') {
          showToast('Please log in to shop', 'info');
        }
        if (action.type === 'cart_updated' || action.type === 'order_placed') {
          dispatchCartUpdate();
          showToast(
            action.type === 'order_placed' ? 'Order placed successfully!' : 'Added to cart!',
            action.type === 'order_placed' ? 'success' : 'cart'
          );
        }
      }
    }
  };

  const handleSend = async (txt = input) => {
    const text = (txt || '').trim();
    if (!text || loading || confirmLoading) return;

    stopSpeaking();
    setVoiceSpeaking(false);

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

    setMessages((prev) => [...prev, { id: newId(), sender: 'user', type: 'text', text }]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: chatHistory,
          userId,
          userName: user?.name || null,
          userPrefs: user?.prefs || null,
          orderDraft,
        }),
      });

      const data = await response.json();
      if (data.reply) {
        handleApiResponse(data, text);
      } else {
        appendBotMessage('Sorry, I encountered an error. Please try again.');
      }
    } catch {
      appendBotMessage('Network error. Could not reach the AI server.');
    } finally {
      setLoading(false);
      if (!voiceAgentOnRef.current) {
        setTimeout(() => inputRef.current?.focus(), 50);
      }
    }
  };

  handleSendRef.current = handleSend;

  const handleVoiceAgentUtterance = useCallback((transcript) => {
    const text = (transcript || '').trim();
    if (!text) return;
    handleSendRef.current?.(text);
  }, []);

  const toggleVoiceAgent = () => {
    if (voiceAgentOn) {
      stopSpeaking();
      setVoiceSpeaking(false);
      setVoiceAgentOn(false);
      showToast('Voice agent off', 'info');
    } else {
      setVoiceAgentOn(true);
      showToast('Voice agent on — speak naturally', 'success');
      speakText(
        "Hi! I'm your SkinGlow voice esthetician. I'm listening — ask me anything about skincare or place an order.",
        'en-US',
        {
          onStart: () => {
            setVoiceSpeaking(true);
            setSpeakingId('voice-agent');
          },
          onEnd: () => {
            setVoiceSpeaking(false);
            setSpeakingId(null);
          },
        }
      );
    }
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
          userId,
          userName: user?.name || null,
          userPrefs: user?.prefs || null,
        }),
      });
      const data = await response.json();
      handleApiResponse(data, labels[choice] || choice);
    } catch {
      appendBotMessage('Could not process your choice. Please try again.');
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
          userId,
          userName: user?.name || null,
          userPrefs: user?.prefs || null,
        }),
      });
      const data = await response.json();
      handleApiResponse(data, `Selected ${product.name}`);
    } catch {
      appendBotMessage('Could not select that product. Please try again.');
    } finally {
      setConfirmLoading(false);
    }
  };

  const handleConfirm = useCallback(async (msgId, confirmAction) => {
    if (confirmLoading) return;
    setConfirmLoading(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          confirmAction,
          history: chatHistory,
          userId,
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
        appendBotMessage(data.reply);
      }

      if (data.confirmed) {
        dispatchCartUpdate();
        setOrderDraft(null);
      }

      if (data.actions?.length) {
        for (const action of data.actions) {
          if (action.type === 'cart_updated' || action.type === 'order_placed') {
            dispatchCartUpdate();
            showToast(
              action.type === 'order_placed' ? 'Order placed! 🎉' : 'Added to cart ✨',
              action.type === 'order_placed' ? 'success' : 'cart'
            );
          }
        }
      }
    } catch {
      appendBotMessage('Could not complete that action. Please try again.');
    } finally {
      setConfirmLoading(false);
    }
  }, [chatHistory, confirmLoading, user, userId, showToast, orderDraft]);

  const handleCancelConfirm = (msgId) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === msgId ? { ...m, confirmed: false } : m))
    );
    setOrderDraft(null);
    appendBotMessage('Order cancelled. Let me know if you\'d like to start again or need skincare advice. ✨');
  };

  const handleSpeak = (msg) => {
    if (speakingId === msg.id) {
      stopSpeaking();
      setSpeakingId(null);
      return;
    }
    speakText(msg.text, 'en-US', {
      onStart: () => setSpeakingId(msg.id),
      onEnd: () => setSpeakingId(null),
    });
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

  return (
    <div className="h-screen w-full flex flex-col bg-slate-50 font-sans overflow-hidden">
      {/* Safe Navbar Container */}
      <div className="shrink-0 relative z-50 bg-white border-b border-slate-100 shadow-sm">
        <Navbar variant="chat" />
      </div>

      <div className="flex-1 flex overflow-hidden relative">
        {/* Decorative Background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-rose-100/40 rounded-full blur-[100px]" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[400px] h-[400px] bg-indigo-100/40 rounded-full blur-[100px]" />
        </div>

        {/* Sidebar (Desktop) */}
        <aside className="hidden lg:flex w-80 shrink-0 flex-col bg-white/60 backdrop-blur-xl border-r border-slate-200 z-10 p-6">
          <div className="flex items-center gap-4 mb-8 pb-8 border-b border-slate-100">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-primary to-rose-400 p-[2px] shadow-lg shadow-primary/20">
              <div className="w-full h-full rounded-2xl bg-white flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">SkinGlow AI</h2>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Online</span>
              </div>
            </div>
          </div>

          {!user && (
            <button onClick={() => navigate('/login')} className="w-full mb-6 py-3 px-4 bg-primary/5 hover:bg-primary/10 border border-primary/20 rounded-xl text-primary text-sm font-semibold flex items-center justify-center gap-2 transition-all">
              <LogIn className="w-4 h-4" /> Log in to shop
            </button>
          )}

          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Quick Asks</h3>
          <div className="flex flex-col gap-2">
            {SIDEBAR_PROMPTS.map(({ icon: Icon, label, text }) => (
              <button key={text} onClick={() => handleSend(text)} className="flex items-center gap-3 w-full text-left p-3 rounded-xl hover:bg-white border border-transparent hover:border-slate-200 hover:shadow-sm transition-all text-sm font-medium text-slate-600 hover:text-primary group">
                <Icon className="w-4 h-4 text-slate-400 group-hover:text-primary transition-colors" />
                {label}
              </button>
            ))}
          </div>
        </aside>

        {/* Main Chat Area */}
        <main className="flex-1 flex flex-col relative z-10 h-full min-w-0 w-full">
          {/* Header */}
          <header className="h-[72px] shrink-0 bg-white/80 backdrop-blur-md border-b border-slate-200/60 px-4 md:px-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={() => navigate('/')} className="lg:hidden w-10 h-10 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="lg:hidden w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-rose-400 p-[1.5px] shadow-sm shadow-primary/20">
                <div className="w-full h-full rounded-xl bg-white flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-primary" />
                </div>
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-900 tracking-tight leading-tight">
                  {firstName ? `Hi, ${firstName}` : 'Your Esthetician'}
                </h1>
                <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wide">Premium Skincare Guidance</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {speakingId && (
                <button onClick={() => { stopSpeaking(); setSpeakingId(null); }} className="px-3 py-1.5 rounded-full bg-red-50 text-red-600 text-xs font-bold flex items-center gap-1.5 hover:bg-red-100 transition-colors">
                  <VolumeX className="w-3 h-3" /> Stop
                </button>
              )}
              <Link to="/cart" className={`px-4 py-2 rounded-full bg-white border border-slate-200 shadow-sm flex items-center gap-2 text-sm font-bold text-slate-700 hover:border-primary hover:text-primary transition-all ${cartPulse ? 'scale-105 shadow-md shadow-primary/20 border-primary' : ''}`}>
                <ShoppingCart className="w-4 h-4" />
                <span className="hidden sm:inline">Cart</span>
                {cartCount > 0 && (
                  <span className="bg-primary text-white text-[10px] px-1.5 py-0.5 rounded-full">{cartCount}</span>
                )}
              </Link>
            </div>
          </header>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-8 space-y-6 w-full">
            {messages.length === 1 && messages[0].id === 'welcome' && (
              <div className="flex flex-col items-center justify-center text-center mt-10 mb-16 max-w-md mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="w-20 h-20 rounded-[2rem] bg-gradient-to-br from-white to-rose-50 border border-rose-100 shadow-xl shadow-rose-100/50 flex items-center justify-center mb-6">
                  <Sparkles className="w-10 h-10 text-primary" />
                </div>
                <h2 className="text-3xl font-light text-slate-900 mb-3 tracking-tight">Your glow journey starts here.</h2>
                <p className="text-slate-500 leading-relaxed font-light">Ask me about routines, ingredients, or order by product name. I'll guide you step by step.</p>
              </div>
            )}

            {messages.map((msg) => (
              <div key={msg.id} className={`flex gap-3 max-w-[90%] md:max-w-[85%] ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'} group animate-in slide-in-from-bottom-2 fade-in duration-300`}>
                <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex shrink-0 items-center justify-center shadow-sm ${msg.sender === 'user' ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-primary self-end mb-1'}`}>
                  {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                </div>

                <div className="flex flex-col gap-2 min-w-0 relative">
                  {msg.text && (
                    <div className={`px-5 py-4 rounded-3xl text-[15px] leading-relaxed shadow-sm relative ${msg.sender === 'user'
                        ? 'bg-slate-900 text-white rounded-br-sm'
                        : 'bg-white/90 backdrop-blur-md border border-white text-slate-800 rounded-bl-sm shadow-[0_4px_20px_rgb(0,0,0,0.03)]'
                      }`}>
                      {msg.sender === 'bot' ? (
                        <div className="prose prose-sm prose-slate max-w-none prose-p:leading-relaxed prose-strong:text-primary">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.text}</ReactMarkdown>
                        </div>
                      ) : (
                        msg.text
                      )}

                      {msg.sender === 'bot' && msg.type === 'text' && (
                        <button onClick={() => handleSpeak(msg)} className={`absolute -right-12 bottom-0 w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-sm border transition-colors ${speakingId === msg.id ? 'border-primary text-primary bg-primary/5' : 'border-slate-200 text-slate-400 hover:text-primary'}`} title="Read aloud">
                          {speakingId === msg.id ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                        </button>
                      )}
                    </div>
                  )}

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
              </div>
            ))}

            {loading && (
              <div className="flex gap-3 max-w-[85%] mr-auto animate-in fade-in">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-primary self-end mb-1 shadow-sm">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="bg-white/90 backdrop-blur-md border border-white px-5 py-4 rounded-3xl rounded-bl-sm shadow-sm flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="shrink-0 bg-white/80 backdrop-blur-xl border-t border-slate-200/60 p-4 relative z-20 pb-safe w-full min-w-0">
            {voiceAgentOn && (
              <div className="flex items-center justify-between bg-primary/5 border border-primary/20 rounded-2xl p-4 mb-4">
                <div className="flex items-center gap-3">
                  <span className={`w-3 h-3 rounded-full ${voiceSpeaking ? 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)] animate-pulse' : loading ? 'bg-amber-400 animate-pulse' : 'bg-primary animate-pulse'}`} />
                  <div>
                    <p className="text-sm font-bold text-slate-800">Voice Agent Active</p>
                    <p className="text-xs text-slate-500 font-medium">{voiceSpeaking ? 'AI is speaking...' : loading ? 'Thinking...' : 'Listening — speak naturally'}</p>
                  </div>
                </div>
                <button onClick={toggleVoiceAgent} className="text-xs font-bold text-slate-500 bg-white px-3 py-1.5 rounded-full border border-slate-200 hover:bg-slate-50">End Voice</button>
              </div>
            )}

            <div className="flex gap-2 overflow-x-auto pb-3 pt-1 no-scrollbar max-w-4xl mx-auto">
              {QUICK_PROMPTS.map(({ label, text }) => (
                <button key={text} onClick={() => handleSend(text)} className="whitespace-nowrap px-4 py-2 bg-slate-50 border border-slate-200 text-slate-600 text-[13px] font-semibold rounded-full shadow-sm hover:border-primary hover:text-primary transition-all">
                  {label}
                </button>
              ))}
            </div>

            <div className="max-w-4xl mx-auto relative flex items-center gap-2">
              {voiceAgentOn ? (
                <VoiceInterface agentMode paused={loading || confirmLoading || voiceSpeaking} onFinalUtterance={handleVoiceAgentUtterance} onInterim={(t) => setInput(t)} disabled={false} />
              ) : (
                <VoiceInterface onResult={(t) => setInput(t)} onInterim={(t) => setInput(t)} disabled={loading || confirmLoading} />
              )}
              
              <div className="flex-1 relative">
                <input
                  ref={inputRef}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-base rounded-full pl-6 pr-14 py-4 focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all shadow-inner outline-none font-medium placeholder:font-normal placeholder:text-slate-400"
                  placeholder={voiceAgentOn ? 'Voice agent listening... or type here' : 'Ask anything...'}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                  style={{ fontSize: '16px' }}
                />
                {!voiceAgentOn && (
                  <button onClick={toggleVoiceAgent} title="Voice Agent" className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full text-slate-400 hover:bg-primary/10 hover:text-primary transition-colors">
                    <Mic className="w-5 h-5" />
                  </button>
                )}
              </div>

              <button
                onClick={() => handleSend()}
                disabled={!input.trim() || loading || confirmLoading}
                className={`w-14 h-14 shrink-0 rounded-full flex items-center justify-center transition-all shadow-md ${input.trim() ? 'bg-primary text-white hover:bg-primary/90 hover:scale-105 hover:shadow-primary/30' : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'}`}
              >
                <Send className="w-5 h-5 ml-1" />
              </button>
            </div>
            <p className="text-center text-[11px] font-medium text-slate-400 mt-3 tracking-wide">
              {voiceAgentOn ? 'Hands-free mode active. AI responds with voice.' : 'SkinGlow AI can make mistakes. Please verify important skincare info.'}
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}

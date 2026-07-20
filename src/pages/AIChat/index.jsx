import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './styles.css';
import {
  User, Send, Sparkles, Volume2, VolumeX, ShoppingCart,
  Leaf, Droplets, Sun, LogIn, Mic,
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

let msgIdCounter = 0;
const newId = () => `msg-${++msgIdCounter}-${Date.now()}`;

/** Client-side safety net — never show leaked tool/function markup in chat UI */
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

const MOBILE_CHIPS = [
  { label: '🧴 Morning routine', text: 'Build a morning skincare routine' },
  { label: '💧 Dry skin help', text: 'Best moisturizer for dry skin?' },
  { label: '🛒 Add to cart', text: 'Hydra Balance Cleanser cart mein daalo' },
  { label: '📦 Place order', text: 'Place my order' },
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

    // Stop any current AI speech when user sends a new message
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
    <div className="ai-chat-page">
      {/* Site navbar — normal flow, never overlays chat */}
      <div className="ai-chat-nav">
        <Navbar variant="chat" />
      </div>

      <div className="ai-chat-body">
        <div className="ai-chat-page__orb ai-chat-page__orb--1" />
        <div className="ai-chat-page__orb ai-chat-page__orb--2" />
        <div className="ai-chat-page__orb ai-chat-page__orb--3" />
        <div className="ai-chat-page__mesh" aria-hidden="true" />

        <div className="ai-chat-shell">
          <aside className="ai-chat-sidebar">
            <div className="ai-chat-sidebar__card">
              <div className="ai-chat-sidebar__brand">
                <div className="ai-chat-sidebar__avatar">
                  <div className="ai-chat-sidebar__avatar-inner">
                    <Sparkles className="w-5 h-5" />
                  </div>
                </div>
                <div>
                  <p className="ai-chat-sidebar__brand-name">SkinGlow AI</p>
                  <p className="ai-chat-sidebar__brand-status">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Esthetician online
                  </p>
                </div>
              </div>
              {!user && (
                <button type="button" onClick={() => navigate('/login')} className="ai-login-banner">
                  <LogIn className="w-4 h-4" /> Log in to shop & save profile
                </button>
              )}
              <p className="ai-chat-sidebar__title">Quick asks</p>
              {SIDEBAR_PROMPTS.map(({ icon: Icon, label, text }) => (
                <button key={text} type="button" className="ai-chat-prompt-btn" onClick={() => handleSend(text)}>
                  <Icon className="w-3.5 h-3.5 mr-2 text-[#c45c7a] flex-shrink-0" />
                  {label}
                </button>
              ))}
            </div>

            <div className="ai-chat-sidebar__card">
              <p className="ai-chat-sidebar__title">Shortcuts</p>
              <Link to="/products" className="ai-chat-prompt-btn">Browse all products</Link>
              <Link to="/cart" className="ai-chat-prompt-btn">View my cart {cartCount > 0 && `(${cartCount})`}</Link>
              <Link to="/skin-quiz" className="ai-chat-prompt-btn">Take skin quiz</Link>
            </div>
          </aside>

          <div className="ai-chat-main">
            <header className="ai-chat-header">
              <div className="ai-chat-header__left">
                <div className="ai-chat-header__mark">
                  <Sparkles className="w-[18px] h-[18px]" />
                </div>
                <div className="min-w-0">
                  <h1 className="ai-chat-header__title">
                    {firstName ? `Hi, ${firstName}` : 'Your Esthetician'}
                  </h1>
                  <p className="ai-chat-header__sub">
                    Luxury skincare guidance · Confirm before every order
                  </p>
                </div>
              </div>
              <div className="ai-chat-header__actions">
                {speakingId && (
                  <button
                    type="button"
                    onClick={() => { stopSpeaking(); setSpeakingId(null); }}
                    className="ai-stop-btn"
                  >
                    <VolumeX className="w-3 h-3" /> Stop
                  </button>
                )}
                <Link
                  to="/cart"
                  className={`ai-cart-pill ${cartPulse ? 'ai-cart-pill--pulse' : ''}`}
                >
                  <ShoppingCart className="w-4 h-4" />
                  Cart
                  {cartCount > 0 && <span className="ai-cart-pill__count">{cartCount}</span>}
                </Link>
              </div>
            </header>

          <div className="ai-chat-messages custom-scrollbar">
            {messages.length === 1 && messages[0].id === 'welcome' && (
              <div className="ai-welcome-hero">
                <div className="ai-welcome-hero__icon">
                  <Sparkles className="w-8 h-8" />
                </div>
                <p className="ai-welcome-hero__eyebrow">SkinGlow Concierge</p>
                <h2 className="ai-welcome-hero__title">Your glow journey starts here</h2>
                <p className="ai-welcome-hero__sub">
                  Ask about routines, ingredients, or order by product name — I&apos;ll guide you step by step with confirmation before anything is placed.
                </p>
              </div>
            )}
            {messages.map((msg) => (
              <div key={msg.id} className={`ai-msg-row ${msg.sender === 'user' ? 'ai-msg-row--user' : ''}`}>
                <div className={`ai-msg-avatar ${msg.sender === 'user' ? 'ai-msg-avatar--user' : 'ai-msg-avatar--bot'}`}>
                  {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                </div>

                <div className="flex flex-col gap-2 min-w-0">
                  {msg.text && (
                    <div className={`ai-msg-bubble ${msg.sender === 'user' ? 'ai-msg-bubble--user' : 'ai-msg-bubble--bot'}`}>
                      {msg.sender === 'bot' ? (
                        <div className="prose prose-sm prose-slate max-w-none">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {msg.text}
                          </ReactMarkdown>
                        </div>
                      ) : (
                        msg.text
                      )}
                      {msg.sender === 'bot' && msg.type === 'text' && (
                        <button
                          type="button"
                          onClick={() => handleSpeak(msg)}
                          className={`ai-msg-speak ${speakingId === msg.id ? 'ai-msg-speak--active' : ''}`}
                          title="Read aloud"
                        >
                          {speakingId === msg.id ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                        </button>
                      )}
                    </div>
                  )}

                  {msg.orderSourceChoice && (
                    <OrderSourceChoiceCard
                      choice={msg.orderSourceChoice}
                      loading={confirmLoading}
                      onChoose={handleOrderSourceChoice}
                    />
                  )}

                  {msg.productPicker?.products?.length > 0 && (
                    <ProductPickerCard
                      products={msg.productPicker.products}
                      hint={msg.productPicker.hint}
                      mode={msg.productPicker.mode || 'order'}
                      loading={confirmLoading}
                      onSelect={handleProductSelect}
                    />
                  )}

                  {msg.orderProgress && (
                    <OrderProgressCard progress={msg.orderProgress} />
                  )}

                  {msg.pendingConfirmation?.type === 'add_to_cart' && (
                    <ProductConfirmCard
                      product={msg.pendingConfirmation.product}
                      confirmed={msg.confirmed ?? null}
                      loading={confirmLoading}
                      onConfirm={() => handleConfirm(msg.id, buildConfirmAction(msg.pendingConfirmation))}
                      onCancel={() => handleCancelConfirm(msg.id)}
                    />
                  )}

                  {msg.pendingConfirmation?.type === 'place_order' && (
                    <OrderConfirmCard
                      order={msg.pendingConfirmation}
                      confirmed={msg.confirmed ?? null}
                      loading={confirmLoading}
                      orderId={msg.orderId}
                      onConfirm={() => handleConfirm(msg.id, buildConfirmAction(msg.pendingConfirmation))}
                      onCancel={() => handleCancelConfirm(msg.id)}
                    />
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="ai-msg-row">
                <div className="ai-msg-avatar ai-msg-avatar--bot">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="ai-msg-bubble ai-msg-bubble--bot">
                  <div className="ai-typing">
                    <span /><span /><span />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="ai-chat-input-area">
            {voiceAgentOn && (
              <div className="ai-voice-agent-bar">
                <div className="ai-voice-agent-bar__status">
                  <span className={`ai-voice-agent-bar__dot ${voiceSpeaking ? 'speaking' : loading ? 'thinking' : 'listening'}`} />
                  <div>
                    <p className="ai-voice-agent-bar__title">Voice Agent</p>
                    <p className="ai-voice-agent-bar__sub">
                      {voiceSpeaking ? 'AI is speaking…' : loading ? 'Thinking…' : 'Listening — speak anytime'}
                    </p>
                  </div>
                </div>
                <button type="button" className="ai-voice-agent-bar__end" onClick={toggleVoiceAgent}>
                  End voice
                </button>
              </div>
            )}

            <div className="ai-chat-chips lg:hidden">
              {MOBILE_CHIPS.map(({ label, text }) => (
                <button key={text} type="button" className="ai-chat-chip" onClick={() => handleSend(text)}>
                  {label}
                </button>
              ))}
            </div>

            <div className="ai-chat-input-row">
              {voiceAgentOn ? (
                <VoiceInterface
                  agentMode
                  paused={loading || confirmLoading || voiceSpeaking}
                  onFinalUtterance={handleVoiceAgentUtterance}
                  onInterim={(t) => setInput(t)}
                  disabled={false}
                />
              ) : (
                <VoiceInterface
                  onResult={(t) => setInput(t)}
                  onInterim={(t) => setInput(t)}
                  disabled={loading || confirmLoading}
                />
              )}
              <input
                ref={inputRef}
                className="ai-chat-input"
                placeholder={voiceAgentOn ? 'Voice agent listening… or type here' : 'Ask anything… or type a product name to order'}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                style={{ fontSize: '16px' }}
              />
              {!voiceAgentOn && (
                <button
                  type="button"
                  className="ai-voice-agent-toggle"
                  onClick={toggleVoiceAgent}
                  title="Start voice conversation"
                >
                  <Mic className="w-4 h-4" />
                </button>
              )}
              <button
                type="button"
                className="ai-chat-send"
                onClick={() => handleSend()}
                disabled={!input.trim() || loading || confirmLoading}
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <p className="ai-chat-footer-note">
              {voiceAgentOn
                ? 'Hands-free mode · Speak naturally · AI replies by voice'
                : 'Tap the mic badge for Voice Agent · Or type anytime'}
            </p>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}

import React, { useState, useRef, useEffect } from 'react';
import './styles.css';

const AIChat = () => {
  const messagesEndRef = useRef(null);

  const [messages, setMessages] = useState([
    { text: '👋 Hi, I am your MT Store AI assistant. How may I assist you today? I can guide you about products, offers, categories, shipping, and more!', sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getAIResponse = async (message) => {
    const text = message.toLowerCase();

    // Dynamic, detailed, natural AI responses
    if (text.includes('hi') || text.includes('hello')) {
      return '😊 Hello! Welcome to MT Store, your one-stop online store for all your shopping needs. I am here to help you explore our wide range of products, current offers, and categories. How may I assist you today?';
    } 
    if (text.includes('how are you')) {
      return "😁 I'm fantastic! Always ready to help you discover the best deals, products, and shopping tips at MT Store. What would you like to know today?";
    } 
    if (text.includes('product') || text.includes('products')) {
      return '🛍️ MT Store offers a rich variety of products including electronics, fashion, beauty, home essentials, and accessories. Each product comes with detailed descriptions, high-quality images, and customer reviews to help you make informed decisions. You can explore trending products, new arrivals, and top-rated items. We ensure that all products are carefully curated for quality and affordability. If you want, I can guide you through our latest product list and top picks!';
    } 
    if (text.includes('offer') || text.includes('discount') || text.includes('sale')) {
      return '🎉 MT Store is always running exciting offers and discounts! Currently, you can enjoy up to 25% off on selected items. We also have seasonal promotions, bundle deals, and exclusive members-only discounts. Our offers are updated regularly, so you always get the best deals. Would you like me to list some of the top discounted products for you? 🛒';
    } 
    if (text.includes('category') || text.includes('categories')) {
      return '📂 We organize our products into clear categories to make your shopping experience smooth and enjoyable. Explore Electronics, Fashion, Home & Kitchen, Sports & Fitness, Beauty & Personal Care, and many more. Each category features trending items, bestsellers, and top-rated products. You can quickly find what you need and discover new products within each category. Would you like me to guide you through a specific category?';
    } 
    if (text.includes('shipping')) {
      return '🚚 MT Store provides fast and reliable shipping for all your orders. We offer delivery within 3-5 business days, and you can track every order in real-time. We ensure your products are safely packaged and reach you in perfect condition. Some items also qualify for free shipping! Would you like to know about shipping charges for specific products?';
    } 
    if (text.includes('return') || text.includes('refund')) {
      return '💰 Customer satisfaction is our priority! MT Store offers hassle-free returns and refunds. Depending on the product, returns are accepted within 7-14 days. Our simple return process ensures you can easily exchange or refund items. Our support team is always here to assist you through every step. Need guidance on initiating a return?';
    } 
    if (text.includes('recommend') || text.includes('suggest')) {
      return '🌟 Sure! I can recommend some popular products and deals at MT Store. For electronics, our latest smartphones and laptops are trending. For fashion, check out our seasonal collections and accessories. For home essentials, we have top-rated kitchen gadgets and decor items. Would you like me to show a detailed list?';
    }

    // Fallback response for unknown queries
    const fallbackResponses = [
      '🤔 That’s interesting! Could you please elaborate so I can assist you better?',
      '💡 MT Store has a lot to offer! Are you looking for products, discounts, or categories?',
      '😊 I’m here to help you explore our store. Could you tell me what you are interested in today?',
      '🛒 Great! Let me guide you through our products, offers, or categories. Can you specify your preference?'
    ];
    return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    const botReply = await getAIResponse(input);
    setMessages(prev => [...prev, { text: botReply, sender: 'bot' }]);
    setLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <div className="chat-wrapper">
      <div className="chat-header">MT Store AI Assistant 🤖</div>

      <div className="chat-messages">
        {messages.map((msg, idx) => (
          <div key={idx} className={`chat-bubble ${msg.sender}`}>
            {msg.text}
          </div>
        ))}

        {loading && <div className="chat-bubble bot typing">AI is typing... ⏳</div>}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Type your message..."
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default AIChat;

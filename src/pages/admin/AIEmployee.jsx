import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import React, { useState, useRef, useEffect } from 'react';
import { Bot, User, Send, BarChart3, TrendingUp, AlertTriangle } from 'lucide-react';

export default function AIEmployee() {
    const [messages, setMessages] = useState([
        { role: 'model', text: 'Hello boss! I am your SkinGlow Business Intelligence Analyst. Ask me about your revenue, top-selling products, or low inventory items.' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    // History for Gemini
    const [chatHistory, setChatHistory] = useState([]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const suggestedPrompts = [
        "What is our total revenue?",
        "What are the top 5 best selling products?",
        "Which products are low on stock?"
    ];

    const handleSend = async (txt = input) => {
        if (!txt.trim()) return;

        const userMsg = { role: 'user', text: txt };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        const newHistory = [...chatHistory, { role: 'user', parts: [{ text: txt }] }];
        setChatHistory(newHistory);

        try {
            const response = await fetch('/api/ai/admin-chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: txt,
                    history: chatHistory
                })
            });

            const data = await response.json();
            
            if (data.reply) {
                setMessages(prev => [...prev, { role: 'model', text: data.reply }]);
                setChatHistory(data.updatedHistory || [...newHistory, { role: 'model', parts: [{ text: data.reply }] }]);
            } else {
                setMessages(prev => [...prev, { role: 'model', text: 'Error retrieving analysis.' }]);
            }
        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, { role: 'model', text: 'Network error. Could not connect to AI.' }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') handleSend();
    };

    return (
        <div className="flex flex-col h-[85vh] bg-gray-50 rounded-2xl shadow-sm border border-gray-200 m-6 overflow-hidden">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
                        <BarChart3 className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">Business Intelligence AI</h2>
                        <p className="text-sm text-gray-500">Your personal data analyst</p>
                    </div>
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-white'}`}>
                                {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                            </div>
                            <div className={`p-4 rounded-2xl text-sm leading-relaxed overflow-x-auto ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white shadow-sm border border-gray-100 text-gray-800 rounded-tl-none'}`}>
                                {msg.role === 'user' ? (
                                    <div className="whitespace-pre-wrap">{msg.text}</div>
                                ) : (
                                    <div className="prose prose-sm max-w-none prose-indigo prose-tables:border prose-tables:border-gray-200 prose-tables:rounded-xl prose-tables:overflow-hidden prose-th:bg-gray-50/80 prose-th:px-4 prose-th:py-3 prose-td:px-4 prose-td:py-3 prose-td:bg-white prose-tr:hover:bg-gray-50">
                                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                            {msg.text}
                                        </ReactMarkdown>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}

                {isLoading && (
                    <div className="flex justify-start">
                        <div className="flex gap-3 max-w-[80%] flex-row">
                            <div className="w-10 h-10 rounded-full bg-gray-800 text-white flex items-center justify-center shrink-0">
                                <Bot className="w-5 h-5" />
                            </div>
                            <div className="bg-white shadow-sm border border-gray-100 px-5 py-4 rounded-2xl rounded-tl-none flex items-center gap-2">
                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                                <span className="ml-2 text-gray-400 font-medium text-xs">Analyzing data...</span>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="bg-white p-4 border-t border-gray-200">
                <div className="flex gap-2 overflow-x-auto pb-3 mb-2 no-scrollbar">
                    {suggestedPrompts.map((prompt, i) => (
                        <button
                            key={i}
                            onClick={() => handleSend(prompt)}
                            className="whitespace-nowrap px-4 py-2 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 text-indigo-700 text-xs font-semibold rounded-full transition-colors"
                        >
                            {prompt}
                        </button>
                    ))}
                </div>
                <div className="relative">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyPress}
                        placeholder="Ask your AI analyst a question..."
                        disabled={isLoading}
                        className="w-full bg-gray-50 border border-gray-300 text-gray-800 text-sm rounded-xl px-4 py-4 pr-16 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                    />
                    <button
                        onClick={() => handleSend()}
                        disabled={!input.trim() || isLoading}
                        className={`absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-lg transition-colors ${input.trim() && !isLoading ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-gray-200 text-gray-400'}`}
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}

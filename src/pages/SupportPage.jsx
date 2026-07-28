import React, { useState } from "react";
import { Search, ChevronDown, ChevronUp, MessageCircle, FileText, Zap } from "lucide-react";

export default function SupportPage() {
    const [openIndex, setOpenIndex] = useState(0);

    const faqs = [
        {
            q: "Are SkinGlow products suitable for sensitive skin?",
            a: "Absolutely. All our products are dermatologist-tested and formulated without harsh irritants like parabens, sulfates, and synthetic fragrances. We recommend patch testing before full use."
        },
        {
            q: "How do I build a routine?",
            a: "Complexity isn't always better. Start with the basics: Cleanse, Treat, Moisturize, and SPF. You can also chat with our experts for a personalized plan!"
        },
        {
            q: "Do you test on animals?",
            a: "Never. We are proud to be 100% cruelty-free and Leaping Bunny certified."
        },
        {
            q: "What if I react to a product?",
            a: "Stop use immediately. Contact us within 30 days for a full refund under our Glow Guarantee."
        },
        {
            q: "Can I change my order after placing it?",
            a: "We process orders fast! Email skin.glow.skincare.pk@gmail.com within 1 hour of placing your order and we will do our best to modify it."
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pt-32 pb-20">
            <div className="max-w-3xl mx-auto px-6">

                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-4">Help Center</h1>
                    <p className="text-slate-500 mb-8">Find answers to common questions about our products, shipping, and more.</p>

                    <div className="relative max-w-lg mx-auto">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            placeholder="Search for answers..."
                            className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 shadow-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                        />
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-3 gap-4 mb-16">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 text-center hover:border-primary/30 transition cursor-pointer group">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto mb-3 group-hover:scale-110 transition-transform">
                            <FileText className="w-6 h-6" />
                        </div>
                        <div className="font-bold text-sm">Order Status</div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 text-center hover:border-primary/30 transition cursor-pointer group">
                        <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 mx-auto mb-3 group-hover:scale-110 transition-transform">
                            <Zap className="w-6 h-6" />
                        </div>
                        <div className="font-bold text-sm">Routine Quiz</div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 text-center hover:border-primary/30 transition cursor-pointer group">
                        <div className="w-12 h-12 bg-rose-50 rounded-full flex items-center justify-center text-rose-500 mx-auto mb-3 group-hover:scale-110 transition-transform">
                            <MessageCircle className="w-6 h-6" />
                        </div>
                        <div className="font-bold text-sm">Live Chat</div>
                    </div>
                </div>

                {/* FAQs */}
                <div className="bg-white rounded-3xl shadow-lg shadow-slate-200/50 overflow-hidden border border-slate-100">
                    {faqs.map((item, i) => (
                        <div key={i} className="border-b last:border-0 border-slate-100">
                            <button
                                onClick={() => setOpenIndex(openIndex === i ? -1 : i)}
                                className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-50 transition-colors"
                            >
                                <span className="font-semibold text-slate-800">{item.q}</span>
                                {openIndex === i ? (
                                    <ChevronUp className="w-5 h-5 text-slate-400" />
                                ) : (
                                    <ChevronDown className="w-5 h-5 text-slate-400" />
                                )}
                            </button>
                            {openIndex === i && (
                                <div className="px-6 pb-6 text-slate-600 text-sm leading-relaxed animate-in slide-in-from-top-2">
                                    {item.a}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="mt-12 text-center">
                    <p className="text-slate-500 text-sm">Still need help?</p>
                    <a href="/contact" className="text-primary font-bold hover:underline underline-offset-4 decoration-2">Contact our Concierge</a>
                </div>

            </div>
        </div>
    );
}

import React from "react";
import { ShieldCheck, RefreshCw, AlertCircle, CheckCircle, Package } from "lucide-react";

export default function ReturnsPage() {
    const steps = [
        {
            title: "Initiate Return",
            text: "Email us at glow@skinglow.com within 30 days with your order number."
        },
        {
            title: "Pack It Up",
            text: "Place the item(s) in original packaging. We'll send you a prepaid label."
        },
        {
            title: "Ship It Back",
            text: "Drop it off at any courier location. We'll track it from there."
        },
        {
            title: "Get Refunded",
            text: "Once inspected, your refund will be processed within 5-7 business days."
        }
    ];

    return (
        <div className="min-h-screen bg-white font-sans text-slate-900 pt-32 pb-20">
            <div className="max-w-4xl mx-auto px-6">

                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 text-emerald-700 font-semibold text-sm mb-6 border border-emerald-100">
                        <ShieldCheck className="w-4 h-4" />
                        <span>30-Day Glow Guarantee</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">Returns & Exchanges</h1>
                    <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                        We want you to love your skin. If a product doesn't work for you, we're here to make it right. No hard feelings.
                    </p>
                </div>

                {/* Policy Highlights */}
                <div className="grid md:grid-cols-2 gap-8 mb-20">
                    <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100">
                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-emerald-500" /> What's Returnable?
                        </h3>
                        <ul className="space-y-3 text-slate-600 text-sm">
                            <li className="flex items-start gap-2">
                                <span className="block w-1.5 h-1.5 mt-1.5 rounded-full bg-slate-400"></span>
                                Unopened products within 30 days of delivery.
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="block w-1.5 h-1.5 mt-1.5 rounded-full bg-slate-400"></span>
                                Gently used products (at least 75% full).
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="block w-1.5 h-1.5 mt-1.5 rounded-full bg-slate-400"></span>
                                Defective or damaged items upon arrival.
                            </li>
                        </ul>
                    </div>

                    <div className="bg-rose-50 p-8 rounded-3xl border border-rose-100">
                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-rose-900">
                            <AlertCircle className="w-5 h-5 text-rose-500" /> Non-Returnable
                        </h3>
                        <ul className="space-y-3 text-rose-800/80 text-sm">
                            <li className="flex items-start gap-2">
                                <span className="block w-1.5 h-1.5 mt-1.5 rounded-full bg-rose-400"></span>
                                Empty bottles or products with less than 50% content.
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="block w-1.5 h-1.5 mt-1.5 rounded-full bg-rose-400"></span>
                                Sale items marked "Final Sale".
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="block w-1.5 h-1.5 mt-1.5 rounded-full bg-rose-400"></span>
                                Gift cards.
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Process */}
                <div className="mb-20">
                    <h2 className="text-2xl font-bold mb-10 text-center">How to Return</h2>
                    <div className="grid md:grid-cols-4 gap-6">
                        {steps.map((step, i) => (
                            <div key={i} className="relative">
                                <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg shadow-primary/30 mb-4 mx-auto z-10 relative">
                                    {i + 1}
                                </div>
                                {i !== steps.length - 1 && (
                                    <div className="hidden md:block absolute top-5 left-1/2 w-full h-0.5 bg-slate-100 -z-0"></div>
                                )}
                                <div className="text-center px-2">
                                    <h4 className="font-bold mb-2 text-sm">{step.title}</h4>
                                    <p className="text-xs text-slate-500 leading-relaxed">{step.text}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Note */}
                <div className="bg-slate-900 text-white rounded-2xl p-8 flex items-start gap-4">
                    <Package className="w-6 h-6 text-primary flex-shrink-0" />
                    <div>
                        <h4 className="font-bold text-lg mb-1">Damaged Item?</h4>
                        <p className="text-slate-300 text-sm">
                            Oh no! If your order arrived damaged, please snap a photo and email us immediately. We will send a replacement free of charge, no questions asked.
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
}

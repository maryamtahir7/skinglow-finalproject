import React from "react";
import { Truck, Globe, Clock, MapPin, AlertTriangle } from "lucide-react";

export default function ShippingPage() {
    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pt-32 pb-20">
            <div className="max-w-4xl mx-auto px-6">

                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">Shipping & Delivery</h1>
                    <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                        Fast, reliable, and tracked. We know you're excited to start glowing.
                    </p>
                </div>

                <div className="grid gap-8">
                    {/* Speed Section */}
                    <div className="bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-slate-100 flex flex-col md:flex-row items-center gap-8">
                        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 text-primary">
                            <Truck className="w-10 h-10" />
                        </div>
                        <div className="flex-1 text-center md:text-left">
                            <h3 className="text-xl font-bold mb-2">Domestic Shipping (Pakistan)</h3>
                            <p className="text-slate-500 mb-6">Free standard shipping on all orders over Rs. 3000.</p>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                    <div className="text-xs uppercase tracking-wider font-bold text-slate-400 mb-1">Standard</div>
                                    <div className="font-bold text-lg">3-5 Days</div>
                                    <div className="text-xs text-slate-500">Rs. 200 (Flat Rate)</div>
                                </div>
                                <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                                    <div className="text-xs uppercase tracking-wider font-bold text-emerald-600/70 mb-1">Express</div>
                                    <div className="font-bold text-lg text-emerald-900">1-2 Days</div>
                                    <div className="text-xs text-emerald-700">Rs. 450</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tracking */}
                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-primary" /> Order Tracking
                        </h3>
                        <p className="text-slate-600 text-sm mb-4 leading-relaxed">
                            Once your order ships, you will receive an email with a tracking number and a link to trace your package's journey.
                            Please allow up to 24 hours for the tracking link to update.
                        </p>
                        <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-100 flex gap-3 text-sm text-yellow-800">
                            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                            <p>During sale periods and holidays, please allow an extra 1-2 business days for processing.</p>
                        </div>
                    </div>

                    {/* International */}
                    <div className="bg-slate-900 text-white rounded-3xl p-8 md:p-10 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3"></div>
                        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-4 text-primary">
                                    <Globe className="w-5 h-5" />
                                    <span className="font-bold uppercase tracking-widest text-xs">Global Shipping</span>
                                </div>
                                <h3 className="text-2xl font-bold mb-3">We Ship Worldwide</h3>
                                <p className="text-slate-300 text-sm leading-relaxed mb-6">
                                    Yes, we glow globally! International shipping rates are calculated at checkout based on destination and weight.
                                    Please note that customs duties and taxes are the responsibility of the customer.
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {['USA', 'UK', 'UAE', 'Canada', 'Australia'].map(c => (
                                        <span key={c} className="px-3 py-1 rounded-full bg-white/10 text-xs border border-white/10">{c}</span>
                                    ))}
                                    <span className="px-3 py-1 rounded-full bg-white/5 text-xs text-slate-400">+ 150 more</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

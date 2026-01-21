import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Droplets, Sun, ShieldAlert, Sparkles, Zap, Heart, Check, AlertCircle, ChevronRight } from 'lucide-react';
import { Button } from "@/components/ui/button";

function ConcernPage() {
    const navigate = useNavigate();
    const [hoveredConcern, setHoveredConcern] = useState(null);

    const concerns = [
        {
            id: 'acne',
            title: "Acne & Blemishes",
            desc: "Clear breakouts, reduce inflammation, and prevent future congestion without stripping your skin.",
            symptoms: ["Active Breakouts", "Blackheads", "Excess Oil", "Clogged Pores"],
            icon: <ShieldAlert className="w-10 h-10 text-rose-500" />,
            accent: "text-rose-500",
            border: "hover:border-rose-100",
            shadow: "hover:shadow-rose-500/10",
            shopLink: "/products?concern=acne"
        },
        {
            id: 'aging',
            title: "Aging & Fine Lines",
            desc: "Restore elasticity, smooth texture, and boost collagen production for a youthful, firm complexion.",
            symptoms: ["Fine Lines", "Loss of Firmness", "Crow's Feet", "Sagginess"],
            icon: <Sparkles className="w-10 h-10 text-purple-500" />,
            accent: "text-purple-500",
            border: "hover:border-purple-100",
            shadow: "hover:shadow-purple-500/10",
            shopLink: "/products?concern=aging"
        },
        {
            id: 'dryness',
            title: "Dryness & Dehydration",
            desc: "Replenish essential moisture, repair the barrier, and lock in long-lasting hydration.",
            symptoms: ["Flakiness", "Tightness", "Rough Texture", "Dullness"],
            icon: <Droplets className="w-10 h-10 text-blue-500" />,
            accent: "text-blue-500",
            border: "hover:border-blue-100",
            shadow: "hover:shadow-blue-500/10",
            shopLink: "/products?concern=dryness"
        },
        {
            id: 'dullness',
            title: "Dullness & Uneven Tone",
            desc: "Exfoliate dead skin cells and brighten dark spots for a radiant, glowing complexion.",
            symptoms: ["Lack of Radiance", "Dark Spots", "Pigmentation", "Uneven Texture"],
            icon: <Sun className="w-10 h-10 text-amber-500" />,
            accent: "text-amber-500",
            border: "hover:border-amber-100",
            shadow: "hover:shadow-amber-500/10",
            shopLink: "/products?concern=dullness"
        },
        {
            id: 'sensitivity',
            title: "Sensitivity & Redness",
            desc: "Soothe irritation, calm redness, and strengthen the skin's natural defense barrier.",
            symptoms: ["Redness", "Itching", "Burning Sensation", "Reactive Skin"],
            icon: <Heart className="w-10 h-10 text-pink-500" />,
            accent: "text-pink-500",
            border: "hover:border-pink-100",
            shadow: "hover:shadow-pink-500/10",
            shopLink: "/products?concern=sensitivity"
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
            {/* Dark Hero Section */}
            <div className="relative bg-[#0f172a] text-white pt-24 pb-32 md:pt-32 md:pb-48 overflow-hidden">
                {/* Abstract Background Elements */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-rose-500/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/3 pointer-events-none" />

                <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs font-bold tracking-[0.2em] uppercase mb-8 shadow-2xl">
                        Targeted Solutions
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold mb-8 tracking-tight leading-tight">
                        Concerns, <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-primary">Solved.</span>
                    </h1>

                    <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed font-light">
                        Every skin story is different. Identify what your skin is telling you and find the expert-curated routine to bring it back to balance.
                    </p>
                </div>
            </div>

            {/* Content Cards - Overlapping Hero */}
            <div className="max-w-7xl mx-auto px-6 -mt-24 relative z-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {concerns.map((concern, idx) => (
                        <div
                            key={concern.id}
                            className={`bg-white rounded-[2rem] p-8 shadow-xl border border-transparent ${concern.border} ${concern.shadow} transition-all duration-300 hover:-translate-y-2 group cursor-pointer flex flex-col`}
                            onMouseEnter={() => setHoveredConcern(concern.id)}
                            onMouseLeave={() => setHoveredConcern(null)}
                            onClick={() => navigate(concern.shopLink)}
                        >
                            {/* Icon Header */}
                            <div className="mb-8 flex items-start justify-between">
                                <div className={`p-4 rounded-2xl bg-slate-50 group-hover:bg-white group-hover:shadow-md transition-all duration-300 ring-1 ring-slate-100`}>
                                    {concern.icon}
                                </div>
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center border border-slate-100 text-slate-300 group-hover:bg-primary group-hover:border-primary group-hover:text-white transition-all duration-500 opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0`}>
                                    <ArrowRight className="w-5 h-5" />
                                </div>
                            </div>

                            {/* Text Content */}
                            <h3 className="text-2xl font-bold mb-4 text-slate-900 group-hover:text-primary transition-colors">
                                {concern.title}
                            </h3>
                            <p className="text-slate-500 leading-relaxed mb-6 flex-1">
                                {concern.desc}
                            </p>

                            {/* Symptoms List (Feature-full) */}
                            <div className="bg-slate-50 rounded-xl p-5 mb-8 border border-slate-100 group-hover:border-primary/10 transition-colors">
                                <span className={`text-xs font-bold uppercase tracking-wider mb-3 block ${concern.accent}`}>Common Symptoms</span>
                                <ul className="space-y-2">
                                    {concern.symptoms.map((symptom, i) => (
                                        <li key={i} className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                                            <div className={`w-1.5 h-1.5 rounded-full bg-slate-300 group-hover:bg-current ${concern.accent}`} />
                                            {symptom}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Action Button */}
                            <Button
                                className={`w-full py-6 rounded-xl font-bold text-base shadow-none transition-all duration-300 group-hover:shadow-lg ${hoveredConcern === concern.id ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-900 hover:bg-slate-200'}`}
                            >
                                Shop Solutions
                            </Button>
                        </div>
                    ))}

                    {/* Quiz Promo Card */}
                    <div
                        className="bg-gradient-to-br from-primary to-rose-500 rounded-[2rem] p-8 shadow-xl text-white flex flex-col justify-center relative overflow-hidden group cursor-pointer min-h-[500px] lg:min-h-auto"
                        onClick={() => navigate('/skin-quiz')}
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />

                        <div className="relative z-10 flex flex-col h-full">
                            <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-8 border border-white/20">
                                <Zap className="w-8 h-8 text-yellow-300 fill-yellow-300 animate-pulse" />
                            </div>

                            <h3 className="text-3xl font-bold mb-4">Still unsure?</h3>
                            <p className="text-white/80 text-lg mb-8 leading-relaxed">
                                Our AI-powered skin analysis can detect your underlying concerns in less than 2 minutes.
                            </p>

                            <div className="mt-auto">
                                <Button className="w-full bg-white text-primary hover:bg-white/90 font-bold py-6 text-base rounded-xl shadow-lg border-0">
                                    Take the Quiz <ChevronRight className="w-4 h-4 ml-2" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Section - Educational */}
            <div className="max-w-4xl mx-auto px-6 mt-32 text-center">
                <div className="inline-flex items-center gap-2 text-primary font-bold uppercase tracking-wider text-sm mb-4">
                    <Sparkles className="w-4 h-4" /> Why Choose Targeted Care?
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-12 text-slate-900">Expert-Backed Philosophy</h2>

                <div className="grid md:grid-cols-3 gap-8 text-left">
                    {[
                        { title: "Precision", desc: "Target specific issues directly at the source for faster results.", icon: AlertCircle },
                        { title: "Balance", desc: "Formulas designed to treat concerns without disrupting the skin barrier.", icon: Droplets },
                        { title: "Efficacy", desc: "Clinically proven active ingredients at optimal concentrations.", icon: Check }
                    ].map((item, i) => (
                        <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 hover:border-primary/20 hover:shadow-lg transition-all duration-300">
                            <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center mb-4 text-slate-700">
                                <item.icon className="w-6 h-6" />
                            </div>
                            <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                            <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default ConcernPage;

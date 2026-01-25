import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Droplets, Sun, ShieldAlert, Sparkles, Zap, Heart, Check, AlertCircle, ChevronRight, Search } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

function ConcernPage() {
    const navigate = useNavigate();
    const [hoveredConcern, setHoveredConcern] = useState(null);

    const concerns = [
        {
            id: 'acne',
            title: "Acne & Blemishes",
            desc: "Clear breakouts, reduce inflammation, and prevent future congestion without stripping your skin.",
            symptoms: ["Active Breakouts", "Blackheads", "Excess Oil", "Clogged Pores"],
            icon: <ShieldAlert className="w-8 h-8 md:w-10 md:h-10 text-rose-500" />,
            accent: "text-rose-500",
            bg: "bg-rose-50",
            border: "group-hover:border-rose-200",
            shadow: "group-hover:shadow-rose-500/10",
            shopLink: "/products?concern=acne"
        },
        {
            id: 'aging',
            title: "Aging & Fine Lines",
            desc: "Restore elasticity, smooth texture, and boost collagen production for a youthful, firm complexion.",
            symptoms: ["Fine Lines", "Loss of Firmness", "Crow's Feet", "Sagginess"],
            icon: <Sparkles className="w-8 h-8 md:w-10 md:h-10 text-purple-500" />,
            accent: "text-purple-500",
            bg: "bg-purple-50",
            border: "group-hover:border-purple-200",
            shadow: "group-hover:shadow-purple-500/10",
            shopLink: "/products?concern=aging"
        },
        {
            id: 'dryness',
            title: "Dryness & Dehydration",
            desc: "Replenish essential moisture, repair the barrier, and lock in long-lasting hydration.",
            symptoms: ["Flakiness", "Tightness", "Rough Texture", "Dullness"],
            icon: <Droplets className="w-8 h-8 md:w-10 md:h-10 text-blue-500" />,
            accent: "text-blue-500",
            bg: "bg-blue-50",
            border: "group-hover:border-blue-200",
            shadow: "group-hover:shadow-blue-500/10",
            shopLink: "/products?concern=dryness"
        },
        {
            id: 'dullness',
            title: "Dullness & Uneven Tone",
            desc: "Exfoliate dead skin cells and brighten dark spots for a radiant, glowing complexion.",
            symptoms: ["Lack of Radiance", "Dark Spots", "Pigmentation", "Uneven Texture"],
            icon: <Sun className="w-8 h-8 md:w-10 md:h-10 text-amber-500" />,
            accent: "text-amber-500",
            bg: "bg-amber-50",
            border: "group-hover:border-amber-200",
            shadow: "group-hover:shadow-amber-500/10",
            shopLink: "/products?concern=dullness"
        },
        {
            id: 'sensitivity',
            title: "Sensitivity & Redness",
            desc: "Soothe irritation, calm redness, and strengthen the skin's natural defense barrier.",
            symptoms: ["Redness", "Itching", "Burning Sensation", "Reactive Skin"],
            icon: <Heart className="w-8 h-8 md:w-10 md:h-10 text-pink-500" />,
            accent: "text-pink-500",
            bg: "bg-pink-50",
            border: "group-hover:border-pink-200",
            shadow: "group-hover:shadow-pink-500/10",
            shopLink: "/products?concern=sensitivity"
        }
    ];

    return (
        <div className="min-h-screen bg-[#FDFBF7] font-sans text-stone-900 pb-20 selection:bg-rose-100">
            {/* 1. PREMIUM HERO SECTION */}
            <div className="relative bg-[#0A0A0A] text-white pt-32 pb-48 md:pt-40 md:pb-64 overflow-hidden rounded-b-[40px] md:rounded-b-[80px] shadow-2xl">
                {/* Background Ambience */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-rose-900/20 rounded-full blur-[120px] opacity-70" />
                    <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-indigo-900/20 rounded-full blur-[120px] opacity-60" />
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03]" />
                </div>

                <div className="max-w-5xl mx-auto px-6 relative z-10 text-center">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-[10px] md:text-xs font-bold tracking-[0.25em] uppercase mb-8 shadow-lg">
                            <Sparkles className="w-3 h-3 text-rose-300" /> Targeted Solutions
                        </div>

                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif mb-8 tracking-tight leading-[0.95]">
                            Concerns, <br className="md:hidden" />
                            <span className="italic font-light text-rose-300">Solved.</span>
                        </h1>

                        <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto leading-relaxed font-light mb-12">
                            Identify what your skin is telling you and discover the expert-curated routine needed to bring it back to balance.
                        </p>

                        <Button
                            onClick={() => document.getElementById('concerns-grid').scrollIntoView({ behavior: 'smooth' })}
                            className="bg-white text-stone-900 hover:bg-rose-50 rounded-full px-8 py-6 font-bold uppercase tracking-widest text-xs shadow-xl shadow-white/10 transition-all hover:-translate-y-1"
                        >
                            Explore Concerns <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                    </motion.div>
                </div>
            </div>

            {/* 2. CONCERNS GRID - Floating Up */}
            <div id="concerns-grid" className="max-w-7xl mx-auto px-6 -mt-32 md:-mt-48 relative z-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {concerns.map((concern, idx) => (
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1, duration: 0.5 }}
                            key={concern.id}
                            className={`group bg-white rounded-[32px] p-8 shadow-[0_10px_40px_rgba(0,0,0,0.05)] border border-white hover:border-transparent ${concern.border} ${concern.shadow} transition-all duration-500 hover:-translate-y-2 cursor-pointer flex flex-col h-full relative overflow-hidden`}
                            onMouseEnter={() => setHoveredConcern(concern.id)}
                            onMouseLeave={() => setHoveredConcern(null)}
                            onClick={() => navigate(concern.shopLink)}
                        >
                            {/* Subtle Background Tint on Hover */}
                            <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-br from-transparent to-${concern.accent.split('-')[1]}-50/30`} />

                            {/* Header */}
                            <div className="relative z-10 mb-8 flex items-start justify-between">
                                <div className={`p-4 rounded-2xl ${concern.bg} group-hover:scale-110 transition-transform duration-500`}>
                                    {concern.icon}
                                </div>
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center border border-stone-100 text-stone-300 group-hover:bg-stone-900 group-hover:border-stone-900 group-hover:text-white transition-all duration-300 transform translate-x-4 group-hover:translate-x-0 opacity-0 group-hover:opacity-100`}>
                                    <ArrowRight className="w-4 h-4" />
                                </div>
                            </div>

                            {/* Content */}
                            <div className="relative z-10 flex-1 flex flex-col">
                                <h3 className="text-2xl font-serif text-stone-900 mb-3 group-hover:text-rose-900 transition-colors">
                                    {concern.title}
                                </h3>
                                <p className="text-stone-500 text-sm leading-relaxed mb-8 flex-1">
                                    {concern.desc}
                                </p>

                                {/* Symptoms */}
                                <div className="bg-stone-50 rounded-2xl p-5 mb-8 border border-stone-100/50 group-hover:bg-white/80 group-hover:border-stone-200 transition-all">
                                    <span className={`text-[10px] font-bold uppercase tracking-widest mb-3 block ${concern.accent}`}>Symptoms</span>
                                    <div className="flex flex-wrap gap-2">
                                        {concern.symptoms.map((symptom, i) => (
                                            <span key={i} className="inline-flex items-center px-2 py-1 bg-white rounded-md border border-stone-100 text-[10px] font-bold text-stone-600 uppercase tracking-wide">
                                                {symptom}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <Button
                                    className={`w-full py-6 rounded-xl font-bold text-xs uppercase tracking-widest shadow-none transition-all duration-300 ${hoveredConcern === concern.id ? 'bg-stone-900 text-white shadow-lg' : 'bg-stone-100 text-stone-900 hover:bg-stone-200'}`}
                                >
                                    Shop Solutions
                                </Button>
                            </div>
                        </motion.div>
                    ))}

                    {/* Quiz Promo Card (Premium) */}
                    <div
                        className="bg-stone-900 rounded-[32px] p-8 shadow-2xl text-white flex flex-col justify-center relative overflow-hidden group cursor-pointer min-h-[500px] lg:min-h-auto"
                        onClick={() => navigate('/skin-quiz')}
                    >
                        {/* Abstract Glows */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3" />
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/3" />
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10" />

                        <div className="relative z-10 flex flex-col h-full justify-between">
                            <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/10 mb-8">
                                <Zap className="w-6 h-6 text-yellow-300 animate-pulse" />
                            </div>

                            <div>
                                <h3 className="text-3xl md:text-4xl font-serif mb-4 leading-tight"> still <span className="italic text-rose-300">unsure?</span></h3>
                                <p className="text-white/60 text-lg mb-8 leading-relaxed font-light">
                                    Let our AI analyze your skin in 2 minutes to find your perfect match.
                                </p>
                            </div>

                            <Button className="w-full bg-white text-stone-900 hover:bg-rose-50 font-bold py-6 text-xs uppercase tracking-widest rounded-xl shadow-lg border-0 transition-transform active:scale-95">
                                Take Skin Quiz
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. PHILOSOPHY SECTION */}
            <div className="max-w-4xl mx-auto px-6 mt-32 text-center">
                <div className="inline-flex items-center gap-2 text-rose-500 font-bold uppercase tracking-[0.2em] text-xs mb-6">
                    <Sparkles className="w-4 h-4" /> Why Targeted Care?
                </div>
                <h2 className="text-3xl md:text-5xl font-serif mb-16 text-stone-900">Expert-Backed Philosophy</h2>

                <div className="grid md:grid-cols-3 gap-8 text-left">
                    {[
                        { title: "Precision", desc: "Target specific issues directly at the source for faster results.", icon: AlertCircle },
                        { title: "Balance", desc: "Formulas designed to treat concerns without disrupting the skin barrier.", icon: Droplets },
                        { title: "Efficacy", desc: "Clinically proven active ingredients at optimal concentrations.", icon: Check }
                    ].map((item, i) => (
                        <div key={i} className="bg-white p-8 rounded-3xl border border-stone-100 hover:border-rose-100 hover:shadow-xl hover:shadow-rose-900/5 transition-all duration-300 group">
                            <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center mb-6 text-rose-900 group-hover:scale-110 transition-transform">
                                <item.icon className="w-5 h-5" />
                            </div>
                            <h3 className="font-serif text-xl mb-3 text-stone-900">{item.title}</h3>
                            <p className="text-stone-500 text-sm leading-relaxed">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default ConcernPage;

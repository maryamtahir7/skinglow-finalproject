import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight, Check, RefreshCw, ChevronRight, Droplets, Sun, Moon, Shield, Star, ShoppingBag, Loader2 } from "lucide-react";
import { getProducts, addToCart } from "../backend/database";
import { useUser } from "../context/UserContext";
import { motion, AnimatePresence } from 'framer-motion';

const questions = [
    {
        id: 'name',
        type: 'text',
        question: "First things first, what's your beautiful name?",
        placeholder: "Type your name here",
        buttonText: "Let's Glow"
    },
    {
        id: 'type',
        question: "How would you describe your skin type on most days?",
        options: [
            { label: "Oily", value: "oily", desc: "Shiny t-zone, prone to breakouts", icon: <Droplets className="w-6 h-6" /> },
            { label: "Dry", value: "dry", desc: "Tight, flaky, or rough texture", icon: <Sun className="w-6 h-6" /> },
            { label: "Combination", value: "combo", desc: "Oily t-zone, dry cheeks", icon: <Moon className="w-6 h-6" /> },
            { label: "Normal", value: "normal", desc: "Balanced, few imperfections", icon: <Star className="w-6 h-6" /> }
        ]
    },
    {
        id: 'concern',
        question: "What is your main skin goal right now?",
        options: [
            { label: "Clear Acne & Blemishes", value: "acne", desc: "Target breakouts and clogged pores" },
            { label: "Prevent Aging & Wrinkles", value: "aging", desc: "Smooth fine lines and restore firmness" },
            { label: "Boost Radiance", value: "dullness", desc: "Brighten dullness and even out tone" },
            { label: "Soothe Sensitivity", value: "sensitivity", desc: "Calm redness and irritation" },
            { label: "Deep Hydration", value: "hydration", desc: "Quench dehydrated, thirsty skin" }
        ]
    },
    {
        id: 'sensitivity',
        question: "How sensitive is your skin to new products?",
        options: [
            { label: "Very Sensitive", value: "high", desc: "Reacts to almost everything" },
            { label: "Somewhat Sensitive", value: "medium", desc: "Reacts to strong actives sometimes" },
            { label: "Resilient", value: "low", desc: "I can handle most products like a pro" }
        ]
    }
];

export default function SkinQuiz() {
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState({});
    const [calculating, setCalculating] = useState(false);
    const [products, setProducts] = useState([]);
    const [recommendations, setRecommendations] = useState([]);
    const [loadingProducts, setLoadingProducts] = useState(true);
    const [inputValue, setInputValue] = useState("");
    const navigate = useNavigate();
    const { user } = useUser();

    // Fetch products on mount
    useEffect(() => {
        async function fetchProducts() {
            try {
                const res = await getProducts();
                setProducts(res.documents || []);
            } catch (error) {
                console.error("Failed to fetch products:", error);
            } finally {
                setLoadingProducts(false);
            }
        }
        fetchProducts();
    }, []);

    const handleAnswer = (value) => {
        const currentQ = questions[step];
        const newAnswers = { ...answers, [currentQ.id]: value };
        setAnswers(newAnswers);

        if (step < questions.length - 1) {
            setStep(prev => prev + 1);
            setInputValue("");
        } else {
            finishQuiz(newAnswers);
        }
    };

    const finishQuiz = (finalAnswers) => {
        setCalculating(true);
        // Simulate analysis delay with a slightly longer time to enjoy the premium animation
        setTimeout(() => {
            generateRoutine(finalAnswers);
            setCalculating(false);
            setStep(prev => prev + 1);
        }, 3000);
    };

    const generateRoutine = (userAnswers) => {
        if (!products.length) return;

        const routineSteps = [
            { type: "Cleanser", title: "Cleanse", desc: "Remove impurities without stripping." },
            { type: "Toner", title: "Prep", desc: "Balance pH and hydrate." },
            { type: "Serum", title: "Treat", desc: "Target your specific concerns." },
            { type: "Moisturizer", title: "Hydrate", desc: "Lock in moisture and repair barrier." },
            { type: "Sunscreen", title: "Protect", desc: "Daily defense against UV rays." }
        ];

        const recommended = routineSteps.map(step => {
            const categoryMatches = products.filter(p => {
                const cat = (typeof p.category === 'string' ? p.category : p.category?.name || "").toLowerCase();
                return cat.includes(step.type.toLowerCase()) ||
                    (step.type === "Sunscreen" && (cat.includes("spf") || cat.includes("sun")));
            });

            if (!categoryMatches.length) return null;

            const scoredProducts = categoryMatches.map(p => {
                let score = 0;
                const text = (p.description + " " + p.name).toLowerCase();
                
                if (userAnswers.type === 'oily' && (text.includes('oil-free') || text.includes('matte') || text.includes('pore'))) score += 5;
                if (userAnswers.type === 'dry' && (text.includes('hydat') || text.includes('rich') || text.includes('cream'))) score += 5;
                if (userAnswers.type === 'oily' && text.includes('rich cream')) score -= 5;
                if (userAnswers.concern === 'acne' && (text.includes('acne') || text.includes('clear') || text.includes('salicylic'))) score += 10;
                if (userAnswers.concern === 'aging' && (text.includes('age') || text.includes('wrinkle') || text.includes('firm'))) score += 10;
                if (userAnswers.concern === 'dullness' && (text.includes('glow') || text.includes('bright') || text.includes('vit c'))) score += 10;
                if (userAnswers.concern === 'sensitivity' && (text.includes('gentle') || text.includes('sooth') || text.includes('calm'))) score += 10;

                return { ...p, score };
            });

            scoredProducts.sort((a, b) => b.score - a.score || a.price - b.price);
            return { step: step, product: scoredProducts[0] };
        }).filter(Boolean);

        setRecommendations(recommended);
    };

    const handleAddToCart = async (product) => {
        if (!user) {
            navigate("/login");
            return;
        }
        try {
            await addToCart({
                userId: user.$id,
                productId: product.$id,
                quantity: 1
            });
            window.dispatchEvent(new Event('cart-updated'));
            alert(`Added ${product.name} to your cart! 🛍️`);
        } catch (error) {
            console.error(error);
            alert("Failed to add to cart");
        }
    };

    // Animation Variants
    const pageVariants = {
        initial: { opacity: 0, y: 30, scale: 0.98 },
        in: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
        out: { opacity: 0, y: -30, scale: 0.98, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } }
    };

    const listVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
    };

    if (loadingProducts) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
                <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
                <p className="text-slate-500 font-medium tracking-wide">Initializing Skin Database...</p>
            </div>
        );
    }

    if (calculating) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-rose-50 to-indigo-50 flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                    className="relative z-10 flex flex-col items-center"
                >
                    {/* Premium Scanner Animation */}
                    <div className="relative w-32 h-32 mb-8 flex items-center justify-center">
                        <motion.div 
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                            className="absolute inset-0 rounded-full border-t-2 border-r-2 border-primary/30"
                        />
                        <motion.div 
                            animate={{ rotate: -360 }}
                            transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
                            className="absolute inset-2 rounded-full border-b-2 border-l-2 border-primary/60"
                        />
                        <motion.div 
                            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                            className="absolute inset-8 bg-primary/10 rounded-full blur-md"
                        />
                        <Sparkles className="w-10 h-10 text-primary relative z-10" />
                    </div>
                    
                    <motion.h2 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-3xl md:text-4xl font-light text-slate-900 mb-3 tracking-tight"
                    >
                        Formulating Your <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-primary to-rose-400">Perfect Routine</span>
                    </motion.h2>
                    <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="text-slate-500 text-lg max-w-md font-medium"
                    >
                        Matching your skin profile against thousands of expert-curated formulas...
                    </motion.p>
                </motion.div>
            </div>
        );
    }

    if (step > questions.length - 1 && !calculating) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-16 px-4 md:px-8 overflow-hidden relative">
                {/* Decorative Background Elements */}
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-rose-100/50 blur-[100px] pointer-events-none" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-100/50 blur-[100px] pointer-events-none" />

                <div className="max-w-6xl mx-auto relative z-10">
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                        className="text-center mb-16"
                    >
                        <div className="inline-flex items-center gap-2 px-5 py-2 bg-white shadow-sm border border-slate-100 text-slate-600 rounded-full text-xs font-bold uppercase tracking-widest mb-6 backdrop-blur-md">
                            <Check className="w-4 h-4 text-green-500" /> Complete
                        </div>
                        <h1 className="text-5xl md:text-6xl font-extralight text-slate-900 mb-6 tracking-tight">
                            {answers.name ? <span className="font-medium">{answers.name}'s</span> : "Your"} Custom Regimen
                        </h1>
                        <p className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-light">
                            Crafted specifically for your <span className="font-semibold text-slate-800">{answers.type}</span> skin to target <span className="font-semibold text-slate-800">{answers.concern}</span>.
                        </p>
                    </motion.div>

                    <motion.div 
                        variants={listVariants}
                        initial="hidden"
                        animate="show"
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-20"
                    >
                        {recommendations.map((item, idx) => (
                            <motion.div
                                variants={itemVariants}
                                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                                key={idx}
                                className="group bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100/60 flex flex-col relative backdrop-blur-sm"
                            >
                                <div className="absolute top-4 left-4 w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-xs font-bold text-slate-400 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                                    {idx + 1}
                                </div>
                                <div className="absolute top-4 right-4 bg-primary/5 text-primary text-[10px] uppercase font-bold px-2 py-1 rounded-md tracking-wider">
                                    {item.step.type}
                                </div>

                                <div className="w-full h-48 bg-slate-50/50 rounded-2xl mb-6 mt-8 p-4 flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                                    <img
                                        src={item.product?.imageUrl || "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=300"}
                                        alt={item.product?.name}
                                        className="max-w-full max-h-full object-contain drop-shadow-sm"
                                    />
                                </div>

                                <div className="flex-1 flex flex-col">
                                    <h3 className="text-lg font-semibold text-slate-900 mb-2 leading-tight">
                                        {item.product?.name}
                                    </h3>
                                    <p className="text-sm text-slate-500 line-clamp-2 mb-4 font-light">
                                        {item.product?.description}
                                    </p>
                                    <div className="mt-auto">
                                        <div className="text-xl font-bold text-slate-900 mb-4">
                                            Rs. {item.product?.price?.toLocaleString()}
                                        </div>
                                        <Button
                                            onClick={() => handleAddToCart(item.product)}
                                            className="w-full bg-slate-900 hover:bg-primary text-white rounded-xl h-12 text-sm font-medium transition-colors"
                                        >
                                            <ShoppingBag className="w-4 h-4 mr-2" /> Add to Bag
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1 }}
                        className="bg-white/60 backdrop-blur-xl rounded-[2rem] p-10 md:p-14 text-center shadow-[0_8px_40px_rgb(0,0,0,0.03)] border border-white max-w-4xl mx-auto"
                    >
                        <h2 className="text-3xl font-light text-slate-900 mb-4 tracking-tight">Begin your journey today</h2>
                        <p className="text-slate-500 mb-8 max-w-xl mx-auto text-lg font-light">Create an account to save these results and track your skin's transformation over time.</p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <Button onClick={() => navigate('/signup')} size="lg" className="bg-primary text-white hover:bg-primary/90 rounded-full px-8 h-14 text-base">
                                Create Free Account
                            </Button>
                            <Button variant="ghost" size="lg" onClick={() => { setStep(0); setAnswers({}); setRecommendations([]); }} className="rounded-full px-8 h-14 text-slate-500 hover:bg-slate-100 text-base">
                                <RefreshCw className="w-4 h-4 mr-2" /> Retake Quiz
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </div>
        );
    }

    const currentQ = questions[step];
    const progress = ((step) / questions.length) * 100;

    return (
        <div className="min-h-screen bg-[#FAFAFA] flex flex-col relative overflow-hidden font-sans">
            {/* Elegant Background Blurs */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-rose-100/40 rounded-full blur-[120px] mix-blend-multiply pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-100/30 rounded-full blur-[120px] mix-blend-multiply pointer-events-none" />

            {/* Premium Header/Progress */}
            <header className="w-full p-6 md:p-8 flex justify-center z-10">
                <div className="w-full max-w-3xl flex items-center gap-4">
                    <button 
                        onClick={() => navigate(-1)} 
                        className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-400 hover:text-slate-900 hover:shadow-md transition-all"
                    >
                        <ChevronRight className="w-5 h-5 rotate-180" />
                    </button>
                    <div className="flex-1 h-1.5 bg-slate-200/50 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                            className="h-full bg-slate-800 rounded-full"
                        />
                    </div>
                    <span className="text-xs font-bold tracking-widest text-slate-400 uppercase w-12 text-right">
                        {step + 1}/{questions.length}
                    </span>
                </div>
            </header>

            <div className="flex-1 flex flex-col items-center justify-center p-6 z-10">
                <div className="w-full max-w-3xl">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={step}
                            variants={pageVariants}
                            initial="initial"
                            animate="in"
                            exit="out"
                            className="w-full"
                        >
                            <h2 className="text-3xl md:text-5xl font-light text-slate-900 leading-[1.2] mb-12 tracking-tight">
                                {currentQ.question}
                            </h2>

                            {currentQ.type === 'text' && (
                                <div className="space-y-10">
                                    <input
                                        type="text"
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && inputValue.trim() && handleAnswer(inputValue)}
                                        placeholder={currentQ.placeholder}
                                        className="w-full text-3xl md:text-5xl text-slate-800 border-b border-slate-300 py-4 bg-transparent outline-none focus:border-slate-800 placeholder:text-slate-300 transition-colors font-light"
                                        autoFocus
                                    />
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => handleAnswer(inputValue)}
                                        disabled={!inputValue.trim()}
                                        className="w-full md:w-auto min-w-[220px] h-16 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-full text-lg font-medium flex items-center justify-center transition-colors px-8"
                                    >
                                        {currentQ.buttonText || "Continue"} <ArrowRight className="w-5 h-5 ml-3" />
                                    </motion.button>
                                </div>
                            )}

                            {!currentQ.type && (
                                <motion.div 
                                    variants={listVariants}
                                    initial="hidden"
                                    animate="show"
                                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                                >
                                    {currentQ.options.map((opt) => (
                                        <motion.button
                                            variants={itemVariants}
                                            whileHover={{ scale: 1.02, y: -2 }}
                                            whileTap={{ scale: 0.98 }}
                                            key={opt.value}
                                            onClick={() => handleAnswer(opt.value)}
                                            className="group relative bg-white p-8 rounded-3xl text-left shadow-[0_2px_10px_rgb(0,0,0,0.02)] hover:shadow-[0_10px_30px_rgb(0,0,0,0.06)] border border-slate-100 transition-all duration-300 flex flex-col justify-between min-h-[140px]"
                                        >
                                            <div className="flex items-start justify-between mb-4">
                                                <span className="font-semibold text-xl text-slate-800 group-hover:text-primary transition-colors">
                                                    {opt.label}
                                                </span>
                                                {opt.icon && (
                                                    <span className="text-slate-300 group-hover:text-primary group-hover:scale-110 transition-all duration-300">
                                                        {opt.icon}
                                                    </span>
                                                )}
                                            </div>
                                            {opt.desc && (
                                                <p className="text-slate-500 font-light group-hover:text-slate-600 transition-colors">
                                                    {opt.desc}
                                                </p>
                                            )}
                                            {/* Glowing border effect on hover */}
                                            <div className="absolute inset-0 border-2 border-primary rounded-3xl opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 pointer-events-none" />
                                        </motion.button>
                                    ))}
                                </motion.div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}

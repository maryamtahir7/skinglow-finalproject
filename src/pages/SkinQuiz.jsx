import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight, Check, RefreshCw, ChevronRight, Droplets, Sun, Moon, Shield, Star, ShoppingBag, Loader2 } from "lucide-react";
import { getProducts, addToCart } from "../backend/database";
import { useUser } from "../context/UserContext";

const questions = [
    {
        id: 'name',
        type: 'text',
        question: "First things first, what's your name?",
        placeholder: "Enter your name",
        buttonText: "Let's Glow"
    },
    {
        id: 'type',
        question: "How would you describe your skin type?",
        options: [
            { label: "Oily", value: "oily", desc: "Shiny t-zone, prone to breakouts", icon: <Droplets className="w-5 h-5" /> },
            { label: "Dry", value: "dry", desc: "Tight, flaky, or rough texture", icon: <Sun className="w-5 h-5" /> },
            { label: "Combination", value: "combo", desc: "Oily t-zone, dry cheeks", icon: <Moon className="w-5 h-5" /> },
            { label: "Normal", value: "normal", desc: "Balanced, few imperfections", icon: <Star className="w-5 h-5" /> }
        ]
    },
    {
        id: 'concern',
        question: "What is your main skin concern? (Select one)",
        options: [
            { label: "Acne & Blemishes", value: "acne", desc: "Breakouts, clogged pores" },
            { label: "Aging & Wrinkles", value: "aging", desc: "Fine lines, loss of firmness" },
            { label: "Dullness", value: "dullness", desc: "Lack of radiance, uneven tone" },
            { label: "Sensitivity", value: "sensitivity", desc: "Redness, irritation" },
            { label: "Hydration", value: "hydration", desc: "Dehydrated, tight skin" }
        ]
    },
    {
        id: 'sensitivity',
        question: "How sensitive is your skin?",
        options: [
            { label: "Very Sensitive", value: "high", desc: "Reacts to almost everything" },
            { label: "Somewhat Sensitive", value: "medium", desc: "Reacts to strong actives" },
            { label: "Resilient", value: "low", desc: "I can handle most products" }
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
            setInputValue(""); // Reset text input if any
        } else {
            finishQuiz(newAnswers);
        }
    };

    const finishQuiz = (finalAnswers) => {
        setCalculating(true);
        // Simulate analysis delay
        setTimeout(() => {
            generateRoutine(finalAnswers);
            setCalculating(false);
            setStep(prev => prev + 1);
        }, 2000);
    };

    const generateRoutine = (userAnswers) => {
        if (!products.length) return;

        // Basic Routine Structure
        const routineSteps = [
            { type: "Cleanser", title: "Cleanse", desc: "Remove impurities without stripping." },
            { type: "Toner", title: "Prep", desc: "Balance pH and hydrate." },
            { type: "Serum", title: "Treat", desc: "Target your specific concerns." },
            { type: "Moisturizer", title: "Hydrate", desc: "Lock in moisture and repair barrier." },
            { type: "Sunscreen", title: "Protect", desc: "Daily defense against UV rays." }
        ];

        const recommended = routineSteps.map(step => {
            // Filter by category (case insensitive partial match)
            // Note: In a real app, use precise category IDs or slugs.
            const categoryMatches = products.filter(p => {
                const cat = (typeof p.category === 'string' ? p.category : p.category?.name || "").toLowerCase();
                return cat.includes(step.type.toLowerCase()) ||
                    (step.type === "Sunscreen" && (cat.includes("spf") || cat.includes("sun")));
            });

            if (!categoryMatches.length) return null;

            // Scoring System
            const scoredProducts = categoryMatches.map(p => {
                let score = 0;
                const text = (p.description + " " + p.name).toLowerCase();

                // Skin Type Match
                if (userAnswers.type === 'oily' && (text.includes('oil-free') || text.includes('matte') || text.includes('pore'))) score += 5;
                if (userAnswers.type === 'dry' && (text.includes('hydat') || text.includes('rich') || text.includes('cream'))) score += 5;
                if (userAnswers.type === 'oily' && text.includes('rich cream')) score -= 5; // Avoid heavy creams for oily

                // Concern Match
                if (userAnswers.concern === 'acne' && (text.includes('acne') || text.includes('clear') || text.includes('salicylic'))) score += 10;
                if (userAnswers.concern === 'aging' && (text.includes('age') || text.includes('wrinkle') || text.includes('firm'))) score += 10;
                if (userAnswers.concern === 'dullness' && (text.includes('glow') || text.includes('bright') || text.includes('vit c'))) score += 10;
                if (userAnswers.concern === 'sensitivity' && (text.includes('gentle') || text.includes('sooth') || text.includes('calm'))) score += 10;

                return { ...p, score };
            });

            // Sort by score desc, price asc as tie breaker
            scoredProducts.sort((a, b) => b.score - a.score || a.price - b.price);

            return {
                step: step,
                product: scoredProducts[0]
            };
        }).filter(Boolean); // Remove empty steps

        setRecommendations(recommended);
    };

    const handleAddToCart = async (product) => {
        if (!user) {
            navigate("/login");
            return;
        }
        try {
            await addToCart(user.$id, product, 1);
            alert(`Added ${product.name} to your cart!`);
        } catch (error) {
            console.error(error);
            alert("Failed to add to cart");
        }
    };

    // --- RENDER STATES ---

    if (loadingProducts) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center">
                <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
                <p className="text-muted-foreground animate-pulse">Loading skincare database...</p>
            </div>
        );
    }

    // Calculating State
    if (calculating) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-primary/5 animate-pulse" />
                <div className="relative z-10 flex flex-col items-center">
                    <div className="w-20 h-20 bg-white rounded-full shadow-xl flex items-center justify-center mb-6">
                        <Sparkles className="w-10 h-10 text-primary animate-spin-slow" />
                    </div>
                    <h2 className="text-3xl font-bold text-foreground mb-2">Analyzing Your Skin Profile</h2>
                    <p className="text-muted-foreground text-lg max-w-md">
                        We are scanning over {products.length} products to find your perfect match...
                    </p>

                    <div className="mt-8 flex gap-2">
                        {[0, 1, 2].map(i => (
                            <div key={i} className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // Results State
    if (step > questions.length - 1 && !calculating) {
        return (
            <div className="min-h-screen bg-slate-50 py-12 px-4 md:px-8">
                <div className="max-w-5xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-16 animate-in slide-in-from-bottom-5 fade-in duration-700">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-bold uppercase tracking-wider mb-6">
                            <Check className="w-4 h-4" /> Analysis Complete
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
                            {answers.name ? `${answers.name}'s` : "Your"} Custom Routine
                        </h1>
                        <p className="text-slate-600 text-xl max-w-2xl mx-auto leading-relaxed">
                            Based on your <strong>{answers.type}</strong> skin and focus on <strong>{answers.concern}</strong>,
                            we've curated this regimen to help you achieve your goals.
                        </p>
                    </div>

                    {/* Recommendations Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
                        {recommendations.map((item, idx) => (
                            <div
                                key={idx}
                                className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300 flex flex-col sm:flex-row gap-6 group animate-in slide-in-from-bottom-4 fade-in"
                                style={{ animationDelay: `${idx * 100}ms` }}
                            >
                                {/* Step Indicator */}
                                <div className="absolute -top-3 -left-3 w-8 h-8 bg-slate-900 text-white rounded-lg flex items-center justify-center font-bold text-sm shadow-lg z-10">
                                    {idx + 1}
                                </div>

                                {/* Product Image */}
                                <div className="w-full sm:w-40 h-40 bg-slate-50 rounded-xl flex items-center justify-center p-4 relative overflow-hidden shrink-0">
                                    <img
                                        src={item.product?.imageUrl || "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=300"}
                                        alt={item.product?.name}
                                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                                    />
                                </div>

                                {/* Content */}
                                <div className="flex-1 flex flex-col">
                                    <div className="mb-auto">
                                        <div className="text-xs font-bold text-primary uppercase tracking-widest mb-1">{item.step.type}</div>
                                        <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-primary transition-colors">
                                            {item.product?.name}
                                        </h3>
                                        <p className="text-sm text-slate-500 mb-3 line-clamp-2">
                                            {item.product?.description}
                                        </p>
                                        <div className="font-bold text-lg text-slate-900">
                                            Rs. {item.product?.price?.toLocaleString()}
                                        </div>
                                    </div>

                                    <div className="mt-4 pt-4 border-t border-slate-100 flex gap-3">
                                        <Button
                                            onClick={() => handleAddToCart(item.product)}
                                            className="flex-1 bg-primary text-white hover:bg-primary/90"
                                        >
                                            <ShoppingBag className="w-4 h-4 mr-2" /> Add to Bag
                                        </Button>
                                        <Button
                                            variant="outline"
                                            onClick={() => navigate(`/products/${item.product.$id}`)}
                                        >
                                            View
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Footer Actions */}
                    <div className="bg-white rounded-3xl p-8 md:p-12 text-center shadow-sm border border-slate-100">
                        <h2 className="text-2xl font-bold mb-4">Start your journey to better skin</h2>
                        <p className="text-slate-500 mb-8">Save your results and track your progress by creating an account.</p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <Button onClick={() => navigate('/signup')} size="lg" className="bg-slate-900 text-white hover:bg-slate-800">
                                Create Free Account
                            </Button>
                            <Button variant="outline" size="lg" onClick={() => { setStep(0); setAnswers({}); setRecommendations([]); }}>
                                <RefreshCw className="w-4 h-4 mr-2" /> Retake Quiz
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Questions State
    const currentQ = questions[step];

    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* Progress Header */}
            <div className="w-full h-2 bg-slate-100">
                <div
                    className="h-full bg-primary transition-all duration-500 ease-out"
                    style={{ width: `${((step) / questions.length) * 100}%` }}
                />
            </div>

            <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="w-full max-w-2xl">
                    <div className="mb-12 text-center md:text-left">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">
                            Question {step + 1} of {questions.length}
                        </span>
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight">
                            {currentQ.question}
                        </h2>
                    </div>

                    {/* Text Input Type */}
                    {currentQ.type === 'text' && (
                        <div className="space-y-6">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && inputValue.trim() && handleAnswer(inputValue)}
                                placeholder={currentQ.placeholder}
                                className="w-full text-2xl md:text-4xl border-b-2 border-slate-200 py-4 bg-transparent outline-none focus:border-primary placeholder:text-slate-300 transition-colors"
                                autoFocus
                            />
                            <Button
                                onClick={() => handleAnswer(inputValue)}
                                disabled={!inputValue.trim()}
                                size="lg"
                                className="w-full md:w-auto min-w-[200px] text-lg h-14 bg-primary hover:bg-primary/90 text-white rounded-full"
                            >
                                {currentQ.buttonText || "Next"} <ArrowRight className="w-5 h-5 ml-2" />
                            </Button>
                        </div>
                    )}

                    {/* Options Type */}
                    {!currentQ.type && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {currentQ.options.map((opt) => (
                                <button
                                    key={opt.value}
                                    onClick={() => handleAnswer(opt.value)}
                                    className="group relative bg-white border-2 border-slate-100 p-6 rounded-2xl text-left hover:border-primary hover:shadow-lg transition-all duration-300"
                                >
                                    <div className="flex items-start justify-between mb-2">
                                        <span className="font-bold text-lg text-slate-900 group-hover:text-primary transition-colors">
                                            {opt.label}
                                        </span>
                                        {opt.icon && <span className="text-primary opacity-50 group-hover:opacity-100 transition-opacity">{opt.icon}</span>}
                                    </div>
                                    {opt.desc && (
                                        <p className="text-sm text-slate-500 group-hover:text-slate-600">
                                            {opt.desc}
                                        </p>
                                    )}
                                    <div className="absolute inset-0 border-2 border-primary rounded-2xl opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 pointer-events-none" />
                                </button>
                            ))}
                        </div>
                    )}

                    {step > 0 && (
                        <button
                            onClick={() => setStep(prev => prev - 1)}
                            className="mt-12 text-slate-400 hover:text-slate-600 flex items-center gap-2 text-sm font-medium transition-colors"
                        >
                            <ChevronRight className="w-4 h-4 rotate-180" /> Back to previous
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

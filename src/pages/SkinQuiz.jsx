import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight, Check, RefreshCw } from "lucide-react";

const questions = [
    {
        id: 'type',
        question: "How would you describe your skin type?",
        options: [
            { label: "Oily", value: "oily", desc: "Shiny t-zone, prone to breakouts" },
            { label: "Dry", value: "dry", desc: "Tight, flaky, or rough texture" },
            { label: "Combination", value: "combo", desc: "Oily t-zone, dry cheeks" },
            { label: "Normal", value: "normal", desc: "Balanced, few imperfections" }
        ]
    },
    {
        id: 'concern',
        question: "What is your main skin concern?",
        options: [
            { label: "Acne & Blemishes", value: "acne" },
            { label: "Aging & Wrinkles", value: "aging" },
            { label: "Dullness", value: "dullness" },
            { label: "Sensitivity", value: "sensitivity" }
        ]
    },
    {
        id: 'sensitivity',
        question: "Is your skin sensitive?",
        options: [
            { label: "Yes, very sensitive", value: "high" },
            { label: "Sometimes", value: "medium" },
            { label: "No, pretty resilient", value: "low" }
        ]
    }
];

export default function SkinQuiz() {
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState({});
    const [calculating, setCalculating] = useState(false);
    const navigate = useNavigate();

    const handleAnswer = (value) => {
        const currentQ = questions[step];
        setAnswers(prev => ({ ...prev, [currentQ.id]: value }));

        if (step < questions.length - 1) {
            setStep(prev => prev + 1);
        } else {
            setCalculating(true);
            setTimeout(() => {
                setCalculating(false);
                setStep(prev => prev + 1); // Move to results
            }, 1500);
        }
    };

    const getRecommendation = () => {
        // Basic logic mapping
        const routine = [
            { step: 1, type: "Cleanser", name: "Gentle Foam Cleanser", desc: "Start with a clean canvas." },
            { step: 2, type: "Toner", name: "Balancing Toner", desc: "Prep your skin for better absorption." },
            { step: 3, type: "Treatment", name: answers.concern === 'acne' ? "Clarifying Serum" : "Glow Serum", desc: "Target your specific concerns." },
            { step: 4, type: "Moisturizer", name: answers.type === 'oily' ? "Gel Moisturizer" : "Rich Cream", desc: "Lock in hydration." },
            { step: 5, type: "SPF", name: "Invisible Sunscreen", desc: "Protect against UV damage." }
        ];
        return routine;
    };

    if (calculating) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
                <Sparkles className="w-16 h-16 text-primary animate-pulse mb-6" />
                <h2 className="text-2xl font-bold text-foreground">Analyzing your profile...</h2>
                <p className="text-muted-foreground mt-2">Our AI is curating your perfect routine.</p>
            </div>
        );
    }

    // Results View
    if (step >= questions.length) {
        const routine = getRecommendation();
        return (
            <div className="min-h-screen bg-background py-12 px-6">
                <div className="max-w-3xl mx-auto">
                    <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-5 duration-700">
                        <span className="text-xs font-bold text-primary uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full">Your Analysis</span>
                        <h1 className="text-4xl font-bold mt-4 mb-4">Your Personalized Glow Routine</h1>
                        <p className="text-muted-foreground">
                            Based on your <strong>{answers.type}</strong> skin and <strong>{answers.concern}</strong> concerns,
                            we've designed this simpler, effective regimen for you.
                        </p>
                    </div>

                    <div className="space-y-6 mb-12">
                        {routine.map((item, idx) => (
                            <div
                                key={idx}
                                className="bg-card border border-border rounded-xl p-6 flex flex-col sm:flex-row items-center gap-6 shadow-sm hover:shadow-md transition-all animate-in fade-in slide-in-from-bottom-2"
                                style={{ animationDelay: `${idx * 150}ms` }}
                            >
                                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg shrink-0">
                                    {item.step}
                                </div>
                                <div className="flex-1 text-center sm:text-left">
                                    <div className="text-xs font-bold text-primary uppercase tracking-wider mb-1">{item.type}</div>
                                    <h3 className="font-bold text-lg text-foreground">{item.name}</h3>
                                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                                </div>
                                <Button
                                    variant="outline"
                                    onClick={() => navigate(`/products?category=${item.type}`)}
                                    className="shrink-0 group"
                                >
                                    Shop {item.type} <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </div>
                        ))}
                    </div>

                    <div className="text-center bg-secondary/30 p-8 rounded-2xl">
                        <h3 className="font-bold text-lg mb-2">Want to save this routine?</h3>
                        <p className="text-muted-foreground text-sm mb-6">Create an account to track your progress and get member-only discounts.</p>
                        <div className="flex justify-center gap-4">
                            <Button onClick={() => navigate('/signup')} className="bg-primary text-white">Sign Up Free</Button>
                            <Button variant="ghost" onClick={() => { setStep(0); setAnswers({}); }}>
                                <RefreshCw className="w-4 h-4 mr-2" /> Retake Quiz
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Question View
    const currentQ = questions[step];

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
            <div className="w-full max-w-lg">
                {/* Progress */}
                <div className="w-full bg-secondary h-2 rounded-full mb-12 overflow-hidden">
                    <div
                        className="bg-primary h-full transition-all duration-500 ease-out"
                        style={{ width: `${((step + 1) / questions.length) * 100}%` }}
                    />
                </div>

                <div className="text-center mb-10 animate-in fade-in zoom-in duration-300">
                    <h2 className="text-3xl font-bold mb-4 leading-tight">{currentQ.question}</h2>
                </div>

                <div className="grid gap-4">
                    {currentQ.options.map((opt) => (
                        <button
                            key={opt.value}
                            onClick={() => handleAnswer(opt.value)}
                            className="group bg-card hover:bg-primary/5 border border-border hover:border-primary p-6 rounded-xl text-left transition-all hover:scale-102 hover:shadow-lg flex items-center justify-between"
                        >
                            <div>
                                <div className="font-bold text-lg group-hover:text-primary transition-colors">{opt.label}</div>
                                {opt.desc && <div className="text-sm text-muted-foreground mt-1">{opt.desc}</div>}
                            </div>
                            <ArrowRight className="w-5 h-5 text-border group-hover:text-primary transition-colors transform group-hover:translate-x-1" />
                        </button>
                    ))}
                </div>

                {step > 0 && (
                    <button
                        onClick={() => setStep(prev => prev - 1)}
                        className="mt-8 text-sm text-muted-foreground hover:text-foreground w-full text-center"
                    >
                        Back to previous step
                    </button>
                )}
            </div>
        </div>
    );
}

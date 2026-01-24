import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Sun, Moon, ArrowRight, Sparkles, CheckCircle2, Circle, ShoppingBag, Info, RefreshCw, Trash2 } from "lucide-react";
import { getProducts, addToCart } from "../backend/database";
import { useUser } from "../context/UserContext";

function RoutinePage() {
    const navigate = useNavigate();
    const { user } = useUser();

    // State
    const [activeRoutine, setActiveRoutine] = useState('AM');
    const [completedSteps, setCompletedSteps] = useState({});
    const [products, setProducts] = useState([]);
    const [recommendations, setRecommendations] = useState({});
    const [loading, setLoading] = useState(true);

    // Initialize based on time of day
    useEffect(() => {
        const hour = new Date().getHours();
        const initialRoutine = (hour >= 5 && hour < 18) ? 'AM' : 'PM';
        setActiveRoutine(initialRoutine);

        // Load saved progress
        const saved = localStorage.getItem('skinglow_routine_progress');
        if (saved) {
            const parsed = JSON.parse(saved);
            const lastDate = localStorage.getItem('skinglow_routine_date');
            const today = new Date().toDateString();
            if (lastDate !== today) {
                setCompletedSteps({});
                localStorage.setItem('skinglow_routine_date', today);
            } else {
                setCompletedSteps(parsed);
            }
        }
    }, []);

    // Save progress
    useEffect(() => {
        localStorage.setItem('skinglow_routine_progress', JSON.stringify(completedSteps));
    }, [completedSteps]);

    // Fetch products and generate recommendations
    useEffect(() => {
        async function fetchData() {
            try {
                const res = await getProducts();
                if (res.documents) {
                    setProducts(res.documents);
                }
            } catch (error) {
                console.error("Failed to fetch products for routine", error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    // Generate initial recommendations when products load or routine changes
    useEffect(() => {
        if (products.length > 0) {
            const newRecs = {};
            const steps = activeRoutine === 'AM' ? stepsAM : stepsPM;

            steps.forEach(step => {
                // Only generate if not already there to preserve swaps
                if (!recommendations[step.id]) {
                    const match = findProductForType(step.type, products);
                    if (match) newRecs[step.id] = match;
                }
            });

            if (Object.keys(newRecs).length > 0) {
                setRecommendations(prev => ({ ...prev, ...newRecs }));
            }
        }
    }, [products, activeRoutine]);

    const stepsAM = [
        { id: 'am_1', title: "Cleanser", desc: "Remove overnight impurities.", type: "Cleanser" },
        { id: 'am_2', title: "Toner", desc: "Balance pH and prep.", type: "Toner" },
        { id: 'am_3', title: "Vitamin C", desc: "Brighten and protect.", type: "Serum" },
        { id: 'am_4', title: "Moisturizer", desc: "Hydrate for the day.", type: "Moisturizer" },
        { id: 'am_5', title: "SPF", desc: "Protect from UV rays.", type: "Sunscreen" },
    ];

    const stepsPM = [
        { id: 'pm_1', title: "Double Cleanse", desc: "Remove makeup and SPF.", type: "Cleanser" },
        { id: 'pm_2', title: "Exfoliate/Treat", desc: "Target specific concerns.", type: "Treatment" },
        { id: 'pm_3', title: "Serums", desc: "Deep nourishment.", type: "Serum" },
        { id: 'pm_4', title: "Moisturizer", desc: "Lock in hydration.", type: "Moisturizer" },
        { id: 'pm_5', title: "Face Oil", desc: "Seal with overnight repair.", type: "Oil" },
    ];

    const currentSteps = activeRoutine === 'AM' ? stepsAM : stepsPM;

    // Calculate progress
    const amProgress = stepsAM.filter(s => completedSteps[s.id]).length / stepsAM.length * 100;
    const pmProgress = stepsPM.filter(s => completedSteps[s.id]).length / stepsPM.length * 100;

    const toggleStep = (id) => {
        setCompletedSteps(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const findProductForType = (type, allProducts, excludeId = null) => {
        const matches = allProducts.filter(p => {
            if (excludeId && p.$id === excludeId) return false;

            const cat = (typeof p.category === 'string' ? p.category : p.category?.name || "").toLowerCase();
            const typeLower = type.toLowerCase();
            return cat.includes(typeLower) ||
                (typeLower === 'treatment' && (cat.includes('serum') || cat.includes('acid'))) ||
                (typeLower === 'oil' && cat.includes('oil')) ||
                (typeLower === 'sunscreen' && (cat.includes('spf') || cat.includes('sun')));
        });

        if (matches.length === 0) return null;
        // Return random match
        return matches[Math.floor(Math.random() * matches.length)];
    };

    const handleSwapProduct = (stepId, type) => {
        const currentRec = recommendations[stepId];
        const newRec = findProductForType(type, products, currentRec?.$id);

        if (newRec) {
            setRecommendations(prev => ({
                ...prev,
                [stepId]: newRec
            }));
        } else {
            alert("No other products found for this category.");
        }
    };

    // Routine Bag State
    // Routine Bag Logic Moved to RoutineBagPage.jsx

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
            alert(`Added ${product.name} to your Shopping Cart! 🛒`);
        } catch (err) {
            console.error(err);
            alert("Failed to add to cart.");
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-16">
            {/* ... Hero Section code remains mostly same, skipping for brevity in replacement if possible, 
                but I need to replace the whole block correctly. I will replace the main render loop. 
            */}
            {/* Hero Section */}
            <div className={`relative overflow-hidden transition-colors duration-700 ${activeRoutine === 'AM' ? 'bg-orange-50/80' : 'bg-slate-900 text-white'}`}>
                <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
                    {activeRoutine === 'AM'
                        ? <Sun className="w-64 h-64 text-orange-400 rotate-12" />
                        : <Moon className="w-64 h-64 text-indigo-400 -rotate-12" />
                    }
                </div>

                <div className="max-w-4xl mx-auto px-4 sm:px-6 py-14 sm:py-20 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sm font-bold mb-6">
                        <Sparkles className="w-4 h-4" /> Daily Skincare Tracker
                    </div>
                    <h1 className="text-3xl md:text-6xl font-bold mb-4 sm:mb-6 leading-tight transition-all duration-500">
                        Good {activeRoutine === 'AM' ? 'Morning' : 'Evening'}, {user ? user.name.split(' ')[0] : 'Beautiful'}
                    </h1>
                    <p className={`text-base sm:text-lg max-w-2xl mx-auto mb-8 sm:mb-10 ${activeRoutine === 'AM' ? 'text-slate-600' : 'text-slate-300'}`}>
                        {activeRoutine === 'AM'
                            ? "Ready to protect and brighten your skin for the day ahead?"
                            : "Time to unwind, repair, and prepare for a restful sleep."}
                    </p>

                    {/* Toggle Switch */}
                    <div className="inline-flex bg-white/20 backdrop-blur-md p-1 rounded-full border border-white/20 shadow-lg relative text-xs sm:text-sm">
                        <div
                            className={`absolute top-1 bottom-1 w-[calc(50%-6px)] bg-white rounded-full shadow-md transition-all duration-300 ease-spring ${activeRoutine === 'PM' ? 'translate-x-full left-1.5' : 'left-1.5'}`}
                        />
                        <button
                            onClick={() => setActiveRoutine('AM')}
                            className={`relative z-10 px-4 sm:px-6 py-2 sm:py-3 rounded-full font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-colors ${activeRoutine === 'AM' ? (activeRoutine === 'AM' ? 'text-slate-800' : 'text-slate-900') : 'text-white/70 hover:text-white'}`}
                        >
                            <Sun className="w-4 h-4" /> AM Routine
                        </button>
                        <button
                            onClick={() => setActiveRoutine('PM')}
                            className={`relative z-10 px-4 sm:px-6 py-2 sm:py-3 rounded-full font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-colors ${activeRoutine === 'PM' ? 'text-slate-900' : (activeRoutine === 'AM' ? 'text-slate-600 hover:text-slate-900' : 'text-white/70')}`}
                        >
                            <Moon className="w-4 h-4" /> PM Routine
                        </button>
                    </div>
                </div>
            </div>

            {/* My Routine Bag Section Removed - Moved to /routine-bag */}

            {/* Progress Bar Container */}
            <div className="sticky top-[64px] z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 px-4 sm:px-6 py-2.5 shadow-sm">
                <div className="max-w-3xl mx-auto flex items-center gap-3">
                    <div className="flex-1">
                        <div className="flex justify-between text-[10px] sm:text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">
                            <span>Todays Progress</span>
                            <span>{Math.round((amProgress + pmProgress) / 2)}% Completed</span>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-primary transition-all duration-500" style={{ width: `${(amProgress + pmProgress) / 2}%` }} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
                <div className="space-y-4 sm:space-y-6">
                    {currentSteps.map((step, index) => {
                        const isCompleted = completedSteps[step.id];
                        const recommendedProduct = recommendations[step.id];

                        return (
                            <div
                                key={step.id}
                                className={`group relative bg-white border border-slate-100 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm transition-all duration-300 ${isCompleted ? 'opacity-70 bg-slate-50' : 'hover:shadow-md hover:border-primary/30 active:scale-[0.98]'}`}
                            >
                                {/* Connector Line */}
                                {index !== currentSteps.length - 1 && (
                                    <div className="hidden sm:block absolute left-8 sm:left-9 bottom-0 top-16 sm:top-20 w-px bg-slate-100 -z-10 group-hover:bg-primary/10 transition-colors" />
                                )}

                                <div className="flex gap-3 sm:gap-4 md:gap-6 items-start">
                                    {/* Checkbox */}
                                    <button
                                        onClick={() => toggleStep(step.id)}
                                        className={`flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all duration-300 active:scale-95 ${isCompleted ? 'bg-green-500 text-white scale-110' : 'bg-white border-2 border-slate-200 text-slate-300 hover:border-primary hover:text-primary'}`}
                                        aria-label={`Mark ${step.title} as ${isCompleted ? 'incomplete' : 'complete'}`}
                                    >
                                        {isCompleted ? <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" /> : <Circle className="w-4 h-4 sm:w-5 sm:h-5" />}
                                    </button>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-2 mb-2">
                                            <h3 className={`text-base sm:text-lg md:text-xl font-bold transition-colors ${isCompleted ? 'text-slate-500 line-through' : 'text-slate-800'}`}>
                                                {step.title}
                                            </h3>
                                            <span className="text-[10px] sm:text-xs font-semibold px-2 py-0.5 sm:py-1 bg-slate-100 text-slate-500 rounded-md w-fit">
                                                Step {index + 1}
                                            </span>
                                        </div>
                                        <p className="text-slate-500 text-xs sm:text-sm mb-3 sm:mb-4 leading-relaxed">{step.desc}</p>

                                        {/* Product Recommendation Card */}
                                        {!isCompleted && recommendedProduct && (
                                            <div className="mt-3 sm:mt-4 bg-slate-50/80 border border-slate-100 rounded-lg sm:rounded-xl p-2.5 sm:p-3 flex items-center gap-2.5 sm:gap-3 md:gap-4 animate-in slide-in-from-top-2 fade-in group/card">
                                                <div className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 bg-white rounded-lg border border-slate-100 p-1 flex-shrink-0">
                                                    <img
                                                        src={recommendedProduct.imageUrl || "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=100"}
                                                        alt={recommendedProduct.name}
                                                        className="w-full h-full object-contain"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2">
                                                        <div className="text-[9px] sm:text-[10px] font-bold text-primary uppercase leading-tight">Recommended</div>
                                                    </div>
                                                    <div className="font-medium text-xs sm:text-sm text-slate-900 truncate leading-tight">{recommendedProduct.name}</div>
                                                </div>

                                                <div className="flex gap-1">
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        className="h-7 w-7 sm:h-8 sm:w-8 text-slate-400 hover:text-primary hover:bg-white"
                                                        onClick={() => handleSwapProduct(step.id, step.type)}
                                                        title="Swap Product"
                                                    >
                                                        <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4" />
                                                    </Button>

                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="h-7 sm:h-8 text-[10px] sm:text-xs bg-white hover:bg-primary hover:text-white transition-colors active:scale-95 px-2 sm:px-3"
                                                        onClick={() => handleAddToCart(recommendedProduct)}
                                                    >
                                                        <ShoppingBag className="w-3 h-3 sm:mr-1.5" />
                                                        <span className="hidden sm:inline">Add</span>
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="mt-10 sm:mt-16 text-center">
                    <div className="bg-primary/5 border border-primary/10 rounded-xl sm:rounded-2xl p-6 sm:p-8 max-w-xl mx-auto">
                        <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2">Want a fully personalized plan?</h3>
                        <p className="text-slate-600 mb-4 sm:mb-6 text-xs sm:text-sm leading-relaxed px-2">
                            Take our 2-minute skin analysis to get a routine catered exactly to your skin type and concerns.
                        </p>
                        <Button
                            onClick={() => navigate('/skin-quiz')}
                            className="bg-primary text-white rounded-full px-5 sm:px-6 h-10 sm:h-11 text-sm active:scale-95"
                        >
                            <RefreshCw className="w-4 h-4 mr-2" /> Take Skin Quiz
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RoutinePage;

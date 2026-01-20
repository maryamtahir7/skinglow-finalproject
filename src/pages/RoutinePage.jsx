import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Sun, Moon, ArrowRight, Sparkles } from "lucide-react";

function RoutinePage() {
    const navigate = useNavigate();

    const stepsAM = [
        { title: "Cleanser", desc: "Remove overnight impurities.", icon: Sparkles },
        { title: "Vitamin C", desc: "Brighten and protect.", icon: Sun },
        { title: "Moisturizer", desc: "Hydrate and prep.", icon: Sparkles },
        { title: "SPF", desc: "Protect from UV rays.", icon: Sun },
    ];

    const stepsPM = [
        { title: "Double Cleanse", desc: "Remove makeup and SPF.", icon: Sparkles },
        { title: "Treatment", desc: "Retinol or Acids.", icon: Moon },
        { title: "Moisturizer", desc: "Lock in hydration.", icon: Sparkles },
        { title: "Oil", desc: "Seal it all in.", icon: Moon },
    ];

    return (
        <div className="min-h-screen bg-background font-sans text-foreground">
            <div className="max-w-4xl mx-auto px-6 py-16">
                <div className="text-center mb-16 space-y-4">
                    <h1 className="text-4xl md:text-5xl font-bold">The Art of the Routine</h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Consistency is key. Discover the perfect AM and PM rituals for your skin type.
                    </p>
                    <Button onClick={() => navigate('/skin-quiz')} className="bg-primary text-white rounded-full px-8 py-6 text-lg font-bold shadow-xl hover:scale-105 transition-transform">
                        Build My Personalized Routine
                    </Button>
                </div>

                <div className="grid md:grid-cols-2 gap-12">
                    {/* AM Routine */}
                    <div className="bg-card border border-border rounded-3xl p-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Sun className="w-32 h-32 text-amber-500" />
                        </div>
                        <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                            <Sun className="w-6 h-6 text-amber-500" /> Morning Ritual
                        </h2>
                        <div className="space-y-6 relative z-10">
                            {stepsAM.map((step, i) => (
                                <div key={i} className="flex items-center gap-4 group cursor-pointer hover:bg-secondary/40 p-2 rounded-xl transition-colors">
                                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center font-bold text-primary text-sm">{i + 1}</div>
                                    <div>
                                        <h3 className="font-bold">{step.title}</h3>
                                        <p className="text-sm text-muted-foreground">{step.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* PM Routine */}
                    <div className="bg-slate-900 text-white border border-slate-800 rounded-3xl p-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Moon className="w-32 h-32 text-indigo-400" />
                        </div>
                        <h2 className="text-2xl font-bold mb-8 flex items-center gap-3 text-white">
                            <Moon className="w-6 h-6 text-indigo-400" /> Evening Ritual
                        </h2>
                        <div className="space-y-6 relative z-10">
                            {stepsPM.map((step, i) => (
                                <div key={i} className="flex items-center gap-4 group cursor-pointer hover:bg-white/5 p-2 rounded-xl transition-colors">
                                    <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center font-bold text-indigo-300 text-sm">{i + 1}</div>
                                    <div>
                                        <h3 className="font-bold">{step.title}</h3>
                                        <p className="text-sm text-slate-400">{step.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RoutinePage;

// src/pages/BlogPage.jsx
import React, { useState } from 'react';
import { Calendar, User, ArrowRight, Sparkles, Tag } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const BLOG_POSTS = [
    {
        id: 1,
        title: "The Truth About Vitamin C Serums",
        excerpt: "Why this powerhouse ingredient is a must-have for glowing skin, and how to choose the right concentration for your skin type.",
        content: "Vitamin C (ascorbic acid) is a potent antioxidant that helps brighten dark spots, protect against environmental damage, and stimulate collagen. For beginners or sensitive skin, look for 5–10% concentrations in stable derivatives like sodium ascorbyl phosphate. More experienced users can use 15–20% L-ascorbic acid, ideally paired with vitamin E and ferulic acid, and always followed by sunscreen in the morning.",
        author: "Dr. Sarah Glow",
        date: "Oct 12, 2024",
        category: "Ingredients",
        image: "https://cdn.thewirecutter.com/wp-content/media/2025/03/BEST-VITAMIN-C-SERUMS-SUB-2048px-2067-3x2-1.jpg?auto=webp&quality=75&crop=1:1,smart&width=1024",
        readTime: "5 min read"
    },
    {
        id: 2,
        title: "Morning vs. Night Routine: What's the Difference?",
        excerpt: "Stop using your heavy night cream in the morning! Here’s the definitive guide to structuring your skincare regimen.",
        content: "Your morning routine should focus on protection: gentle cleanse (or rinse), antioxidant serum, lightweight moisturizer, and broad-spectrum SPF 30+ as the final step. Night routines focus on repair, using richer moisturizers, treatments like retinol or exfoliating acids, and barrier-supporting ingredients like ceramides. Avoid layering too many actives together and always introduce powerful treatments slowly to prevent irritation.",
        author: "Mia Skincare",
        date: "Oct 08, 2024",
        category: "Guides",
        image: "https://theindustry.beauty/wp-content/uploads/2023/01/Pacifica.jpg",
        readTime: "4 min read"
    },
    {
        id: 3,
        title: "5 Signs Your Skin Barrier is Damaged",
        excerpt: "Redness, stinging, and breakouts? You might need to step back from the actives and focus on repair. Here's how.",
        content: "A compromised barrier often shows up as tightness after washing, burning when applying products, rough texture, and sudden sensitivity to products that used to feel fine. The fix is to strip back your routine to the basics: a gentle cleanser, hydrating serum, and a ceramide-rich moisturizer. Pause strong actives (like retinoids and exfoliating acids) for a few weeks and prioritize ingredients such as niacinamide, cholesterol, fatty acids, and colloidal oatmeal.",
        author: "Dr. Sarah Glow",
        date: "Sep 29, 2024",
        category: "Health",
        image: "https://i.pinimg.com/236x/a8/dc/51/a8dc515fabe4288da28fa18ba4f90274.jpg",
        readTime: "6 min read"
    },
    {
        id: 4,
        title: "Why Sunscreen is Non-Negotiable",
        excerpt: "Even indoors? Yes. Learn about blue light, UVA/UVB rays, and why SPF is the best anti-aging product you can buy.",
        content: "Up to 80% of visible skin aging is caused by UV exposure, which happens not just at the beach but through windows and on cloudy days. A daily broad-spectrum sunscreen protects against UVA (aging) and UVB (burning) rays and helps prevent hyperpigmentation and skin cancers. Look for at least SPF 30, apply generously (about two fingers’ length for the face and neck), and reapply every 2–3 hours when exposed to daylight.",
        author: "Team SkinGlow",
        date: "Sep 20, 2024",
        category: "Prevention",
        image: "https://derma.pk/cdn/shop/collections/Sunblock-_-Sunscreen1_176702e7-3726-44ec-8bc6-eb13a6ddd31c.webp?v=1752842213",
        readTime: "3 min read"
    }
];

export default function BlogPage() {
    const [expandedPostId, setExpandedPostId] = useState(null);

    return (
        <div className="min-h-screen bg-background font-sans text-foreground">

            {/* Hero Section */}
            <div className="bg-primary/5 py-20 px-6 border-b border-primary/10">
                <div className="max-w-4xl mx-auto text-center space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white shadow-sm border border-primary/10 text-xs font-semibold text-primary uppercase tracking-wider">
                        <Sparkles className="w-3 h-3" /> The Glow Journal
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
                        Skincare Secrets & Expert Advice
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Discover the latest trends, ingredient deep-dives, and routine tips from our certified beauty experts.
                    </p>
                </div>
            </div>

            {/* Blog Grid */}
            <div className="max-w-7xl mx-auto px-6 py-16">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {BLOG_POSTS.map((post) => {
                        const isExpanded = expandedPostId === post.id;
                        return (
                            <article
                                key={post.id}
                                className="bg-card rounded-3xl overflow-hidden shadow-sm border border-border group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full"
                            >
                                {/* Image */}
                                <div className="relative h-64 overflow-hidden">
                                    <img
                                        src={post.image}
                                        alt={post.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                    />
                                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-bold text-foreground shadow-sm flex items-center gap-1">
                                        <Tag className="w-3 h-3 text-primary" /> {post.category}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-6 md:p-8 flex flex-col flex-1">
                                    <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {post.date}</span>
                                        <span className="w-1 h-1 bg-border rounded-full"></span>
                                        <span>{post.readTime}</span>
                                    </div>

                                    <h3 className="text-xl font-bold text-foreground mb-3 leading-tight group-hover:text-primary transition-colors">
                                        {post.title}
                                    </h3>

                                    <p className={`text-muted-foreground text-sm ${isExpanded ? "mb-2" : "line-clamp-3 mb-6 flex-1"} leading-relaxed`}>
                                        {post.excerpt}
                                    </p>

                                    {isExpanded && post.content && (
                                        <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
                                            {post.content}
                                        </p>
                                    )}

                                    <div className="flex items-center justify-between border-t border-border pt-6 mt-auto">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-primary font-bold text-xs ring-2 ring-white">
                                                {post.author.charAt(0)}
                                            </div>
                                            <span className="text-xs font-medium text-foreground">{post.author}</span>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => setExpandedPostId(isExpanded ? null : post.id)}
                                            className="text-primary font-semibold text-sm flex items-center gap-1 group/btn"
                                        >
                                            {isExpanded ? "Show Less" : "Read More"}
                                            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                        </button>
                                    </div>
                                </div>
                            </article>
                        );
                    })}
                </div>

                {/* Newsletter / CTA */}
                <div className="mt-20 bg-secondary/30 rounded-3xl p-8 md:p-12 text-center border border-primary/10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-rose-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

                    <div className="relative z-10 max-w-2xl mx-auto space-y-6">
                        <h2 className="text-3xl font-bold text-foreground">Want more skincare tips?</h2>
                        <p className="text-muted-foreground">
                            Join our community and get weekly expert advice, exclusive offers, and early access to new launches.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="flex-1 px-4 py-3 rounded-xl border border-border bg-white focus:ring-2 focus:ring-primary outline-none text-sm placeholder:text-muted-foreground/70"
                            />
                            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-8 rounded-xl shadow-lg shadow-primary/20">
                                Subscribe
                            </Button>
                        </div>
                        <p className="text-[10px] text-muted-foreground">
                            We respect your privacy. Unsubscribe at any time.
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
}

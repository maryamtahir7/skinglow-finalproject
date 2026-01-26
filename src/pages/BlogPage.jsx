import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, User, ArrowRight, Sparkles, Tag, Clock, ChevronRight, BookOpen } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const BLOG_POSTS = [
    {
        id: 1,
        title: "The Truth About Vitamin C Serums",
        excerpt: "Why this powerhouse ingredient is a must-have for glowing skin, and how to choose the right concentration for your skin type.",
        content: "Vitamin C (ascorbic acid) is a potent antioxidant that helps brighten dark spots, protect against environmental damage, and stimulate collagen. For beginners or sensitive skin, look for 5–10% concentrations in stable derivatives like sodium ascorbyl phosphate. More experienced users can use 15–20% L-ascorbic acid, ideally paired with vitamin E and ferulic acid, and always followed by sunscreen in the morning.",
        author: "Dr. Sarah Glow",
        role: "Dermatologist",
        date: "Oct 12, 2024",
        category: "Ingredients",
        image: "https://i.pinimg.com/736x/b6/82/2c/b6822c8443aa063425217c796676177a.jpg",
        readTime: "5 min read",
        featured: true
    },
    {
        id: 2,
        title: "Morning vs. Night Routine: What's the Difference?",
        excerpt: "Stop using your heavy night cream in the morning! Here’s the definitive guide to structuring your skincare regimen.",
        content: "Your morning routine should focus on protection: gentle cleanse (or rinse), antioxidant serum, lightweight moisturizer, and broad-spectrum SPF 30+ as the final step. Night routines focus on repair, using richer moisturizers, treatments like retinol or exfoliating acids, and barrier-supporting ingredients like ceramides. Avoid layering too many actives together and always introduce powerful treatments slowly to prevent irritation.",
        author: "Mia Skincare",
        role: "Esthetician",
        date: "Oct 08, 2024",
        category: "Guides",
        image: "https://i.pinimg.com/736x/7f/61/cd/7f61cd1f960a3fd2c40874467db30392.jpg",
        readTime: "4 min read"
    },
    {
        id: 3,
        title: "5 Signs Your Skin Barrier is Damaged",
        excerpt: "Redness, stinging, and breakouts? You might need to step back from the actives and focus on repair. Here's how.",
        content: "A compromised barrier often shows up as tightness after washing, burning when applying products, rough texture, and sudden sensitivity to products that used to feel fine. The fix is to strip back your routine to the basics: a gentle cleanser, hydrating serum, and a ceramide-rich moisturizer. Pause strong actives (like retinoids and exfoliating acids) for a few weeks and prioritize ingredients such as niacinamide, cholesterol, fatty acids, and colloidal oatmeal.",
        author: "Dr. Sarah Glow",
        role: "Dermatologist",
        date: "Sep 29, 2024",
        category: "Health",
        image: "https://i.pinimg.com/736x/1b/22/f6/1b22f6b821ff67cb7702833d87c4d0bb.jpg",
        readTime: "6 min read"
    },
    {
        id: 4,
        title: "Why Sunscreen is Non-Negotiable",
        excerpt: "Even indoors? Yes. Learn about blue light, UVA/UVB rays, and why SPF is the best anti-aging product you can buy.",
        content: "Up to 80% of visible skin aging is caused by UV exposure, which happens not just at the beach but through windows and on cloudy days. A daily broad-spectrum sunscreen protects against UVA (aging) and UVB (burning) rays and helps prevent hyperpigmentation and skin cancers. Look for at least SPF 30, apply generously (about two fingers’ length for the face and neck), and reapply every 2–3 hours when exposed to daylight.",
        author: "Team SkinGlow",
        role: "Editorial",
        date: "Sep 20, 2024",
        category: "Prevention",
        image: "https://i.pinimg.com/736x/75/24/cf/7524cfdc8149b664daea9ff32b411ecb.jpg",
        readTime: "3 min read"
    }
];

export default function BlogPage() {
    const featuredPost = BLOG_POSTS.find(p => p.featured) || BLOG_POSTS[0];
    const otherPosts = BLOG_POSTS.filter(p => p.id !== featuredPost.id);

    return (
        <div className="min-h-screen bg-[#FDFBF7] font-sans text-stone-900 selection:bg-rose-100">

            {/* 1. Header Minimal */}
            <div className="pt-32 md:pt-40 pb-16 px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="max-w-3xl mx-auto space-y-6"
                >
                    <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.4em] text-rose-500 block">The Journal Archive</span>
                    <h1 className="text-5xl md:text-8xl font-serif text-stone-900 leading-[0.85] tracking-tight">
                        Skin <span className="italic font-light text-stone-400">Chronicles</span>
                    </h1>
                    <p className="text-stone-500 font-light text-sm md:text-lg max-w-xl mx-auto leading-relaxed">
                        Curated intelligence for the modern skincare minimalist. Scientific depth meets editorial elegance.
                    </p>
                </motion.div>
            </div>

            {/* 2. Featured Article Hero */}
            <div className="max-w-[1700px] mx-auto px-4 sm:px-10 mb-32">
                <FeaturedArticle post={featuredPost} />
            </div>

            {/* 3. The Edit (Grid) */}
            <div className="max-w-[1600px] mx-auto px-6 mb-48">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 border-b border-stone-100 pb-8 gap-6">
                    <div>
                        <h2 className="text-4xl md:text-5xl font-serif tracking-tight">The Latest <span className="italic text-stone-400">Edit</span></h2>
                    </div>
                    <div className="flex flex-wrap gap-4 text-[10px] font-bold uppercase tracking-widest text-stone-400">
                        <span className="text-stone-900 border-b border-stone-900 pb-1 cursor-pointer">View All</span>
                        <span className="hover:text-stone-800 cursor-pointer transition-colors">Scientific Guides</span>
                        <span className="hover:text-stone-800 cursor-pointer transition-colors">Ingredient Spotlights</span>
                        <span className="hover:text-stone-800 cursor-pointer transition-colors">Routine Rituals</span>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20">
                    {otherPosts.map((post, idx) => (
                        <ArticleCard key={post.id} post={post} index={idx} />
                    ))}
                </div>
            </div>

            {/* 4. Newsletter (Premium) */}
            <Newsletter />

        </div>
    );
}

function FeaturedArticle({ post }) {
    return (
        <Link to={`/blog/${post.id}`} className="block">
            <motion.div
                initial={{ opacity: 0, scale: 0.99 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="relative group cursor-pointer rounded-[2.5rem] md:rounded-[3.5rem] overflow-hidden bg-stone-100 aspect-[4/5] sm:aspect-square md:aspect-[21/9] isolate shadow-2xl shadow-stone-900/10"
            >
                {/* Background Image with Zoom */}
                <img
                    src={post.image}
                    alt={post.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2s] ease-out group-hover:scale-105"
                />

                {/* Refined Overlays */}
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent md:bg-gradient-to-r md:from-black/60 md:to-transparent" />

                {/* Content Overlay - Floating Glass Card (Perfect for Mobile) */}
                <div className="absolute inset-0 flex items-end md:items-center p-4 sm:p-8 md:p-20">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6, duration: 1 }}
                        className="bg-white/10 backdrop-blur-2xl border border-white/20 p-6 sm:p-10 md:p-14 rounded-[2rem] md:rounded-[3rem] text-white max-w-[95%] sm:max-w-2xl shadow-2xl relative overflow-hidden"
                    >
                        {/* Glass Glow effect */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                        <div className="relative space-y-6 md:space-y-8">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.8 }}
                                className="flex items-center gap-4 text-[9px] md:text-[10px] font-bold tracking-[0.3em] uppercase text-rose-200"
                            >
                                <span className="bg-rose-500/20 px-3 py-1.5 rounded-full border border-rose-500/20">{post.category}</span>
                                <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> {post.readTime}</span>
                            </motion.div>

                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1 }}
                                className="text-3xl sm:text-4xl md:text-6xl font-serif leading-[1.1] md:leading-none group-hover:text-rose-100 transition-colors"
                            >
                                {post.title}
                            </motion.h2>

                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1.2 }}
                                className="text-sm md:text-xl text-white/70 font-light leading-relaxed max-w-lg line-clamp-2 sm:line-clamp-3 md:line-clamp-none"
                            >
                                {post.excerpt}
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1.4 }}
                                className="flex items-center justify-between pt-4 border-t border-white/10"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-bold border border-white/20">
                                        {post.author.charAt(0)}
                                    </div>
                                    <div>
                                        <div className="text-[10px] md:text-sm font-bold">{post.author}</div>
                                        <div className="text-white/40 text-[8px] uppercase tracking-widest">{post.role}</div>
                                    </div>
                                </div>
                                <div className="hidden sm:flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest">
                                    Full Story <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </Link>
    );
}

function ArticleCard({ post, index }) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <Link to={`/blog/${post.id}`} className="block h-full">
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: index * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="group flex flex-col h-full cursor-pointer"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* Image Container with Elegant Framing */}
                <div className="relative overflow-hidden rounded-[2rem] aspect-[5/4] mb-10 isolation-isolate shadow-lg group-hover:shadow-2xl transition-all duration-700">
                    <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                    {/* Shadow depth overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-900/40 via-transparent to-transparent opacity-60" />

                    <div className="absolute top-6 left-6">
                        <span className="bg-white/95 backdrop-blur-xl text-stone-900 text-[9px] font-bold px-4 py-1.5 rounded-full uppercase tracking-[0.2em] shadow-sm">
                            {post.category}
                        </span>
                    </div>

                    <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-500">
                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-stone-900 shadow-xl">
                            <ArrowRight className="w-4 h-4" />
                        </div>
                    </div>
                </div>

                {/* Content with Improved Spacing */}
                <div className="space-y-4 px-2">
                    <div className="flex items-center gap-4 text-[9px] text-stone-400 font-bold uppercase tracking-[0.2em]">
                        <span className="flex items-center gap-1.5"><Calendar className="w-3 h-3 text-rose-300" /> {post.date}</span>
                        <div className="w-[3px] h-[3px] rounded-full bg-stone-200" />
                        <span>{post.readTime}</span>
                    </div>

                    <h3 className="text-2xl md:text-3xl font-serif text-stone-900 leading-tight group-hover:text-rose-600 transition-colors duration-500">
                        {post.title}
                    </h3>

                    <p className="text-stone-500 text-sm md:text-base font-light leading-relaxed line-clamp-3">
                        {post.excerpt}
                    </p>

                    <div className="pt-4 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-stone-900 group-hover:text-rose-600 transition-colors">
                        Discover
                        <div className="h-[1px] w-8 bg-stone-200 group-hover:w-12 group-hover:bg-rose-300 transition-all duration-500" />
                    </div>
                </div>
            </motion.div>
        </Link>
    );
}

function Newsletter() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('idle');

    const handleSubscribe = async () => {
        if (!email || !email.includes('@')) {
            alert("Please enter a valid email.");
            return;
        }
        setStatus('loading');
        setTimeout(() => {
            setStatus('idle');
            alert("🎉 Welcome to the Inner Circle!");
        }, 1500);
    };

    return (
        <div className="bg-[#0A0A0A] py-32 md:py-48 relative overflow-hidden text-center isolate">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl px-6">
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-rose-500/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[120px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="max-w-3xl mx-auto px-6 relative z-10"
            >
                <div className="inline-flex items-center gap-3 mb-10 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md">
                    <Sparkles className="w-4 h-4 text-rose-300" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/50">Exclusive Intelligence</span>
                </div>

                <h2 className="text-4xl md:text-7xl font-serif mb-8 text-white leading-tight">Join the <span className="italic font-light text-rose-100">Inner Circle</span></h2>
                <p className="text-white/40 text-sm md:text-xl mb-16 max-w-xl mx-auto font-light leading-relaxed">
                    A weekly briefing on bioactive ingredients, skin longevity, and aesthetic philosophy.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto bg-white/5 p-2 rounded-[2rem] border border-white/10 backdrop-blur-lg">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        className="flex-1 bg-transparent px-8 py-4 text-white placeholder:text-white/20 outline-none text-sm"
                    />
                    <button
                        onClick={handleSubscribe}
                        disabled={status === 'loading'}
                        className="bg-white text-stone-900 rounded-[1.5rem] px-10 py-4 font-bold uppercase tracking-[0.2em] text-[10px] hover:bg-rose-50 transition-all duration-500 active:scale-95 disabled:opacity-50"
                    >
                        {status === 'loading' ? 'Encrypting...' : 'Access Now'}
                    </button>
                </div>

                <p className="mt-8 text-[9px] text-white/20 uppercase tracking-widest">Minimalist frequency. zero noise.</p>
            </motion.div>
        </div>
    );
}

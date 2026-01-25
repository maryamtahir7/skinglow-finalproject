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
            <div className="pt-24 md:pt-32 pb-12 px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="max-w-2xl mx-auto space-y-4"
                >
                    <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.3em] text-rose-500">The Journal</span>
                    <h1 className="text-4xl md:text-7xl font-serif text-stone-900 leading-[0.9]">
                        Beauty <span className="italic font-light text-stone-400">Insiders</span>
                    </h1>
                </motion.div>
            </div>

            {/* 2. Featured Article Hero */}
            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 mb-24">
                <FeaturedArticle post={featuredPost} />
            </div>

            {/* 3. The Edit (Grid) */}
            <div className="max-w-7xl mx-auto px-6 mb-32">
                <div className="flex items-end justify-between mb-12 border-b border-stone-200 pb-6">
                    <h2 className="text-3xl font-serif">Latest Stories</h2>
                    <div className="hidden sm:flex gap-2 text-sm font-medium text-stone-500">
                        <span className="text-stone-900 cursor-pointer">All</span>
                        <span className="mx-2">/</span>
                        <span className="hover:text-stone-900 cursor-pointer transition-colors">Guides</span>
                        <span className="mx-2">/</span>
                        <span className="hover:text-stone-900 cursor-pointer transition-colors">Ingredients</span>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10 md:gap-y-16">
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
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative group cursor-pointer rounded-[2rem] overflow-hidden bg-stone-900 aspect-[3/4] sm:aspect-square md:aspect-[21/9] isolate"
            >
                {/* Background Image */}
                <img
                    src={post.image}
                    alt={post.title}
                    className="absolute inset-0 w-full h-full object-cover opacity-80 mix-blend-overlay transition-transform duration-1000 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent" />

                {/* Content Overlay */}
                <div className="absolute bottom-0 left-0 p-6 md:p-16 max-w-4xl text-white w-full">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="space-y-4 md:space-y-6"
                    >
                        <div className="flex items-center gap-3 text-[10px] md:text-xs font-bold tracking-widest uppercase text-rose-200">
                            <span className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">{post.category}</span>
                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {post.readTime}</span>
                        </div>

                        <h2 className="text-3xl md:text-6xl font-serif leading-tight md:leading-none group-hover:text-rose-100 transition-colors">
                            {post.title}
                        </h2>

                        <p className="text-base md:text-xl text-white/70 max-w-2xl font-light leading-relaxed line-clamp-3 md:line-clamp-none">
                            {post.excerpt}
                        </p>

                        <div className="flex items-center gap-3 pt-2 md:pt-4">
                            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/20 backdrop-blur border border-white/20 flex items-center justify-center text-xs md:text-sm font-bold">
                                {post.author.charAt(0)}
                            </div>
                            <div className="text-xs md:text-sm">
                                <div className="font-bold text-white">{post.author}</div>
                                <div className="text-white/50 text-[10px] md:text-xs uppercase tracking-wider">{post.role}</div>
                            </div>
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
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="group flex flex-col h-full cursor-pointer"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* Image Container */}
                <div className="relative overflow-hidden rounded-2xl aspect-[4/3] mb-6 isolation-isolate">
                    <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className={`absolute inset-0 bg-black/20 transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`} />

                    <div className="absolute top-4 left-4">
                        <span className="bg-white/90 backdrop-blur text-stone-900 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                            {post.category}
                        </span>
                    </div>
                </div>

                {/* Meta */}
                <div className="flex items-center justify-between text-xs text-stone-400 font-medium uppercase tracking-wider mb-3">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {post.date}</span>
                    <span>{post.readTime}</span>
                </div>

                {/* Title */}
                <h3 className="text-2xl font-serif text-stone-900 mb-3 leading-tight group-hover:text-rose-600 transition-colors">
                    {post.title}
                </h3>

                {/* Excerpt */}
                <p className="text-stone-500 text-sm leading-relaxed mb-6 line-clamp-3">
                    {post.excerpt}
                </p>

                {/* Read More Link */}
                <div className="mt-auto flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-stone-900 group-hover:text-rose-600 transition-colors">
                    Read Story
                    <ArrowRight className={`w-4 h-4 transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`} />
                </div>
            </motion.div>
        </Link>
    );
}

function Newsletter() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('idle'); // idle, loading, success, error

    const handleSubscribe = async () => {
        if (!email || !email.includes('@')) {
            alert("Please enter a valid email.");
            return;
        }
        setStatus('loading');
        try {
            const res = await fetch('/api/newsletter', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            const data = await res.json();
            if (res.ok) {
                setStatus('success');
                setEmail('');
                alert("🎉 Welcome to the Inner Circle! Check your email.");
            } else {
                throw new Error(data.message || "Subscription failed");
            }
        } catch (e) {
            console.error(e);
            setStatus('error');
            alert(`❌ Error: ${e.message}`);
        } finally {
            setStatus('idle');
        }
    };

    return (
        <div className="bg-[#0A0A0A] py-24 relative overflow-hidden">
            {/* Ambient Background */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-rose-900/20 rounded-full blur-[100px] opacity-60" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[100px] opacity-50" />

            <div className="max-w-4xl mx-auto px-6 relative z-10 text-center text-white">
                <Sparkles className="w-8 h-8 text-rose-300 mx-auto mb-6 opacity-80" />
                <h2 className="text-3xl md:text-5xl font-serif mb-6">Join the Inner Circle</h2>
                <p className="text-white/60 text-lg mb-10 max-w-xl mx-auto font-light">
                    Get weekly expert advice, ingredient deep-dives, and exclusive early access to new launches.
                </p>

                <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Your email address"
                        className="flex-1 bg-white/5 border border-white/10 rounded-full px-6 py-4 text-white placeholder:text-white/30 outline-none focus:border-rose-300/50 transition-colors"
                    />
                    <button
                        onClick={handleSubscribe}
                        disabled={status === 'loading'}
                        className="bg-gradient-to-r from-rose-200 to-indigo-200 text-stone-900 rounded-full px-8 py-4 font-bold uppercase tracking-widest text-xs hover:opacity-90 transition-all hover:scale-105 disabled:opacity-50"
                    >
                        {status === 'loading' ? 'Sending...' : 'Subscribe'}
                    </button>
                </div>
            </div>
        </div>
    );
}

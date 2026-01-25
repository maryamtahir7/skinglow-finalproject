import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, useScroll, useSpring } from 'framer-motion';
import { ArrowLeft, Calendar, Clock, Sparkles, Tag, Facebook, Twitter, Linkedin, Copy } from 'lucide-react';
import { Button } from "@/components/ui/button";

// Mock data (in a real app, fetch from DB or Contentful)
// Sharing this array with BlogPage would be better (e.g. context or separate file), 
// but for now duplicating the mock data + adding more content is fine for the demo.
const BLOG_POSTS = [
    {
        id: 1,
        title: "The Truth About Vitamin C: A Dermatologist's Guide",
        excerpt: "Why this powerhouse ingredient is synonymous with glowing skin, and exactly how to choose the right concentration for your specific physiology.",
        content: `
            <p class="drop-cap">Vitamin C (L-ascorbic acid) is widely regarded as the "gold standard" of antioxidant protection in modern dermatology. While many ingredients trend in and out of style, Vitamin C remains a cornerstone due to its scientifically proven ability to neutralize free radicals, inhibit melanin production, and cofactor collagen synthesis.</p>
            
            <h3>Understanding the Mechanism</h3>
            <p>Your skin is constantly bombarded by oxidative stressors—UV radiation, pollution, and blue light. These stressors create unstable molecules known as "free radicals" that steal electrons from your healthy cells, leading to DNA damage and visible aging (fine lines, sagging, and pigmentation). Vitamin C acts as a sacrificial electron donor, neutralizing these radicals before they can cause cellular harm.</p>
            
            <h3>Choosing the Right Form</h3>
            <p>Not all Vitamin C serums are created equal. The molecule is notoriously unstable and oxidizes quickly when exposed to light or air.</p>
            <ul>
                <li><strong>L-Ascorbic Acid (10-20%):</strong> The most potent and bioavailable form. Ideal for normal to oily skin types. Look for a pH below 3.5 for optimal penetration.</li>
                <li><strong>Sodium Ascorbyl Phosphate:</strong> A gentler, stable derivative. Excellent for acne-prone skin as it has antimicrobial properties.</li>
                <li><strong>THD Ascorbate:</strong> An oil-soluble form that penetrates deeply. Best for dry or sensitive skin.</li>
            </ul>
            
            <h3>The Golden Rules of Application</h3>
            <p>To maximize efficacy, apply your serum on dry, cleansed skin immediately after toning. Wait 1-2 minutes for absorption before applying moisturizer. Crucially, <strong>always pair with SPF 30+</strong>. Vitamin C prevents damage, but sunscreen blocks the rays that cause it. Together, they form a synergistic shield that is 4x more effective than either alone.</p>
        `,
        author: "Dr. Sarah Glow",
        role: "Dermatologist",
        date: "Oct 12, 2024",
        category: "Ingredients",
        image: "https://i.pinimg.com/736x/b6/82/2c/b6822c8443aa063425217c796676177a.jpg",
        readTime: "8 min read",
    },
    {
        id: 2,
        title: "Chronobiology: Syncing Your Routine with Your Body Clock",
        excerpt: "Stop wasting expensive actives at the wrong time. Here is the definitive guide to structuring your skincare regimen based on circadian rhythms.",
        content: `
            <p class="drop-cap">Your skin operates on a strict 24-hour cycle known as the circadian rhythm. During the day, skin functions in "defense mode," fighting off environmental aggressors. At night, it switches to "repair mode," regenerating cells and repairing DNA damage. Understanding this cycle is the key to getting results.</p>
            
            <h3>The Morning Edit: Defense & Protection</h3>
            <p>Your AM routine should focus entirely on shielding your barrier from the day ahead. Avoid heavy occlusives or photosensitizing acids.</p>
            <ul>
                <li><strong>Cleanse:</strong> A gentle rinse is often sufficient to remove nightly sweat and residue.</li>
                <li><strong>Antioxidant Serum:</strong> This is your first line of defense (see our Vitamin C guide).</li>
                <li><strong>Lightweight Hydration:</strong> Look for humectants like Glycerin or Hyaluronic Acid.</li>
                <li><strong>SPF Protection:</strong> The non-negotiable final step.</li>
            </ul>

            <h3>The Evening Edit: Repair & Regeneration</h3>
            <p>Skin permeability increases at night (transepidermal water loss peaks around midnight), which means active ingredients penetrate deeper, but you are also more prone to dehydration.</p>
            <ul>
                <li><strong>Double Cleanse:</strong> Use an oil balm to dissolve makeup/SPF, followed by a water-based cleanser.</li>
                <li><strong>Targeted Treatment:</strong> This is the time for Retinoids, Peptides, or AHAs/BHAs.</li>
                <li><strong>Barrier Support:</strong> Seal everything in with a lipid-rich moisturizer containing Ceramides and Fatty Acids.</li>
            </ul>
        `,
        author: "Mia Skincare",
        role: "Esthetician",
        date: "Oct 08, 2024",
        category: "Guides",
        image: "https://i.pinimg.com/736x/81/39/45/8139454d4e4459808d324eee14bbb674.jpg",
        readTime: "10 min read"
    },
    {
        id: 3,
        title: "The Silent Epidemic: Identifying Barrier Damage",
        excerpt: "Redness, stinging, and unexplained breakouts? You might need to step back from the actives and focus on repair. Here's how to diagnose and treat a compromised barrier.",
        content: `
             <p class="drop-cap">In the pursuit of "glass skin," we often over-exfoliate, leading to a compromised stratum corneum (the skin barrier). Your barrier is a brick-and-mortar structure: skin cells are the bricks, and lipids (oils) are the mortar. When this structure is damaged, irritants get in, and moisture leaks out.</p>
             
             <h3>Diagnostic Signs</h3>
             <ol>
                <li><strong>translucency & Tightness:</strong> Skin feels "too small" for your face or looks uniquely shiny without oiliness.</li>
                <li><strong>Product Reactivity:</strong> gentle products that used to be fine now cause stinging or burning.</li>
                <li><strong>Perioral Dermatitis:</strong> Small, red, acne-like bumps around the mouth and nose.</li>
                <li><strong>Intractable Dryness:</strong> No amount of moisturizer seems to relieve the flakiness.</li>
             </ol>

             <h3>The Recovery Protocol</h3>
             <p>If you suspect damage, implement a "Skincare Fast" immediately. Pause all actives (Retinol, Vitamin C, Acids) for 14-21 days.</p>
             <h4>The Healing Triad</h4>
             <p>Focus exclusively on three ingredients:</p>
             <ul>
                 <li><strong>Ceramides:</strong> To rebuild the "mortar."</li>
                 <li><strong>Panthenol (Vitamin B5):</strong> To soothe inflammation and accelerate healing.</li>
                 <li><strong>Centella Asiatica:</strong> A powerful anti-inflammatory botanical.</li>
             </ul>
             <p>Once the stinging subsides, reintroduce actives slowly—one per week.</p>
        `,
        author: "Dr. Sarah Glow",
        role: "Dermatologist",
        date: "Sep 29, 2024",
        category: "Health",
        image: "https://i.pinimg.com/736x/1b/22/f6/1b22f6b821ff67cb7702833d87c4d0bb.jpg",
        readTime: "7 min read"
    },
    {
        id: 4,
        title: "SPF: The Only Anti-Aging Product That Matters",
        excerpt: "Even indoors? Yes. Learn about the physics of UVA/UVB rays, blue light, and why preventing damage is infinitely cheaper than repairing it.",
        content: `
            <p class="drop-cap">You can use the most expensive La Mer cream in the world, but if you aren't using sunscreen properly, you are wasting your money. Up to 80% of visible skin aging is caused by extrinsic factors, primarily UV exposure.</p>

            <h3>The Physics of Light</h3>
            <p><strong>UVB (Burning Rays):</strong> These have a shorter wavelength and damage the superficial layers of skin. They are the main cause of sunburn and are blocked by window glass.</p>
            <p><strong>UVA (Aging Rays):</strong> These have a longer wavelength, penetrating deep into the dermis where they degrade collagen and elastin. Crucially, UVA rays <em>penetrate clouds and glass</em>. This is why you need protection even when driving or sitting near a window.</p>

            <h3>The Blue Light Controversy</h3>
            <p>High Energy Visible (HEV) light from screens has been shown to induce oxidative stress and hyperpigmentation, particularly in melanin-rich skin types. Physical blockers containing <strong>Iron Oxide</strong> (often found in tinted sunscreens) are the most effective shield against HEV light.</p>

            <h3>Application Dosage</h3>
            <p>To achieve the "SPF" number on the bottle, you need to apply 2mg per square centimeter of skin. In practice, this means:</p>
            <ul>
                <li><strong>Face:</strong> 1/4 teaspoon (roughly two full finger lengths).</li>
                <li><strong>Neck & Ears:</strong> Another 1/4 teaspoon.</li>
                <li><strong>Reapplication:</strong> Every 2 hours of direct exposure, or immediately after sweating.</li>
            </ul>
        `,
        author: "Team SkinGlow",
        role: "Editorial",
        date: "Sep 20, 2024",
        category: "Prevention",
        image: "https://i.pinimg.com/736x/75/24/cf/7524cfdc8149b664daea9ff32b411ecb.jpg",
        readTime: "5 min read"
    }
];

export default function BlogDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    // Scroll to top on load
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    const post = BLOG_POSTS.find(p => p.id === Number(id));

    if (!post) {
        return <div className="min-h-screen flex items-center justify-center">Article not found.</div>;
    }

    const shareLinks = [
        { icon: Facebook, label: "Share on Facebook" },
        { icon: Twitter, label: "Share on Twitter" },
        { icon: Linkedin, label: "Share on LinkedIn" },
        { icon: Copy, label: "Copy Link" },
    ];

    return (
        <div className="min-h-screen bg-[#FDFBF7] font-sans text-stone-900 pb-20 selection:bg-rose-200 selection:text-rose-900">

            {/* 1. SCROLL PROGRESS BAR */}
            <motion.div
                className="fixed top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-rose-400 via-purple-400 to-indigo-400 origin-left z-50"
                style={{ scaleX }}
            />

            {/* Navigation */}
            <div className="sticky top-0 z-40 bg-[#FDFBF7]/80 backdrop-blur-md border-b border-stone-100 px-6 py-4">
                <div className="max-w-6xl mx-auto flex items-center justify-between">
                    <button
                        onClick={() => navigate('/blog')}
                        className="flex items-center gap-2 text-stone-500 hover:text-stone-900 transition-colors text-sm font-bold uppercase tracking-wide group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Journal
                    </button>
                    <div className="text-stone-900 font-serif italic text-sm hidden sm:block">
                        SkinGlow Journal
                    </div>
                    <div className="w-8" /> {/* Spacer for balance */}
                </div>
            </div>

            <div className="relative max-w-7xl mx-auto">
                {/* 2. STICKY SOCIAL SIDEBAR (Desktop) */}


                {/* Article Header (Premium Redesign) */}
                <div className="relative max-w-4xl mx-auto px-6 pt-24 md:pt-32 pb-12 md:pb-20 text-center z-10">
                    {/* Ambient Background Effects */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[100vw] h-full overflow-hidden -z-10 pointer-events-none">
                        <div className="absolute top-[20%] left-[20%] w-[500px] h-[500px] bg-rose-200/20 rounded-full blur-[120px] mix-blend-multiply animate-pulse" />
                        <div className="absolute top-[10%] right-[20%] w-[400px] h-[400px] bg-indigo-100/30 rounded-full blur-[100px] mix-blend-multiply animate-pulse" style={{ animationDelay: '1s' }} />
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        {/* Category & Meta */}
                        <div className="inline-flex items-center gap-3 mb-12">
                            <span className="bg-stone-900 text-white px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em]">
                                {post.category}
                            </span>
                            <span className="w-1 h-1 rounded-full bg-stone-300" />
                            <span className="text-stone-500 text-xs font-bold uppercase tracking-widest flex items-center gap-1.5">
                                <Clock className="w-3 h-3" /> {post.readTime}
                            </span>
                        </div>

                        {/* Title (Cinematic Fade In) */}
                        <h1 className="text-3xl sm:text-4xl md:text-7xl lg:text-8xl font-serif text-stone-900 leading-[1.1] md:leading-[0.9] mb-8 md:mb-12 tracking-tight">
                            {post.title.split(" ").map((word, i) => (
                                <motion.span
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 + (i * 0.1), duration: 0.6 }}
                                    className="inline-block mr-3 md:mr-5"
                                >
                                    {word}
                                </motion.span>
                            ))}
                        </h1>

                        {/* Excerpt (Glass Card Style) */}
                        <div className="max-w-2xl mx-auto backdrop-blur-sm bg-white/40 border border-white/50 rounded-2xl p-6 md:p-8 shadow-sm mb-12">
                            <p className="text-lg md:text-2xl text-stone-600 leading-relaxed font-light italic">
                                "{post.excerpt}"
                            </p>
                        </div>

                        {/* Author Block */}
                        <div className="flex items-center justify-center gap-4">
                            <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-rose-100 to-indigo-100 p-[2px]">
                                <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-stone-900 font-serif italic text-xl">
                                    {post.author.charAt(0)}
                                </div>
                            </div>
                            <div className="text-left">
                                <div className="text-sm font-bold text-stone-900 uppercase tracking-wide">{post.author}</div>
                                <div className="text-xs text-stone-500 uppercase tracking-wider">{post.role} • {post.date}</div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Divider */}
                <div className="max-w-xs mx-auto h-px bg-gradient-to-r from-transparent via-stone-200 to-transparent mb-20" />

                {/* Article Content (Enhanced Typography) */}
                <article className="max-w-2xl mx-auto px-6 prose prose-stone prose-lg md:prose-xl prose-headings:font-serif prose-headings:font-normal prose-p:leading-loose prose-p:text-stone-600 prose-a:text-rose-500 hover:prose-a:text-rose-600 prose-blockquote:font-serif prose-blockquote:text-2xl prose-blockquote:font-normal prose-blockquote:not-italic prose-blockquote:border-l-4 prose-blockquote:border-rose-200 prose-blockquote:pl-6 prose-blockquote:py-2 prose-li:marker:text-rose-300">
                    <style>{`
                        .drop-cap::first-letter {
                            float: left;
                            font-size: 5em;
                            line-height: 0.8;
                            font-family: serif;
                            font-weight: bold;
                            color: #1c1917;
                            margin-right: 0.1em;
                            margin-bottom: -0.1em;
                        }
                    `}</style>
                    <div dangerouslySetInnerHTML={{ __html: post.content }} />
                </article>

                {/* Newsletter CTA at bottom */}
                <div className="max-w-4xl mx-auto px-6 mt-24">
                    <div className="bg-stone-900 rounded-[2rem] p-12 text-center text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/20 rounded-full blur-[80px]" />
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-[80px]" />

                        <Sparkles className="w-8 h-8 text-rose-300 mx-auto mb-6 relative z-10" />
                        <h3 className="text-3xl font-serif mb-4 relative z-10">Loved this story?</h3>
                        <p className="text-white/60 mb-8 font-light relative z-10">
                            Subscribe to get more deep dives like this delivered to your inbox.
                        </p>
                        <div className="flex justify-center relative z-10">
                            <Button onClick={() => navigate('/blog')} variant="ghost" className="bg-transparent border border-white/20 text-white hover:bg-white/10 hover:text-white rounded-full px-8">
                                Back to Journal
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

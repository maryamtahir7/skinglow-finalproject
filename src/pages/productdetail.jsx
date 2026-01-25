import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getProductById, getProducts, addToCart, addToWishlist, getWishlist,
  addReview, updateReview, deleteReview, getReviews, canUserReviewProduct
} from "../backend/database";
import { useUser } from "../context/UserContext";
import { useToast } from "../context/ToastContext";
import {
  Minus, Plus, Heart, Star, ChevronDown, Check,
  ShieldCheck, ArrowLeft, Share2, Sparkles, AlertCircle,
  Leaf, Beaker, Droplets, Sun, Moon,
  Zap, Award, FlaskConical, Target, ZapIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
// Remove local Footer import as it's provided by MainLayout

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();
  const { showToast } = useToast();


  // Data State
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeAccordion, setActiveAccordion] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);

  // Reviews State
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState("");
  const [rating, setRating] = useState(5);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [canReview, setCanReview] = useState(false);
  // Mobile UX States
  const [isNearFooter, setIsNearFooter] = useState(false);
  const footerSentinelRef = useRef(null);

  useEffect(() => {
    async function load() {
      try {
        const p = await getProductById(id);
        setProduct(p);

        try {
          const rev = await getReviews(id);
          setReviews(rev.documents || []);
        } catch (error) {
          console.warn("Reviews could not be loaded:", error);
          setReviews([]);
        }

        if (user) {
          canUserReviewProduct(user.$id, id).then(setCanReview);
        }
      } catch (e) {
        console.error(e);
        showToast("Product not found", "error");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id, user]);

  // Observer to hide mobile pill before footer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsNearFooter(entry.isIntersecting),
      { threshold: 0, rootMargin: "0px 0px 200px 0px" }
    );
    if (footerSentinelRef.current) observer.observe(footerSentinelRef.current);
    return () => observer.disconnect();
  }, [loading]);

  const handleAddToCart = async () => {
    if (!user) { navigate("/login"); return; }
    try {
      await addToCart({ userId: user.$id, productId: product.$id, quantity });
      showToast(`Added ${quantity}x ${product.name} to bag`, "cart");
      window.dispatchEvent(new Event('cart-updated'));
    } catch { showToast("Failed to add", "error"); }
  };

  const handleBuyNow = () => {
    if (!user) { navigate("/login"); return; }
    navigate("/checkout", {
      state: {
        buyNow: {
          product: product,
          quantity: quantity
        }
      }
    });
  };

  const handleWishlist = async () => {
    if (!user) { navigate("/login"); return; }
    try {
      await addToWishlist({ userId: user.$id, productId: product.$id });
      showToast("Saved to wishlist", "success");
    } catch { showToast("Failed to save", "error"); }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    setIsSubmittingReview(true);
    try {
      await addReview({
        productId: id,
        userid: user.$id,
        username: user.name,
        rating,
        review: newReview,
      });
      const updated = await getReviews(id);
      setReviews(updated.documents || []);
      setNewReview("");
    } catch { showToast("Review failed", "error"); }
    finally { setIsSubmittingReview(false); }
  };

  if (loading && !product) return null;
  if (!product) return null;

  const images = [product.imageUrl, product.imageUrl2, product.imageUrl3].filter(Boolean);
  const displayPrice = parseInt(product.price).toLocaleString();

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-stone-900 font-sans selection:bg-rose-100 pb-0 overflow-x-hidden relative">

      {/* Editorial Background Element (Ghost Typography) */}
      <div className="fixed top-24 -left-12 rotate-90 text-[18vh] font-serif italic text-stone-300 opacity-[0.03] select-none pointer-events-none z-0">
        SKINGLOW PREMIUM
      </div>

      {/* 1. TOP NAV BAR (Static for better UX) */}
      <nav className="absolute top-0 left-0 right-0 z-50 px-6 py-6 flex justify-between items-center pointer-events-none">
        <motion.button
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          onClick={() => navigate('/products')}
          className="pointer-events-auto w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-white border border-stone-100 rounded-full shadow-lg hover:shadow-xl transition-all group"
        >
          <ArrowLeft className="w-5 h-5 text-stone-800 group-hover:-translate-x-1 transition-transform" />
        </motion.button>

        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="flex gap-2"
        >
          <button onClick={handleWishlist} className="pointer-events-auto w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-white border border-stone-100 rounded-full shadow-lg hover:text-rose-600 transition-all">
            <Heart className="w-5 h-5" />
          </button>
        </motion.div>
      </nav>

      <div className="max-w-[1800px] mx-auto pt-24 relative z-10">
        <div className="grid lg:grid-cols-2 gap-0 lg:gap-16 xl:gap-32">

          {/* 2. IMmersive GALLERY (Sticky Vertical) */}
          <div className="relative">
            <div className="hidden lg:block space-y-12 px-6 xl:px-24">
              {images.map((img, i) => (
                <ParallaxImage key={i} src={img} index={i} />
              ))}
            </div>

            {/* Mobile Slider */}
            <div className="lg:hidden w-full aspect-[4/5] bg-white relative overflow-hidden">
              <div
                className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide h-full"
                onScroll={(e) => {
                  const idx = Math.round(e.target.scrollLeft / (e.target.offsetWidth || 1));
                  if (idx !== selectedImage) setSelectedImage(idx);
                }}
              >
                {images.map((img, i) => (
                  <div key={i} className="w-full h-full shrink-0 snap-center">
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 px-4 py-2 bg-black/5 backdrop-blur-md rounded-full">
                {images.map((_, i) => (
                  <div key={i} className={`h-1 rounded-full transition-all duration-300 ${i === selectedImage ? 'bg-stone-800 w-6' : 'bg-stone-300 w-2'}`} />
                ))}
              </div>
            </div>
          </div>


          {/* 3. EDITORIAL CONTENT SECTION */}
          <div className="px-6 lg:pr-24 lg:pl-0 mt-12 lg:mt-0 relative">
            <div className="lg:sticky lg:top-24 max-w-2xl">

              {/* Category & Badge */}
              <div className="flex items-center gap-4 mb-8">
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.3em] text-rose-500 border-b border-rose-200 pb-1">
                  {typeof product.category === 'string' ? product.category : product.category?.name}
                </span>
                <span className="flex items-center gap-1.5 text-[10px] font-bold text-stone-400 uppercase tracking-widest">
                  <Target className="w-3 h-3" /> Molecular ID: {id?.slice(-6).toUpperCase()}
                </span>
              </div>

              {/* Title & Price */}
              <header className="mb-12">
                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="text-3xl sm:text-5xl xl:text-7xl font-serif text-stone-900 leading-[1.1] sm:leading-[1] mb-8 tracking-tight"
                >
                  {product.name}
                </motion.h1>

                <div className="flex items-baseline gap-6">
                  <div className="text-3xl xl:text-4xl font-light text-stone-900">
                    Rs. {displayPrice}
                  </div>
                  <div className="text-xl font-light text-stone-400 line-through decoration-rose-300/40">
                    Rs. {(parseInt(product.price) * 1.2).toLocaleString()}
                  </div>
                </div>
              </header>

              {/* Description */}
              <div className="mb-16">
                <p className="text-lg xl:text-xl text-stone-600 font-light leading-relaxed">
                  {product.description ? product.description.replace(/â/g, "-").replace(/[^\x00-\x7F]/g, "") : "Experience the pinnacle of skincare science combined with rare botanicals."}
                </p>
              </div>

              {/* ACTIONS Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-16">
                <div className="flex items-center justify-between border border-stone-200 rounded-full h-16 px-6 bg-white hover:border-stone-400 transition-all">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Quantity</span>
                  <div className="flex items-center gap-6">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-1 hover:text-rose-600 transition"><Minus className="w-4 h-4" /></button>
                    <span className="w-4 text-center font-bold text-lg tabular-nums">{quantity}</span>
                    <button onClick={() => setQuantity(quantity + 1)} className="p-1 hover:text-rose-600 transition"><Plus className="w-4 h-4" /></button>
                  </div>
                </div>

                <Button
                  onClick={handleAddToCart}
                  className="h-16 rounded-full bg-stone-900 text-white font-bold uppercase tracking-[0.2em] text-xs hover:bg-stone-800 transition-all shadow-[0_15px_40px_rgba(0,0,0,0.15)] hover:-translate-y-1 active:translate-y-0"
                >
                  Add to Ritual
                </Button>

                <Button
                  onClick={handleBuyNow}
                  variant="outline"
                  className="sm:col-span-2 h-16 rounded-full border border-stone-200 text-stone-900 font-bold uppercase tracking-[0.2em] text-xs bg-transparent hover:bg-stone-900 hover:text-white transition-all duration-500 shadow-sm"
                >
                  Express Checkout
                </Button>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 4. SUPPLEMENTARY FULL-WIDTH SECTIONS (Editorial Restructure) */}
      <div className="max-w-7xl mx-auto px-6 mt-12 lg:mt-32 pb-32 relative z-10">

        {/* Editorial Section Ghost Title */}
        <div className="absolute top-0 right-0 text-[12vw] font-serif italic text-stone-100 opacity-20 -translate-y-1/2 pointer-events-none -z-10">
          Philosophy
        </div>

        <div className="max-w-5xl mx-auto">
          {/* THE RITUAL (Cinematic Sequence) */}
          <section className="mb-48 py-24 border-t border-stone-100">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="flex items-center gap-4 mb-20 justify-center"
            >
              <div className="h-[1px] w-24 bg-stone-200" />
              <div className="flex items-center gap-3">
                <Sparkles className="w-6 h-6 text-rose-400" />
                <h3 className="font-serif text-3xl text-stone-800 italic">The Daily Ritual</h3>
              </div>
              <div className="h-[1px] w-24 bg-stone-200" />
            </motion.div>

            <div className="relative grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8">
              {/* Flow Path Line (Desktop) */}
              <div className="hidden md:block absolute top-[22px] left-[15%] right-[15%] h-[1px] bg-gradient-to-r from-transparent via-stone-200 to-transparent" />

              {[
                { step: "01", title: "Cleanse", icon: Droplets, desc: "Purify skin with gentle warmth to open pores." },
                { step: "02", title: "Apply", icon: Sparkles, desc: "Press 3-4 drops into damp skin for absorption." },
                { step: "03", title: "Seal", icon: Moon, desc: "Layer with moisturizer to lock in deep glow." }
              ].map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.2 }}
                  className="relative space-y-8 text-center"
                >
                  <div className="mx-auto w-12 h-12 rounded-full bg-white border border-stone-100 flex items-center justify-center text-rose-400 shadow-xl shadow-stone-900/5 relative z-10 group hover:bg-stone-900 hover:text-white transition-all duration-500">
                    <s.icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="space-y-4">
                    <div className="flex flex-col items-center">
                      <span className="text-[10px] font-bold tracking-[0.3em] text-rose-300 uppercase mb-2">{s.step}</span>
                      <h4 className="text-sm font-bold uppercase tracking-widest text-stone-800">{s.title}</h4>
                    </div>
                    <p className="text-xs text-stone-500 leading-relaxed max-w-[200px] mx-auto">{s.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* BENEFITS HIGHLIGHTS (Stamp Badges) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-48">
            {[
              { title: "Deep Hydration", icon: Droplets, desc: "Molecular moisture locking." },
              { title: "Ethical Sourcing", icon: Leaf, desc: "100% sustainable botanicals." },
              { title: "Clinical Grade", icon: FlaskConical, desc: "Potency tested results." },
              { title: "Eco Conscious", icon: Sun, desc: "Carbon neutral production." }
            ].map((item, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -5 }}
                className="p-8 rounded-[2.5rem] bg-white border border-stone-50 text-center flex flex-col items-center shadow-sm hover:shadow-xl hover:border-stone-100 transition-all duration-700"
              >
                <div className="w-10 h-10 mb-6 flex items-center justify-center text-stone-400 group-hover:text-rose-500">
                  <item.icon className="w-6 h-6 stroke-[1.5px]" />
                </div>
                <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] mb-3">{item.title}</h4>
                <div className="w-8 h-[1px] bg-stone-100 mb-4" />
                <p className="text-[10px] text-stone-400 uppercase leading-tight tracking-wider">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* ACCORDIONS (High Contrast) */}
          <div className="space-y-4 border-t border-stone-100 pt-24">
            {[
              { id: 'ingredients', title: "Active Ingredients", content: "Infused with high-purity Hyaluronic Acid, stabilized Vitamin C, and a proprietary blend of 5 bio-fermented botanicals for maximum bioavailability." },
              { id: 'clinical', title: "Clinical Results", content: "94% noticed improved radiance. 89% reported reduced fine lines. Results based on a 4-week independent consumer study." }
            ].map((item) => (
              <div key={item.id} className="overflow-hidden rounded-3xl border border-stone-100 bg-white shadow-sm">
                <button
                  onClick={() => setActiveAccordion(activeAccordion === item.id ? null : item.id)}
                  className="w-full py-8 flex items-center justify-between px-8"
                >
                  <span className="text-xs font-bold uppercase tracking-[0.3em] text-stone-800">{item.title}</span>
                  <div className={`p-2 rounded-full border transition-all duration-500 ${activeAccordion === item.id ? 'bg-stone-900 border-stone-900 -rotate-180' : 'bg-transparent border-stone-100'}`}>
                    <ChevronDown className={`w-4 h-4 transition-colors ${activeAccordion === item.id ? 'text-white' : 'text-stone-400'}`} />
                  </div>
                </button>
                <AnimatePresence>
                  {activeAccordion === item.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <div className="px-8 pb-10 text-sm text-stone-600 font-light leading-relaxed max-w-2xl border-t border-stone-50 pt-6">
                        {item.content}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {/* REVIEWS (Minimal Narrative) */}
          <div className="mt-48 mb-24">
            <div className="text-center mb-24 relative">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[10vw] font-serif italic text-stone-100 opacity-50 -z-10 whitespace-nowrap">
                Community Voice
              </div>
              <h3 className="font-serif text-4xl mb-4 italic">Skin Testimonials</h3>
              <div className="flex items-center justify-center gap-2 text-rose-300">
                {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-3.5 h-3.5 fill-current" />)}
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest ml-2">4.9 / 5.0 Rating</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {reviews.length > 0 ? reviews.slice(0, 3).map((r, i) => (
                <motion.div
                  key={r.$id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white p-10 rounded-[3rem] shadow-sm border border-stone-50 flex flex-col"
                >
                  <p className="text-stone-600 text-[13px] leading-relaxed italic mb-8 grow">"{r.review}"</p>
                  <div className="flex items-center gap-4 border-t border-stone-50 pt-6">
                    <div className="w-8 h-8 rounded-full bg-stone-50 flex items-center justify-center text-[10px] font-bold text-stone-400 border border-stone-100">{r.username.charAt(0)}</div>
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-stone-900">{r.username}</div>
                      <div className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest">Verified Glow</div>
                    </div>
                  </div>
                </motion.div>
              )) : (
                <div className="md:col-span-3 text-center py-20 bg-stone-50/50 rounded-[3rem] border border-dashed border-stone-200">
                  <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">The community is waiting for your experience.</span>
                </div>
              )}
            </div>

            {user && canReview && (
              <div className="mt-32 max-w-2xl mx-auto">
                <form onSubmit={handleReviewSubmit} className="bg-[#0A0A0A] p-12 rounded-[3.5rem] text-white shadow-3xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/10 rounded-full blur-[80px]" />
                  <div className="relative z-10 text-center">
                    <h4 className="font-serif text-3xl mb-8 italic">Add your Radiance</h4>
                    <div className="flex justify-center gap-3 mb-10">
                      {[1, 2, 3, 4, 5].map(i => (
                        <button key={i} type="button" onClick={() => setRating(i)} className={`p-1 transition-all ${i <= rating ? 'text-rose-300 scale-125' : 'text-white/10 scale-100'}`}>
                          <Star className={`w-6 h-6 ${i <= rating ? 'fill-current' : ''}`} />
                        </button>
                      ))}
                    </div>
                    <textarea
                      value={newReview}
                      onChange={e => setNewReview(e.target.value)}
                      placeholder="Share how your ritual has evolved..."
                      className="w-full bg-white/5 border border-white/10 rounded-[2rem] p-8 text-sm outline-none focus:ring-1 focus:ring-rose-500/30 mb-8 min-h-[160px] resize-none text-center"
                    />
                    <Button disabled={isSubmittingReview} className="w-full h-16 rounded-full bg-white text-stone-900 font-bold uppercase tracking-[0.2em] text-[10px] hover:bg-rose-50 transition-all">
                      {isSubmittingReview ? "Archiving..." : "Post Experience"}
                    </Button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Minimalism Mobile Action Pill */}
      <AnimatePresence>
        {!isNearFooter && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-6 left-6 right-6 z-50 md:hidden flex justify-center"
          >
            <button
              onClick={handleAddToCart}
              className="w-full h-14 bg-[#0A0A0A] text-white rounded-full flex items-center justify-between px-6 shadow-2xl ring-1 ring-white/10 active:scale-95 transition-all"
            >
              <div className="flex items-center gap-3">
                <Sparkles className="w-4 h-4 text-rose-300" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Add to Ritual</span>
              </div>
              <span className="text-xs font-light opacity-60">Rs. {displayPrice}</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sentinel for hiding the pill before footer */}
      <div ref={footerSentinelRef} className="h-10" />

    </div>
  );
}

function ParallaxImage({ src, index }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 50 * (index + 1)]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.05, 1]);

  return (
    <motion.div
      ref={ref}
      style={{ y }}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 1.2, delay: index * 0.1 }}
      className="bg-white group overflow-hidden relative shadow-2xl shadow-stone-900/5 rounded-2xl"
    >
      <motion.img
        style={{ scale }}
        src={src}
        alt=""
        className="w-full h-auto object-cover opacity-95 transition-opacity duration-1000 group-hover:opacity-100"
      />
      <div className="absolute inset-0 ring-1 ring-inset ring-black/5 rounded-2xl" />
    </motion.div>
  );
}

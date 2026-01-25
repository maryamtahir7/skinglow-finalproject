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
  Zap, Award, FlaskConical
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import Footer from "../components/footer";

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

  // Sticky Bar Logic
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [isFooterVisible, setIsFooterVisible] = useState(false);
  const mainButtonRef = useRef(null);
  const footerRef = useRef(null);

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

  // Observer for Main CTA (to show sticky bar)
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowStickyBar(!entry.isIntersecting);
      },
      { threshold: 0 }
    );
    if (mainButtonRef.current) observer.observe(mainButtonRef.current);
    return () => observer.disconnect();
  }, [loading]);

  // Observer for Footer (to hide sticky bars proactively)
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsFooterVisible(entry.isIntersecting);
      },
      {
        threshold: 0,
        rootMargin: "0px 0px 200px 0px" // Hide 200px before it hits the footer
      }
    );
    if (footerRef.current) observer.observe(footerRef.current);
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

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7]">
      <motion.div
        animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="w-16 h-16 border-b-2 border-stone-800 rounded-full"
      />
    </div>
  );
  if (!product) return null;

  const images = [product.imageUrl, product.imageUrl2, product.imageUrl3].filter(Boolean);
  const displayPrice = parseInt(product.price).toLocaleString();

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-stone-900 font-sans selection:bg-rose-100 pb-0 overflow-x-hidden">

      {/* 1. TOP NAV BAR (Floating & Unified) */}
      <AnimatePresence>
        {!isFooterVisible && (
          <motion.nav
            initial={{ y: -100 }} animate={{ y: 0 }} exit={{ y: -100 }}
            className="fixed top-0 left-0 right-0 z-50 px-6 py-6 flex justify-between items-center pointer-events-none"
          >
            <motion.button
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              onClick={() => navigate('/products')}
              className="pointer-events-auto w-12 h-12 flex items-center justify-center bg-white border border-stone-100 rounded-full shadow-lg hover:shadow-xl transition-all group"
            >
              <ArrowLeft className="w-5 h-5 text-stone-800 group-hover:-translate-x-1 transition-transform" />
            </motion.button>

            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="hidden md:flex items-center gap-2 bg-white/95 backdrop-blur-xl border border-stone-100 px-6 py-3 rounded-full shadow-xl"
            >
              <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-stone-400 pt-0.5">Viewing</span>
              <span className="text-sm font-serif italic text-stone-800">{product.name}</span>
            </motion.div>

            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="flex gap-2"
            >
              <button onClick={handleWishlist} className="pointer-events-auto w-12 h-12 flex items-center justify-center bg-white border border-stone-100 rounded-full shadow-lg hover:text-rose-600 transition-all">
                <Heart className="w-5 h-5" />
              </button>
            </motion.div>
          </motion.nav>
        )}
      </AnimatePresence>

      <div className="max-w-[1800px] mx-auto pt-24">
        <div className="grid lg:grid-cols-2 gap-0 lg:gap-16 xl:gap-32">

          {/* 2. IMmersive GALLERY (Sticky Vertical) */}
          <div className="relative">
            <div className="hidden lg:block space-y-4 px-6 xl:px-24">
              {images.map((img, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: i * 0.2 }}
                  className="bg-white group cursor-zoom-in relative"
                >
                  <img src={img} alt="" className="w-full h-auto object-cover opacity-95 transition-all duration-1000 group-hover:scale-[1.02]" />
                  <div className="absolute inset-0 ring-1 ring-inset ring-black/5" />
                </motion.div>
              ))}
            </div>

            {/* Mobile Slider */}
            <div className="lg:hidden w-full aspect-[4/5] bg-white relative overflow-hidden">
              <div
                className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide h-full"
                onScroll={(e) => {
                  const idx = Math.round(e.target.scrollLeft / e.target.offsetWidth);
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
                  <Droplets className="w-3 h-3" /> Formulation No. {Math.floor(Math.random() * 900) + 100}
                </span>
              </div>

              {/* Title & Price */}
              <header className="mb-12">
                <h1 className="text-4xl sm:text-5xl xl:text-7xl font-serif text-stone-900 leading-[1] mb-8 tracking-tight">
                  {product.name}
                </h1>

                <div className="flex items-baseline gap-6">
                  <div className="text-3xl xl:text-4xl font-light text-stone-900">
                    Rs. {displayPrice}
                  </div>
                  <div className="text-xl font-light text-stone-400 line-through decoration-rose-300/40">
                    Rs. {(parseInt(product.price) * 1.2).toLocaleString()}
                  </div>
                  <div className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-sm uppercase tracking-wider border border-rose-100/50">
                    Limited Time 20% Off
                  </div>
                </div>
              </header>

              {/* Description */}
              <div className="mb-16">
                <p className="text-xl text-stone-600 font-light leading-relaxed first-letter:text-5xl first-letter:font-serif first-letter:mr-3 first-letter:float-left first-letter:text-stone-900">
                  {product.description ? product.description.replace(/â/g, "-").replace(/[^\x00-\x7F]/g, "") : "Experience the pinnacle of skincare science combined with rare botanicals."}
                </p>
              </div>

              {/* ACTIONS Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-16" ref={mainButtonRef}>
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
                  className="h-16 rounded-full bg-stone-900 text-white font-bold uppercase tracking-[0.2em] text-xs hover:bg-stone-800 transition-all shadow-[0_10px_30px_rgba(0,0,0,0.1)] hover:-translate-y-1 active:translate-y-0"
                >
                  Add to Ritual
                </Button>

                <Button
                  onClick={handleBuyNow}
                  variant="outline"
                  className="sm:col-span-2 h-16 rounded-full border border-stone-200 text-stone-900 font-bold uppercase tracking-[0.2em] text-xs bg-transparent hover:bg-stone-900 hover:text-white transition-all duration-500"
                >
                  Express Checkout
                </Button>
              </div>

              {/* THE RITUAL (Formerly Usage) */}
              <section className="mb-24 py-12 border-t border-b border-stone-100">
                <div className="flex items-center gap-3 mb-8">
                  <Sparkles className="w-5 h-5 text-rose-400" />
                  <h3 className="font-serif text-2xl text-stone-800 italic">The Daily Ritual</h3>
                </div>
                <div className="grid grid-cols-3 gap-8">
                  {[
                    { step: "01", title: "Cleanse", icon: Droplets, desc: "Purify skin with gentle warmth." },
                    { step: "02", title: "Apply", icon: Sparkles, desc: "Press 3-4 drops into damp skin." },
                    { step: "03", title: "Seal", icon: Moon, desc: "Layer with moisturizer for glow." }
                  ].map((s, i) => (
                    <div key={i} className="space-y-4">
                      <div className="flex items-baseline justify-between">
                        <span className="text-[10px] font-bold tracking-tighter text-stone-300">{s.step}</span>
                        <s.icon className="w-4 h-4 text-rose-200" />
                      </div>
                      <h4 className="text-xs font-bold uppercase tracking-widest text-stone-800">{s.title}</h4>
                      <p className="text-[10px] text-stone-500 leading-relaxed uppercase tracking-wide font-medium">{s.desc}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* BENEFITS HIGHLIGHTS */}
              <div className="grid grid-cols-2 gap-x-12 gap-y-16 mb-24">
                {[
                  { title: "Deep Hydration", icon: Droplets, desc: "Molecular moisture locking technology." },
                  { title: "Ethical Sourcing", icon: Leaf, desc: "100% sustainable botanical extracts." },
                  { title: "Clinical Grade", icon: FlaskConical, desc: "Potency tested for visible results." },
                  { title: "Safety First", icon: ShieldCheck, desc: "Dermatologist approved for all types." }
                ].map((item, i) => (
                  <div key={i} className="group cursor-default">
                    <div className="w-12 h-12 rounded-2xl bg-white border border-stone-100 flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 group-hover:bg-stone-900 group-hover:text-white transition-all duration-500">
                      <item.icon className="w-5 h-5" />
                    </div>
                    <h4 className="text-sm font-bold uppercase tracking-widest mb-3">{item.title}</h4>
                    <p className="text-sm text-stone-500 font-light leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>

              {/* ACCORDIONS (Cinematic) */}
              <div className="space-y-2 border-t border-stone-100 pt-12">
                {[
                  { id: 'ingredients', title: "Active Ingredients", content: "Infused with high-purity Hyaluronic Acid, stabilized Vitamin C, and a proprietary blend of 5 bio-fermented botanicals for maximum bioavailability." },
                  { id: 'clinical', title: "Clinical Results", content: "94% noticed improved radiance. 89% reported reduced fine lines. Results based on a 4-week independent consumer study." },
                  { id: 'shipping', title: "The Delivery", content: "Shipped in climate-controlled sustainable packaging. Expected arrival: 2-4 business days." }
                ].map((item) => (
                  <div key={item.id} className="group overflow-hidden rounded-2xl border border-transparent hover:border-stone-100 transition-all">
                    <button
                      onClick={() => setActiveAccordion(activeAccordion === item.id ? null : item.id)}
                      className="w-full py-6 flex items-center justify-between px-2"
                    >
                      <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-stone-500 group-hover:text-stone-900 transition-colors">{item.title}</span>
                      <Plus className={`w-3.5 h-3.5 text-stone-400 transition-transform duration-500 ${activeAccordion === item.id ? 'rotate-45 text-rose-500' : ''}`} />
                    </button>
                    <AnimatePresence>
                      {activeAccordion === item.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.5, ease: "circOut" }}
                        >
                          <div className="px-2 pb-8 text-sm text-stone-600 font-light leading-relaxed max-w-lg">
                            {item.content}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>

              {/* REVIEWS (Refined) */}
              <div className="mt-32 mb-16">
                <div className="flex items-center justify-between mb-12">
                  <h3 className="font-serif text-3xl">Community Voice</h3>
                  <div className="flex flex-col items-end">
                    <div className="flex text-amber-400 gap-0.5 mb-1">
                      {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-3.5 h-3.5 fill-current" />)}
                    </div>
                    <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">4.9 Average Rating</span>
                  </div>
                </div>

                <div className="grid gap-12">
                  {reviews.length > 0 ? reviews.slice(0, 3).map(r => (
                    <div key={r.$id} className="relative pl-8 border-l border-stone-200">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-6 h-6 rounded-full bg-stone-100 flex items-center justify-center text-[10px] font-bold">{r.username.charAt(0)}</div>
                        <span className="text-xs font-bold uppercase tracking-widest text-stone-900">{r.username}</span>
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 rounded-full border border-emerald-100">Verified</span>
                      </div>
                      <p className="text-stone-600 text-sm leading-relaxed italic mb-4">"{r.review}"</p>
                      <time className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">{new Date(r.$createdAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</time>
                    </div>
                  )) : (
                    <div className="text-center py-12 bg-stone-50 rounded-3xl border border-dashed border-stone-200">
                      <span className="text-xs font-bold text-stone-400 uppercase tracking-widest">No reviews yet. Be the first to share your experience.</span>
                    </div>
                  )}
                </div>

                {user && canReview && (
                  <form onSubmit={handleReviewSubmit} className="mt-16 bg-[#0A0A0A] p-10 rounded-[2rem] text-white shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/10 rounded-full blur-[80px]" />
                    <div className="relative z-10">
                      <h4 className="font-serif text-2xl mb-8">Share your Ritual</h4>
                      <div className="flex gap-2 mb-8">
                        {[1, 2, 3, 4, 5].map(i => (
                          <button key={i} type="button" onClick={() => setRating(i)} className={`p-1 transition-colors ${i <= rating ? 'text-rose-300' : 'text-white/10'}`}>
                            <Star className={`w-6 h-6 ${i <= rating ? 'fill-current' : ''}`} />
                          </button>
                        ))}
                      </div>
                      <textarea
                        value={newReview}
                        onChange={e => setNewReview(e.target.value)}
                        placeholder="How does your skin feel?"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-sm outline-none focus:ring-1 focus:ring-white/20 mb-6 min-h-[120px]"
                      />
                      <Button disabled={isSubmittingReview} className="w-full h-14 rounded-full bg-white text-stone-900 font-bold uppercase tracking-widest text-xs hover:bg-rose-100 transition-all">
                        {isSubmittingReview ? "Archiving..." : "Post Experience"}
                      </Button>
                    </div>
                  </form>
                )}
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* 4. FLOATING ACTION PILL (Mobile Only) */}
      <AnimatePresence>
        {(showStickyBar && !isFooterVisible) && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="fixed bottom-8 left-6 right-6 z-50 flex justify-center md:hidden"
          >
            <div className="bg-white border border-stone-100 rounded-full p-2 w-full flex items-center shadow-[0_20px_50px_rgba(0,0,0,0.2)] ring-1 ring-black/5">
              <div className="flex items-center gap-3 pl-4 flex-1">
                <img src={images[0]} alt="" className="w-10 h-10 object-cover rounded-full bg-stone-50 ring-1 ring-black/5" />
                <div className="overflow-hidden">
                  <div className="text-[10px] font-bold text-stone-900 truncate uppercase tracking-widest">{product.name}</div>
                  <div className="text-[10px] text-stone-500 font-bold">Rs. {displayPrice}</div>
                </div>
              </div>
              <button
                onClick={handleAddToCart}
                className="bg-stone-900 text-white px-6 py-3.5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] shadow-lg active:scale-95 transition-all"
              >
                Add
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Sticky Footer (Refined) */}
      <AnimatePresence>
        {(showStickyBar && !isFooterVisible) && (
          <motion.div
            initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
            className="hidden md:block fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-3xl border-t border-stone-100 py-6 px-12 z-40 transition-all shadow-[0_-10px_50px_rgba(0,0,0,0.05)]"
          >
            <div className="max-w-[1700px] mx-auto flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="relative group">
                  <img src={images[0]} alt="" className="w-16 h-16 object-cover rounded-[2px] bg-stone-50 shadow-sm" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">Currently Viewing</div>
                  <div className="font-serif text-2xl text-stone-900 italic tracking-tight">{product.name}</div>
                </div>
              </div>

              <div className="flex items-center gap-12">
                <div className="text-right">
                  <div className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">Total Value</div>
                  <div className="text-2xl font-light text-stone-800">Rs. {(parseInt(product.price) * quantity).toLocaleString()}</div>
                </div>

                <div className="flex items-center border border-stone-100 rounded-full h-14 bg-stone-50 px-2 shadow-inner">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-3 hover:text-rose-600 active:scale-90 transition"><Minus className="w-3.5 h-3.5" /></button>
                  <span className="w-10 text-center font-bold text-lg tabular-nums tracking-tighter">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="p-3 hover:text-rose-600 active:scale-90 transition"><Plus className="w-3.5 h-3.5" /></button>
                </div>

                <div className="flex gap-4">
                  <Button onClick={handleAddToCart} className="h-14 px-12 rounded-full bg-stone-900 text-white font-bold uppercase tracking-[0.2em] text-[10px] hover:bg-stone-800 shadow-xl shadow-stone-900/10 transition-all hover:-translate-y-0.5">
                    Add to Ritual
                  </Button>
                  <Button onClick={handleBuyNow} variant="outline" className="h-14 px-12 rounded-full border border-stone-200 text-stone-900 font-bold uppercase tracking-[0.2em] text-[10px] hover:bg-stone-900 hover:text-white transition-all hover:-translate-y-0.5">
                    Express Checkout
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div ref={footerRef}>
        <Footer />
      </div>

    </div>
  );
}

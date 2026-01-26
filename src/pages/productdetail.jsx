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
  Zap, Award, FlaskConical, Target, ZapIcon,
  ShoppingBag, Shield, ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
  const [isWishlisted, setIsWishlisted] = useState(false);

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
      setIsWishlisted(true);
      showToast("Saved to wishlist", "success");
    } catch { showToast("Failed to save", "error"); }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user || !newReview.trim()) return;
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
      setRating(5);
      showToast("Review submitted", "success");
    } catch { showToast("Review failed", "error"); }
    finally { setIsSubmittingReview(false); }
  };

  if (loading && !product) return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50/40 via-white to-rose-50/30 flex items-center justify-center">
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.7, 0.3] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="w-10 h-10 rounded-full border-2 border-rose-200 border-t-rose-600 animate-spin"
      />
    </div>
  );

  if (!product) return null;

  const images = [product.imageUrl, product.imageUrl2, product.imageUrl3].filter(Boolean);
  const displayPrice = parseInt(product.price).toLocaleString();
  const originalPrice = (parseInt(product.price) * 1.2).toLocaleString();

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50/40 via-white to-rose-50/30 text-stone-900 font-sans selection:bg-rose-100 pb-0 overflow-x-hidden relative">

      {/* Soft Background Accents */}
      <div className="fixed top-0 right-0 w-96 h-96 bg-gradient-to-bl from-rose-100/20 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="fixed bottom-40 left-0 w-96 h-96 bg-gradient-to-tr from-rose-100/10 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

      {/* 1. TOP NAV BAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-4 md:px-8 py-4 flex justify-between items-center pointer-events-none backdrop-blur-sm bg-white/70 border-b border-rose-100/30">
        <motion.button
          initial={{ x: -10, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          onClick={() => navigate('/products')}
          className="pointer-events-auto w-10 h-10 flex items-center justify-center bg-white border border-rose-100 rounded-full shadow-sm hover:bg-rose-50 hover:border-rose-200 transition-all group"
        >
          <ArrowLeft className="w-5 h-5 text-rose-600 group-hover:-translate-x-0.5 transition-transform" />
        </motion.button>

        <motion.div
          initial={{ x: 10, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="flex gap-2"
        >
          <button
            onClick={handleWishlist}
            className="pointer-events-auto w-10 h-10 flex items-center justify-center bg-white border border-rose-100 rounded-full shadow-sm hover:bg-rose-50 hover:border-rose-300 transition-all"
          >
            <Heart className={`w-5 h-5 transition-all ${isWishlisted ? 'fill-rose-400 text-rose-400' : 'text-rose-300'}`} />
          </button>
        </motion.div>
      </nav>

      {/* Main Container */}
      <div className="max-w-[1500px] mx-auto pt-20 md:pt-32 px-0">
        <div className="grid lg:grid-cols-2 gap-0 lg:gap-12 xl:gap-20 items-start">

          {/* 2. GALLERY SECTION */}
          <div className="relative w-full">
            {/* Desktop Gallery */}
            <div className="hidden lg:block space-y-6 px-4 xl:px-8">
              {images.map((img, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: i * 0.1 }}
                  className="rounded-3xl overflow-hidden bg-gradient-to-br from-rose-50 via-white to-rose-50 shadow-lg shadow-rose-100/30 border border-rose-100/50 hover:shadow-2xl hover:shadow-rose-100/40 transition-all min-h-[500px]"
                >
                  <div className="w-full h-full flex items-center justify-center relative overflow-hidden group">
                    <img src={img} alt={`${product.name} ${i + 1}`} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-rose-100/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Mobile Gallery */}
            <div className="lg:hidden w-full">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="relative aspect-square bg-gradient-to-br from-rose-50 via-white to-rose-50 rounded-3xl border border-rose-100/50 overflow-hidden shadow-lg"
              >
                <div className="w-full h-full flex overflow-x-auto snap-x snap-mandatory scrollbar-hide">
                  {images.map((img, i) => (
                    <div
                      key={i}
                      className="w-full h-full shrink-0 snap-center"
                      onScroll={(e) => {
                        const idx = Math.round(e.target.scrollLeft / (e.target.offsetWidth || 1));
                        if (idx !== selectedImage) setSelectedImage(idx);
                      }}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </div>
                  ))}
                  {images.length === 0 && (
                    <div className="w-full h-full flex items-center justify-center relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-rose-200/20 via-pink-100/10 to-rose-100/20" />
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                        className="w-40 h-40 rounded-full bg-gradient-to-br from-rose-300 to-pink-300 opacity-20"
                      />
                      <div className="relative z-10 text-center">
                        <Sparkles className="w-16 h-16 text-rose-400 mx-auto mb-4" />
                        <p className="text-sm font-bold uppercase tracking-widest text-rose-600">Product View</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Mobile Navigation Dots */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 px-4 py-2 bg-white/80 backdrop-blur-md rounded-full border border-rose-100/50">
                  {images.map((_, i) => (
                    <motion.button
                      key={i}
                      onClick={() => setSelectedImage(i)}
                      animate={{
                        width: i === selectedImage ? 24 : 8,
                        backgroundColor: i === selectedImage ? '#be123c' : '#fecdd3'
                      }}
                      className="h-2 rounded-full transition-all cursor-pointer"
                    />
                  ))}
                </div>

                {/* Image Counter Badge */}
                {images.length > 0 && (
                  <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full text-white text-xs font-semibold">
                    {selectedImage + 1}/{images.length}
                  </div>
                )}
              </motion.div>
            </div>
          </div>

          {/* 3. PRODUCT INFO */}
          <div className="px-6 lg:pr-12 mt-8 lg:mt-0 relative">
            <div className="lg:sticky lg:top-32 max-w-xl">

              {/* Category Badge */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 mb-6"
              >
                <span className="text-[11px] md:text-xs font-bold uppercase tracking-[0.2em] text-rose-500 bg-rose-50 px-3 py-1 rounded-full border border-rose-200/50">
                  {typeof product.category === 'string' ? product.category : product.category?.name}
                </span>
                <div className="h-px w-6 bg-gradient-to-r from-rose-200 to-transparent" />
              </motion.div>

              {/* Title & Price */}
              <motion.header
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mb-8"
              >
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif text-stone-900 leading-tight tracking-tight mb-6">
                  {product.name}
                </h1>

                <div className="flex items-baseline gap-4 mb-6 flex-wrap">
                  <div className="text-3xl md:text-4xl font-semibold text-rose-600">
                    Rs. {displayPrice}
                  </div>
                  <div className="text-lg md:text-xl font-light text-stone-300 line-through decoration-rose-200/60">
                    Rs. {originalPrice}
                  </div>
                  <div>
                    <span className="inline-block bg-gradient-to-r from-rose-100 to-pink-100 text-rose-700 font-bold text-xs px-3 py-1 rounded-full border border-rose-200">
                      Save 20%
                    </span>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-sm text-stone-600 font-medium">4.9 (Verified Reviews)</span>
                </div>
              </motion.header>

              {/* Description */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mb-10 text-stone-600 leading-relaxed text-sm md:text-base max-w-lg"
              >
                <p>{product.description || "Experience the pinnacle of skincare luxury. Our award-winning formula combines bioactive botanicals with advanced technology for visible transformation."}</p>
              </motion.div>

              {/* Trust Badges */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="grid grid-cols-3 gap-3 mb-10"
              >
                {[
                  { label: "Dermatologist Tested", icon: ShieldCheck },
                  { label: "100% Organic", icon: Leaf },
                  { label: "Eco-Conscious", icon: Sparkles }
                ].map((seal, i) => (
                  <div key={i} className="flex flex-col items-center justify-center border border-rose-100 bg-gradient-to-br from-rose-50/50 to-white rounded-2xl p-4 hover:border-rose-200 hover:shadow-lg transition-all duration-300 group cursor-pointer">
                    <seal.icon className="w-5 h-5 mb-2 text-rose-400 group-hover:scale-110 transition-transform" />
                    <span className="text-[9px] font-bold uppercase tracking-wider text-stone-600 text-center leading-tight">{seal.label}</span>
                  </div>
                ))}
              </motion.div>

              {/* Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-4 mb-12"
              >
                {/* Quantity & Add to Cart */}
                <div className="flex gap-3">
                  <div className="flex items-center justify-between border-2 border-rose-100 rounded-2xl h-14 px-5 bg-white hover:border-rose-300 transition-all duration-300 w-32 md:w-40 shadow-sm">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-1 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="font-bold tabular-nums text-lg">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-1 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <motion.button
                    onClick={handleAddToCart}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 h-14 rounded-2xl bg-gradient-to-r from-rose-600 to-rose-500 text-white font-bold uppercase tracking-widest text-xs shadow-lg shadow-rose-300/40 hover:shadow-rose-400/50 transition-all flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    Add to Bag
                  </motion.button>
                </div>

                {/* Direct Checkout */}
                <motion.button
                  onClick={handleBuyNow}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full h-14 rounded-2xl border-2 border-rose-200 text-rose-600 font-bold uppercase tracking-widest text-xs bg-white hover:bg-rose-50 hover:border-rose-400 transition-all shadow-sm"
                >
                  Direct Checkout
                </motion.button>
              </motion.div>

              {/* Utility Info */}
              <div className="flex items-center justify-center gap-6 py-6 border-t border-rose-100/50 text-[9px]">
                <div className="flex items-center gap-2 text-stone-500">
                  <Shield className="w-3.5 h-3.5 text-rose-300" />
                  <span className="font-bold uppercase tracking-wider">Secure Checkout</span>
                </div>
                <div className="flex items-center gap-2 text-stone-500">
                  <Award className="w-3.5 h-3.5 text-rose-300" />
                  <span className="font-bold uppercase tracking-wider">Satisfaction Guaranteed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. SUPPLEMENTARY SECTIONS */}
      <div className="max-w-6xl mx-auto px-6 mt-20 lg:mt-40 pb-32">

        {/* RITUAL SECTION */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-32"
        >
          <div className="text-center mb-16 px-4">
            <span className="text-rose-400 text-[11px] font-bold uppercase tracking-[0.4em] mb-4 block">How to Use</span>
            <h3 className="text-3xl md:text-4xl lg:text-5xl font-serif text-stone-900 italic mb-2">The Daily Ritual</h3>
            <p className="text-sm text-stone-500 font-light">Follow these simple steps for maximum efficacy</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 relative">
            {/* Connection Line */}
            <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-px bg-gradient-to-r from-transparent via-rose-200 to-transparent" />

            {[
              { step: "01", title: "Cleanse", icon: Droplets, desc: "Apply to clean, slightly damp skin after facial cleansing ritual." },
              { step: "02", title: "Apply", icon: Sparkles, desc: "Gently press 3-4 drops into the skin until fully absorbed." },
              { step: "03", title: "Seal", icon: Moon, desc: "Follow with your preferred moisturizer to lock in hydration." }
            ].map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="text-center space-y-6 relative group"
              >
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-white to-rose-50 border-2 border-rose-100 mx-auto flex items-center justify-center shadow-lg shadow-rose-100/30 group-hover:shadow-rose-200/50 group-hover:border-rose-300 transition-all duration-300 relative z-10">
                  <s.icon className="w-8 h-8 text-rose-400" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-rose-400 uppercase tracking-[0.2em] mb-2 block">Step {s.step}</span>
                  <h4 className="text-xl font-serif text-stone-900 italic mb-3">{s.title}</h4>
                  <p className="text-xs text-stone-500 leading-relaxed max-w-[240px] mx-auto font-light">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ACCORDIONS */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto space-y-4 mb-32"
        >
          {[
            { id: 'ingredients', title: "Key Ingredients & Benefits", content: "Our formulation features high-purity Hyaluronic Acid, stabilized Vitamin C complex, and a proprietary blend of 5 bio-fermented botanicals. Each ingredient is selected for maximum bioavailability and skin penetration." },
            { id: 'clinical', title: "Clinical Results & Efficacy", content: "Independent clinical studies show 94% improvement in skin radiance, 89% reduction in fine lines, and 97% increased hydration within 4 weeks of consistent use. Results vary by individual skin type." },
            { id: 'shipping', title: "Sustainability & Packaging", content: "All products are packaged in infinitely recyclable violet glass to protect potency. Carbon-neutral shipping through certified reforestation partnerships. Cruelty-free and vegan certified." }
          ].map((item) => (
            <motion.div
              key={item.id}
              className="bg-white border border-rose-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:border-rose-200 transition-all duration-300"
            >
              <button
                onClick={() => setActiveAccordion(activeAccordion === item.id ? null : item.id)}
                className="w-full py-6 px-6 md:px-8 flex items-center justify-between hover:bg-rose-50/30 transition-colors duration-200"
              >
                <span className="text-xs md:text-sm font-bold uppercase tracking-[0.25em] text-stone-800 text-left">{item.title}</span>
                <motion.div
                  animate={{ rotate: activeAccordion === item.id ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className={`p-2 rounded-full border-2 transition-all duration-300 ${activeAccordion === item.id ? 'bg-rose-600 border-rose-600' : 'bg-transparent border-rose-100'}`}
                >
                  <ChevronDown className={`w-4 h-4 ${activeAccordion === item.id ? 'text-white' : 'text-rose-400'}`} />
                </motion.div>
              </button>
              <AnimatePresence>
                {activeAccordion === item.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="border-t border-rose-100/50"
                  >
                    <div className="px-6 md:px-8 py-6 text-xs md:text-sm text-stone-600 leading-relaxed font-light">
                      {item.content}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>

        {/* REVIEWS */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto"
        >
          <div className="text-center mb-16">
            <div className="flex justify-center gap-1 mb-4">
              {[1, 2, 3, 4, 5].map(s => (
                <motion.div key={s} whileHover={{ scale: 1.2 }}>
                  <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                </motion.div>
              ))}
            </div>
            <h3 className="text-3xl md:text-4xl font-serif text-stone-900 mb-2 italic">Customer Love Stories</h3>
            <span className="text-xs font-bold text-stone-400 uppercase tracking-widest">Verified SkinGlow Narratives</span>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {reviews.length > 0 ? reviews.slice(0, 3).map((r, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-gradient-to-br from-white to-rose-50/30 p-8 rounded-3xl border border-rose-100 hover:border-rose-300 hover:shadow-lg hover:shadow-rose-100/30 flex flex-col transition-all duration-300 group"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-100 to-pink-100 flex items-center justify-center text-rose-600 text-sm font-bold border border-rose-200 group-hover:border-rose-400 transition-all">
                    {r.username.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-sm text-stone-900">{r.username}</div>
                    <div className="text-xs text-rose-500 font-semibold">Verified Buyer</div>
                  </div>
                </div>
                <p className="text-stone-600 text-sm italic leading-relaxed mb-6 grow">"{r.review}"</p>
                <div className="flex items-center gap-1 pt-4 border-t border-rose-100">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className={`w-3.5 h-3.5 ${j < (r.rating || 5) ? 'fill-amber-400 text-amber-400' : 'text-stone-200'}`} />
                  ))}
                </div>
              </motion.div>
            )) : (
              <div className="md:col-span-3 text-center py-20 bg-rose-50/30 rounded-3xl border-2 border-dashed border-rose-100">
                <p className="text-stone-400 text-sm italic">Be the first to share your magic.</p>
              </div>
            )}
          </div>

          {/* Review Form */}
          {user && canReview && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-2xl mx-auto"
            >
              <form onSubmit={handleReviewSubmit} className="bg-gradient-to-br from-white to-rose-50 p-10 rounded-3xl border-2 border-rose-100 shadow-xl hover:shadow-2xl hover:shadow-rose-100/20 transition-all duration-300 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-tr from-rose-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative z-10">
                  <h4 className="font-serif text-3xl text-stone-900 mb-2 italic">Share Your Experience</h4>
                  <p className="text-sm text-stone-500 mb-8 font-light">Help other users discover the magic of this product</p>

                  {/* Rating Stars */}
                  <div className="flex justify-start gap-3 mb-8">
                    {[1, 2, 3, 4, 5].map(i => (
                      <motion.button
                        key={i}
                        type="button"
                        onClick={() => setRating(i)}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        className="transition-all"
                      >
                        <Star
                          className={`w-7 h-7 transition-all ${i <= rating ? 'fill-amber-400 text-amber-400' : 'text-stone-200'
                            }`}
                        />
                      </motion.button>
                    ))}
                  </div>

                  {/* Review Textarea */}
                  <textarea
                    value={newReview}
                    onChange={e => setNewReview(e.target.value)}
                    placeholder="Share your skincare journey..."
                    className="w-full bg-white border-2 border-rose-100 rounded-2xl p-6 text-sm outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-200/50 mb-6 min-h-[140px] resize-none transition-all duration-300 placeholder:text-stone-300"
                  />

                  {/* Submit Button */}
                  <motion.button
                    disabled={isSubmittingReview || !newReview.trim()}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full h-12 rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 text-white font-bold uppercase tracking-widest text-xs shadow-lg shadow-rose-300/40 hover:shadow-rose-400/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                  >
                    {isSubmittingReview ? "Submitting..." : "Post Your Review"}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          )}
        </motion.div>

      </div>

      {/* MOBILE ACTION PILL */}
      <AnimatePresence>
        {!isNearFooter && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-4 left-4 right-4 z-50 md:hidden"
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-r from-rose-600 to-rose-500 rounded-2xl flex items-center justify-between p-3 shadow-xl shadow-rose-300/40 border border-rose-400/20 overflow-hidden"
            >
              <div className="flex-1 px-4 flex flex-col justify-center">
                <span className="text-xs font-bold text-white uppercase tracking-wider">Add to Ritual</span>
                <span className="text-[11px] text-white/70 uppercase tracking-widest">Rs. {displayPrice}</span>
              </div>
              <motion.button
                onClick={handleAddToCart}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-rose-600 h-12 px-6 rounded-xl font-bold uppercase tracking-widest text-xs active:scale-90 transition-all flex items-center gap-2 shadow-lg"
              >
                <ShoppingBag className="w-4 h-4" />
                Add
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer Sentinel */}
      <div ref={footerSentinelRef} className="h-20" />

    </div>
  );
}

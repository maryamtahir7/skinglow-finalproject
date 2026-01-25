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
  ShieldCheck, ArrowLeft, Share2, Sparkles, AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";

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
  const mainButtonRef = useRef(null);

  useEffect(() => {
    async function load() {
      try {
        // Fetch product first to ensure it exists
        const p = await getProductById(id);
        setProduct(p);

        // Then fetch reviews gracefully
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

  // Scroll observer for sticky bar
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

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-12 h-12 border-4 border-stone-200 border-t-stone-800 rounded-full animate-spin" /></div>;
  if (!product) return null;

  // Images Logic
  const images = [product.imageUrl, product.imageUrl2, product.imageUrl3].filter(Boolean);
  const displayPrice = parseInt(product.price).toLocaleString();

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-stone-900 font-sans selection:bg-rose-100 pb-32">

      {/* 1. STICKY HEADER (Mobile/Desktop) */}
      {/* 1. STICKY HEADER (Mobile/Desktop) - Floating Pill on Mobile */}
      {/* 1. STICKY HEADER (Mobile/Desktop) - Floating Pill on Mobile */}
      <div className="fixed top-4 left-4 right-4 z-40 flex justify-between pointer-events-none md:sticky md:top-0 md:bg-white/90 md:backdrop-blur-xl md:border-b md:border-stone-100 md:px-8 md:py-5 md:inset-x-0 md:pointer-events-auto transition-all duration-300">
        <button
          onClick={() => navigate('/products')}
          className="pointer-events-auto flex items-center justify-center gap-2 group"
        >
          <div className="w-10 h-10 md:w-auto md:h-auto flex items-center justify-center bg-white/90 md:bg-transparent backdrop-blur rounded-full shadow-sm md:shadow-none transition-all group-hover:-translate-x-1">
            <ArrowLeft className="w-5 h-5 md:w-4 md:h-4 text-stone-800" />
          </div>
          <span className="hidden md:inline text-xs font-bold uppercase tracking-[0.15em] text-stone-500 group-hover:text-stone-900 transition-colors">Back to Shop</span>
        </button>

        <div className="hidden md:block font-serif italic text-xl text-stone-900 opacity-0 lg:opacity-100 transition-opacity p-2">
          {product.name}
        </div>

        <button className="pointer-events-auto w-10 h-10 md:hidden flex items-center justify-center text-stone-900 bg-white/90 backdrop-blur rounded-full shadow-sm hover:scale-105 transition-transform">
          <Share2 className="w-5 h-5" />
        </button>

        {/* Desktop Share/Wishlist in Header */}
        <div className="hidden md:flex items-center gap-2">
          <button onClick={handleWishlist} className="pointer-events-auto p-2 hover:bg-rose-50 hover:text-rose-600 rounded-full transition-colors text-stone-400">
            <Heart className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-24">

          {/* 2. LEFT: STICKY GALLERY */}
          <div className="relative">
            {/* Desktop: Vertical Sticky Stack */}
            <div className="hidden lg:block sticky top-24 space-y-4 pl-6 xl:pl-20">
              {images.map((img, i) => (
                <div key={i} className="bg-stone-50 w-full aspect-[4/5] rounded-[2px] overflow-hidden group cursor-zoom-in">
                  <img src={img} alt="" className="w-full h-full object-cover mix-blend-multiply opacity-90 group-hover:scale-105 transition-transform duration-700" />
                </div>
              ))}
            </div>

            {/* Mobile: Full Screen Immersive Gallery */}
            <div className="lg:hidden w-full aspect-[4/5] bg-stone-100 relative overflow-hidden">
              <div className="absolute inset-0 flex overflow-x-auto scrollbar-hide snap-x snap-mandatory">
                {images.map((img, i) => (
                  <div key={i} className="w-full h-full shrink-0 snap-center relative">
                    <img src={img} alt="" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-900/10 to-transparent" />
                  </div>
                ))}
              </div>

              {/* Pagination Dots */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 bg-black/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
                {images.map((_, i) => (
                  <div key={i} className={`w-1.5 h-1.5 rounded-full transition-all ${i === selectedImage ? 'bg-white w-3' : 'bg-white/50'}`} />
                ))}
              </div>
            </div>
          </div>


          {/* 3. RIGHT: CONTENT & STORY */}
          <div className="px-6 lg:pr-24 pt-8 lg:pt-0">
            <div className="lg:sticky lg:top-24 lg:max-h-screen lg:overflow-y-auto scrollbar-hide pb-32">

              {/* Header */}
              <div className="mb-8 mt-6 lg:mt-0">
                <div className="flex flex-wrap items-center gap-3 mb-6">
                  <div className="px-3 py-1 bg-gradient-to-r from-rose-50 to-rose-100/50 text-rose-900 text-[10px] font-bold uppercase tracking-[0.15em] rounded-full border border-rose-100">
                    {typeof product.category === 'string' ? product.category : product.category?.name}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-stone-500 bg-stone-50 px-3 py-1 rounded-full border border-stone-100">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span className="text-stone-800">4.9</span>
                    <span className="text-stone-400 font-medium">(128 Reviews)</span>
                  </div>
                </div>

                <h1 className="text-4xl lg:text-5xl xl:text-6xl font-serif text-stone-900 leading-[1.1] mb-6 tracking-tight">
                  {product.name}
                </h1>

                {/* Clean Price Display */}
                <div className="text-3xl font-medium text-stone-900 mb-8 flex items-baseline gap-4">
                  Rs. {displayPrice}
                  <span className="text-lg font-normal text-stone-400/80 line-through decoration-stone-300">
                    Rs. {(parseInt(product.price) * 1.2).toLocaleString()}
                  </span>
                  {/* Discount Badge */}
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md">
                    20% OFF
                  </span>
                </div>

                {/* Description with Charset Cleaning */}
                <p className="text-lg text-stone-600 font-light leading-relaxed mb-10 max-w-xl">
                  {product.description ? product.description.replace(/â/g, "-").replace(/[^\x00-\x7F]/g, "") : ""}
                </p>

                {/* ACTIONS - Desktop Layout Enhanced */}
                <div className="hidden lg:block space-y-8 border-b border-stone-100 pb-12 mb-12">
                  <div className="flex items-center gap-6">
                    {/* Quantity - Desktop */}
                    <div className="flex items-center border border-stone-200 rounded-full h-14 px-4 bg-white/50 hover:bg-white hover:shadow-sm transition-all">
                      <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2 hover:text-rose-600 transition"><Minus className="w-4 h-4" /></button>
                      <span className="w-12 text-center font-bold text-lg tabular-nums">{quantity}</span>
                      <button onClick={() => setQuantity(quantity + 1)} className="p-2 hover:text-rose-600 transition"><Plus className="w-4 h-4" /></button>
                    </div>

                    <Button
                      ref={mainButtonRef}
                      onClick={handleAddToCart}
                      className="flex-1 h-14 rounded-full bg-stone-900 text-white font-bold uppercase tracking-[0.15em] hover:bg-stone-800 transition-all shadow-xl shadow-stone-900/10 hover:shadow-stone-900/20 hover:-translate-y-0.5"
                    >
                      Add to Ritual
                    </Button>

                    <Button
                      onClick={handleBuyNow}
                      variant="outline"
                      className="flex-1 h-14 rounded-full border border-stone-200 text-stone-900 font-bold uppercase tracking-[0.15em] bg-transparent hover:bg-stone-50 hover:border-stone-900 transition-all"
                    >
                      Buy Now
                    </Button>
                  </div>

                  {/* Trust Badges */}
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { icon: Sparkles, text: "Free Shipping" },
                      { icon: ShieldCheck, text: "Authentic" },
                      { icon: Check, text: "Secure Checkout" }
                    ].map((badge, idx) => (
                      <div key={idx} className="flex flex-col items-center gap-2 text-center p-3 rounded-xl bg-stone-50/50 border border-stone-100/50">
                        <badge.icon className="w-5 h-5 text-rose-400" />
                        <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500">{badge.text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* STORY SECTIONS - Accordions polished */}
                <div className="space-y-12">
                  <div>
                    <h3 className="font-serif italic text-2xl mb-4 text-stone-800">The Story</h3>
                    <p className="text-stone-600 leading-relaxed font-light">
                      Inspired by ancient beauty rituals, this formula combines modern science with potent botanicals.
                      Designed to restore balance and luminosity to tired, stressed skin.
                    </p>
                  </div>

                  {/* ACCORDIONS */}
                  <div className="border-t border-stone-200">
                    {[
                      { id: 'ingredients', title: "Key Ingredients", content: "Hyaluronic Acid, Vitamin C, Niacinamide, Rosehip Oil." },
                      { id: 'usage', title: "How to Use", content: "Apply 2-3 drops to clean skin morning and night. Massage gently in upward strokes." },
                      { id: 'shipping', title: "Shipping & Returns", content: "Free shipping on orders over Rs. 5000. Returns accepted within 30 days." }
                    ].map((item) => (
                      <div key={item.id} className="border-b border-stone-200">
                        <button
                          onClick={() => setActiveAccordion(activeAccordion === item.id ? null : item.id)}
                          className="w-full py-6 flex items-center justify-between font-bold text-sm uppercase tracking-widest hover:text-rose-800 transition-colors"
                        >
                          {item.title}
                          <ChevronDown className={`w-4 h-4 transition-transform ${activeAccordion === item.id ? 'rotate-180' : ''}`} />
                        </button>
                        <AnimatePresence>
                          {activeAccordion === item.id && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden"
                            >
                              <p className="pb-6 text-stone-600 font-light leading-relaxed">{item.content}</p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </div>
                </div>

                {/* REVIEWS PREVIEW */}
                <div className="mt-16 bg-[#F4F1EE] p-8 rounded-2xl text-center">
                  <div className="flex justify-center mb-4 text-rose-500">
                    {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-5 h-5 fill-current" />)}
                  </div>
                  <h3 className="font-serif text-2xl mb-2">"Absolute Magic in a Bottle"</h3>
                  <p className="text-stone-500 italic mb-6">- Sarah J., Verified Buyer</p>

                  {!user ? (
                    <div className="text-xs text-stone-400">Login to write a review</div>
                  ) : !canReview ? (
                    <div className="text-sm text-stone-500 bg-stone-100 p-4 rounded-lg">
                      <p className="font-bold flex items-center justify-center gap-2">
                        <AlertCircle className="w-4 h-4" /> Verification Required
                      </p>
                      <p className="mt-1">
                        Only verified buyers who have received this product can write a review.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleReviewSubmit} className="space-y-4">
                      <textarea
                        value={newReview}
                        onChange={e => setNewReview(e.target.value)}
                        placeholder="Share your experience..."
                        className="w-full bg-white p-4 rounded-xl text-sm outline-none focus:ring-1 focus:ring-stone-300"
                      />
                      <Button disabled={isSubmittingReview} className="w-full bg-stone-900 text-white">
                        {isSubmittingReview ? "Posting..." : "Write a Review"}
                      </Button>
                    </form>
                  )}

                  <div className="mt-8 space-y-6 text-left">
                    {reviews.slice(0, 3).map(r => (
                      <div key={r.$id} className="border-b border-stone-200/50 pb-4">
                        <div className="flex justify-between text-xs font-bold text-stone-900 mb-1">
                          <span>{r.username}</span>
                          <span>{new Date(r.$createdAt).toLocaleDateString()}</span>
                        </div>
                        <p className="text-sm text-stone-600">{r.review}</p>
                      </div>
                    ))}
                  </div>

                </div>

              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. STICKY BOTTOM BAR (Appears on Scroll) */}
      <AnimatePresence>
        {showStickyBar && (
          <motion.div
            initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 bg-white border-t border-stone-100 p-4 z-50 shadow-[0_-5px_30px_rgba(0,0,0,0.05)] pb-6 md:pb-4"
          >
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
              {/* Mobile Info */}
              <div className="lg:hidden">
                <div className="text-[10px] items-center text-stone-400 font-bold uppercase tracking-widest mb-0.5">Total</div>
                <div className="text-lg font-serif text-stone-900">Rs. {(parseInt(product.price) * quantity).toLocaleString()}</div>
              </div>

              {/* Desktop Info */}
              <div className="hidden lg:flex items-center gap-4">
                <img src={images[0]} alt="" className="w-12 h-12 object-cover rounded-md bg-stone-100" />
                <div>
                  <div className="font-bold text-stone-900">{product.name}</div>
                  <div className="text-xs text-stone-500">Rs. {displayPrice}</div>
                </div>
              </div>

              <div className="flex items-center gap-3 flex-1 lg:flex-none justify-end">
                {/* Quantity - More compact on mobile */}
                <div className="flex items-center border border-stone-200 rounded-full h-11 md:h-12 px-2 md:px-3 bg-stone-50">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2 hover:text-rose-600 active:scale-90 transition"><Minus className="w-3.5 h-3.5" /></button>
                  <span className="w-6 md:w-8 text-center font-bold text-sm">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="p-2 hover:text-rose-600 active:scale-90 transition"><Plus className="w-3.5 h-3.5" /></button>
                </div>

                <Button onClick={handleAddToCart} className="flex-1 md:w-48 h-11 md:h-12 rounded-full bg-stone-900 text-white font-bold uppercase tracking-widest hover:bg-stone-800 shadow-lg shadow-stone-900/20">
                  Add to Bag
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

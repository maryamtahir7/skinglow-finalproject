import React, { useEffect, useState, useMemo } from "react";
import { getProducts, getCategories, addToCart, addToWishlist } from "../backend/database.js";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useUser } from "../context/UserContext.jsx";
import { useToast } from "../context/ToastContext";
import {
  Search,
  Sparkles,
  ArrowRight,
  Heart,
  ShoppingBag,
  Star,
  Check,
  Filter
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

export default function ShopV3() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  // Filters
  // Filters - Single Source of Truth (URL)
  const activeCategory = searchParams.get("category") || "all";
  const activeConcern = searchParams.get("concern") || "all";
  const searchQuery = searchParams.get("search") || "";

  // Helper to update params safely
  const updateParams = (updates) => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value === 'all' || value === '') {
        newParams.delete(key);
      } else {
        newParams.set(key, value);
      }
    });
    setSearchParams(newParams, { replace: true });
  };

  const { user } = useUser();
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    async function load() {
      try {
        const [p, c] = await Promise.all([getProducts(), getCategories()]);
        setProducts(p.documents || []);
        // Enrich category data with placeholder visuals if missing
        const enrichedCats = (c.documents || []).map(cat => ({
          ...cat,
          // Fallback image logic
          visual: cat.imageUrl || "https://images.unsplash.com/photo-1618331835717-801e976710b2?auto=format&fit=crop&w=400"
        }));
        setCategories(enrichedCats);
      } catch (e) {
        console.error(e);
        showToast("Unable to load collection", "error");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleAdd = async (e, p) => {
    e.stopPropagation();
    if (!user) { navigate('/login'); return; }
    try {
      await addToCart({ userId: user.$id, productId: p.$id, quantity: 1 });
      showToast(`Added ${p.name} to your bag`, "cart");
      window.dispatchEvent(new Event('cart-updated'));
    } catch { showToast("Failed to add", "error"); }
  };

  const handleWishlist = async (e, p) => {
    e.stopPropagation();
    if (!user) { navigate('/login'); return; }
    try {
      await addToWishlist({ userId: user.$id, productId: p.$id });
      showToast("Saved to wishlist", "success");
    } catch { showToast("Failed to save", "error"); }
  };

  const filtered = useMemo(() => {
    return products.filter(p => {
      const matchSearch = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase());

      const pCat = typeof p.category === 'string' ? p.category : p.category?.name || '';
      const matchCat = activeCategory === 'all' ||
        pCat.toLowerCase().includes(activeCategory.toLowerCase().replace(/s$/, ''));

      const matchConcern = activeConcern === 'all' ||
        (p.Concerns && String(p.Concerns).toLowerCase().includes(activeConcern.toLowerCase())) ||
        (p.description && p.description.toLowerCase().includes(activeConcern.toLowerCase())) ||
        (p.name && p.name.toLowerCase().includes(activeConcern.toLowerCase())) ||
        (p.tags && (
          Array.isArray(p.tags)
            ? p.tags.some(tag => tag.toLowerCase().includes(activeConcern.toLowerCase()))
            : String(p.tags).toLowerCase().includes(activeConcern.toLowerCase())
        ));

      return matchSearch && matchCat && matchConcern;
    });
  }, [products, searchQuery, activeCategory, activeConcern]);

  if (loading) return null;

  return (
    <div className="min-h-screen bg-[#FFFCF8] text-stone-900 font-sans selection:bg-rose-200">

      {/* 1. HERO SECTION (Mobile-First Premium) */}
      <section className="relative w-full overflow-hidden">
        <div className="grid lg:grid-cols-2 min-h-[85vh] lg:h-[90vh]">

          {/* Mobile Background / Right Visual on Desktop */}
          <div className="absolute inset-0 lg:relative lg:order-2 h-full bg-stone-200 overflow-hidden">
            <motion.img
              initial={{ scale: 1.1, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.5 }}
              src="https://i.pinimg.com/1200x/b3/7d/06/b37d064ae1b1e6a907cfe9c2580edab2.jpg" // High quality aesthetic image
              className="absolute inset-0 w-full h-full object-cover object-center"
              alt="Hero Skincare"
            />
            {/* Mobile Gradient Overlay - Stronger at bottom for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#FFFCF8] via-[#FFFCF8]/60 to-transparent lg:bg-gradient-to-l lg:from-transparent lg:to-[#FFFCF8]/50 lg:via-transparent opacity-90 lg:opacity-100" />
          </div>

          {/* Left: Text Content */}
          <div className="relative z-10 flex flex-col justify-end lg:justify-center px-6 lg:px-24 pb-24 lg:py-20 h-full lg:order-1">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="inline-flex items-center gap-3 mb-6">
                <div className="w-12 h-[1px] bg-rose-500" />
                <span className="text-xs font-bold tracking-[0.25em] uppercase text-rose-700">New Collection</span>
              </div>

              <h1 className="text-6xl md:text-7xl lg:text-8xl font-serif text-stone-900 leading-[0.95] mb-6 tracking-tight">
                Radiant <br />
                <span className="italic font-light text-rose-500">Beauty</span>
              </h1>

              <p className="text-lg md:text-xl text-stone-600/90 max-w-md leading-relaxed mb-10 font-medium">
                Scientific formulations seeking to unveil your natural glow. Pure, potent, and proven.
              </p>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <Button
                  onClick={() => document.getElementById('shop-collection').scrollIntoView({ behavior: 'smooth' })}
                  className="rounded-full h-14 w-full sm:w-auto px-10 bg-stone-900 text-white hover:bg-stone-800 text-sm font-bold tracking-[0.15em] uppercase transition-all shadow-xl shadow-stone-900/10 hover:shadow-2xl hover:-translate-y-1"
                >
                  Explore Shop
                </Button>

                {/* Social Proof */}
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-3">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="w-10 h-10 rounded-full border-2 border-[#FFFCF8] bg-stone-200 overflow-hidden shadow-sm">
                        <img src={`https://i.pravatar.cc/100?img=${i + 20}`} alt="User" />
                      </div>
                    ))}
                  </div>
                  <div className="text-xs font-semibold text-stone-500">
                    <span className="text-stone-900 font-bold block text-sm">4.9/5</span>
                    from 2k+ reviews
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. VISUAL CATEGORIES (Mobile Horizontal Snap) */}
      <section className="py-12 lg:py-20 border-b border-stone-100 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="px-6 mb-8 flex justify-between items-end">
            <div>
              <span className="text-xs font-bold tracking-widest text-stone-400 uppercase mb-2 block">Curated For You</span>
              <h2 className="text-3xl font-serif text-stone-900">Categories</h2>
            </div>
            <a href="#" className="hidden lg:block text-xs font-bold uppercase tracking-widest border-b border-stone-900 pb-1">View All</a>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-8 px-6 scrollbar-hide snap-x snap-mandatory">
            <motion.button
              onClick={() => updateParams({ category: 'all' })}
              whileTap={{ scale: 0.95 }}
              className={`flex-shrink-0 flex flex-col items-center gap-3 snap-start ${activeCategory === 'all' ? 'opacity-100' : 'opacity-60'}`}
            >
              <div className={`w-20 h-20 md:w-28 md:h-28 rounded-full border border-stone-100 relative overflow-hidden transition-all duration-300 ${activeCategory === 'all' ? 'ring-2 ring-rose-900 ring-offset-2' : 'bg-stone-50'}`}>
                <div className="absolute inset-0 bg-stone-900 flex items-center justify-center text-white">
                  <Sparkles className="w-6 h-6 md:w-8 md:h-8" />
                </div>
              </div>
              <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest">All</span>
            </motion.button>

            {categories.map(c => (
              <motion.button
                key={c.$id}
                onClick={() => updateParams({ category: c.name || c })}
                whileTap={{ scale: 0.95 }}
                className={`flex-shrink-0 flex flex-col items-center gap-3 snap-start ${activeCategory === (c.name || c) ? 'opacity-100' : 'opacity-60'}`}
              >
                <div className={`w-20 h-20 md:w-28 md:h-28 rounded-full relative overflow-hidden transition-all duration-300 ${activeCategory === (c.name || c) ? 'ring-2 ring-rose-900 ring-offset-2' : ''}`}>
                  <img
                    src={c.visual || c.imageUrl}
                    alt={c.name}
                    className="w-full h-full object-cover"
                    onError={e => e.target.src = "https://images.unsplash.com/photo-1629198688000-71f23e745b6e?w=400&auto=format&fit=crop"}
                  />
                  {/* Active Indicator Overlay */}
                  {activeCategory === (c.name || c) && <div className="absolute inset-0 bg-rose-900/10 mix-blend-multiply" />}
                </div>
                <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest truncate max-w-[80px]">{c.name || c}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* 3. COLLECTION GRID (Warm + Visual) */}
      <section id="shop-collection" className="max-w-[1600px] mx-auto px-6 py-20">

        {/* Filter/Search Bar */}
        {/* Filter/Search Bar (Mobile: Compact Sticky) */}
        <div className="sticky top-4 z-40 mb-8 md:mb-12 flex justify-center px-4">
          <div className="bg-white/90 backdrop-blur-xl border border-stone-200/60 shadow-lg shadow-stone-200/20 rounded-full pl-6 pr-2 py-2 flex items-center gap-4 w-full max-w-2xl">
            <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-rose-900 whitespace-nowrap hidden sm:block">
              {activeConcern !== 'all' ? `Concern: ${activeConcern}` : activeCategory === 'all' ? 'All Items' : activeCategory}
            </span>
            <div className="w-[1px] h-4 bg-stone-300 hidden sm:block" />

            <div className="flex-1 flex items-center gap-2 text-stone-400 group">
              <Search className="w-4 h-4 group-focus-within:text-stone-800" />
              <input
                value={searchQuery}
                onChange={e => updateParams({ search: e.target.value })}
                placeholder="Search collection..."
                className="bg-transparent text-sm font-medium outline-none w-full placeholder:text-stone-400 text-stone-800"
              />
            </div>

            {/* Mobile Filter Trigger (Visual Only for now) */}
            <button className="p-2 bg-stone-100 rounded-full text-stone-600 hover:bg-stone-900 hover:text-white transition-colors">
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="h-64 flex items-center justify-center text-stone-300">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-32">
            <p className="text-2xl font-serif italic text-stone-400 mb-4">No treasures found.</p>
            <Button onClick={() => { setActiveCategory('all'); setSearchQuery(''); }} variant="link">Reset Filters</Button>
          </div>
        ) : (
          /* Mobile: 2 Columns, Desktop: 4 Columns */
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-8 gap-y-10 md:gap-y-16">
            <AnimatePresence>
              {filtered.map((p) => (
                <ProductCardV3
                  key={p.$id}
                  product={p}
                  onAdd={handleAdd}
                  onWish={handleWishlist}
                  onClick={() => navigate(`/products/${p.$id}`)}
                />
              ))}
            </AnimatePresence>
          </div>
        )}

      </section>

    </div>
  );
}

// --- PRODUCT CARD V3 (Mobile Optimized + Premium) ---
function ProductCardV3({ product, onAdd, onWish, onClick }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="group cursor-pointer"
      onClick={onClick}
    >
      {/* Image Box */}
      <div className="relative aspect-[3/4] bg-[#F4F1EE] rounded-t-[20px] rounded-b-lg md:rounded-t-[100px] md:rounded-b-[20px] overflow-hidden mb-3 md:mb-6 isolation-isolate">

        {/* Mobile Gradient Overlay (Always visible slightly for text contrast if needed, but here clean) */}
        <div className="absolute inset-x-0 bottom-0 top-1/2 bg-gradient-to-t from-stone-900/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />

        {/* Product Image */}
        <motion.img
          src={product.imageUrl}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover mix-blend-multiply opacity-90 md:group-hover:scale-105 transition-transform duration-1000 ease-out"
        />

        {/* Tags */}
        {product.price > 800 && (
          <div className="absolute top-3 left-3 z-20">
            <span className="bg-white/90 backdrop-blur border border-stone-100 px-2 py-0.5 rounded text-[8px] md:text-[10px] font-bold uppercase tracking-widest text-stone-800 shadow-sm">
              Best
            </span>
          </div>
        )}

        {/* Mobile Add Button (Always Visible Floating) */}
        <button
          onClick={(e) => onAdd(e, product)}
          className="md:hidden absolute bottom-2 right-2 p-2 bg-white/90 backdrop-blur-sm text-stone-900 rounded-full shadow-sm border border-white/50 z-30 active:scale-90 transition-transform"
        >
          <ShoppingBag className="w-4 h-4" />
        </button>

        {/* Desktop Action Bar (Slide Up) */}
        <div className="hidden md:flex absolute bottom-4 inset-x-4 items-center justify-between z-20 translate-y-10 group-hover:translate-y-0 transition-transform duration-300 bg-white/95 backdrop-blur-md rounded-full shadow-lg p-1.5 px-4 border border-white/40">
          <span className="text-xs font-bold text-stone-900">Quick Add</span>
          <div className="flex gap-1">
            <button onClick={(e) => onWish(e, product)} className="p-2 hover:bg-rose-50 hover:text-rose-600 rounded-full transition-colors text-stone-400">
              <Heart className="w-4 h-4" />
            </button>
            <button onClick={(e) => onAdd(e, product)} className="p-2 bg-stone-900 text-white rounded-full hover:bg-rose-600 transition-colors">
              <ShoppingBag className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="text-left md:text-center px-1 md:px-4">
        <div className="hidden md:flex items-center justify-center gap-2 mb-2">
          <div className="flex text-amber-400/80">
            {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-3 h-3 fill-current" />)}
          </div>
          <span className="text-[10px] text-stone-400 font-bold">(24)</span>
        </div>
        <h3 className="font-serif text-sm md:text-xl text-stone-900 mb-1 leading-tight group-hover:text-rose-700 transition-colors line-clamp-2 md:line-clamp-1">
          {product.name}
        </h3>
        <p className="text-xs md:text-sm font-medium text-stone-500">
          Rs. {parseInt(product.price).toLocaleString()}
        </p>
      </div>

    </motion.div>
  );
}
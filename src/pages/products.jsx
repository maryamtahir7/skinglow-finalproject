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
  const [activeCategory, setActiveCategory] = useState(searchParams.get("category") || "all");
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");

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

  useEffect(() => {
    const p = {};
    if (activeCategory !== 'all') p.category = activeCategory;
    if (searchQuery) p.search = searchQuery;
    setSearchParams(p, { replace: true });
  }, [activeCategory, searchQuery, setSearchParams]);

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
      return matchSearch && matchCat;
    });
  }, [products, searchQuery, activeCategory]);

  if (loading) return null;

  return (
    <div className="min-h-screen bg-[#FFFCF8] text-stone-900 font-sans selection:bg-rose-200">

      {/* 1. HERO SECTION (Split Visual) */}
      <section className="relative w-full overflow-hidden">
        <div className="grid lg:grid-cols-2 min-h-[60vh] lg:h-[80vh]">
          {/* Left: Text */}
          <div className="relative z-10 flex flex-col justify-center px-6 lg:px-20 py-20 bg-[#FFFCF8]">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
              <div className="inline-flex items-center gap-2 mb-6">
                <div className="w-8 h-[1px] bg-rose-400" />
                <span className="text-xs font-bold tracking-[0.2em] uppercase text-rose-800">New Arrivals</span>
              </div>
              <h1 className="text-5xl lg:text-7xl font-serif text-stone-900 leading-[1.1] mb-8">
                Unveil Your <br /> <i className="font-serif italic text-rose-400">Inner Glow</i>
              </h1>
              <p className="text-lg text-stone-600 max-w-md leading-relaxed mb-10">
                Discover our award-winning formulas, crafted with potent botanicals and clinical actives for radiant, healthy skin.
              </p>

              <div className="flex items-center gap-4">
                <Button onClick={() => document.getElementById('shop-collection').scrollIntoView({ behavior: 'smooth' })} className="rounded-full h-14 px-8 bg-stone-900 text-white hover:bg-stone-800 text-sm font-bold tracking-widest uppercase transition-all shadow-xl shadow-stone-200 hover:shadow-2xl hover:-translate-y-1">
                  Shop Collection
                </Button>
                <div className="flex items-center -space-x-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                      <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" />
                    </div>
                  ))}
                  <div className="w-10 h-10 rounded-full border-2 border-white bg-rose-50 flex items-center justify-center text-[10px] font-bold text-rose-900">
                    1k+
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right: Visual */}
          <div className="relative h-[50vh] lg:h-full bg-stone-200 overflow-hidden">
            <motion.img
              initial={{ scale: 1.1, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.5 }}
              src="https://i.pinimg.com/736x/23/04/dc/2304dcfec4899c82f49210abcb65cf55.jpg"
              className="absolute inset-0 w-full h-full object-cover"
              alt="Hero Skincare"
            />
            <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#FFFCF8]/50 lg:to-transparent" />
          </div>
        </div>
      </section>

      {/* 2. VISUAL CATEGORIES (Horizontal Scroll) */}
      <section className="py-20 border-b border-stone-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-end mb-10">
            <h2 className="text-2xl font-serif italic text-stone-800">Shop by Category</h2>
            <div className="flex gap-2">
              {/* Navigation arrows could go here */}
            </div>
          </div>

          <div className="flex gap-8 overflow-x-auto pb-8 scrollbar-hide snap-x">
            <motion.button
              onClick={() => setActiveCategory('all')}
              whileHover={{ y: -5 }}
              className={`flex-shrink-0 flex flex-col items-center gap-4 snap-start group ${activeCategory === 'all' ? 'opacity-100' : 'opacity-60 hover:opacity-100'}`}
            >
              <div className={`w-24 h-32 rounded-full border border-stone-200 overflow-hidden relative ${activeCategory === 'all' ? 'ring-2 ring-stone-900 ring-offset-4 ring-offset-[#FFFCF8]' : ''}`}>
                <div className="absolute inset-0 bg-stone-900 flex items-center justify-center text-white">
                  <Sparkles className="w-8 h-8" />
                </div>
              </div>
              <span className="text-xs font-bold uppercase tracking-widest group-hover:text-rose-600 transition-colors">View All</span>
            </motion.button>

            {categories.map(c => (
              <motion.button
                key={c.$id}
                onClick={() => setActiveCategory(c.name || c)}
                whileHover={{ y: -5 }}
                className={`flex-shrink-0 flex flex-col items-center gap-4 snap-start group ${activeCategory === (c.name || c) ? 'opacity-100' : 'opacity-60 hover:opacity-100'}`}
              >
                <div className={`w-24 h-32 rounded-t-[50px] rounded-b-[50px] overflow-hidden border border-stone-100 shadow-sm relative ${activeCategory === (c.name || c) ? 'ring-2 ring-stone-900 ring-offset-4 ring-offset-[#FFFCF8]' : ''}`}>
                  <img
                    src={c.visual || c.imageUrl}
                    alt={c.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    onError={e => e.target.src = "https://images.unsplash.com/photo-1629198688000-71f23e745b6e?w=400&auto=format&fit=crop"}
                  />
                </div>
                <span className="text-xs font-bold uppercase tracking-widest group-hover:text-rose-600 transition-colors">{c.name || c}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* 3. COLLECTION GRID (Warm + Visual) */}
      <section id="shop-collection" className="max-w-[1600px] mx-auto px-6 py-20">

        {/* Filter/Search Bar */}
        <div className="sticky top-4 z-40 mb-12 flex justify-center">
          <div className="bg-white/80 backdrop-blur-xl border border-stone-200/60 shadow-lg rounded-full px-6 py-3 flex items-center gap-6">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-900">
              {activeCategory === 'all' ? 'All Products' : activeCategory}
            </span>
            <div className="w-[1px] h-4 bg-stone-300" />
            <div className="flex items-center gap-2 text-stone-400 group">
              <Search className="w-4 h-4 group-focus-within:text-stone-800" />
              <input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Filter collection..."
                className="bg-transparent text-sm font-medium outline-none w-32 focus:w-48 transition-all placeholder:text-stone-400 text-stone-800"
              />
            </div>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 gap-y-16">
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

// --- PRODUCT CARD V3 (Warm, Card-Style, Premium) ---
function ProductCardV3({ product, onAdd, onWish, onClick }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="group cursor-pointer"
      onClick={onClick}
    >
      {/* Image Box */}
      <div className="relative aspect-[4/5] bg-[#F4F1EE] rounded-t-[100px] rounded-b-[20px] overflow-hidden mb-6 isolation-isolate">
        <div className="absolute inset-x-0 bottom-0 top-1/2 bg-gradient-to-t from-stone-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />

        {/* Product Image */}
        <motion.img
          src={product.imageUrl}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover mix-blend-multiply opacity-90 group-hover:scale-105 transition-transform duration-1000 ease-out"
        />

        {/* Overlays */}
        {product.price > 800 && (
          <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20">
            <span className="bg-white/90 backdrop-blur border border-stone-100 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-stone-800 shadow-sm">
              Best Seller
            </span>
          </div>
        )}

        {/* Action Bar (Slide Up) */}
        <div className="absolute bottom-4 inset-x-4 flex items-center justify-between z-20 translate-y-10 group-hover:translate-y-0 transition-transform duration-300 bg-white/95 backdrop-blur-md rounded-full shadow-lg p-1.5 px-4 border border-white/40">
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
      <div className="text-center px-4">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="flex text-amber-400/80">
            {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-3 h-3 fill-current" />)}
          </div>
          <span className="text-[10px] text-stone-400 font-bold">(24)</span>
        </div>
        <h3 className="font-serif text-xl text-stone-900 mb-1 group-hover:text-rose-700 transition-colors">{product.name}</h3>
        <p className="text-sm font-medium text-stone-500">Rs. {parseInt(product.price).toLocaleString()}</p>
      </div>

    </motion.div>
  );
}
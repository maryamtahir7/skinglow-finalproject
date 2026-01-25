// src/pages/Homepage.jsx
import React, { useEffect, useState } from "react";
import { getProducts, getCategories } from "../backend/database";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { getCurrentUser } from "../backend/auth";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  ShieldCheck,
  Truck,
  ArrowRight,
  Heart,
  Leaf,
  Droplets,
  Sun,
  Star,
  CheckCircle,
  Play,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

function Homepage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { setUser } = useUser();

  const [currentSlide, setCurrentSlide] = useState(0);

  // Check for user after OAuth redirect
  useEffect(() => {
    async function checkOAuthUser() {
      try {
        const user = await getCurrentUser();
        if (user) {
          setUser(user);
        }
      } catch (err) {
        // User not logged in, that's okay
      }
    }
    checkOAuthUser();
  }, [setUser]);

  useEffect(() => {
    async function fetchData() {
      try {
        const [prodData, catData] = await Promise.all([getProducts(), getCategories()]);

        const productsList = prodData.documents || [];
        console.log(`✅ Homepage: Fetched ${productsList.length} products`);

        // Filter or just take first few for now
        setProducts(productsList.slice(0, 4));
        setCategories(catData.documents || []);

      } catch (error) {
        console.error("❌ Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const heroSlides = [
    {
      image: 'https://i.pinimg.com/736x/93/71/8c/93718c4fee2260ae11240d9030afec2c.jpg',
      title: <>Natural & <span className="font-light italic text-rose-200/90 font-serif">Organic</span></>,
      subtitle: 'Premium Skincare Collection',
      text: 'Transform your skin with nature\'s finest ingredients'
    },
    {
      image: 'https://theindustry.beauty/wp-content/uploads/2023/01/Pacifica.jpg',
      title: <>Glowing <span className="font-light italic text-rose-200/90 font-serif">Skin</span></>,
      subtitle: 'Your Journey Starts Here',
      text: 'Discover products that make a real difference'
    },
    {
      image: 'https://i.pinimg.com/1200x/83/af/ca/83afcaddd4e79b05cb4348340fead68c.jpg',
      title: <>Clean <span className="font-light italic text-rose-200/90 font-serif">Beauty</span></>,
      subtitle: 'Ethically Sourced',
      text: 'Pure ingredients for radiant, healthy skin'
    },
    {
      image: 'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=1920&q=80',
      title: <>Radiant <span className="font-light italic text-rose-200/90 font-serif">You</span></>,
      subtitle: 'Best Skincare Experience',
      text: 'Experience the luxury of premium organic skincare'
    },
  ];

  // Auto-rotate hero slides
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const values = [
    { icon: Leaf, title: "100% Vegan", desc: "Plant-based formulas without animal derivatives." },
    { icon: ShieldCheck, title: "Cruelty Free", desc: "Never tested on animals, ethically sourced." },
    { icon: Droplets, title: "Clean Ingredients", desc: "Free from parabens, sulfates, and toxins." },
    { icon: Star, title: "Dermatologist Tested", desc: "Safe and effective for sensitive skin." },
  ];

  const concerns = [
    { title: "Acne & Blemishes", query: "acne", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSSSqJuDxFdlsoip3QugPdMUa8bTq17-S81SA&s", color: "bg-rose-900" },
    { title: "Dryness & Hydration", query: "dryness", image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=800&q=80", color: "bg-blue-900" },
    { title: "Anti-Aging", query: "aging", image: "https://4.imimg.com/data4/NS/RU/MY-87113/face-pack-500x500.jpg", color: "bg-amber-900" },
    { title: "Dullness & Brightening", query: "dullness", image: "https://sg.ahcbeauty.com/cdn/shop/articles/optimized_Home_Aesthetic_-201209_ahc_05_0734.jpg?v=1620735508", color: "bg-orange-900" },
  ];

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center space-y-6">
          <Sparkles className="w-16 h-16 text-primary animate-pulse mx-auto" />
          <h2 className="text-2xl font-bold text-primary">SkinGlow</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background font-sans text-foreground">

      {/* HERO SLIDESHOW - ULTIMATE PREMIUIM */}
      <section className="relative h-screen w-full overflow-hidden bg-black font-sans">
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-[2000ms] ease-in-out ${index === currentSlide
              ? "opacity-100 z-10"
              : "opacity-0 z-0"
              }`}
          >
            {/* Ken Burns Effect Image */}
            <img
              src={slide.image}
              alt="Hero"
              className={`w-full h-full object-cover ${index === currentSlide ? 'animate-ken-burns' : ''}`}
            />

            {/* Cinematic Noise Overlay */}
            <div className="absolute inset-0 z-[1] animate-noise pointer-events-none" />

            {/* Vignette & Gradients */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/60 z-[2]" />
            <div className="absolute inset-0 bg-black/20 mix-blend-overlay z-[2]" />
          </div>
        ))}

        {/* Slide content + controls */}
        <div className="relative z-20 h-full w-full flex flex-col items-center justify-center text-center px-6 md:px-12 pt-16">

          <div className="max-w-6xl mx-auto space-y-10">
            {/* Subtitle tag */}
            <div className="overflow-hidden">
              <div key={`sub-${currentSlide}`} className="animate-fade-up-blur">
                <span className="inline-block px-6 py-2 border border-white/20 rounded-full bg-white/5 backdrop-blur-md text-white/90 text-[10px] md:text-sm font-bold uppercase tracking-[0.3em] shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                  {heroSlides[currentSlide].subtitle}
                </span>
              </div>
            </div>

            {/* Main Title - Playfair Display - Massive & Elegant w/ Mixed Typography */}
            <div key={`title-${currentSlide}`} className="overflow-hidden py-4">
              <h1 className="text-6xl md:text-8xl lg:text-[7.5rem] font-medium text-white leading-[0.95] font-['Playfair_Display'] animate-fade-up-blur delay-200 drop-shadow-2xl tracking-tighter">
                {heroSlides[currentSlide].title}
              </h1>
            </div>

            {/* Body Text */}
            <div key={`text-${currentSlide}`} className="overflow-hidden">
              <p className="text-lg md:text-2xl text-white/70 font-light leading-relaxed max-w-2xl mx-auto animate-fade-up-blur delay-300 font-sans tracking-wide">
                {heroSlides[currentSlide].text}
              </p>
            </div>

            {/* Buttons - Magnetic Feel */}
            <div key={`btns-${currentSlide}`} className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8 animate-fade-up-blur delay-500">
              <Button
                onClick={() => navigate("/products")}
                className="relative group overflow-hidden min-w-[200px] h-14 rounded-full bg-white text-black hover:text-white transition-colors duration-500 border border-white"
              >
                <span className="relative z-10 text-sm uppercase tracking-[0.2em] font-bold group-hover:tracking-[0.3em] transition-all duration-500">Shop Now</span>
                <div className="absolute inset-0 bg-black translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
              </Button>

              <Button
                onClick={() => navigate("/skin-quiz")}
                className="relative group overflow-hidden min-w-[200px] h-14 rounded-full bg-transparent text-white border border-white/40 hover:border-white transition-colors duration-500"
              >
                <span className="relative z-10 text-sm uppercase tracking-[0.2em] font-bold group-hover:tracking-[0.3em] transition-all duration-500">Discover</span>
                <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
              </Button>
            </div>
          </div>

          {/* Bottom Indicators */}
          <div className="absolute bottom-12 left-0 right-0 flex justify-center gap-4 z-30">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-[2px] transition-all duration-1000 ease-in-out ${index === currentSlide
                  ? "w-24 bg-rose-200/80 shadow-[0_0_15px_rgba(253,224,71,0.6)]"
                  : "w-12 bg-white/20 hover:bg-white/50"
                  }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={() => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)}
            className="absolute left-8 top-1/2 -translate-y-1/2 group hidden md:block p-6 z-30 opacity-60 hover:opacity-100 transition-opacity"
          >
            <div className="w-16 h-16 border border-white/10 rounded-full flex items-center justify-center text-white/50 group-hover:border-white/40 group-hover:text-white group-hover:scale-110 transition-all duration-500 backdrop-blur-[2px]">
              <ChevronLeft className="w-6 h-6" />
            </div>
          </button>

          <button
            onClick={() => setCurrentSlide((prev) => (prev + 1) % heroSlides.length)}
            className="absolute right-8 top-1/2 -translate-y-1/2 group hidden md:block p-6 z-30 opacity-60 hover:opacity-100 transition-opacity"
          >
            <div className="w-16 h-16 border border-white/10 rounded-full flex items-center justify-center text-white/50 group-hover:border-white/40 group-hover:text-white group-hover:scale-110 transition-all duration-500 backdrop-blur-[2px]">
              <ChevronRight className="w-6 h-6" />
            </div>
          </button>
        </div>
      </section>

      {/* SHOP BY CATEGORY */}
      {categories.length > 0 && (
        <section className="py-18 md:py-20 bg-gradient-to-b from-background via-primary/5 to-background">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center justify-between mb-10">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-3 uppercase tracking-wide">
                  Curated Routines
                </div>
                <h2 className="text-2xl md:text-3xl font-bold mb-1">
                  Shop by Category
                </h2>
                <p className="text-muted-foreground text-sm md:text-base max-w-xl">
                  Build your ritual step-by-step with cleansers, serums, moisturizers and more.
                </p>
              </div>
            </div>

            {/* Auto-scrolling marquee of categories */}
            <div className="category-marquee pt-2">
              <div className="category-marquee-track">
                {[...categories.slice(0, 10), ...categories.slice(0, 10)].map(
                  (cat, index) => (
                    <button
                      key={`${cat.$id}-${index}`}
                      onClick={() =>
                        navigate(
                          `/products?category=${encodeURIComponent(cat.name)}`
                        )
                      }
                      className="group rounded-2xl overflow-hidden bg-gradient-to-b from-white/90 to-primary/5 border border-white/70 hover:border-primary/60 hover:shadow-2xl hover:-translate-y-1 transition-all flex flex-col items-center text-center px-3 py-3 md:px-4 md:py-4 float-soft"
                      style={{ minWidth: "155px", maxWidth: "180px" }}
                    >
                      <div className="w-full aspect-[4/5] rounded-xl overflow-hidden bg-secondary/20 mb-2 shadow-inner">
                        {cat.imageUrl ? (
                          <img
                            src={cat.imageUrl}
                            alt={cat.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            onError={(e) => {
                              e.target.style.display = "none";
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-primary/40">
                            {cat.name?.charAt(0)}
                          </div>
                        )}
                      </div>
                      <span className="text-sm font-semibold text-foreground group-hover:text-primary">
                        {cat.name}
                      </span>
                    </button>
                  )
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* VALUES SECTION */}
      <section className="py-18 md:py-20 bg-gradient-to-r from-secondary/40 via-card to-secondary/40 border-y border-border/60">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/60 text-foreground/80 text-[11px] font-semibold uppercase tracking-wide mb-3">
                Why SkinGlow
              </div>
              <h2 className="text-2xl md:text-3xl font-bold">Clean, Conscious, Clinical</h2>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {values.map((val, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center text-center space-y-3 group cursor-default float-soft"
              >
                <div className="w-16 h-16 rounded-2xl bg-white shadow-[0_12px_35px_rgba(15,23,42,0.12)] flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-300">
                  <val.icon className="w-7 h-7" />
                </div>
                <h3 className="font-bold text-sm md:text-base">{val.title}</h3>
                <p className="text-xs md:text-sm text-muted-foreground max-w-xs">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SHOP BY CONCERN */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Shop by Concern</h2>
          <p className="text-muted-foreground text-lg">
            Targeted solutions for your unique skin needs. Tap a card to explore a full edit for
            that concern.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {concerns.map((item, idx) => (
            <div
              key={idx}
              onClick={() => navigate(`/products?concern=${item.query}`)}
              className={`relative group cursor-pointer overflow-hidden rounded-3xl aspect-[3/4] ${item.color} flex items-center justify-center shadow-[0_22px_55px_rgba(15,23,42,0.45)]`}
            >
              <img
                src={item.image}
                alt={item.title}
                onError={(e) => e.target.style.display = 'none'}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              {/* Fallback pattern/icon visible when image fails or loads */}
              <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay" />

              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent pointer-events-none" />
              <div className="absolute inset-x-0 bottom-6 px-6 text-white z-10">
                <h3 className="text-xl font-bold mb-1">{item.title}</h3>
                <div className="h-1 w-12 bg-white rounded-full group-hover:w-20 transition-all duration-300" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="py-24 bg-gradient-to-b from-secondary/40 via-background to-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2">Trending Essentials</h2>
              <p className="text-muted-foreground text-lg">
                The glow-giving heroes everyone is adding to bag right now.
              </p>
            </div>
            <Button
              onClick={() => navigate("/products")}
              variant="link"
              className="text-primary font-bold text-lg hidden md:block hover:text-primary/80"
            >
              View All Products &rarr;
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.length > 0 ? products.map((product) => (
              <div
                key={product.$id}
                onClick={() => navigate(`/products/${product.$id}`)}
                className="bg-card rounded-2xl p-4 shadow-[0_18px_45px_rgba(15,23,42,0.14)] border border-border/70 hover:border-primary/40 hover:shadow-[0_25px_60px_rgba(15,23,42,0.22)] transition-all cursor-pointer group float-soft"
              >
                <div className="aspect-square rounded-xl bg-secondary/20 mb-4 overflow-hidden relative">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <button className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full text-muted-foreground hover:text-primary transition shadow-sm opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 duration-300">
                    <Heart className="w-4 h-4" />
                  </button>
                  {product.salePrice && (
                    <span className="absolute top-3 left-3 bg-red-400 text-white text-[10px] font-bold px-2 py-1 rounded-full">
                      SALE
                    </span>
                  )}
                </div>
                <div>
                  <div className="text-xs font-bold text-primary mb-1 uppercase tracking-wider">
                    {product.category || "Skincare"}
                  </div>
                  <h3 className="font-bold text-lg text-foreground mb-2 line-clamp-1">{product.name}</h3>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-lg font-bold text-foreground">Rs. {product.price}</span>
                      {product.originalPrice && <span className="text-xs text-muted-foreground line-through">Rs. {product.originalPrice}</span>}
                    </div>
                    <button className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary/90 transition shadow-primary/30 shadow-md transform active:scale-95">
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )) : (
              // Empty State / Fallback
              [1, 2, 3, 4].map((n) => (
                <div key={n} className="bg-card rounded-2xl p-4 shadow-sm border border-border animate-pulse">
                  <div className="aspect-square rounded-xl bg-secondary/50 mb-4" />
                  <div className="h-4 bg-secondary/50 rounded w-2/3 mb-2" />
                  <div className="h-6 bg-secondary/50 rounded w-1/3" />
                </div>
              ))
            )}
          </div>

          <div className="mt-12 text-center md:hidden">
            <Button onClick={() => navigate("/products")} className="w-full bg-primary text-white py-6 rounded-xl">
              Shop All Products
            </Button>
          </div>
        </div>
      </section>

      {/* QUIZ CTA - PREMIUM REDESIGN */}
      <section className="py-32 relative overflow-hidden bg-[#0A0A0A]">
        {/* Cinematic Background */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-rose-900/20 rounded-full blur-[120px] opacity-70 animate-pulse" style={{ animationDuration: '8s' }} />
          <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-indigo-900/20 rounded-full blur-[120px] opacity-60 animate-pulse" style={{ animationDuration: '10s' }} />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03]" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6">
          <div className="relative overflow-hidden rounded-[3rem] bg-white/5 backdrop-blur-2xl border border-white/10 p-12 md:p-24 text-center group">

            {/* Inner Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

            <div className="relative z-10 space-y-8 max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-rose-300 text-xs font-bold tracking-[0.2em] uppercase shadow-xl mb-4">
                <Sparkles className="w-3 h-3" /> Personalized Care
              </div>

              <h2 className="text-5xl md:text-7xl font-serif text-white leading-[0.95] tracking-tight">
                Not sure where <br className="hidden md:block" />
                <span className="italic text-rose-200/50">to start?</span>
              </h2>

              <p className="text-xl md:text-2xl text-white/60 font-light leading-relaxed">
                Discover your skin's unique needs in just 2 minutes. Our AI-powered analysis builds a ritual tailored specifically to you.
              </p>

              <div className="pt-8">
                <Button
                  onClick={() => navigate("/skin-quiz")}
                  className="relative px-12 py-8 bg-white text-stone-900 text-sm md:text-base font-bold uppercase tracking-widest rounded-full hover:bg-rose-50 hover:text-rose-900 transition-all shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:shadow-[0_0_60px_rgba(255,100,100,0.4)] hover:-translate-y-1 active:scale-95 border-0"
                >
                  Start Analysis <ArrowRight className="ml-3 w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

export default Homepage;
// src/pages/Homepage.jsx
import React, { useEffect, useState } from "react";
import { getProducts, getCategories } from "../backend/database";
import { useNavigate } from "react-router-dom";
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

  const [currentSlide, setCurrentSlide] = useState(0);

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
      image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=1920&q=80',
      title: 'Natural & Organic',
      subtitle: 'Premium Skincare Collection',
      text: 'Transform your skin with nature\'s finest ingredients'
    },
    {
      image: 'https://theindustry.beauty/wp-content/uploads/2023/01/Pacifica.jpg',
      title: 'Glowing Skin',
      subtitle: 'Your Journey Starts Here',
      text: 'Discover products that make a real difference'
    },
    {
      image: 'https://www.pacificabeauty.com/cdn/shop/files/FUTUREYOUTHGROUPCLOUDS_FLARE_1800x.jpg?v=1692891857',
      title: 'Clean Beauty',
      subtitle: 'Ethically Sourced',
      text: 'Pure ingredients for radiant, healthy skin'
    },
    {
      image: 'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=1920&q=80',
      title: 'Radiant You',
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
    { title: "Acne & Blemishes", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSSSqJuDxFdlsoip3QugPdMUa8bTq17-S81SA&s", color: "bg-rose-900" },
    { title: "Dryness & Hydration", image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=800&q=80", color: "bg-blue-900" },
    { title: "Anti-Aging", image: "https://4.imimg.com/data4/NS/RU/MY-87113/face-pack-500x500.jpg", color: "bg-amber-900" },
    { title: "Dullness & Brightening", image: "https://sg.ahcbeauty.com/cdn/shop/articles/optimized_Home_Aesthetic_-201209_ahc_05_0734.jpg?v=1620735508", color: "bg-orange-900" },
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

      {/* HERO SLIDESHOW */}
      <section className="relative h-[85vh] w-full overflow-hidden bg-gradient-to-b from-rose-50 via-background to-background">
        {heroSlides.map((slide, index) => (
          <div
            key={slide.title}
            className={`absolute inset-0 transition-opacity duration-700 ease-out transform ${
              index === currentSlide
                ? "opacity-100 z-10 scale-100"
                : "opacity-0 z-0 scale-105"
            }`}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-rose-100/80 via-background/60 to-transparent mix-blend-soft-light" />
            <div className="pointer-events-none absolute -top-24 -right-24 w-72 h-72 bg-primary/15 rounded-full blur-3xl hero-orb" />
            <div className="pointer-events-none absolute bottom-[-5rem] left-[-3rem] w-64 h-64 bg-rose-300/25 rounded-full blur-3xl hero-orb hero-orb--reverse" />
          </div>
        ))}

        {/* Slide content + controls */}
        <div className="relative z-20 h-full max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Text card */}
          <div className="max-w-xl md:max-w-2xl">
            <div className="rounded-[30px] p-[1.5px] bg-gradient-to-br from-primary/80 via-rose-300/80 to-sky-300/80 shadow-[0_30px_80px_rgba(15,23,42,0.35)] float-soft">
              <div className="backdrop-blur-2xl bg-background/80 rounded-[28px] px-6 md:px-10 py-8 md:py-11 border border-white/40">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary font-semibold text-xs md:text-sm tracking-wide uppercase border border-primary/20 mb-4">
                <Sparkles className="w-4 h-4" /> {heroSlides[currentSlide].subtitle}
              </div>

              <h1 className="text-4xl md:text-6xl font-bold leading-tight text-foreground tracking-tight drop-shadow-[0_10px_40px_rgba(15,23,42,0.6)] mb-4">
                {heroSlides[currentSlide].title}
              </h1>

              <p className="text-base md:text-lg text-muted-foreground/90 leading-relaxed max-w-xl">
                {heroSlides[currentSlide].text}
              </p>

              <div className="flex flex-wrap gap-4 pt-6">
                <Button
                  onClick={() => navigate("/products")}
                  className="px-9 py-3.5 md:py-4 rounded-full text-sm md:text-base bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_18px_45px_rgba(244,114,182,0.55)] transition-all hover:scale-[1.04]"
                >
                  Shop Now
                </Button>
                <Button
                  onClick={() => navigate("/skin-quiz")}
                  variant="outline"
                  className="px-9 py-3.5 md:py-4 rounded-full text-sm md:text-base border-2 border-primary/80 text-primary hover:bg-primary/5 font-bold transition-all hover:scale-[1.02] shadow-[0_0_30px_rgba(244,114,182,0.25)]"
                >
                  Take Skin Quiz
                </Button>
              </div>

              {/* Dots */}
              <div className="flex items-center gap-2 pt-5">
                {heroSlides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`h-2 rounded-full transition-all ${
                      index === currentSlide
                        ? "w-7 bg-white shadow-md"
                        : "w-2 bg-white/40 hover:bg-white/80"
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
              {/* Trust badges */}
              <div className="mt-6 flex flex-wrap gap-4 text-xs md:text-sm text-muted-foreground/90">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span>4.9/5 rated by 1k+ glowing customers</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-primary" />
                  <span>Free delivery over Rs. 2,000</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>Dermatologist-tested formulas</span>
                </div>
              </div>
              </div>
            </div>
          </div>

          {/* Arrow controls (desktop) */}
          <div className="hidden md:flex flex-col gap-3 items-center pr-4">
            <button
              onClick={() =>
                setCurrentSlide(
                  (prev) => (prev - 1 + heroSlides.length) % heroSlides.length
                )
              }
              className="w-10 h-10 rounded-full bg-white/80 hover:bg-white text-foreground shadow-xl flex items-center justify-center border border-white/70 transition"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() =>
                setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
              }
              className="w-10 h-10 rounded-full bg-white/80 hover:bg-white text-foreground shadow-xl flex items-center justify-center border border-white/70 transition"
              aria-label="Next slide"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
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
              onClick={() => navigate(`/products?concern=${item.title}`)}
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

      {/* QUIZ CTA */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/90">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
        </div>
        <div className="relative z-10 max-w-4xl mx-auto text-center px-6 text-white space-y-8">
          <h2 className="text-4xl md:text-5xl font-bold">Not sure where to start?</h2>
          <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto">
            Take our 2-minute skin quiz to build your personalized routine and discover the products your skin will love.
          </p>
          <Button
            onClick={() => navigate("/skin-quiz")}
            className="px-10 py-8 bg-white text-primary text-lg font-bold rounded-full hover:bg-white/90 shadow-2xl transition-transform hover:scale-105"
          >
            Start Your Skin Analysis
          </Button>
        </div>
      </section>

    </div>
  );
}

export default Homepage;

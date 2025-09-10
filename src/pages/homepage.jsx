// src/pages/Homepage.jsx
import React, { useEffect, useState } from "react";
import { getProducts } from "../backend/database";
import Card from "../components/card";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  Star,
  ShieldCheck,
  Truck,
  ArrowRight,
  Award,
  Users,
  Building,
  Phone,
  Mail,
  MessageCircle,
  CheckCircle,
  Globe,
  TrendingUp,
  Zap,
  Heart,
  Eye,
  ChevronRight,
  Sparkles,
  Crown,
  Gem,
  BadgeCheck,
  Clock,
  Shield,
  Rocket,
  Infinity,
  Play,
  Pause,
  ChevronLeft,
  MousePointer,
  Layers,
  Target,
  Briefcase,
} from "lucide-react";

function Homepage() {
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const navigate = useNavigate();

  // Advanced product slideshow data
  const productSlides = [
    
 {
  image:
    "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=1600&q=80",
  title: "Premium Watches",
  subtitle: "Latest Technology",
  category: "Electronics",
  price: "RS. 29,999",
  badge: "BESTSELLER",
  description: "Cutting-edge technology meets elegant design",
},


    {
      image:
        "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=800&fit=crop",
      title: "Fashion Collection",
      subtitle: "Luxury Apparel",
      category: "Fashion",
      price: "  RS. 14,900",
      badge: "NEW ARRIVAL",
      description: "Sophisticated style for the modern professional",
    },
    {
    image:
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1600&q=80",
    title: "Modern Kitchen Must-haves",
    category: "Home",
    price: "Rs. 74,999",
    badge: "MODERN",
    description: "Upgrade your kitchen with designer essentials.",
  },
    {
      image:
        "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1200&h=800&fit=crop",
      title: "Beauty & Wellness",
      subtitle: "Self-Care Luxury",
      category: "Beauty",
      price: "RS. 89,000",
      badge: "TRENDING",
      description: "Premium wellness products for the discerning individual",
    },
    {
      image:
        "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=1200&h=800&fit=crop",
      title: "Sports & Fitness",
      subtitle: "Performance Gear",
      category: "Sports",
      price: "RS. 17,900",
      badge: "PROFESSIONAL",
      description: "Elite equipment for peak performance",
    },
  ];

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getProducts();
        const allProds = data.documents || [];
        setAllProducts(allProds);

        const filteredProducts = allProds
          .filter((p) => !p.name?.toLowerCase().includes("headphones"))
          .slice(0, 6);
        setProducts(filteredProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();

    const interval = setInterval(() => {
      if (isPlaying) {
        setCurrentSlide((prev) => (prev + 1) % productSlides.length);
      }
    }, 5000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % productSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + productSlides.length) % productSlides.length
    );
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-slate-200 rounded-full animate-spin"></div>
            <div className="w-20 h-20 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
            <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full absolute top-4 left-4 animate-pulse"></div>
          </div>
          <div className="space-y-3">
            <h2 className="text-2xl font-bold text-slate-900">MT-Stores</h2>
            <p className="text-indigo-700 font-semibold">
              Crafting Premium Experience
            </p>
            <p className="text-slate-600 text-sm">Loading luxury content...</p>
          </div>
        </div>
      </div>
    );
  }

  const stats = [
    { number: "15K+", label: "Global Customers", icon: Users, color: "text-blue-600" },
    { number: "7+", label: "Years Excellence", icon: Crown, color: "text-amber-600" },
    { number: "3K+", label: "Premium Products", icon: Gem, color: "text-purple-600" },
    { number: "99.8%", label: "Satisfaction Rate", icon: BadgeCheck, color: "text-emerald-600" },
  ];

  const features = [
    {
      icon: Globe,
      title: "Global Excellence Standards",
      desc: "ISO-certified quality management with international luxury partnerships and exclusive brand collaborations.",
      gradient: "from-blue-600 to-cyan-500",
      bg: "bg-gradient-to-br from-blue-50 to-cyan-50",
      iconBg: "bg-blue-100",
    },
    {
      icon: Rocket,
      title: "Next-Gen Logistics",
      desc: "AI-powered delivery network with same-day premium service and real-time tracking technology.",
      gradient: "from-emerald-600 to-teal-500",
      bg: "bg-gradient-to-br from-emerald-50 to-teal-50",
      iconBg: "bg-emerald-100",
    },
    {
      icon: Shield,
      title: "Enterprise Security Suite",
      desc: "Military-grade encryption, fraud protection, and comprehensive purchase insurance coverage.",
      gradient: "from-amber-600 to-orange-500",
      bg: "bg-gradient-to-br from-amber-50 to-orange-50",
      iconBg: "bg-amber-100",
    },
    {
      icon: Infinity,
      title: "Lifetime Value Program",
      desc: "Exclusive member tiers with lifetime warranties and personalized concierge services.",
      gradient: "from-violet-600 to-purple-500",
      bg: "bg-gradient-to-br from-violet-50 to-purple-50",
      iconBg: "bg-violet-100",
    },
  ];

  // NEW: Professional Testimonials (with online images)
  const testimonials = [
    {
      name: "Ava Thompson",
      role: "Product Manager, Zephyr Inc.",
      rating: 5,
      quote:
        "Flawless experience from browsing to delivery. MT-Stores has set a new bar for professional e-commerce.",
      avatar:
        "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=256&h=256&fit=crop&crop=faces",
    },
    {
      name: "Noah Martinez",
      role: "Creative Director, Northline",
      rating: 5,
      quote:
        "Incredible product curation and quality. Their support team is responsive and genuinely helpful.",
      avatar:
        "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=256&h=256&fit=crop&crop=faces",
    },
    {
      name: "Sophia Lee",
      role: "Founder, Lumina Studio",
      rating: 4,
      quote:
        "Shipping was fast and packaging premium. The UI feels refined and consistent across the journey.",
      avatar:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=256&h=256&fit=crop&crop=faces",
    },
    {
      name: "Ethan Walker",
      role: "Operations Lead, Ardent Labs",
      rating: 5,
      quote:
        "We source gifts for clients here. Reliability, quality, and presentation are always top-tier.",
      avatar:
        "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=256&h=256&fit=crop&crop=faces",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Advanced Product Slideshow Hero */}
      <section className="relative h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
        {/* Dynamic Background Grid */}
        <div className="absolute inset-0 opacity-20">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
              linear-gradient(rgba(99,102,241,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(99,102,241,0.1) 1px, transparent 1px)
            `,
              backgroundSize: "60px 60px",
              animation: "gridMove 20s linear infinite",
            }}
          ></div>
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/6 w-2 h-2 bg-indigo-400 rounded-full animate-ping"></div>
          <div className="absolute top-3/4 right-1/4 w-3 h-3 bg-purple-400 rounded-full animate-pulse delay-1000"></div>
          <div className="absolute bottom-1/3 left-1/3 w-1 h-1 bg-cyan-400 rounded-full animate-bounce delay-500"></div>
        </div>

        {/* Slides */}
        <div className="relative h-full">
          {productSlides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                index === currentSlide
                  ? "opacity-100 scale-100 z-20"
                  : "opacity-0 scale-105 z-10"
              }`}
            >
              <div className="absolute inset-0">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-black/60"></div>
              </div>
            </div>
          ))}

          {/* Overlay Content + Controls */}
          <div className="absolute inset-0 z-30">
            <div className="h-full max-w-7xl mx-auto px-6 flex items-center">
              <div className="grid lg:grid-cols-2 gap-16 items-center w-full">
                {/* Left Content */}
                <div className="space-y-8">
                  <div className="space-y-4">
                    <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white text-sm font-semibold">
                      <Building className="w-4 h-4 mr-2" />
                      Professional E-Commerce • Est. 2021
                    </div>

                    <h1 className="text-6xl lg:text-8xl font-black text-white leading-tight">
                      MT-Stores
                      <span className="block text-2xl lg:text-3xl font-light text-slate-300 mt-2">
                        Professional Retail Excellence
                      </span>
                    </h1>
                  </div>

                  {/* Current Slide Card */}
                  <div className="bg-white/95 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-white/20">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold ${
                            productSlides[currentSlide].badge === "BESTSELLER"
                              ? "bg-emerald-500 text-white"
                              : productSlides[currentSlide].badge ===
                                "NEW ARRIVAL"
                              ? "bg-blue-500 text-white"
                              : productSlides[currentSlide].badge ===
                                "LIMITED EDITION"
                              ? "bg-purple-500 text-white"
                              : productSlides[currentSlide].badge === "TRENDING"
                              ? "bg-pink-500 text-white"
                              : "bg-indigo-500 text-white"
                          }`}
                        >
                          {productSlides[currentSlide].badge}
                        </span>
                        <span className="text-slate-600 text-sm font-medium">
                          {productSlides[currentSlide].category}
                        </span>
                      </div>
                      <div className="text-2xl font-black text-slate-900">
                        {productSlides[currentSlide].price}
                      </div>
                    </div>

                    <h3 className="text-2xl font-bold text-slate-900 mb-2">
                      {productSlides[currentSlide].title}
                    </h3>
                    <p className="text-slate-600 mb-4 leading-relaxed">
                      {productSlides[currentSlide].description}
                    </p>

                    <div className="flex gap-3">
                      <Button
                        onClick={() => navigate("/products")}
                        className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-lg transition-all duration-200 font-semibold group"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                      <Button
                        variant="outline"
                        className="border-slate-300 text-slate-700 hover:bg-slate-50 px-6 py-3 rounded-lg transition-all duration-200"
                      >
                        <Heart className="w-4 h-4 mr-2" />
                        Save
                      </Button>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button
                      size="lg"
                      onClick={() => navigate("/products")}
                      className="bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-900 hover:to-black text-white font-bold px-10 py-5 rounded-xl shadow-xl transition-all duration-300 hover:scale-105 group text-lg"
                    >
                      <Briefcase className="mr-3 h-6 w-6" />
                      Browse Catalog
                      <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-2 transition-transform duration-200" />
                    </Button>

                    <Button
                      size="lg"
                      variant="outline"
                      onClick={() => navigate("/about")}
                      className="bg-white/10 border-2 border-white/30 text-white font-semibold px-10 py-5 rounded-xl backdrop-blur-sm hover:bg-white/20 transition-all duration-300 hover:scale-105 text-lg"
                    >
                      Learn More
                    </Button>
                  </div>
                </div>

                {/* Thumbnails + Controls */}
                <div className="hidden lg:block space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    {productSlides.slice(0, 4).map((slide, index) => (
                      <div
                        key={index}
                        onClick={() => goToSlide(index)}
                        onMouseEnter={() => setHoveredProduct(index)}
                        onMouseLeave={() => setHoveredProduct(null)}
                        className={`relative cursor-pointer rounded-xl overflow-hidden transition-all duration-300 ${
                          index === currentSlide
                            ? "ring-4 ring-white/50 scale-105 shadow-2xl"
                            : "hover:scale-102 hover:shadow-lg"
                        }`}
                      >
                        <img
                          src={slide.image}
                          alt={slide.title}
                          className="w-full h-32 object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        <div className="absolute bottom-2 left-2 right-2">
                          <div className="text-white">
                            <p className="text-xs font-bold">{slide.title}</p>
                            <p className="text-xs text-slate-300">
                              {slide.price}
                            </p>
                          </div>
                        </div>
                        {index === currentSlide && (
                          <div className="absolute inset-0 border-2 border-white/30 rounded-xl"></div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/30">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-slate-900 font-bold">
                        Product Showcase
                      </h4>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          onClick={() => setIsPlaying(!isPlaying)}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 rounded-lg"
                        >
                          {isPlaying ? (
                            <Play className="w-4 h-4" />
                          ) : (
                            <Pause className="w-4 h-4" />
                          )}
                        </Button>
                        <Button
                          size="sm"
                          onClick={prevSlide}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 rounded-lg"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          onClick={nextSlide}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 rounded-lg"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex gap-2 mb-4">
                      {productSlides.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => goToSlide(index)}
                          className={`h-2 rounded-full transition-all duration-300 ${
                            index === currentSlide
                              ? "w-8 bg-gradient-to-r from-indigo-500 to-purple-500"
                              : "w-2 bg-slate-300 hover:bg-slate-400"
                          }`}
                        />
                      ))}
                    </div>

                    <p className="text-slate-600 text-sm">
                      {currentSlide + 1} of {productSlides.length} • Auto-advance:{" "}
                      {isPlaying ? "ON" : "OFF"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Controls */}
          <div className="lg:hidden absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30">
            <div className="bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-white/30">
              <div className="flex items-center gap-4">
                <Button
                  size="sm"
                  onClick={prevSlide}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 p-2 rounded-lg"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <div className="flex gap-1">
                  {productSlides.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToSlide(index)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        index === currentSlide
                          ? "bg-slate-900"
                          : "bg-slate-400"
                      }`}
                    />
                  ))}
                </div>
                <Button
                  size="sm"
                  onClick={nextSlide}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 p-2 rounded-lg"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Professional Stats */}
      <section className="py-20 px-6 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="relative mb-6">
                  <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110 border border-slate-200">
                    <stat.icon className={`w-8 h-8 ${stat.color}`} />
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                </div>
                <div className="text-3xl lg:text-4xl font-black text-slate-900 mb-2">
                  {stat.number}
                </div>
                <div className="text-slate-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
<div className="bg-white py-16">
  <div className="max-w-7xl mx-auto px-6">
    {/* Header */}
    <div className="text-center mb-12">
      <div className="inline-flex items-center px-6 py-3 bg-indigo-100 text-indigo-800 rounded-full text-sm font-bold mb-6">
        <Crown className="w-5 h-5 mr-2" />
        Featured Products
      </div>
      <h2 className="text-4xl font-black text-gray-900 mb-4">
        Handpicked For You
      </h2>
      <p className="text-xl text-gray-600 max-w-2xl mx-auto">
        Explore our most popular and trending products, loved by our customers
      </p>
    </div>

    {/* Featured Grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      {products.slice(0, 4).map((product) => (
        <div
          key={product.$id}
          onClick={() => navigate(`/products/${product.$id}`)}
          className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-200 hover:border-indigo-300 hover:-translate-y-2 cursor-pointer"
        >
          {/* Image */}
          <div className="relative aspect-square overflow-hidden bg-gray-100">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              loading="lazy"
            />
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1 bg-indigo-600 text-white text-xs font-bold rounded-lg shadow-lg">
                {product.category}
              </span>
            </div>
          </div>

          {/* Info */}
          <div className="p-6">
            <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-2 mb-2">
              {product.name}
            </h3>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg font-black text-gray-900">
                Rs. {(product.price * 0.8).toLocaleString()}
              </span>
              <span className="text-sm text-gray-400 line-through">
                Rs. {product.price}
              </span>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="w-4 h-4 text-yellow-400 fill-current"
                />
              ))}
              <span className="text-sm text-gray-500 ml-2">(4.8)</span>
            </div>

            {/* Button */}
            <Button
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group/btn"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/products/${product.$id}`);
              }}
            >
              <Eye className="w-5 h-5 mr-2" />
              View Details
              <ArrowRight className="w-5 h-5 ml-2 group-hover/btn:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      ))}
    </div>

    {/* CTA */}
    <div className="text-center mt-12">
      <Button
        size="lg"
        onClick={() => navigate("/products")}
        className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-12 py-5 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 text-lg group"
      >
        View Complete Collection
      </Button>
    </div>
  </div>
</div>




      {/* What Our Customers Say (Testimonials with photos) */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-6 py-3 bg-slate-100 text-slate-800 rounded-full text-sm font-bold mb-8">
              <Sparkles className="w-5 h-5 mr-2 text-amber-500" />
              What Our Customers Say
            </div>
            <h2 className="text-4xl lg:text-5xl font-black text-slate-900 mb-4">
              Trusted by Professionals
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Real stories from real customers who rely on MT-Stores for
              premium quality and a seamless experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="bg-white border border-slate-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-14 h-14 rounded-full object-cover ring-2 ring-indigo-200"
                  />
                  <div>
                    <div className="font-bold text-slate-900">{t.name}</div>
                    <div className="text-sm text-slate-500">{t.role}</div>
                  </div>
                </div>

                <div className="flex items-center mb-3">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star
                      key={idx}
                      className={`w-4 h-4 ${
                        idx < t.rating ? "text-yellow-400 fill-current" : "text-slate-300"
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-xs font-semibold text-slate-500">
                    {t.rating}.0
                  </span>
                </div>

                <p className="text-slate-700 leading-relaxed">{t.quote}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Advanced Features */}
      <section className="py-24 px-6 bg-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div
            className="absolute top-0 left-0 w-full h-full opacity-5"
            style={{
              backgroundImage: `conic-gradient(from 0deg at 50% 50%, rgba(99,102,241,0.3), rgba(168,85,247,0.3), rgba(236,72,153,0.3), rgba(99,102,241,0.3))`,
              backgroundSize: "200px 200px",
            }}
          ></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-6 py-3 bg-slate-100 text-slate-800 rounded-full text-sm font-bold mb-8 shadow-lg border border-slate-200">
              <BadgeCheck className="w-5 h-5 mr-2 text-emerald-600" />
              Professional Standards
            </div>
            <h2 className="text-4xl lg:text-5xl font-black text-slate-900 mb-6">
              Enterprise-Grade{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                Solutions
              </span>
            </h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto font-light">
              Built for professionals who demand excellence in every aspect of
              their shopping experience
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`${feature.bg} p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-1 border border-slate-100 group relative overflow-hidden`}
                style={{
                  animation: `slideInRight 0.8s ease-out ${index * 200}ms both`,
                }}
              >
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0">
                    <div
                      className={`w-14 h-14 ${feature.iconBg} rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300 border border-white`}
                    >
                      <feature.icon className="w-7 h-7 text-slate-700" />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-slate-800 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-slate-700 leading-relaxed font-medium">
                      {feature.desc}
                    </p>
                    <div className="flex items-center gap-2 text-slate-600">
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                      <span className="text-sm font-medium">Enterprise Verified</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 bg-gradient-to-br from-slate-900 to-slate-800 text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div
            className="absolute top-0 left-0 w-full h-full opacity-10"
            style={{
              backgroundImage: `linear-gradient(45deg, transparent 49%, rgba(255,255,255,0.1) 50%, transparent 51%)`,
              backgroundSize: "20px 20px",
            }}
          ></div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <div className="space-y-10">
            <div className="inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white text-sm font-bold shadow-lg">
              <Zap className="w-5 h-5 mr-2 text-yellow-400" />
              Ready to Experience Excellence?
            </div>

            <div className="space-y-6">
              <h2 className="text-4xl lg:text-6xl font-black leading-tight">
                Transform Your
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                  Shopping Experience
                </span>
              </h2>

              <p className="text-xl text-slate-300 max-w-3xl mx-auto font-light leading-relaxed">
                Join thousands of professionals who trust MT-Stores for premium
                products, exceptional service, and unmatched reliability.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-4">
              <Button
                size="lg"
                className="bg-white text-slate-900 hover:bg-slate-50 font-bold px-12 py-5 rounded-xl shadow-xl transition-all duration-300 hover:scale-105 group text-lg"
                onClick={() => navigate("/products")}
              >
                <Briefcase className="mr-3 h-6 w-6" />
                Start Shopping
                <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-2 transition-transform duration-300" />
              </Button>

              <div className="flex gap-3">
                {[
                  {
                    icon: Phone,
                    color: "bg-blue-600 hover:bg-blue-700",
                    href: "tel:+1234567890",
                  },
                  {
                    icon: MessageCircle,
                    color: "bg-green-600 hover:bg-green-700",
                    href: "https://wa.me/1234567890",
                  },
                  {
                    icon: Mail,
                    color: "bg-purple-600 hover:bg-purple-700",
                    href: "mailto:hello@mt-stores.com",
                  },
                ].map((contact, index) => (
                  <Button
                    key={index}
                    size="lg"
                    onClick={() => (window.location.href = contact.href)}
                    className={`${contact.color} text-white px-5 py-5 rounded-xl transition-all duration-300 hover:scale-110 shadow-lg`}
                  >
                    <contact.icon className="w-5 h-5" />
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Newsletter */}
      <section className="py-20 px-6 bg-gradient-to-br from-slate-50 to-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto">
          {/* Trust Indicators */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-slate-800 text-center mb-12">
              Trusted by Industry Leaders
            </h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  label: "Secure Payments",
                  icon: ShieldCheck,
                  color: "text-emerald-600",
                  bg: "bg-emerald-50",
                },
                {
                  label: "Fast Delivery",
                  icon: Truck,
                  color: "text-blue-600",
                  bg: "bg-blue-50",
                },
                {
                  label: "Premium Quality",
                  icon: Award,
                  color: "text-amber-600",
                  bg: "bg-amber-50",
                },
                {
                  label: "24/7 Support",
                  icon: Clock,
                  color: "text-purple-600",
                  bg: "bg-purple-50",
                },
              ].map((trust, index) => (
                <div key={index} className="text-center group">
                  <div
                    className={`w-16 h-16 ${trust.bg} rounded-2xl flex items-center justify-center mx-auto shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110 border border-slate-200`}
                  >
                    <trust.icon className={`w-8 h-8 ${trust.color}`} />
                  </div>
                  <h4 className="text-lg font-semibold text-slate-800 mt-4 group-hover:text-slate-900 transition-colors">
                    {trust.label}
                  </h4>
                </div>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-12 text-white text-center shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-purple-600/20"></div>
            <div className="relative z-10 space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center px-4 py-2 bg-white/10 rounded-full text-sm font-bold">
                  <Crown className="w-4 h-4 mr-2 text-amber-400" />
                  Professional Membership
                </div>
                <h3 className="text-3xl lg:text-4xl font-black">
                  Join Our Professional Network
                </h3>
                <p className="text-xl text-slate-300 max-w-2xl mx-auto font-light">
                  Get exclusive access to industry insights, premium product
                  launches, and professional discounts
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <div className="flex-1">
                  <input
                    type="email"
                    placeholder="Enter your professional email"
                    className="w-full px-6 py-4 rounded-xl text-slate-900 font-medium placeholder-slate-500 focus:outline-none focus:ring-4 focus:ring-white/30 transition-all duration-300 border border-slate-300"
                  />
                </div>
                <Button className="bg-white text-slate-900 hover:bg-slate-50 font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 whitespace-nowrap">
                  <Briefcase className="w-5 h-5 mr-2" />
                  Join Network
                </Button>
              </div>

              <div className="flex justify-center gap-8 text-sm text-slate-400">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>Professional Discounts</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>Early Access</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>Priority Support</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// Advanced CSS Animations (inject once)
const styles = document.createElement("style");
styles.textContent = `
@keyframes slideInUp {
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes slideInRight {
  from { opacity: 0; transform: translateX(30px); }
  to { opacity: 1; transform: translateX(0); }
}
@keyframes gridMove {
  0% { transform: translate(0, 0); }
  100% { transform: translate(60px, 60px); }
}
.group:hover .group-hover\\:scale-102 { transform: scale(1.02); }
`;
if (typeof document !== "undefined" && !document.getElementById("home-anim-styles")) {
  styles.id = "home-anim-styles";
  document.head.appendChild(styles);
}

export default Homepage;

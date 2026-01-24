import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Heart,
  Globe,
  Award,
  Users,
  Leaf,
  Droplets,
  Microscope,
  ShieldCheck,
  Star,
  ArrowRight,
  Quote
} from "lucide-react";
import { motion } from "framer-motion";

export default function AboutPage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const stats = [
    { icon: Users, value: "50K+", label: "Glowing Customers", color: "text-rose-500" },
    { icon: Star, value: "4.9", label: "Average Rating", color: "text-amber-500" },
    { icon: Leaf, value: "100%", label: "Vegan & Cruelty-Free", color: "text-emerald-500" },
    { icon: Droplets, value: "24h", label: "Hydration Lock", color: "text-blue-500" },
  ];

  const values = [
    {
      icon: Microscope,
      title: "Science-Backed",
      description: "Formulated by expert dermatologists using clinical-grade active ingredients for visible results.",
    },
    {
      icon: Leaf,
      title: "Clean Beauty",
      description: "Free from parabens, sulfates, and harsh chemicals. We believe in effective, not aggressive, skincare.",
    },
    {
      icon: Heart,
      title: "Cruelty-Free",
      description: "We love our furry friends. None of our products are tested on animals, ever.",
    },
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      {/* Hero Section - Parallax/Gradient */}
      <section className="relative overflow-hidden bg-slate-900 text-white pb-32 pt-40 md:pt-48">
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 animate-pulse-slow"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-rose-500/10 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4"></div>

        <div className="relative max-w-7xl mx-auto px-6 text-center z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-8">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-xs uppercase tracking-widest font-semibold">The SkinGlow Story</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-8 tracking-tight">
              Science Meets <span className="text-primary italic">Soul</span>
            </h1>

            <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-light">
              We believe skincare shouldn't be complicated. It should be effective, enjoyable, and empowering.
              Review your natural radiance with formulas that work.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Board - Floating Overlap */}
      <div className="relative z-20 max-w-6xl mx-auto px-6 -mt-20">
        <div className="grid grid-cols-2 md:grid-cols-4 bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-8 md:p-12 border border-slate-100">
          {stats.map((stat, i) => (
            <div key={i} className="text-center p-4 border-r last:border-r-0 border-slate-100/50">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-slate-50 rounded-2xl">
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
              <div className="text-3xl md:text-4xl font-bold mb-2 text-slate-900">{stat.value}</div>
              <div className="text-xs uppercase tracking-wider font-semibold text-slate-500">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Founder's Letter */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            {/* Image Side */}
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-[3rem] rotate-3 transform"></div>
              <div className="relative bg-slate-100 rounded-[3rem] overflow-hidden aspect-[4/5] shadow-2xl">
                <img
                  src="https://i.pinimg.com/736x/6f/a5/8f/6fa58f97ed672d12ee9521c8ba395f87.jpg"
                  alt="Founder Maryam Tahir"
                  className="w-full h-full object-cover grayscale-0 group-hover:grayscale transition-all duration-700 hover:scale-105"
                />
              </div>
              <div className="absolute -bottom-10 -right-10 bg-white p-8 rounded-3xl shadow-xl max-w-xs hidden md:block border border-slate-100">
                <p className="font-handwriting text-2xl text-primary mb-2">"Glow from within"</p>
                <p className="text-xs text-slate-500 font-sans uppercase tracking-widest">Maryam Tahir, Founder</p>
              </div>
            </div>

            {/* Text Side */}
            <div className="space-y-8">
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900">
                More Than Just <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-rose-400">Skincare.</span>
              </h2>

              <div className="space-y-6 text-lg text-slate-600 leading-relaxed">
                <p>
                  <span className="text-slate-900 font-semibold text-xl">Hello! I'm Maryam.</span> Formulating effective skincare wasn't just a business idea—it was a personal journey.
                </p>
                <p>
                  Frustrated by products that were either too harsh or simply ineffective, I set out to create a solution that bridges the gap between clinical efficacy and a luxurious self-care experience.
                </p>
                <p>
                  At SkinGlow, we meticulously select every ingredient. If it doesn't serve your skin, it doesn't make the cut. Our mission is simple: to give you the confidence to wear your natural skin, proudly.
                </p>
              </div>

              <div className="pt-4">
                <div className="flex items-center gap-4">
                  <div className="h-px flex-1 bg-slate-200"></div>
                  <ShieldCheck className="w-6 h-6 text-emerald-500" />
                  <span className="text-sm font-bold text-slate-900 uppercase tracking-widest">Dermatologist Tested</span>
                  <div className="h-px flex-1 bg-slate-200"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-32 bg-slate-50 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent"></div>

        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Philosophy</h2>
            <p className="text-slate-600 text-lg">
              We promised ourselves we would never compromise on quality. Here are the three pillars that define every bottle we produce.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {values.map((v, i) => (
              <div key={i} className="group bg-white rounded-2xl p-10 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2 border border-slate-100">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-8 group-hover:scale-110 transition-transform duration-500">
                  <v.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-slate-900">{v.title}</h3>
                <p className="text-slate-600 leading-relaxed">
                  {v.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}

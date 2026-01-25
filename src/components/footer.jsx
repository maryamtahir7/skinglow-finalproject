import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { getCategories } from "../backend/database";
import {
  Mail,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  ArrowUp,
  MapPin,
  Sparkles,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Footer() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const CONTACT_EMAIL = "skin.glow.skincare.pk@gmail.com";
  const LOCATION = "Faisalabad, Punjab, Pakistan";

  useEffect(() => {
    async function fetchCats() {
      try {
        const res = await getCategories();
        setCategories(res.documents?.slice(0, 5) || []);
      } catch (e) {
        console.error("Footer category fetch error", e);
      }
    }
    fetchCats();
  }, []);

  const quickLinks = [
    { name: "Home", path: "/" },
    { name: "Shop All", path: "/products" },
    { name: "About Us", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  const support = [
    { name: "Help Center", path: "/support" },
    { name: "Return Policy", path: "/returns" },
    { name: "Shipping Info", path: "/shipping" },
    { name: "Skin Quiz", path: "/skin-quiz" },
  ];

  const legal = [
    { name: "Privacy Policy", path: "/privacy-policy" },
    { name: "Terms of Service", path: "/terms" },
    { name: "Drug License Info", path: "/license" },
  ];

  const socials = [
    { icon: Facebook, url: "https://facebook.com" },
    { icon: Instagram, url: "https://instagram.com" },
    { icon: Twitter, url: "https://twitter.com" },
    { icon: Linkedin, url: "https://www.linkedin.com/in/maryam-tahir-408704353/" },
  ];

  return (
    <footer className="relative bg-[#0A0A0A] text-white pt-24 pb-8 overflow-hidden font-sans">

      {/* 1. BACKGROUND AMBIANCE */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Giant Faded Typography */}
        <div className="absolute -top-[10%] -left-[10%] text-[20vw] font-serif opacity-[0.03] text-white leading-none tracking-tighter select-none">
          SkinGlow
        </div>
        {/* Soft Spotlights */}
        <div className="absolute top-[-20%] right-[10%] w-[500px] h-[500px] bg-rose-900/20 rounded-full blur-[128px]" />
        <div className="absolute bottom-[-20%] left-[10%] w-[600px] h-[600px] bg-indigo-900/10 rounded-full blur-[128px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">

        {/* 2. NEWSLETTER GLASS CARD (Floating & Responsive) */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative -mt-32 mb-20 bg-white/5 backdrop-blur-2xl border border-white/10 p-6 md:p-12 rounded-[24px] md:rounded-[32px] overflow-hidden group shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
        >
          {/* Shimmer Effect */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/5 via-transparent to-rose-500/10 opacity-50 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

          <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 lg:gap-10 items-center relative z-10">
            <div className="text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start gap-2 mb-4">
                <span className="w-8 h-[1px] bg-rose-400"></span>
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-rose-300">The Inner Circle</span>
              </div>
              <h3 className="text-3xl md:text-5xl font-serif mb-4 leading-tight">
                Unlock 10% Off <br /><span className="text-white/50 italic">Your First Ritual.</span>
              </h3>
              <p className="text-white/60 font-light text-base md:text-lg max-w-md mx-auto lg:mx-0">
                Join our community for expert skincare advice, early access to drops, and exclusive member-only rewards.
              </p>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const email = e.target.elements.email.value;
                if (!email) return;

                const btn = e.target.querySelector('button');
                const originalText = btn.innerText;
                btn.innerText = "Joining...";
                btn.disabled = true;

                try {
                  const res = await fetch('/api/newsletter', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email })
                  });

                  if (res.ok) {
                    btn.innerText = "Welcome!";
                    btn.classList.add('bg-emerald-400', 'text-stone-900');
                    e.target.reset();
                    setTimeout(() => {
                      btn.innerText = originalText;
                      btn.disabled = false;
                      btn.classList.remove('bg-emerald-400', 'text-stone-900');
                    }, 3000);
                  } else {
                    throw new Error("Failed");
                  }
                } catch (err) {
                  console.error(err);
                  btn.innerText = "Error (Check Console)";
                  btn.classList.add('bg-red-500', 'text-white');
                  setTimeout(() => {
                    btn.innerText = originalText;
                    btn.disabled = false;
                    btn.classList.remove('bg-red-500', 'text-white');
                  }, 3000);
                }
              }}
              className="w-full bg-white/5 border border-white/10 p-2 rounded-2xl flex flex-col md:flex-row gap-2"
            >
              {/* Mobile: Full Width Input */}
              <input
                name="email"
                type="email"
                required
                placeholder="Your email address"
                className="w-full flex-1 bg-transparent border-none px-6 py-4 rounded-xl text-white placeholder:text-white/30 outline-none focus:ring-1 focus:ring-white/20 transition-all text-base md:text-lg min-w-0"
              />
              {/* Mobile: Full Width Button */}
              <Button type="submit" className="w-full md:w-auto rounded-xl px-8 py-4 bg-gradient-to-r from-rose-200 to-indigo-200 text-stone-900 hover:opacity-90 font-bold uppercase tracking-widest text-xs shadow-lg transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-70 disabled:hover:scale-100 whitespace-nowrap">
                Subscribe
              </Button>
            </form>
          </div>
        </motion.div>

        {/* 3. MAIN FOOTER GRID */}
        <div className="grid md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-20 border-b border-white/5 pb-20">

          {/* Brand Column (Span 4) */}
          <div className="lg:col-span-4 space-y-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white text-stone-900 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6" />
              </div>
              <span className="text-2xl font-bold tracking-tight">SkinGlow</span>
            </div>
            <p className="text-white/50 leading-relaxed font-light text-lg max-w-sm">
              Premium skincare rooted in science, inspired by nature. We believe in transparency, sustainability, and results you can see.
            </p>
            <div className="flex gap-4">
              {socials.map((s, i) => (
                <a key={i} href={s.url} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 hover:scale-110 transition-all">
                  <s.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns (Span 2 each) */}
          <div className="lg:col-span-2 lg:col-start-6">
            <h4 className="font-bold text-sm uppercase tracking-widest text-white/40 mb-6">Explore</h4>
            <ul className="space-y-4">
              {quickLinks.map((l, i) => (
                <li key={i}>
                  <button onClick={() => navigate(l.path)} className="text-white/70 hover:text-white hover:translate-x-1 transition-all flex items-center gap-1">
                    {l.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="font-bold text-sm uppercase tracking-widest text-white/40 mb-6">Categories</h4>
            <ul className="space-y-4">
              {categories.map((c) => (
                <li key={c.$id}>
                  <button onClick={() => navigate(`/products?category=${c.name}`)} className="text-white/70 hover:text-white hover:translate-x-1 transition-all flex items-center gap-1">
                    {c.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="font-bold text-sm uppercase tracking-widest text-white/40 mb-6">Support</h4>
            <ul className="space-y-4">
              {support.map((l, i) => (
                <li key={i}>
                  <button onClick={() => navigate(l.path)} className="text-white/70 hover:text-white hover:translate-x-1 transition-all flex items-center gap-1">
                    {l.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div className="lg:col-span-2">
            <h4 className="font-bold text-sm uppercase tracking-widest text-white/40 mb-6">Contact</h4>
            <div className="space-y-5">
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="text-white/70 hover:text-white transition-colors flex items-start gap-3"
              >
                <span className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </span>
                <span className="leading-relaxed break-all">{CONTACT_EMAIL}</span>
              </a>

              <div className="text-white/70 flex items-start gap-3">
                <span className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4" />
                </span>
                <span className="leading-relaxed">{LOCATION}</span>
              </div>
            </div>
          </div>

        </div>

        {/* 4. BOTTOM BAR */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-white/30 font-medium tracking-wide">
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <span>© {new Date().getFullYear()} SkinGlow Inc.</span>
            <span className="hidden md:inline w-1 h-1 rounded-full bg-white/20"></span>
            {legal.map((l, i) => (
              <button key={i} onClick={() => navigate(l.path)} className="hover:text-white transition-colors">
                {l.name}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2 rounded-full backdrop-blur-sm group hover:bg-white/10 transition-colors">
              <span className="text-white/40">Developed by</span>
              <span className="text-white font-bold bg-gradient-to-r from-rose-200 to-indigo-200 bg-clip-text text-transparent">Maryam Tahir</span>
              <span className="w-1 h-1 rounded-full bg-white/20"></span>
              <span className="text-xs font-semibold tracking-widest uppercase text-white/40 group-hover:text-white/60 transition-colors">Full Stack Developer</span>
            </div>

            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white hover:text-stone-900 transition-colors">
              <ArrowUp className="w-3 h-3" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}

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
    { name: "Skin Quiz", path: "/skin-quiz" },
  ];

  const socials = [
    { icon: Facebook, url: "https://facebook.com" },
    { icon: Instagram, url: "https://instagram.com" },
    { icon: Twitter, url: "https://twitter.com" },
    { icon: Linkedin, url: "https://www.linkedin.com/in/maryam-tahir-408704353/" },
  ];

  return (
    <footer className="relative bg-[#050505] text-white pt-24 pb-10 overflow-hidden font-sans border-t border-white/5">

      {/* 1. BACKGROUND AMBIANCE */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Giant Faded Typography */}
        <div className="absolute -top-[5%] -left-[5%] text-[25vw] font-serif opacity-[0.02] text-white leading-none tracking-tighter select-none mix-blend-overlay">
          SkinGlow
        </div>
        {/* Soft Spotlights */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-rose-900/10 rounded-full blur-[150px] opacity-40" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-900/10 rounded-full blur-[150px] opacity-30" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">

        {/* 2. CONSOLIDATED PREMIUM GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 items-start mb-20">

          {/* Brand & Socials (Span 3) */}
          <div className="lg:col-span-3 space-y-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-rose-100 to-rose-200 text-stone-900 rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(255,228,230,0.3)] shrink-0">
                <Sparkles className="w-5 h-5 text-rose-900" />
              </div>
              <span className="text-3xl font-serif tracking-tight">SkinGlow</span>
            </div>
            <p className="text-white/50 leading-relaxed font-light text-sm max-w-xs">
              Premium skincare rooted in science, inspired by nature. We believe in transparency and results you can see.
            </p>
            <div className="flex gap-3">
              {socials.map((s, i) => (
                <a key={i} href={s.url} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-rose-200 hover:border-rose-200/30 hover:bg-rose-500/10 transition-all duration-300">
                  <s.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Newsletter Centerpiece (Span 6) - Filling the Space */}
          <div className="lg:col-span-6 flex flex-col items-center text-center px-4">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="w-full max-w-lg"
            >
              <h3 className="text-3xl md:text-4xl font-serif mb-4 leading-snug">
                Join our <span className="text-rose-200/80 italic">Inner Circle</span>
              </h3>
              <p className="text-white/40 font-light text-sm mb-8 max-w-sm mx-auto">
                Unlock 10% off your first ritual and receive exclusive skincare guides.
              </p>

              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  const email = e.target.elements.email.value;
                  if (!email) return;

                  const btn = e.target.querySelector('button');
                  const originalText = btn.innerText;
                  btn.innerText = "...";
                  btn.disabled = true;

                  try {
                    const res = await fetch('/api/newsletter', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ email })
                    });

                    if (res.ok) {
                      btn.innerText = "✓";
                      btn.classList.add('bg-emerald-400', 'text-stone-900', 'border-emerald-400');
                      e.target.reset();
                      setTimeout(() => {
                        btn.innerText = originalText;
                        btn.disabled = false;
                        btn.classList.remove('bg-emerald-400', 'text-stone-900', 'border-emerald-400');
                      }, 3000);
                    } else {
                      throw new Error("Failed");
                    }
                  } catch (err) {
                    console.error(err);
                    btn.innerText = "!";
                    btn.classList.add('bg-red-500', 'text-white', 'border-red-500');
                    setTimeout(() => {
                      btn.innerText = originalText;
                      btn.disabled = false;
                      btn.classList.remove('bg-red-500', 'text-white', 'border-red-500');
                    }, 3000);
                  }
                }}
                className="group relative w-full bg-white/5 border border-white/10 p-1 rounded-full flex gap-1 focus-within:ring-1 focus-within:ring-rose-200/30 transition-all duration-300 shadow-xl"
              >
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="Your email address"
                  className="w-full flex-1 bg-transparent border-none pl-6 pr-2 py-3 rounded-full text-white placeholder:text-white/20 outline-none text-sm min-w-0"
                />
                <Button type="submit" className="rounded-full px-8 py-3 bg-white text-stone-950 hover:bg-rose-50 font-bold uppercase tracking-widest text-[10px] shadow-lg transition-all h-auto border border-transparent shrink-0">
                  Subscribe
                </Button>
              </form>
            </motion.div>
          </div>

          {/* Links & Contact (Span 3) */}
          <div className="lg:col-span-3 grid grid-cols-2 lg:grid-cols-1 gap-8 text-right lg:text-left">
            <div>
              <h4 className="font-serif text-lg text-rose-100/90 mb-6">Explore</h4>
              <ul className="space-y-3">
                {quickLinks.map((l, i) => (
                  <li key={i}>
                    <button onClick={() => navigate(l.path)} className="text-white/50 hover:text-white transition-all text-sm font-medium tracking-wide">
                      {l.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-serif text-lg text-rose-100/90 mb-6">Connect</h4>
              <div className="space-y-4">
                <a href={`mailto:${CONTACT_EMAIL}`} className="block text-white/50 hover:text-white transition-all text-xs break-all leading-relaxed">
                  {CONTACT_EMAIL}
                </a>
                <p className="text-white/30 text-xs leading-relaxed uppercase tracking-[0.1em] font-medium">
                  {LOCATION}
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* 4. BOTTOM BAR */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] uppercase tracking-widest text-white/20 font-semibold border-t border-white/5 pt-12">
          <div className="flex flex-wrap justify-center md:justify-start gap-x-8 gap-y-4 items-center">
            <span>© {new Date().getFullYear()} SkinGlow Inc.</span>
            <button onClick={() => navigate('/privacy-policy')} className="hover:text-white/60 transition-colors">Privacy</button>
            <button onClick={() => navigate('/terms')} className="hover:text-white/60 transition-colors">Terms</button>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 cursor-default shrink-0">
              <span className="opacity-50">Developed by</span>
              <span className="text-white/50 font-bold tracking-[0.15em] hover:text-rose-200 transition-colors">Maryam Tahir</span>
              <span className="w-1 h-1 rounded-full bg-white/10 mx-1"></span>
              <span className="opacity-40 font-medium">Full Stack Developer</span>
            </div>

            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all duration-300 shrink-0">
              <ArrowUp className="w-3 h-3" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}

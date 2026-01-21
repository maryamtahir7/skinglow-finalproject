import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { getCategories } from "../backend/database";
import {
  Mail,
  Phone,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  ArrowUp,
  MapPin,
  Clock,

  Sparkles
} from "lucide-react";

export default function Footer() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    async function fetchCats() {
      try {
        const res = await getCategories();
        // Take top 5 categories
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

  // Dynamic categories used in render loop below
  // ...

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
    { icon: Facebook, url: "https://facebook.com", color: "hover:text-blue-500" },
    { icon: Instagram, url: "https://instagram.com", color: "hover:text-pink-500" },
    { icon: Twitter, url: "https://twitter.com", color: "hover:text-sky-500" },
    { icon: Linkedin, url: "https://linkedin.com", color: "hover:text-blue-700" },
  ];

  return (
    <footer className="relative bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-6 py-16">

        {/* Top Section */}
        <motion.div
          className="grid md:grid-cols-4 gap-10 mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
                <Sparkles className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-bold text-white tracking-tight">
                Skin<span className="text-primary">Glow</span>
              </h2>
            </div>

            <p className="text-sm leading-relaxed text-slate-400 mb-6">
              Your daily dose of glow. Premium skincare products formulated to bring out your natural radiance.
            </p>

            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-primary mt-1" />
                <span>Punjab, Pakistan</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-primary" />
                <a href="mailto:glow@skinglow.com" className="hover:text-white transition">glow@skinglow.com</a>
              </div>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-white mb-5 text-base uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-3 text-sm">
              {quickLinks.map((l, i) => (
                <li key={i}>
                  <button
                    onClick={() => navigate(l.path)}
                    className="hover:text-primary transition-colors flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary/50"></span>
                    {l.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-5 text-base uppercase tracking-wider">Categories</h4>
            <ul className="space-y-3 text-sm">
              {categories.length > 0 ? categories.map((cat) => (
                <li key={cat.$id}>
                  <button
                    onClick={() => navigate(`/products?category=${cat.name}`)}
                    className="hover:text-primary transition-colors flex items-center gap-2 text-left"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary/50"></span>
                    {cat.name}
                  </button>
                </li>
              )) : (
                <li className="text-slate-500 text-xs">Loading categories...</li>
              )}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-5 text-base uppercase tracking-wider">Support</h4>
            <ul className="space-y-3 text-sm">
              {support.map((l, i) => (
                <li key={i}>
                  <button
                    onClick={() => navigate(l.path)}
                    className="hover:text-primary transition-colors flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary/50"></span>
                    {l.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        {/* Newsletter */}
        <motion.div
          className="bg-slate-800/50 rounded-2xl p-8 md:p-10 border border-slate-700/50 relative overflow-hidden"
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          {/* Decorative background circle */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <h4 className="text-xl font-bold text-white mb-2">
                Join our Glow List
              </h4>
              <p className="text-sm text-slate-400">
                Get expert skincare tips and exclusive offers.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
              <input
                type="email"
                placeholder="Enter your email address"
                className="w-full px-4 py-3 rounded-lg bg-slate-900 text-white border border-slate-700 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder-slate-500"
              />
              <button className="px-6 py-3 bg-primary hover:bg-primary/90 rounded-lg font-semibold text-white shadow-lg shadow-primary/20 transition-all active:scale-95 whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </motion.div>

        {/* Bottom */}
        <div className="border-t border-slate-800 pt-8 mt-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left space-y-2">
              <p className="text-xs text-slate-400">
                © {new Date().getFullYear()} SkinGlow. All rights reserved.
              </p>
              <div className="flex items-center gap-2 justify-center md:justify-start text-xs text-slate-500">
                <span className="text-slate-600">Developed by</span>
                <span className="text-primary font-semibold tracking-wide">Maryam Tahir</span>
                <span className="text-slate-600">•</span>
                <span className="text-slate-500">Full Stack Developer</span>
              </div>
            </div>

            <div className="flex gap-6">
              {legal.map((l, i) => (
                <button
                  key={i}
                  onClick={() => navigate(l.path)}
                  className="text-xs text-slate-500 hover:text-primary transition"
                >
                  {l.name}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              {socials.map((s, i) => (
                <a
                  key={i}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-2 rounded-full bg-slate-800 hover:bg-slate-700 transition ${s.color}`}
                >
                  <s.icon className="w-4 h-4" />
                </a>
              ))}
              <button
                onClick={() =>
                  window.scrollTo({ top: 0, behavior: "smooth" })
                }
                className="p-2 rounded-full bg-primary hover:bg-primary/90 text-white transition shadow-lg ml-4"
                title="Back to Top"
              >
                <ArrowUp className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

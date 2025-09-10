import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  ArrowUp,
} from "lucide-react";

export default function Footer() {
  const navigate = useNavigate();

  const quickLinks = [
    { name: "Home", path: "/" },
    { name: "Products", path: "/products" },
    { name: "About", path: "/about" },
  ];

  const categories = [
    { name: "Electronics", path: "/products/electronics" },
    { name: "Fashion", path: "/products/fashion" },
    { name: "Home & Living", path: "/products/home" },
    { name: "Sports & Fitness", path: "/products/sports" },
  ];

  const support = [
    { name: "Customer Service", path: "/support" },
    { name: "Return Policy", path: "/returns" },
    { name: "Shipping Info", path: "/shipping" },
    { name: "Size Guide", path: "/size-guide" },
  ];

  const legal = [
    { name: "Privacy Policy", path: "/privacy-policy" },
    { name: "Terms of Service", path: "/terms" },
  ];

  const socials = [
    { icon: Facebook, url: "https://facebook.com", color: "hover:text-blue-500" },
    { icon: Instagram, url: "https://instagram.com", color: "hover:text-pink-500" },
    { icon: Twitter, url: "https://twitter.com", color: "hover:text-sky-500" },
    { icon: Linkedin, url: "https://linkedin.com", color: "hover:text-blue-700" },
  ];

  return (
    <footer className="relative bg-gradient-to-br from-gray-950 via-black to-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-6 py-16">
        
        {/* Top Section */}
        <motion.div
          className="grid md:grid-cols-4 gap-12 mb-14"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          {/* Brand */}
          <div>
            <h2 className="text-3xl font-extrabold text-white mb-4 tracking-tight">
              MT Store
            </h2>
            <p className="text-sm leading-relaxed text-gray-400">
              Trusted online shopping destination since 2020. Delivering quality
              products with care and commitment.
            </p>
            <div className="mt-6 space-y-2 text-sm">
              
              <a
                href="mailto:maryamtahir236@gmail.com"
                className="flex items-center gap-2 hover:text-white transition"
              >
                <Mail className="w-4 h-4 text-violet-400" />{" "}
                maryamtahir236@gmail.com
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-lg">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              {quickLinks.map((l, i) => (
                <li key={i}>
                  <button
                    onClick={() => navigate(l.path)}
                    className="hover:text-violet-400 transition-colors"
                  >
                    {l.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4 text-lg">Categories</h4>
            <ul className="space-y-2 text-sm">
              {categories.map((l, i) => (
                <li key={i}>
                  <button
                    onClick={() => navigate(l.path)}
                    className="hover:text-violet-400 transition-colors"
                  >
                    {l.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4 text-lg">Support</h4>
            <ul className="space-y-2 text-sm">
              {support.map((l, i) => (
                <li key={i}>
                  <button
                    onClick={() => navigate(l.path)}
                    className="hover:text-violet-400 transition-colors"
                  >
                    {l.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        {/* Newsletter */}
        <motion.div
          className="bg-gradient-to-r from-violet-600/20 to-pink-600/20 backdrop-blur-lg rounded-2xl p-8 text-center shadow-lg border border-white/10"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h4 className="text-xl font-semibold text-white mb-2">
            Stay Ahead of the Trends ✨
          </h4>
          <p className="text-sm text-gray-400 mb-6">
            Subscribe for the latest deals, exclusive drops, and special offers.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 rounded-lg bg-gray-800/70 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
            <button className="px-6 py-2 bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-700 hover:to-pink-700 rounded-lg font-medium text-white shadow-md transition-transform hover:scale-105">
              Subscribe
            </button>
          </div>
        </motion.div>

        {/* Bottom */}
        <div className="border-t border-gray-800 pt-8 mt-12 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs text-gray-500 text-center md:text-left">
            © {new Date().getFullYear()} MT Store — Crafted by{" "}
            <span className="text-white font-medium">Maryam Tahir</span>.
          </p>

          <div className="flex gap-4">
            {legal.map((l, i) => (
              <button
                key={i}
                onClick={() => navigate(l.path)}
                className="text-xs hover:text-violet-400 transition"
              >
                {l.name}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {socials.map((s, i) => (
              <motion.a
                key={i}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.15 }}
                className={`p-2 rounded-full bg-white/10 hover:bg-white/20 transition ${s.color}`}
              >
                <s.icon className="w-4 h-4" />
              </motion.a>
            ))}
            <button
              onClick={() =>
                window.scrollTo({ top: 0, behavior: "smooth" })
              }
              className="p-2 rounded-full bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-700 hover:to-pink-700 transition shadow-md"
              title="Back to Top"
            >
              <ArrowUp className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

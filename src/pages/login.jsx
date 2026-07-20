// src/pages/login.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { login, processGoogleUser } from "../backend/auth";
import { useGoogleLogin } from "@react-oauth/google";
import { useUser } from "../context/UserContext";
import { Button } from "@/components/ui/button";
import { Sparkles, Mail, Lock, AlertCircle, CheckCircle2, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function LoginForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useUser();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setLoading(true);
        const userInfo = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        }).then(res => res.json());
        
        await processGoogleUser(userInfo);
      } catch (err) {
        console.error("Google login error:", err);
        setError("Could not sign in with Google.");
        setLoading(false);
      }
    },
    onError: errorResponse => {
      console.error(errorResponse);
      setError("Google login was cancelled or failed.");
    },
  });

  // Check if redirected from signup
  useEffect(() => {
    if (location.state?.email) {
      setFormData(prev => ({ ...prev, email: location.state.email }));
    }
    if (location.state?.message) {
      setSuccess(location.state.message);
      // Clear state to prevent showing message on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const user = await login(formData.email, formData.password);
      setUser(user);
      navigate("/");
    } catch (err) {
      console.error(err);
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative w-full overflow-hidden flex items-center justify-center font-sans selection:bg-rose-200 selection:text-rose-900">

      {/* 1. BACKGROUND LAYER - High End Editorial Visual */}
      <div className="absolute inset-0 z-0">
        <motion.img
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          src="https://i.pinimg.com/1200x/24/c6/4d/24c64df4196ec4b66ab96e1b871e29c6.jpg"
          alt="Background"
          className="w-full h-full object-cover"
        />
        {/* Cinematic Overlay - Darker for readability */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />

        {/* Animated Gradient Orbs */}
        <motion.div
          animate={{
            x: [0, 50, 0],
            y: [0, -30, 0],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-rose-500/30 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{
            x: [0, -30, 0],
            y: [0, 50, 0],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-indigo-500/20 rounded-full blur-[120px]"
        />
      </div>

      {/* 2. GLASS CARD CONTAINER */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, type: "spring", bounce: 0.3 }}
        className="relative z-10 w-full max-w-[480px] mx-4"
      >
        <div className="backdrop-blur-2xl bg-white/10 border border-white/20 shadow-2xl rounded-[32px] overflow-hidden p-8 md:p-12 relative group">

          {/* Subtle Shine Effect */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

          {/* Header */}
          <div className="text-center mb-10">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="w-16 h-16 bg-white/10 border border-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg backdrop-blur-md"
            >
              <Sparkles className="w-8 h-8 text-white" />
            </motion.div>
            <h1 className="text-4xl font-serif text-white mb-3 tracking-tight">Welcome Back</h1>
            <p className="text-white/60 font-light text-lg">Your ritual awaits. Step back into the glow.</p>
          </div>

          {/* Messages */}
          {success && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 bg-emerald-500/20 border border-emerald-500/30 text-emerald-100 px-4 py-3 rounded-xl flex items-center gap-3 text-sm backdrop-blur-md">
              <CheckCircle2 className="w-4 h-4 text-emerald-300" /> {success}
            </motion.div>
          )}

          {error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 bg-red-500/20 border border-red-500/30 text-rose-100 px-4 py-3 rounded-xl flex items-center gap-3 text-sm backdrop-blur-md">
              <AlertCircle className="w-4 h-4 text-rose-300" /> {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-white/50 ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-white transition-colors" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    setSuccess("");
                  }}
                  placeholder="name@example.com"
                  className="w-full bg-black/20 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-white/20 outline-none focus:bg-black/30 focus:border-white/30 transition-all font-medium"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-xs font-bold uppercase tracking-widest text-white/50">Password</label>
                <Link to="/forgot-password" className="text-xs text-white/60 hover:text-white hover:underline transition-colors">Forgot Password?</Link>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-white transition-colors" />
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full bg-black/20 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-white/20 outline-none focus:bg-black/30 focus:border-white/30 transition-all font-medium font-sans" // force serif avoidance for dots
                />
              </div>
            </div>

            {/* Action Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-14 bg-white text-stone-900 border-0 rounded-xl hover:bg-stone-100 font-bold text-lg tracking-wide hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-black/10 flex items-center justify-center gap-2 group/btn"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-stone-900/30 border-t-stone-900 rounded-full animate-spin" />
              ) : (
                <>Sign In <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" /></>
              )}
            </Button>

            {/* Divider */}
            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-[10px] uppercase tracking-widest">
                <span className="bg-transparent px-2 text-white/40 font-bold">Or Continue With</span>
              </div>
            </div>

            {/* Social Login */}
            <button
              type="button"
              onClick={() => handleGoogleLogin()}
              className="w-full h-12 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl flex items-center justify-center gap-3 text-white font-medium transition-all group/google"
            >
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5 grayscale group-hover/google:grayscale-0 transition-all duration-300" />
              <span>Google Account</span>
            </button>

          </form>

          {/* Footer */}
          <div className="mt-8 text-center text-sm text-white/50">
            New to SkinGlow? <Link to="/signup" className="text-white font-bold hover:underline decoration-white/50 underline-offset-4">Create an account</Link>
          </div>

        </div>
      </motion.div>

      {/* Disclaimer / Bottom Text */}
      <div className="absolute bottom-6 text-white/30 text-xs tracking-wider font-light z-10 selection:bg-transparent">
        © 2026 SkinGlow Inc. Elevating Beauty.
      </div>
    </div>
  );
}

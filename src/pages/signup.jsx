// src/pages/signup.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signup, processGoogleUser, sendOtp, verifyOtp } from "../backend/auth";
import { useGoogleLogin } from "@react-oauth/google";
import { useUser } from "../context/UserContext";
import { Button } from "@/components/ui/button";
import { Sparkles, User, Mail, Lock, AlertCircle, Hash, ArrowRight, ArrowLeft, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function SignupForm() {
  const navigate = useNavigate();
  const { setUser } = useUser();

  // Steps: 'form' | 'otp'
  const [signupStep, setSignupStep] = useState('form');
  const [userId, setUserId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [otpCode, setOtpCode] = useState("");
  const [error, setError] = useState("");
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

  // Handle Initial Signup (Account Creation)
  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Custom Email Validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    // Block common disposable email domains
    const disposableDomains = [
      "tempmail.com", "throwawaymail.com", "mailinator.com", "yopmail.com",
      "guerrillamail.com", "10minutemail.com", "sharklasers.com"
    ];
    const domain = formData.email.split('@')[1].toLowerCase();
    if (disposableDomains.includes(domain)) {
      setError("Temporary/Disposable email addresses are not allowed.");
      setLoading(false);
      return;
    }

    try {
      const result = await signup(formData.email, formData.password, formData.name);

      if (result && result.userId) {
        setUserId(result.userId);
        await sendOtp(result.userId, formData.email);
        setSignupStep('otp');
      } else {
        throw new Error("Failed to retrieve user ID.");
      }

    } catch (err) {
      console.error("Signup Error:", err);
      if (err.code === 409) {
        setError("An account with this email already exists.");
      } else if (err.message?.toLowerCase().includes("rate limit")) {
        setError("Too many attempts. Please wait.");
      } else {
        setError(err.message || "Failed to create account.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP Verification
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await verifyOtp(userId, otpCode);
      navigate("/", {
        state: { message: "Welcome to SkinGlow! Your email has been verified." }
      });
      window.location.reload();
    } catch (err) {
      console.error("OTP Verification Error:", err);
      setError("Invalid or expired OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative w-full overflow-hidden flex items-center justify-center font-sans selection:bg-rose-200 selection:text-rose-900">

      {/* 1. BACKGROUND LAYER - Slightly Different Visual for Variety */}
      <div className="absolute inset-0 z-0">
        <motion.img
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          src="https://i.pinimg.com/1200x/b3/7d/06/b37d064ae1b1e6a907cfe9c2580edab2.jpg"
          alt="Background"
          className="w-full h-full object-cover"
        />
        {/* Cinematic Overlay - Darker for readability */}
        <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-[2px]" />

        {/* Animated Gradient Orbs */}
        <motion.div
          animate={{
            x: [0, -40, 0],
            y: [0, 40, 0],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] bg-sky-500/20 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{
            x: [0, 40, 0],
            y: [0, -40, 0],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-rose-400/20 rounded-full blur-[120px]"
        />
      </div>

      {/* 2. GLASS CARD CONTAINER */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, type: "spring", bounce: 0.3 }}
        className="relative z-10 w-full max-w-[500px] mx-4"
      >
        <div className="backdrop-blur-2xl bg-white/10 border border-white/20 shadow-2xl rounded-[32px] overflow-hidden p-8 md:p-12 relative group">

          {/* Subtle Shine Effect */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-serif text-white mb-3 tracking-tight">
              {signupStep === 'form' ? "Join the Circle" : "Verify Email"}
            </h1>
            <p className="text-white/60 font-light text-lg">
              {signupStep === 'form' ? "Unlock exclusive benefits and curated routines." : `Enter the code sent to ${formData.email}`}
            </p>
          </div>

          {error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 bg-red-500/20 border border-red-500/30 text-rose-100 px-4 py-3 rounded-xl flex items-center gap-3 text-sm backdrop-blur-md">
              <AlertCircle className="w-4 h-4 text-rose-300" /> {error}
            </motion.div>
          )}

          <AnimatePresence mode="wait">

            {/* STEP 1: FORM */}
            {signupStep === 'form' && (
              <motion.form
                key="form"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleSignup}
                className="space-y-5"
              >

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-white/50 ml-1">Full Name</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-white transition-colors" />
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Jane Doe"
                      className="w-full bg-black/20 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-white/20 outline-none focus:bg-black/30 focus:border-white/30 transition-all font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-white/50 ml-1">Email Address</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-white transition-colors" />
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="name@example.com"
                      className="w-full bg-black/20 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-white/20 outline-none focus:bg-black/30 focus:border-white/30 transition-all font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-white/50 ml-1">Password</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-white transition-colors" />
                    <input
                      type="password"
                      required
                      minLength={8}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="Min 8 characters"
                      className="w-full bg-black/20 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-white/20 outline-none focus:bg-black/30 focus:border-white/30 transition-all font-medium font-sans"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-14 bg-white text-stone-900 border-0 rounded-xl hover:bg-stone-100 font-bold text-lg tracking-wide hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-black/10 flex items-center justify-center gap-2 group/btn mt-4"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-stone-900/30 border-t-stone-900 rounded-full animate-spin" />
                  ) : (
                    <>Create Account <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" /></>
                  )}
                </Button>

                <div className="relative py-2 mt-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/10"></div>
                  </div>
                  <div className="relative flex justify-center text-[10px] uppercase tracking-widest">
                    <span className="bg-transparent px-2 text-white/40 font-bold">Or Join With</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleGoogleLogin()}
                  className="w-full h-12 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl flex items-center justify-center gap-3 text-white font-medium transition-all group/google"
                >
                  <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5 grayscale group-hover/google:grayscale-0 transition-all duration-300" />
                  <span>Google Account</span>
                </button>

                <div className="mt-6 text-center text-sm text-white/50">
                  Already a member? <Link to="/login" className="text-white font-bold hover:underline decoration-white/50 underline-offset-4">Sign In</Link>
                </div>
              </motion.form>
            )}

            {/* STEP 2: OTP */}
            {signupStep === 'otp' && (
              <motion.form
                key="otp"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={handleVerifyOtp}
                className="space-y-6 pt-4"
              >

                <div className="space-y-2">
                  <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center animate-pulse">
                      <Mail className="w-10 h-10 text-white" />
                    </div>
                  </div>

                  <label className="text-xs font-bold uppercase tracking-widest text-white/50 block text-center mb-2">Verification Code</label>
                  <div className="relative group max-w-[300px] mx-auto">
                    <Hash className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-white transition-colors" />
                    <input
                      type="text"
                      required
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      placeholder="• • • • • •"
                      className="w-full bg-black/20 border border-white/10 rounded-xl py-4 pl-14 pr-4 text-white placeholder:text-white/20 outline-none focus:bg-black/30 focus:border-white/30 transition-all font-mono text-2xl tracking-[0.2em] text-center"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-14 bg-white text-stone-900 border-0 rounded-xl hover:bg-stone-100 font-bold text-lg tracking-wide hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-black/10 flex items-center justify-center gap-2 group/btn"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-stone-900/30 border-t-stone-900 rounded-full animate-spin" />
                  ) : (
                    <>Verify & Join <Check className="w-5 h-5" /></>
                  )}
                </Button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setSignupStep('form')}
                    className="text-white/50 text-sm hover:text-white flex items-center justify-center gap-2 mx-auto transition-colors"
                  >
                    <ArrowLeft className="w-3 h-3" /> Back to Email
                  </button>
                </div>
              </motion.form>
            )}

          </AnimatePresence>

        </div>
      </motion.div>

      <div className="absolute bottom-6 text-white/30 text-xs tracking-wider font-light z-10 selection:bg-transparent">
        © 2026 SkinGlow Inc. All Rights Reserved.
      </div>
    </div>
  );
}

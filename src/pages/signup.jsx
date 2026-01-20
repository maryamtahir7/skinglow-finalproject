// src/pages/signup.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signup, login } from "../backend/auth";
import { useUser } from "../context/UserContext";
import { Button } from "@/components/ui/button";
import { Sparkles, User, Mail, Lock, AlertCircle, ShieldCheck, Truck } from "lucide-react";

export default function SignupForm() {
  const navigate = useNavigate();
  const { setUser } = useUser();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // 1. Create Account
      await signup(formData.email, formData.password, formData.name);

      // 2. Auto-login
      const user = await login(formData.email, formData.password);
      setUser(user);
      navigate("/");
    } catch (err) {
      console.error("Signup Error:", err);
      if (err.code === 409) {
        setError("An account with this email already exists.");
      } else if (err.message?.toLowerCase().includes("rate limit")) {
        setError("Too many attempts. Please wait a moment.");
      } else {
        setError(err.message || "Failed to create account. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex font-sans">

      {/* Right Side - Brand / Visuals */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary/5 relative overflow-hidden flex-col justify-between p-12 text-primary order-2">
        <div className="absolute inset-0 bg-gradient-to-br from-rose-50 to-sage-50 opacity-50" />

        {/* Abstract shapes */}
        <div className="absolute top-24 right-24 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-12 left-12 w-64 h-64 bg-orange-100 rounded-full blur-3xl opacity-50"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-foreground">SkinGlow</span>
          </div>

          <h1 className="text-4xl font-bold leading-tight mb-6 text-foreground">
            Join the Glow <br /> Revolution.
          </h1>
          <p className="text-muted-foreground text-lg max-w-md mb-8">
            Create an account to unlock personalized routines, member-only drops, and track your skincare journey.
          </p>

          <div className="grid grid-cols-1 gap-6">
            <div className="bg-white/60 backdrop-blur-sm p-4 rounded-xl border border-primary/10 flex items-start gap-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <ShieldCheck className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h4 className="font-bold text-lg mb-1 text-foreground">Clean & Ethical</h4>
                <p className="text-sm text-muted-foreground">100% Vegan, Cruelty-free, and transparent sourcing.</p>
              </div>
            </div>
            <div className="bg-white/60 backdrop-blur-sm p-4 rounded-xl border border-primary/10 flex items-start gap-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Truck className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h4 className="font-bold text-lg mb-1 text-foreground">Priority Shipping</h4>
                <p className="text-sm text-muted-foreground">Free express delivery on your first order.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-xs text-muted-foreground mt-12">
          © 2026 SkinGlow. All rights reserved.
        </div>
      </div>

      {/* Left Side - Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 lg:p-12 relative order-1">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <div className="lg:hidden flex justify-center mb-6">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                <Sparkles className="w-7 h-7" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-foreground">Create Account</h2>
            <p className="text-muted-foreground mt-2">Enter your details to get started.</p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm flex items-center gap-2 border border-red-100 animate-in fade-in slide-in-from-top-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground ml-1">Full Name</label>
              <div className="relative group">
                <User className="w-5 h-5 text-muted-foreground absolute left-4 top-3.5 group-focus-within:text-primary transition-colors" />
                <input
                  type="text"
                  placeholder="Jane Doe"
                  className="w-full pl-12 pr-4 py-3.5 bg-secondary/30 border border-border rounded-xl text-foreground outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground ml-1">Email</label>
              <div className="relative group">
                <Mail className="w-5 h-5 text-muted-foreground absolute left-4 top-3.5 group-focus-within:text-primary transition-colors" />
                <input
                  type="email"
                  placeholder="name@example.com"
                  className="w-full pl-12 pr-4 py-3.5 bg-secondary/30 border border-border rounded-xl text-foreground outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground ml-1">Password</label>
              <div className="relative group">
                <Lock className="w-5 h-5 text-muted-foreground absolute left-4 top-3.5 group-focus-within:text-primary transition-colors" />
                <input
                  type="password"
                  placeholder="Create a strong password (min 8 chars)"
                  className="w-full pl-12 pr-4 py-3.5 bg-secondary/30 border border-border rounded-xl text-foreground outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  minLength={8}
                />
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary/90 h-12 rounded-xl text-white font-bold text-base shadow-lg shadow-primary/25 transition-all hover:scale-[1.02]">
              {loading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>

          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground font-medium">Or join with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center px-4 py-2.5 border border-border rounded-xl hover:bg-secondary/50 transition font-medium text-muted-foreground text-sm gap-2">
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
              Google
            </button>
            <button className="flex items-center justify-center px-4 py-2.5 border border-border rounded-xl hover:bg-secondary/50 transition font-medium text-muted-foreground text-sm gap-2">
              <img src="https://www.svgrepo.com/show/448224/facebook.svg" alt="Facebook" className="w-5 h-5" />
              Facebook
            </button>
          </div>

          <div className="text-center mt-6">
            <p className="text-muted-foreground text-sm">
              Already have an account?{" "}
              <Link to="/login" className="text-primary font-bold hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// src/pages/login.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { login, loginWithGoogle } from "../backend/auth";
import { useUser } from "../context/UserContext";
import { Button } from "@/components/ui/button";
import { Sparkles, Mail, Lock, AlertCircle, CheckCircle2 } from "lucide-react";

export default function LoginForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useUser();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

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
    setSuccess(""); // Clear success message on submit

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
    <div className="min-h-screen bg-background flex font-sans">

      {/* Left Side - Brand / Visuals (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary/5 relative overflow-hidden flex-col justify-between p-12 text-primary">
        <div className="absolute inset-0 bg-gradient-to-br from-rose-50 to-sage-50 opacity-50" />

        {/* Abstract shapes */}
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 w-[500px] h-[500px] bg-orange-100 rounded-full blur-3xl opacity-40 -translate-x-1/2 -translate-y-1/2"></div>

        {/* Content */}
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-foreground">SkinGlow</span>
          </div>

          <h1 className="text-5xl font-bold leading-tight mb-6 text-foreground">
            Your Glow, <br /> Our Priority.
          </h1>
          <p className="text-muted-foreground text-lg max-w-md">
            Access your personalized routine, track orders, and discover new favorites—all in one place.
          </p>
        </div>

        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-primary" />
            <span className="font-medium text-foreground">Vegan & Cruelty-Free</span>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-primary" />
            <span className="font-medium text-foreground">Dermatologist Tested</span>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-primary" />
            <span className="font-medium text-foreground">Sustainable Packaging</span>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 lg:p-12 relative">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <div className="lg:hidden flex justify-center mb-6">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                <Sparkles className="w-7 h-7" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-foreground">Welcome Back</h2>
            <p className="text-muted-foreground mt-2">Please enter your details to sign in.</p>
          </div>

          {success && (
            <div className="bg-green-50 text-green-600 p-4 rounded-xl text-sm flex items-center gap-2 border border-green-100 animate-in fade-in slide-in-from-top-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> {success}
            </div>
          )}

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm flex items-center gap-2 border border-red-100 animate-in fade-in slide-in-from-top-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground ml-1">Email</label>
              <div className="relative group">
                <Mail className="w-5 h-5 text-muted-foreground absolute left-4 top-3.5 group-focus-within:text-primary transition-colors" />
                <input
                  type="email"
                  placeholder="name@example.com"
                  className="w-full pl-12 pr-4 py-3.5 bg-secondary/30 border border-border rounded-xl text-foreground outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    setSuccess(""); // Clear success message when typing
                  }}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-sm font-semibold text-foreground">Password</label>
                <a href="#" className="text-xs font-semibold text-primary hover:underline">Forgot password?</a>
              </div>
              <div className="relative group">
                <Lock className="w-5 h-5 text-muted-foreground absolute left-4 top-3.5 group-focus-within:text-primary transition-colors" />
                <input
                  type="password"
                  placeholder="Enter your password"
                  className="w-full pl-12 pr-4 py-3.5 bg-secondary/30 border border-border rounded-xl text-foreground outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary/90 h-12 rounded-xl text-white font-bold text-base shadow-lg shadow-primary/25 transition-all hover:scale-[1.02]">
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground font-medium">Or continue with</span>
            </div>
          </div>

          <button
            onClick={async () => {
              try {
                await loginWithGoogle();
                // After successful OAuth, Appwrite will redirect to successRedirect
                // The user will be automatically logged in
              } catch (err) {
                console.error("Google login error:", err);
                setError("Failed to sign in with Google. Please try again.");
              }
            }}
            className="w-full flex items-center justify-center px-4 py-2.5 border border-border rounded-xl hover:bg-secondary/50 transition font-medium text-muted-foreground text-sm gap-2"
          >
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
            Continue with Google
          </button>

          <div className="text-center mt-6">
            <p className="text-muted-foreground text-sm">
              Don't have an account?{" "}
              <Link to="/signup" className="text-primary font-bold hover:underline">
                Create free account
              </Link>
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}

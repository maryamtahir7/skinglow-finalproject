// src/pages/ResetPasswordPage.jsx
import React, { useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { confirmPasswordReset } from "../backend/auth";
import { Button } from "@/components/ui/button";
import { Lock, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function ResetPasswordPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const userId = searchParams.get("userId");
    const secret = searchParams.get("secret");

    const [password, setPassword] = useState("");
    const [passwordAgain, setPasswordAgain] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== passwordAgain) {
            setError("Passwords do not match.");
            return;
        }
        if (password.length < 8) {
            setError("Password must be at least 8 characters.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            await confirmPasswordReset(userId, secret, password, passwordAgain);
            setSuccess(true);
            setTimeout(() => navigate('/login'), 3000);
        } catch (err) {
            console.error(err);
            setError("Failed to reset password. Link may be expired.");
        } finally {
            setLoading(false);
        }
    };

    if (!userId || !secret) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-stone-900 text-white">
                <p>Invalid link. Please request a new password reset.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen relative w-full overflow-hidden flex items-center justify-center font-sans selection:bg-rose-200 selection:text-rose-900">
            <div className="absolute inset-0 z-0">
                <motion.img
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 1.5 }}
                    src="https://i.pinimg.com/1200x/24/c6/4d/24c64df4196ec4b66ab96e1b871e29c6.jpg"
                    alt="Background"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />
            </div>

            <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="relative z-10 w-full max-w-[480px] mx-4"
            >
                <div className="backdrop-blur-2xl bg-white/10 border border-white/20 shadow-2xl rounded-[32px] overflow-hidden p-8 md:p-12">

                    <div className="mb-8 text-center">
                        <h1 className="text-3xl font-serif text-white mb-2">New Password</h1>
                        <p className="text-white/60 text-sm">Secure your account with a fresh start.</p>
                    </div>

                    {success ? (
                        <div className="text-center space-y-6">
                            <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto border border-emerald-500/30">
                                <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                            </div>
                            <p className="text-white text-lg">Password Updated!</p>
                            <p className="text-white/60 text-sm">Redirecting to login...</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && (
                                <div className="bg-red-500/20 border border-red-500/30 text-rose-100 px-4 py-3 rounded-xl flex items-center gap-3 text-sm">
                                    <AlertCircle className="w-4 h-4" /> {error}
                                </div>
                            )}

                            <div className="space-y-4">
                                <div className="relative group text-left">
                                    <label className="text-xs font-bold uppercase tracking-widest text-white/50 ml-1 mb-2 block">New Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-white transition-colors" />
                                        <input
                                            type="password"
                                            required
                                            minLength={8}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="Min 8 chars"
                                            className="w-full bg-black/20 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-white/20 outline-none focus:bg-black/30 focus:border-white/30 transition-all font-medium"
                                        />
                                    </div>
                                </div>

                                <div className="relative group text-left">
                                    <label className="text-xs font-bold uppercase tracking-widest text-white/50 ml-1 mb-2 block">Confirm Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-white transition-colors" />
                                        <input
                                            type="password"
                                            required
                                            minLength={8}
                                            value={passwordAgain}
                                            onChange={(e) => setPasswordAgain(e.target.value)}
                                            placeholder="Min 8 chars"
                                            className="w-full bg-black/20 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-white/20 outline-none focus:bg-black/30 focus:border-white/30 transition-all font-medium"
                                        />
                                    </div>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full h-14 bg-white text-stone-900 border-0 rounded-xl hover:bg-stone-100 font-bold text-lg tracking-wide shadow-xl active:scale-[0.98] transition-all"
                            >
                                {loading ? "Updating..." : "Set New Password"}
                            </Button>
                        </form>
                    )}
                </div>
            </motion.div>
        </div>
    );
}

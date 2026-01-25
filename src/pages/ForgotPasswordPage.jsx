// src/pages/ForgotPasswordPage.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { sendPasswordReset } from "../backend/auth";
import { Button } from "@/components/ui/button";
import { Mail, CheckCircle2, ArrowLeft, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess(false);

        try {
            await sendPasswordReset(email);
            setSuccess(true);
        } catch (err) {
            console.error(err);
            setError("Failed to send reset link. Please verify your email.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen relative w-full overflow-hidden flex items-center justify-center font-sans selection:bg-rose-200 selection:text-rose-900">
            {/* Background (Consistent with Login) */}
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
                <div className="backdrop-blur-2xl bg-white/10 border border-white/20 shadow-2xl rounded-[32px] overflow-hidden p-8 md:p-12 text-center">

                    <div className="mb-8">
                        <h1 className="text-3xl font-serif text-white mb-2">Reset Password</h1>
                        <p className="text-white/60 text-sm">Enter your email to receive recovery instructions.</p>
                    </div>

                    {success ? (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                            <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto border border-emerald-500/30">
                                <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                            </div>
                            <p className="text-white text-lg">Check your inbox!</p>
                            <p className="text-white/60 text-sm">We've sent a password reset link to <strong>{email}</strong>.</p>
                            <Button asChild className="w-full h-12 bg-white text-stone-900 hover:bg-stone-100 rounded-xl font-bold">
                                <Link to="/login">Back to Login</Link>
                            </Button>
                        </motion.div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && (
                                <div className="bg-red-500/20 border border-red-500/30 text-rose-100 px-4 py-3 rounded-xl flex items-center gap-3 text-sm">
                                    <AlertCircle className="w-4 h-4" /> {error}
                                </div>
                            )}

                            <div className="relative group text-left">
                                <label className="text-xs font-bold uppercase tracking-widest text-white/50 ml-1 mb-2 block">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-white transition-colors" />
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="name@example.com"
                                        className="w-full bg-black/20 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-white/20 outline-none focus:bg-black/30 focus:border-white/30 transition-all font-medium"
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full h-14 bg-white text-stone-900 border-0 rounded-xl hover:bg-stone-100 font-bold text-lg tracking-wide shadow-xl active:scale-[0.98] transition-all"
                            >
                                {loading ? "Sending..." : "Send Reset Link"}
                            </Button>

                            <Link to="/login" className="flex items-center justify-center gap-2 text-white/50 text-sm hover:text-white transition-colors">
                                <ArrowLeft className="w-4 h-4" /> Back to Login
                            </Link>
                        </form>
                    )}
                </div>
            </motion.div>
        </div>
    );
}

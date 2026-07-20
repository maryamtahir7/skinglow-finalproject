import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { Loader2, ShieldAlert } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminRoute() {
  const { user, loading: userLoading } = useUser();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (!userLoading) {
      // Check if user exists and has the ADMIN role
      if (user && user.role === 'ADMIN') {
        setIsAuthorized(true);
      } else {
        if (user) {
          console.warn(`Unauthorized admin access attempt by: ${user.email}`);
        }
        setIsAuthorized(false);
      }
      setIsChecking(false);
    }
  }, [user, userLoading]);

  // Premium loading state while verifying admin status
  if (userLoading || isChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 font-sans">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" />
            <div className="w-16 h-16 bg-white border border-slate-100 shadow-xl rounded-2xl flex items-center justify-center relative z-10">
              <ShieldAlert className="w-8 h-8 text-primary animate-pulse" />
            </div>
          </div>
          <p className="text-sm font-semibold text-slate-500 uppercase tracking-widest animate-pulse">Verifying Access</p>
        </motion.div>
      </div>
    );
  }

  // Redirect to home if unauthorized
  return isAuthorized ? <Outlet /> : <Navigate to="/" replace />;
}

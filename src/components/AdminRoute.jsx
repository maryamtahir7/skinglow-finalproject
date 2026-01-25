
import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { getCurrentUser } from "../backend/auth.js";
import { Loader2 } from "lucide-react";

export default function AdminRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    async function checkUser() {
      const user = await getCurrentUser();
      console.log("Current user:", user);
      // Only allow skin.glow.skincare.pk@gmail.com to access admin page
      if (user && user.email === "skin.glow.skincare.pk@gmail.com") {
        setIsAdmin(true);
      } else {
        // Log unauthorized access attempt
        if (user) {
          console.warn(`Unauthorized admin access attempt by: ${user.email}`);
        }
        setIsAdmin(false);
      }
      setLoading(false);
    }
    checkUser();
  }, []);

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-200">
      <Loader2 className="animate-spin w-10 h-10 text-indigo-600" />
    </div>
  )

  return isAdmin ? <Outlet /> : <Navigate to="/" replace />;
}

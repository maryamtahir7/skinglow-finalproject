
import React, { useEffect, useState } from "react";
import { Navigate,Outlet } from "react-router-dom";
import { getCurrentUser } from "../backend/auth.js";
import { Loader2 } from "lucide-react";

export default function AdminRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    async function checkUser() {
      const user = await getCurrentUser();
      console.log("Current user:", user);
      if (user && (user.email === "admin@gmail.com" || user.email === "maryamtahir1262@gmail.com" || user.email === "maryamtahir236@gmail.com")) {
        setIsAdmin(true);
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

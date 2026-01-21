import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User as UserIcon, Mail, Phone, Calendar, MapPin, Sparkles } from "lucide-react";

export default function UserProfilePage() {
  const navigate = useNavigate();
  const { user, loading } = useUser();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [loading, user, navigate]);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex items-center gap-2 text-primary font-medium">
          <UserIcon className="w-5 h-5 animate-spin" /> Loading your profile...
        </div>
      </div>
    );
  }

  const firstLetter = (user.name || user.email || "U").charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 md:px-6 font-sans">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xl font-bold">
            {firstLetter}
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
              My Profile
            </h1>
            <p className="text-sm text-slate-500">
              View your account details and quick links.
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="md:col-span-2 border-border">
            <CardHeader>
              <CardTitle className="text-base">Account Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <UserIcon className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Name</p>
                  <p className="font-medium text-slate-900">
                    {user.name || "Not set"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Email</p>
                  <p className="font-medium text-slate-900">{user.email}</p>
                </div>
              </div>

              {user.phone && (
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Phone</p>
                    <p className="font-medium text-slate-900">{user.phone}</p>
                  </div>
                </div>
              )}

              {user.$createdAt && (
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Member since</p>
                    <p className="font-medium text-slate-900">
                      {new Date(user.$createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-base">Quick Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <Button
                variant="default"
                className="w-full justify-start gap-2 bg-primary text-white hover:bg-primary/90"
                onClick={() => navigate("/ai-chat")}
              >
                <Sparkles className="w-4 h-4" /> AI Skin Expert
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start gap-2"
                onClick={() => navigate("/orders")}
              >
                <MapPin className="w-4 h-4" /> My Orders
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start gap-2"
                onClick={() => navigate("/wishlist")}
              >
                ❤️ Wishlist
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start gap-2"
                onClick={() => navigate("/cart")}
              >
                🛒 Cart
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}



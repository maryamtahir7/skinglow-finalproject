import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { updateUserPrefs } from "../backend/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User as UserIcon, Mail, Phone, Calendar, MapPin, Sparkles, Edit2, Check, X } from "lucide-react";

export default function UserProfilePage() {
  const navigate = useNavigate();


  const { user, loading, setUser } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    phone: "",
    address: "",
    city: "",
    postalCode: ""
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    } else if (user) {
      setFormData({
        phone: user.prefs?.phone || "",
        address: user.prefs?.address || "",
        city: user.prefs?.city || "",
        postalCode: user.prefs?.postalCode || ""
      });
    }
  }, [loading, user, navigate]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const updatedUser = await updateUserPrefs(formData);
      // Update local user context if possible, or just the state locally.
      // Since updateUserPrefs returns the user object (or we re-fetch), we might need to update context.
      // Appwrite's updatePrefs returns the User object.
      setUser(updatedUser);
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to save profile:", err);
      alert("Failed to save changes. Please try again.");
    } finally {
      setSaving(false);
    }
  };

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

          <Card className="md:col-span-2 border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-base">Personal Details</CardTitle>
              {!isEditing ? (
                <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)} className="h-8 gap-2 text-primary">
                  <Edit2 className="w-4 h-4" /> Edit
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)} disabled={saving} className="h-8 gap-1 text-muted-foreground">
                    <X className="w-4 h-4" /> Cancel
                  </Button>
                  <Button variant="default" size="sm" onClick={handleSave} disabled={saving} className="h-8 gap-1 bg-primary text-white">
                    {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Check className="w-4 h-4" />} Save
                  </Button>
                </div>
              )}
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Phone Number</label>
                  {isEditing ? (
                    <input
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                      placeholder="+1234567890"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  ) : (
                    <p className="font-medium text-slate-900 bg-slate-50 px-3 py-2 rounded-lg border border-transparent">
                      {user.prefs?.phone || <span className="text-slate-400 italic">Not set</span>}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">City</label>
                  {isEditing ? (
                    <input
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                      placeholder="New York"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    />
                  ) : (
                    <p className="font-medium text-slate-900 bg-slate-50 px-3 py-2 rounded-lg border border-transparent">
                      {user.prefs?.city || <span className="text-slate-400 italic">Not set</span>}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Address</label>
                  {isEditing ? (
                    <input
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                      placeholder="123 Street Name, Apt 4B"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    />
                  ) : (
                    <p className="font-medium text-slate-900 bg-slate-50 px-3 py-2 rounded-lg border border-transparent">
                      {user.prefs?.address || <span className="text-slate-400 italic">Not set</span>}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Postal Code</label>
                  {isEditing ? (
                    <input
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                      placeholder="10001"
                      value={formData.postalCode}
                      onChange={(e) => setFormData({ ...formData, postalCode: e.target.value.replace(/[^0-9]/g, '') })}
                    />
                  ) : (
                    <p className="font-medium text-slate-900 bg-slate-50 px-3 py-2 rounded-lg border border-transparent">
                      {user.prefs?.postalCode || <span className="text-slate-400 italic">Not set</span>}
                    </p>
                  )}
                </div>
              </div>
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



// src/pages/CheckoutPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import {
  getCart,
  getProductsByIds,
  clearCart,
  createOrder,
} from "../backend/database";
import {
  Banknote,
  ShieldCheck,
  Lock,
  MapPin,
  CheckCircle,
  ShoppingBag
} from "lucide-react";
import { Button } from "@/components/ui/button";

// --- MAIN PAGE ---
export default function CheckoutPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useUser();

  const buyNow = location.state?.buyNow || null;
  const [cartDocs, setCartDocs] = useState([]);
  const [productsMap, setProductsMap] = useState({});
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    notes: "",
    paymentMethod: "COD",
  });

  // Load cart or buyNow
  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    if (user.prefs) {
      setForm(prev => ({
        ...prev,
        phone: user.prefs.phone ? String(user.prefs.phone).replace(/[^0-9]/g, '') : prev.phone,
        address: user.prefs.address || prev.address,
        city: user.prefs.city || prev.city,
        postalCode: user.prefs.postalCode || prev.postalCode
      }));
    }
    (async () => {
      try {
        if (buyNow) {
          setCartDocs([]);
          setProductsMap({ [buyNow.product.$id]: buyNow.product });
        } else {
          const cart = await getCart(user.$id);
          setCartDocs(cart.documents || []);
          const ids = (cart.documents || []).map((c) => c.productId);
          if (ids.length > 0) {
            const products = await getProductsByIds(ids);
            const map = {};
            (products.documents || []).forEach((p) => { map[p.$id] = p; });
            setProductsMap(map);
          }
        }
      } catch (err) { console.error("Checkout load error:", err); }
      finally { setLoading(false); }
    })();
  }, [user, buyNow, navigate]);

  const summaryItems = useMemo(() => {
    if (buyNow) {
      const p = buyNow.product;
      return [{ productId: p.$id, name: p.name, price: Number(p.price), qty: Number(buyNow.quantity), imageUrl: p.imageUrl }];
    }
    return (cartDocs || []).map((c) => {
      const p = productsMap[c.productId];
      if (!p) return null;
      return { productId: p.$id, name: p.name, price: Number(p.price), qty: Number(c.quantity), imageUrl: p.imageUrl };
    }).filter(Boolean);
  }, [buyNow, cartDocs, productsMap]);

  const total = useMemo(() => summaryItems.reduce((sum, it) => sum + it.price * it.qty, 0), [summaryItems]);
  const tax = total * 0.05;
  const finalTotal = total + tax;

  const handleOrderPlacement = async (transactionId = null) => {
    if (!summaryItems.length || !form.name || !form.phone || !form.address) {
      alert("Please fill all fields.");
      return;
    }

    // Auth Check
    const { getCurrentUser } = await import("../backend/auth");
    const currentUser = await getCurrentUser();
    if (!currentUser || !currentUser.email) {
      alert("Unable to verify user email.");
      return;
    }

    // Validate integers
    const cleanPhone = String(form.phone).replace(/[^0-9]/g, '');
    const phoneInt = parseInt(cleanPhone, 10);
    const cleanPostal = String(form.postalCode).replace(/[^0-9]/g, '');
    const postalInt = parseInt(cleanPostal, 10);

    if (isNaN(phoneInt)) {
      alert("Please enter a valid numeric phone number.");
      return;
    }
    if (isNaN(postalInt)) {
      alert("Please enter a valid numeric postal code.");
      return;
    }

    try {
      await createOrder({
        userId: user.$id,
        email: currentUser.email,
        items: summaryItems,
        total: Math.round(finalTotal),
        ...form,
        phone: phoneInt,
        postalCode: postalInt,
        status: transactionId ? "paid" : "pending",
        transactionId: transactionId || ""
      });

      if (!buyNow) await clearCart(user.$id);
      alert("Order placed successfully!");
      navigate("/");
    } catch (err) {
      console.error("Order failed:", err);
      alert(`Failed: ${err.message}`);
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    handleOrderPlacement();
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center font-bold text-primary">Loading Secure Checkout...</div>;

  return (
    <div className="min-h-screen bg-background py-10 px-6 font-sans text-foreground">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Lock className="w-6 h-6 text-primary" />
          <h1 className="text-3xl font-bold text-foreground">Secure Checkout</h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">

            {/* 1. SHIPPING FORM */}
            <div className="bg-card rounded-3xl shadow-sm border border-border p-8">
              <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" /> Shipping Details
              </h2>
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-muted-foreground">Full Name</label>
                  <input required className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:border-primary outline-none" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Jane Doe" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-muted-foreground">Phone</label>
                  <input
                    required
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:border-primary outline-none"
                    value={form.phone}
                    onChange={e => {
                      const val = e.target.value.replace(/[^0-9]/g, '');
                      setForm({ ...form, phone: val });
                    }}
                    placeholder="03001234567"
                  />
                </div>
                <div className="sm:col-span-2 space-y-2">
                  <label className="text-sm font-semibold text-muted-foreground">Address</label>
                  <input required className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:border-primary outline-none" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} placeholder="123 Glow Avenue" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-muted-foreground">City</label>
                  <input required className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:border-primary outline-none" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} placeholder="Lahore" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-muted-foreground">Postal Code</label>
                  <input
                    required
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:border-primary outline-none"
                    value={form.postalCode}
                    onChange={e => {
                      const val = e.target.value.replace(/[^0-9]/g, '');
                      setForm({ ...form, postalCode: val });
                    }}
                    placeholder="54000"
                  />
                </div>
                <div className="sm:col-span-2 space-y-2">
                  <label className="text-sm font-semibold text-muted-foreground">Notes</label>
                  <input className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:border-primary outline-none" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Optional delivery instructions" />
                </div>
              </div>
            </div>

            {/* 2. PAYMENT METHOD SELECTION */}
            <div className="bg-card rounded-3xl shadow-sm border border-border p-8">
              <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                <Banknote className="w-5 h-5 text-primary" /> Payment
              </h2>
              <div className="border rounded-2xl p-5 bg-primary/5 border-primary/20 flex items-center gap-4">
                <div className="bg-background p-2.5 rounded-xl border border-border">
                  <Banknote className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="font-bold text-foreground">Cash on Delivery</div>
                  <div className="text-xs text-muted-foreground">Online payment will be added in a future update.</div>
                </div>
                <CheckCircle className="w-5 h-5 text-primary" />
              </div>

              <div className="mt-8 pt-8 border-t border-border">
                <Button onClick={onSubmit} className="w-full bg-primary hover:bg-primary/90 text-white font-bold h-14 rounded-2xl text-lg shadow-xl shadow-primary/20">
                  <CheckCircle className="w-5 h-5 mr-2" /> Place Order (COD)
                </Button>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="h-fit space-y-6">
            <div className="bg-card rounded-3xl shadow-sm border border-border p-6">
              <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-primary" /> Order Summary
              </h2>
              <div className="space-y-4 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                {summaryItems.map((item) => (
                  <div key={item.productId} className="flex gap-4 items-start border-b border-border last:border-0 pb-4 last:pb-0">
                    <div className="bg-background rounded-lg p-1 w-16 h-16 flex-shrink-0 border border-border">
                      <img src={item.imageUrl} alt="" className="w-full h-full object-contain" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-foreground line-clamp-2 text-sm">{item.name}</div>
                      <div className="text-xs text-muted-foreground mt-1">Qty: {item.qty}</div>
                    </div>
                    <div className="font-bold text-foreground text-sm">Rs. {(item.price * item.qty).toFixed(2)}</div>
                  </div>
                ))}
              </div>

              <div className="border-t border-border mt-6 pt-4 space-y-3">
                <div className="flex justify-between text-muted-foreground text-sm">
                  <span>Items Total</span>
                  <span>Rs. {total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground text-sm">
                  <span>Tax (5%)</span>
                  <span>Rs. {tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground text-sm">
                  <span>Delivery</span>
                  <span className="text-primary font-bold">Free</span>
                </div>
                <div className="border-t border-dashed border-border pt-3 flex justify-between items-center">
                  <span className="font-bold text-lg text-foreground">Total Pay</span>
                  <span className="font-bold text-2xl text-primary">Rs. {finalTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-secondary/30 text-foreground p-4 rounded-xl text-xs font-semibold border border-primary/10">
              <ShieldCheck className="w-8 h-8 flex-shrink-0 text-primary" />
              We ensure all your skincare essentials are packed safely and delivered with hygiene standards.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

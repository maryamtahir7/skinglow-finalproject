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
  CreditCard,
  Banknote,
  Truck,
  ShieldCheck,
  Lock,
  MapPin,
  User,
  CheckCircle,
  ShoppingBag
} from "lucide-react";
import { Button } from "@/components/ui/button";

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
    if (!user) {
      navigate("/login");
      return;
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
            (products.documents || []).forEach((p) => {
              map[p.$id] = p;
            });
            setProductsMap(map);
          }
        }
      } catch (err) {
        console.error("Checkout load error:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [user, buyNow, navigate]);

  // Summary logic
  const summaryItems = useMemo(() => {
    if (buyNow) {
      const p = buyNow.product;
      return [
        {
          productId: p.$id,
          name: p.name,
          price: Number(p.price),
          quantity: Number(buyNow.quantity),
          imageUrl: p.imageUrl,
        },
      ];
    }

    return (cartDocs || [])
      .map((c) => {
        const p = productsMap[c.productId];
        if (!p) return null;
        return {
          productId: p.$id,
          name: p.name,
          price: Number(p.price),
          quantity: Number(c.quantity),
          imageUrl: p.imageUrl,
        };
      })
      .filter(Boolean);
  }, [buyNow, cartDocs, productsMap]);

  const total = useMemo(
    () => summaryItems.reduce((sum, it) => sum + it.price * it.quantity, 0),
    [summaryItems]
  );

  const tax = total * 0.05;
  const finalTotal = total + tax;

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!summaryItems.length || !form.name || !form.phone || !form.address) {
      alert("Please fill all fields.");
      return;
    }

    try {
      await createOrder({
        userId: user.$id,
        items: summaryItems,
        total: Math.round(finalTotal),
        ...form,
        status: "PENDING",
      });

      if (!buyNow) {
        await clearCart(user.$id);
      }

      alert("Order placed successfully!");
      navigate("/");
    } catch (err) {
      console.error("Order failed:", err);
      // alert("Failed. Try again.");
      alert(`Failed: ${err.message}`);
    }
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
          {/* Form Section */}
          <form onSubmit={onSubmit} className="lg:col-span-2 space-y-6">

            {/* Shipping Info Card */}
            <div className="bg-card rounded-3xl shadow-sm border border-border p-8">
              <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" /> Shipping Details
              </h2>

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-muted-foreground">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 w-5 h-5 text-muted-foreground/50" />
                    <input
                      required
                      type="text"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-background focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none"
                      placeholder="Jane Doe"
                      value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value.replace(/[^A-Za-z\s]/g, '') })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-muted-foreground">Phone Number</label>
                  <input
                    required
                    type="text"
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none"
                    placeholder="03001234567"
                    value={form.phone}
                    onChange={e => setForm({ ...form, phone: e.target.value.replace(/[^\d+\s-]/g, '') })}
                  />
                </div>
                <div className="sm:col-span-2 space-y-2">
                  <label className="text-sm font-semibold text-muted-foreground">Address</label>
                  <input
                    required
                    type="text"
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none"
                    placeholder="123 Glow Avenue, Suite 101"
                    value={form.address}
                    onChange={e => setForm({ ...form, address: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-muted-foreground">City</label>
                  <input
                    required
                    type="text"
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none"
                    placeholder="Lahore"
                    value={form.city}
                    onChange={e => setForm({ ...form, city: e.target.value.replace(/[^A-Za-z\s]/g, '') })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-muted-foreground">Postal Code</label>
                  <input
                    required
                    type="text"
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none"
                    placeholder="54000"
                    value={form.postalCode}
                    onChange={e => setForm({ ...form, postalCode: e.target.value.replace(/\D/g, '') })}
                  />
                </div>
                <div className="sm:col-span-2 space-y-2">
                  <label className="text-sm font-semibold text-muted-foreground">Delivery Notes (Optional)</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none"
                    placeholder="Leave at front desk..."
                    value={form.notes}
                    onChange={e => setForm({ ...form, notes: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-card rounded-3xl shadow-sm border border-border p-8">
              <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-primary" /> Payment
              </h2>
              <div className="grid sm:grid-cols-1 gap-4">
                <div
                  onClick={() => setForm({ ...form, paymentMethod: "COD" })}
                  className={`border rounded-xl p-4 cursor-pointer transition-all flex items-center gap-4 border-primary bg-primary/5 ring-1 ring-primary`}
                >
                  <div className="bg-background p-2 rounded-lg border border-border"><Banknote className="w-6 h-6 text-primary" /></div>
                  <div>
                    <div className="font-bold text-foreground">Cash on Delivery</div>
                    <div className="text-xs text-muted-foreground">Pay when you receive your order at your doorstep</div>
                  </div>
                  <CheckCircle className="w-5 h-5 text-primary ml-auto" />
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white font-bold h-14 rounded-2xl text-lg shadow-xl shadow-primary/20 transition-transform hover:scale-[1.01]">
              <CheckCircle className="w-5 h-5 mr-2" /> Place Order
            </Button>
          </form>

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
                      <div className="text-xs text-muted-foreground mt-1">Qty: {item.quantity}</div>
                    </div>
                    <div className="font-bold text-foreground text-sm">Rs. {(item.price * item.quantity).toFixed(2)}</div>
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

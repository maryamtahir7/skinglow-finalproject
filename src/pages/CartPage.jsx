// src/pages/CartPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getCart,
  getProductsByIds,
  removeFromCart,
  setCartItemQuantity,
} from "../backend/database";
import { Button } from "@/components/ui/button";
import {
  Trash2,
  Minus,
  Plus,
  ShieldCheck,
  Lock,
  Truck,
  ArrowRight,
  ShoppingBag,
  Sparkles,
  Leaf
} from "lucide-react";
import { useUser } from "../context/UserContext";

export default function CartPage() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [items, setItems] = useState([]);
  const [productsMap, setProductsMap] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    (async () => {
      try {
        const cart = await getCart(user.$id);
        const cartItems = cart.documents || [];
        setItems(cartItems);

        const ids = cartItems.map((c) => String(c.productId));
        if (ids.length > 0) {
          const prods = await getProductsByIds(ids);
          const map = {};
          (prods.documents || []).forEach((p) => {
            map[String(p.$id)] = p;
          });
          setProductsMap(map);
        } else {
          setProductsMap({});
        }
      } catch (err) {
        console.error("Cart load error:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [user, navigate]);

  const subtotal = useMemo(() => {
    return items.reduce((sum, it) => {
      const p = productsMap[String(it.productId)];
      if (!p) return sum;
      return sum + Number(p.price || 0) * Number(it.quantity || 1);
    }, 0);
  }, [items, productsMap]);

  const onQty = async (cartItem, nextQty) => {
    if (nextQty < 1) return;
    try {
      await setCartItemQuantity(cartItem.$id, nextQty);
      setItems((prev) =>
        prev.map((it) =>
          it.$id === cartItem.$id ? { ...it, quantity: nextQty } : it
        )
      );
    } catch (err) {
      console.error("Failed to update quantity:", err);
    }
  };

  const onRemove = async (cartItem) => {
    try {
      await removeFromCart(cartItem.$id);
      setItems((prev) => prev.filter((it) => it.$id !== cartItem.$id));
    } catch (err) {
      console.error("Failed to remove item:", err);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-background text-primary font-bold">Loading Cart...</div>;
  }

  if (!items.length) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6 font-sans">
        <div className="text-center bg-card p-10 rounded-3xl shadow-lg border border-border max-w-md w-full">
          <div className="w-20 h-20 bg-secondary/50 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Your Bag is Empty</h2>
          <p className="text-muted-foreground mb-8">Start your journey to glowing skin today.</p>
          <Button onClick={() => navigate("/products")} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-12 rounded-xl shadow-lg shadow-primary/20">
            Start Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-10 px-6 font-sans text-foreground">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
          <span className="bg-primary/10 p-2 rounded-xl"><ShoppingBag className="w-6 h-6 text-primary" /></span>
          Your Cart
          <span className="text-lg font-normal text-muted-foreground ml-2">({items.length} items)</span>
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Trust Banner */}
            <div className="bg-secondary/30 border border-primary/10 text-primary px-5 py-4 rounded-2xl flex items-center gap-4 text-sm font-medium">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" /> 100% Authentic
              </div>
              <div className="w-px h-4 bg-primary/20"></div>
              <div className="flex items-center gap-2">
                <Leaf className="w-4 h-4" /> Cruelty-Free
              </div>
            </div>

            <div className="bg-card rounded-3xl shadow-sm border border-border overflow-hidden">
              {items.map((it) => {
                const p = productsMap[String(it.productId)];
                if (!p) return null;

                return (
                  <div
                    key={it.$id}
                    className="flex flex-col sm:flex-row items-start sm:items-center gap-6 p-6 border-b border-border last:border-none hover:bg-secondary/10 transition-colors"
                  >
                    <div className="w-24 h-24 bg-white border border-border rounded-2xl p-2 flex-shrink-0 flex items-center justify-center">
                      <img
                        src={p.imageUrl}
                        alt={p.name}
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-bold text-foreground text-lg mb-1">{p.name}</h3>
                          <p className="text-sm text-muted-foreground mb-2">{p.category} • In Stock</p>
                        </div>
                        <button
                          onClick={() => onRemove(it)}
                          className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                          title="Remove"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        <div className="font-mono font-medium text-primary text-xl">Rs. {p.price}</div>

                        <div className="flex items-center border border-border rounded-xl bg-background overflow-hidden">
                          <button
                            onClick={() => onQty(it, Number(it.quantity) - 1)}
                            className="px-3 py-1.5 hover:bg-secondary transition text-muted-foreground"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="px-3 font-semibold text-foreground border-x border-border text-sm min-w-[2rem] text-center">{it.quantity}</span>
                          <button
                            onClick={() => onQty(it, Number(it.quantity) + 1)}
                            className="px-3 py-1.5 hover:bg-secondary transition text-muted-foreground"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Summary Box */}
          <div className="space-y-6">
            <div className="bg-card rounded-3xl shadow-sm border border-border p-8 sticky top-6">
              <h2 className="text-xl font-bold text-foreground mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-muted-foreground text-sm">
                  <span>Subtotal</span>
                  <span className="font-medium text-foreground">Rs. {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground text-sm">
                  <span>Shipping</span>
                  <span className="text-primary font-medium flex items-center gap-1">
                    <Truck className="w-4 h-4" /> Free
                  </span>
                </div>
                <div className="flex justify-between text-muted-foreground text-sm">
                  <span>Tax (Estimated)</span>
                  <span className="font-medium text-foreground">Rs. {(subtotal * 0.05).toFixed(2)}</span>
                </div>
              </div>

              <div className="border-t border-border pt-4 mb-8">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-foreground">Total</span>
                  <span className="text-2xl font-bold text-primary">Rs. {(subtotal + subtotal * 0.05).toFixed(2)}</span>
                </div>
              </div>

              <Button
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-14 rounded-2xl shadow-xl shadow-primary/20 text-lg group transition-all hover:scale-[1.02]"
                onClick={() => navigate("/checkout")}
              >
                Checkout Securely <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>

              <div className="flex items-center justify-center gap-2 mt-6 text-xs text-muted-foreground opacity-70">
                <Lock className="w-3 h-3" /> Secure Transaction
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

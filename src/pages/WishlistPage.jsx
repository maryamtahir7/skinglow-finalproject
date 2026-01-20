// src/pages/WishlistPage.jsx
import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  getWishlist,
  getProductsByIds,
  addToCart,
  removeFromWishlist,
} from "../backend/database";
import { Button } from "@/components/ui/button";
import { HeartOff, ShoppingBag, Heart, Sparkles, ArrowRight } from "lucide-react";
import { useUser } from "../context/UserContext";

export default function WishlistPage() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [items, setItems] = useState([]);
  const [productsMap, setProductsMap] = useState({});
  const [loading, setLoading] = useState(true);

  const loadWishlist = useCallback(async () => {
    if (!user) return;

    try {
      const list = await getWishlist(user.$id);
      setItems(list.documents);

      const ids = list.documents.map((w) => w.productId);
      if (ids.length > 0) {
        const prods = await getProductsByIds(ids);
        const map = {};
        prods.documents.forEach((p) => (map[p.$id] = p));
        setProductsMap(map);
      } else {
        setProductsMap({});
      }
    } catch (e) {
      console.error("Wishlist load error:", e);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    loadWishlist();
  }, [user, navigate, loadWishlist]);

  const moveToCart = async (w) => {
    if (!user) return navigate("/login");

    const p = productsMap[w.productId];
    if (!p) return;

    try {
      await addToCart({ userId: user.$id, productId: p.$id, quantity: 1 });
      await removeFromWishlist(w.$id);
      await loadWishlist();
      alert("Moved to cart"); // Ideally replace with a proper toast later
    } catch (e) {
      console.error("Move to cart failed:", e);
    }
  };

  const removeItem = async (w) => {
    try {
      await removeFromWishlist(w.$id);
      await loadWishlist();
    } catch (e) {
      console.error("Remove wishlist failed:", e);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center font-bold text-primary">Loading Wishlist...</div>;
  }

  if (!items.length) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6 font-sans">
        <div className="text-center bg-card p-10 rounded-3xl shadow-lg border border-border max-w-md w-full">
          <div className="w-20 h-20 bg-secondary/50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Your Wishlist is Empty</h2>
          <p className="text-muted-foreground mb-8">Save your favorite skincare essentials here.</p>
          <Button onClick={() => navigate("/products")} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-12 rounded-xl shadow-lg shadow-primary/20">
            Discover Products
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-10 px-6 font-sans">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-8 flex items-center gap-3">
          <span className="bg-rose-100 dark:bg-rose-900/30 p-2 rounded-xl"><Heart className="w-6 h-6 text-rose-500" /></span>
          My Wishlist
        </h1>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((w) => {
            const p = productsMap[w.productId];
            if (!p) return null;

            return (
              <div key={w.$id} className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden hover:shadow-xl hover:border-primary/20 transition-all duration-300 group">
                <div className="aspect-square bg-secondary/10 p-6 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <img
                    src={p.imageUrl}
                    alt={p.name}
                    className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-500"
                  />
                  {p.category && (
                    <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded-md text-foreground shadow-sm">
                      {p.category}
                    </span>
                  )}
                </div>

                <div className="p-5">
                  <div className="mb-3">
                    <h3 className="font-bold text-foreground text-lg mb-1 line-clamp-1">{p.name}</h3>
                    <div className="font-mono font-medium text-primary">Rs. {p.price}</div>
                  </div>

                  <div className="flex gap-2 pt-4 border-t border-border">
                    <Button
                      className="flex-1 bg-primary hover:bg-primary/90 h-10 rounded-xl text-xs font-bold shadow-md shadow-primary/10"
                      onClick={() => moveToCart(w)}
                    >
                      <ShoppingBag className="w-3 h-3 mr-2" /> Add to Cart
                    </Button>
                    <button
                      onClick={() => removeItem(w)}
                      className="w-10 h-10 flex items-center justify-center bg-secondary hover:bg-red-50 text-muted-foreground hover:text-red-500 rounded-xl transition-colors border border-transparent hover:border-red-100"
                      title="Remove"
                    >
                      <HeartOff className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

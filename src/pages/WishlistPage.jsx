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
import { HeartOff, ShoppingCart } from "lucide-react";
import { useUser } from "../context/UserContext";

export default function WishlistPage() {
  const navigate = useNavigate();
  const { user } = useUser(); // ✅ get logged-in user
  const [items, setItems] = useState([]); // wishlist docs
  const [productsMap, setProductsMap] = useState({});
  const [loading, setLoading] = useState(true);

  // ✅ Reusable fetcher so we can refresh list after actions
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

  // Load on first mount
  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    loadWishlist();
  }, [user, navigate, loadWishlist]);

  // ✅ Move to cart
  const moveToCart = async (w) => {
    if (!user) return navigate("/login");

    const p = productsMap[w.productId];
    if (!p) return;

    try {
      await addToCart({ userId: user.$id, productId: p.$id, quantity: 1 });
      await removeFromWishlist(w.$id);
      await loadWishlist(); // ✅ reload instead of manual filter
      alert("Moved to cart");
    } catch (e) {
      console.error("Move to cart failed:", e);
    }
  };

  // ✅ Remove item
  const removeItem = async (w) => {
    try {
      await removeFromWishlist(w.$id);
      await loadWishlist(); // ✅ reload instead of manual filter
    } catch (e) {
      console.error("Remove wishlist failed:", e);
    }
  };

  if (loading) {
    return <div className="max-w-6xl mx-auto p-6">Loading wishlist…</div>;
  }

  if (!items.length) {
    return (
      <div className="max-w-6xl mx-auto p-6 text-center">
        <h2 className="text-2xl font-semibold mb-2">Your wishlist is empty</h2>
        <Button onClick={() => navigate("/products")} className="mt-2">
          Browse Products
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Wishlist</h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((w) => {
          const p = productsMap[w.productId];
          if (!p) return null;

          return (
            <div key={w.$id} className="bg-white rounded-xl shadow p-4">
              <img
                src={p.imageUrl}
                alt={p.name}
                className="w-full h-48 object-contain mb-3"
              />
              <div className="font-semibold">{p.name}</div>
              <div className="text-sm text-gray-500">{p.category}</div>
              <div className="mt-1 font-medium">Rs. {p.price}</div>

              <div className="mt-4 flex gap-2">
                <Button className="flex-1" onClick={() => moveToCart(w)}>
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Add to Cart
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => removeItem(w)}
                  className="flex items-center justify-center"
                >
                  <HeartOff className="w-4 h-4" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

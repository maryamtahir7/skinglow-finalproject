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
import { Trash2, Minus, Plus } from "lucide-react";
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
            map[String(p.$id)] = p; // ensure key is string
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
    return <div className="max-w-6xl mx-auto p-6">Loading cart…</div>;
  }

  if (!items.length) {
    return (
      <div className="max-w-6xl mx-auto p-6 text-center">
        <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
        <Button onClick={() => navigate("/products")} className="mt-2">
          Shop Products
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow p-4 space-y-4">
          {items.map((it) => {
            const p = productsMap[String(it.productId)];
            if (!p) {
              return (
                <div key={it.$id} className="text-red-500">
                  Product not found (ID: {it.productId})
                </div>
              );
            }

            return (
              <div
                key={it.$id}
                className="flex items-center gap-4 py-4 border-b last:border-none"
              >
                <img
                  src={p.imageUrl}
                  alt={p.name}
                  className="w-20 h-20 object-contain rounded"
                />
                <div className="flex-1">
                  <div className="font-semibold">{p.name}</div>
                  <div className="text-sm text-gray-500">{p.category}</div>
                  <div className="mt-1 font-medium">Rs. {p.price}</div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onQty(it, Number(it.quantity) - 1)}
                    className="px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 transition"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-3">{it.quantity}</span>
                  <button
                    onClick={() => onQty(it, Number(it.quantity) + 1)}
                    className="px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 transition"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={() => onRemove(it)}
                  className="ml-4 p-2 rounded bg-red-50 text-red-600 hover:bg-red-100 transition"
                  title="Remove"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>

        <div className="bg-white rounded-xl shadow p-4 h-fit">
          <div className="flex justify-between mb-3">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-semibold">Rs. {subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-4">
            <span className="text-gray-600">Delivery</span>
            <span className="font-semibold">Free</span>
          </div>
          <div className="flex justify-between text-lg font-bold border-t pt-3">
            <span>Total</span>
            <span>Rs. {subtotal.toFixed(2)}</span>
          </div>
          <Button
            className="w-full mt-4"
            onClick={() => navigate("/checkout")}
          >
            Proceed to Checkout (COD)
          </Button>
        </div>
      </div>
    </div>
  );
}

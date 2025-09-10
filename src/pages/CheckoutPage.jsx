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

export default function CheckoutPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useUser();

  const buyNow = location.state?.buyNow || null; // { product, quantity }
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
    paymentMethod: "COD", // default
  });

  // Load cart or buyNow product
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

  // Order items summary
  const summaryItems = useMemo(() => {
    if (buyNow) {
      const p = buyNow.product;
      return [
        {
          productId: p.$id,
          name: p.name,
          price: Number(p.price),
          qty: Number(buyNow.quantity),
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
          qty: Number(c.quantity),
          imageUrl: p.imageUrl,
        };
      })
      .filter(Boolean);
  }, [buyNow, cartDocs, productsMap]);

  const total = useMemo(
    () => summaryItems.reduce((sum, it) => sum + it.price * it.qty, 0),
    [summaryItems]
  );

  // Place order
  const onSubmit = async (e) => {
    e.preventDefault();

    if (!summaryItems.length) {
      alert("No items to order.");
      return;
    }

    if (!form.name || !form.phone || !form.address || !form.city || !form.postalCode) {
      alert("Please fill all required fields.");
      return;
    }

    try {
      await createOrder({
        userId: user.$id,
        items: summaryItems,
        total,
        name: form.name,
        phone: form.phone,
        address: form.address,
        city: form.city,
        postalCode: form.postalCode,
        notes: form.notes,
        paymentMethod: form.paymentMethod || "COD",
        status: "pending",
      });

      if (!buyNow) {
        await clearCart(user.$id);
      }

      alert("Order placed successfully!");
      navigate("/");
    } catch (err) {
      console.error("Order failed:", err);
      alert("Failed to place order. Please try again.");
    }
  };

  if (loading) return <div className="p-6">Loading checkout…</div>;

  return (
    <div className="max-w-6xl mx-auto p-6 grid lg:grid-cols-3 gap-6">
      {/* Checkout Form */}
      <form
        onSubmit={onSubmit}
        className="lg:col-span-2 bg-white rounded-xl shadow p-6"
      >
        <h1 className="text-2xl font-bold mb-4">Checkout</h1>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-600">Full Name *</label>
            <input
              className="w-full border rounded px-2 py-1"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="text-sm text-gray-600">Phone *</label>
            <input
              type="tel"
              className="w-full border rounded px-2 py-1"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              required
            />
          </div>
          <div className="sm:col-span-2">
            <label className="text-sm text-gray-600">Address *</label>
            <input
              className="w-full border rounded px-2 py-1"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="text-sm text-gray-600">City *</label>
            <input
              className="w-full border rounded px-2 py-1"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="text-sm text-gray-600">Postal Code *</label>
            <input
              className="w-full border rounded px-2 py-1"
              value={form.postalCode}
              onChange={(e) =>
                setForm({ ...form, postalCode: e.target.value })
              }
              required
            />
          </div>
          <div className="sm:col-span-2">
            <label className="text-sm text-gray-600">Notes (optional)</label>
            <input
              className="w-full border rounded px-2 py-1"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm text-gray-600">Payment Method *</label>
            <select
              className="w-full border rounded px-2 py-1"
              value={form.paymentMethod}
              onChange={(e) =>
                setForm({ ...form, paymentMethod: e.target.value })
              }
              required
            >
              <option value="COD">Cash on Delivery</option>
              <option value="Online">Online Payment</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="mt-6 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          Place Order
        </button>
      </form>

      {/* Order Summary */}
      <div className="bg-white rounded-xl shadow p-6 h-fit">
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
        <div className="space-y-4">
          {summaryItems.map((it) => (
            <div key={it.productId} className="flex items-center gap-3">
              <img
                src={it.imageUrl}
                alt={it.name}
                className="w-16 h-16 object-contain rounded"
              />
              <div className="flex-1">
                <div className="font-medium">{it.name}</div>
                <div className="text-sm text-gray-500">Qty: {it.qty}</div>
              </div>
              <div className="font-semibold">
                Rs. {(it.price * it.qty).toFixed(2)}
              </div>
            </div>
          ))}
        </div>
        <div className="border-t mt-4 pt-4 flex justify-between text-lg font-bold">
          <span>Total</span>
          <span>Rs. {total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}

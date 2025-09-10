// src/pages/UserOrdersPage.jsx
import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getOrders, updateOrder } from "../backend/database";
import { Button } from "@/components/ui/button";
import { useUser } from "../context/UserContext";

export default function UserOrdersPage() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch user orders
  const loadOrders = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const allOrders = await getOrders();
      const myOrders = allOrders.documents.filter((o) => o.userId === user.$id);
      setOrders(myOrders);
    } catch (err) {
      console.error("Failed to load orders:", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    loadOrders();
  }, [user, navigate, loadOrders]);

  // Cancel pending order
  const cancelOrder = async (order) => {
    if (order.status.toLowerCase() !== "pending") {
      alert("Only pending orders can be cancelled.");
      return;
    }
    if (!window.confirm("Are you sure you want to cancel this order?")) return;

    try {
      await updateOrder(order.$id, { status: "cancelled" });
      await loadOrders();
      alert("Order cancelled successfully.");
    } catch (err) {
      console.error("Failed to cancel order:", err);
      alert("Failed to cancel order. Please try again.");
    }
  };

  // Normalize items
  const normalizeItems = (items) => {
    if (!items) return [];
    if (Array.isArray(items)) return items;
    try {
      return JSON.parse(items);
    } catch {
      return [];
    }
  };

  if (loading)
    return <div className="max-w-6xl mx-auto p-6">Loading orders…</div>;

  if (!orders.length)
    return (
      <div className="max-w-6xl mx-auto p-6 text-center">
        <h2 className="text-2xl font-semibold mb-2">You have no orders yet</h2>
        <Button onClick={() => navigate("/products")} className="mt-2">
          Browse Products
        </Button>
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-6">My Orders</h1>
      <div className="grid gap-6">
        {orders.map((order) => {
          const items = normalizeItems(order.items);
          return (
            <div
              key={order.$id}
              className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition flex flex-col gap-4"
            >
              {/* Header: Order ID + Status */}
              <div className="flex justify-between items-center">
                <div>
                  <span className="font-semibold text-gray-700">Order ID:</span>{" "}
                  <span className="text-gray-900">{order.$id}</span>
                </div>
                <div
                  className={`px-3 py-1 rounded-full text-white text-sm ${
                    order.status.toLowerCase() === "pending"
                      ? "bg-yellow-500"
                      : order.status.toLowerCase() === "approved" ||
                        order.status.toLowerCase() === "processing"
                      ? "bg-blue-500"
                      : order.status.toLowerCase() === "shipped"
                      ? "bg-purple-500"
                      : order.status.toLowerCase() === "delivered"
                      ? "bg-green-500"
                      : "bg-red-500"
                  }`}
                >
                  {order.status}
                </div>
              </div>

              {/* Order Info */}
              <div className="grid sm:grid-cols-2 gap-4 text-gray-700">
                <div className="space-y-1">
                  <p>
                    <span className="font-semibold">Placed on:</span>{" "}
                    {new Date(order.$createdAt).toLocaleString()}
                  </p>
                  <p>
                    <span className="font-semibold">Customer:</span>{" "}
                    {order.name || "-"}
                  </p>
                  <p>
                    <span className="font-semibold">Phone:</span>{" "}
                    {order.phone || "-"}
                  </p>
                  <p>
                    <span className="font-semibold">Address:</span>{" "}
                    {order.address || "-"}, {order.city || "-"} -{" "}
                    {order.postalCode || "-"}
                  </p>
                  {order.notes && (
                    <p>
                      <span className="font-semibold">Notes:</span>{" "}
                      {order.notes}
                    </p>
                  )}
                </div>
                <div className="space-y-1">
                  <p>
                    <span className="font-semibold">Payment Method:</span>{" "}
                    {order.paymentMethod || "COD"}
                  </p>
                  <p className="text-lg font-bold">
                    Total: Rs. {Number(order.total || 0).toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="font-semibold text-lg mb-2">Items</h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  {items.map((i, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 border rounded-lg p-3 hover:bg-gray-50 transition"
                    >
                      {i.imageUrl && (
                        <img
                          src={i.imageUrl}
                          alt={i.name}
                          className="w-16 h-16 object-contain rounded"
                        />
                      )}
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">
                          {i.name || i.productId}
                        </div>
                        <div className="text-gray-500 text-sm">
                          Qty: {i.qty || i.quantity}
                        </div>
                      </div>
                      <div className="font-semibold text-gray-800">
                        Rs.{" "}
                        {(
                          (Number(i.price) || 0) * (Number(i.qty || i.quantity) || 1)
                        ).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cancel button */}
              {order.status.toLowerCase() === "pending" && (
                <div className="flex justify-end mt-3">
                  <Button
                    variant="destructive"
                    onClick={() => cancelOrder(order)}
                  >
                    Cancel Order
                  </Button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

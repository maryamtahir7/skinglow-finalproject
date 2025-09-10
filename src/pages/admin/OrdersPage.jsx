// src/pages/admin/OrdersPage.jsx
import React, { useEffect, useState } from "react";
import { getOrders, updateOrder } from "../../backend/database";
import { useUser } from "../../context/UserContext";
import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  HomeIcon,
  ClipboardList,
  BoltIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function OrdersPage() {
  const { user } = useUser();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch orders
  useEffect(() => {
    if (!user || user.email !== "admin@gmail.com") return;

    (async () => {
      try {
        const data = await getOrders();
        setOrders(data.documents || []);
      } catch (e) {
        console.error("Failed to fetch orders:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  // Update order status
  const handleStatusChange = async (orderId, status) => {
    try {
      await updateOrder(orderId, { status });
      setOrders((prev) =>
        prev.map((o) => (o.$id === orderId ? { ...o, status } : o))
      );
    } catch (e) {
      console.error("Failed to update status:", e);
      alert("Could not update order status.");
    }
  };

  if (!user || user.email !== "admin@gmail.com") {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-white to-indigo-50 p-6 text-red-600 font-semibold">
        Access denied. Admin only.
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-white to-indigo-50">
      {/* Top Navigation */}
      <header className="w-full bg-white/80 backdrop-blur-lg border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-indigo-700 font-extrabold text-xl">
            <LayoutDashboard className="h-6 w-6" />
            Admin Dashboard
          </div>
          <nav className="hidden md:flex gap-4">
            <Link to="/admin" className="flex items-center gap-1 text-gray-700 hover:text-indigo-600 transition">
              <HomeIcon className="h-5 w-5" /> Home
            </Link>
            <Link to="/admin/products" className="flex items-center gap-1 text-gray-700 hover:text-indigo-600 transition">
              <Package className="h-5 w-5" /> Products
            </Link>
            <Link to="/admin/add-product" className="flex items-center gap-1 text-gray-700 hover:text-indigo-600 transition">
              <PlusCircle className="h-5 w-5" /> Add
            </Link>
            <Link to="/admin/orders" className="flex items-center gap-1 text-gray-700 hover:text-indigo-600 transition">
              <ClipboardList className="h-5 w-5" /> Orders
            </Link>
            <Link to="/admin/categories" className="flex items-center gap-1 text-gray-700 hover:text-indigo-600 transition">
              <BoltIcon className="h-5 w-5" /> Categories
            </Link>
          </nav>
        </div>
      </header>

      {/* Orders List */}
      <main className="flex-1 max-w-7xl mx-auto px-6 py-10 space-y-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Orders Management</h1>

        {loading ? (
          <div>Loading orders…</div>
        ) : !orders.length ? (
          <div>No orders found.</div>
        ) : (
          orders.map((order) => {
            let items = [];
            try {
              items = order.items ? JSON.parse(order.items) : [];
            } catch (err) {
              console.warn("Failed to parse order items:", err);
              items = [];
            }

            return (
              <div
                key={order.$id}
                className="border rounded-2xl p-6 bg-white shadow-md hover:shadow-xl transition duration-300"
              >
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <span className="font-semibold text-gray-700">Order ID:</span>{" "}
                    <span className="text-gray-900">{order.$id}</span>
                  </div>
                  <div>
                    <select
                      value={order.status || "pending"}
                      onChange={(e) => handleStatusChange(order.$id, e.target.value)}
                      className="border rounded-lg p-2 bg-gray-50 hover:bg-gray-100 transition"
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-6 mb-4 text-gray-700">
                  <div className="space-y-2">
                    <p>
                      <span className="font-semibold">Customer:</span> {order.name || "-"}
                    </p>
                    <p>
                      <span className="font-semibold">Phone:</span> {order.phone || "-"}
                    </p>
                    <p>
                      <span className="font-semibold">Address:</span> {order.address || "-"}, {order.city || "-"} - {order.postalCode || "-"}
                    </p>
                    <p>
                      <span className="font-semibold">Notes:</span> {order.notes || "-"}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p>
                      <span className="font-semibold">Payment Method:</span> {order.paymentMethod || "COD"}
                    </p>
                    <p>
                      <span className="font-semibold">Total:</span> Rs. {(order.total || 0).toFixed(2)}
                    </p>
                    <p>
                      <span className="font-semibold">Created At:</span>{" "}
                      {order.$createdAt ? new Date(order.$createdAt).toLocaleString() : "-"}
                    </p>
                  </div>
                </div>

                <div className="mt-4">
                  <h3 className="font-semibold text-lg mb-3">Items</h3>
                  {items.length ? (
                    <div className="grid sm:grid-cols-2 gap-4">
                      {items.map((item) => (
                        <div
                          key={item.productId}
                          className="flex items-center gap-4 border rounded-lg p-3 hover:bg-gray-50 transition"
                        >
                          {item.imageUrl && (
                            <img
                              src={item.imageUrl}
                              alt={item.name}
                              className="w-16 h-16 object-contain rounded"
                            />
                          )}
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">{item.name}</div>
                            <div className="text-gray-500 text-sm">Qty: {item.qty}</div>
                          </div>
                          <div className="font-semibold text-gray-800">
                            Rs. {(Number(item.price || 0) * Number(item.qty || 1)).toFixed(2)}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-gray-500 italic">No items found in this order.</div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </main>
    </div>
  );
}

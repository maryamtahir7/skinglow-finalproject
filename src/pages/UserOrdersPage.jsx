// src/pages/UserOrdersPage.jsx
import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getOrders, updateOrder, getProducts } from "../backend/database";
import { Button } from "@/components/ui/button";
import { useUser } from "../context/UserContext";
import { Package, Clock, CheckCircle, Truck, XCircle, AlertCircle, FileText, Pill, Edit, Trash2, Save, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function UserOrdersPage() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Edit State
  const [editingOrder, setEditingOrder] = useState(null);
  const [editItems, setEditItems] = useState([]);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Products Map for Image Fallback
  const [productImages, setProductImages] = useState({});

  // Fetch user orders and products for images
  const loadData = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [allOrders, allProducts] = await Promise.all([
        getOrders(),
        getProducts() // Fetch products to map images
      ]);

      const myOrders = allOrders.documents.filter((o) => o.userId === user.$id);
      setOrders(myOrders);

      // Create image map: productId -> imageUrl
      const imgMap = {};
      if (allProducts && allProducts.documents) {
        allProducts.documents.forEach(p => {
          imgMap[p.$id] = p.imageUrl;
        });
      }
      setProductImages(imgMap);

    } catch (err) {
      console.error("Failed to load data:", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    loadData();
  }, [user, navigate, loadData]);

  // Cancel order logic - Strict: Only Pending
  const canCancel = (order) => {
    // User can ONLY cancel if status is pending
    return order.status.toLowerCase() === "pending";
  };

  const cancelOrder = async (order) => {
    if (!canCancel(order)) {
      alert("Only pending orders can be cancelled.");
      return;
    }
    if (!window.confirm("Are you sure you want to cancel this order?")) return;

    try {
      await updateOrder(order.$id, { status: "cancelled" });
      await loadData();
      alert("Order cancelled successfully.");
    } catch (err) {
      console.error("Failed to cancel order:", err);
      alert("Failed to cancel order. Please try again.");
    }
  };

  // Edit Order Logic (Prescription Orders)
  const handleEditClick = (order) => {
    setEditingOrder(order);
    setEditItems(normalizeItems(order.items).map(i => ({ ...i, qty: Number(i.qty || i.quantity || 1) })));
    setIsEditDialogOpen(true);
  };

  const handleUpdateItemQty = (index, newQty) => {
    const updated = [...editItems];
    updated[index].qty = Math.max(1, newQty);
    setEditItems(updated);
  };

  const handleRemoveItem = (index) => {
    if (editItems.length <= 1) {
      alert("You cannot remove all items. Please cancel the order instead.");
      return;
    }
    const updated = editItems.filter((_, i) => i !== index);
    setEditItems(updated);
  };

  const handleSaveEdit = async () => {
    if (!editingOrder) return;

    // Recalculate total
    const newTotal = editItems.reduce((sum, item) => sum + (Number(item.price) * item.qty), 0);

    try {
      await updateOrder(editingOrder.$id, {
        items: JSON.stringify(editItems),
        total: newTotal
      });
      setIsEditDialogOpen(false);
      await loadData();
      alert("Order updated successfully!");
    } catch (error) {
      console.error("Update failed:", error);
      alert("Failed to update order.");
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

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'processing': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'shipped': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'delivered': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'pending': return <Clock className="w-3.5 h-3.5" />;
      case 'processing': return <Package className="w-3.5 h-3.5" />;
      case 'shipped': return <Truck className="w-3.5 h-3.5" />;
      case 'delivered': return <CheckCircle className="w-3.5 h-3.5" />;
      case 'cancelled': return <XCircle className="w-3.5 h-3.5" />;
      default: return <AlertCircle className="w-3.5 h-3.5" />;
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex items-center gap-2 text-teal-600 font-medium">
          <Clock className="w-5 h-5 animate-spin" /> Loading your orders...
        </div>
      </div>
    );

  if (!orders.length)
    return (
      <div className="min-h-screen bg-slate-50 p-6 flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 bg-slate-200 rounded-full flex items-center justify-center mb-4">
          <Package className="w-10 h-10 text-slate-400" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">No Past Orders</h2>
        <p className="text-slate-500 mb-6">You haven't purchased any medicines yet.</p>
        <Button onClick={() => navigate("/products")} className="bg-teal-600 hover:bg-teal-700 text-white rounded-xl h-12 px-6">
          Browse Medicines
        </Button>
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 md:px-6 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-teal-100 rounded-xl">
            <FileText className="w-6 h-6 text-teal-700" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">My Orders</h1>
            <p className="text-slate-500">Track and manage your past purchases</p>
          </div>
        </div>

        <div className="grid gap-6">
          {orders.map((order) => {
            const items = normalizeItems(order.items);
            return (
              <div
                key={order.$id}
                className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition"
              >
                {/* Header */}
                <div className="bg-slate-50/50 p-6 border-b border-slate-100 flex flex-wrap justify-between items-center gap-4">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Order ID</span>
                    <div className="font-mono text-sm font-semibold text-slate-700">#{order.$id}</div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Date Placed</span>
                    <div className="text-sm font-medium text-slate-700">{new Date(order.$createdAt).toLocaleDateString()}</div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Amount</span>
                    <div className="text-lg font-bold text-slate-900">Rs. {Number(order.total || 0).toFixed(2)}</div>
                  </div>

                  <div className={`px-3 py-1.5 rounded-full text-xs font-bold border flex items-center gap-1.5 capitalize shadow-sm ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)}
                    {order.status}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 grid md:grid-cols-3 gap-8">
                  {/* Items List */}
                  <div className="md:col-span-2 space-y-4">
                    <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                      <Pill className="w-4 h-4 text-teal-500" /> Items
                    </h3>
                    <div className="space-y-3">
                      {items.map((i, idx) => (
                        <div key={idx} className="flex items-start gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                          {(i.imageUrl || productImages[i.productId]) ? (
                            <img src={i.imageUrl || productImages[i.productId]} alt={i.name} className="w-12 h-12 object-cover rounded-lg bg-white" />
                          ) : (
                            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center border border-slate-200">
                              <Pill className="w-6 h-6 text-slate-300" />
                            </div>
                          )}
                          <div className="flex-1">
                            <h4 className="font-medium text-slate-800 text-sm line-clamp-1">{i.name || i.productId}</h4>
                            <p className="text-xs text-slate-500">Qty: {i.qty || i.quantity}</p>
                          </div>
                          <div className="font-semibold text-slate-700 text-sm">
                            Rs. {((Number(i.price) || 0) * (Number(i.qty || i.quantity) || 1)).toFixed(2)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Shipping Info */}
                  <div className="space-y-6 text-sm">
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-2">Delivery Details</h3>
                      <p className="text-slate-600 leading-relaxed">
                        {order.address}, {order.city}<br />
                        {order.postalCode}<br />
                        <span className="font-medium text-slate-800 mt-1 block">Phone: {order.phone}</span>
                      </p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-slate-900 mb-2">Payment</h3>
                      <p className="text-slate-600">{order.paymentMethod || "Cash on Delivery"}</p>
                    </div>

                    {order.notes && (
                      <div className="bg-amber-50 text-amber-800 p-3 rounded-lg border border-amber-100 text-xs">
                        <span className="font-bold block mb-1">Note:</span> {order.notes}
                      </div>
                    )}

                  </div>
                </div>

                {/* Action Footer */}
                <div className="bg-slate-50/50 p-4 border-t border-slate-100 flex justify-end gap-3">
                  {/* Edit: Only for Pending Orders with Prescription (as per business logic) or general if needed */}
                  {order.status.toLowerCase() === "pending" && (
                    <Button variant="outline" onClick={() => handleEditClick(order)} className="text-teal-700 border-teal-200 hover:bg-teal-50 hover:text-teal-800 h-9 text-xs font-semibold">
                      <Edit className="w-3.5 h-3.5 mr-2" /> Edit Items
                    </Button>
                  )}

                  {/* Cancel: Only for Pending Orders */}
                  {canCancel(order) && (
                    <Button
                      variant="destructive"
                      onClick={() => cancelOrder(order)}
                      className="bg-red-500 hover:bg-red-600 text-white shadow-sm h-9 text-xs font-semibold"
                    >
                      Cancel Order
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Edit Order Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Order Items</DialogTitle>
            <DialogDescription>
              Modify quantities or remove items from your prescription order.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
            {editItems.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-100">
                <div className="flex-1">
                  <p className="font-semibold text-sm text-slate-900">{item.name}</p>
                  <p className="text-xs text-slate-500">Price: Rs. {item.price}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Input
                    type="number"
                    min="1"
                    value={item.qty}
                    onChange={(e) => handleUpdateItemQty(idx, parseInt(e.target.value))}
                    className="w-16 h-8 text-sm"
                  />
                  <button onClick={() => handleRemoveItem(idx)} className="text-slate-400 hover:text-red-500">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveEdit} className="bg-teal-600 hover:bg-teal-700 text-white">
              <Save className="w-4 h-4 mr-2" /> Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div >
  );
}

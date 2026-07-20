// src/pages/UserOrdersPage.jsx
import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getOrders, updateOrder, getProducts } from "../backend/database";
import { Button } from "@/components/ui/button";
import { useUser } from "../context/UserContext";
import { Package, Clock, CheckCircle, Truck, XCircle, AlertCircle, FileText, Pill, Edit, Trash2, Save, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function UserOrdersPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
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

  // Handle Highlighting specific order
  useEffect(() => {
    const highlightId = searchParams.get("highlight");
    if (highlightId && !loading && orders.length > 0) {
      const element = document.getElementById(highlightId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
        element.classList.add("ring-2", "ring-primary", "ring-offset-4");
        setTimeout(() => {
          element.classList.remove("ring-2", "ring-primary", "ring-offset-4");
        }, 3000);
      }
    }
  }, [loading, orders, searchParams]);

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
      case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200'; // Keep alert colors standard or use theme variations if defined
      case 'processing': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'shipped': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'delivered': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-secondary text-muted-foreground border-border';
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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-2 text-primary font-medium">
          <Clock className="w-5 h-5 animate-spin" /> Loading your orders...
        </div>
      </div>
    );

  if (!orders.length)
    return (
      <div className="min-h-screen bg-background p-6 flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 bg-secondary/50 rounded-full flex items-center justify-center mb-4">
          <Package className="w-10 h-10 text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">No Past Orders</h2>
        <p className="text-muted-foreground mb-6">You haven't purchased any skincare essentials yet.</p>
        <Button onClick={() => navigate("/products")} className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl h-12 px-8 shadow-lg shadow-primary/20">
          Browse Collection
        </Button>
      </div>
    );

  return (
    <div className="min-h-screen bg-background py-16 px-4 md:px-6 font-sans">
      <div className="max-w-5xl mx-auto space-y-10">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3.5 bg-primary/10 rounded-2xl">
            <FileText className="w-7 h-7 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">My Orders</h1>
            <p className="text-muted-foreground">Track and manage your past purchases</p>
          </div>
        </div>

        <div className="space-y-8">
          {orders.map((order) => {
            const items = normalizeItems(order.items);
            return (
              <div
                key={order.$id}
                id={order.$id}
                className="bg-card rounded-3xl shadow-sm border border-border overflow-hidden hover:shadow-md transition-shadow duration-300"
              >
                {/* Header */}
                <div className="bg-secondary/30 p-6 md:px-8 border-b border-border flex flex-wrap justify-between items-center gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Order ID</span>
                    <div className="font-mono text-sm font-semibold text-foreground">#{order.$id}</div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Date Placed</span>
                    <div className="text-sm font-medium text-foreground">{new Date(order.createdAt || order.$createdAt).toLocaleDateString()}</div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Total Amount</span>
                    <div className="text-lg font-bold text-primary">Rs. {Number(order.total || 0).toFixed(2)}</div>
                  </div>

                  <div className={`px-4 py-1.5 rounded-full text-xs font-bold border flex items-center gap-2 capitalize shadow-sm ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)}
                    {order.status}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 md:p-8 grid md:grid-cols-3 gap-8 md:gap-12">
                  {/* Items List */}
                  <div className="md:col-span-2 space-y-5">
                    <h3 className="font-bold text-foreground flex items-center gap-2 text-sm uppercase tracking-wide">
                      <Package className="w-4 h-4 text-primary" /> Items Ordered
                    </h3>
                    <div className="space-y-3">
                      {items.map((i, idx) => {
                        const lineTotal = ((Number(i.price) || 0) * (Number(i.qty || i.quantity) || 1)).toFixed(2);
                        const canWriteReview = order.status.toLowerCase() === "delivered";

                        return (
                          <div
                            key={idx}
                            className="flex items-center gap-4 bg-background p-3 rounded-2xl border border-secondary hover:border-border transition-colors"
                          >
                            {(i.imageUrl || productImages[i.productId]) ? (
                              <img
                                src={i.imageUrl || productImages[i.productId]}
                                alt={i.name}
                                className="w-14 h-14 object-cover rounded-xl bg-secondary"
                              />
                            ) : (
                              <div className="w-14 h-14 bg-secondary rounded-xl flex items-center justify-center border border-border">
                                <Package className="w-7 h-7 text-muted-foreground/50" />
                              </div>
                            )}
                            <div className="flex-1">
                              <h4 className="font-bold text-foreground text-sm line-clamp-1">{i.name || i.productId}</h4>
                              <p className="text-xs text-muted-foreground">Qty: {i.qty || i.quantity}</p>

                              {canWriteReview && i.productId && (
                                <div className="mt-1">
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="h-7 px-3 text-[11px] rounded-full border-primary/40 text-primary hover:bg-primary/5"
                                    onClick={() => navigate(`/products/${i.productId}`, { state: { openReviews: true } })}
                                  >
                                    Write Review
                                  </Button>
                                </div>
                              )}
                            </div>
                            <div className="font-bold text-foreground text-sm">
                              Rs. {lineTotal}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Shipping Info */}
                  <div className="space-y-8 text-sm">
                    <div>
                      <h3 className="font-bold text-foreground mb-3 text-sm uppercase tracking-wide">Delivery Details</h3>
                      <div className="p-4 bg-background rounded-2xl border border-secondary text-muted-foreground leading-relaxed">
                        <p className="text-foreground font-medium mb-1">{order.address}</p>
                        <p>{order.city}, {order.postalCode}</p>
                        <p className="mt-2 text-xs font-semibold text-primary">Contact: {order.phone}</p>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-bold text-foreground mb-3 text-sm uppercase tracking-wide">Payment Method</h3>
                      <p className="flex items-center gap-2 text-muted-foreground">
                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                        {order.paymentMethod || "Cash on Delivery"}
                      </p>
                    </div>

                    {order.notes && (
                      <div className="bg-amber-50 text-amber-900/80 p-4 rounded-2xl border border-amber-100 text-xs leading-relaxed">
                        <span className="font-bold block mb-1">Note:</span> {order.notes}
                      </div>
                    )}

                  </div>
                </div>

                {/* Action Footer */}
                <div className="bg-secondary/20 p-4 px-6 md:px-8 border-t border-border flex justify-end gap-3">
                  {/* Edit: Only for Pending Orders with Prescription (as per business logic) or general if needed */}
                  {order.status.toLowerCase() === "pending" && (
                    <Button variant="outline" onClick={() => handleEditClick(order)} className="text-foreground border-border hover:bg-white hover:text-primary h-10 px-5 text-xs font-bold rounded-xl">
                      <Edit className="w-3.5 h-3.5 mr-2" /> Edit Items
                    </Button>
                  )}

                  {/* Cancel: Only for Pending Orders */}
                  {canCancel(order) && (
                    <Button
                      variant="destructive"
                      onClick={() => cancelOrder(order)}
                      className="bg-red-500 hover:bg-red-600 text-white shadow-red-200 shadow-md h-10 px-5 text-xs font-bold rounded-xl"
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
        <DialogContent className="max-w-lg bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground font-bold text-xl">Edit Order Items</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Modify quantities or remove items from your prescription order.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
            {editItems.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between bg-secondary/30 p-3 rounded-2xl border border-border">
                <div className="flex-1">
                  <p className="font-bold text-sm text-foreground">{item.name}</p>
                  <p className="text-xs text-muted-foreground">Price: Rs. {item.price}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Input
                    type="number"
                    min="1"
                    value={item.qty}
                    onChange={(e) => handleUpdateItemQty(idx, parseInt(e.target.value))}
                    className="w-16 h-8 text-sm bg-background border-border text-center"
                  />
                  <button onClick={() => handleRemoveItem(idx)} className="text-muted-foreground hover:text-red-500 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} className="border-border text-muted-foreground hover:bg-secondary">Cancel</Button>
            <Button onClick={handleSaveEdit} className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg shadow-primary/20">
              <Save className="w-4 h-4 mr-2" /> Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// src/pages/admin/OrdersPage.jsx
import React, { useEffect, useState } from "react";
import { getOrders, updateOrder, deleteOrder, addNotification } from "../../backend/database";
import { useUser } from "../../context/UserContext";
import {
  ClipboardList,
  CheckCircle,
  Package,
  Clock,
  Printer,
  Trash2,
  Pencil,
  User,
  ShoppingBag
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function OrdersPage() {
  const { user } = useUser();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");

  // Edit State
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    phone: "",
    address: "",
    city: ""
  });
  const [updating, setUpdating] = useState(false);

  // Fetch orders
  useEffect(() => {
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

      // Send Notification on Delivery
      if (status === "delivered") {
        const order = orders.find(o => o.$id === orderId);
        if (order) {
          await addNotification({
            userId: order.userId,
            message: `Your order #${order.$id.substring(0, 5)} has been delivered! You can now review your products.`,
            type: "order_update",
            read: false,
            link: `/orders` // or deep link to product if single item, but orders page is safer
          });
        }
      }

    } catch (e) {
      console.error("Failed to update status:", e);
      alert("Could not update order status.");
    }
  };

  const handleDelete = async (orderId) => {
    if (!confirm("Are you sure you want to delete this order? This cannot be undone.")) return;
    try {
      await deleteOrder(orderId);
      setOrders(prev => prev.filter(o => o.$id !== orderId));
    } catch (e) {
      console.error("Failed to delete order:", e);
      alert("Could not delete order.");
    }
  };

  const handleEditClick = (order) => {
    setEditingOrder(order);
    setEditForm({
      name: order.name,
      phone: order.phone,
      address: order.address,
      city: order.city
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateOrder = async () => {
    if (!editingOrder) return;
    setUpdating(true);
    try {
      await updateOrder(editingOrder.$id, {
        name: editForm.name,
        phone: editForm.phone,
        address: editForm.address,
        city: editForm.city
      });

      setOrders(prev => prev.map(o =>
        o.$id === editingOrder.$id ? { ...o, ...editForm } : o
      ));

      setIsEditDialogOpen(false);
      setEditingOrder(null);
      alert("Order updated successfully!");
    } catch (e) {
      console.error("Failed to update order:", e);
      alert("Failed to update order.");
    } finally {
      setUpdating(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-amber-100 text-amber-700 hover:bg-amber-200';
      case 'processing': return 'bg-blue-100 text-blue-700 hover:bg-blue-200';
      case 'shipped': return 'bg-purple-100 text-purple-700 hover:bg-purple-200';
      case 'delivered': return 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200';
      case 'cancelled': return 'bg-red-100 text-red-700 hover:bg-red-200';
      default: return 'bg-secondary text-foreground';
    }
  };

  const filteredOrders = filterStatus === 'all' ? orders : orders.filter(o => o.status === filterStatus);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Orders</h1>
          <p className="text-muted-foreground text-sm">Manage customer orders and shipments.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-border text-muted-foreground hover:bg-secondary">
            <Printer className="w-4 h-4 mr-2" /> Print Manifest
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {['all', 'pending', 'processing', 'shipped', 'delivered'].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-colors ${filterStatus === status
              ? 'bg-primary text-primary-foreground shadow-md'
              : 'bg-card text-muted-foreground border border-border hover:bg-secondary'
              }`}
          >
            {status}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-10 text-muted-foreground">Loading orders...</div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-16 bg-card rounded-xl border border-border">
            <ClipboardList className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground font-medium">No orders found.</p>
          </div>
        ) : (
          filteredOrders.map((order) => {
            let items = [];
            try { items = order.items ? JSON.parse(order.items) : []; } catch (e) { items = []; }

            return (
              <div key={order.$id} className="bg-card rounded-xl border border-border shadow-sm overflow-hidden hover:shadow-md transition">
                {/* Order Header */}
                <div className="bg-secondary/30 px-6 py-4 border-b border-border flex flex-wrap justify-between items-center gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-card rounded-full flex items-center justify-center border border-border text-muted-foreground font-mono text-sm">
                      #{order.$id.substr(0, 3)}
                    </div>
                    <div>
                      <div className="font-bold text-foreground text-sm">Order #{order.$id}</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {new Date(order.$createdAt).toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                      <div className="text-xs text-muted-foreground uppercase font-bold">Total Amount</div>
                      <div className="text-lg font-bold text-foreground">Rs. {(order.total || 0).toFixed(2)}</div>
                    </div>
                    <select
                      value={order.status || "pending"}
                      onChange={(e) => handleStatusChange(order.$id, e.target.value)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-bold border-none outline-none cursor-pointer ${getStatusColor(order.status)}`}
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-primary"
                        onClick={() => handleEditClick(order)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-red-500"
                        onClick={() => handleDelete(order.$id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Order Body */}
                <div className="p-6 grid md:grid-cols-3 gap-8">
                  {/* Customer Info */}
                  <div className="space-y-4">
                    <h4 className="font-bold text-foreground text-sm flex items-center gap-2">
                      <User className="w-4 h-4 text-primary" /> Customer Details
                    </h4>
                    <div className="bg-secondary/10 p-4 rounded-lg border border-border text-sm space-y-2">
                      <p>
                        <span className="text-muted-foreground">Name:</span>{" "}
                        <span className="font-medium text-foreground">{order.name}</span>
                      </p>
                      <p>
                        <span className="text-muted-foreground">Email:</span>{" "}
                        <span className="font-medium text-foreground">
                          {order.email || order.userEmail || "Not provided"}
                        </span>
                      </p>
                      <p>
                        <span className="text-muted-foreground">Phone:</span>{" "}
                        <span className="font-medium text-foreground">{order.phone}</span>
                      </p>
                      <p>
                        <span className="text-muted-foreground">City:</span>{" "}
                        <span className="font-medium text-foreground">{order.city || "—"}</span>
                      </p>
                      <p>
                        <span className="text-muted-foreground">Postal Code:</span>{" "}
                        <span className="font-medium text-foreground">{order.postalCode || "—"}</span>
                      </p>
                      <p>
                        <span className="text-muted-foreground">Address:</span>{" "}
                        <span className="font-medium text-foreground">{order.address}</span>
                      </p>
                      {order.notes && (
                        <div className="mt-2 pt-2 border-t border-border text-amber-600 bg-amber-50 p-2 rounded">
                          <span className="font-bold text-xs uppercase">Note:</span> {order.notes}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Items */}
                  <div className="md:col-span-2 space-y-4">
                    <h4 className="font-bold text-foreground text-sm flex items-center gap-2">
                      <ShoppingBag className="w-4 h-4 text-primary" /> Order Items
                    </h4>
                    <div className="border border-border rounded-lg divide-y divide-border">
                      {items.map((item, idx) => {
                        const qty = item.qty || item.quantity || 1;
                        const price = item.price || 0;
                        return (
                          <div key={idx} className="p-3 flex items-center gap-4 hover:bg-secondary/20 transition">
                            <div className="w-12 h-12 bg-secondary/50 rounded-lg flex items-center justify-center overflow-hidden">
                              {item.imageUrl ? (
                                <img src={item.imageUrl} className="w-full h-full object-cover" />
                              ) : (
                                <Package className="w-6 h-6 text-muted-foreground/50" />
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-foreground">{item.name}</div>
                              <div className="text-xs text-muted-foreground">Qty: {qty} &times; Rs. {price}</div>
                            </div>
                            <div className="font-bold text-foreground">
                              Rs. {(qty * price).toFixed(2)}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>

                {/* Action Footer */}
                {order.status === 'pending' && (
                  <div className="px-6 py-3 bg-secondary/10 border-t border-border flex justify-end gap-3">
                    <Button variant="outline" className="text-red-500 border-red-200 hover:bg-red-50" onClick={() => handleStatusChange(order.$id, 'cancelled')}>
                      Reject Order
                    </Button>
                    <Button className="bg-primary hover:bg-primary/90 text-primary-foreground" onClick={() => handleStatusChange(order.$id, 'processing')}>
                      <CheckCircle className="w-4 h-4 mr-2" /> Confirm & Process
                    </Button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Edit Order Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Order Details</DialogTitle>
            <DialogDescription>Update customer information.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Customer Name</Label>
              <Input
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Phone Number</Label>
              <Input
                value={editForm.phone}
                onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>City</Label>
              <Input
                value={editForm.city}
                onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Address</Label>
              <Input
                value={editForm.address}
                onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdateOrder} className="bg-primary text-primary-foreground" disabled={updating}>
              {updating ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

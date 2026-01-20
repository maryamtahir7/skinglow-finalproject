import React, { useEffect, useState } from "react";
import { getAllPrescriptions, createOrder, getProducts, deletePrescription } from "../../backend/database";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, FileText, User, Calendar, Eye, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const AdminPrescriptions = () => {
    const [prescriptions, setPrescriptions] = useState([]);
    const [products, setProducts] = useState([]); // Store fetched medicines
    const [loading, setLoading] = useState(true);

    // Order Creation State
    const [selectedRx, setSelectedRx] = useState(null);
    const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false);
    const [isCreatingOrder, setIsCreatingOrder] = useState(false);
    const [orderDetails, setOrderDetails] = useState({
        name: "",
        phone: "",
        address: "",
        city: "Faisalabad", // Default
        total: 0,
        items: [] // Array of { name: "", price: 0, quantity: 1 }
    });

    // Updated Logic: Select Item from Products
    const [currentProduct, setCurrentProduct] = useState("");
    const [newItemQty, setNewItemQty] = useState(1);

    useEffect(() => {
        fetchData();
        fetchProducts();
    }, []);

    const fetchData = async () => {
        try {
            const res = await getAllPrescriptions();
            setPrescriptions(res.documents);
        } catch (error) {
            console.error("Failed to fetch prescriptions:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchProducts = async () => {
        try {
            const res = await getProducts();
            setProducts(res.documents);
        } catch (error) {
            console.error("Failed to fetch products for dropdown:", error);
        }
    }

    const handleDeleteRx = async (id) => {
        if (!confirm("Are you sure you want to delete this prescription? This action cannot be undone.")) return;
        try {
            await deletePrescription(id);
            setPrescriptions(prev => prev.filter(p => p.$id !== id));
        } catch (error) {
            console.error("Failed to delete prescription:", error);
            alert("Failed to delete prescription.");
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString("en-US", {
            year: 'numeric', month: 'short', day: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    const openOrderDialog = (rx) => {
        setSelectedRx(rx);
        setOrderDetails({
            // Prioritize username from Rx schema, fallback to PatientName or patientName
            name: rx.username || rx.PatientName || rx.patientName || "",
            phone: "",
            address: "",
            city: "Faisalabad",
            total: 0,
            items: []
        });
        setIsOrderDialogOpen(true);
    };

    const addItem = () => {
        if (!currentProduct) return;

        // Find the full product object from state
        const selectedProd = products.find(p => p.$id === currentProduct);
        if (!selectedProd) return;

        const price = parseFloat(selectedProd.price || 0);
        const item = {
            name: selectedProd.name,
            price: price,
            qty: newItemQty, // Changed from quantity to qty
            productId: selectedProd.$id,
            imageUrl: selectedProd.imageUrl
        };

        setOrderDetails(prev => ({
            ...prev,
            items: [...prev.items, item],
            total: prev.total + (price * item.qty)
        }));

        // Reset inputs
        setCurrentProduct("");
        setNewItemQty(1);
    };

    const removeItem = (index) => {
        const item = orderDetails.items[index];
        setOrderDetails(prev => ({
            ...prev,
            items: prev.items.filter((_, i) => i !== index),
            total: prev.total - (item.price * item.qty)
        }));
    };

    const handleCreateOrder = async () => {
        if (orderDetails.items.length === 0) {
            alert("Please add at least one medicine to the order.");
            return;
        }
        if (!orderDetails.name || !orderDetails.phone || !orderDetails.address) {
            alert("Please fill in all customer details.");
            return;
        }

        setIsCreatingOrder(true);
        try {
            await createOrder({
                userId: selectedRx.userId,
                items: orderDetails.items,
                total: orderDetails.total,
                name: orderDetails.name,
                phone: orderDetails.phone,
                address: orderDetails.address,
                city: orderDetails.city,
                postalCode: "00000",
                paymentMethod: "COD",
                status: "confirmed",
                notes: `Created from Prescription ID: ${selectedRx.$id}`
            });
            alert("✅ Order created successfully!");
            setIsOrderDialogOpen(false);
        } catch (error) {
            console.error("Order creation failed:", error);
            alert("Failed to create order. " + error.message);
        } finally {
            setIsCreatingOrder(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Uploaded Prescriptions</h1>
                    <p className="text-slate-500">Review and process patient prescriptions.</p>
                </div>
                <div className="bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm">
                    <span className="text-sm font-medium text-slate-600">Total Uploads: </span>
                    <span className="font-bold text-teal-600">{prescriptions.length}</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {prescriptions.map((Rx) => (
                    <Card key={Rx.$id} className="overflow-hidden hover:shadow-md transition-shadow relative">
                        {/* Delete Button */}
                        <div className="absolute top-2 right-2 z-10">
                            <Button
                                variant="destructive"
                                size="icon"
                                className="h-8 w-8 rounded-full shadow-sm bg-red-500 hover:bg-red-600 text-white"
                                onClick={() => handleDeleteRx(Rx.$id)}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>

                        {/* Image Preview */}
                        <div className="aspect-video bg-slate-100 relative group overflow-hidden border-b border-slate-100">
                            {Rx.prescription ? (
                                <img
                                    src={Rx.prescription}
                                    alt="Prescription"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full text-slate-400">
                                    <FileText className="w-12 h-12" />
                                </div>
                            )}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button variant="secondary" className="gap-2">
                                            <Eye className="w-4 h-4" /> View Full
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-3xl p-0 overflow-hidden bg-black/90 border-none">
                                        <img src={Rx.prescription} alt="Full Rx" className="w-full h-auto max-h-[80vh] object-contain" />
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </div>

                        <CardContent className="p-4 space-y-3">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-teal-50 flex items-center justify-center text-teal-600 flex-shrink-0">
                                    <User className="w-4 h-4" />
                                </div>
                                <div className="overflow-hidden">
                                    {/* Display Username from Schema first */}
                                    <p className="text-sm font-bold text-slate-900 truncate">
                                        {Rx.username || Rx.PatientName || Rx.patientName || "Unknown User"}
                                    </p>
                                    <p className="text-xs text-slate-500 truncate">ID: {Rx.userId.substring(0, 8)}...</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 text-xs text-slate-500 pt-2 border-t border-slate-100">
                                <Calendar className="w-3 h-3" />
                                Uploaded: {formatDate(Rx.uploadedAt || Rx.$createdAt)}
                            </div>

                            <Button
                                className="w-full bg-teal-600 hover:bg-teal-700 text-white"
                                size="sm"
                                onClick={() => openOrderDialog(Rx)}
                            >
                                Create Order from Rx
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Create Order Dialog */}
            <Dialog open={isOrderDialogOpen} onOpenChange={setIsOrderDialogOpen}>
                <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Create Order from Prescription</DialogTitle>
                        <DialogDescription>Add medicines manually based on the prescription.</DialogDescription>
                    </DialogHeader>

                    <div className="grid md:grid-cols-2 gap-4 py-2">
                        <div className="space-y-3">
                            <h3 className="font-semibold text-sm">Customer Details</h3>
                            <div className="grid gap-2">
                                <Label>Name</Label>
                                <Input value={orderDetails.name} onChange={e => setOrderDetails({ ...orderDetails, name: e.target.value })} placeholder="Patient Name" />
                            </div>
                            <div className="grid gap-2">
                                <Label>Phone</Label>
                                <Input value={orderDetails.phone} onChange={e => setOrderDetails({ ...orderDetails, phone: e.target.value })} placeholder="0300-1234567" />
                            </div>
                            <div className="grid gap-2">
                                <Label>Address</Label>
                                <Textarea value={orderDetails.address} onChange={e => setOrderDetails({ ...orderDetails, address: e.target.value })} placeholder="Delivery Address" />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <h3 className="font-semibold text-sm">Add Medicines</h3>
                            <div className="flex gap-2 items-end">
                                <div className="flex-1">
                                    <Label className="text-xs mb-1 block">Select Medicine</Label>
                                    <Select value={currentProduct} onValueChange={setCurrentProduct}>
                                        <SelectTrigger className="h-10">
                                            <SelectValue placeholder="Search product..." />
                                        </SelectTrigger>
                                        <SelectContent className="max-h-[200px]">
                                            {products.length === 0 ? (
                                                <div className="p-2 text-xs text-slate-500">No products found</div>
                                            ) : (
                                                products.map(p => (
                                                    <SelectItem key={p.$id} value={p.$id}>
                                                        {p.name} (Rs. {p.price})
                                                    </SelectItem>
                                                ))
                                            )}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="w-20">
                                    <Label className="text-xs mb-1 block">Qty</Label>
                                    <Input
                                        type="number"
                                        min="1"
                                        value={newItemQty}
                                        onChange={e => setNewItemQty(parseInt(e.target.value))}
                                        className="h-10"
                                    />
                                </div>
                                <Button onClick={addItem} size="sm" type="button" className="h-10 w-10 p-0 shrink-0 mb-0"><Plus className="w-4 h-4" /></Button>
                            </div>

                            {/* Helper text if no product selected */}
                            {!currentProduct && <div className="text-[10px] text-slate-400">Select a medicine from inventory to add.</div>}

                            <div className="mt-4 bg-slate-50 p-2 rounded-md h-[150px] overflow-y-auto border border-slate-200">
                                {orderDetails.items.length === 0 ? (
                                    <p className="text-xs text-slate-400 text-center mt-10">No items added yet.</p>
                                ) : (
                                    <div className="space-y-2">
                                        {orderDetails.items.map((item, idx) => (
                                            <div key={idx} className="flex justify-between items-center bg-white p-2 rounded border border-slate-100 text-sm">
                                                <div>
                                                    <span className="font-medium">{item.name}</span>
                                                    <div className="text-xs text-slate-500">{item.quantity} x Rs. {item.price}</div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span className="font-bold">Rs. {item.price * item.quantity}</span>
                                                    <button onClick={() => removeItem(idx)} className="text-red-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                                <span className="font-bold text-slate-700">Total:</span>
                                <span className="font-bold text-xl text-teal-600">Rs. {orderDetails.total}</span>
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsOrderDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleCreateOrder} disabled={isCreatingOrder} className="bg-teal-600 hover:bg-teal-700 text-white">
                            {isCreatingOrder ? (<><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Creating...</>) : "Create Order"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AdminPrescriptions;

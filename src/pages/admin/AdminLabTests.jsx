import React, { useEffect, useState } from "react";
import { getAllLabBookings, updateLabBooking, getPrescriptions, deleteLabBooking } from "../../backend/database";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Microscope,
    Calendar,
    User,
    Loader2,
    FileText,
    Eye,
    Trash2,
    Pencil
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const AdminLabTests = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    // State for viewing prescriptions
    const [selectedUserPrescriptions, setSelectedUserPrescriptions] = useState([]);
    const [isPrescriptionDialogOpen, setIsPrescriptionDialogOpen] = useState(false);
    const [prescriptionLoading, setPrescriptionLoading] = useState(false);
    const [selectedPatientName, setSelectedPatientName] = useState("");

    // State for Editing Booking
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [editingBooking, setEditingBooking] = useState(null);
    const [editForm, setEditForm] = useState({
        test: "",
        price: "",
        patientName: ""
    });
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const res = await getAllLabBookings();
            setBookings(res.documents);
        } catch (error) {
            console.error("Failed to fetch lab bookings:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (bookingId, newStatus) => {
        try {
            // Optimistic update
            setBookings(prev => prev.map(b =>
                b.$id === bookingId ? { ...b, Status: newStatus } : b
            ));

            await updateLabBooking(bookingId, { Status: newStatus });
        } catch (error) {
            console.error("Failed to update status:", error);
            alert("Failed to update status");
            fetchBookings(); // Revert on error
        }
    };

    const handleDelete = async (bookingId) => {
        if (!confirm("Are you sure you want to delete this booking?")) return;
        try {
            await deleteLabBooking(bookingId);
            setBookings(prev => prev.filter(b => b.$id !== bookingId));
        } catch (error) {
            console.error("Failed to delete booking:", error);
            alert("Failed to delete booking");
        }
    };

    const handleEditClick = (booking) => {
        setEditingBooking(booking);
        setEditForm({
            test: booking.test || "",
            price: booking.Price || booking.price || "",
            patientName: booking.PatientName || booking.patientName || ""
        });
        setIsEditDialogOpen(true);
    };

    const handleUpdateSubmit = async () => {
        if (!editingBooking) return;
        setUpdating(true);
        try {
            // Determine which keys to update based on existing data (handling case sensitivity inconsistency)
            const updates = {
                test: editForm.test
            };

            // Check if original used 'Price' or 'price', update both/either
            if (editingBooking.Price !== undefined) updates.Price = editForm.price;
            if (editingBooking.price !== undefined) updates.price = editForm.price;

            // Check if original used 'PatientName' or 'patientName'
            if (editingBooking.PatientName !== undefined) updates.PatientName = editForm.patientName;
            if (editingBooking.patientName !== undefined) updates.patientName = editForm.patientName;

            await updateLabBooking(editingBooking.$id, updates);

            // Update local state
            setBookings(prev => prev.map(b =>
                b.$id === editingBooking.$id ? { ...b, ...updates } : b
            ));

            setIsEditDialogOpen(false);
            setEditingBooking(null);
            alert("Booking updated successfully");
        } catch (error) {
            console.error("Failed to update booking:", error);
            alert("Failed to update booking");
        } finally {
            setUpdating(false);
        }
    };

    const handleViewPrescriptions = async (userId, patientName) => {
        setIsPrescriptionDialogOpen(true);
        setPrescriptionLoading(true);
        setSelectedPatientName(patientName);
        setSelectedUserPrescriptions([]);

        try {
            const res = await getPrescriptions(userId);
            setSelectedUserPrescriptions(res.documents);
        } catch (error) {
            console.error("Failed to fetch user prescriptions:", error);
        } finally {
            setPrescriptionLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString("en-US", {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
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
                    <h1 className="text-2xl font-bold text-slate-900">Lab Test Bookings</h1>
                    <p className="text-slate-500">Manage patient diagnostic appointments.</p>
                </div>
                <div className="bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm">
                    <span className="text-sm font-medium text-slate-600">Total Bookings: </span>
                    <span className="font-bold text-teal-600">{bookings.length}</span>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Microscope className="w-5 h-5 text-teal-600" />
                        All Appointments
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {bookings.length === 0 ? (
                        <div className="text-center py-10 text-slate-500">
                            No lab test bookings found.
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Test Name</TableHead>
                                    <TableHead>Patient Info</TableHead>
                                    <TableHead>Price</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Prescriptions</TableHead>
                                    <TableHead>Booked Date</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {bookings.map((booking) => (
                                    <TableRow key={booking.$id}>
                                        <TableCell className="font-medium text-slate-900">
                                            {booking.test}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                                                    <User className="w-4 h-4" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-sm">{booking.PatientName || booking.patientName || "Unknown"}</span>
                                                    <span className="text-xs text-slate-500">ID: {booking.userId?.substring(0, 5)}...</span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-mono">
                                            {booking.Price ? `Rs. ${booking.Price}` : booking.price ? `Rs. ${booking.price}` : "-"}
                                        </TableCell>
                                        <TableCell>
                                            <Select
                                                defaultValue={booking.Status || booking.status || "Pending"}
                                                onValueChange={(val) => handleStatusUpdate(booking.$id, val)}
                                            >
                                                <SelectTrigger className="w-[140px] h-8">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Pending">Pending</SelectItem>
                                                    <SelectItem value="Confirmed">Confirmed</SelectItem>
                                                    <SelectItem value="Sample Collected">Sample Collected</SelectItem>
                                                    <SelectItem value="Completed">Completed</SelectItem>
                                                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-teal-600 hover:text-teal-700 hover:bg-teal-50"
                                                onClick={() => handleViewPrescriptions(booking.userId, booking.PatientName || booking.patientName)}
                                            >
                                                <FileText className="w-4 h-4 mr-1" /> View History
                                            </Button>
                                        </TableCell>
                                        <TableCell className="text-slate-500 text-sm">
                                            <div className="flex items-center gap-1">
                                                <Calendar className="w-3 h-3" />
                                                {formatDate(booking.date || booking.$createdAt)}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-slate-500 hover:text-teal-600 hover:bg-teal-50"
                                                    onClick={() => handleEditClick(booking)}
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                                    onClick={() => handleDelete(booking.$id)}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            {/* Edit Booking Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Booking Details</DialogTitle>
                        <DialogDescription>Update test details or price.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                        <div className="space-y-2">
                            <Label>Test Name</Label>
                            <Input
                                value={editForm.test}
                                onChange={(e) => setEditForm({ ...editForm, test: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Patient Name</Label>
                            <Input
                                value={editForm.patientName}
                                onChange={(e) => setEditForm({ ...editForm, patientName: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Price (Rs)</Label>
                            <Input
                                value={editForm.price}
                                onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleUpdateSubmit} className="bg-teal-600 text-white" disabled={updating}>
                            {updating ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Changes"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* User Prescriptions Modal */}
            <Dialog open={isPrescriptionDialogOpen} onOpenChange={setIsPrescriptionDialogOpen}>
                <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Prescription History</DialogTitle>
                        <DialogDescription>
                            Uploaded prescriptions for <strong>{selectedPatientName}</strong>
                        </DialogDescription>
                    </DialogHeader>

                    {prescriptionLoading ? (
                        <div className="flex justify-center py-8">
                            <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
                        </div>
                    ) : selectedUserPrescriptions.length === 0 ? (
                        <div className="text-center py-12 text-slate-500 flex flex-col items-center">
                            <FileText className="w-12 h-12 mb-3 opacity-20" />
                            <p>No prescriptions found for this user.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            {selectedUserPrescriptions.map((rx) => (
                                <div key={rx.$id} className="border border-slate-200 rounded-lg overflow-hidden group">
                                    <div className="aspect-video bg-slate-100 relative">
                                        <img
                                            src={rx.prescription}
                                            alt="Rx"
                                            className="w-full h-full object-cover"
                                        />
                                        <a
                                            href={rx.prescription}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white gap-2 font-medium"
                                        >
                                            <Eye className="w-4 h-4" /> View Full Image
                                        </a>
                                    </div>
                                    <div className="p-3 bg-slate-50 text-xs text-slate-500 flex justify-between">
                                        <span>Uploaded: {formatDate(rx.uploadedAt || rx.$createdAt)}</span>
                                        <Badge variant="outline" className="text-[10px] h-5">{rx.status || "Pending"}</Badge>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AdminLabTests;

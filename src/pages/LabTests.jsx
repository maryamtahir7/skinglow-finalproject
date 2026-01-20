// src/pages/LabTests.jsx
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useUser } from "../context/UserContext";
import { addLabBooking } from "../backend/database";
import { useNavigate } from "react-router-dom";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    MapPin,
    Search,
    ShieldCheck,
    Microscope,
    Activity,
    Sun,
    Clock,
    BadgeCheck,
    ArrowRight,
    Loader2
} from "lucide-react";

const LabTests = () => {
    const { user } = useUser();
    const navigate = useNavigate();

    // Booking State
    const [bookingTest, setBookingTest] = useState(null); // The test object being booked
    const [patientName, setPatientName] = useState("");
    const [isBookingLoading, setIsBookingLoading] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const tests = [
        { name: "Full Body Checkup", price: 4999, original: 8500, discount: "41% OFF", time: "24 Hours", icon: Activity },
        { name: "Thyroid Profile (T3, T4, TSH)", price: 1200, original: 2500, discount: "52% OFF", time: "12 Hours", icon: Activity },
        { name: "Diabetes Screening (HbA1c)", price: 900, original: 1500, discount: "40% OFF", time: "12 Hours", icon: Activity },
        { name: "Vitamin D Total", price: 1800, original: 3000, discount: "40% OFF", time: "24 Hours", icon: Sun },
        { name: "CBC (Complete Blood Count)", price: 600, original: 1000, discount: "40% OFF", time: "6 Hours", icon: Microscope },
        { name: "Kidney Function Test (KFT)", price: 1500, original: 2800, discount: "46% OFF", time: "24 Hours", icon: Activity },
    ];

    const openBookingModal = (test) => {
        if (!user) {
            alert("Please login to book a test.");
            navigate("/login");
            return;
        }
        setBookingTest(test);
        setPatientName(user.name || ""); // Default to user's name
        setIsDialogOpen(true);
    };

    const handleConfirmBooking = async () => {
        if (!patientName.trim()) {
            alert("Please enter a patient name.");
            return;
        }

        setIsBookingLoading(true);

        try {
            // FIX: Capitalized keys to match your Appwrite Schema
            await addLabBooking({
                userId: user.$id,
                test: bookingTest.name,
                Price: bookingTest.price,       // Capitalized 'Price'
                Status: "Pending",              // Capitalized 'Status'
                PatientName: patientName,       // Capitalized 'PatientName'
                // Removed 'date' as it is not in your schema
            });

            setIsDialogOpen(false);
            alert("✅ Lab test booked successfully! Our team will contact you shortly.");
        } catch (error) {
            console.error("Booking failed:", error);
            alert(`Failed to book test. \nError: ${error.message}`);
        } finally {
            setIsBookingLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            {/* Hero */}
            <div className="bg-blue-600 text-white py-12 px-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full blur-3xl opacity-50 -mr-16 -mt-16"></div>
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
                    <div>
                        <div className="inline-flex items-center bg-blue-500/50 rounded-full px-4 py-1.5 text-xs font-bold mb-4 border border-blue-400">
                            <ShieldCheck className="w-4 h-4 mr-2" /> ISO Certified Labs
                        </div>
                        <h1 className="text-4xl font-bold mb-4">Diagnostic Lab Tests in Pakistan</h1>
                        <p className="text-blue-100 text-lg max-w-xl mb-6">
                            Book reliable lab tests in Faisalabad & more. Free home sample collection.
                        </p>
                        <Button className="bg-white text-blue-600 hover:bg-blue-50 font-bold px-8 py-6 rounded-xl">
                            View Packages
                        </Button>
                    </div>
                    <div className="hidden md:block">
                        <Microscope className="w-48 h-48 text-blue-300/30" />
                    </div>
                </div>
            </div>

            {/* Search Bar */}
            <div className="max-w-4xl mx-auto -mt-8 px-6 relative z-20">
                <div className="bg-white rounded-2xl shadow-lg p-3 flex items-center gap-3 border border-slate-200">
                    <MapPin className="w-5 h-5 text-slate-400 ml-3" />
                    <input className="outline-none text-sm text-slate-600 font-medium" defaultValue="Faisalabad, Punjab" />
                    <div className="w-px h-8 bg-slate-200 mx-2"></div>
                    <Search className="w-5 h-5 text-slate-400" />
                    <input className="flex-1 outline-none text-base" placeholder="Search for tests (e.g. CBC, Lipid Profile)..." />
                    <Button className="bg-teal-600 hover:bg-teal-700 text-white rounded-xl">Search</Button>
                </div>
            </div>

            {/* Popular Packages */}
            <div className="max-w-7xl mx-auto px-6 py-16">
                <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-2">
                    <BadgeCheck className="w-6 h-6 text-teal-600" /> Popular Health Packages
                </h2>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tests.map((test, index) => (
                        <div key={index} className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-lg hover:border-teal-300 transition-all group cursor-pointer">
                            <div className="flex justify-between items-start mb-4">
                                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                                    <test.icon className="w-6 h-6" />
                                </div>
                                <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-md">{test.discount}</span>
                            </div>

                            <h3 className="text-xl font-bold text-slate-900 mb-2">{test.name}</h3>
                            <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
                                <Clock className="w-4 h-4" /> Reports in {test.time}
                            </div>

                            <div className="flex items-end justify-between border-t border-slate-100 pt-4">
                                <div>
                                    <div className="text-2xl font-bold text-slate-900">Rs. {test.price}</div>
                                    <div className="text-sm text-slate-400 line-through">Rs. {test.original}</div>
                                </div>
                                <Button
                                    onClick={() => openBookingModal(test)}
                                    variant="outline"
                                    className="border-teal-600 text-teal-700 hover:bg-teal-50 font-bold group-hover:bg-teal-600 group-hover:text-white transition-colors"
                                >
                                    Book <ArrowRight className="w-4 h-4 ml-1" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Booking Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Confirm Booking</DialogTitle>
                        <DialogDescription>
                            Enter patient details for <strong>{bookingTest?.name}</strong>.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="patientName">Patient Name</Label>
                            <Input
                                id="patientName"
                                value={patientName}
                                onChange={(e) => setPatientName(e.target.value)}
                                placeholder="Enter patient's full name"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label>Total Amount</Label>
                            <div className="font-bold text-xl text-teal-600">Rs. {bookingTest?.price}</div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleConfirmBooking} disabled={isBookingLoading} className="bg-teal-600 hover:bg-teal-700 text-white">
                            {isBookingLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
                                </>
                            ) : (
                                "Confirm Booking"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* How it works */}
            <div className="bg-white py-16 border-t border-slate-100">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <h2 className="text-2xl font-bold text-slate-900 mb-12">How it Works</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="flex flex-col items-center">
                            <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center text-teal-600 mb-4 font-bold text-xl">1</div>
                            <h3 className="font-bold text-lg mb-2">Book Test</h3>
                            <p className="text-slate-500 text-sm max-w-xs">Choose packages and schedule a convenient time.</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center text-teal-600 mb-4 font-bold text-xl">2</div>
                            <h3 className="font-bold text-lg mb-2">Sample Collection</h3>
                            <p className="text-slate-500 text-sm max-w-xs">Our certified electronic phlebotomist visits your home.</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center text-teal-600 mb-4 font-bold text-xl">3</div>
                            <h3 className="font-bold text-lg mb-2">Get Reports</h3>
                            <p className="text-slate-500 text-sm max-w-xs">Receive digital reports within 24-48 hours via email/app.</p>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default LabTests;

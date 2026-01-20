// src/pages/UploadPrescription.jsx
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useUser } from "../context/UserContext";
import { uploadImage } from "../backend/imageHandle";
import { addPrescription } from "../backend/database";
import { useNavigate, Link } from "react-router-dom";
import {
    Upload,
    FileText,
    X,
    CheckCircle,
    Shield,
    Camera,
    AlertCircle,
    Loader2
} from "lucide-react";

const UploadPrescription = () => {
    const { user } = useUser();
    const navigate = useNavigate();
    const [file, setFile] = useState(null);
    const [name, setName] = useState("");
    const [uploading, setUploading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!file || !name.trim()) {
            alert("Please enter patient name and select a prescription file.");
            return;
        }
        if (!user) {
            alert("Please login to upload a prescription.");
            navigate("/login");
            return;
        }

        setUploading(true);
        try {
            // 1. Upload Image
            const imageUrl = await uploadImage(file);

            // 2. Save to DB
            await addPrescription({
                prescription: imageUrl,
                userId: user.$id,
                username: name.trim()
            });

            setSuccess(true);
            setFile(null);
            setName("");
        } catch (error) {
            console.error("Prescription upload failed:", error);
            alert(`Failed to upload prescription. \nError: ${error.message}`);
        } finally {
            setUploading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
                <div className="bg-white p-10 rounded-2xl shadow-xl max-w-md w-full text-center animate-in zoom-in-95 duration-300">
                    <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-10 h-10 text-green-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Prescription Uploaded!</h2>
                    <p className="text-slate-500 mb-8">
                        Our pharmacist will review your prescription and create your order. You will receive a notification shortly.
                    </p>
                    <Link to="/products">
                        <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold h-12 rounded-xl shadow-lg shadow-teal-100">
                            Continue Shopping
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-6 font-sans">
            <div className="max-w-2xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-slate-900 mb-3">Upload Prescription</h1>
                    <p className="text-slate-600">
                        Please upload a valid prescription from a certified doctor.
                    </p>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                    {/* Patient Name Input */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-slate-700 mb-2">Patient Name</label>
                        <input
                            type="text"
                            placeholder="Enter your full name"
                            className="w-full h-12 px-4 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    {/* Upload Box */}
                    <div className="border-2 border-dashed border-slate-300 rounded-xl p-10 text-center hover:border-teal-500 hover:bg-teal-50 transition-all cursor-pointer relative group">
                        <input
                            type="file"
                            className="absolute inset-0 opacity-0 cursor-pointer z-10"
                            accept="image/*,.pdf"
                            onChange={handleFileChange}
                        />
                        <div className="flex flex-col items-center">
                            <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center text-teal-600 mb-4 group-hover:scale-110 transition-transform">
                                <Upload className="w-8 h-8" />
                            </div>
                            <h3 className="font-bold text-lg text-slate-800 mb-1">Click to Upload</h3>
                            <p className="text-slate-500 text-sm mb-4">or drag and drop here</p>
                            <p className="text-xs text-slate-400">Supported formats: JPG, PNG, PDF</p>
                        </div>
                    </div>

                    {/* Selected File */}
                    {file && (
                        <div className="mt-6 bg-slate-50 border border-slate-200 rounded-lg p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <FileText className="w-8 h-8 text-teal-600" />
                                <div>
                                    <div className="font-semibold text-slate-900 text-sm">{file.name}</div>
                                    <div className="text-xs text-slate-500">{(file.size / 1024).toFixed(0)} KB</div>
                                </div>
                            </div>
                            <button onClick={() => setFile(null)} className="p-1 hover:bg-slate-200 rounded-full">
                                <X className="w-4 h-4 text-slate-500" />
                            </button>
                        </div>
                    )}

                    {/* Guidelines */}
                    <div className="mt-8 space-y-4">
                        <h4 className="font-bold text-slate-900 text-sm uppercase tracking-wide">Guide for a valid prescription</h4>
                        <div className="flex items-start gap-3">
                            <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 text-slate-500 font-bold text-xs ring-1 ring-slate-200">1</div>
                            <p className="text-sm text-slate-600">Don't crop out any part of the image.</p>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 text-slate-500 font-bold text-xs ring-1 ring-slate-200">2</div>
                            <p className="text-sm text-slate-600">Avoid blurred image. Details should be clearly visible.</p>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 text-slate-500 font-bold text-xs ring-1 ring-slate-200">3</div>
                            <p className="text-sm text-slate-600">Include details of doctor and patient + clinic visit date.</p>
                        </div>
                    </div>

                    <Button
                        onClick={handleUpload}
                        disabled={!file || uploading}
                        className="w-full mt-8 bg-teal-600 hover:bg-teal-700 text-white font-bold h-12 rounded-xl shadow-lg shadow-teal-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        {uploading ? (
                            <span className="flex items-center gap-2">
                                <Loader2 className="w-4 h-4 animate-spin" /> Uploading...
                            </span>
                        ) : "Submit Prescription"}
                    </Button>
                </div>

                <div className="text-center mt-6 flex items-center justify-center gap-2 text-slate-500 text-sm">
                    <Shield className="w-4 h-4" /> Your data is secure and visible only to our pharmacists.
                </div>
            </div>
        </div>
    );
};

export default UploadPrescription;

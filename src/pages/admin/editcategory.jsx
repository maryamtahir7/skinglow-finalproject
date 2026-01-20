// src/pages/admin/EditCategory.jsx
import React, { useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { Layers, Image as ImageIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const EditCategory = ({ category, onSave, onCancel }) => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    useEffect(() => {
        if (category) {
            reset({
                name: category.name || "",
                imageUrl: category.imageUrl || "",
            });
        }
    }, [category, reset]);

    const handleKeyDown = useCallback(
        (e) => {
            if (e.key === "Escape") onCancel();
        },
        [onCancel]
    );

    useEffect(() => {
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [handleKeyDown]);

    if (!category) return null;

    const onSubmit = (data) => {
        onSave(category.$id, data);
    };

    return (
        <AnimatePresence>
            <motion.div
                key="backdrop"
                className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                onClick={onCancel}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                <motion.div
                    key="modal"
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    onClick={(e) => e.stopPropagation()}
                    className="w-full max-w-md"
                >
                    <Card className="shadow-2xl rounded-3xl border-0 overflow-hidden bg-card">
                        <CardHeader className="bg-primary text-primary-foreground text-center py-6 relative">
                            <button onClick={onCancel} className="absolute right-4 top-4 p-2 bg-white/10 rounded-full hover:bg-white/20 transition">
                                <X className="w-5 h-5 text-white" />
                            </button>
                            <CardTitle className="text-xl font-bold">Edit Category</CardTitle>
                        </CardHeader>

                        <CardContent className="px-8 py-8">
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                                <div className="relative">
                                    <Layers className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground" />
                                    <Input
                                        {...register("name", { required: "Name is required" })}
                                        placeholder="Category Name"
                                        className="pl-12 h-12 rounded-2xl border-border bg-secondary/10 focus:ring-primary focus:border-primary"
                                    />
                                    {errors.name && (
                                        <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
                                    )}
                                </div>

                                <div className="relative">
                                    <ImageIcon className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground" />
                                    <Input
                                        {...register("imageUrl")}
                                        placeholder="https://example.com/image.jpg"
                                        className="pl-12 h-12 rounded-2xl border-border bg-secondary/10 focus:ring-primary focus:border-primary"
                                    />
                                </div>

                                <div className="flex gap-3 pt-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={onCancel}
                                        className="flex-1 rounded-xl border-border text-muted-foreground hover:bg-secondary"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        className="flex-1 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg shadow-primary/20"
                                    >
                                        Save Changes
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default EditCategory;

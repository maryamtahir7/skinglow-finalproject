// src/pages/admin/EditProduct.jsx
import React, { useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package,
  FileText,
  Image as ImageIcon,
  Tag,
  X,
  Sparkles
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const EditProduct = ({ product, onSave, onCancel }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // Pre-fill form with product data
  useEffect(() => {
    if (product) {
      reset({
        name: product.name || "",
        price: product.price || "",
        category: product.category || "",
        description: product.description || "",
        imageUrl: product.imageUrl || "",
        imageUrl2: product.imageUrl2 || "",
        imageUrl3: product.imageUrl3 || "",
        Concerns: product.Concerns || "",
      });
    }
  }, [product, reset]);

  // Escape key closes modal
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

  if (!product) return null;

  const onSubmit = (data) => {
    // Ensure all fields are properly formatted and empty optional image URLs are set to empty string
    const updatedData = {
      name: String(data.name || "").trim(),
      price: Number(data.price) || 0,
      category: String(data.category || "").trim(),
      description: String(data.description || "").trim(),
      imageUrl: String(data.imageUrl || "").trim(),
      imageUrl2: String(data.imageUrl2 || "").trim(),
      imageUrl3: String(data.imageUrl3 || "").trim(),
      Concerns: String(data.Concerns || "").trim(),
    };

    // Validate required fields
    if (!updatedData.name) {
      alert("⚠️ Product name is required");
      return;
    }
    if (!updatedData.price || updatedData.price <= 0) {
      alert("⚠️ Valid price is required");
      return;
    }
    if (!updatedData.category) {
      alert("⚠️ Category is required");
      return;
    }

    onSave(product.$id, updatedData);
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
          className="w-full max-w-2xl"
        >
          <Card className="shadow-2xl rounded-3xl border-0 overflow-hidden bg-card">
            {/* Header */}
            <CardHeader className="bg-primary text-primary-foreground text-center py-6 relative">
              <button onClick={onCancel} className="absolute right-4 top-4 p-2 bg-white/10 rounded-full hover:bg-white/20 transition">
                <X className="w-5 h-5 text-white" />
              </button>
              <CardTitle className="text-2xl font-bold">Edit Product</CardTitle>
              <p className="text-sm opacity-90 mt-1">Update product details below</p>
            </CardHeader>

            {/* Content */}
            <CardContent className="px-8 py-8 max-h-[80vh] overflow-y-auto">
              <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Name */}
                <div className="relative">
                  <Package className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground" />
                  <Input
                    {...register("name", { required: "Name is required" })}
                    placeholder="Product Name"
                    className="pl-12 h-12 rounded-2xl border-border bg-secondary/10 focus:ring-primary focus:border-primary"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
                  )}
                </div>

                {/* Price */}
                <div className="relative">
                  <span className="absolute left-4 top-3.5 text-muted-foreground font-semibold">Rs.</span>
                  <Input
                    type="number"
                    step="0.01"
                    {...register("price", {
                      required: "Price is required",
                      valueAsNumber: true,
                      min: { value: 1, message: "Price must be at least 1" },
                    })}
                    placeholder="Price"
                    className="pl-12 h-12 rounded-2xl border-border bg-secondary/10 focus:ring-primary focus:border-primary"
                  />
                  {errors.price && (
                    <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>
                  )}
                </div>

                {/* Category */}
                <div className="relative md:col-span-2">
                  <Tag className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground" />
                  <Input
                    {...register("category", { required: "Category is required" })}
                    placeholder="Category"
                    className="pl-12 h-12 rounded-2xl border-border bg-secondary/10 focus:ring-primary focus:border-primary"
                  />
                  {errors.category && (
                    <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>
                  )}
                </div>

                {/* Description */}
                <div className="relative md:col-span-2">
                  <FileText className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground" />
                  <Textarea
                    {...register("description")}
                    placeholder="Product description, ingredients, benefits..."
                    className="pl-12 pt-3 min-h-[100px] rounded-2xl border-border bg-secondary/10 focus:ring-primary focus:border-primary resize-none"
                  />
                </div>

                {/* Concerns */}
                <div className="relative md:col-span-2">
                  <Sparkles className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground" />
                  <Input
                    {...register("Concerns")}
                    placeholder="Concerns (e.g. Acne, Dullness)"
                    className="pl-12 h-12 rounded-2xl border-border bg-secondary/10 focus:ring-primary focus:border-primary"
                  />
                </div>

                {/* Main Image URL */}
                <div className="relative md:col-span-2">
                  <ImageIcon className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground" />
                  <Input
                    {...register("imageUrl")}
                    placeholder="Main Image URL (required)"
                    className="pl-12 h-12 rounded-2xl border-border bg-secondary/10 focus:ring-primary focus:border-primary"
                  />
                  <p className="text-xs text-muted-foreground mt-1 ml-12">Primary product image</p>
                </div>

                {/* Additional Image URL 1 */}
                <div className="relative md:col-span-2">
                  <ImageIcon className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground opacity-50" />
                  <Input
                    {...register("imageUrl2")}
                    placeholder="Additional Image URL 1 (optional)"
                    className="pl-12 h-12 rounded-2xl border-border bg-secondary/10 focus:ring-primary focus:border-primary"
                  />
                  <p className="text-xs text-muted-foreground mt-1 ml-12">Second product image</p>
                </div>

                {/* Additional Image URL 2 */}
                <div className="relative md:col-span-2">
                  <ImageIcon className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground opacity-50" />
                  <Input
                    {...register("imageUrl3")}
                    placeholder="Additional Image URL 2 (optional)"
                    className="pl-12 h-12 rounded-2xl border-border bg-secondary/10 focus:ring-primary focus:border-primary"
                  />
                  <p className="text-xs text-muted-foreground mt-1 ml-12">Third product image</p>
                </div>

                {/* Buttons */}
                <div className="md:col-span-2 flex justify-end gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    className="rounded-xl px-6 border-border text-muted-foreground hover:bg-secondary"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="rounded-xl px-8 bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg shadow-primary/20"
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

export default EditProduct;

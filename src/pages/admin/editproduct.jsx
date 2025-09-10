// src/pages/admin/EditProduct.jsx
import React, { useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package,
  FileText,
  Image as ImageIcon,
  Tag,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

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
    onSave(product.$id, data);
  };

  return (
    <AnimatePresence>
      <motion.div
        key="backdrop"
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        onClick={onCancel}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          key="modal"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", stiffness: 220, damping: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          <Card className="w-full max-w-3xl shadow-2xl rounded-3xl border border-gray-200 bg-white overflow-hidden">
            {/* Header */}
            <CardHeader className="bg-indigo-700 text-white text-center py-6">
              <CardTitle className="text-2xl font-bold">Edit Product</CardTitle>
              <p className="text-sm opacity-80 mt-1">Update product details below</p>
            </CardHeader>

            {/* Content */}
            <CardContent className="px-10 py-8">
              <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Name */}
                <div className="relative">
                  <Package className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                  <Input
                    {...register("name", { required: "Name is required" })}
                    placeholder="Product Name"
                    className="pl-12 h-12 rounded-2xl border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-100"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
                  )}
                </div>

                {/* Price (Rs instead of $) */}
                <div className="relative">
                  <span className="absolute left-4 top-3.5 text-gray-500 font-semibold">₨</span>
                  <Input
                    type="number"
                    step="0.01"
                    {...register("price", {
                      required: "Price is required",
                      valueAsNumber: true,
                      min: { value: 1, message: "Price must be at least 1" },
                    })}
                    placeholder="Price"
                    className="pl-12 h-12 rounded-2xl border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-100"
                  />
                  {errors.price && (
                    <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>
                  )}
                </div>

                {/* Category */}
                <div className="relative md:col-span-2">
                  <Tag className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                  <Input
                    {...register("category", { required: "Category is required" })}
                    placeholder="Category"
                    className="pl-12 h-12 rounded-2xl border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-100"
                  />
                  {errors.category && (
                    <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>
                  )}
                </div>

                {/* Description */}
                <div className="relative md:col-span-2">
                  <FileText className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                  <Input
                    {...register("description")}
                    placeholder="Description"
                    className="pl-12 h-12 rounded-2xl border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-100"
                  />
                </div>

                {/* Image URL */}
                <div className="relative md:col-span-2">
                  <ImageIcon className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                  <Input
                    {...register("imageUrl")}
                    placeholder="https://example.com/image.jpg"
                    className="pl-12 h-12 rounded-2xl border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-100"
                  />
                </div>

                {/* Buttons */}
                <div className="md:col-span-2 flex justify-end gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    className="rounded-2xl px-6"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="rounded-2xl px-6 bg-indigo-600 hover:bg-indigo-700 shadow-md hover:scale-[1.03] transition-transform"
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

// src/pages/admin/AddProductForm.jsx
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  FileText,
  Image as ImageIcon,
  HomeIcon,
  ClipboardList,
  BoltIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { addProduct, getCategories } from "../../backend/database.js";
import { uploadImage } from "@/backend/imageHandle.js";

export default function AddProductForm() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getCategories();
        setCategories(res.documents);
      } catch (err) {
        console.error("❌ Fetch categories error:", err);
      }
    };
    fetchData();
  }, []);

  const onSubmit = async (data) => {
    if (!selectedCategory) {
      alert("⚠️ Please select a category");
      return;
    }

    setLoading(true);
    try {
      let imageUrl = "";
      if (data.image[0]) {
        imageUrl = await uploadImage(data.image[0]);
      }

      const product = {
        name: data.name,
        price: parseFloat(data.price),
        imageUrl,
        description: data.description,
        category: selectedCategory,
      };

      await addProduct(product);
      alert("✅ Product added successfully!");
      reset();
      setSelectedCategory("");
    } catch (error) {
      console.error("❌ Add product error:", error);
      alert("❌ Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navbar */}
      <header className="w-full bg-white shadow-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-indigo-700 font-bold text-xl">
            <LayoutDashboard className="h-6 w-6" /> Admin Dashboard
          </div>
          <nav className="hidden md:flex gap-4">
            <Link to="/admin" className="flex items-center gap-1 text-gray-700 hover:text-indigo-600 transition">
              <HomeIcon className="h-5 w-5" /> Home
            </Link>
            <Link to="/admin/products" className="flex items-center gap-1 text-gray-700 hover:text-indigo-600 transition">
              <Package className="h-5 w-5" /> Products
            </Link>
            <Link to="/admin/add-product" className="flex items-center gap-1 text-indigo-600 font-semibold transition">
              <PlusCircle className="h-5 w-5" /> Add
            </Link>
            <Link to="/admin/orders" className="flex items-center gap-1 text-gray-700 hover:text-indigo-600 transition">
              <ClipboardList className="h-5 w-5" /> Orders
            </Link>
            <Link to="/admin/categories" className="flex items-center gap-1 text-gray-700 hover:text-indigo-600 transition">
              <BoltIcon className="h-5 w-5" /> Categories
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Form */}
      <main className="flex-1 flex justify-center py-16 px-6">
        <Card className="w-full max-w-5xl shadow-2xl rounded-3xl border border-gray-200 bg-white">
          <CardHeader className="bg-indigo-700 text-white text-center py-8 rounded-t-3xl">
            <CardTitle className="text-3xl font-bold">Add New Product</CardTitle>
            <p className="text-sm opacity-90 mt-1">Fill in the details to create a product</p>
          </CardHeader>
          <CardContent className="px-12 py-10">
            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Product Name */}
              <div className="relative">
                <Package className="absolute left-4 top-3.5 h-5 w-5 text-gray-400 pointer-events-none" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Product Name"
                  className="pl-12 h-12 rounded-2xl border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-100"
                  {...register("name", { required: "Name is required" })}
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
              </div>

              {/* Price */}
              <div className="relative">
                <span className="absolute left-4 top-3.5 text-gray-400 font-semibold pointer-events-none">₨</span>
                <Input
                  id="price"
                  type="number"
                  placeholder="Price"
                  className="pl-12 h-12 rounded-2xl border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-100"
                  {...register("price", { required: "Price is required" })}
                />
                {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>}
              </div>

              {/* Category */}
              <div className="md:col-span-2">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full h-12 rounded-2xl border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-100">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.$id} value={cat.name}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Description */}
              <div className="md:col-span-2 relative">
                <FileText className="absolute left-4 top-3.5 h-5 w-5 text-gray-400 pointer-events-none" />
                <Input
                  id="description"
                  type="text"
                  placeholder="Description"
                  className="pl-12 h-12 rounded-2xl border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-100"
                  {...register("description", { required: "Description is required" })}
                />
                {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
              </div>

              {/* Image */}
              <div className="md:col-span-2 relative">
                <ImageIcon className="absolute left-4 top-3.5 h-5 w-5 text-gray-400 pointer-events-none" />
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  className="pl-12 h-12 rounded-2xl border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-100"
                  {...register("image")}
                />
              </div>

              {/* Submit */}
              <div className="md:col-span-2">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-lg hover:scale-[1.03] transition-transform"
                >
                  {loading ? "Adding..." : "Add Product"}
                </Button>
              </div>

            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

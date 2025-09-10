// src/pages/admin/AdminProducts.jsx
import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { getProducts, deleteProduct, updateProduct } from "../../backend/database.js";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import {
  Loader2,
  Edit,
  Trash2,
  LayoutDashboard,
  Package,
  PlusCircle,
  HomeIcon,
  BoltIcon,
  ImageOff,
  ClipboardList,
} from "lucide-react";

import DeleteProduct from "./deleteproduct";
import EditProduct from "./editproduct";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getProducts();
      setProducts(res.documents || []);
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleDeleteConfirm = async (id) => {
    try {
      await deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.$id !== id));
    } catch (err) {
      console.error("Failed to delete product:", err);
    } finally {
      setSelectedProduct(null);
    }
  };

  const handleEditSave = async (id, updatedData) => {
    try {
      const updated = await updateProduct(id, updatedData);
      setProducts((prev) =>
        prev.map((p) => (p.$id === id ? { ...p, ...updated } : p))
      );
    } catch (err) {
      console.error("Failed to update product:", err);
    } finally {
      setEditingProduct(null);
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
            <Link to="/admin/products" className="flex items-center gap-1 text-indigo-600 font-semibold transition">
              <Package className="h-5 w-5" /> Products
            </Link>
            <Link to="/admin/add-product" className="flex items-center gap-1 text-gray-700 hover:text-indigo-600 transition">
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

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-6 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">All Products</h2>
          <Link to="/admin/add-product">
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2">
              <PlusCircle className="w-5 h-5" /> Add New
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin w-10 h-10 text-indigo-600" />
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center py-20 text-gray-500">
            <ImageOff className="h-12 w-12 mb-3" />
            <p>No products found. Add your first product!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <Card key={product.$id} className="relative shadow-lg rounded-2xl overflow-hidden hover:shadow-2xl transition">
                <div className="h-48 w-full overflow-hidden bg-gray-100 flex items-center justify-center">
                  <img
                    src={product.imageUrl || "/placeholder.png"}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <CardContent className="px-4 py-5">
                  <h3 className="text-lg font-semibold text-gray-800 truncate">{product.name}</h3>
                  <p className="text-sm text-gray-500 mt-1 truncate">{product.category}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <Badge className="bg-indigo-100 text-indigo-700 font-semibold py-1 px-2 rounded-full">
                      ₨ {product.price}
                    </Badge>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex items-center gap-1"
                        onClick={() => setEditingProduct(product)}
                      >
                        <Edit className="w-4 h-4" /> Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="flex items-center gap-1"
                        onClick={() => setSelectedProduct(product)}
                      >
                        <Trash2 className="w-4 h-4" /> Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Modals */}
      <DeleteProduct
        product={selectedProduct}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setSelectedProduct(null)}
      />
      <EditProduct
        product={editingProduct}
        onSave={handleEditSave}
        onCancel={() => setEditingProduct(null)}
      />
    </div>
  );
}

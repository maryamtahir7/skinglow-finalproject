// src/pages/admin/Categories.jsx
import React, { useEffect, useState, useCallback } from "react";
import {
  addCategory,
  getCategories,
  updateCategory,
  deleteCategory,
} from "../../backend/database.js";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

import {
  BoltIcon,
  LayoutDashboard,
  Loader2,
  PlusCircle,
  Pencil,
  Trash2,
  FolderX,
  HomeIcon,
  Package,
  ClipboardList,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");

  // Fetch categories
  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getCategories();
      setCategories(res.documents || []);
    } catch (err) {
      console.error("Error fetching categories:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Add
  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;
    try {
      await addCategory({ name: newCategory });
      setNewCategory("");
      fetchCategories();
    } catch (err) {
      console.error("Failed to add category:", err);
    }
  };

  // Update
  const handleUpdateCategory = async (id) => {
    if (!editingName.trim()) return;
    try {
      await updateCategory(id, { name: editingName });
      setEditingId(null);
      setEditingName("");
      fetchCategories();
    } catch (err) {
      console.error("Failed to update category:", err);
    }
  };

  // Delete
  const handleDeleteCategory = async (id) => {
    try {
      await deleteCategory(id);
      setCategories((prev) => prev.filter((c) => c.$id !== id));
    } catch (err) {
      console.error("Failed to delete category:", err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-white to-indigo-50">
      {/* Top Navigation */}
      <header className="w-full bg-white/80 backdrop-blur-lg border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-indigo-700 font-extrabold text-xl">
            <LayoutDashboard className="h-6 w-6" />
            Admin Dashboard
          </div>
          <nav className="hidden md:flex gap-4">
            <Link
              to="/admin"
              className="flex items-center gap-1 text-gray-700 hover:text-indigo-600 transition"
            >
              <HomeIcon className="h-5 w-5" /> Home
            </Link>
            <Link
              to="/admin/products"
              className="flex items-center gap-1 text-gray-700 hover:text-indigo-600 transition"
            >
              <Package className="h-5 w-5" /> Products
            </Link>
            <Link
              to="/admin/add-product"
              className="flex items-center gap-1 text-gray-700 hover:text-indigo-600 transition"
            >
              <PlusCircle className="h-5 w-5" /> Add
            </Link>
            <Link
              to="/admin/orders"
              className="flex items-center gap-1 text-gray-700 hover:text-indigo-600 transition"
            >
              <ClipboardList className="h-5 w-5" /> Orders
            </Link>
            <Link
              to="/admin/categories"
              className="flex items-center gap-1 text-indigo-600 font-semibold transition"
            >
              <BoltIcon className="h-5 w-5" /> Categories
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-6 py-10 space-y-8">
        {/* Add Category */}
        <Card className="shadow-lg rounded-2xl border-none bg-white">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-gray-800">
              Add New Category
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row gap-3 items-center">
            <Input
              placeholder="Enter category name"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="flex-1"
            />
            <Button
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white"
              onClick={handleAddCategory}
            >
              <PlusCircle className="h-4 w-4" /> Add Category
            </Button>
          </CardContent>
        </Card>

        {/* Category List */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {loading ? (
            <div className="col-span-full flex justify-center p-6">
              <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
            </div>
          ) : categories.length === 0 ? (
            <div className="col-span-full flex flex-col items-center py-12 text-gray-500">
              <FolderX className="h-12 w-12 mb-3" />
              <p>No categories found. Add your first one!</p>
            </div>
          ) : (
            categories.map((cat) => (
              <Card
                key={cat.$id}
                className="flex flex-col justify-between p-5 rounded-2xl shadow-md hover:shadow-xl transition bg-white"
              >
                {editingId === cat.$id ? (
                  <div className="flex flex-col gap-3">
                    <Input
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      className="w-full"
                    />
                    <div className="flex gap-2 justify-end">
                      <Button size="sm" onClick={() => handleUpdateCategory(cat.$id)}>
                        Save
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => {
                          setEditingId(null);
                          setEditingName("");
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="font-semibold text-lg text-gray-800 mb-4">
                      {cat.name}
                    </div>
                    <div className="flex gap-2 justify-end">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex items-center gap-1"
                        onClick={() => {
                          setEditingId(cat.$id);
                          setEditingName(cat.name);
                        }}
                      >
                        <Pencil className="h-4 w-4" /> Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="flex items-center gap-1"
                        onClick={() => handleDeleteCategory(cat.$id)}
                      >
                        <Trash2 className="h-4 w-4" /> Delete
                      </Button>
                    </div>
                  </>
                )}
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  );
}

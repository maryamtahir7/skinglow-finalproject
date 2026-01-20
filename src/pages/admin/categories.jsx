// src/pages/admin/Categories.jsx
import React, { useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import {
  addCategory,
  getCategories,
  updateCategory,
  deleteCategory,
} from "../../backend/database.js";
import { uploadImage } from "@/backend/imageHandle.js";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import EditCategory from "./editcategory";

import {
  Loader2,
  PlusCircle,
  Pencil,
  Trash2,
  FolderX,
  Layers,
  Search,
  Image as ImageIcon
} from "lucide-react";

export default function Categories() {
  // Use React Hook Form for Add Category
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const [search, setSearch] = useState("");

  // Image State for Add Form
  const [imagePreview, setImagePreview] = useState(null);
  const [useUrl, setUseUrl] = useState(false);

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

  // Handle Image Selection for Add Form
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Add Category Submit
  const onAddSubmit = async (data) => {
    setAdding(true);
    try {
      let finalImageUrl = "";

      if (useUrl) {
        finalImageUrl = data.imageUrl || "https://via.placeholder.com/150";

        // Validation: Check for Data URIs (Base64) which are too long
        if (finalImageUrl.startsWith("data:")) {
          alert("❌ Invalid URL format.\n\nYou pasted a Base64 image data string (starting with 'data:'), which is too long for the database.\n\nPlease use the 'Upload File' tab to upload this image instead, or paste a standard short URL (starting with 'http').");
          setAdding(false);
          return;
        }
        if (finalImageUrl.length > 2000) {
          alert("❌ URL is too long.\n\nPlease use a shorter URL or upload the image directly using the 'Upload File' tab.");
          setAdding(false);
          return;
        }

      } else {
        if (data.image && data.image[0]) {
          finalImageUrl = await uploadImage(data.image[0]);
        }
      }

      await addCategory({
        name: data.name,
        imageUrl: finalImageUrl
      });

      // Reset
      reset();
      setImagePreview(null);
      setUseUrl(false);
      fetchCategories();

    } catch (err) {
      console.error("Failed to add category:", err);
      alert(`Failed to add category.\nError: ${err.message || err} `);
    } finally {
      setAdding(false);
    }
  };

  // Update Category (Using Modal)
  const handleUpdateSave = async (id, updates) => {
    try {
      await updateCategory(id, updates);
      setEditingCategory(null);
      fetchCategories();
    } catch (err) {
      console.error("Failed to update category:", err);
      alert("Failed to update category");
    }
  };

  // Delete Category
  const handleDeleteCategory = async (id) => {
    if (!window.confirm("Are you sure? This might affect products linked to this category.")) return;
    try {
      await deleteCategory(id);
      setCategories((prev) => prev.filter((c) => c.$id !== id));
    } catch (err) {
      console.error("Failed to delete category:", err);
    }
  };

  const filteredCategories = categories.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Categories</h1>
          <p className="text-muted-foreground text-sm">Organize your skincare products.</p>
        </div>
        <div className="w-full sm:w-1/3 max-w-sm relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            className="w-full pl-9 pr-4 py-2 text-sm bg-card border border-border rounded-lg focus:ring-2 focus:ring-primary outline-none"
            placeholder="Search categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Add Category Form (Using react-hook-form) */}
      <div className="bg-card p-6 rounded-xl border border-border shadow-sm grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div>
            <Label className="text-foreground">Category Name</Label>
            <Input
              placeholder="e.g. Serums, Cleansers..."
              {...register("name", { required: "Name is required" })}
              className="mt-1 bg-secondary/10 border-border focus:ring-primary"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>

          {/* Image Source Toggle */}
          <div>
            <Label className="mb-2 block text-foreground">Category Image</Label>
            <div className="flex gap-2 mb-3">
              <button
                type="button"
                onClick={() => setUseUrl(false)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md border transition-all ${!useUrl ? 'bg-secondary/50 border-primary text-primary' : 'bg-card border-border text-muted-foreground'} `}
              >
                Upload File
              </button>
              <button
                type="button"
                onClick={() => setUseUrl(true)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md border transition-all ${useUrl ? 'bg-secondary/50 border-primary text-primary' : 'bg-card border-border text-muted-foreground'} `}
              >
                Image URL
              </button>
            </div>

            {useUrl ? (
              <Input
                placeholder="https://example.com/image.jpg"
                {...register("imageUrl")}
                onChange={(e) => {
                  setValue("imageUrl", e.target.value);
                  setImagePreview(e.target.value);
                }}
                className="bg-secondary/10 border-border"
              />
            ) : (
              <div className="border-2 border-dashed border-border rounded-lg p-3 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-secondary/10 transition" onClick={() => document.getElementById('cat-image-upload').click()}>
                <ImageIcon className="w-5 h-5 text-muted-foreground mb-1" />
                <span className="text-xs text-muted-foreground">Click to upload</span>
                <input
                  id="cat-image-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  {...register("image", { onChange: handleImageChange })}
                />
              </div>
            )}
          </div>
        </div>

        {/* Preview & Action */}
        <div className="flex flex-col gap-4">
          <div className="flex-1 bg-secondary/5 rounded-lg border border-border flex items-center justify-center overflow-hidden relative">
            {imagePreview ? (
              <img src={imagePreview} alt="Preview" className="w-full h-32 object-contain" />
            ) : (
              <div className="text-muted-foreground/30 flex flex-col items-center">
                <ImageIcon className="w-8 h-8 mb-1" />
                <span className="text-xs">No Preview</span>
              </div>
            )}
          </div>
          <Button
            className="bg-primary hover:bg-primary/90 text-primary-foreground w-full shadow-lg shadow-primary/20"
            onClick={handleSubmit(onAddSubmit)}
            disabled={adding}
          >
            {adding ? <Loader2 className="h-4 w-4 animate-spin" /> : <PlusCircle className="h-4 w-4 mr-2" />}
            Save Category
          </Button>
        </div>
      </div>

      {/* Category List */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {loading && !categories.length ? (
          <div className="col-span-full flex justify-center p-6">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="col-span-full flex flex-col items-center py-12 text-muted-foreground">
            <FolderX className="h-12 w-12 mb-3 opacity-50" />
            <p>No categories found.</p>
          </div>
        ) : (
          filteredCategories.map((cat) => (
            <div
              key={cat.$id}
              className="bg-card p-4 rounded-xl border border-border shadow-sm hover:shadow-md hover:border-primary/30 transition group flex flex-col gap-3"
            >
              {/* Category Image */}
              <div className="h-32 bg-secondary/10 rounded-lg border border-border flex items-center justify-center overflow-hidden p-2">
                {cat.imageUrl ? (
                  <img src={cat.imageUrl} alt={cat.name} className="w-full h-full object-contain" />
                ) : (
                  <Layers className="w-10 h-10 text-border" />
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="font-semibold text-foreground line-clamp-1 text-sm">
                  {cat.name}
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6 text-muted-foreground hover:text-primary"
                    onClick={() => setEditingCategory(cat)}
                  >
                    <Pencil className="h-3 w-3" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6 text-muted-foreground hover:text-red-500"
                    onClick={() => handleDeleteCategory(cat.$id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <EditCategory
        category={editingCategory}
        onSave={handleUpdateSave}
        onCancel={() => setEditingCategory(null)}
      />
    </div>
  );
}

// src/pages/admin/AddProductForm.jsx
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import {
  Package,
  PlusCircle,
  Image as ImageIcon,
  ArrowLeft,
  Sparkles,
  FileSpreadsheet
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
import { Textarea } from "@/components/ui/textarea";

import { addProduct, getCategories, getProductByName } from "../../backend/database.js";
import * as XLSX from "xlsx";

export default function AddProductForm() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [loading, setLoading] = useState(false);
  const [bulkLoading, setBulkLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [bulkFileName, setBulkFileName] = useState("");

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
      const existing = await getProductByName(data.name);
      if (existing) {
        alert("⚠️ A product with this name already exists. Please choose a different name.");
        return;
      }

      let finalImageUrl = data.imageUrl || "https://via.placeholder.com/150";
      let extraImageUrl2 = data.imageUrl2 || "";
      let extraImageUrl3 = data.imageUrl3 || "";

      const product = {
        name: data.name,
        price: parseFloat(data.price),
        imageUrl: finalImageUrl,
        description: data.description,
        category: selectedCategory,
        concerns: data.Concerns || ""
      };

      // Try to add extra images if they exist (will fail silently if schema doesn't support them)
      if (extraImageUrl2) product.imageUrl2 = extraImageUrl2;
      if (extraImageUrl3) product.imageUrl3 = extraImageUrl3;

      try {
        await addProduct(product);
        alert("✅ Product added to inventory!");
      } catch (err) {
        // If schema doesn't support imageUrl2/imageUrl3, try without them
        if (err.message?.includes("Unknown attribute") && (extraImageUrl2 || extraImageUrl3)) {
          const productWithoutExtra = {
            name: data.name,
            price: parseFloat(data.price),
            imageUrl: finalImageUrl,
            description: data.description,
            category: selectedCategory,
          };
          await addProduct(productWithoutExtra);
          alert("✅ Product added! Note: To use multiple images, add 'imageUrl2' and 'imageUrl3' fields to your Appwrite database schema.");
        } else {
          throw err;
        }
      }
      reset();
      setSelectedCategory("");
      setImagePreview(null);
    } catch (error) {
      console.error("❌ Add product error:", error);
      alert("❌ Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  const handleBulkFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      setBulkFileName("");
      return;
    }
    setBulkFileName(file.name);
  };

  const handleBulkUpload = async () => {
    const input = document.getElementById("bulk-excel-upload");
    const file = input?.files?.[0];

    if (!file) {
      alert("⚠️ Please select an Excel file first.");
      return;
    }

    setBulkLoading(true);
    try {
      const reader = new FileReader();

      const productsFromFile = await new Promise((resolve, reject) => {
        reader.onerror = (err) => reject(err);
        reader.onload = (evt) => {
          try {
            const data = new Uint8Array(evt.target.result);
            const workbook = XLSX.read(data, { type: "array" });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const json = XLSX.utils.sheet_to_json(worksheet, { defval: "" });
            resolve(json);
          } catch (parseErr) {
            reject(parseErr);
          }
        };
        reader.readAsArrayBuffer(file);
      });

      if (!Array.isArray(productsFromFile) || productsFromFile.length === 0) {
        alert("⚠️ Excel file is empty or could not be read.");
        setBulkLoading(false);
        return;
      }

      // Expecting columns: name, price, description, category, imageUrl
      const categoryMap = new Map(
        categories.map((cat) => [String(cat.name).toLowerCase(), cat.name])
      );

      let successCount = 0;
      let failCount = 0;
      const errorsList = [];
      const fileNameSet = new Set();

      for (const [index, row] of productsFromFile.entries()) {
        const rowNumber = index + 2; // +2 because header is row 1
        const name = row.name || row.Name;
        const priceRaw = row.price ?? row.Price;
        const description = row.description || row.Description || "";
        const categoryNameRaw = row.category || row.Category;
        const imageUrl = row.imageUrl || row.ImageUrl || row.ImageURL || "";
        const imageUrl2 = row.imageUrl2 || row.ImageUrl2 || row.ImageURL2 || "";
        const imageUrl3 = row.imageUrl3 || row.ImageUrl3 || row.ImageURL3 || "";

        if (!name || !priceRaw || !categoryNameRaw) {
          failCount++;
          errorsList.push(
            `Row ${rowNumber}: Missing required fields (name, price, category).`
          );
          continue;
        }

        const normalizedName = String(name).trim().toLowerCase();
        if (fileNameSet.has(normalizedName)) {
          failCount++;
          errorsList.push(
            `Row ${rowNumber}: Duplicate product name "${name}" found in the same file.`
          );
          continue;
        }
        fileNameSet.add(normalizedName);

        let categoryKey = String(categoryNameRaw).toLowerCase().trim();
        let matchedCategory = categoryMap.get(categoryKey);

        // Fallback for UK/US spelling differences
        if (!matchedCategory) {
          if (categoryKey.includes('moisturiser')) {
            matchedCategory = categoryMap.get(categoryKey.replace('moisturiser', 'moisturizer'));
          } else if (categoryKey.includes('moisturizer')) {
            matchedCategory = categoryMap.get(categoryKey.replace('moisturizer', 'moisturiser'));
          }
        }

        if (!matchedCategory) {
          failCount++;
          errorsList.push(
            `Row ${rowNumber}: Category "${categoryNameRaw}" not found in system.`
          );
          continue;
        }

        const price = Number(priceRaw);
        if (Number.isNaN(price) || price <= 0) {
          failCount++;
          errorsList.push(`Row ${rowNumber}: Invalid price "${priceRaw}".`);
          continue;
        }

        const productPayload = {
          name: String(name),
          price,
          imageUrl: imageUrl || "https://via.placeholder.com/150",
          imageUrl2: imageUrl2 || "",
          imageUrl3: imageUrl3 || "",
          description: String(description || ""),
          category: matchedCategory,
          concerns: row.Concerns || row.concerns || ""
        };

        try {
          const existing = await getProductByName(name);
          if (existing) {
            failCount++;
            errorsList.push(
              `Row ${rowNumber}: Product "${name}" already exists in the system.`
            );
            continue;
          }

          await addProduct(productPayload);
          successCount++;
        } catch (err) {
          console.error("Bulk add product error:", err);
          failCount++;
          errorsList.push(`Row ${rowNumber}: Failed to add product.`);
        }
      }

      let message = `✅ Bulk upload finished.\n\nSuccessfully added: ${successCount}\nFailed: ${failCount}`;
      if (errorsList.length) {
        message += `\n\nIssues:\n- ${errorsList.slice(0, 10).join("\n- ")}`;
        if (errorsList.length > 10) {
          message += `\n- ...and ${errorsList.length - 10} more.`;
        }
      }
      alert(message);
      if (input) {
        input.value = "";
      }
      setBulkFileName("");
    } catch (err) {
      console.error("❌ Bulk upload error:", err);
      alert("❌ Failed to process Excel file. Please check the format.");
    } finally {
      setBulkLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Add New Product</h1>
          <p className="text-muted-foreground text-sm">Create a new item for your skincare collection.</p>
        </div>
        <Link to="/admin/products">
          <Button variant="outline" className="border-border text-muted-foreground hover:bg-secondary">
            <ArrowLeft className="w-4 h-4 mr-2" /> Cancel
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Main Details */}
          <Card className="shadow-sm border-border bg-card">
            <CardHeader>
              <CardTitle className="text-lg text-foreground">Product Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-foreground">Product Name</Label>
                <div className="relative">
                  <Package className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    className="pl-9 border-border bg-secondary/10 focus:ring-primary"
                    placeholder="e.g. Radiance Serum"
                    {...register("name", { required: "Name is required" })}
                  />
                </div>
                {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
              </div>

              <div className="space-y-2">
                <Label className="text-foreground">Description</Label>
                <Textarea
                  className="min-h-[100px] border-border bg-secondary/10 focus:ring-primary"
                  placeholder="Ingredients, benefits, and how to use..."
                  {...register("description", { required: "Description is required" })}
                />
                {errors.description && <p className="text-red-500 text-xs">{errors.description.message}</p>}
              </div>

              <div className="space-y-2">
                <Label className="text-foreground">Concerns (Optional)</Label>
                <div className="relative">
                  <Sparkles className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    className="pl-9 border-border bg-secondary/10 focus:ring-primary"
                    placeholder="e.g. Acne, Dullness, Aging"
                    {...register("Concerns")}
                  />
                </div>
                <p className="text-xs text-muted-foreground">Comma-separated concerns (e.g., "Acne, Dryness")</p>
              </div>
            </CardContent>
          </Card>

          {/* Pricing & Inventory */}
          <Card className="shadow-sm border-border bg-card">
            <CardHeader>
              <CardTitle className="text-lg text-foreground">Pricing & Category</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-foreground">Price (PKR)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-bold text-xs">Rs.</span>
                  <Input
                    type="number"
                    className="pl-9 border-border bg-secondary/10 focus:ring-primary"
                    placeholder="0.00"
                    {...register("price", { required: "Price is required" })}
                  />
                </div>
                {errors.price && <p className="text-red-500 text-xs">{errors.price.message}</p>}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-foreground">Category</Label>
                  <Link to="/admin/categories" className="text-xs text-primary hover:underline font-medium">+ Manage Categories</Link>
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="border-border bg-secondary/10 focus:ring-primary">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.$id} value={cat.name}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>


        {/* Image Upload or URL */}
        <Card className="shadow-sm border-border bg-card">
          <CardHeader>
            <CardTitle className="text-lg text-foreground">Product Image</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="space-y-2">
                <Label className="text-foreground text-xs">Main Image URL</Label>
                <Input
                  placeholder="https://example.com/main-image.jpg"
                  {...register("imageUrl")}
                  className="bg-secondary/10 border-border"
                  onChange={(e) => setImagePreview(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-foreground text-xs">Additional Image URL 1 (optional)</Label>
                <Input
                  placeholder="https://example.com/angle-1.jpg"
                  {...register("imageUrl2")}
                  className="bg-secondary/10 border-border"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-foreground text-xs">Additional Image URL 2 (optional)</Label>
                <Input
                  placeholder="https://example.com/angle-2.jpg"
                  {...register("imageUrl3")}
                  className="bg-secondary/10 border-border"
                />
              </div>
            </div>

            {/* Preview */}
            {imagePreview && (
              <div className="mt-4 border border-border rounded-lg overflow-hidden bg-secondary/10 flex justify-center p-2">
                <img src={imagePreview} alt="Preview" className="max-h-40 object-contain" onError={(e) => e.target.style.display = 'none'} />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Bulk Upload via Excel */}
        <Card className="shadow-sm border-border bg-card lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-lg text-foreground flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-primary" />
              Bulk Upload Products (Excel)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Upload an Excel file to add multiple products at once. The first sheet should have
              columns: <span className="font-semibold text-foreground">name, price, description, category, imageUrl</span>.
              Category names must already exist in the system.
            </p>
            <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
              <Input
                id="bulk-excel-upload"
                type="file"
                accept=".xlsx,.xls,.csv"
                className="max-w-xs bg-secondary/10 border-border"
                onChange={handleBulkFileChange}
              />
              <Button
                type="button"
                onClick={handleBulkUpload}
                disabled={bulkLoading}
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
              >
                {bulkLoading ? "Uploading..." : "Upload & Add Products"}
              </Button>
              {bulkFileName && (
                <span className="text-xs text-muted-foreground">
                  Selected: <span className="font-medium text-foreground">{bulkFileName}</span>
                </span>
              )}
            </div>
          </CardContent>
        </Card>

        <Button
          onClick={handleSubmit(onSubmit)}
          disabled={loading}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-12 rounded-xl shadow-lg shadow-primary/20 lg:col-span-3"
        >
          {loading ? (
            <>Adding Product...</>
          ) : (
            <><PlusCircle className="w-5 h-5 mr-2" /> Add to Collection</>
          )}
        </Button>
      </div>
    </div>
  );
}

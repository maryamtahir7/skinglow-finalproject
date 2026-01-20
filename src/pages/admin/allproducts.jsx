// src/pages/admin/AdminProducts.jsx
import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { getProducts, deleteProduct, updateProduct } from "../../backend/database.js";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  Edit,
  Trash2,
  PlusCircle,
  Search,
  Filter,
  FileSpreadsheet,
  AlertCircle,
  Package
} from "lucide-react";
import DeleteProduct from "./deleteproduct";
import EditProduct from "./editproduct";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);

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
      // Collect all images (main + additional)
      const images = [
        updatedData.imageUrl?.trim(),
        updatedData.imageUrl2?.trim(),
        updatedData.imageUrl3?.trim()
      ].filter(Boolean); // Remove empty strings

      // Store images as JSON string in imageUrl field (workaround if schema doesn't support multiple fields)
      // If you've added imageUrl2 and imageUrl3 to Appwrite schema, use the commented code below instead
      const dataToSave = {
        name: String(updatedData.name || ""),
        price: Number(updatedData.price) || 0,
        category: String(updatedData.category || ""),
        description: String(updatedData.description || ""),
        imageUrl: images.length > 0 ? images[0] : "", // Keep main image in imageUrl
        // Store additional images as JSON in description or use a separate field if available
        // For now, we'll try to save imageUrl2 and imageUrl3, but catch the error gracefully
      };

      // Try to save with additional image fields (will fail if schema doesn't support them)
      try {
        const dataWithExtraImages = {
          ...dataToSave,
          imageUrl2: String(updatedData.imageUrl2 || ""),
          imageUrl3: String(updatedData.imageUrl3 || ""),
        };
        const updated = await updateProduct(id, dataWithExtraImages);
        console.log("Product updated successfully with multiple images:", updated);
        await fetchProducts();
        alert("✅ Product updated successfully!");
      } catch (schemaError) {
        // If schema doesn't support imageUrl2/imageUrl3, save without them
        if (schemaError.message?.includes("Unknown attribute")) {
          console.warn("Schema doesn't support imageUrl2/imageUrl3, saving without them");
          const updated = await updateProduct(id, dataToSave);
          console.log("Product updated successfully (without extra images):", updated);
          await fetchProducts();
          alert("✅ Product updated! Note: Multiple images feature requires adding imageUrl2 and imageUrl3 fields to your Appwrite database schema.");
        } else {
          throw schemaError;
        }
      }
    } catch (err) {
      console.error("Failed to update product:", err);
      alert(`❌ Failed to update product: ${err.message || "Unknown error"}`);
    } finally {
      setEditingProduct(null);
    }
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.category && p.category.toLowerCase().includes(search.toLowerCase()))
  );

  const toggleSelectOne = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };

  const allVisibleSelected =
    filteredProducts.length > 0 &&
    filteredProducts.every((p) => selectedIds.includes(p.$id));

  const toggleSelectAllVisible = () => {
    if (allVisibleSelected) {
      // unselect all visible
      const visibleIds = new Set(filteredProducts.map((p) => p.$id));
      setSelectedIds((prev) => prev.filter((id) => !visibleIds.has(id)));
    } else {
      // add all visible
      const visibleIds = filteredProducts.map((p) => p.$id);
      setSelectedIds((prev) => Array.from(new Set([...prev, ...visibleIds])));
    }
  };

  const selectAllProducts = () => {
    const allIds = products.map((p) => p.$id);
    setSelectedIds(allIds);
  };

  const clearSelection = () => {
    setSelectedIds([]);
  };

  const allProductsSelected = products.length > 0 && selectedIds.length === products.length;

  const handleBulkDelete = async () => {
    if (!selectedIds.length) {
      alert("Please select at least one product to delete.");
      return;
    }
    if (
      !window.confirm(
        `Are you sure you want to delete ${selectedIds.length} selected product(s)? This cannot be undone.`
      )
    ) {
      return;
    }
    try {
      setLoading(true);
      await Promise.all(selectedIds.map((id) => deleteProduct(id)));
      setProducts((prev) => prev.filter((p) => !selectedIds.includes(p.$id)));
      setSelectedIds([]);
    } catch (err) {
      console.error("Failed to bulk delete products:", err);
      alert("Failed to delete some products. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Product Inventory</h2>
          <p className="text-muted-foreground text-sm">Manage stock, prices, and product details.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-border text-muted-foreground">
            <FileSpreadsheet className="w-4 h-4 mr-2" /> Export CSV
          </Button>
          <Link to="/admin/add-product">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <PlusCircle className="w-4 h-4 mr-2" /> Add Product
            </Button>
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 bg-card p-4 rounded-xl border border-border shadow-sm">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <input
            className="w-full pl-9 pr-4 py-2 bg-secondary/20 border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none"
            placeholder="Search by name, category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button variant="ghost" className="text-muted-foreground hover:text-primary">
          <Filter className="w-4 h-4 mr-2" /> Filters
        </Button>
        {selectedIds.length > 0 && (
          <Button
            variant="outline"
            onClick={clearSelection}
            className="text-muted-foreground hover:text-foreground"
          >
            Clear Selection
          </Button>
        )}
        <Button
          variant="outline"
          onClick={selectAllProducts}
          disabled={allProductsSelected || products.length === 0}
          className="text-muted-foreground hover:text-foreground"
        >
          Select All Products ({products.length})
        </Button>
        <Button
          variant="destructive"
          className="ml-auto"
          disabled={!selectedIds.length}
          onClick={handleBulkDelete}
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Delete Selected ({selectedIds.length || 0})
        </Button>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin w-8 h-8 text-primary" />
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center py-20 text-muted-foreground">
            <AlertCircle className="w-10 h-10 mb-2 text-muted-foreground/50" />
            <p>No products found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-muted-foreground">
              <thead className="bg-secondary/40 text-foreground font-semibold border-b border-border">
                <tr>
                  <th className="px-4 py-4 w-10">
                    <input
                      type="checkbox"
                      checked={allVisibleSelected}
                      onChange={toggleSelectAllVisible}
                      title="Select all visible products"
                      className="cursor-pointer"
                    />
                  </th>
                  <th className="px-6 py-4">Product Name</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Availability</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredProducts.map((product) => (
                  <tr key={product.$id} className="hover:bg-secondary/20 transition-colors group">
                    <td className="px-4 py-4">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(product.$id)}
                        onChange={() => toggleSelectOne(product.$id)}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-secondary/50 rounded-lg flex items-center justify-center p-1 border border-border overflow-hidden">
                          {product.imageUrl ? (
                            <img src={product.imageUrl} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <Package className="w-5 h-5 text-muted-foreground" />
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-foreground">{product.name}</div>
                          <div className="text-xs text-muted-foreground">ID: {product.$id.substring(0, 8)}...</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-secondary rounded text-xs font-medium text-foreground border border-border">
                        {product.category || "Uncategorized"}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono font-medium text-foreground">
                      Rs. {product.price}
                    </td>
                    <td className="px-6 py-4">
                      <Badge className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 border-none shadow-none">
                        In Stock
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-primary" onClick={() => setEditingProduct(product)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-red-500" onClick={() => setSelectedProduct(product)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

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

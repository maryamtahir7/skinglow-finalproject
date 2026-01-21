// src/pages/admin/StocksPage.jsx
import { useEffect, useState } from "react";
import {
  getStocks,
  addStock,
  updateStock,
  deleteStock,
  getProducts,
} from "../../backend/database";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Boxes, AlertTriangle, CheckCircle, Search, Plus, RefreshCw, Trash2, Edit2 } from "lucide-react";

export default function StocksPage() {
  const [stocks, setStocks] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadStocks();
    loadProducts();
  }, []);

  async function loadStocks() {
    setLoading(true);
    setError(null);
    try {
      const res = await getStocks();
      setStocks(res.documents || []);
    } catch (error) {
      console.error("Failed to load stocks:", error);
      setError("Unable to load inventory. Please check your Appwrite configuration (VITE_APPWRITE_STOCK_ID).");
      setStocks([]);
    } finally {
      setLoading(false);
    }
  }

  async function loadProducts() {
    const res = await getProducts();
    setProducts(res.documents || []);
  }

  async function handleAddOrUpdateStock() {
    if (!productId || !quantity) {
      setError("Please select a product and enter quantity");
      setTimeout(() => setError(null), 3000);
      return;
    }

    try {
      const stockData = {
        productId,
        quantity: Number(quantity),
        status: Number(quantity) > 0 ? "available" : "out of stock",
      };

      if (editingId) {
        await updateStock(editingId, stockData);
      } else {
        await addStock(stockData);
      }

      setProductId("");
      setQuantity("");
      setEditingId(null);
      setError(null);
      loadStocks();
    } catch (error) {
      console.error("Failed to save stock:", error);
      setError(error.message || "Failed to save stock. Please check your configuration.");
      setTimeout(() => setError(null), 5000);
    }
  }

  async function handleEdit(stock) {
    setProductId(stock.productId);
    setQuantity(stock.quantity);
    setEditingId(stock.$id);
  }

  async function handleDelete(id) {
    if (confirm("Are you sure you want to delete this stock entry?")) {
      try {
        await deleteStock(id);
        setError(null);
        loadStocks();
      } catch (error) {
        console.error("Failed to delete stock:", error);
        setError("Failed to delete stock entry.");
        setTimeout(() => setError(null), 3000);
      }
    }
  }

  function getProductNameById(id) {
    const product = products.find((p) => p.$id === id);
    return product ? product.name : "Unknown Item";
  }

  function getProductImageById(id) {
    const product = products.find((p) => p.$id === id);
    return product?.imageUrl || "";
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Inventory Management</h1>
          <p className="text-slate-500 mt-1">Track stock levels and manage product availability.</p>
        </div>
        <Button onClick={loadStocks} variant="outline" className="border-slate-200 hover:bg-slate-50">
          <RefreshCw className="w-4 h-4 mr-2" /> Refresh
        </Button>
      </div>

      {error && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-amber-800">{error}</p>
            {error.includes("VITE_APPWRITE_STOCK_ID") && (
              <p className="text-xs text-amber-700 mt-1">
                To fix this, create a Stock collection in Appwrite and add <code className="bg-amber-100 px-1 rounded">VITE_APPWRITE_STOCK_ID</code> to your environment variables.
              </p>
            )}
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column: Form */}
        <Card className="lg:col-span-1 shadow-sm border border-slate-200 h-fit">
          <CardHeader className="bg-slate-50 border-b border-slate-100 py-4">
            <CardTitle className="text-sm font-bold text-slate-800 uppercase tracking-wide flex items-center gap-2">
              <Plus className="w-4 h-4 text-primary" /> {editingId ? "Update Stock" : "Add New Stock"}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Select Product</label>
              <select
                className="w-full border border-slate-200 rounded-lg px-3 py-2.5 bg-slate-50 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm transition-all"
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
              >
                <option value="">-- Choose Product --</option>
                {products.map((p) => (
                  <option key={p.$id} value={p.$id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Quantity to Add/Set</label>
              <Input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="bg-slate-50 border-slate-200 focus:ring-primary/20 focus:border-primary"
                placeholder="0"
              />
            </div>

            <div className="pt-2 flex gap-2">
              <Button className="flex-1 bg-primary hover:bg-primary/90 text-white font-bold" onClick={handleAddOrUpdateStock}>
                {editingId ? "Update Stock" : "Add to Inventory"}
              </Button>
              {editingId && (
                <Button variant="outline" onClick={() => { setProductId(""); setQuantity(""); setEditingId(null); }}>
                  Cancel
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Right Column: List */}
        <Card className="lg:col-span-2 shadow-sm border border-slate-200 overflow-hidden">
          <CardHeader className="bg-white border-b border-slate-100 py-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search inventory..."
                className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </CardHeader>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="py-20 flex justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : (
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4">Product</th>
                    <th className="px-6 py-4">Stock Level</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {stocks.filter(s => getProductNameById(s.productId).toLowerCase().includes(search.toLowerCase())).map((stock) => {
                    const productName = getProductNameById(stock.productId);
                    const isLow = stock.quantity < 10;
                    const isOut = stock.quantity <= 0;

                    return (
                      <tr key={stock.$id} className="hover:bg-slate-50/80 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-white border border-slate-100 p-1 flex items-center justify-center">
                              <img src={getProductImageById(stock.productId)} alt="" className="w-full h-full object-contain" />
                            </div>
                            <span className="font-medium text-slate-900 group-hover:text-primary transition-colors">{productName}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-mono font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded-md">{stock.quantity}</span>
                        </td>
                        <td className="px-6 py-4">
                          {isOut ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 border border-red-200">
                              <AlertTriangle className="w-3.5 h-3.5" /> Out of Stock
                            </span>
                          ) : isLow ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700 border border-amber-200">
                              <AlertTriangle className="w-3.5 h-3.5" /> Low Stock
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
                              <CheckCircle className="w-3.5 h-3.5" /> In Stock
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-500 hover:text-primary hover:bg-primary/5" onClick={() => handleEdit(stock)}>
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-500 hover:text-red-600 hover:bg-red-50" onClick={() => handleDelete(stock.$id)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {stocks.length === 0 && !loading && (
                    <tr>
                      <td colSpan="4" className="text-center py-12">
                        <div className="flex flex-col items-center gap-2">
                          <Boxes className="w-12 h-12 text-slate-300" />
                          <p className="text-muted-foreground font-medium">No inventory records found.</p>
                          <p className="text-sm text-slate-400">Add your first item using the form on the left!</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

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
import { Loader2, Boxes, AlertTriangle, CheckCircle, Search } from "lucide-react";

export default function StocksPage() {
  const [stocks, setStocks] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

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
    const res = await getStocks();
    setStocks(res.documents || []);
    setLoading(false);
  }

  async function loadProducts() {
    const res = await getProducts();
    setProducts(res.documents || []);
  }

  async function handleAddOrUpdateStock() {
    if (!productId || !quantity) {
      alert("Please select a product and enter quantity");
      return;
    }

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
    loadStocks();
  }

  async function handleEdit(stock) {
    setProductId(stock.productId);
    setQuantity(stock.quantity);
    setEditingId(stock.$id);
  }

  async function handleDelete(id) {
    if (confirm("Are you sure you want to delete this stock entry?")) {
      await deleteStock(id);
      loadStocks();
    }
  }

  function getProductNameById(id) {
    const product = products.find((p) => p.$id === id);
    return product ? product.name : "Unknown Item";
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Inventory & Stock</h1>
          <p className="text-slate-500 text-sm">Monitor medicine availability and restock alerts.</p>
        </div>
      </div>

      {/* Add / Edit Section */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="font-bold text-slate-800 mb-4 text-sm uppercase tracking-wide">
          {editingId ? "Update Stock Level" : "Add New Stock Entry"}
        </h3>
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="w-full md:w-1/3 space-y-2">
            <label className="text-xs font-semibold text-slate-500">Product</label>
            <select
              className="w-full border border-slate-200 rounded-lg px-3 py-2 bg-slate-50 focus:ring-2 focus:ring-teal-500 outline-none text-sm"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
            >
              <option value="">-- Select Product --</option>
              {products.map((p) => (
                <option key={p.$id} value={p.$id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div className="w-full md:w-1/4 space-y-2">
            <label className="text-xs font-semibold text-slate-500">Quantity (Units)</label>
            <Input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="bg-slate-50 border-slate-200 focus:ring-teal-500"
            />
          </div>

          <div className="flex gap-2">
            <Button className="bg-teal-600 hover:bg-teal-700 text-white min-w-[120px]" onClick={handleAddOrUpdateStock}>
              {editingId ? "Update" : "Add Stock"}
            </Button>
            {editingId && (
              <Button variant="outline" onClick={() => { setProductId(""); setQuantity(""); setEditingId(null); }}>
                Cancel
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Stock List */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-12 flex justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-slate-900 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 font-semibold">Product Name</th>
                  <th className="px-6 py-4 font-semibold">Current Stock</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {stocks.map((stock) => {
                  const productName = getProductNameById(stock.productId);
                  const isLow = stock.quantity < 10;
                  return (
                    <tr key={stock.$id} className="hover:bg-slate-50 transition">
                      <td className="px-6 py-4 font-medium text-slate-900 flex items-center gap-2">
                        <Boxes className="w-4 h-4 text-slate-400" />
                        {productName}
                      </td>
                      <td className="px-6 py-4 font-mono font-bold">
                        {stock.quantity}
                      </td>
                      <td className="px-6 py-4">
                        {stock.quantity > 0 ? (
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${isLow ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                            {isLow ? <AlertTriangle className="w-3 h-3" /> : <CheckCircle className="w-3 h-3" />}
                            {isLow ? "Low Stock" : "Available"}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700">
                            Out of Stock
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button className="text-teal-600 hover:text-teal-800 font-medium text-xs" onClick={() => handleEdit(stock)}>
                          Adjust Level
                        </button>
                        <button className="text-red-500 hover:text-red-700 font-medium text-xs" onClick={() => handleDelete(stock.$id)}>
                          Remove
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {stocks.length === 0 && (
                  <tr>
                    <td colSpan="4" className="text-center py-8 text-slate-400 italic">No stock records found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

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

export default function StocksPage() {
  const [stocks, setStocks] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [editingId, setEditingId] = useState(null);

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
      // Update
      await updateStock(editingId, stockData);
    } else {
      // Add
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
    if (confirm("Are you sure you want to delete this stock?")) {
      await deleteStock(id);
      loadStocks();
    }
  }

  // Helper: find product name from productId
  function getProductNameById(id) {
    const product = products.find((p) => p.$id === id);
    return product ? product.name : "Unknown";
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Stock Management</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <table className="w-full border-collapse border border-gray-200 text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-3 py-2">Product</th>
                  <th className="border px-3 py-2">Quantity</th>
                  <th className="border px-3 py-2">Status</th>
                  <th className="border px-3 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {stocks.map((stock) => (
                  <tr key={stock.$id}>
                    <td className="border px-3 py-2">
                      {getProductNameById(stock.productId)}
                    </td>
                    <td className="border px-3 py-2">{stock.quantity}</td>
                    <td className="border px-3 py-2">{stock.status}</td>
                    <td className="border px-3 py-2 flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(stock)}
                      >
                        ✏️ Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(stock.$id)}
                      >
                        🗑️ Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* --- Add / Update Stock Form --- */}
          <div className="mt-6 flex gap-3 items-center">
            {/* Product Dropdown */}
            <select
              className="border px-3 py-2 rounded w-1/3"
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

            <Input
              type="number"
              placeholder="Quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-1/3"
            />

            <Button
              className="bg-indigo-600 text-white"
              onClick={handleAddOrUpdateStock}
            >
              {editingId ? "✅ Update Stock" : "➕ Add Stock"}
            </Button>

            {editingId && (
              <Button
                variant="outline"
                onClick={() => {
                  setProductId("");
                  setQuantity("");
                  setEditingId(null);
                }}
              >
                ❌ Cancel
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

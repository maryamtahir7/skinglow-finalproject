// src/pages/ProductDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  getProductById,
  getProducts,
  addToCart,
  addToWishlist,
  getWishlist,
} from "../backend/database";
import {
  ArrowLeft,
  Heart,
  Truck,
  Shield,
  ShoppingCart,
  Zap,
  Package,
  Award,
  RefreshCw,
  Crown,
  Loader2,
  AlertCircle,
  Info,
  Plus,
  Minus,
  Share2,
  Scale,
  PhoneCall,
  MessageCircle,
} from "lucide-react";
import { useUser } from "../context/UserContext";

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [p, all] = await Promise.all([getProductById(id), getProducts()]);
        setProduct(p);

        // Related products
        const relatedProducts = (all.documents || [])
          .filter((d) => d.$id !== id && d.category === p.category)
          .slice(0, 4);
        setRelated(relatedProducts);

        // Wishlist check
        if (user) {
          const wishlist = await getWishlist(user.$id);
          const alreadyLiked = wishlist.documents.some((w) => w.productId === id);
          setIsLiked(alreadyLiked);
        }
      } catch (e) {
        console.error("Error loading product detail:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, user]);

  const ensureAuth = () => {
    if (!user) {
      alert("Please login to continue.");
      navigate("/login");
      return false;
    }
    return true;
  };

  const handleAddToCart = async () => {
    if (!ensureAuth()) return;
    try {
      await addToCart({
        userId: user.$id,
        productId: product.$id,
        quantity,
      });
      alert(`✅ Added ${quantity} item(s) to cart`);
    } catch (e) {
      console.error(e);
      alert("❌ Failed to add to cart");
    }
  };

  const handleAddToWishlist = async () => {
    if (!ensureAuth()) return;
    try {
      await addToWishlist({ userId: user.$id, productId: product.$id });
      setIsLiked(true);
      alert("❤️ Added to wishlist");
    } catch (e) {
      console.error(e);
      alert("❌ Failed to add to wishlist");
    }
  };

  const handleBuyNow = () => {
    if (!ensureAuth()) return;
    navigate("/checkout", { state: { buyNow: { product, quantity } } });
  };

  const handleQuantityChange = (delta) => {
    setQuantity((prev) => Math.max(1, prev + delta));
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin w-10 h-10 text-indigo-600" />
      </div>
    );
  }

  // Not found state
  if (!product) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Product Not Found
          </h2>
          <Button
            onClick={() => navigate("/products")}
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Products
          </Button>
        </div>
      </div>
    );
  }

  // Pricing
  const productPrice = Number(product.price || 0).toFixed(2);
  const originalPrice = (Number(product.price || 0) * 1.25).toFixed(2);
  const discountPercent = 20;
  const savings = (originalPrice - productPrice).toFixed(2);

  // Images
  const productImages = [product.imageUrl, product.imageUrl, product.imageUrl].filter(Boolean);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/products")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Products
          </Button>
          {user && (
            <span className="text-gray-700 font-medium">
              Welcome, {user.name || user.username}
            </span>
          )}
        </div>
      </div>

      {/* Product Detail */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Image Gallery */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
            <div className="aspect-square bg-gray-50 p-8 relative">
              <img
                src={productImages[selectedImage]}
                alt={product.name}
                className="w-full h-full object-contain rounded-xl"
              />
              <div className="absolute top-6 left-6 flex flex-col gap-2">
                <span className="px-3 py-1 bg-red-500 text-white text-sm font-bold rounded-lg shadow-lg">
                  {discountPercent}% OFF
                </span>
                {product.quantity > 0 && (
                  <span className="px-3 py-1 bg-green-500 text-white text-sm font-bold rounded-lg shadow-lg">
                    In Stock
                  </span>
                )}
              </div>
            </div>
            <div className="flex gap-4 p-4 bg-gray-50">
              {productImages.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`thumb-${i}`}
                  onClick={() => setSelectedImage(i)}
                  className={`w-20 h-20 object-contain cursor-pointer rounded-xl border ${
                    selectedImage === i ? "border-indigo-600" : "border-gray-200"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>
              <p className="text-lg text-gray-600">{product.description}</p>
            </div>

            {/* Pricing */}
            <div className="bg-gray-50 rounded-2xl p-6">
              <div className="flex items-baseline gap-4 mb-4">
                <span className="text-5xl font-black text-indigo-600">
                  Rs. {productPrice}
                </span>
                <span className="text-2xl text-gray-500 line-through">
                  Rs. {originalPrice}
                </span>
                <span className="px-3 py-1 bg-green-100 text-green-800 font-bold rounded-lg">
                  Save Rs. {savings}
                </span>
              </div>
              <div className="flex items-center gap-6 text-sm">
                <Truck className="w-5 h-5 text-indigo-600" />
                Free Delivery
                <Shield className="w-5 h-5 text-emerald-600 ml-4" />
                Secure Payment
                <Award className="w-5 h-5 text-blue-600 ml-4" />
                Warranty Included
              </div>
            </div>

            {/* Quantity & Actions */}
            <div className="space-y-6">
              <div className="flex items-center gap-6">
                <span className="font-semibold text-gray-900">Quantity:</span>
                <div className="flex items-center border rounded-xl">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="p-3 hover:bg-gray-100 disabled:opacity-50"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-6 py-3 font-bold">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    className="p-3 hover:bg-gray-100"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <span className="text-sm text-gray-600">
                  Total:{" "}
                  <span className="font-bold text-indigo-600">
                    Rs. {(product.price * quantity).toFixed(2)}
                  </span>
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Button
                  onClick={handleAddToCart}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Add to Cart
                </Button>
                <Button
                  onClick={handleBuyNow}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl"
                >
                  <Zap className="w-5 h-5 mr-2" />
                  Buy Now
                </Button>
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={handleAddToWishlist}
                  variant="outline"
                  className="flex-1 border-2 border-gray-200 hover:border-red-200 hover:bg-red-50"
                >
                  <Heart
                    className={`w-5 h-5 mr-2 ${
                      isLiked ? "text-red-500 fill-current" : ""
                    }`}
                  />
                  {isLiked ? "In Wishlist" : "Add to Wishlist"}
                </Button>
                <Button variant="outline" className="flex-1">
                  <Share2 className="w-5 h-5 mr-2" /> Share
                </Button>
                <Button variant="outline" className="flex-1">
                  <Scale className="w-5 h-5 mr-2" /> Compare
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-16">
          <div className="flex gap-6 border-b mb-6">
            {["description", "specs", "reviews", "shipping"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-2 font-semibold ${
                  activeTab === tab
                    ? "border-b-2 border-indigo-600 text-indigo-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {tab === "description" && "Description"}
                {tab === "specs" && "Specifications"}
                {tab === "reviews" && "Reviews"}
                {tab === "shipping" && "Shipping & Returns"}
              </button>
            ))}
          </div>
          <div>
            {activeTab === "description" && (
              <p className="text-gray-600">{product.description}</p>
            )}
            {activeTab === "specs" && (
              <ul className="list-disc ml-6 text-gray-600">
                <li>Category: {product.category}</li>
                <li>Stock: {product.quantity}</li>
                <li>Price: Rs. {product.price}</li>
              </ul>
            )}
            {activeTab === "reviews" && (
              <p className="text-gray-600">⭐ No reviews yet. Be the first!</p>
            )}
            {activeTab === "shipping" && (
              <p className="text-gray-600">
                Free shipping available. Returns accepted within 30 days.
              </p>
            )}
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
            <div className="text-center mb-12">
              <Crown className="w-6 h-6 text-indigo-600 mx-auto mb-3" />
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Related Products
              </h2>
              <p className="text-gray-600">
                Discover more amazing products from the same category
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {related.map((p) => (
                <div
                  key={p.$id}
                  onClick={() => navigate(`/products/${p.$id}`)}
                  className="group cursor-pointer hover:scale-105 transition-all"
                >
                  <div className="bg-white rounded-xl shadow-lg border border-gray-200 hover:border-indigo-300 overflow-hidden">
                    <div className="aspect-square bg-gray-50 p-4">
                      <img
                        src={p.imageUrl || "/placeholder.png"}
                        alt={p.name}
                        className="w-full h-full object-contain group-hover:scale-110 transition-transform"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-indigo-600">
                        {p.name}
                      </h3>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-gray-900">
                          Rs. {p.price}
                        </span>
                        <span className="text-sm text-gray-500">
                          {p.category}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductDetail;

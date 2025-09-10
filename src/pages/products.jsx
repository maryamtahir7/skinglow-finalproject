import React, { useEffect, useState } from "react";
import { getProducts, getCategories } from "../backend/database.js";
import Card from "../components/card";
import { useNavigate } from "react-router-dom";
import { 
  Loader2, 
  Search, 
  Filter, 
  X, 
  Grid, 
  List, 
  Star,
  ShoppingCart,
  Heart,
  Eye,
  Package,
  TrendingUp,
  Crown,
  Sparkles,
  ArrowRight,
  CheckCircle,
  ChevronDown
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("featured");
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [priceRange, setPriceRange] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        const prodData = await getProducts();
        setProducts(prodData.documents || []);

        const catData = await getCategories();
        setCategories(catData.documents || []);
      } catch (error) {
        console.error("Error fetching products or categories:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const filteredProducts = products.filter((product) => {
    const matchCategory =
      selectedCategory === "all" || product.category === selectedCategory;
    const matchSearch = product.name
      .toLowerCase()
      .includes(search.toLowerCase());
    
    // Price range filtering
    let matchPrice = true;
if (priceRange !== "all") {
  const price = parseFloat(product.price);
  switch (priceRange) {
    case "under-5000":
      matchPrice = price < 5000;
      break;
    case "5000-10000":
      matchPrice = price >= 5000 && price <= 10000;
      break;
    case "10000-20000":
      matchPrice = price >= 10000 && price <= 20000;
      break;
    case "over-20000":
      matchPrice = price > 20000;
      break;
    default:
      matchPrice = true;
  }
}

    
    return matchCategory && matchSearch && matchPrice;
  });

  // Sort products based on selection
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return parseFloat(a.price) - parseFloat(b.price);
      case "price-high":
        return parseFloat(b.price) - parseFloat(a.price);
      case "name":
        return a.name.localeCompare(b.name);
      default:
        return 0; // Keep original order for "featured"
    }
  });

  const clearFilters = () => {
    setSearch("");
    setSelectedCategory("all");
    setSortBy("featured");
    setPriceRange("all");
  };

  const hasActiveFilters = search !== "" || selectedCategory !== "all" || sortBy !== "featured" || priceRange !== "all";

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="w-20 h-20 bg-white rounded-2xl shadow-lg flex items-center justify-center mx-auto">
            <Loader2 className="animate-spin w-10 h-10 text-indigo-600" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Loading Products</h3>
            <p className="text-gray-600">Fetching the latest collection for you...</p>
          </div>
          <div className="w-48 h-2 bg-gray-200 rounded-full mx-auto overflow-hidden">
            <div className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-6 py-3 bg-indigo-100 text-indigo-800 rounded-full text-sm font-bold mb-6">
              <Crown className="w-5 h-5 mr-2" />
              Premium Collection
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
              Our Products
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover our curated selection of premium products with unbeatable quality and prices
            </p>
          </div>

          {/* Enhanced Search and Filter Bar */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
            <div className="space-y-6">
              {/* Main Search */}
              <div className="relative">
                <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
                <Input
                  type="text"
                  placeholder="Search products, brands, categories..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-16 pr-12 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:border-indigo-500 focus:ring-0 transition-all duration-200 bg-gray-50 hover:bg-white"
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200 hover:bg-gray-100 rounded-lg"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>

              {/* Filters Row */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Category Filter */}
                <div className="relative">
                  <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 z-10" />
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 bg-gray-50 hover:bg-white transition-all duration-200">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl shadow-xl border-0 bg-white">
                      <SelectItem value="all" className="py-3 px-4 hover:bg-indigo-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Package className="w-4 h-4 text-indigo-600" />
                          All Categories
                        </div>
                      </SelectItem>
                      {categories.map((cat) => (
                        <SelectItem
                          key={cat.$id}
                          value={cat.name}
                          className="py-3 px-4 hover:bg-indigo-50 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                            {cat.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Price Range Filter */}
                <div>
                  <Select value={priceRange} onValueChange={setPriceRange}>
                    <SelectTrigger className="py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 bg-gray-50 hover:bg-white transition-all duration-200">
                      <SelectValue placeholder="Price Range" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl shadow-xl border-0 bg-white">
  <SelectItem value="all" className="py-3 px-4 hover:bg-indigo-50 rounded-lg">
    All Prices
  </SelectItem>
  <SelectItem value="under-5000" className="py-3 px-4 hover:bg-indigo-50 rounded-lg">
    Under Rs. 5,000
  </SelectItem>
  <SelectItem value="5000-10000" className="py-3 px-4 hover:bg-indigo-50 rounded-lg">
    Rs. 5,000 - Rs. 10,000
  </SelectItem>
  <SelectItem value="10000-20000" className="py-3 px-4 hover:bg-indigo-50 rounded-lg">
    Rs. 10,000 - Rs. 20,000
  </SelectItem>
  <SelectItem value="over-20000" className="py-3 px-4 hover:bg-indigo-50 rounded-lg">
    Over Rs. 20,000
  </SelectItem>
</SelectContent>

                  </Select>
                </div>

                {/* Sort */}
                <div>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 bg-gray-50 hover:bg-white transition-all duration-200">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl shadow-xl border-0 bg-white">
                      <SelectItem value="featured" className="py-3 px-4 hover:bg-indigo-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-indigo-600" />
                          Featured
                        </div>
                      </SelectItem>
                      <SelectItem value="price-low" className="py-3 px-4 hover:bg-indigo-50 rounded-lg">
                        Price: Low to High
                      </SelectItem>
                      <SelectItem value="price-high" className="py-3 px-4 hover:bg-indigo-50 rounded-lg">
                        Price: High to Low
                      </SelectItem>
                      <SelectItem value="name" className="py-3 px-4 hover:bg-indigo-50 rounded-lg">
                        Name: A to Z
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* View Mode & Results */}
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center bg-gray-100 p-1 rounded-xl">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-3 rounded-lg transition-all duration-200 ${
                        viewMode === "grid"
                          ? "bg-white shadow-sm text-indigo-600"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      <Grid className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-3 rounded-lg transition-all duration-200 ${
                        viewMode === "list"
                          ? "bg-white shadow-sm text-indigo-600"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      <List className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Filter Summary */}
              <div className="flex flex-wrap items-center gap-3 pt-6 border-t border-gray-100">
                <span className="px-4 py-2 bg-indigo-100 text-indigo-800 rounded-full text-sm font-bold flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  {sortedProducts.length} products found
                </span>
                
                {selectedCategory !== "all" && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium flex items-center gap-1">
                    Category: {selectedCategory}
                    <button 
                      onClick={() => setSelectedCategory("all")}
                      className="ml-1 p-0.5 hover:bg-blue-200 rounded-full transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                
                {search && (
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium flex items-center gap-1">
                    Search: "{search}"
                    <button 
                      onClick={() => setSearch("")}
                      className="ml-1 p-0.5 hover:bg-emerald-200 rounded-full transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {priceRange !== "all" && (
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium flex items-center gap-1">
                    Price: {priceRange.replace("-", " - RS")}
                    <button 
                      onClick={() => setPriceRange("all")}
                      className="ml-1 p-0.5 hover:bg-purple-200 rounded-full transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {sortBy !== "featured" && (
                  <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm font-medium flex items-center gap-1">
                    Sort: {sortBy.replace("-", " ")}
                    <button 
                      onClick={() => setSortBy("featured")}
                      className="ml-1 p-0.5 hover:bg-amber-200 rounded-full transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {hasActiveFilters && (
                  <Button
                    onClick={clearFilters}
                    variant="ghost"
                    size="sm"
                    className="text-gray-600 hover:text-gray-800 font-medium hover:bg-gray-100 rounded-full px-4"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Clear all filters
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {sortedProducts.length > 0 ? (
          <div
            className={`grid gap-8 ${
              viewMode === "grid"
                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                : "grid-cols-1 max-w-4xl mx-auto"
            }`}
          >
            {sortedProducts.map((product, index) => (
              <div
                key={product.$id}
                className={`group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-200 hover:border-indigo-300 hover:-translate-y-2 cursor-pointer ${
                  viewMode === "list" ? "flex gap-6" : ""
                }`}
                onClick={() => navigate(`/products/${product.$id}`)}
                onMouseEnter={() => setHoveredProduct(product.$id)}
                onMouseLeave={() => setHoveredProduct(null)}
              >
                <div className={`relative ${viewMode === "list" ? "w-48 h-48 flex-shrink-0" : "aspect-square"} overflow-hidden bg-gray-100`}>
                  {/* Product Image */}
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />

                  {/* Hover Actions */}
                  <div className={`absolute top-4 right-4 flex flex-col gap-2 transition-all duration-300 ${
                    hoveredProduct === product.$id ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
                  }`}>
                    <button 
                      className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-lg flex items-center justify-center shadow-lg hover:bg-white hover:scale-110 transition-all duration-200"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Quick view logic
                      }}
                    >
                      <Eye className="w-5 h-5 text-gray-700" />
                    </button>
                    <button 
                      className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-lg flex items-center justify-center shadow-lg hover:bg-white hover:scale-110 transition-all duration-200"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Wishlist logic
                      }}
                    >
                      <Heart className="w-5 h-5 text-gray-700 hover:text-red-500 transition-colors" />
                    </button>
                  </div>

                  {/* Category Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-indigo-600 text-white text-xs font-bold rounded-lg shadow-lg">
                      {product.category}
                    </span>
                  </div>

                  {/* Price Badge for Grid View */}
                  {viewMode === "grid" && (
                    <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg shadow-lg">
                      <span className="text-lg font-black text-gray-900">
                        RS.{product.price}
                      </span>
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className={`p-6 ${viewMode === "list" ? "flex-1 flex flex-col justify-between" : ""}`}>
                  <div className="space-y-3">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-2">
                      {product.name}
                    </h3>
                    
                    {product.description && (
                      <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
                        {product.description}
                      </p>
                    )}

                    {/* Discounted + Original Price */}
<div className="flex items-center gap-2">
  <span className="text-lg font-black text-gray-900">
    Rs. {(product.price * 0.8).toLocaleString()}
  </span>
  <span className="text-sm text-gray-400 line-through">
    Rs. {product.price}
  </span>
</div>


                    {/* Rating Stars (placeholder - you can add real rating data) */}
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 text-yellow-400 fill-current"
                        />
                      ))}
                      <span className="text-sm text-gray-500 ml-2">(4.8)</span>
                    </div>

                    {/* Add to Cart Button */}
                    <Button
  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group/btn mt-4"
  onClick={(e) => {
    e.stopPropagation();
    navigate(`/products/${product.$id}`);
  }}
>
  <Eye className="w-5 h-5 mr-2" />
  View Details
  <ArrowRight className="w-5 h-5 ml-2 group-hover/btn:translate-x-1 transition-transform" />
</Button>

                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-32 h-32 bg-white rounded-2xl shadow-lg flex items-center justify-center mx-auto mb-8">
              <div className="relative">
                <Search className="w-16 h-16 text-gray-300" />
                <X className="w-6 h-6 text-red-400 absolute -top-1 -right-1" />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              No products found
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto text-lg">
              We couldn't find any products matching your criteria. Try adjusting your search or filter settings.
            </p>
            
            {/* Suggestions */}
            <div className="space-y-4 mb-8">
              <p className="text-sm font-medium text-gray-700">Try:</p>
              <div className="flex flex-wrap justify-center gap-2">
                <button
                  onClick={() => setSearch("")}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-sm transition-colors"
                >
                  Clear search
                </button>
                <button
                  onClick={() => setSelectedCategory("all")}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-sm transition-colors"
                >
                  All categories
                </button>
                <button
                  onClick={() => setPriceRange("all")}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-sm transition-colors"
                >
                  All prices
                </button>
              </div>
            </div>

            {hasActiveFilters && (
              <Button
                onClick={clearFilters}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <X className="w-5 h-5 mr-2" />
                Clear all filters
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Stats Section */}
      {sortedProducts.length > 0 && (
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
              <div className="group">
                <div className="text-4xl font-black mb-2 group-hover:scale-110 transition-transform duration-300">
                  {products.length}+
                </div>
                <div className="text-indigo-200 font-medium">
                  Total Products
                </div>
              </div>
              <div className="group">
                <div className="text-4xl font-black mb-2 group-hover:scale-110 transition-transform duration-300">
                  {categories.length}+
                </div>
                <div className="text-indigo-200 font-medium">
                  Categories
                </div>
              </div>
              <div className="group">
                <div className="text-4xl font-black mb-2 group-hover:scale-110 transition-transform duration-300">
                  {sortedProducts.length}
                </div>
                <div className="text-indigo-200 font-medium">
                  Matching Results
                </div>
              </div>
              <div className="group">
                <div className="text-4xl font-black mb-2 group-hover:scale-110 transition-transform duration-300">
                  100%
                </div>
                <div className="text-indigo-200 font-medium">
                  Quality Guaranteed
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Features Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-gray-900 mb-4">
              Why Shop With Us?
            </h2>
            <p className="text-gray-600 text-lg">
              Experience the difference with our premium service
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: ShoppingCart,
                title: "Easy Shopping",
                description: "Seamless browsing and checkout experience with secure payments.",
                color: "text-blue-600",
                bg: "bg-blue-50"
              },
              {
                icon: Heart,
                title: "Curated Selection",
                description: "Hand-picked products ensuring quality and value for money.",
                color: "text-red-600",
                bg: "bg-red-50"
              },
              {
                icon: CheckCircle,
                title: "Quality Assurance",
                description: "Every product meets our strict quality standards.",
                color: "text-green-600",
                bg: "bg-green-50"
              }
            ].map((feature, index) => (
              <div
                key={index}
                className={`${feature.bg} p-6 rounded-2xl hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group text-center`}
              >
                <div className={`w-16 h-16 ${feature.bg} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <feature.icon className={`w-8 h-8 ${feature.color}`} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Products;
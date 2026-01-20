import React, { useEffect, useState, useMemo } from "react";
import { getProducts, getCategories, addToCart } from "../backend/database.js";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useUser } from "../context/UserContext.jsx";
import {
  Search,
  Filter,
  ShoppingCart,
  Sparkles,
  ChevronRight,
  Droplets,
  Plus,
  ArrowUpDown,
  List,
  Grid as GridIcon,
  Sun,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";

function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "all");
  const [selectedConcern, setSelectedConcern] = useState(searchParams.get("concern") || "all");
  
  // Reset to "all" if selected category doesn't exist in products
  useEffect(() => {
    if (selectedCategory !== "all" && products.length > 0) {
      const availableCategories = new Set(
        products.map(p => {
          const cat = (p.category || "").toLowerCase().trim();
          return cat;
        }).filter(Boolean)
      );
      
      // Also create base forms (remove 's' for plural matching)
      const availableBases = new Set(
        Array.from(availableCategories).map(cat => cat.replace(/s$/, ""))
      );
      
      const selectedCatLower = selectedCategory.toLowerCase().trim();
      const selectedBase = selectedCatLower.replace(/s$/, "");
      
      // Check if category exists (exact or base form)
      const categoryExists = availableCategories.has(selectedCatLower) || 
                            availableBases.has(selectedBase) ||
                            Array.from(availableCategories).some(cat => 
                              cat.includes(selectedCatLower) || selectedCatLower.includes(cat)
                            );
      
      if (selectedCatLower && !categoryExists) {
        console.warn(`⚠️ Category "${selectedCategory}" not found in products. Available: ${Array.from(availableCategories).join(", ")}. Resetting to "all".`);
        setSelectedCategory("all");
      }
    }
  }, [products]); // Only depend on products, not selectedCategory to avoid loops
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("name-asc");
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        const prodData = await getProducts();
        const productsList = prodData.documents || [];
        console.log(`✅ Fetched ${productsList.length} products from database`);
        console.log(`📊 Total products in response: ${prodData.total || productsList.length}`);
        console.log("Sample products:", productsList.slice(0, 3).map(p => ({ name: p.name, category: p.category })));
        
        // Log all unique categories found in products
        const allCategories = [...new Set(productsList.map(p => {
          if (typeof p.category === "string") return p.category;
          if (p.category?.name) return p.category.name;
          return p.category;
        }).filter(Boolean))];
        console.log("📦 All categories in products:", allCategories);
        console.log("📦 Category breakdown:", allCategories.map(cat => {
          const count = productsList.filter(p => {
            const pCat = typeof p.category === "string" ? p.category : (p.category?.name || "");
            return String(pCat).toLowerCase() === String(cat).toLowerCase();
          }).length;
          return `${cat}: ${count} products`;
        }));
        
        setProducts(productsList);
        
        const catData = await getCategories();
        const categoriesList = catData.documents || [];
        console.log(`✅ Fetched ${categoriesList.length} categories from database`);
        setCategories(categoriesList);
      } catch (error) {
        console.error("❌ Error fetching data:", error);
        alert("Failed to load products. Please refresh the page.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleAddToCart = async (product) => {
    if (!user) {
      navigate("/login");
      return;
    }
    try {
      await addToCart(user.$id, product, 1);
      // Small feedback toast could be added here
      alert("Added to routine bag");
    } catch (error) {
      console.error(error);
      alert("Failed to add to cart");
    }
  };

  const filteredProducts = useMemo(() => {
    if (!products || products.length === 0) {
      return [];
    }
    
    return products.filter((product) => {
      // Skip products without a name (invalid products)
      if (!product || !product.name) {
        return false;
      }
      
      // Handle category matching - check if category exists and matches (case-insensitive)
      // Category might be stored as string or object with name property
      let productCategory = "";
      if (product.category) {
        if (typeof product.category === "string") {
          productCategory = product.category.trim();
        } else if (product.category.name) {
          productCategory = String(product.category.name).trim();
        } else {
          productCategory = String(product.category).trim();
        }
      }
      
      const selectedCat = selectedCategory === "all" ? "all" : String(selectedCategory).trim();
      
      // More flexible category matching - handles singular/plural differences
      let matchCategory = selectedCat === "all";
      if (!matchCategory && productCategory) {
        const productCatLower = productCategory.toLowerCase().trim();
        const selectedCatLower = selectedCat.toLowerCase().trim();
        
        // Normalize both to handle common variations
        const normalizeCategory = (cat) => cat.replace(/\s+/g, "").replace(/s$/, "");
        const productNormalized = normalizeCategory(productCatLower);
        const selectedNormalized = normalizeCategory(selectedCatLower);
        
        // Multiple matching strategies:
        // 1. Exact match (case-insensitive)
        // 2. Normalized match (handles plural/singular, spaces)
        // 3. Contains match (handles partial matches)
        matchCategory = 
          productCatLower === selectedCatLower || 
          productNormalized === selectedNormalized ||
          productCatLower.includes(selectedCatLower) ||
          selectedCatLower.includes(productCatLower) ||
          productNormalized.includes(selectedNormalized) ||
          selectedNormalized.includes(productNormalized);
      }
      
      // Search filter - show all if search is empty
      const matchSearch = !search || (product.name && product.name.toLowerCase().includes(search.toLowerCase()));
      
      // Basic simulation for concern filtering based on name/description if data missing
      const matchConcern = selectedConcern === "all" ||
        (product.description && product.description.toLowerCase().includes(selectedConcern.toLowerCase())) ||
        (product.name && product.name.toLowerCase().includes(selectedConcern.toLowerCase()));

      return matchCategory && matchSearch && matchConcern;
    });
  }, [products, selectedCategory, search, selectedConcern]);
  
  // Debug logging for category filtering
  useEffect(() => {
    if (selectedCategory !== "all" && products.length > 0) {
      // Show all unique categories in products
      const allProductCategories = [...new Set(products.map(p => {
        const cat = typeof p.category === "string" ? p.category : (p.category?.name || "");
        return cat;
      }).filter(Boolean))];
      
      console.log(`🔍 Filtering for category "${selectedCategory}":`);
      console.log(`   Total products: ${products.length}`);
      console.log(`   All categories in products:`, allProductCategories);
      console.log(`   Filtered products: ${filteredProducts.length}`);
      
      // Show products that should match
      const matchingProducts = products.filter(p => {
        const cat = typeof p.category === "string" ? p.category : (p.category?.name || "");
        const catLower = cat.toLowerCase().trim();
        const selectedLower = selectedCategory.toLowerCase().trim();
        return catLower === selectedLower || 
               catLower.replace(/s$/, "") === selectedLower.replace(/s$/, "") ||
               catLower.includes(selectedLower) ||
               selectedLower.includes(catLower);
      });
      
      console.log(`   Products matching "${selectedCategory}":`, matchingProducts.length);
      if (matchingProducts.length > 0) {
        console.log(`   Sample matching products:`, matchingProducts.slice(0, 3).map(p => ({ 
          name: p.name, 
          category: p.category,
          categoryType: typeof p.category
        })));
      } else {
        console.warn(`   ⚠️ No products found matching category "${selectedCategory}"`);
        console.log(`   Available categories:`, allProductCategories);
      }
    }
  }, [selectedCategory, products, filteredProducts]);

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "price-asc") return a.price - b.price;
    if (sortBy === "price-desc") return b.price - a.price;
    if (sortBy === "name-asc") return a.name.localeCompare(b.name);
    return 0;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Sparkles className="w-10 h-10 text-primary animate-pulse" />
          <p className="text-primary font-medium">Curating your glow...</p>
        </div>
      </div>
    );
  }

  const concerns = ["Acne", "Aging", "Dryness", "Dullness", "Sensitivity"];

  return (
    <div className="min-h-screen bg-background font-sans text-foreground">

      {/* Header Banner */}
      <div className="bg-primary/5 pt-12 pb-20 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 text-primary text-sm font-bold mb-3 uppercase tracking-wider">
            <Sparkles className="w-4 h-4" /> Premium Skincare
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary-foreground/90 mix-blend-difference" style={{ color: 'var(--foreground)' }}>Shop The Collection</h1>
          <p className="max-w-2xl text-muted-foreground text-lg">
            Clean, effective formulas designed to reveal your healthiest skin.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-8 relative z-10 flex flex-col lg:flex-row gap-8">

        {/* Sidebar Filters */}
        <div className="lg:w-72 flex-shrink-0 space-y-8">

          {/* Categories */}
          <div className="bg-card rounded-2xl shadow-sm border border-border p-6">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <List className="w-4 h-4 text-primary" /> Categories
            </h3>
            <div className="space-y-2">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center gap-3 ${
                  selectedCategory === "all"
                    ? "bg-primary text-white shadow-md"
                    : "text-muted-foreground hover:bg-secondary"
                }`}
              >
                <div className="w-9 h-9 rounded-full bg-secondary/40 flex items-center justify-center overflow-hidden border border-border/60">
                  <span className="text-[11px] font-bold uppercase tracking-wide">
                    All
                  </span>
                </div>
                <span className="truncate">All Products</span>
              </button>
              {categories.map((cat) => {
                const categoryName = cat.name || cat;
                // Count how many products are in this category
                const productCount = products.filter(p => {
                  const pCat = typeof p.category === "string" ? p.category : (p.category?.name || "");
                  const catLower = categoryName.toLowerCase();
                  const pCatLower = pCat.toLowerCase();
                  return pCatLower === catLower || 
                         pCatLower.replace(/s$/, "") === catLower.replace(/s$/, "") ||
                         pCatLower.includes(catLower) ||
                         catLower.includes(pCatLower);
                }).length;
                
                return (
                <button
                  key={cat.$id || cat}
                  onClick={() => {
                    console.log(`📌 Selected category: "${categoryName}"`);
                    setSelectedCategory(categoryName);
                  }}
                  className={`w-full text-left p-2 rounded-xl text-sm font-medium transition-all flex items-center gap-3 ${
                    selectedCategory === categoryName
                      ? "bg-primary text-white shadow-md"
                      : "text-muted-foreground hover:bg-secondary"
                  }`}
                >
                  <div className="w-9 h-9 rounded-full bg-secondary/40 flex items-center justify-center overflow-hidden border border-border/60 flex-shrink-0">
                    {cat.imageUrl ? (
                      <img
                        src={cat.imageUrl}
                        alt={categoryName}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    ) : (
                      <span className="text-[11px] font-bold uppercase tracking-wide">
                        {categoryName?.charAt(0) || "?"}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="truncate block">{categoryName}</span>
                    {productCount > 0 && (
                      <span className="text-xs opacity-70">({productCount})</span>
                    )}
                  </div>
                </button>
              )})}
            </div>
          </div>

          {/* Concerns */}
          <div className="bg-card rounded-2xl shadow-sm border border-border p-6">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Filter className="w-4 h-4 text-primary" /> Shop by Concern
            </h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedConcern('all')}
                className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${selectedConcern === 'all' ? 'bg-primary text-white border-primary' : 'bg-transparent text-muted-foreground border-border hover:border-primary'}`}
              >
                All
              </button>
              {concerns.map(c => (
                <button
                  key={c}
                  onClick={() => setSelectedConcern(c)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${selectedConcern === c ? 'bg-primary text-white border-primary' : 'bg-transparent text-muted-foreground border-border hover:border-primary'}`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Quiz Banner */}
          <div className="bg-primary/10 rounded-2xl p-6 border border-primary/20 text-center">
            <h3 className="font-bold text-primary mb-2">Skin Analysis</h3>
            <p className="text-xs text-muted-foreground mb-4">Find your perfect routine in 2 minutes.</p>
            <Button onClick={() => navigate('/skin-quiz')} className="w-full bg-primary hover:bg-primary/90 text-white rounded-lg text-xs">
              Take Quiz
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 space-y-6">

          {/* Controls */}
          <div className="bg-card rounded-2xl shadow-sm border border-border p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <input
                className="w-full pl-10 pr-4 py-2.5 bg-secondary/30 border border-border rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-muted-foreground/70"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <select
                className="bg-secondary/30 border border-border text-foreground text-sm rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="name-asc">Alphabetical (A-Z)</option>
                <option value="price-asc">Price (Low to High)</option>
                <option value="price-desc">Price (High to Low)</option>
              </select>

              <div className="flex border border-border rounded-xl overflow-hidden bg-secondary/30">
                <button onClick={() => setViewMode('list')} className={`p-2.5 transition-colors ${viewMode === 'list' ? 'bg-white shadow-sm text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
                  <List className="w-4 h-4" />
                </button>
                <button onClick={() => setViewMode('grid')} className={`p-2.5 transition-colors ${viewMode === 'grid' ? 'bg-white shadow-sm text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
                  <GridIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Products List */}
          {sortedProducts.length > 0 ? (
            <div className={viewMode === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
              {sortedProducts.map((product) => (
                <div
                  key={product.$id}
                  className={`bg-card rounded-2xl border border-border overflow-hidden hover:shadow-lg hover:border-primary/30 transition-all group flex ${viewMode === 'list' ? 'flex-row items-center p-4 gap-6' : 'flex-col p-4'}`}
                >
                  {/* Image */}
                  <div
                    className={`${viewMode === 'list' ? 'w-24 h-24' : 'aspect-square mb-4'} bg-secondary/20 rounded-xl flex items-center justify-center p-4 cursor-pointer relative overflow-hidden`}
                    onClick={() => navigate(`/products/${product.$id}`)}
                  >
                    <img
                      src={product.imageUrl || "https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?auto=format&fit=crop&w=400"}
                      alt={product.name}
                      onError={(e) => e.target.src = "https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?auto=format&fit=crop&w=400"}
                      className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                    />
                    {viewMode === 'grid' && (
                      <button
                        onClick={(e) => { e.stopPropagation(); handleAddToCart(product); }}
                        className="absolute bottom-3 right-3 p-2 bg-white/90 backdrop-blur rounded-full text-primary shadow-sm opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 duration-300 hover:bg-primary hover:text-white"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">{product.category}</div>
                    <h3 className="font-bold text-foreground text-lg group-hover:text-primary transition-colors cursor-pointer truncate" onClick={() => navigate(`/products/${product.$id}`)}>
                      {product.name}
                    </h3>
                    {viewMode === 'list' && <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{product.description}</p>}

                    {viewMode === 'grid' && (
                      <div className="flex items-center justify-between mt-3">
                        <span className="font-bold text-lg">Rs. {product.price}</span>
                      </div>
                    )}
                  </div>

                  {viewMode === 'list' && (
                    <div className="text-right flex-shrink-0">
                      <div className="font-bold text-xl mb-2">Rs. {product.price}</div>
                      <Button onClick={() => handleAddToCart(product)} className="bg-primary hover:bg-primary/90 text-white rounded-lg">
                        Add to Bag
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-card rounded-2xl border border-border p-16 text-center">
              <div className="w-16 h-16 bg-secondary/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-bold mb-2">No matches found</h3>
              <p className="text-muted-foreground mb-4">
                {products.length === 0 
                  ? `No products found in database.`
                  : `We couldn't find any products matching your filters. Total products: ${products.length}`
                }
              </p>
              {products.length > 0 && (
                <div className="mb-4 text-xs text-muted-foreground space-y-1 bg-secondary/30 p-4 rounded-lg">
                  <p><strong>Debug Info:</strong></p>
                  <p>Selected Category: <strong>{selectedCategory}</strong></p>
                  <p>Search: <strong>{search || "(empty)"}</strong></p>
                  <p>Available categories: <strong>{[...new Set(products.map(p => p.category || "Uncategorized"))].slice(0, 5).join(", ")}</strong></p>
                </div>
              )}
              <button onClick={() => { setSearch(''); setSelectedCategory('all'); setSelectedConcern('all'); }} className="text-primary font-bold hover:underline">
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Products;
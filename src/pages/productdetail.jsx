// src/pages/ProductDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  getProductById,
  getProducts,
  addToCart,
  addToWishlist,
  getWishlist,
  addReview,
  getReviews,
  updateReview,
  deleteReview,
} from "../backend/database";
import {
  ArrowLeft,
  Heart,
  Truck,
  ShieldCheck,
  ShoppingBag,
  Zap,
  Package,
  Sparkles,
  Plus,
  Minus,
  AlertCircle,
  FileText,
  Info,
  Droplets,
  Sun,
  CheckCircle,
  Star,
  MessageSquare,
  Edit2,
  Trash2,
  X
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
  const [activeTab, setActiveTab] = useState("details");
  const [selectedImage, setSelectedImage] = useState(0);

  // Review State
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState("");
  const [rating, setRating] = useState(5);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [editingReviewId, setEditingReviewId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [p, all, fetchedReviews] = await Promise.all([
          getProductById(id),
          getProducts(),
          getReviews(id).catch(() => ({ documents: [] })) // Fail gracefully
        ]);
        setProduct(p);
        setReviews(fetchedReviews.documents || []);

        // Related products logic
        const relatedProducts = (all.documents || [])
          .filter((d) => d.$id !== id && d.category === p.category)
          .slice(0, 4);
        setRelated(relatedProducts);

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
        productId: product.$id, // Assuming DB aligns
        quantity,
      });
      alert(`Added to your routine`);
    } catch (e) {
      console.error(e);
      alert("Failed to add to cart");
    }
  };

  const handleAddToWishlist = async () => {
    if (!ensureAuth()) return;
    try {
      await addToWishlist({ userId: user.$id, productId: product.$id });
      setIsLiked(true);
      alert("Saved to wishlist");
    } catch (e) {
      console.error(e);
      alert("Failed to save");
    }
  };

  const handleBuyNow = () => {
    if (!ensureAuth()) return;
    navigate("/checkout", { state: { buyNow: { product, quantity } } });
  };

  const handleQuantityChange = (delta) => {
    setQuantity((prev) => Math.max(1, prev + delta));
  };

  // Review handlers (omitted detailed implementation changes for brevity, logic remains same)
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!ensureAuth()) return;
    if (!newReview.trim()) return;

    setIsSubmittingReview(true);
    try {
      // ... (Exact same logic as before but assumes DB structure is compatible)
      if (editingReviewId) {
        await updateReview(editingReviewId, { review: newReview, rating: parseInt(rating) });
        setReviews(reviews.map(r => r.$id === editingReviewId ? { ...r, review: newReview, rating: parseInt(rating) } : r));
        setEditingReviewId(null);
      } else {
        const reviewData = {
          userid: user.$id,
          productId: product.$id,
          review: newReview,
          rating: parseInt(rating),
          username: user.name || "SkinGlow Member"
        };
        const res = await addReview(reviewData);
        setReviews([res, ...reviews]);
      }
      setNewReview("");
      setRating(5);
    } catch (error) {
      console.error("Review failed:", error);
      alert("Review submission failed");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleEditReview = (review) => {
    setNewReview(review.review);
    setRating(review.rating);
    setEditingReviewId(review.$id);
  };
  const handleDeleteReview = async (id) => {
    if (!window.confirm("Delete this review?")) return;
    try {
      await deleteReview(id);
      setReviews(reviews.filter(r => r.$id !== id));
    } catch (e) { console.error(e); }
  };
  const handleCancelEdit = () => {
    setNewReview("");
    setRating(5);
    setEditingReviewId(null);
  };


  const averageRating = reviews.length
    ? (reviews.reduce((acc, r) => acc + (r.rating || 0), 0) / reviews.length).toFixed(1)
    : 0;

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Sparkles className="animate-pulse w-10 h-10 text-primary" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Product Not Found</h2>
          <Button onClick={() => navigate("/products")} className="bg-primary hover:bg-primary/90">
            Back to Shop
          </Button>
        </div>
      </div>
    );
  }

  const productPrice = Number(product.price || 0).toFixed(2);

  // Support multiple images per product: imageUrl, imageUrl2, imageUrl3 or an array field imageGallery
  const productImagesRaw = [
    product.imageUrl,
    product.imageUrl2,
    product.imageUrl3,
    ...(Array.isArray(product.imageGallery) ? product.imageGallery : []),
  ].filter(Boolean);

  const productImages = productImagesRaw.length
    ? productImagesRaw
    : [product.imageUrl].filter(Boolean);

  return (
    <div className="min-h-screen bg-background font-sans text-foreground">

      {/* Breadcrumb */}
      <div className="border-b border-border py-4 px-6 sticky top-0 bg-background/80 backdrop-blur z-10">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-sm text-muted-foreground">
          <button onClick={() => navigate("/products")} className="hover:text-primary flex items-center gap-1 transition-colors">
            Skincare
          </button>
          <span className="text-border">/</span>
          <span className="text-foreground font-medium truncate">{product.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-2 gap-16 mb-20">

          {/* Left: Images */}
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-3xl overflow-hidden aspect-square relative group">
              <img
                src={productImages[selectedImage] || "https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?auto=format&fit=crop&w=800"}
                alt={product.name}
                onError={(e) => e.target.src = "https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?auto=format&fit=crop&w=800"}
                className="w-full h-full object-contain p-8 group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute top-4 left-4 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Best Seller
              </div>
            </div>
            {/* Thumbs */}
            <div className="flex gap-4 justify-center">
              {productImages.map((img, i) => (
                <div
                  key={i}
                  className={`w-20 h-20 rounded-xl cursor-pointer bg-card border-2 transition-all ${selectedImage === i ? 'border-primary ring-2 ring-primary/20' : 'border-transparent opacity-70 hover:opacity-100'}`}
                  onClick={() => setSelectedImage(i)}
                >
                  <img src={img} alt="" className="w-full h-full object-cover rounded-lg" />
                </div>
              ))}
            </div>
          </div>

          {/* Right: Details */}
          <div className="flex flex-col justify-center">
            <div className="mb-2 text-primary font-bold uppercase tracking-widest text-xs">
              {product.category || "Skincare"}
            </div>
            <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">{product.name}</h1>

            <div className="flex items-center gap-4 text-sm mb-6">
              <div className="flex text-primary">
                <Star className="w-4 h-4 fill-current" />
                <span className="ml-1 font-bold">{averageRating}</span>
              </div>
              <span className="text-muted-foreground">{reviews.length} Reviews</span>
            </div>

            {/* Price Display with Discount Logic */}
            <div className="mb-8 flex items-end gap-3">
              {(() => {
                const numericPrice = parseInt(String(product.price || 0).replace(/,/g, ""), 10) || 0;
                const originalPrice = numericPrice ? Math.round(numericPrice * 1.25) : 0;
                return (
                  <>
                    <div className="text-3xl md:text-4xl font-bold text-primary">
                      Rs. {numericPrice.toLocaleString()}
                    </div>
                    {originalPrice > 0 && (
                      <div className="text-lg text-muted-foreground line-through decoration-red-500/50 mb-1">
                        Rs. {originalPrice.toLocaleString()}
                      </div>
                    )}
                    <div className="mb-2 px-2 py-0.5 bg-red-100 text-red-600 text-xs font-bold rounded-full">
                      -20%
                    </div>
                  </>
                );
              })()}
            </div>

            <p className="text-muted-foreground leading-relaxed mb-8 max-w-lg">
              {product.description || "Formulated with premium ingredients to nourish and rejuvenate your skin. Suitable for all skin types."}
            </p>

            {/* Quantity & Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-8">
              <div className="flex items-center justify-center border border-border rounded-full h-12 px-2 bg-card w-full sm:w-auto">
                <button onClick={() => handleQuantityChange(-1)} className="p-3 hover:text-primary transition"><Minus className="w-4 h-4" /></button>
                <span className="w-12 text-center font-bold">{quantity}</span>
                <button onClick={() => handleQuantityChange(1)} className="p-3 hover:text-primary transition"><Plus className="w-4 h-4" /></button>
              </div>

              <div className="flex gap-3 flex-1">
                <Button onClick={handleAddToCart} className="flex-1 h-12 rounded-full text-base font-bold bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25">
                  Add to Bag
                </Button>
                <Button onClick={handleBuyNow} className="flex-1 h-12 rounded-full text-base font-bold bg-secondary hover:bg-secondary/90 text-primary border border-primary/20 shadow-lg shadow-secondary/25">
                  Buy Now
                </Button>
              </div>

              <button
                onClick={handleAddToWishlist}
                className={`hidden sm:flex p-3 rounded-full border border-border transition-colors ${isLiked ? 'bg-red-50 text-red-500 border-red-200' : 'hover:border-primary hover:text-primary'}`}
              >
                <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
              </button>
              {/* Mobile Wishlist Button (Full Width) */}
              <Button
                onClick={handleAddToWishlist}
                variant="outline"
                className={`sm:hidden h-12 rounded-full border-border ${isLiked ? 'bg-red-50 text-red-500 border-red-200' : ''}`}
              >
                <Heart className={`w-5 h-5 mr-2 ${isLiked ? 'fill-current' : ''}`} /> {isLiked ? 'Saved' : 'Save to Wishlist'}
              </Button>
            </div>

            {/* Quick Benefits */}
            <div className="grid grid-cols-2 gap-4 text-sm text-foreground/80 mb-8">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" /> Vegan & Cruelty Free
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" /> Dermatologist Tested
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" /> Recyclable Packaging
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" /> Free Shipping
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Info Tabs */}
        <div className="max-w-4xl mx-auto mb-20">
          <div className="flex justify-center gap-8 border-b border-border mb-10 overflow-x-auto">
            {['details', 'ingredients', 'usage', 'reviews'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`uppercase text-xs font-bold tracking-widest pb-4 border-b-2 transition-all px-4 ${activeTab === tab ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
              >
                {tab === 'details' && "About The Product"}
                {tab === 'ingredients' && "Ingredients"}
                {tab === 'usage' && "How To Use"}
                {tab === 'reviews' && `Reviews (${reviews.length})`}
              </button>
            ))}
          </div>

          <div className="prose prose-slate max-w-none text-muted-foreground leading-relaxed">
            {activeTab === 'details' && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 text-center max-w-2xl mx-auto space-y-6">
                <p>{product.description}</p>
                <p>Experience the ultimate hydration and restoration with our carefully crafted formula.</p>
              </div>
            )}
            {activeTab === 'ingredients' && (
              <div className="mx-auto max-w-2xl">
                <h3 className="font-bold text-foreground mb-4 text-center">Key Active Ingredients</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-primary mt-1" />
                    <span><strong>Hyaluronic Acid:</strong> Deeply hydrates and plumps the skin.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Sun className="w-4 h-4 text-primary mt-1" />
                    <span><strong>Vitamin C:</strong> Brightens complexion and evens skin tone.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Droplets className="w-4 h-4 text-primary mt-1" />
                    <span><strong>Niacinamide:</strong> Reduces pore appearance and strengthens barrier.</span>
                  </li>
                </ul>
              </div>
            )}
            {activeTab === 'usage' && (
              <div className="text-center max-w-2xl mx-auto">
                <p className="mb-4">Apply a small amount to clean, dry skin morning and night. Gently massage in upward circular motions until fully absorbed.</p>
                <div className="bg-secondary/30 p-4 rounded-xl inline-block text-xs font-bold text-primary">
                  Pro Tip: Layer under your favorite moisturizer for extra hydration.
                </div>
              </div>
            )}
            {activeTab === 'reviews' && (
              <div className="max-w-2xl mx-auto">
                {/* Review Form Logic Wrapper */}
                {user ? (
                  <form onSubmit={handleReviewSubmit} className="bg-card p-6 rounded-2xl border border-border mb-8 shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                      <span className="font-bold text-foreground">Write a Review</span>
                      {editingReviewId && <button type="button" onClick={handleCancelEdit} className="text-xs text-red-500">Cancel</button>}
                    </div>
                    <div className="flex gap-1 mb-4">
                      {[1, 2, 3, 4, 5].map(s => (
                        <Star key={s} onClick={() => setRating(s)} className={`cursor-pointer w-6 h-6 ${s <= rating ? 'fill-primary text-primary' : 'text-muted-foreground/30'}`} />
                      ))}
                    </div>
                    <Textarea value={newReview} onChange={e => setNewReview(e.target.value)} placeholder="Tell us what you think..." className="mb-4 bg-background" />
                    <Button disabled={isSubmittingReview} className="w-full bg-primary text-white">{isSubmittingReview ? "Submitting..." : "Post Review"}</Button>
                  </form>
                ) : (
                  <div className="text-center p-8 bg-secondary/20 rounded-2xl mb-8">
                    <p className="mb-2">Log in to leave a review</p>
                    <Button variant="outline" onClick={() => navigate('/login')}>Login</Button>
                  </div>
                )}

                <div className="space-y-8">
                  {reviews.length === 0 && <p className="text-center italic">No reviews yet.</p>}
                  {reviews.map(rev => (
                    <div key={rev.$id} className="border-b border-border pb-8 last:border-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-bold text-foreground">{rev.username || "Verified Buyer"}</div>
                        <span className="text-xs">{new Date(rev.$createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex text-primary text-xs mb-3">
                        {[...Array(5)].map((_, i) => <Star key={i} className={`w-3 h-3 ${i < rev.rating ? 'fill-current' : 'text-muted-foreground/20'}`} />)}
                      </div>
                      <p>{rev.review}</p>
                      {user && user.$id === rev.userid && (
                        <div className="mt-2 flex gap-2">
                          <button onClick={() => handleEditReview(rev)} className="text-xs text-muted-foreground hover:text-primary">Edit</button>
                          <button onClick={() => handleDeleteReview(rev.$id)} className="text-xs text-muted-foreground hover:text-red-500">Delete</button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default ProductDetail;

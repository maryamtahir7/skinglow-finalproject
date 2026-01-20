import React, { useEffect, useState } from "react";
import { getAllReviews, deleteReview, updateReview, getProductById } from "../../backend/database";
import { Star, Trash2, Eye, EyeOff, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminReviews() {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [productNames, setProductNames] = useState({});

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        setLoading(true);
        try {
            const res = await getAllReviews();
            setReviews(res.documents);

            // Fetch product names for context
            const productIds = [...new Set(res.documents.map(r => r.productId))];
            const nameMap = {};
            await Promise.all(productIds.map(async (pid) => {
                try {
                    const p = await getProductById(pid);
                    nameMap[pid] = p.name;
                } catch {
                    nameMap[pid] = "Unknown Product";
                }
            }));
            setProductNames(nameMap);
        } catch (error) {
            console.error("Failed to load reviews:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (reviewId) => {
        if (!window.confirm("Are you sure you want to delete this review?")) return;
        try {
            await deleteReview(reviewId);
            setReviews(reviews.filter(r => r.$id !== reviewId));
        } catch (error) {
            alert("Failed to delete review");
        }
    };

    const handleToggleVisibility = async (review) => {
        // Assuming you will add an 'isVisible' boolean field to your Appwrite collection
        // If not present, default to true.
        const currentStatus = review.isVisible !== false; // Default true
        try {
            await updateReview(review.$id, { isVisible: !currentStatus });
            setReviews(reviews.map(r => r.$id === review.$id ? { ...r, isVisible: !currentStatus } : r));
        } catch (error) {
            console.error(error);
            alert("Failed to update visibility. Ensure 'isVisible' boolean attribute exists in Appwrite.");
        }
    };

    const filteredReviews = reviews.filter(r =>
        r.review.toLowerCase().includes(search.toLowerCase()) ||
        (r.username || "").toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Customer Reviews</h1>
                    <p className="text-slate-500">Manage and moderate product reviews.</p>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search reviews..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                </div>
            </div>

            {loading ? (
                <div className="text-center py-12">Loading reviews...</div>
            ) : (
                <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium">
                            <tr>
                                <th className="px-6 py-4">Product</th>
                                <th className="px-6 py-4">User</th>
                                <th className="px-6 py-4">Review</th>
                                <th className="px-6 py-4 text-center">Rating</th>
                                <th className="px-6 py-4 text-center">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredReviews.length === 0 ? (
                                <tr><td colSpan="6" className="text-center py-8 text-slate-400">No reviews found.</td></tr>
                            ) : (
                                filteredReviews.map((review) => (
                                    <tr key={review.$id} className="hover:bg-slate-50/50">
                                        <td className="px-6 py-4 font-medium text-slate-900">
                                            {productNames[review.productId] || review.productId}
                                        </td>
                                        <td className="px-6 py-4 text-slate-600">
                                            <div className="font-medium text-slate-900">{review.username || "Anonymous"}</div>
                                            <div className="text-xs text-slate-400">{new Date(review.$createdAt).toLocaleDateString()}</div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600 max-w-xs truncate" title={review.review}>
                                            {review.review}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="inline-flex items-center gap-1 bg-yellow-50 text-yellow-700 font-bold px-2 py-1 rounded">
                                                <Star className="w-3 h-3 fill-current" /> {review.rating}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {review.isVisible === false ? (
                                                <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-500 text-xs font-bold px-2 py-1 rounded">Hidden</span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 text-xs font-bold px-2 py-1 rounded">Visible</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleToggleVisibility(review)}
                                                    className={review.isVisible === false ? "text-slate-400 hover:text-teal-600" : "text-slate-400 hover:text-orange-500"}
                                                    title={review.isVisible === false ? "Show Review" : "Hide Review"}
                                                >
                                                    {review.isVisible === false ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleDelete(review.$id)}
                                                    className="text-slate-400 hover:text-red-600"
                                                    title="Delete Review"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

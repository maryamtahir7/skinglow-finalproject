import React, { useState } from "react";
import {
  Card as ShadCard,
  CardContent,
} from "@/components/ui/card";
import { ShoppingCart, Heart, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Card = ({ product }) => {
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(false);

  // Fallbacks
  const {
    $id,
    name = "Premium Wireless Headphones",
    imageUrl = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop",
    price = "15,999",
    category = "Electronics",
    description = "High-quality wireless headphones with noise cancellation.",
    rating = 4,
  } = product || {};

  // Ensure price is numeric
  const numericPrice = parseInt(String(price).replace(/,/g, ""), 10) || 0;
  // Show original price as main, with a slightly lower "cut" price below
  const cutPrice = numericPrice ? Math.round(numericPrice * 0.9) : 0;

  return (
    <ShadCard
      onClick={() => navigate(`/products/${$id}`)}
      className="max-w-sm bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-transform duration-300 hover:-translate-y-2 overflow-hidden group cursor-pointer"
    >
      {/* Product Image */}
      <div className="relative">
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsLiked(!isLiked);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full shadow-md transition-all ${
            isLiked
              ? "bg-red-100 text-red-500"
              : "bg-gray-100 text-gray-400 hover:bg-red-100 hover:text-red-500"
          }`}
        >
          <Heart className="w-5 h-5" />
        </button>
      </div>

      {/* Product Details */}
      <CardContent className="px-5 py-4">
        {/* Category Badge */}
        <span className="inline-block px-3 py-1 text-xs font-semibold bg-yellow-100 text-yellow-800 rounded-full mb-2">
          {category || "Uncategorized"}
        </span>

        {/* Product Name */}
        <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-2 group-hover:text-blue-600">
          {name}
        </h3>

        {/* Ratings */}
        <div className="flex items-center gap-1 mb-2">
          {[...Array(5)].map((_, idx) => (
            <Star
              key={idx}
              className={`w-4 h-4 ${
                idx < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
              }`}
            />
          ))}
          <span className="text-gray-500 text-sm ml-2">({rating}.0)</span>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {description}
        </p>

        {/* Price & Buy Button */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-blue-600">
              Rs. {numericPrice.toLocaleString()}
            </span>
            {cutPrice > 0 && (
              <span className="text-gray-400 text-sm line-through">
                Rs. {cutPrice.toLocaleString()}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/products/${$id}`);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2"
          >
            <ShoppingCart className="w-4 h-4" /> Buy Now
          </button>
        </div>
      </CardContent>
    </ShadCard>
  );
};

export default Card;

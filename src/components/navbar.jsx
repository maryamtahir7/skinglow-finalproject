import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Phone, Mail, Rocket, Heart, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUser } from "../context/UserContext";
import { logout } from "../backend/auth";
import { getCart, getWishlist } from "../backend/database";

export default function Navbar() {
  const { user, setUser } = useUser();
  const navigate = useNavigate();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);

  const navItems = ["Home", "Products", "About", "Orders"];

  // Fetch cart + wishlist counts
  const fetchCounts = async () => {
    if (!user) return;
    try {
      const cart = await getCart(user.$id);
      setCartCount(cart.documents?.length || 0);

      const wishlist = await getWishlist(user.$id);
      setWishlistCount(wishlist.documents?.length || 0);
    } catch (err) {
      console.error("Failed to fetch counts:", err);
    }
  };

  useEffect(() => {
    fetchCounts();
  }, [user]);

  // Logout handler
  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      navigate("/login");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  // Navigate to AI Chat page
  const handleAIChat = () => {
    navigate("/ai-chat");
  };

  // Nav link component (desktop + mobile)
  const NavItem = ({ item, isMobile = false }) => (
    <Link
      to={item === "Orders" ? "/orders" : `/${item.toLowerCase()}`}
      className={`relative group transition-all duration-300 ease-out ${
        isMobile
          ? "text-lg font-medium hover:text-white block py-3 px-4 rounded-lg hover:bg-white/5"
          : "hover:text-white"
      }`}
      onClick={() => setIsMobileMenuOpen(false)}
    >
      <span className="relative z-10">{item}</span>
      {!isMobile && (
        <span className="absolute left-0 -bottom-1 w-0 h-[3px] bg-gradient-to-r from-violet-400 to-fuchsia-500 group-hover:w-full transition-all duration-300 ease-out rounded-full"></span>
      )}
    </Link>
  );

  return (
    <nav className="w-full bg-gradient-to-br from-gray-900 via-violet-900 to-fuchsia-900 text-white px-6 md:px-12 py-4 flex items-center justify-between shadow-lg sticky top-0 z-50 border-b border-white/10 backdrop-blur-sm">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-3 text-2xl font-black tracking-wide group">
        <div className="w-12 h-12">
          <img
            src="/MT-Store.png"
            alt="MT-Stores Logo"
            className="w-full h-full object-contain rounded-lg"
          />
        </div>
        <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent hover:from-violet-300 hover:to-fuchsia-300 transition-all duration-300">
          MT-STORES
        </span>
      </Link>

      {/* Desktop Navigation */}
      <ul className="hidden md:flex gap-10 text-lg text-gray-300 font-semibold tracking-wide">
        {navItems.map((item) => (
          <li key={item}>
            <NavItem item={item} />
          </li>
        ))}
      </ul>

      {/* Desktop Actions */}
      <div className="hidden md:flex items-center gap-6">
        {/* Wishlist */}
        <Link to="/wishlist" className="relative">
          <Heart className="h-6 w-6 text-pink-400 hover:scale-110 transition" />
          {wishlistCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
              {wishlistCount}
            </span>
          )}
        </Link>

        {/* Cart */}
        <Link to="/cart" className="relative">
          <ShoppingCart className="h-6 w-6 text-yellow-400 hover:scale-110 transition" />
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-yellow-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
              {cartCount}
            </span>
          )}
        </Link>

        {/* AI Chat Button */}
        <button
          onClick={handleAIChat}
          className="p-2 bg-violet-600 hover:bg-violet-700 rounded-full text-white flex items-center justify-center transition-all duration-300"
          title="AI Chat"
        >
          💬
        </button>

        {/* Auth Buttons */}
        {!user ? (
          <>
            <Link to="/login">
              <Button className="bg-white/5 border border-white/20 text-violet-300 hover:bg-violet-400 hover:text-white rounded-full px-6 py-2 transition-all duration-300 font-semibold backdrop-blur-sm hover:shadow-lg">
                Login
              </Button>
            </Link>
            <Link to="/signup">
              <Button className="bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 text-white font-bold rounded-full px-8 py-2 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-violet-500/25">
                Sign Up
              </Button>
            </Link>
          </>
        ) : (
          <>
            <span className="text-sm text-gray-200">Hi, {user.name || user.email}</span>
            <Button
              onClick={handleLogout}
              className="bg-red-600/80 hover:bg-red-700 text-white rounded-full px-6 shadow-md transition-all duration-300"
            >
              Logout
            </Button>
          </>
        )}
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-lg hover:bg-white/10 transition-colors duration-300"
        >
          <div className="w-6 h-6 flex flex-col justify-center items-center">
            <span
              className={`bg-violet-400 block h-0.5 w-6 rounded-sm transition-all duration-300 ${
                isMobileMenuOpen ? "rotate-45 translate-y-1" : "-translate-y-0.5"
              }`}
            />
            <span
              className={`bg-violet-400 block h-0.5 w-6 rounded-sm transition-all duration-300 ${
                isMobileMenuOpen ? "opacity-0" : "opacity-100"
              } my-0.5`}
            />
            <span
              className={`bg-violet-400 block h-0.5 w-6 rounded-sm transition-all duration-300 ${
                isMobileMenuOpen ? "-rotate-45 -translate-y-1" : "translate-y-0.5"
              }`}
            />
          </div>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Slide-in Menu */}
          <div className="absolute right-0 top-0 h-full w-80 bg-gradient-to-br from-gray-900 via-violet-900 to-fuchsia-900 shadow-2xl transform transition-transform duration-300">
            <div className="p-6">
              {/* Mobile Header */}
              <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/10">
                <Link to="/" className="flex items-center gap-3 text-xl font-black text-violet-400">
                  <img src="/MT-Store.png" alt="MT-Stores Logo" className="w-10 h-10 rounded-md" />
                  MT-STORES
                </Link>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors duration-300"
                >
                  <span className="text-2xl text-gray-400">&times;</span>
                </button>
              </div>

              {/* Mobile Navigation */}
              <ul className="flex flex-col gap-2 border-b border-white/10 pb-6 mb-6">
                {navItems.map((item) => (
                  <li key={item}>
                    <NavItem item={item} isMobile />
                  </li>
                ))}
              </ul>

              {/* Wishlist, Cart & AI Chat */}
              <div className="flex gap-4 mb-6">
                <Link to="/wishlist" className="relative">
                  <Heart className="h-7 w-7 text-pink-400" />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                      {wishlistCount}
                    </span>
                  )}
                </Link>
                <Link to="/cart" className="relative">
                  <ShoppingCart className="h-7 w-7 text-yellow-400" />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-yellow-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                      {cartCount}
                    </span>
                  )}
                </Link>
                {/* Mobile AI Chat */}
                <button
                  onClick={handleAIChat}
                  className="p-2 bg-violet-600 hover:bg-violet-700 rounded-full text-white flex items-center justify-center transition-all duration-300"
                  title="AI Chat"
                >
                  💬
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

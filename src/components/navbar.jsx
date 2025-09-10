import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, ShoppingCart, User as UserIcon, LogOut, LogIn, UserPlus } from "lucide-react";
import { useUser } from "../context/UserContext";
import { logout } from "../backend/auth";
import { getCart, getWishlist } from "../backend/database";

export default function Navbar() {
  const { user, setUser } = useUser();
  const navigate = useNavigate();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);

  const navItems = ["Home", "Products", "About", "Orders", "Contact"];

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

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      navigate("/login");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const handleAIChat = () => {
    navigate("/ai-chat");
  };

  const NavItem = ({ item, isMobile = false }) => (
    <Link
      to={item === "Orders" ? "/orders" : `/${item.toLowerCase()}`}
      className={`relative group transition-all duration-300 ease-out ${
        isMobile
          ? "text-lg font-medium text-gray-200 hover:text-violet-300 block py-3 px-4 rounded-lg hover:bg-violet-800/40"
          : "hover:text-violet-300 text-gray-300"
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
      <ul className="hidden md:flex gap-10 text-lg font-semibold tracking-wide">
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

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="w-10 h-10 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 flex items-center justify-center text-white font-bold shadow hover:scale-105 transition"
          >
            {user ? user.name?.charAt(0).toUpperCase() || "U" : <UserIcon className="w-5 h-5" />}
          </button>

          {/* Dropdown Menu */}
          {isUserMenuOpen && (
            <div className="absolute right-0 mt-3 w-48 bg-white text-gray-800 rounded-lg shadow-lg overflow-hidden z-50">
              {!user ? (
                <>
                  <Link
                    to="/login"
                    className="flex items-center gap-2 px-4 py-3 hover:bg-gray-100 transition"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    <LogIn className="w-4 h-4 text-violet-600" /> Login
                  </Link>
                  <Link
                    to="/signup"
                    className="flex items-center gap-2 px-4 py-3 hover:bg-gray-100 transition"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    <UserPlus className="w-4 h-4 text-fuchsia-600" /> Sign Up
                  </Link>
                </>
              ) : (
                <>
                  <div className="px-4 py-3 text-sm text-gray-700 border-b">
                    Hi, <span className="font-semibold">{user.name || user.email}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full px-4 py-3 text-left hover:bg-gray-100 transition text-red-600"
                  >
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </>
              )}
            </div>
          )}
        </div>
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
    </nav>
  );
}

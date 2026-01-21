import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, ShoppingCart, User as UserIcon, LogOut, LogIn, UserPlus, Menu, X, Sparkles, Search, Package, IdCard } from "lucide-react";
import { useUser } from "../context/UserContext";
import { logout } from "../backend/auth";
import { getCart, getWishlist } from "../backend/database";
import InstallPWAButton from "./InstallPWAButton";

export default function Navbar() {
  const { user, setUser } = useUser();
  const navigate = useNavigate();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = () => {
    if (searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm(""); // Optional: clear after search
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Skincare-themed nav items
  const navItems = ["Home", "Shop", "Routine", "Concerns", "Quiz", "Journal"];

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

  const NavItem = ({ item, isMobile = false }) => {
    // Map display names to routes
    let route = `/${item.toLowerCase().replace(" ", "-")}`;
    if (item === "Shop") route = "/products";
    if (item === "Routine") route = "/routine"; // page to be created
    if (item === "Concerns") route = "/concerns";
    if (item === "Quiz") route = "/skin-quiz";
    if (item === "Journal") route = "/blog";
    if (item === "Home") route = "/";

    return (
      <Link
        to={route}
        className={`relative group transition-all duration-300 font-medium ${isMobile
          ? "text-lg text-slate-700 hover:text-primary block py-3 px-4 rounded-lg hover:bg-secondary"
          : "text-slate-600 hover:text-primary"
          }`}
        onClick={() => setIsMobileMenuOpen(false)}
      >
        <span className="relative z-10">{item}</span>
        {!isMobile && (
          <span className="absolute left-0 -bottom-1 w-0 h-[3px] bg-primary group-hover:w-full transition-all duration-300 rounded-full"></span>
        )}
      </Link>
    );
  };

  return (
    <>
      <nav className="w-full bg-white text-slate-800 px-4 md:px-12 py-4 flex items-center justify-between shadow-sm sticky top-0 z-50 border-b border-slate-100">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 text-2xl font-bold tracking-tight group">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white shadow-primary/30 shadow-lg">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <span className="text-foreground group-hover:text-primary transition-colors">
            Skin<span className="text-primary">Glow</span>
          </span>
        </Link>

        {/* Search Bar (Hidden on mobile, new addition) */}
        <div className="hidden lg:flex flex-1 max-w-lg mx-10 relative">
          <input
            type="text"
            placeholder="Search for serums, cleansers..."
            className="w-full pl-4 pr-10 py-2.5 rounded-full bg-slate-50 border border-slate-200 focus:border-primary focus:ring-2 focus:ring-secondary outline-none transition-all text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary"
            onClick={handleSearch}
          >
            <Search className="w-5 h-5" />
          </button>
        </div>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex gap-8 text-base font-semibold">
          {navItems.map((item) => (
            <li key={item}>
              <NavItem item={item} />
            </li>
          ))}
        </ul>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-5">
          {/* Wishlist */}
          <Link to="/wishlist" className="relative group">
            <div className="p-2 rounded-full hover:bg-slate-50 transition-colors">
              <Heart className="h-6 w-6 text-slate-600 group-hover:text-pink-500 transition-colors" />
            </div>
            {wishlistCount > 0 && (
              <span className="absolute top-0 right-0 bg-pink-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Cart */}
          <Link to="/cart" className="relative group">
            <div className="p-2 rounded-full hover:bg-secondary transition-colors">
              <ShoppingCart className="h-6 w-6 text-slate-600 group-hover:text-primary transition-colors" />
            </div>
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 bg-primary text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Install App Button (PWA) */}
          <InstallPWAButton />

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-primary font-bold hover:bg-secondary transition"
            >
              {user ? user.name?.charAt(0).toUpperCase() || "U" : <UserIcon className="w-5 h-5" />}
            </button>

            {/* Dropdown Menu */}
            {isUserMenuOpen && (
              <div className="absolute right-0 mt-3 w-56 bg-white text-slate-800 rounded-xl shadow-xl border border-slate-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                {!user ? (
                  <>
                    <Link
                      to="/login"
                      className="flex items-center gap-3 px-5 py-3 hover:bg-secondary transition"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <LogIn className="w-4 h-4 text-primary" /> Login
                    </Link>
                    <Link
                      to="/signup"
                      className="flex items-center gap-3 px-5 py-3 hover:bg-secondary transition"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <UserPlus className="w-4 h-4 text-primary" /> Sign Up
                    </Link>
                  </>
                ) : (
                  <>
                    <div className="px-5 py-4 text-sm bg-slate-50 border-b border-slate-100">
                      <p className="text-slate-500 text-xs uppercase font-bold tracking-wider mb-1">
                        Signed in as
                      </p>
                      <p className="font-semibold text-slate-900 truncate">
                        {user.name || user.email}
                      </p>
                    </div>

                    <Link
                      to="/profile"
                      className="flex items-center gap-3 px-5 py-3 hover:bg-secondary transition text-sm"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <IdCard className="w-4 h-4 text-primary" /> My Profile
                    </Link>
                    <Link
                      to="/orders"
                      className="flex items-center gap-3 px-5 py-3 hover:bg-secondary transition text-sm"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <Package className="w-4 h-4 text-primary" /> My Orders
                    </Link>
                    <Link
                      to="/wishlist"
                      className="flex items-center gap-3 px-5 py-3 hover:bg-secondary transition text-sm"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <Heart className="w-4 h-4 text-pink-500" /> Wishlist
                    </Link>
                    <Link
                      to="/cart"
                      className="flex items-center gap-3 px-5 py-3 hover:bg-secondary transition text-sm"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <ShoppingCart className="w-4 h-4 text-primary" /> Cart
                    </Link>
                    <Link
                      to="/ai-chat"
                      className="flex items-center gap-3 px-5 py-3 hover:bg-secondary transition text-sm"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <Sparkles className="w-4 h-4 text-amber-500" /> Ask AI
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full px-5 py-3 text-left hover:bg-red-50 text-red-600 transition border-t border-slate-100 mt-1"
                    >
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Mobile Actions */}
        <div className="flex md:hidden items-center gap-3">
          {/* Mobile User Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-slate-900/50 z-40 md:hidden backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      {/* Mobile Menu */}
      <div className={`fixed top-0 right-0 h-full w-[85%] max-w-sm bg-white text-slate-800 z-50 shadow-2xl transform transition-transform duration-300 ease-out md:hidden ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}>
        <div className="flex flex-col h-full">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <span className="text-xl font-bold text-primary">Menu</span>
            <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 bg-slate-100 rounded-full">
              <X className="w-5 h-5 text-slate-500" />
            </button>
          </div>

          {/* Mobile Navigation Items */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {navItems.map((item) => (
              <NavItem key={item} item={item} isMobile={true} />
            ))}

            <hr className="my-4 border-slate-100" />

            {/* Mobile User Actions */}
            <div className="mt-4 space-y-2">
              {!user ? (
                <div className="grid grid-cols-2 gap-3">
                  <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="text-center py-2.5 rounded-lg border border-slate-200 font-medium text-slate-600">Login</Link>
                  <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)} className="text-center py-2.5 rounded-lg bg-primary text-white font-medium">Sign Up</Link>
                </div>
              ) : (
                <div className="space-y-1">
                  <p className="text-xs text-slate-400 px-1 mb-1">
                    Signed in as <span className="font-semibold text-slate-700">{user.name || user.email}</span>
                  </p>
                  <Link
                    to="/profile"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-secondary text-sm"
                  >
                    <IdCard className="w-4 h-4 text-primary" /> My Profile
                  </Link>
                  <Link
                    to="/orders"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-secondary text-sm"
                  >
                    <Package className="w-4 h-4 text-primary" /> My Orders
                  </Link>
                  <Link
                    to="/wishlist"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-secondary text-sm"
                  >
                    <Heart className="w-4 h-4 text-pink-500" /> Wishlist
                  </Link>
                  <Link
                    to="/cart"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-secondary text-sm"
                  >
                    <ShoppingCart className="w-4 h-4 text-primary" /> Cart
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-2 text-red-600 px-4 py-3 font-medium hover:bg-red-50 rounded-lg w-full mt-1"
                  >
                    <LogOut className="w-5 h-5" /> Logout
                  </button>
                </div>
              )}
            </div>

          </div>

          {/* Mobile Footer */}
          <div className="p-6 bg-slate-50 border-t border-slate-100">
            <p className="text-xs text-slate-400 text-center">
              SkinGlow &copy; 2024
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
import "./App.css";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";

import LoginForm from "./pages/login";
import SignupForm from "./pages/signup";
import AddProductForm from "./pages/admin/addproduct";
import AdminProducts from "./pages/admin/allproducts";
import AdminPage from "./pages/admin/adminpage";
import OrdersPage from "./pages/admin/OrdersPage";
import ReportsPage from "./pages/admin/ReportsPage";
import StocksPage from "./pages/admin/StocksPage";
import AIEmployee from "./pages/admin/AIEmployee";
import UsersPage from "./pages/admin/UsersPage";
import Homepage from "./pages/homepage";
import ProductsPage from "./pages/products";
import ProductDetailPage from "./pages/productdetail";
import CartPage from "./pages/CartPage";
import WishlistPage from "./pages/WishlistPage";
import CheckoutPage from "./pages/CheckoutPage";
import MainLayout from "./components/mainlayout";
import AboutPage from "./pages/about";
import AdminRoute from "./components/AdminRoute";
import PolicyPage from "./pages/privacypolicy";
import Categories from "./pages/admin/categories";
import UserOrdersPage from "./pages/UserOrdersPage"; // ✅ user orders page
import UserProfilePage from "./pages/UserProfilePage";
import AIChat from "./pages/AIChat";
import ContactPage from "./pages/Contact";

import BlogPage from "./pages/BlogPage";
import BlogDetailPage from "./pages/BlogDetailPage";
import ConcernPage from "./pages/ConcernPage"; // New Page
import TermsPage from "./pages/TermsPage";
import LicensePage from "./pages/LicensePage";

import AdminReviews from "./pages/admin/reviews";
import SkinQuiz from "./pages/SkinQuiz";
import RoutinePage from "./pages/RoutinePage";
import FaceScanPage from "./pages/FaceScanPage";


import SupportPage from "./pages/SupportPage";
import ReturnsPage from "./pages/ReturnsPage";
import ShippingPage from "./pages/ShippingPage";

import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";

import ScrollToTop from "./components/ScrollToTop";

import { ToastProvider } from "./context/ToastContext";

function FloatingAITrigger() {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => navigate("/ai-chat")}
      aria-label="Open SkinGlow AI chat"
      className="fixed bottom-6 right-6 z-[10000] group flex items-center gap-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-3 shadow-2xl ring-1 ring-white/30 hover:scale-105 active:scale-95 transition-all duration-300"
    >
      <span className="absolute inset-0 rounded-full animate-ping bg-pink-400/25 pointer-events-none" />
      <span className="relative inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
        <Sparkles className="h-4 w-4" />
      </span>
      <span className="relative text-sm font-semibold tracking-wide">SkinGlow AI</span>
      <span className="absolute -top-11 right-0 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[11px] px-2.5 py-1.5 rounded-lg whitespace-nowrap shadow-lg">
        Ask your AI Esthetician ✨
      </span>
    </button>
  );
}

function App() {
  return (
    <ToastProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Public layout with navbar, footer, etc. */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Homepage />} />
            <Route path="/home" element={<Homepage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/:id" element={<ProductDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/signup" element={<SignupForm />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/privacy-policy" element={<PolicyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/license" element={<LicensePage />} />
            <Route path="/contact" element={<ContactPage />} />

            <Route path="/support" element={<SupportPage />} />
            <Route path="/returns" element={<ReturnsPage />} />
            <Route path="/shipping" element={<ShippingPage />} />
            <Route path="/face-scan" element={<FaceScanPage />} />

            {/* User Profile & Orders */}
            <Route path="/profile" element={<UserProfilePage />} />
            <Route path="/orders" element={<UserOrdersPage />} />

            {/* ✅ AI Chat route */}
            <Route path="/ai-chat" element={<AIChat />} />
            <Route path="/skin-quiz" element={<SkinQuiz />} />
            <Route path="/concerns" element={<ConcernPage />} /> {/* New Route */}
            <Route path="/routine" element={<RoutinePage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:id" element={<BlogDetailPage />} />
          </Route>


          {/* Admin-only routes */}
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminPage />}>
              <Route path="add-product" element={<AddProductForm />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="categories" element={<Categories />} />
              <Route path="reviews" element={<AdminReviews />} />
              <Route path="orders" element={<OrdersPage />} />
              <Route path="reports" element={<ReportsPage />} />
              <Route path="stock" element={<StocksPage />} />
              <Route path="users" element={<UsersPage />} />
              <Route path="ai-employee" element={<AIEmployee />} />
            </Route>
          </Route>
        </Routes>

        {/* Floating AI Chat Trigger */}
        <FloatingAITrigger />
      </Router>
    </ToastProvider>
  );
}

export default App;

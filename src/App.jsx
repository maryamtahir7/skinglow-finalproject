import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import LoginForm from "./pages/login";
import SignupForm from "./pages/signup";
import AddProductForm from "./pages/admin/addproduct";
import AdminProducts from "./pages/admin/allproducts";
import AdminPage from "./pages/admin/adminpage";
import OrdersPage from "./pages/admin/OrdersPage";
import ReportsPage from "./pages/admin/ReportsPage";
import StocksPage from "./pages/admin/StocksPage";
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
import ConcernPage from "./pages/ConcernPage"; // New Page
import TermsPage from "./pages/TermsPage";
import LicensePage from "./pages/LicensePage";

import AdminReviews from "./pages/admin/reviews";
import SkinQuiz from "./pages/SkinQuiz";
import RoutinePage from "./pages/RoutinePage";


function App() {
  return (
    <Router>
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
          <Route path="/about" element={<AboutPage />} />
          <Route path="/privacy-policy" element={<PolicyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/license" element={<LicensePage />} />
          <Route path="/contact" element={<ContactPage />} />  {/* Contact page route */}

          {/* User Profile & Orders */}
          <Route path="/profile" element={<UserProfilePage />} />
          <Route path="/orders" element={<UserOrdersPage />} />

          {/* ✅ AI Chat route */}
          <Route path="/ai-chat" element={<AIChat />} />
          <Route path="/skin-quiz" element={<SkinQuiz />} />
          <Route path="/concerns" element={<ConcernPage />} /> {/* New Route */}
          <Route path="/routine" element={<RoutinePage />} />
          <Route path="/blog" element={<BlogPage />} />
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
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

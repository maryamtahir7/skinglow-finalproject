// src/pages/admin/AdminPage.jsx
import React, { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  ClipboardList,
  Boxes,
  Menu,
  X,
  Sparkles,
  Users,
  LogOut,
  Layers,
  ShoppingBag,
  Star,
  TrendingUp,
  AlertCircle,
  BarChart3,
  Bot
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AdminPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { icon: LayoutDashboard, label: "Overview", path: "/admin" },
    { icon: Package, label: "Products", path: "/admin/products" },
    { icon: PlusCircle, label: "Add Product", path: "/admin/add-product" },
    { icon: ClipboardList, label: "Orders", path: "/admin/orders" },
    { icon: Star, label: "Reviews", path: "/admin/reviews" },
    { icon: Layers, label: "Categories", path: "/admin/categories" },
    { icon: Boxes, label: "Inventory", path: "/admin/stock" },
    { icon: BarChart3, label: "Reports", path: "/admin/reports" },
    { icon: Bot, label: "AI Employee", path: "/admin/ai-employee" },
  ];

  const isActive = (path) => {
    if (path === "/admin" && location.pathname === "/admin") return true;
    if (path !== "/admin" && location.pathname.startsWith(path)) return true;
    return false;
  };

  // If we are at the root admin path, show the dashboard widgets
  const isDashboardRoot = location.pathname === "/admin";

  return (
    <div className="min-h-screen flex bg-background font-sans text-foreground">

      {/* Sidebar (Desktop) */}
      <aside className="hidden lg:flex flex-col w-64 bg-card border-r border-border fixed h-full z-20">
        <div className="p-6 border-b border-border flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded-xl">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="font-bold text-lg tracking-tight text-foreground">SkinGlow</h1>
            <p className="text-xs text-muted-foreground uppercase tracking-widest">Admin Panel</p>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all font-medium text-sm ${isActive(item.path)
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3 px-3 py-2 bg-secondary/50 rounded-xl">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">A</div>
            <div className="flex-1">
              <p className="text-sm font-bold text-foreground">Admin User</p>
              <p className="text-xs text-muted-foreground">Manager</p>
            </div>
            <button className="text-muted-foreground hover:text-red-500 transition-colors">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-64 min-w-0 bg-secondary/10">

        {/* Mobile Header */}
        <header className="lg:hidden bg-card border-b border-border px-4 py-3 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 p-1.5 rounded-lg">
              <Sparkles className="w-4 h-4 text-primary" />
            </div>
            <span className="font-bold text-foreground">SkinGlow Admin</span>
          </div>
          <button onClick={() => setMobileMenuOpen(true)}>
            <Menu className="w-6 h-6 text-muted-foreground" />
          </button>
        </header>

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 bg-black/50 lg:hidden" onClick={() => setMobileMenuOpen(false)}>
            <div className="absolute right-0 top-0 h-full w-64 bg-card shadow-2xl p-4" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-8">
                <h2 className="font-bold text-lg">Menu</h2>
                <button onClick={() => setMobileMenuOpen(false)}>
                  <X className="w-6 h-6 text-muted-foreground" />
                </button>
              </div>
              <nav className="space-y-2">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all ${isActive(item.path)
                      ? "bg-primary/10 text-primary font-bold"
                      : "text-muted-foreground hover:bg-secondary"
                      }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="text-sm">{item.label}</span>
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        )}

        {/* Dashboard Content */}
        <main className="p-6">
          {isDashboardRoot ? (
            <div className="max-w-6xl mx-auto space-y-8">
              {/* Welcome */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
                  <p className="text-muted-foreground">Overview of your store performance.</p>
                </div>
                <div className="flex items-center gap-3 bg-card px-4 py-2 rounded-full border border-border shadow-sm">
                  <span className="text-sm font-medium flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div> Live Store
                  </span>
                  <span className="h-4 w-px bg-border"></span>
                  <span className="text-sm font-mono text-muted-foreground">
                    {new Date().toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-card border border-border shadow-sm rounded-xl overflow-hidden hover:shadow-md transition group">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-primary/10 rounded-lg text-primary group-hover:scale-110 transition-transform">
                        <Package className="w-6 h-6" />
                      </div>
                    </div>
                    <h3 className="text-muted-foreground text-sm font-medium">Total Products</h3>
                    <p className="text-3xl font-bold text-foreground mt-1">124</p>
                  </div>
                  <div className="bg-secondary/50 px-6 py-2 border-t border-border">
                    <Link to="/admin/products" className="text-xs font-bold text-primary hover:underline">View Inventory &rarr;</Link>
                  </div>
                </Card>

                <Card className="bg-card border border-border shadow-sm rounded-xl overflow-hidden hover:shadow-md transition group">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-lg text-orange-600">
                        <AlertCircle className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-bold text-orange-700 bg-orange-100 px-2 py-1 rounded-full">3 Alert</span>
                    </div>
                    <h3 className="text-muted-foreground text-sm font-medium">Low Stock</h3>
                    <p className="text-3xl font-bold text-foreground mt-1">3</p>
                  </div>
                  <div className="bg-secondary/50 px-6 py-2 border-t border-border">
                    <Link to="/admin/stock" className="text-xs font-bold text-primary hover:underline">Restock Now &rarr;</Link>
                  </div>
                </Card>

                <Card className="bg-card border border-border shadow-sm rounded-xl overflow-hidden hover:shadow-md transition group">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg text-blue-600">
                        <ShoppingBag className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-bold text-blue-700 bg-blue-100 px-2 py-1 rounded-full text-nowrap">+5 New</span>
                    </div>
                    <h3 className="text-muted-foreground text-sm font-medium">Pending Orders</h3>
                    <p className="text-3xl font-bold text-foreground mt-1">12</p>
                  </div>
                  <div className="bg-secondary/50 px-6 py-2 border-t border-border">
                    <Link to="/admin/orders" className="text-xs font-bold text-primary hover:underline">Process Orders &rarr;</Link>
                  </div>
                </Card>

                <Card className="bg-card border border-border shadow-sm rounded-xl overflow-hidden hover:shadow-md transition group">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-emerald-100 dark:bg-emerald-900/20 rounded-lg text-emerald-600">
                        <TrendingUp className="w-6 h-6" />
                      </div>
                    </div>
                    <h3 className="text-muted-foreground text-sm font-medium">Total Revenue</h3>
                    <p className="text-3xl font-bold text-foreground mt-1">$4,250</p>
                  </div>
                  <div className="bg-secondary/50 px-6 py-2 border-t border-border">
                    <span className="text-xs font-bold text-emerald-600">+18% this month</span>
                  </div>
                </Card>
              </div>

              {/* Quick Actions */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
                  <h3 className="font-bold text-foreground mb-4">Quick Actions</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <Button onClick={() => window.location.href = '/admin/add-product'} className="bg-primary hover:bg-primary/90 text-primary-foreground w-full">
                      <PlusCircle className="mr-2 h-4 w-4" /> Add Product
                    </Button>
                    <Button variant="outline" className="border-border text-foreground w-full hover:bg-secondary">
                      <Boxes className="mr-2 h-4 w-4" /> Check Stock
                    </Button>
                  </div>
                </div>

                <div className="bg-primary/5 rounded-xl p-6 relative overflow-hidden flex flex-col justify-center border border-primary/10">
                  <Users className="absolute right-4 bottom-4 w-24 h-24 text-primary opacity-10" />
                  <h3 className="font-bold text-lg mb-2 text-foreground">Customers</h3>
                  <div className="text-4xl font-bold mb-4 text-primary">1,204</div>
                  <div className="text-sm text-muted-foreground">Total registered users.</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-6xl mx-auto">
              <Outlet />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

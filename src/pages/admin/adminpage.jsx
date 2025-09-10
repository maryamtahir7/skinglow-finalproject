import React from "react";
import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  HomeIcon,
  ClipboardList,
  BoltIcon,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AdminPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-white to-indigo-50">
      {/* Top Navigation */}
      <header className="w-full bg-white/80 backdrop-blur-lg border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-indigo-700 font-extrabold text-xl">
            <LayoutDashboard className="h-6 w-6" />
            Admin Dashboard
          </div>
          <nav className="hidden md:flex gap-4">
            <Link to="/admin" className="flex items-center gap-1 text-gray-700 hover:text-indigo-600 transition">
              <HomeIcon className="h-5 w-5" /> Home
            </Link>
            <Link to="/admin/products" className="flex items-center gap-1 text-gray-700 hover:text-indigo-600 transition">
              <Package className="h-5 w-5" /> Products
            </Link>
            <Link to="/admin/add-product" className="flex items-center gap-1 text-gray-700 hover:text-indigo-600 transition">
              <PlusCircle className="h-5 w-5" /> Add
            </Link>
            <Link to="/admin/orders" className="flex items-center gap-1 text-gray-700 hover:text-indigo-600 transition">
              <ClipboardList className="h-5 w-5" /> Orders
            </Link>
            <Link to="/admin/categories" className="flex items-center gap-1 text-gray-700 hover:text-indigo-600 transition">
              <BoltIcon className="h-5 w-5" /> Categories
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Dashboard */}
      <main className="flex-1 max-w-7xl mx-auto px-6 py-10">
        {/* Welcome Card */}
        <Card className="mb-10 shadow-lg border-none bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-2xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Welcome, Admin 🎉</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm md:text-base opacity-90">
              Manage your products, orders, and categories all in one modern, clean dashboard.
            </p>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <Card className="rounded-xl shadow-md hover:shadow-xl transition bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-indigo-600">
                <Package className="h-5 w-5" /> Products
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-gray-800">128</p>
              <p className="text-sm text-gray-500">Active items in store</p>
            </CardContent>
          </Card>

          <Card className="rounded-xl shadow-md hover:shadow-xl transition bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-600">
                <ClipboardList className="h-5 w-5" /> Orders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-gray-800">56</p>
              <p className="text-sm text-gray-500">Pending & completed</p>
            </CardContent>
          </Card>

          <Card className="rounded-xl shadow-md hover:shadow-xl transition bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-pink-600">
                <BoltIcon className="h-5 w-5" /> Categories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-gray-800">12</p>
              <p className="text-sm text-gray-500">Organized sections</p>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 justify-center md:justify-start">
          <Link to="/admin/products">
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-6 py-3 shadow-md transition">
              Manage Products
            </Button>
          </Link>
          <Link to="/admin/add-product">
            <Button className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl px-6 py-3 shadow-md transition">
              Add New Product
            </Button>
          </Link>
          <Link to="/admin/orders">
            <Button className="bg-pink-600 hover:bg-pink-700 text-white rounded-xl px-6 py-3 shadow-md transition">
              View Orders
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}

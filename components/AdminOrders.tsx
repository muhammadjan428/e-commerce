"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { PurchaseWithProducts } from "@/lib/actions/purchase.actions";
import { 
  ShoppingCart, 
  DollarSign, 
  Package, 
  TrendingUp, 
  Search, 
  Filter,
  Star,
  Calendar,
  MapPin,
  User,
  Eye
} from "lucide-react";

interface AdminOrdersClientProps {
  initialPurchases: PurchaseWithProducts[];
  stats: {
    overview: {
      totalPurchases: number;
      totalRevenue: number;
      totalProducts: number;
    };
    statusBreakdown: Array<{ _id: string; count: number }>;
    monthlyTrends: Array<{
      _id: { year: number; month: number };
      totalSales: number;
      orderCount: number;
    }>;
  };
}

export default function AdminOrdersClient({ 
  initialPurchases, 
  stats 
}: AdminOrdersClientProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "amount" | "name">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [filterBy, setFilterBy] = useState<"all" | "high" | "low">("all");

  const filteredAndSortedPurchases = useMemo(() => {
    let filtered = initialPurchases.filter(purchase => 
      purchase.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      purchase.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      purchase.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      purchase.products.some(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );

    // Apply amount filter
    if (filterBy === "high") {
      filtered = filtered.filter(purchase => purchase.amount > 100);
    } else if (filterBy === "low") {
      filtered = filtered.filter(purchase => purchase.amount <= 100);
    }

    // Sort
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case "date":
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case "amount":
          comparison = a.amount - b.amount;
          break;
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
      }
      
      return sortOrder === "asc" ? comparison : -comparison;
    });

    return filtered;
  }, [initialPurchases, searchTerm, sortBy, sortOrder, filterBy]);

  const averageOrderValue = stats.overview.totalPurchases > 0 
    ? stats.overview.totalRevenue / stats.overview.totalPurchases 
    : 0;

  return (
    <>
      {/* Header Section */}
      <div className="mb-12 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full text-blue-800 text-sm font-medium mb-4">
          <ShoppingCart className="w-4 h-4" />
          <span>Order Management</span>
        </div>
        <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent mb-4">
          Orders Dashboard
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Monitor and manage all customer orders with detailed analytics
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
        <div className="group bg-white/70 backdrop-blur-sm rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 border border-white/20 transform hover:scale-[1.02] hover:-translate-y-2">
          <div className="p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <ShoppingCart className="w-8 h-8 text-white" />
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-gray-600 uppercase tracking-wide mb-1">
                  Total Orders
                </div>
                <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {stats.overview.totalPurchases.toLocaleString()}
                </div>
              </div>
            </div>
            <div className="w-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full h-2">
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full" style={{ width: '75%' }}></div>
            </div>
          </div>
        </div>

        <div className="group bg-white/70 backdrop-blur-sm rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 border border-white/20 transform hover:scale-[1.02] hover:-translate-y-2">
          <div className="p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <DollarSign className="w-8 h-8 text-white" />
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-gray-600 uppercase tracking-wide mb-1">
                  Total Revenue
                </div>
                <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  ${stats.overview.totalRevenue.toFixed(2)}
                </div>
              </div>
            </div>
            <div className="w-full bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-full h-2">
              <div className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full" style={{ width: '85%' }}></div>
            </div>
          </div>
        </div>

        <div className="group bg-white/70 backdrop-blur-sm rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 border border-white/20 transform hover:scale-[1.02] hover:-translate-y-2">
          <div className="p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Package className="w-8 h-8 text-white" />
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-gray-600 uppercase tracking-wide mb-1">
                  Products Sold
                </div>
                <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {stats.overview.totalProducts.toLocaleString()}
                </div>
              </div>
            </div>
            <div className="w-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full h-2">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full" style={{ width: '60%' }}></div>
            </div>
          </div>
        </div>

        <div className="group bg-white/70 backdrop-blur-sm rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 border border-white/20 transform hover:scale-[1.02] hover:-translate-y-2">
          <div className="p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-gray-600 uppercase tracking-wide mb-1">
                  Average Order
                </div>
                <div className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  ${averageOrderValue.toFixed(2)}
                </div>
              </div>
            </div>
            <div className="w-full bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-full h-2">
              <div className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full" style={{ width: '70%' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 mb-8">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
              <Filter className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Search & Filter</h2>
              <p className="text-gray-600">Find and organize your orders</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Search Orders</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/80 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "date" | "amount" | "name")}
                className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              >
                <option value="date">Date</option>
                <option value="amount">Amount</option>
                <option value="name">Customer Name</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Order</label>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
                className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              >
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Filter by Amount</label>
              <select
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value as "all" | "high" | "low")}
                className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              >
                <option value="all">All Orders</option>
                <option value="high">High Value ($100+)</option>
                <option value="low">Low Value (Under $100)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden">
        <div className="p-8 border-b border-gray-200/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl flex items-center justify-center">
                <Eye className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Orders Overview
                </h2>
                <p className="text-gray-600">
                  {filteredAndSortedPurchases.length} orders found
                </p>
              </div>
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full text-blue-800 text-sm font-medium">
              <Star className="w-4 h-4" />
              <span>{filteredAndSortedPurchases.length} Results</span>
            </div>
          </div>
        </div>
        
        {filteredAndSortedPurchases.length === 0 ? (
          <div className="px-8 py-12 text-center">
            <div className="w-24 h-24 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full mx-auto mb-6 flex items-center justify-center">
              <ShoppingCart className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-700 mb-2">No orders found</h3>
            <p className="text-gray-500 text-lg">Try adjusting your search criteria</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gradient-to-r from-gray-50 to-blue-50">
                  <th className="px-8 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Order Details
                  </th>
                  <th className="px-8 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Customer Info
                  </th>
                  <th className="px-8 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Products
                  </th>
                  <th className="px-8 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Order Value
                  </th>
                  <th className="px-8 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Date & Location
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200/50">
                {filteredAndSortedPurchases.map((purchase, index) => (
                  <tr key={purchase._id} className="hover:bg-blue-50/50 transition-colors duration-300 group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {index + 1}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-gray-900">
                            #{purchase._id.slice(-8)}
                          </div>
                          <div className="text-xs text-gray-500">Order ID</div>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-gray-900">{purchase.name}</div>
                          <div className="text-sm text-gray-500">{purchase.email}</div>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-8 py-6">
                      <div className="flex flex-col space-y-3 max-w-xs">
                        {purchase.products.slice(0, 2).map((product) => (
                          <div key={product._id} className="flex items-center space-x-3 group-hover:scale-[1.02] transition-transform duration-300">
                            {product.images.length > 0 && (
                              <div className="flex-shrink-0">
                                <Image
                                  src={product.images[0]}
                                  alt={product.name}
                                  width={48}
                                  height={48}
                                  className="rounded-xl object-cover shadow-md"
                                />
                              </div>
                            )}
                            <div className="min-w-0 flex-1">
                              <Link 
                                href={`/products/${product.slug}`}
                                className="text-sm font-semibold text-blue-600 hover:text-blue-800 truncate block transition-colors duration-300"
                              >
                                {product.name}
                              </Link>
                              <div className="text-sm font-medium text-green-600">${product.price}</div>
                            </div>
                          </div>
                        ))}
                        {purchase.products.length > 2 && (
                          <div className="text-sm text-gray-500 font-medium">
                            +{purchase.products.length - 2} more items
                          </div>
                        )}
                      </div>
                    </td>
                    
                    <td className="px-8 py-6">
                      <div className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                        ${purchase.amount.toFixed(2)}
                      </div>
                    </td>
                    
                    <td className="px-8 py-6">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <div className="text-sm text-gray-900 font-medium">
                            {new Date(purchase.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-xs text-gray-500">
                            {new Date(purchase.createdAt).toLocaleTimeString()}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <div className="text-sm text-gray-600">
                            {purchase.location}
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
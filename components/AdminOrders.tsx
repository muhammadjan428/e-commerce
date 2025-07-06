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
  Eye,
  ChevronDown
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-2 sm:p-2 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full text-blue-800 text-sm font-medium mb-4">
            <ShoppingCart className="w-4 h-4" />
            <span>Order Management</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent mb-4">
            Orders Dashboard
          </h1>
          <p className="text-sm sm:text-base lg:text-lg xl:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Monitor and manage all customer orders with detailed analytics
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="group bg-white/80 backdrop-blur-sm rounded-xl lg:rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 hover:scale-105">
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <ShoppingCart className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wide mb-1">
                    Total Orders
                  </div>
                  <div className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {stats.overview.totalPurchases.toLocaleString()}
                  </div>
                </div>
              </div>
              <div className="w-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full h-2">
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full" style={{ width: '75%' }}></div>
              </div>
            </div>
          </div>

          <div className="group bg-white/80 backdrop-blur-sm rounded-xl lg:rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 hover:scale-105">
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <DollarSign className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wide mb-1">
                    Total Revenue
                  </div>
                  <div className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                    ${stats.overview.totalRevenue.toFixed(2)}
                  </div>
                </div>
              </div>
              <div className="w-full bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-full h-2">
                <div className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>
          </div>

          <div className="group bg-white/80 backdrop-blur-sm rounded-xl lg:rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 hover:scale-105">
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Package className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wide mb-1">
                    Products Sold
                  </div>
                  <div className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    {stats.overview.totalProducts.toLocaleString()}
                  </div>
                </div>
              </div>
              <div className="w-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full h-2">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full" style={{ width: '60%' }}></div>
              </div>
            </div>
          </div>

          <div className="group bg-white/80 backdrop-blur-sm rounded-xl lg:rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 hover:scale-105">
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <TrendingUp className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wide mb-1">
                    Average Order
                  </div>
                  <div className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
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
        <div className="bg-white/80 backdrop-blur-sm rounded-xl lg:rounded-2xl shadow-lg border border-white/20 mb-8">
          <div className="p-4 sm:p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Filter className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">Search & Filter</h2>
                <p className="text-sm text-gray-600">Find and organize your orders</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="sm:col-span-2 lg:col-span-1">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Search Orders</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search orders..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/90 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Sort By</label>
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as "date" | "amount" | "name")}
                    className="w-full px-4 py-3 bg-white/90 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 appearance-none"
                  >
                    <option value="date">Date</option>
                    <option value="amount">Amount</option>
                    <option value="name">Customer Name</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Order</label>
                <div className="relative">
                  <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
                    className="w-full px-4 py-3 bg-white/90 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 appearance-none"
                  >
                    <option value="desc">Descending</option>
                    <option value="asc">Ascending</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Filter by Amount</label>
                <div className="relative">
                  <select
                    value={filterBy}
                    onChange={(e) => setFilterBy(e.target.value as "all" | "high" | "low")}
                    className="w-full px-4 py-3 bg-white/90 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 appearance-none"
                  >
                    <option value="all">All Orders</option>
                    <option value="high">High Value ($100+)</option>
                    <option value="low">Low Value (Under $100)</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl lg:rounded-2xl shadow-lg border border-white/20 overflow-hidden">
         <div className="p-3 sm:p-4 lg:p-6 border-b border-gray-200/50">
  <div className="flex items-center justify-between gap-3">
    <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
      <div className="w-9 h-9 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
        <Eye className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
      </div>
      <div className="min-w-0 flex-1">
        <h2 className="text-base sm:text-lg lg:text-xl xl:text-2xl font-bold text-gray-900 truncate">
          Orders Overview
        </h2>
        <p className="text-xs sm:text-sm text-gray-600 truncate">
          {filteredAndSortedPurchases.length} orders found
        </p>
      </div>
    </div>
    
    {/* Desktop badge */}
    <div className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full text-blue-800 text-sm font-medium flex-shrink-0">
      <Star className="w-4 h-4" />
      <span>{filteredAndSortedPurchases.length} Results</span>
    </div>
    
    {/* Mobile badge - icon only */}
    <div className="sm:hidden inline-flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full text-blue-800 text-xs font-medium flex-shrink-0">
      <Star className="w-3 h-3" />
      <span className="hidden xs:inline">{filteredAndSortedPurchases.length}</span>
    </div>
  </div>
</div>
          
          {filteredAndSortedPurchases.length === 0 ? (
  <div className="px-4 py-8 sm:px-8 sm:py-12 text-center">
    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full mx-auto mb-4 sm:mb-6 flex items-center justify-center">
      <ShoppingCart className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
    </div>
    <h3 className="text-lg sm:text-xl font-bold text-gray-700 mb-2">No orders found</h3>
    <p className="text-sm sm:text-base text-gray-500">Try adjusting your search criteria</p>
  </div>
) : (
  <>
    {/* Mobile Card View */}
    <div className="block lg:hidden">
      <div className="divide-y divide-gray-200/50">
        {filteredAndSortedPurchases.map((purchase, index) => (
          <div key={purchase._id} className="p-3 sm:p-4 hover:bg-blue-50/50 transition-colors duration-300">
            {/* Header with Order ID and Amount */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-xs sm:text-sm">
                  {index + 1}
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-bold text-gray-900">
                    #{purchase._id.slice(-8)}
                  </div>
                  <div className="text-xs text-gray-500">Order ID</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg sm:text-xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  ${purchase.amount.toFixed(2)}
                </div>
              </div>
            </div>
            
            {/* Customer Info */}
            <div className="flex items-center gap-2 mb-3 p-2 bg-gray-50/50 rounded-lg">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold text-gray-900 truncate">{purchase.name}</div>
                <div className="text-xs text-gray-500 truncate">{purchase.email}</div>
              </div>
            </div>
            
            {/* Products */}
            <div className="mb-3">
              <div className="space-y-2">
                {purchase.products.slice(0, 2).map((product) => (
                  <div key={product._id} className="flex items-center space-x-3 p-2 bg-white/50 rounded-lg border border-gray-100">
                    {product.images.length > 0 && (
                      <div className="flex-shrink-0">
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          width={48}
                          height={48}
                          className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg object-cover shadow-sm"
                        />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <div
                        className="text-xs sm:text-sm font-medium text-blue-600 hover:text-blue-800 line-clamp-2 transition-colors duration-300 block"
                      >
                        {product.name}
                      </div>
                      <div className="text-xs sm:text-sm font-semibold text-green-600 mt-1">
                        ${product.price}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {purchase.products.length > 2 && (
                <div className="text-xs sm:text-sm text-gray-500 font-medium mt-2 text-center p-2 bg-gray-50/50 rounded-lg">
                  +{purchase.products.length - 2} more items
                </div>
              )}
            </div>
            
            {/* Date and Location */}
            <div className="flex items-center justify-between text-xs sm:text-sm text-gray-500 pt-3 border-t border-gray-200/50">
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="truncate">
                  {new Date(purchase.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="truncate max-w-20 sm:max-w-32">{purchase.location}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Desktop Table View */}
    <div className="hidden lg:block overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr className="bg-gradient-to-r from-gray-50 to-blue-50">
            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
              Order Details
            </th>
            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
              Customer Info
            </th>
            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
              Products
            </th>
            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
              Order Value
            </th>
            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
              Date & Location
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200/50">
          {filteredAndSortedPurchases.map((purchase, index) => (
            <tr key={purchase._id} className="hover:bg-blue-50/50 transition-colors duration-300 group">
              <td className="px-6 py-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
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
              
              <td className="px-6 py-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">{purchase.name}</div>
                    <div className="text-sm text-gray-500">{purchase.email}</div>
                  </div>
                </div>
              </td>
              
              <td className="px-6 py-6">
                <div className="flex flex-col space-y-4 max-w-sm">
                  {purchase.products.slice(0, 2).map((product) => (
                    <div key={product._id} className="flex items-center space-x-4 group-hover:scale-[1.01] transition-transform duration-300">
                      {product.images.length > 0 && (
                        <div className="flex-shrink-0">
                          <Image
                            src={product.images[0]}
                            alt={product.name}
                            width={80}
                            height={80}
                            className="rounded-xl object-cover shadow-lg hover:shadow-xl transition-shadow duration-300"
                          />
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <Link 
                          href={`/products/${product.slug}`}
                          className="text-sm font-semibold text-blue-600 hover:text-blue-800 line-clamp-2 transition-colors duration-300"
                        >
                          {product.name}
                        </Link>
                        <div className="text-sm font-bold text-green-600 mt-1">${product.price}</div>
                      </div>
                    </div>
                  ))}
                  {purchase.products.length > 2 && (
                    <div className="text-sm text-gray-500 font-medium text-center py-2">
                      +{purchase.products.length - 2} more items
                    </div>
                  )}
                </div>
              </td>
              
              <td className="px-6 py-6">
                <div className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  ${purchase.amount.toFixed(2)}
                </div>
              </td>
              
              <td className="px-6 py-6">
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
  </>
)}
        </div>
      </div>
    </div>
  );
}
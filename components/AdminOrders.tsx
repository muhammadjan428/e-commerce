"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { PurchaseWithProducts } from "@/lib/actions/purchase.actions";

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

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Order Management</h1>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">Total Orders</h3>
            <p className="text-2xl font-bold text-gray-900">{stats.overview.totalPurchases}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
            <p className="text-2xl font-bold text-green-600">${stats.overview.totalRevenue.toFixed(2)}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">Products Sold</h3>
            <p className="text-2xl font-bold text-blue-600">{stats.overview.totalProducts}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">Average Order</h3>
            <p className="text-2xl font-bold text-purple-600">
              ${stats.overview.totalPurchases > 0 ? (stats.overview.totalRevenue / stats.overview.totalPurchases).toFixed(2) : '0.00'}
            </p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <input
                type="text"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "date" | "amount" | "name")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="date">Date</option>
                <option value="amount">Amount</option>
                <option value="name">Customer Name</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Order</label>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Amount</label>
              <select
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value as "all" | "high" | "low")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">
            Orders ({filteredAndSortedPurchases.length})
          </h2>
        </div>
        
        {filteredAndSortedPurchases.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="text-gray-500">No orders found matching your criteria</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Products
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAndSortedPurchases.map((purchase) => (
                  <tr key={purchase._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{purchase._id.slice(-8)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{purchase.name}</div>
                        <div className="text-sm text-gray-500">{purchase.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col space-y-2 max-w-xs">
                        {purchase.products.slice(0, 2).map((product) => (
                          <div key={product._id} className="flex items-center space-x-3">
                            {product.images.length > 0 && (
                              <div className="flex-shrink-0">
                                <Image
                                  src={product.images[0]}
                                  alt={product.name}
                                  width={40}
                                  height={40}
                                  className="rounded-md object-cover"
                                />
                              </div>
                            )}
                            <div className="min-w-0 flex-1">
                              <Link 
                                href={`/products/${product.slug}`}
                                className="text-sm font-medium text-blue-600 hover:text-blue-800 truncate block"
                              >
                                {product.name}
                              </Link>
                              <div className="text-sm text-gray-500">${product.price}</div>
                            </div>
                          </div>
                        ))}
                        {purchase.products.length > 2 && (
                          <div className="text-sm text-gray-500">
                            +{purchase.products.length - 2} more items
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                      ${purchase.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {purchase.location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>{new Date(purchase.createdAt).toLocaleDateString()}</div>
                      <div className="text-xs text-gray-400">
                        {new Date(purchase.createdAt).toLocaleTimeString()}
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
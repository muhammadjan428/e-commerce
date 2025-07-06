'use client';

import { useState } from 'react';
import { CustomerData } from '@/lib/actions/customer.actions';
import Image from 'next/image';
import { formatDistance } from 'date-fns';
import { Search, Filter, Users, TrendingUp, DollarSign, Star, Calendar, Mail, User, Crown, ChevronDown, Eye } from 'lucide-react';

interface Props {
  customers: CustomerData[];
}

export default function CustomersTable({ customers }: Props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'totalSpent' | 'totalOrders' | 'lastOrder'>('totalSpent');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Filter customers based on search term
  const filteredCustomers = customers.filter(customer =>
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort customers
  const sortedCustomers = [...filteredCustomers].sort((a, b) => {
    switch (sortBy) {
      case 'totalSpent':
        return b.totalSpent - a.totalSpent;
      case 'totalOrders':
        return b.totalOrders - a.totalOrders;
      case 'lastOrder':
        if (!a.lastOrderDate && !b.lastOrderDate) return 0;
        if (!a.lastOrderDate) return 1;
        if (!b.lastOrderDate) return -1;
        return new Date(b.lastOrderDate).getTime() - new Date(a.lastOrderDate).getTime();
      default:
        return 0;
    }
  });

  const formatDate = (date: Date | null) => {
    if (!date) return 'Never';
    return formatDistance(new Date(date), new Date(), { addSuffix: true });
  };

  return (
    <div className="p-2 lg:p-8">
      {/* Search and Sort Controls */}
      <div className="mb-6 sm:mb-8 space-y-4 sm:space-y-0 sm:flex sm:gap-4 lg:gap-6 sm:justify-between">
        <div className="flex-1 max-w-2xl">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
              <Search className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 bg-white/80 backdrop-blur-sm border border-white/20 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 text-gray-900 placeholder-gray-500 shadow-lg hover:shadow-xl text-sm sm:text-base"
            />
          </div>
        </div>
        
        <div className="flex gap-2 sm:gap-4">
          {/* Mobile Filter Button */}
          <div className="relative sm:hidden">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center gap-2 px-4 py-3 bg-white/80 backdrop-blur-sm border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 text-gray-900 shadow-lg hover:shadow-xl text-sm"
            >
              <Filter className="h-4 w-4 text-gray-400" />
              <span>Sort</span>
              <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${isFilterOpen ? 'rotate-180' : ''}`} />
            </button>
            {isFilterOpen && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-white/95 backdrop-blur-sm border border-white/20 rounded-xl shadow-xl z-10">
                <div className="p-2">
                  <button
                    onClick={() => { setSortBy('totalSpent'); setIsFilterOpen(false); }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${sortBy === 'totalSpent' ? 'bg-blue-100 text-blue-900' : 'text-gray-700 hover:bg-gray-100'}`}
                  >
                    Sort by Total Spent
                  </button>
                  <button
                    onClick={() => { setSortBy('totalOrders'); setIsFilterOpen(false); }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${sortBy === 'totalOrders' ? 'bg-blue-100 text-blue-900' : 'text-gray-700 hover:bg-gray-100'}`}
                  >
                    Sort by Total Orders
                  </button>
                  <button
                    onClick={() => { setSortBy('lastOrder'); setIsFilterOpen(false); }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${sortBy === 'lastOrder' ? 'bg-blue-100 text-blue-900' : 'text-gray-700 hover:bg-gray-100'}`}
                  >
                    Sort by Last Order
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Desktop Filter */}
          <div className="relative hidden sm:block">
            <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
              <Filter className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="pl-10 sm:pl-12 pr-6 sm:pr-8 py-3 sm:py-4 bg-white/80 backdrop-blur-sm border border-white/20 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 text-gray-900 shadow-lg hover:shadow-xl appearance-none cursor-pointer text-sm sm:text-base"
            >
              <option value="totalSpent">Sort by Total Spent</option>
              <option value="totalOrders">Sort by Total Orders</option>
              <option value="lastOrder">Sort by Last Order</option>
            </select>
          </div>
        </div>
      </div>

      {/* Customers Display */}
      {sortedCustomers.length === 0 ? (
        <div className="text-center py-16 sm:py-20 lg:py-24">
          <div className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full mx-auto mb-6 sm:mb-8 flex items-center justify-center">
            <Users className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 text-gray-400" />
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold text-gray-700 mb-3 sm:mb-4">No customers found</h3>
          <p className="text-gray-500 text-base sm:text-lg px-4">
            {searchTerm ? 'Try adjusting your search terms to find customers' : 'No customers have made purchases yet'}
          </p>
        </div>
      ) : (
        <>
          {/* Mobile Cards View */}
          <div className="block lg:hidden space-y-4">
            {sortedCustomers.map((customer) => (
              <div key={customer._id} className="bg-white/50 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-4 hover:shadow-xl transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="relative flex-shrink-0">
                    {customer.image ? (
                      <Image
                        src={customer.image}
                        alt={customer.username}
                        width={48}
                        height={48}
                        className="rounded-xl object-cover shadow-lg ring-2 ring-white/50"
                        unoptimized
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg ring-2 ring-white/50">
                        <span className="text-white font-bold text-sm">
                          {customer.first_name?.[0] || ''}{customer.last_name?.[0] || ''}
                        </span>
                      </div>
                    )}
                    {customer.totalSpent > 500 && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                        <Crown className="w-2.5 h-2.5 text-white" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-bold text-gray-900 text-base truncate">
                          {customer.first_name} {customer.last_name}
                        </h3>
                        <p className="text-xs text-gray-600 font-medium">@{customer.username}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="font-bold text-lg bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                          ${customer.totalSpent.toFixed(2)}
                        </span>
                        {customer.totalSpent > 500 && (
                          <div className="px-2 py-0.5 bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 rounded-full text-xs font-bold">
                            VIP
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-xs text-gray-600 mb-2 truncate">
                      {customer.email}
                    </div>
                    
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-3 h-3 text-blue-500" />
                        <span className="font-medium">{customer.totalOrders} orders</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-500">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(customer.lastOrderDate)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table View */}
          <div className="hidden lg:block bg-white/50 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl border border-white/20 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-gray-50/80 to-blue-50/80 backdrop-blur-sm border-b border-gray-200/50">
                    <th className="text-left py-4 sm:py-6 px-4 sm:px-6 lg:px-8 font-bold text-gray-800 uppercase tracking-wider text-xs sm:text-sm">
                      <div className="flex items-center gap-2">
                        <User className="w-3 h-3 sm:w-4 sm:h-4" />
                        Customer
                      </div>
                    </th>
                    <th className="text-left py-4 sm:py-6 px-4 sm:px-6 lg:px-8 font-bold text-gray-800 uppercase tracking-wider text-xs sm:text-sm">
                      <div className="flex items-center gap-2">
                        <Mail className="w-3 h-3 sm:w-4 sm:h-4" />
                        Email
                      </div>
                    </th>
                    <th className="text-left py-4 sm:py-6 px-4 sm:px-6 lg:px-8 font-bold text-gray-800 uppercase tracking-wider text-xs sm:text-sm">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-3 h-3 sm:w-4 sm:h-4" />
                        Total Spent
                      </div>
                    </th>
                    <th className="text-left py-4 sm:py-6 px-4 sm:px-6 lg:px-8 font-bold text-gray-800 uppercase tracking-wider text-xs sm:text-sm">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
                        Orders
                      </div>
                    </th>
                    <th className="text-left py-4 sm:py-6 px-4 sm:px-6 lg:px-8 font-bold text-gray-800 uppercase tracking-wider text-xs sm:text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                        Last Order
                      </div>
                    </th>
                    <th className="text-left py-4 sm:py-6 px-4 sm:px-6 lg:px-8 font-bold text-gray-800 uppercase tracking-wider text-xs sm:text-sm">
                      <div className="flex items-center gap-2">
                        <Star className="w-3 h-3 sm:w-4 sm:h-4" />
                        Joined
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200/50">
                  {sortedCustomers.map((customer) => (
                    <tr key={customer._id} className="group hover:bg-gradient-to-r hover:from-blue-50/30 hover:to-purple-50/30 transition-all duration-300">
                      <td className="py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center gap-3 sm:gap-4">
                          <div className="relative">
                            {customer.image ? (
                              <Image
                                src={customer.image}
                                alt={customer.username}
                                width={48}
                                height={48}
                                className="rounded-xl sm:rounded-2xl object-cover shadow-lg ring-2 ring-white/50 group-hover:ring-blue-500/50 transition-all duration-300"
                                unoptimized
                              />
                            ) : (
                              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg ring-2 ring-white/50 group-hover:ring-blue-500/50 transition-all duration-300">
                                <span className="text-white font-bold text-sm sm:text-lg">
                                  {customer.first_name?.[0] || ''}{customer.last_name?.[0] || ''}
                                </span>
                              </div>
                            )}
                            {customer.totalSpent > 500 && (
                              <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                                <Crown className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 text-sm sm:text-base lg:text-lg group-hover:text-blue-900 transition-colors duration-300">
                              {customer.first_name} {customer.last_name}
                            </p>
                            <p className="text-xs sm:text-sm text-gray-600 font-medium">@{customer.username}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
                        <span className="text-gray-900 font-medium hover:text-blue-900 transition-colors duration-300 text-sm sm:text-base">
                          {customer.email}
                        </span>
                      </td>
                      <td className="py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-lg sm:text-xl lg:text-2xl bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                            ${customer.totalSpent.toFixed(2)}
                          </span>
                          {customer.totalSpent > 500 && (
                            <div className="px-2 py-1 bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 rounded-full text-xs font-bold">
                              VIP
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
                        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-bold text-xs sm:text-sm shadow-lg">
                          <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
                          {customer.totalOrders}
                        </div>
                      </td>
                      <td className="py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
                        <div className="text-gray-700 font-medium text-sm sm:text-base">
                          {formatDate(customer.lastOrderDate)}
                        </div>
                      </td>
                      <td className="py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
                        <div className="text-gray-700 font-medium text-sm sm:text-base">
                          {formatDate(customer.createdAt)}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
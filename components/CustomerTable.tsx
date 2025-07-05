'use client';

import { useState } from 'react';
import { CustomerData } from '@/lib/actions/customer.actions';
import Image from 'next/image';
import { formatDistance } from 'date-fns';
import { Search, Filter, Users, TrendingUp, DollarSign, Star, Calendar, Mail, User, Crown } from 'lucide-react';

interface Props {
  customers: CustomerData[];
}

export default function CustomersTable({ customers }: Props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'totalSpent' | 'totalOrders' | 'lastOrder'>('totalSpent');

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
    <div className="p-8">
      {/* Search and Sort Controls */}
      <div className="mb-8 flex flex-col lg:flex-row gap-6 justify-between">
        <div className="flex-1 max-w-2xl">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search customers by name, email, or username..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 text-gray-900 placeholder-gray-500 shadow-lg hover:shadow-xl"
            />
          </div>
        </div>
        
        <div className="flex gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Filter className="h-5 w-5 text-gray-400" />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="pl-12 pr-8 py-4 bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 text-gray-900 shadow-lg hover:shadow-xl appearance-none cursor-pointer"
            >
              <option value="totalSpent">Sort by Total Spent</option>
              <option value="totalOrders">Sort by Total Orders</option>
              <option value="lastOrder">Sort by Last Order</option>
            </select>
          </div>
        </div>
      </div>

      {/* Customers Table */}
      {sortedCustomers.length === 0 ? (
        <div className="text-center py-24">
          <div className="w-32 h-32 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full mx-auto mb-8 flex items-center justify-center">
            <Users className="w-16 h-16 text-gray-400" />
          </div>
          <h3 className="text-3xl font-bold text-gray-700 mb-4">No customers found</h3>
          <p className="text-gray-500 text-lg">
            {searchTerm ? 'Try adjusting your search terms to find customers' : 'No customers have made purchases yet'}
          </p>
        </div>
      ) : (
        <div className="bg-white/50 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-gray-50/80 to-blue-50/80 backdrop-blur-sm border-b border-gray-200/50">
                  <th className="text-left py-6 px-8 font-bold text-gray-800 uppercase tracking-wider text-sm">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Customer
                    </div>
                  </th>
                  <th className="text-left py-6 px-8 font-bold text-gray-800 uppercase tracking-wider text-sm">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email
                    </div>
                  </th>
                  <th className="text-left py-6 px-8 font-bold text-gray-800 uppercase tracking-wider text-sm">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      Total Spent
                    </div>
                  </th>
                  <th className="text-left py-6 px-8 font-bold text-gray-800 uppercase tracking-wider text-sm">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      Orders
                    </div>
                  </th>
                  <th className="text-left py-6 px-8 font-bold text-gray-800 uppercase tracking-wider text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Last Order
                    </div>
                  </th>
                  <th className="text-left py-6 px-8 font-bold text-gray-800 uppercase tracking-wider text-sm">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4" />
                      Joined
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200/50">
                {sortedCustomers.map((customer, index) => (
                  <tr key={customer._id} className="group hover:bg-gradient-to-r hover:from-blue-50/30 hover:to-purple-50/30 transition-all duration-300">
                    <td className="py-6 px-8">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          {customer.image ? (
                            <Image
                              src={customer.image}
                              alt={customer.username}
                              width={56}
                              height={56}
                              className="rounded-2xl object-cover shadow-lg ring-2 ring-white/50 group-hover:ring-blue-500/50 transition-all duration-300"
                              unoptimized
                            />
                          ) : (
                            <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg ring-2 ring-white/50 group-hover:ring-blue-500/50 transition-all duration-300">
                              <span className="text-white font-bold text-lg">
                                {customer.first_name?.[0] || ''}{customer.last_name?.[0] || ''}
                              </span>
                            </div>
                          )}
                          {customer.totalSpent > 500 && (
                            <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                              <Crown className="w-3 h-3 text-white" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 text-lg group-hover:text-blue-900 transition-colors duration-300">
                            {customer.first_name} {customer.last_name}
                          </p>
                          <p className="text-sm text-gray-600 font-medium">@{customer.username}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-6 px-8">
                      <span className="text-gray-900 font-medium hover:text-blue-900 transition-colors duration-300">
                        {customer.email}
                      </span>
                    </td>
                    <td className="py-6 px-8">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-2xl bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                          ${customer.totalSpent.toFixed(2)}
                        </span>
                        {customer.totalSpent > 500 && (
                          <div className="px-2 py-1 bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 rounded-full text-xs font-bold">
                            VIP
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-6 px-8">
                      <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 px-4 py-2 rounded-full font-bold text-sm shadow-lg">
                        <TrendingUp className="w-4 h-4" />
                        {customer.totalOrders}
                      </div>
                    </td>
                    <td className="py-6 px-8">
                      <div className="text-gray-700 font-medium">
                        {formatDate(customer.lastOrderDate)}
                      </div>
                    </td>
                    <td className="py-6 px-8">
                      <div className="text-gray-700 font-medium">
                        {formatDate(customer.createdAt)}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
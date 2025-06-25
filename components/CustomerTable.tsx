'use client';

import { useState } from 'react';
import { CustomerData } from '@/lib/actions/customer.actions';
import Image from 'next/image';
import { formatDistance } from 'date-fns';

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
    <div className="p-6">
      {/* Search and Sort Controls */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div className="flex gap-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="totalSpent">Sort by Total Spent</option>
            <option value="totalOrders">Sort by Total Orders</option>
            <option value="lastOrder">Sort by Last Order</option>
          </select>
        </div>
      </div>

      {/* Customers Table */}
      {sortedCustomers.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-2">No customers found</p>
          <p className="text-gray-400">
            {searchTerm ? 'Try adjusting your search terms' : 'No customers have made purchases yet'}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Customer</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Total Spent</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Orders</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Last Order</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Joined</th>
              </tr>
            </thead>
            <tbody>
              {sortedCustomers.map((customer) => (
                <tr key={customer._id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      {customer.image ? (
                        <Image
                          src={customer.image}
                          alt={customer.username}
                          width={40}
                          height={40}
                          className="rounded-full object-cover"
                          unoptimized
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                          <span className="text-gray-600 font-medium">
                            {customer.first_name?.[0] || ''}{customer.last_name?.[0] || ''}
                          </span>
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-gray-900">
                          {customer.first_name} {customer.last_name}
                        </p>
                        <p className="text-sm text-gray-500">@{customer.username}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-gray-900">{customer.email}</td>
                  <td className="py-4 px-4">
                    <span className="font-semibold text-green-600">
                      ${customer.totalSpent.toFixed(2)}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium">
                      {customer.totalOrders}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-gray-600">
                    {formatDate(customer.lastOrderDate)}
                  </td>
                  <td className="py-4 px-4 text-gray-600">
                    {formatDate(customer.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Summary Stats */}
      {sortedCustomers.length > 0 && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-blue-800 mb-1">Total Customers</h3>
            <p className="text-2xl font-bold text-blue-900">{sortedCustomers.length}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-green-800 mb-1">Total Revenue</h3>
            <p className="text-2xl font-bold text-green-900">
              ${sortedCustomers.reduce((sum, c) => sum + c.totalSpent, 0).toFixed(2)}
            </p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-purple-800 mb-1">Total Orders</h3>
            <p className="text-2xl font-bold text-purple-900">
              {sortedCustomers.reduce((sum, c) => sum + c.totalOrders, 0)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
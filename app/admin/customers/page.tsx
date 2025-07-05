import { getAllCustomers } from '@/lib/actions/customer.actions';
import { checkIsAdmin } from '@/lib/actions/users.actions';
import { redirect } from 'next/navigation';
import CustomersTable from '@/components/CustomerTable';
import AnimatedBackground from '@/components/AnimatedBackground';
import { Users, TrendingUp, DollarSign, Star, Sparkles } from 'lucide-react';

export default async function AdminCustomersPage() {
  // Check if user is admin
  const isAdmin = await checkIsAdmin();
     
  if (!isAdmin) {
    redirect('/');
  }

  // Get all customers
  const customers = await getAllCustomers();
  
  // Calculate metrics
  const totalRevenue = customers.reduce((sum, customer) => sum + customer.totalSpent, 0);
  const totalOrders = customers.reduce((sum, customer) => sum + customer.totalOrders, 0);
  const avgOrderValue = customers.length > 0 ? totalRevenue / totalOrders : 0;
  const topCustomers = customers.filter(c => c.totalSpent > 100).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <AnimatedBackground />
      
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto p-6">
          {/* Header Section */}
          <div className="mb-12 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full text-blue-800 text-sm font-medium mb-4">
              <Users className="w-4 h-4" />
              <span>Customer Management</span>
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent mb-4">
              Customer Analytics
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Monitor customer behavior, track spending patterns, and identify your most valuable customers
            </p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div className="group bg-white/70 backdrop-blur-sm rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 border border-white/20 transform hover:scale-[1.02] hover:-translate-y-2">
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-600 uppercase tracking-wide mb-1">
                      Total Customers
                    </div>
                    <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      {customers.length.toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className="w-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full h-2">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full" style={{ width: '100%' }}></div>
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
                      ${totalRevenue.toLocaleString()}
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
                    <TrendingUp className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-600 uppercase tracking-wide mb-1">
                      Average Order
                    </div>
                    <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      ${avgOrderValue.toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className="w-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full h-2">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full" style={{ width: '70%' }}></div>
                </div>
              </div>
            </div>

            <div className="group bg-white/70 backdrop-blur-sm rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 border border-white/20 transform hover:scale-[1.02] hover:-translate-y-2">
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Star className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-600 uppercase tracking-wide mb-1">
                      VIP Customers
                    </div>
                    <div className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                      {topCustomers.toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className="w-full bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-full h-2">
                  <div className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Customers Table Section */}
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20">
            <div className="p-8 border-b border-gray-200/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Customer Database
                    </h2>
                    <p className="text-gray-600">
                      Complete customer information and purchase history
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-100 to-blue-100 rounded-full text-green-800 text-sm font-medium">
                    <Sparkles className="w-4 h-4" />
                    <span>{customers.length} Active Customers</span>
                  </div>
                </div>
              </div>
            </div>
            
            <CustomersTable customers={customers} />
          </div>
        </div>
      </div>
    </div>
  );
}
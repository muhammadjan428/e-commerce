"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { getAllCustomers, getDailyRevenue } from "@/lib/actions/customer.actions";
import { TrendingUp, Users, ShoppingCart, DollarSign, Activity, Sparkles } from "lucide-react";
import AnimatedBackground from "@/components/AnimatedBackground";
import Loading from "@/components/shared/Loading";

type ChartDataPoint = {
  date: string;
  revenue: number;
  orders: number;
};

export default function AdminDashboardPage() {
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [metric, setMetric] = useState<"revenue" | "orders">("revenue");
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [avgOrderValue, setAvgOrderValue] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        // Get customer summary data
        const [customers, dailyData] = await Promise.all([
          getAllCustomers(),
          getDailyRevenue()
        ]);

        // Calculate total metrics
        const totalRev = customers.reduce((sum, c) => sum + c.totalSpent, 0);
        const totalOrd = customers.reduce((sum, c) => sum + c.totalOrders, 0);
        
        setTotalCustomers(customers.length);
        setTotalRevenue(totalRev);
        setTotalOrders(totalOrd);
        setAvgOrderValue(totalOrd > 0 ? totalRev / totalOrd : 0);

        // Set chart data
        setChartData(dailyData);
      } catch (error) {
        console.error('Error loading dashboard:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadDashboard();
  }, []);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 backdrop-blur-sm p-3 sm:p-4 border border-white/20 rounded-xl sm:rounded-2xl shadow-xl text-xs sm:text-sm">
          <p className="text-gray-600 mb-1 sm:mb-2 font-medium">{formatDate(label)}</p>
          <p className="font-bold text-gray-800">
            {metric === "revenue"
              ? `Revenue: $${payload[0].value.toLocaleString()}`
              : `Orders: ${payload[0].value.toLocaleString()}`}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <AnimatedBackground />
      
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto p-4 sm:p-6">
          {/* Header Section */}
          <div className="mb-8 sm:mb-12 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-2 sm:px-4 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full text-blue-800 text-xs sm:text-sm font-medium mb-3 sm:mb-4">
              <Activity className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>Business Analytics</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent mb-3 sm:mb-4 px-4">
              Admin Dashboard
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed px-4">
              Monitor your business performance, track growth metrics, and gain insights into customer behavior
            </p>
          </div>

          {/* Show loading component only for specific sections while data is loading */}
          {isLoading ? (
            <Loading message="Loading dashboard data..." />
          ) : (
            <>
              {/* Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12">
                <div className="group bg-white/70 backdrop-blur-sm rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 border border-white/20 transform hover:scale-[1.02] hover:-translate-y-1 sm:hover:-translate-y-2">
                  <div className="p-6 sm:p-8">
                    <div className="flex items-center justify-between mb-4 sm:mb-6">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl sm:rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Users className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                      </div>
                      <div className="text-right">
                        <div className="text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wide mb-1">
                          Total Customers
                        </div>
                        <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                          {totalCustomers.toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div className="w-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full h-2">
                      <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full" style={{ width: '100%' }}></div>
                    </div>
                  </div>
                </div>

                <div className="group bg-white/70 backdrop-blur-sm rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 border border-white/20 transform hover:scale-[1.02] hover:-translate-y-1 sm:hover:-translate-y-2">
                  <div className="p-6 sm:p-8">
                    <div className="flex items-center justify-between mb-4 sm:mb-6">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-xl sm:rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <DollarSign className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                      </div>
                      <div className="text-right">
                        <div className="text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wide mb-1">
                          Total Revenue
                        </div>
                        <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                          ${totalRevenue.toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div className="w-full bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-full h-2">
                      <div className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                  </div>
                </div>

                <div className="group bg-white/70 backdrop-blur-sm rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 border border-white/20 transform hover:scale-[1.02] hover:-translate-y-1 sm:hover:-translate-y-2">
                  <div className="p-6 sm:p-8">
                    <div className="flex items-center justify-between mb-4 sm:mb-6">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl sm:rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <ShoppingCart className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                      </div>
                      <div className="text-right">
                        <div className="text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wide mb-1">
                          Total Orders
                        </div>
                        <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                          {totalOrders.toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div className="w-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full h-2">
                      <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                    </div>
                  </div>
                </div>

                <div className="group bg-white/70 backdrop-blur-sm rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 border border-white/20 transform hover:scale-[1.02] hover:-translate-y-1 sm:hover:-translate-y-2">
                  <div className="p-6 sm:p-8">
                    <div className="flex items-center justify-between mb-4 sm:mb-6">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl sm:rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                      </div>
                      <div className="text-right">
                        <div className="text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wide mb-1">
                          Average Order
                        </div>
                        <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                          ${avgOrderValue.toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div className="w-full bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-full h-2">
                      <div className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full" style={{ width: '65%' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Chart Section */}
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl border border-white/20 overflow-hidden">
                <div className="p-4 sm:p-6 lg:p-8 border-b border-gray-200/50">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 lg:gap-0">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl sm:rounded-2xl flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                          Daily Performance Analytics
                        </h2>
                        <p className="text-sm sm:text-base text-gray-600 hidden sm:block">
                          Track your revenue and order trends over time
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-r from-green-100 to-blue-100 rounded-full text-green-800 text-xs sm:text-sm font-medium">
                        <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>Live Data</span>
                      </div>
                      {/* Metric Toggle Buttons */}
                      <div className="flex items-center bg-gray-100/80 backdrop-blur-sm p-1 rounded-xl sm:rounded-2xl border border-white/20">
                        <Button
                          variant={metric === "revenue" ? "default" : "ghost"}
                          onClick={() => setMetric("revenue")}
                          className={`px-3 sm:px-6 py-1.5 sm:py-2 text-xs sm:text-sm font-medium transition-all duration-300 rounded-lg sm:rounded-xl ${
                            metric === "revenue"
                              ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25"
                              : "text-gray-600 hover:text-gray-800 hover:bg-white/50"
                          }`}
                        >
                          Revenue
                        </Button>
                        <Button
                          variant={metric === "orders" ? "default" : "ghost"}
                          onClick={() => setMetric("orders")}
                          className={`px-3 sm:px-6 py-1.5 sm:py-2 text-xs sm:text-sm font-medium transition-all duration-300 rounded-lg sm:rounded-xl ${
                            metric === "orders"
                              ? "bg-gradient-to-r from-green-600 to-blue-600 text-white shadow-lg shadow-green-500/25"
                              : "text-gray-600 hover:text-gray-800 hover:bg-white/50"
                          }`}
                        >
                          Orders
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 sm:p-6 lg:p-8">
                  {chartData.length === 0 ? (
                    <div className="h-64 sm:h-80 lg:h-96 flex items-center justify-center">
                      <div className="text-center px-4">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full mx-auto mb-4 sm:mb-6 flex items-center justify-center">
                          <ShoppingCart className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-gray-400" />
                        </div>
                        <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-2">No payment data available</h3>
                        <p className="text-sm sm:text-base lg:text-lg text-gray-500 mb-2">Charts will appear once customers start making purchases</p>
                        <p className="text-xs sm:text-sm text-gray-400">Your analytics dashboard will come alive with customer activity</p>
                      </div>
                    </div>
                  ) : (
                    <div className="h-64 sm:h-80 lg:h-96">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={chartData}
                          margin={{ 
                            top: 20, 
                            right: 10, 
                            left: 10, 
                            bottom: 5 
                          }}
                        >
                          <defs>
                            <linearGradient
                              id="revenueGradient"
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1"
                            >
                              <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.8} />
                              <stop offset="100%" stopColor="#1d4ed8" stopOpacity={0.3} />
                            </linearGradient>
                            <linearGradient
                              id="ordersGradient"
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1"
                            >
                              <stop offset="0%" stopColor="#10b981" stopOpacity={0.8} />
                              <stop offset="100%" stopColor="#047857" stopOpacity={0.3} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.7} />
                          <XAxis
                            dataKey="date"
                            tickFormatter={formatDate}
                            stroke="#6b7280"
                            fontSize={10}
                            tickLine={false}
                            axisLine={false}
                            interval="preserveStartEnd"
                            angle={-45}
                            textAnchor="end"
                            height={60}
                          />
                          <YAxis
                            stroke="#6b7280"
                            fontSize={10}
                            tickLine={false}
                            axisLine={false}
                            width={60}
                            tickFormatter={(value) =>
                              metric === "revenue" ? `$${value > 1000 ? `${(value/1000).toFixed(0)}k` : value}` : value.toString()
                            }
                          />
                          <Tooltip content={<CustomTooltip />} cursor={false} />
                          <Bar
                            dataKey={metric}
                            fill={
                              metric === "revenue"
                                ? "url(#revenueGradient)"
                                : "url(#ordersGradient)"
                            }
                            radius={[4, 4, 0, 0]}
                            maxBarSize={40}
                            activeBar={false}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
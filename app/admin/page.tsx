"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
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
        setIsLoading(true);
        
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
        <div className="bg-white/90 backdrop-blur-sm p-4 border border-white/20 rounded-2xl shadow-xl">
          <p className="text-sm text-gray-600 mb-2 font-medium">{formatDate(label)}</p>
          <p className="text-sm font-bold text-gray-800">
            {metric === "revenue"
              ? `Revenue: $${payload[0].value.toLocaleString()}`
              : `Orders: ${payload[0].value.toLocaleString()}`}
          </p>
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <AnimatedBackground />
        <div className="relative z-10">
          <div className="max-w-7xl mx-auto p-6">
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 animate-pulse">
                  <Activity className="w-8 h-8 text-white" />
                </div>
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500/20 border-t-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600 text-lg font-medium">Loading dashboard...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <AnimatedBackground />
      
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto p-6">
          {/* Header Section */}
          <div className="mb-12 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full text-blue-800 text-sm font-medium mb-4">
              <Activity className="w-4 h-4" />
              <span>Business Analytics</span>
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent mb-4">
              Admin Dashboard
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Monitor your business performance, track growth metrics, and gain insights into customer behavior
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
                      {totalCustomers.toLocaleString()}
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
                    <ShoppingCart className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-600 uppercase tracking-wide mb-1">
                      Total Orders
                    </div>
                    <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      {totalOrders.toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className="w-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full h-2">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full" style={{ width: '75%' }}></div>
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
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20">
            <div className="p-8 border-b border-gray-200/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Daily Performance Analytics
                    </h2>
                    <p className="text-gray-600">
                      Track your revenue and order trends over time
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-100 to-blue-100 rounded-full text-green-800 text-sm font-medium">
                    <Sparkles className="w-4 h-4" />
                    <span>Live Data</span>
                  </div>
                  {/* Metric Toggle Buttons */}
                  <div className="flex items-center space-x-2 bg-gray-100/80 backdrop-blur-sm p-1 rounded-2xl border border-white/20">
                    <Button
                      variant={metric === "revenue" ? "default" : "ghost"}
                      onClick={() => setMetric("revenue")}
                      className={`px-6 py-2 text-sm font-medium transition-all duration-300 rounded-xl ${
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
                      className={`px-6 py-2 text-sm font-medium transition-all duration-300 rounded-xl ${
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

            <div className="p-8">
              {chartData.length === 0 ? (
                <div className="h-96 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-24 h-24 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full mx-auto mb-6 flex items-center justify-center">
                      <ShoppingCart className="w-12 h-12 text-gray-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">No payment data available</h3>
                    <p className="text-gray-500 text-lg mb-2">Charts will appear once customers start making purchases</p>
                    <p className="text-gray-400 text-sm">Your analytics dashboard will come alive with customer activity</p>
                  </div>
                </div>
              ) : (
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={chartData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
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
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        interval="preserveStartEnd"
                      />
                      <YAxis
                        stroke="#6b7280"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) =>
                          metric === "revenue" ? `$${value}` : value.toString()
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
                        radius={[8, 8, 0, 0]}
                        maxBarSize={60}
                        activeBar={false}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
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
import { TrendingUp, Users, ShoppingCart, DollarSign } from "lucide-react";

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
        setTotalCustomers(customers.length);
        setTotalRevenue(customers.reduce((sum, c) => sum + c.totalSpent, 0));
        setTotalOrders(customers.reduce((sum, c) => sum + c.totalOrders, 0));

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
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-sm text-gray-600 mb-2">{formatDate(label)}</p>
          <p className="text-sm font-semibold text-gray-800">
            {metric === "revenue"
              ? `Revenue: $${payload[0].value.toLocaleString()}`
              : `Orders: ${payload[0].value}`}
          </p>
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading dashboard...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">
            Monitor your business performance at a glance
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                    Total Customers
                  </h2>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {totalCustomers.toLocaleString()}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                    Total Orders
                  </h2>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {totalOrders.toLocaleString()}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <ShoppingCart className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                    Total Revenue
                  </h2>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    ${totalRevenue.toLocaleString()}
                  </p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <DollarSign className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chart Section */}
        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-gray-600" />
                <h2 className="text-xl font-semibold text-gray-800">
                  Daily Performance Analytics
                </h2>
              </div>

              {/* Metric Toggle Buttons */}
              <div className="flex items-center space-x-2 bg-gray-100 p-1 rounded-lg">
                <Button
                  variant={metric === "revenue" ? "default" : "ghost"}
                  onClick={() => setMetric("revenue")}
                  className={`px-4 py-2 text-sm font-medium transition-all duration-200 ${
                    metric === "revenue"
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-gray-600 hover:text-gray-800 hover:bg-white"
                  }`}
                >
                  Revenue
                </Button>
                <Button
                  variant={metric === "orders" ? "default" : "ghost"}
                  onClick={() => setMetric("orders")}
                  className={`px-4 py-2 text-sm font-medium transition-all duration-200 ${
                    metric === "orders"
                      ? "bg-green-600 text-white shadow-sm"
                      : "text-gray-600 hover:text-gray-800 hover:bg-white"
                  }`}
                >
                  Orders
                </Button>
              </div>
            </div>

            {chartData.length === 0 ? (
              <div className="h-96 flex items-center justify-center">
                <div className="text-center">
                  <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg mb-2">No payment data available</p>
                  <p className="text-gray-400 text-sm">Charts will appear once customers start making purchases</p>
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
                        <stop
                          offset="100%"
                          stopColor="#1d4ed8"
                          stopOpacity={0.3}
                        />
                      </linearGradient>
                      <linearGradient
                        id="ordersGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop offset="0%" stopColor="#10b981" stopOpacity={0.8} />
                        <stop
                          offset="100%"
                          stopColor="#047857"
                          stopOpacity={0.3}
                        />
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
                      radius={[4, 4, 0, 0]}
                      maxBarSize={60}
                      activeBar={false}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
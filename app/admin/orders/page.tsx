import { getAllPurchases, getAdminPurchaseStats } from "@/lib/actions/purchase.actions";
import AdminOrdersClient from "@/components/AdminOrders";
import AnimatedBackground from "@/components/AnimatedBackground";
import { Sparkles } from "lucide-react";

export default async function AdminOrdersPage() {
  try {
    const [purchases, stats] = await Promise.all([
      getAllPurchases(),
      getAdminPurchaseStats()
    ]);

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <AnimatedBackground />
        
        <div className="relative z-10">
          <div className="max-w-7xl mx-auto p-6">
            <AdminOrdersClient 
              initialPurchases={purchases}
              stats={stats}
            />
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error loading admin orders:", error);
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <AnimatedBackground />
        
        <div className="relative z-10">
          <div className="max-w-7xl mx-auto p-6">
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <p className="text-xl font-semibold text-gray-700 mb-2">Failed to load orders</p>
                <p className="text-gray-500">Please try refreshing the page</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
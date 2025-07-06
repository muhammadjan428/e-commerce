import { Suspense } from 'react';
import { getAllPurchases, getAdminPurchaseStats } from "@/lib/actions/purchase.actions";
import AdminOrdersClient from "@/components/AdminOrders";
import AnimatedBackground from "@/components/AnimatedBackground";
import { Sparkles } from "lucide-react";
import Loading from '@/components/shared/Loading';

// Separate component for the data fetching
async function OrdersContent() {
  try {
    const [purchases, stats] = await Promise.all([
      getAllPurchases(),
      getAdminPurchaseStats()
    ]);

    return <AdminOrdersClient initialPurchases={purchases} stats={stats} />;
  } catch (error) {
    console.error("Error loading admin orders:", error);
    return (
      <div className="flex items-center justify-center h-64 sm:h-80 md:h-96">
        <div className="text-center">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-full mx-auto mb-4 flex items-center justify-center">
            <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
          </div>
          <p className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">Failed to load orders</p>
          <p className="text-sm sm:text-base text-gray-500">Please try refreshing the page</p>
        </div>
      </div>
    );
  }
}

export default function AdminOrdersPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <AnimatedBackground />
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto lg:px-8 py-4 sm:py-6">
          {/* Orders Content with Suspense */}
          <Suspense fallback={<Loading message="Loading orders..." />}>
            <OrdersContent />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
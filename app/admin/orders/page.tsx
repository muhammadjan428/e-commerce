import { getAllPurchases, getAdminPurchaseStats } from "@/lib/actions/purchase.actions";
import AdminOrdersClient from "@/components/AdminOrders";

export default async function AdminOrdersPage() {
  try {
    const [purchases, stats] = await Promise.all([
      getAllPurchases(),
      getAdminPurchaseStats()
    ]);

    return (
      <div className="container mx-auto px-4 py-8">
        <AdminOrdersClient 
          initialPurchases={purchases} 
          stats={stats}
        />
      </div>
    );
  } catch (error) {
    console.error("Error loading admin orders:", error);
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">Failed to load orders. Please try again.</p>
        </div>
      </div>
    );
  }
}
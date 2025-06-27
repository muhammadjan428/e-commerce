import { getUserPurchases, getUserPurchaseStats } from "@/lib/actions/purchase.actions";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default async function PurchasePage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const [purchases, stats] = await Promise.all([
    getUserPurchases(userId),
    getUserPurchaseStats(userId)
  ]);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Purchase History</h1>
        <p className="text-gray-600">View all your past purchases and order details</p>
      </div>

      {/* Purchase Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Orders</h3>
          <p className="text-3xl font-bold text-blue-600">{stats.totalPurchases}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Spent</h3>
          <p className="text-3xl font-bold text-green-600">${stats.totalSpent.toFixed(2)}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Items Purchased</h3>
          <p className="text-3xl font-bold text-purple-600">{stats.totalProducts}</p>
        </div>
      </div>

      {/* Purchase List */}
      {purchases.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="mb-4">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No purchases yet</h3>
          <p className="text-gray-500 mb-4">When you make your first purchase, it will appear here.</p>
          <Link href="/products" className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {purchases.map((purchase) => (
            <div key={purchase._id} className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* Purchase Header */}
              <div className="bg-gray-50 px-6 py-4 border-b">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Order #{purchase._id.slice(-8).toUpperCase()}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Purchased on {formatDate(purchase.createdAt)}
                    </p>
                  </div>
                  <div className="mt-2 sm:mt-0 text-right">
                    <p className="text-2xl font-bold text-green-600">
                      ${purchase.amount.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-600">
                      {purchase.products.length} item{purchase.products.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
              </div>

              {/* Customer Details */}
              <div className="px-6 py-3 bg-blue-50 border-b">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Customer: </span>
                    <span className="text-gray-600">{purchase.name}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Email: </span>
                    <span className="text-gray-600">{purchase.email}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Location: </span>
                    <span className="text-gray-600">{purchase.location}</span>
                  </div>
                </div>
              </div>

              {/* Products */}
              <div className="p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Items Purchased:</h4>
                <div className="grid gap-4">
                  {purchase.products.map((product) => (
                    <div key={product._id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                      <div className="flex-shrink-0">
                        {product.images && product.images.length > 0 ? (
                          <Image
                            src={product.images[0]}
                            alt={product.name}
                            width={80}
                            height={80}
                            className="rounded-md object-cover"
                          />
                        ) : (
                          <div className="w-20 h-20 bg-gray-200 rounded-md flex items-center justify-center">
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="flex-grow">
                        <h5 className="font-medium text-gray-900">{product.name}</h5>
                        <p className="text-sm text-gray-600">
                          Product ID: {product._id.slice(-8).toUpperCase()}
                        </p>
                        <p className="text-lg font-semibold text-green-600 mt-1">
                          ${product.price.toFixed(2)}
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        <Link
                          href={`/products/${product.slug}`}
                          className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors"
                        >
                          View Product
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
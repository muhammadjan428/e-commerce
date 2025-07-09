import { getUserPurchases, getUserPurchaseStats } from "@/lib/actions/purchase.actions";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, TrendingUp, Package, Sparkles, Calendar, MapPin, Mail, User, ArrowLeft, Star, Store } from "lucide-react";
import AnimatedBackground from "@/components/AnimatedBackground";
import Loading from "@/components/shared/Loading";
import { Suspense } from "react";

// Separate component for the main content
async function PurchaseContent() {
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
    <>
      {/* Header Section */}
      <div className="mb-8 sm:mb-12 text-center px-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full text-blue-800 text-xs sm:text-sm font-medium mb-3 sm:mb-4">
          <ShoppingBag className="w-3 h-3 sm:w-4 sm:h-4" />
          <span>Purchase History</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent mb-3 sm:mb-4 leading-tight">
          Your Order History
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          View all your past purchases and order details in one place
        </p>
      </div>

      {/* Purchase Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12">
        <div className="group bg-white/70 backdrop-blur-sm rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 border border-white/20 transform hover:scale-[1.02] hover:-translate-y-2">
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl sm:rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <ShoppingBag className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" />
              </div>
              <div className="text-right">
                <div className="text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wide mb-1">
                  Total Orders
                </div>
                <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {stats.totalPurchases.toLocaleString()}
                </div>
              </div>
            </div>
            <div className="w-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full h-2">
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full" style={{ width: '100%' }}></div>
            </div>
          </div>
        </div>

        <div className="group bg-white/70 backdrop-blur-sm rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 border border-white/20 transform hover:scale-[1.02] hover:-translate-y-2">
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-xl sm:rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" />
              </div>
              <div className="text-right">
                <div className="text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wide mb-1">
                  Total Spent
                </div>
                <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  ${stats.totalSpent.toLocaleString()}
                </div>
              </div>
            </div>
            <div className="w-full bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-full h-2">
              <div className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full" style={{ width: '85%' }}></div>
            </div>
          </div>
        </div>

        <div className="group bg-white/70 backdrop-blur-sm rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 border border-white/20 transform hover:scale-[1.02] hover:-translate-y-2 sm:col-span-2 lg:col-span-1">
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl sm:rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Package className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" />
              </div>
              <div className="text-right">
                <div className="text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wide mb-1">
                  Items Purchased
                </div>
                <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {stats.totalProducts.toLocaleString()}
                </div>
              </div>
            </div>
            <div className="w-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full h-2">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full" style={{ width: '70%' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Purchase List */}
      {purchases.length === 0 ? (
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl border border-white/20">
          <div className="p-8 sm:p-12 lg:p-16 text-center">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full mx-auto mb-4 sm:mb-6 flex items-center justify-center">
              <ShoppingBag className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
              No purchases yet
            </h3>
            <p className="text-gray-600 max-w-md mx-auto text-base sm:text-lg mb-6 sm:mb-8">
              When you make your first purchase, it will appear here. Start exploring our amazing products!
            </p>
            <Link 
              href="/" 
              className="group inline-flex items-center gap-2 px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl sm:rounded-2xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-blue-500/25"
            >
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:rotate-12" />
              <span className="text-sm sm:text-base">Browse Products</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl border border-white/20">
          <div className="p-4 sm:p-6 lg:p-8 border-b border-gray-200/50">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl sm:rounded-2xl flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                    Purchase History
                  </h2>
                  <p className="text-gray-600 text-sm sm:text-base">
                    Complete order history and purchase details
                  </p>
                </div>
              </div>
              <div className="text-left sm:text-right">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-r from-green-100 to-blue-100 rounded-full text-green-800 text-xs sm:text-sm font-medium">
                  <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>{purchases.length} Order{purchases.length !== 1 ? 's' : ''}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="space-y-6 sm:space-y-8">
              {purchases.map((purchase) => (
                <div key={purchase._id} className="group bg-white/50 backdrop-blur-sm rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500 border border-white/20 transform hover:scale-[1.01]">
                  {/* Purchase Header */}
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 px-4 sm:px-6 lg:px-8 py-4 sm:py-6 border-b border-white/20">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex items-center gap-3 sm:gap-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl sm:rounded-2xl flex items-center justify-center">
                          <Star className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                            Order #{purchase._id.slice(-8).toUpperCase()}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
                            <p className="text-xs sm:text-sm text-gray-600">
                              {formatDate(purchase.createdAt)}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="text-left sm:text-right">
                        <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
                          ${purchase.amount.toFixed(2)}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-600 mt-1">
                          {purchase.products.length} item{purchase.products.length !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Customer Details */}
                  <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 bg-gradient-to-r from-gray-50/50 to-blue-50/50 border-b border-white/20">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-md sm:rounded-lg flex items-center justify-center">
                          <User className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="text-xs sm:text-sm font-medium text-gray-500">Customer</span>
                          <p className="text-sm sm:text-base text-gray-900 font-semibold truncate">{purchase.name}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-md sm:rounded-lg flex items-center justify-center">
                          <Mail className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="text-xs sm:text-sm font-medium text-gray-500">Email</span>
                          <p className="text-sm sm:text-base text-gray-900 font-semibold truncate">{purchase.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 sm:col-span-2 lg:col-span-1">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-md sm:rounded-lg flex items-center justify-center">
                          <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="text-xs sm:text-sm font-medium text-gray-500">Location</span>
                          <p className="text-sm sm:text-base text-gray-900 font-semibold truncate">{purchase.location}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Products */}
                  <div className="p-4 sm:p-6 lg:p-8">
                    <div className="flex items-center gap-3 mb-4 sm:mb-6">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-md sm:rounded-lg flex items-center justify-center">
                        <Package className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                      </div>
                      <h4 className="text-lg sm:text-xl font-bold text-gray-900">Items Purchased</h4>
                    </div>
                    <div className="grid gap-4 sm:gap-6">
                      {purchase.products.map((product) => (
                        <div key={product._id} className="group/item bg-white/50 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20 hover:bg-white/70 transition-all duration-300">
                          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                            <div className="flex-shrink-0 w-full sm:w-auto">
                              {product.images && product.images.length > 0 ? (
                                <div className="relative w-full h-48 sm:w-24 sm:h-24 lg:w-32 lg:h-32 rounded-lg sm:rounded-xl overflow-hidden">
                                  <Image
                                    src={product.images[0]}
                                    alt={product.name}
                                    fill
                                    className="object-cover transition-transform duration-300 group-hover/item:scale-110"
                                  />
                                </div>
                              ) : (
                                <div className="w-full h-48 sm:w-24 sm:h-24 lg:w-32 lg:h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg sm:rounded-xl flex items-center justify-center">
                                  <Sparkles className="w-8 h-8 sm:w-6 sm:h-6 lg:w-12 lg:h-12 text-gray-400" />
                                </div>
                              )}
                            </div>
                            <div className="flex-grow min-w-0">
                              <h5 className="text-base sm:text-lg font-bold text-gray-900 group-hover/item:text-blue-600 transition-colors duration-300">
                                {product.name}
                              </h5>
                              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                                Product ID: {product._id.slice(-8).toUpperCase()}
                              </p>
                              <p className="text-lg sm:text-xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent mt-2">
                                ${product.price.toFixed(2)}
                              </p>
                            </div>
                            <div className="flex-shrink-0 w-full sm:w-auto">
                              <Link
                                href="/"
                                className="group/link w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 sm:px-6 sm:py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl sm:rounded-2xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-blue-500/25"
                              >
                                <Store className="w-4 h-4" />
                                <span className="text-sm sm:text-base">View Products</span>
                                <ArrowLeft className="w-4 h-4 rotate-180 transition-transform group-hover/link:translate-x-1" />
                              </Link>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default async function PurchasePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <AnimatedBackground />
      
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          {/* Back Button */}
          <div className="mb-4 sm:mb-6">
            <Link 
              href="/"
              className="group inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors duration-300"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:-translate-x-1" />
              <span className="font-medium text-sm sm:text-base">Back to Products</span>
            </Link>
          </div>

          {/* Suspense wrapper for loading state */}
          <Suspense fallback={<Loading message="Loading your purchase history..." />}>
            <PurchaseContent />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
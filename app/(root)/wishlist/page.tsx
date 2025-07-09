import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { getWishlistItems } from "@/lib/actions/wishlist.actions";
import { Heart, ShoppingCart, ArrowLeft, Sparkles, Star, Calendar, Tag } from "lucide-react";
import WishlistButton from "@/components/WishlistButton";
import AddToCartButton from "@/components/AddToCartButton";
import AnimatedBackground from "@/components/AnimatedBackground";
import Loading from "@/components/shared/Loading";
import { Suspense } from "react";

async function WishlistContent() {
  const wishlistItems = await getWishlistItems();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <AnimatedBackground />
      
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
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

          {/* Header Section */}
          <div className="mb-8 sm:mb-12 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-r from-red-100 to-pink-100 rounded-full text-red-800 text-xs sm:text-sm font-medium mb-3 sm:mb-4">
              <Heart className="w-3 h-3 sm:w-4 sm:h-4 fill-red-800" />
              <span>Your Favorites</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-red-900 to-pink-900 bg-clip-text text-transparent mb-3 sm:mb-4 px-4">
              My Wishlist
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed px-4">
              {wishlistItems.length === 0 
                ? "Your wishlist is empty - start adding your favorite products!" 
                : `You have ${wishlistItems.length} amazing item${wishlistItems.length !== 1 ? 's' : ''} saved for later`
              }
            </p>
          </div>

          {/* Empty State */}
          {wishlistItems.length === 0 ? (
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl p-8 sm:p-12 lg:p-16 text-center border border-white/20 mx-2 sm:mx-0">
              <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gradient-to-r from-red-200 to-pink-300 rounded-full mx-auto mb-4 sm:mb-6 flex items-center justify-center">
                <Heart className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-red-500" />
              </div>
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
                Your wishlist is empty
              </h3>
              <p className="text-gray-600 max-w-md mx-auto text-sm sm:text-base lg:text-lg mb-6 sm:mb-8 px-4">
                Start adding products to your wishlist by clicking the heart icon on any product. Save your favorites and never lose track of what you love!
              </p>
              <Link
                href="/"
                className="group inline-flex items-center gap-2 px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-xl sm:rounded-2xl font-semibold hover:from-red-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-red-500/25 text-sm sm:text-base"
              >
                <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:rotate-12" />
                <span>Continue Shopping</span>
              </Link>
            </div>
          ) : (
            <>
              {/* Wishlist Stats */}
              <div className="mb-8 sm:mb-12">
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-xl border border-white/20 mx-2 sm:mx-0">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-red-500 to-pink-600 rounded-xl sm:rounded-2xl flex items-center justify-center">
                        <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-white fill-white" />
                      </div>
                      <div>
                        <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                          Your Saved Items
                        </h2>
                        <p className="text-gray-600 text-sm sm:text-base">
                          {wishlistItems.length} item{wishlistItems.length !== 1 ? 's' : ''} waiting for you
                        </p>
                      </div>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
                        ${wishlistItems.reduce((total, item) => total + item.product.price, 0).toFixed(2)}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-500">Total value</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Wishlist Items Grid */}
              <div className="grid gap-4 sm:gap-6 lg:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 px-2 sm:px-0">
                {wishlistItems.map((item) => (
                  <div
                    key={item._id}
                    className="group bg-white/70 backdrop-blur-sm rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 border border-white/20 transform hover:scale-[1.02] hover:-translate-y-1 sm:hover:-translate-y-2"
                  >
                    {/* Product Image */}
                    <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
                      {item.product.images && item.product.images.length > 0 ? (
                        <Image
                          src={item.product.images[0]}
                          alt={item.product.name}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                          <div className="text-center p-4 sm:p-6">
                            <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-gradient-to-r from-gray-300 to-gray-400 rounded-xl sm:rounded-2xl mx-auto mb-2 sm:mb-4 flex items-center justify-center">
                              <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-gray-500" />
                            </div>
                            <span className="text-gray-500 font-medium text-sm sm:text-base">
                              Image coming soon
                            </span>
                          </div>
                        </div>
                      )}
                      
                      {/* Remove from wishlist button - positioned in top right */}
                      <div className="absolute top-2 right-2 sm:top-4 sm:right-4">
                        <WishlistButton
                          productId={item.product._id}
                          isInWishlist={true}
                          className="bg-white/90 backdrop-blur-sm p-2 sm:p-3 rounded-full text-red-500 hover:bg-white hover:text-red-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-110"
                        />
                      </div>

                      {/* Added date badge */}
                      <div className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4">
                        <div className="bg-white/90 backdrop-blur-sm px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs font-medium text-gray-600 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span className="hidden sm:inline">Added {new Date(item.createdAt).toLocaleDateString()}</span>
                          <span className="sm:hidden">{new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                        </div>
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="p-4 sm:p-6">
                      <div className="mb-3 sm:mb-4">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                          <h2 className="text-lg sm:text-xl font-bold text-gray-900 group-hover:text-red-600 transition-colors duration-300 line-clamp-2">
                            {item.product.name}
                          </h2>
                          {item.product.category?.name && (
                            <div className="flex items-center gap-1 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 text-xs font-medium px-2 sm:px-3 py-1 rounded-full self-start sm:self-center">
                              <Tag className="w-3 h-3" />
                              <span className="truncate max-w-[80px] sm:max-w-none">{item.product.category.name}</span>
                            </div>
                          )}
                        </div>
                        <p className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
                          ${item.product.price.toFixed(2)}
                        </p>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex justify-center pt-3 sm:pt-4 border-t border-gray-100">
                        <AddToCartButton 
                          productId={item.product._id}
                          className="w-full group/btn bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2.5 sm:px-6 sm:py-3 rounded-xl sm:rounded-2xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 text-sm sm:text-base"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="mt-8 sm:mt-12 flex flex-col sm:flex-row gap-4 justify-center items-center px-4 sm:px-0">
                <Link
                  href="/"
                  className="group inline-flex items-center gap-2 px-6 py-3 sm:px-8 sm:py-4 bg-white/70 backdrop-blur-sm text-gray-700 rounded-xl sm:rounded-2xl font-semibold hover:bg-white hover:text-blue-600 border border-white/20 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-sm sm:text-base w-full sm:w-auto justify-center"
                >
                  <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:-translate-x-1" />
                  <span>Continue Shopping</span>
                </Link>
                
                {wishlistItems.length > 0 && (
                  <div className="group bg-white/70 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-lg border border-white/20 w-full sm:w-auto">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-red-500 to-pink-600 rounded-md sm:rounded-lg flex items-center justify-center">
                        <Star className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm font-medium text-gray-600">Pro tip:</p>
                        <p className="text-xs text-gray-500">Add items to cart before they sell out!</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default async function WishlistPage() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect('/sign-in');
  }

  return (
    <Suspense fallback={<Loading message="Loading your wishlist..." />}>
      <WishlistContent />
    </Suspense>
  );
}
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { getWishlistItems } from "@/lib/actions/wishlist.actions";
import { Heart, ShoppingCart, ArrowLeft } from "lucide-react";
import WishlistButton from "@/components/WishlistButton";
import AddToCartButton from "@/components/AddToCartButton";

export default async function WishlistPage() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect('/sign-in');
  }

  const wishlistItems = await getWishlistItems();

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Link 
            href="/"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Products</span>
          </Link>
        </div>
        
        <div className="flex items-center gap-3">
          <Heart className="w-8 h-8 text-red-500 fill-red-500" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
            <p className="text-gray-600 mt-1">
              {wishlistItems.length === 0 
                ? "Your wishlist is empty" 
                : `${wishlistItems.length} item${wishlistItems.length !== 1 ? 's' : ''} in your wishlist`
              }
            </p>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {wishlistItems.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
          <div className="max-w-md mx-auto">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Your wishlist is empty
            </h3>
            <p className="text-gray-600 mb-6">
              Start adding products to your wishlist by clicking the heart icon on any product.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
            >
              <ShoppingCart className="w-5 h-5" />
              <span>Continue Shopping</span>
            </Link>
          </div>
        </div>
      ) : (
        <>
          {/* Wishlist Items Grid */}
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {wishlistItems.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 flex flex-col"
              >
                <div className="relative aspect-square bg-gray-50">
                  {item.product.images && item.product.images.length > 0 ? (
                    <Image
                      src={item.product.images[0]}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                      <div className="text-center p-4">
                        <div className="bg-gray-300 border-2 border-dashed rounded-xl w-16 h-16 mx-auto mb-2" />
                        <span className="text-gray-500 text-sm">No image</span>
                      </div>
                    </div>
                  )}
                  
                  {/* Remove from wishlist button - positioned in top right */}
                  <div className="absolute top-3 right-3">
                    <WishlistButton
                      productId={item.product._id}
                      isInWishlist={true}
                      className="bg-white/80 backdrop-blur-sm p-2 rounded-full text-red-500 hover:bg-white hover:text-red-600 transition shadow-lg"
                    />
                  </div>
                </div>

                <div className="p-5 flex flex-col flex-grow justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h2 className="text-lg font-bold text-gray-900 truncate">
                          {item.product.name}
                        </h2>
                        <p className="text-xl font-semibold text-gray-900 mt-1">
                          ${item.product.price.toFixed(2)}
                        </p>
                      </div>
                      <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                        {item.product.category?.name || "Uncategorized"}
                      </span>
                    </div>
                    
                    <p className="text-gray-500 text-sm">
                      Added {new Date(item.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Bottom Actions */}
                  <div className="mt-6 pt-4 border-t border-gray-100 flex justify-center">
                    <AddToCartButton 
                      productId={item.product._id}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Continue Shopping Button */}
          <div className="mt-10 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Continue Shopping</span>
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
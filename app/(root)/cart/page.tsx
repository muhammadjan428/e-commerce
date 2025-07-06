import Link from 'next/link';
import { ShoppingBag, ArrowLeft, Sparkles, Star } from 'lucide-react';
import { getCartItems } from '@/lib/actions/cart.actions';
import CartItem from '@/components/CartItem';
import CartSummary from '@/components/CartSummary';
import AnimatedBackground from '@/components/AnimatedBackground';
import { Suspense } from 'react';

export default async function CartPage() {
  const cartData = await getCartItems();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <AnimatedBackground />
      
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
          {/* Header */}
          <div className="mb-8 sm:mb-10 lg:mb-12">
            <Link
              href="/"
              className="group inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4 sm:mb-6 font-medium bg-white/70 backdrop-blur-sm px-3 py-1.5 sm:px-4 sm:py-2 rounded-full shadow-lg border border-white/20 transition-all duration-300 hover:shadow-xl hover:scale-105"
            >
              <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 transition-transform group-hover:-translate-x-1" />
              <span className="text-sm sm:text-base">Continue Shopping</span>
            </Link>
            
            <div className="text-center mb-6 sm:mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full text-blue-800 text-xs sm:text-sm font-medium mb-3 sm:mb-4">
                <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>Your Cart</span>
              </div>
              
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent mb-3 sm:mb-4 flex items-center justify-center gap-2 sm:gap-3 lg:gap-4">
                <ShoppingBag className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-blue-600" />
                Shopping Cart
              </h1>
              
              {cartData.totalItems > 0 && (
                <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed px-4">
                  {cartData.totalItems} {cartData.totalItems === 1 ? 'item' : 'items'} ready for checkout
                </p>
              )}
            </div>
          </div>

          {cartData.totalItems === 0 ? (
            /* Empty Cart State */
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl p-8 sm:p-12 lg:p-16 text-center max-w-2xl mx-auto border border-white/20">
              <div className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full mx-auto mb-6 sm:mb-8 flex items-center justify-center">
                <ShoppingBag className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 text-blue-500" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
                Your cart is empty
              </h2>
              <p className="text-gray-600 mb-6 sm:mb-8 text-base sm:text-lg leading-relaxed px-4">
                Looks like you haven't added any items to your cart yet.
                Start shopping to fill it up with amazing products!
              </p>
              <Link
                href="/"
                className="group inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-6 py-3 sm:px-8 sm:py-4 rounded-xl sm:rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-sm sm:text-base">Start Shopping</span>
              </Link>
            </div>
          ) : (
            /* Cart with Items */
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-xl border border-white/20 mb-6 sm:mb-8">
                  <div className="flex items-center gap-3 mb-4 sm:mb-6">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-md sm:rounded-lg flex items-center justify-center">
                      <Star className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                      Your Items
                    </h2>
                  </div>
                  
                  <div className="space-y-4 sm:space-y-6">
                    <Suspense fallback={<CartItemsSkeleton />}>
                      <CartItemsList cartData={cartData} />
                    </Suspense>
                  </div>
                </div>
              </div>

              {/* Cart Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl border border-white/20 overflow-hidden sticky top-4">
                  <CartSummary cartData={cartData} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Client component for cart items with refresh capability
function CartItemsList({ cartData }: { cartData: any }) {
  return (
    <>
      {cartData.items.map((item: any) => (
        <div key={item._id} className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg border border-white/30 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
          <CartItem
            item={item}
          />
        </div>
      ))}
    </>
  );
}

// Loading skeleton for cart items
function CartItemsSkeleton() {
  return (
    <div className="space-y-4 sm:space-y-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg border border-white/30 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Mobile: Full width image, Desktop: Side image */}
            <div className="w-full h-48 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg sm:rounded-xl animate-pulse flex-shrink-0" />
            
            <div className="flex-grow min-w-0">
              {/* Product name */}
              <div className="h-5 sm:h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-full sm:w-3/4 mb-2 sm:mb-3 animate-pulse" />
              
              {/* Product details */}
              <div className="h-3 sm:h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-2/3 sm:w-1/2 mb-3 sm:mb-4 animate-pulse" />
              
              {/* Controls and price */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
                {/* Quantity controls */}
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full animate-pulse" />
                  <div className="w-8 h-8 sm:w-10 sm:h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg animate-pulse" />
                  <div className="w-8 h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full animate-pulse" />
                </div>
                
                {/* Price */}
                <div className="text-right">
                  <div className="h-3 sm:h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-16 sm:w-12 mb-1 sm:mb-2 animate-pulse" />
                  <div className="h-5 sm:h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-20 sm:w-16 animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
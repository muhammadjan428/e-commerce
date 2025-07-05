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
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Header */}
          <div className="mb-12">
            <Link
              href="/"
              className="group inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 font-medium bg-white/70 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-white/20 transition-all duration-300 hover:shadow-xl hover:scale-105"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              Continue Shopping
            </Link>
            
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full text-blue-800 text-sm font-medium mb-4">
                <Sparkles className="w-4 h-4" />
                <span>Your Cart</span>
              </div>
              
              <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent mb-4 flex items-center justify-center gap-4">
                <ShoppingBag className="w-12 h-12 text-blue-600" />
                Shopping Cart
              </h1>
              
              {cartData.totalItems > 0 && (
                <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                  {cartData.totalItems} {cartData.totalItems === 1 ? 'item' : 'items'} ready for checkout
                </p>
              )}
            </div>
          </div>

          {cartData.totalItems === 0 ? (
            /* Empty Cart State */
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl p-16 text-center max-w-2xl mx-auto border border-white/20">
              <div className="w-32 h-32 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full mx-auto mb-8 flex items-center justify-center">
                <ShoppingBag className="w-16 h-16 text-blue-500" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Your cart is empty
              </h2>
              <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                Looks like you haven't added any items to your cart yet.
                Start shopping to fill it up with amazing products!
              </p>
              <Link
                href="/"
                className="group inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-4 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <Sparkles className="w-5 h-5" />
                Start Shopping
              </Link>
            </div>
          ) : (
            /* Cart with Items */
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 mb-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <Star className="w-4 h-4 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Your Items
                    </h2>
                  </div>
                  
                  <div className="space-y-6">
                    <Suspense fallback={<CartItemsSkeleton />}>
                      <CartItemsList cartData={cartData} />
                    </Suspense>
                  </div>
                </div>
              </div>

              {/* Cart Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden">
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
        <div key={item._id} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/30 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
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
    <div className="space-y-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/30 p-6">
          <div className="flex gap-4">
            <div className="w-20 h-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl animate-pulse" />
            <div className="flex-grow">
              <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-3/4 mb-3 animate-pulse" />
              <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-1/2 mb-4 animate-pulse" />
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full animate-pulse" />
                  <div className="w-8 h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg animate-pulse" />
                  <div className="w-8 h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full animate-pulse" />
                </div>
                <div className="text-right">
                  <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-12 mb-2 animate-pulse" />
                  <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-16 animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
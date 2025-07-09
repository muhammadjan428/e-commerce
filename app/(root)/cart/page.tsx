import Link from 'next/link';
import { ShoppingBag, ArrowLeft, Sparkles, Star } from 'lucide-react';
import { getCartItems } from '@/lib/actions/cart.actions';
import CartItem from '@/components/CartItem';
import CartSummary from '@/components/CartSummary';
import AnimatedBackground from '@/components/AnimatedBackground';
import Loading from '@/components/shared/Loading';
import { Suspense } from 'react';

export default function CartPage() {
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
            </div>
          </div>

          <Suspense fallback={<Loading message="Loading your cart..." />}>
            <CartContent />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

// Separate component for cart content that handles data fetching
async function CartContent() {
  const cartData = await getCartItems();

  if (cartData.totalItems === 0) {
    return (
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
    );
  }

  return (
    <>
      <div className="text-center mb-6 sm:mb-8">
        <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed px-4">
          {cartData.totalItems} {cartData.totalItems === 1 ? 'item' : 'items'} ready for checkout
        </p>
      </div>

      {/* Cart with Items */}
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
              <CartItemsList cartData={cartData} />
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
    </>
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
import Link from 'next/link';
import { ShoppingBag, ArrowLeft } from 'lucide-react';
import { getCartItems } from '@/lib/actions/cart.actions';
import CartItem from '@/components/CartItem';
import CartSummary from '@/components/CartSummary';
import { Suspense } from 'react';

export default async function CartPage() {
  const cartData = await getCartItems();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4 font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Continue Shopping
          </Link>
          
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <ShoppingBag className="w-8 h-8" />
            Shopping Cart
          </h1>
          
          {cartData.totalItems > 0 && (
            <p className="text-gray-600 mt-2">
              {cartData.totalItems} {cartData.totalItems === 1 ? 'item' : 'items'} in your cart
            </p>
          )}
        </div>

        {cartData.totalItems === 0 ? (
          /* Empty Cart State */
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center max-w-md mx-auto">
            <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-12 h-12 text-gray-400" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Your cart is empty
            </h2>
            
            <p className="text-gray-600 mb-8">
              Looks like you haven't added any items to your cart yet.
              Start shopping to fill it up!
            </p>
            
            <Link
              href="/"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          /* Cart with Items */
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              <Suspense fallback={<CartItemsSkeleton />}>
                <CartItemsList cartData={cartData} />
              </Suspense>
            </div>

            {/* Cart Summary */}
            <div className="lg:col-span-1">
              <CartSummary cartData={cartData} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Client component for cart items with refresh capability
function CartItemsList({ cartData }: { cartData: any }) {
  return (
    <>
      {cartData.items.map((item: any) => (
        <CartItem 
          key={item._id} 
          item={item}
        />
      ))}
    </>
  );
}

// Loading skeleton for cart items
function CartItemsSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex gap-4">
            <div className="w-20 h-20 bg-gray-200 rounded-lg animate-pulse" />
            <div className="flex-grow">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-2 animate-pulse" />
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4 animate-pulse" />
              <div className="flex justify-between">
                <div className="h-8 bg-gray-200 rounded w-24 animate-pulse" />
                <div className="h-6 bg-gray-200 rounded w-16 animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
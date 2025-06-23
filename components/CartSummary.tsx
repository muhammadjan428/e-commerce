'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Trash2 } from 'lucide-react';
import { CartSummary as CartSummaryType } from '@/cart/cartt';
import { clearCart } from '@/lib/actions/cart.actions';

interface CartSummaryProps {
  cartData: CartSummaryType;
  onUpdate?: () => void;
}

export default function CartSummary({ cartData, onUpdate }: CartSummaryProps) {
  const [isClearing, setIsClearing] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const router = useRouter();

  const handleClearCart = async () => {
    if (!confirm('Are you sure you want to clear your entire cart?')) return;
    
    setIsClearing(true);
    try {
      await clearCart();
      onUpdate?.();
    } catch (error) {
      console.error('Error clearing cart:', error);
    } finally {
      setIsClearing(false);
    }
  };

  const handleCheckout = async () => {
    setIsCheckingOut(true);
    try {
      router.push('/checkout');
    } catch (error) {
      console.error('Error navigating to checkout:', error);
      setIsCheckingOut(false);
    }
  };

  const shipping = cartData.totalPrice > 50 ? 0 : 9.99;
  const tax = cartData.totalPrice * 0.08; // 8% tax
  const finalTotal = cartData.totalPrice + shipping + tax;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <ShoppingCart className="w-6 h-6" />
        Order Summary
      </h2>

      {/* Order Details */}
      <div className="space-y-4 mb-6">
        <div className="flex justify-between text-gray-700">
          <span>Items ({cartData.totalItems})</span>
          <span>${cartData.totalPrice.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between text-gray-700">
          <span>Shipping</span>
          <span>
            {shipping === 0 ? (
              <span className="text-green-600 font-medium">FREE</span>
            ) : (
              `$${shipping.toFixed(2)}`
            )}
          </span>
        </div>
        
        <div className="flex justify-between text-gray-700">
          <span>Tax</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        
        <div className="border-t pt-4">
          <div className="flex justify-between text-xl font-bold text-gray-900">
            <span>Total</span>
            <span>${finalTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Free Shipping Notice */}
      {shipping > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
          <p className="text-sm text-blue-800">
            <span className="font-medium">Free shipping</span> on orders over $50!
            <br />
            Add ${(50 - cartData.totalPrice).toFixed(2)} more to qualify.
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-3">
        <button
          onClick={handleCheckout}
          disabled={isCheckingOut || cartData.totalItems === 0}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isCheckingOut ? 'Redirecting...' : `Proceed to Checkout - $${finalTotal.toFixed(2)}`}
        </button>
        
        {cartData.totalItems > 0 && (
          <button
            onClick={handleClearCart}
            disabled={isClearing}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            {isClearing ? 'Clearing...' : 'Clear Cart'}
          </button>
        )}
      </div>

      {/* Security Notice */}
      <div className="mt-6 text-center">
        <p className="text-xs text-gray-500">
          🔒 Secure checkout with SSL encryption
        </p>
      </div>
    </div>
  );
}
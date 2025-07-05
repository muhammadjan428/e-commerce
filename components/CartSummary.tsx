'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Trash2, Sparkles, Star, Shield } from 'lucide-react';
import { CartSummary as CartSummaryType } from '@/cart/cartt';
import { clearCart } from '@/lib/actions/cart.actions';
import { getPublicSettings } from '@/lib/actions/settings.actions';

interface CartSummaryProps {
  cartData: CartSummaryType;
  onUpdate?: () => void;
}

interface PublicSettings {
  taxRate: number;
  shippingRate: number;
  freeShippingThreshold: number;
}

export default function CartSummary({ cartData, onUpdate }: CartSummaryProps) {
  const [isClearing, setIsClearing] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [settings, setSettings] = useState<PublicSettings>({
    taxRate: 8.0,
    shippingRate: 9.99,
    freeShippingThreshold: 50
  });
  const [isLoadingSettings, setIsLoadingSettings] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const publicSettings = await getPublicSettings();
        if (publicSettings) {
          setSettings({
            taxRate: publicSettings.taxRate || 8.0,
            shippingRate: publicSettings.shippingRate || 9.99,
            freeShippingThreshold: publicSettings.freeShippingThreshold || 50
          });
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
      } finally {
        setIsLoadingSettings(false);
      }
    };

    fetchSettings();
  }, []);

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

  // Calculate values using dynamic settings
  const shipping = cartData.totalPrice >= settings.freeShippingThreshold ? 0 : settings.shippingRate;
  const tax = cartData.totalPrice * (settings.taxRate / 100);
  const finalTotal = cartData.totalPrice + shipping + tax;

  // Show loading state while fetching settings
  if (isLoadingSettings) {
    return (
      <div className="p-8 sticky top-6">
        <div className="animate-pulse">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg animate-pulse" />
            <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg flex-1 animate-pulse" />
          </div>
          <div className="space-y-4">
            <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg animate-pulse" />
            <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg animate-pulse" />
            <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg animate-pulse" />
            <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 sticky top-6">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
          <Star className="w-4 h-4 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">
          Order Summary
        </h2>
      </div>

      {/* Order Details */}
      <div className="space-y-6 mb-8">
        <div className="flex justify-between text-gray-700 text-lg">
          <span>Items ({cartData.totalItems})</span>
          <span className="font-semibold">${cartData.totalPrice.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between text-gray-700 text-lg">
          <span>Shipping</span>
          <span className="font-semibold">
            {shipping === 0 ? (
              <span className="text-green-600 font-bold bg-green-50 px-3 py-1 rounded-full">
                FREE
              </span>
            ) : (
              `$${shipping.toFixed(2)}`
            )}
          </span>
        </div>
        
        <div className="flex justify-between text-gray-700 text-lg">
          <span>Tax ({settings.taxRate}%)</span>
          <span className="font-semibold">${tax.toFixed(2)}</span>
        </div>
        
        <div className="border-t-2 border-gray-200 pt-6">
          <div className="flex justify-between text-2xl font-bold">
            <span className="bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent">
              Total
            </span>
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              ${finalTotal.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Free Shipping Notice */}
      {shipping > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-2xl p-4 mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span className="font-bold text-blue-800">Free Shipping Available!</span>
          </div>
          <p className="text-sm text-blue-700">
            Add <span className="font-bold">${(settings.freeShippingThreshold - cartData.totalPrice).toFixed(2)}</span> more to qualify for free shipping on orders over ${settings.freeShippingThreshold}.
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-4">
        <button
          onClick={handleCheckout}
          disabled={isCheckingOut || cartData.totalItems === 0}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 shadow-lg hover:shadow-xl"
        >
          {isCheckingOut ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Redirecting...
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              Checkout - ${finalTotal.toFixed(2)}
            </div>
          )}
        </button>
        
        {cartData.totalItems > 0 && (
          <button
            onClick={handleClearCart}
            disabled={isClearing}
            className="w-full bg-white/80 hover:bg-white text-gray-700 font-semibold py-3 px-6 rounded-2xl transition-all duration-300 disabled:opacity-50 border border-gray-200 hover:border-gray-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <div className="flex items-center justify-center gap-2">
              <Trash2 className="w-4 h-4" />
              {isClearing ? 'Clearing...' : 'Clear Cart'}
            </div>
          </button>
        )}
      </div>

      {/* Security Notice */}
      <div className="mt-8 text-center">
        <div className="flex items-center justify-center gap-2 text-gray-600">
          <Shield className="w-4 h-4" />
          <p className="text-sm font-medium">
            Secure checkout with SSL encryption
          </p>
        </div>
      </div>
    </div>
  );
}
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Trash2 } from 'lucide-react';
import { CartSummary as CartSummaryType } from '@/cart/cartt';
import { clearCart } from '@/lib/actions/cart.actions';
import { getPublicSettings } from '@/lib/actions/settings.actions';

interface CartSummaryProps {
  cartData: CartSummaryType;
  onUpdate?: () => void;
}

interface PublicSettings {
  currencySymbol: string;
  taxRate: number;
  shippingRate: number;
  freeShippingThreshold: number;
}

export default function CartSummary({ cartData, onUpdate }: CartSummaryProps) {
  const [isClearing, setIsClearing] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [settings, setSettings] = useState<PublicSettings>({
    currencySymbol: '$',
    taxRate: 8.0,
    shippingRate: 9.99,
    freeShippingThreshold: 50
  });
  const [isLoadingSettings, setIsLoadingSettings] = useState(true);
  const router = useRouter();

  // Fetch settings on component mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const publicSettings = await getPublicSettings();
        if (publicSettings) {
          setSettings({
            currencySymbol: publicSettings.currencySymbol || '$',
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
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-6"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-6 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

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
          <span>{settings.currencySymbol}{cartData.totalPrice.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between text-gray-700">
          <span>Shipping</span>
          <span>
            {shipping === 0 ? (
              `${settings.currencySymbol}${settings.shippingRate.toFixed(2)}`
            ) : (
              <span className="text-green-600 font-medium">FREE</span>
            )}
          </span>
        </div>
        
        <div className="flex justify-between text-gray-700">
          <span>Tax ({settings.taxRate}%)</span>
          <span>{settings.currencySymbol}{tax.toFixed(2)}</span>
        </div>
        
        <div className="border-t pt-4">
          <div className="flex justify-between text-xl font-bold text-gray-900">
            <span>Total</span>
            <span>{settings.currencySymbol}{finalTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Free Shipping Notice */}
      {shipping > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
          <p className="text-sm text-blue-800">
            <span className="font-medium">Free shipping</span> on orders over {settings.currencySymbol}{settings.freeShippingThreshold}!
            <br />
            Add {settings.currencySymbol}{(settings.freeShippingThreshold - cartData.totalPrice).toFixed(2)} more to qualify.
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
          {isCheckingOut ? 'Redirecting...' : `Proceed to Checkout - ${settings.currencySymbol}${finalTotal.toFixed(2)}`}
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
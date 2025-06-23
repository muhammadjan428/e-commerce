'use client';

import { useEffect, useState } from 'react';
import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { fetchClientSecret } from '@/lib/actions/stripe.actions';
import { getCartItems } from '@/lib/actions/cart.actions';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function Checkout() {
  const [clientSecret, setClientSecret] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const initializeCheckout = async () => {
      try {
        // Get cart total
        const cartData = await getCartItems();
        
        if (cartData.totalItems === 0) {
          setError('Your cart is empty');
          setLoading(false);
          return;
        }

        // Calculate total with tax and shipping
        const shipping = cartData.totalPrice > 50 ? 0 : 9.99;
        const tax = cartData.totalPrice * 0.08;
        const finalTotal = cartData.totalPrice + shipping + tax;

        const secret = await fetchClientSecret(finalTotal);
        
        if (secret) {
          setClientSecret(secret);
        } else {
          setError('Failed to initialize checkout');
        }
      } catch (err) {
        setError('Failed to initialize checkout');
        console.error('Checkout initialization error:', err);
      } finally {
        setLoading(false);
      }
    };

    initializeCheckout();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Initializing checkout...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <a href="/cart" className="text-blue-600 hover:underline">
            Return to Cart
          </a>
        </div>
      </div>
    );
  }

  return (
    <div id="checkout" className="max-w-2xl mx-auto">
      <EmbeddedCheckoutProvider
        stripe={stripePromise}
        options={{ clientSecret }}
      >
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
}
'use client';

import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getCartItemsCount } from '@/lib/actions/cart.actions';

export default function CartIcon() {
  const [cartCount, setCartCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCartCount = async () => {
      try {
        const count = await getCartItemsCount();
        setCartCount(count);
      } catch (error) {
        console.error('Error fetching cart count:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCartCount();

    // Optional: Set up an interval to refresh cart count
    const interval = setInterval(fetchCartCount, 30000); // Every 30 seconds
    
    return () => clearInterval(interval);
  }, []);

  return (
    <Link
      href="/cart"
      className="relative p-2 text-gray-600 hover:text-gray-900 transition"
      title="View Cart"
    >
      <ShoppingCart className="w-6 h-6" />
      
      {/* Cart Count Badge */}
      {!isLoading && cartCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
          {cartCount > 99 ? '99+' : cartCount}
        </span>
      )}
    </Link>
  );
}
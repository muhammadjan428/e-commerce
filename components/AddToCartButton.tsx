'use client';

import { useState } from 'react';
import { ShoppingCart, Check } from 'lucide-react';
import { addToCart } from '@/lib/actions/cart.actions';

interface AddToCartButtonProps {
  productId: string;
  className?: string;
}

export default function AddToCartButton({ productId, className = "" }: AddToCartButtonProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = async () => {
    setIsAdding(true);
    
    try {
      const result = await addToCart({ productId, quantity: 1 });
      window.dispatchEvent(new Event('cartUpdated'));
      
      if (result.success) {
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000);
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add item to cart');
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={isAdding}
      className={`inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {isAdding ? (
        <>
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          Adding...
        </>
      ) : isAdded ? (
        <>
          <Check className="w-4 h-4" />
          Added!
        </>
      ) : (
        <>
          <ShoppingCart className="w-4 h-4" />
          Add To Cart
        </>
      )}
    </button>
  );
}
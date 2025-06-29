'use client';

import { useState } from 'react';
import { ShoppingCart, Check, Loader2 } from 'lucide-react';
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
      className={`
        group relative overflow-hidden
        px-6 py-3 rounded-2xl
        font-semibold text-sm
        transition-all duration-300 ease-out
        transform hover:scale-[1.02] active:scale-[0.98]
        disabled:cursor-not-allowed
        ${isAdded 
          ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg shadow-emerald-500/25' 
          : 'bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40'
        }
        ${className}
      `}
    >
      {/* Background animation */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 
                      translate-x-[-100%] group-hover:translate-x-[100%] 
                      transition-transform duration-700 ease-out" />
      
      {/* Content */}
      <div className="relative flex items-center justify-center gap-2 min-w-[120px]">
        {isAdding ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Adding...</span>
          </>
        ) : isAdded ? (
          <>
            <div className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center">
              <Check className="w-3 h-3" />
            </div>
            <span>Added!</span>
          </>
        ) : (
          <>
            <ShoppingCart className="w-4 h-4 transition-transform group-hover:scale-110" />
            <span>Add to Cart</span>
          </>
        )}
      </div>
      
      {/* Success ripple effect */}
      {isAdded && (
        <div className="absolute inset-0 rounded-2xl animate-ping bg-emerald-400/30" />
      )}
    </button>
  );
}
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { CartItem as CartItemType } from '@/cart/cartt';
import { updateCartItem, removeFromCart } from '@/lib/actions/cart.actions';

interface CartItemProps {
  item: CartItemType;
  onUpdate?: () => void;
}

export default function CartItem({ item, onUpdate }: CartItemProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  const handleQuantityChange = async (newQuantity: number) => {
    setIsUpdating(true);
    try {
      await updateCartItem({
        cartItemId: item._id,
        quantity: newQuantity,
      });
      onUpdate?.();
    } catch (error) {
      console.error('Error updating quantity:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemove = async () => {
    setIsRemoving(true);
    try {
      await removeFromCart(item._id);
      onUpdate?.();
    } catch (error) {
      console.error('Error removing item:', error);
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex gap-4">
        {/* Product Image */}
        <div className="relative w-20 h-20 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
          {item.product.images && item.product.images.length > 0 ? (
            <Image
              src={item.product.images[0]}
              alt={item.product.name}
              fill
              className="object-cover"
              sizes="80px"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
              <div className="bg-gray-300 border border-dashed rounded w-8 h-8" />
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="flex-grow">
          <div className="flex justify-between items-start">
            <div>
              <Link 
                href={`/products/${item.product.slug}`}
                className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition"
              >
                {item.product.name}
              </Link>
              {item.product.category && (
                <p className="text-sm text-gray-600 mt-1">
                  {item.product.category.name}
                </p>
              )}
              <p className="text-lg font-bold text-gray-900 mt-2">
                ${item.price.toFixed(2)} each
              </p>
            </div>

            {/* Remove Button */}
            <button
              onClick={handleRemove}
              disabled={isRemoving}
              className="text-gray-400 hover:text-red-500 transition p-1 disabled:opacity-50"
              title="Remove from cart"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>

          {/* Quantity Controls */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleQuantityChange(item.quantity - 1)}
                disabled={isUpdating || item.quantity <= 1}
                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <Minus className="w-4 h-4" />
              </button>
              
              <span className="text-lg font-semibold min-w-[2rem] text-center">
                {item.quantity}
              </span>
              
              <button
                onClick={() => handleQuantityChange(item.quantity + 1)}
                disabled={isUpdating}
                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Item Total */}
            <div className="text-right">
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-xl font-bold text-gray-900">
                ${(item.price * item.quantity).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
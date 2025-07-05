'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Minus, Plus, Trash2, Heart, ShoppingCart, AlertCircle } from 'lucide-react';
import { CartItem as CartItemType } from '@/cart/cartt';
import { updateCartItem, removeFromCart } from '@/lib/actions/cart.actions';

interface CartItemProps {
  item: CartItemType;
  onUpdate?: () => void;
}

export default function CartItem({ item, onUpdate }: CartItemProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setIsUpdating(true);
    try {
      await updateCartItem({
        cartItemId: item._id,
        quantity: newQuantity,
      });
      onUpdate?.();
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (error) {
      console.error('Error updating quantity:', error);
      // You could add a toast notification here
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemove = async () => {
    setIsRemoving(true);
    try {
      await removeFromCart(item._id);
      onUpdate?.();
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (error) {
      console.error('Error removing item:', error);
      // You could add a toast notification here
    } finally {
      setIsRemoving(false);
      setShowConfirmDelete(false);
    }
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const totalPrice = item.price * item.quantity;

  return (
    <div className="group bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 overflow-hidden">
      {/* Mobile-optimized layout */}
      <div className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Product Image */}
          <div className="relative w-full sm:w-24 h-24 sm:h-24 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0">
            {item.product.images && item.product.images.length > 0 && !imageError ? (
              <Image
                src={item.product.images[0]}
                alt={item.product.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 640px) 100vw, 96px"
                onError={handleImageError}
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                <ShoppingCart className="w-8 h-8 text-gray-400" />
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="flex-grow">
            <div className="flex justify-between items-start mb-2">
              <div className="flex-grow">
                <Link 
                  href={`/products/${item.product.slug}`}
                  className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors duration-200 line-clamp-2"
                >
                  {item.product.name}
                </Link>
                {item.product.category && (
                  <p className="text-sm text-gray-500 mt-1">
                    {item.product.category.name}
                  </p>
                )}
                
                {/* Price section */}
                <p className="text-lg font-bold text-gray-900 mt-2">
                  ${item.price.toFixed(2)} each
                </p>
              </div>

              {/* Action buttons */}
              <div className="flex gap-2 ml-4">                
                <button
                  onClick={() => setShowConfirmDelete(true)}
                  disabled={isRemoving}
                  className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-50 disabled:opacity-50"
                  title="Remove from cart"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Quantity Controls and Total */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600 hidden sm:block">Qty:</span>
                <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-1">
                  <button
                    onClick={() => handleQuantityChange(item.quantity - 1)}
                    disabled={isUpdating || item.quantity <= 1}
                    className="w-8 h-8 rounded-md flex items-center justify-center hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 active:scale-95"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  
                  <span className="text-lg font-semibold min-w-[2.5rem] text-center px-2">
                    {isUpdating ? (
                      <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    ) : (
                      item.quantity
                    )}
                  </span>
                  
                  <button
                    onClick={() => handleQuantityChange(item.quantity + 1)}
                    disabled={isUpdating}
                    className="w-8 h-8 rounded-md flex items-center justify-center hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 active:scale-95"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Item Total */}
              <div className="text-right">
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-xl font-bold text-gray-900">
                  ${totalPrice.toFixed(2)}
                </p>
                {item.quantity > 1 && (
                  <p className="text-xs text-gray-500">
                    ${item.price.toFixed(2)} each
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-6 h-6 text-red-500" />
              <h3 className="text-lg font-semibold">Remove Item</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to remove "{item.product.name}" from your cart?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmDelete(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleRemove}
                disabled={isRemoving}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 transition-colors"
              >
                {isRemoving ? 'Removing...' : 'Remove'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
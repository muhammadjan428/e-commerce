'use client';

import { useState, useTransition } from 'react';
import { Heart } from 'lucide-react';
import { addToWishlist, removeFromWishlist } from '@/lib/actions/wishlist.actions';
import { useAuth } from '@clerk/nextjs';
import { toast } from 'sonner';

interface WishlistButtonProps {
  productId: string;
  isInWishlist: boolean;
  className?: string;
}

export default function WishlistButton({ 
  productId, 
  isInWishlist: initialIsInWishlist,
  className = "text-gray-500 hover:text-red-500 transition"
}: WishlistButtonProps) {
  const [isInWishlist, setIsInWishlist] = useState(initialIsInWishlist);
  const [isPending, startTransition] = useTransition();
  const { isSignedIn } = useAuth();

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isSignedIn) {
      toast.error('Please sign in to add items to wishlist');
      return;
    }

    startTransition(async () => {
      try {
        if (isInWishlist) {
          await removeFromWishlist(productId);
          setIsInWishlist(false);
          toast.success('Removed from wishlist');
        } else {
          await addToWishlist(productId);
          setIsInWishlist(true);
          toast.success('Added to wishlist');
        }
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Something went wrong');
      }
    });
  };

  return (
    <button
      onClick={handleWishlistToggle}
      disabled={isPending}
      className={`${className} ${isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
      title={isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
    >
      <Heart 
        className={`w-6 h-6 ${isInWishlist ? 'fill-red-500 text-red-500' : ''} ${
          isPending ? 'animate-pulse' : ''
        }`} 
      />
    </button>
  );
}
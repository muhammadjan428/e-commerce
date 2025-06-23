'use server';

import { auth } from '@clerk/nextjs/server';
import Wishlist from '../models/wishlist.model';
import Product from '../models/product.model';
import { connectToDatabase } from '@/lib/mongoose';
import { revalidatePath } from 'next/cache';

export type WishlistItemType = {
  _id: string;
  productId: string;
  product: {
    _id: string;
    name: string;
    slug: string;
    price: number;
    images?: string[];
    category: { _id: string; name: string } | null;
  };
  createdAt: string;
};

// Add item to wishlist
export const addToWishlist = async (productId: string) => {
  try {
    const { userId } = await auth();
    if (!userId) {
      throw new Error('User not authenticated');
    }

    await connectToDatabase();

    // Check if item already exists in wishlist
    const existingItem = await Wishlist.findOne({
      userId,
      productId,
    });

    if (existingItem) {
      throw new Error('Product already in wishlist');
    }

    // Add to wishlist
    await Wishlist.create({
      userId,
      productId,
    });

    revalidatePath('/wishlist');
    return { success: true, message: 'Added to wishlist' };
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to add to wishlist');
  }
};

// Remove item from wishlist
export const removeFromWishlist = async (productId: string) => {
  try {
    const { userId } = await auth();
    if (!userId) {
      throw new Error('User not authenticated');
    }

    await connectToDatabase();

    await Wishlist.findOneAndDelete({
      userId,
      productId,
    });

    revalidatePath('/wishlist');
    return { success: true, message: 'Removed from wishlist' };
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    throw new Error('Failed to remove from wishlist');
  }
};

// Get all wishlist items for current user
export const getWishlistItems = async (): Promise<WishlistItemType[]> => {
  try {
    const { userId } = await auth();
    if (!userId) {
      return [];
    }

    await connectToDatabase();

    const wishlistItems = await Wishlist.find({ userId })
      .populate({
        path: 'productId',
        populate: {
          path: 'category',
          select: 'name',
        },
      })
      .sort({ createdAt: -1 })
      .lean();

    return wishlistItems
      .filter(item => item.productId) // Filter out items where product was deleted
      .map((item: any) => ({
        _id: item._id.toString(),
        productId: item.productId._id.toString(),
        product: {
          _id: item.productId._id.toString(),
          name: item.productId.name,
          slug: item.productId.slug,
          price: item.productId.price,
          images: item.productId.images || [],
          category: item.productId.category ? {
            _id: item.productId.category._id.toString(),
            name: item.productId.category.name,
          } : null,
        },
        createdAt: item.createdAt?.toISOString() || '',
      }));
  } catch (error) {
    console.error('Error fetching wishlist items:', error);
    return [];
  }
};

// Check if product is in wishlist
export const isInWishlist = async (productId: string): Promise<boolean> => {
  try {
    const { userId } = await auth();
    if (!userId) {
      return false;
    }

    await connectToDatabase();

    const item = await Wishlist.findOne({
      userId,
      productId,
    });

    return !!item;
  } catch (error) {
    console.error('Error checking wishlist status:', error);
    return false;
  }
};

// Get wishlist count for current user
export const getWishlistCount = async (): Promise<number> => {
  try {
    const { userId } = await auth();
    if (!userId) {
      return 0;
    }

    await connectToDatabase();

    const count = await Wishlist.countDocuments({ userId });
    return count;
  } catch (error) {
    console.error('Error getting wishlist count:', error);
    return 0;
  }
};
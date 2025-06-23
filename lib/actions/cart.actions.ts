'use server';

import { auth } from '@clerk/nextjs/server';
import { connectToDatabase } from '@/lib/mongoose';
import { Cart } from '../models/cart.model';
import Product from '../models/product.model';
import { revalidatePath } from 'next/cache';
import { AddToCartData, CartItem, CartSummary, UpdateCartData } from '@/cart/cartt';


// Get current user's cart items
export const getCartItems = async (): Promise<CartSummary> => {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return { items: [], totalItems: 0, totalPrice: 0 };
    }

    await connectToDatabase();

    const cartItems = await Cart.find({ userId })
      .populate({
        path: 'productId',
        populate: {
          path: 'category',
          select: 'name'
        }
      })
      .sort({ createdAt: -1 })
      .lean();

    const items: CartItem[] = cartItems.map((item: any) => ({
      _id: item._id.toString(),
      productId: item.productId._id.toString(),
      userId: item.userId,
      quantity: item.quantity,
      price: item.price,
      product: {
        _id: item.productId._id.toString(),
        name: item.productId.name,
        slug: item.productId.slug,
        price: item.productId.price,
        images: item.productId.images || [],
        category: item.productId.category ? {
          _id: item.productId.category._id.toString(),
          name: item.productId.category.name,
        } : undefined,
      },
      createdAt: item.createdAt?.toISOString() || '',
      updatedAt: item.updatedAt?.toISOString() || '',
    }));

    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return { items, totalItems, totalPrice };
  } catch (error) {
    console.error('Error fetching cart items:', error);
    return { items: [], totalItems: 0, totalPrice: 0 };
  }
};

// Add item to cart
export const addToCart = async (data: AddToCartData): Promise<{ success: boolean; message: string }> => {
    try {
      const { userId } = await auth();
  
      if (!userId) {
        return { success: false, message: 'Please login to add items to cart' };
      }
  
      await connectToDatabase();
  
      // Check if product exists
      const product = await Product.findById(data.productId);
      if (!product) {
        return { success: false, message: 'Product not found' };
      }
  
      // ✅ First, try to update the existing item
      const existingCartItem = await Cart.findOneAndUpdate(
        { userId, productId: data.productId },
        { $inc: { quantity: data.quantity || 1 } },
        { new: true }
      );
  
      if (existingCartItem) {
        revalidatePath('/cart');
        revalidatePath('/');
        return { success: true, message: 'Item quantity updated in cart' };
      }
  
      // ✅ If no existing item, create new
      const newCartItem = new Cart({
        productId: data.productId,
        userId,
        quantity: data.quantity || 1,
        price: product.price,
      });
  
      await newCartItem.save();
  
      revalidatePath('/cart');
      revalidatePath('/');
  
      return { success: true, message: 'Item added to cart successfully' };
    } catch (error) {
      console.error('Error adding to cart:', error);
      return { success: false, message: 'Failed to add item to cart' };
    }
  };

// Update cart item quantity
export const updateCartItem = async (data: UpdateCartData): Promise<{ success: boolean; message: string }> => {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return { success: false, message: 'Unauthorized' };
    }

    await connectToDatabase();

    if (data.quantity <= 0) {
      // Remove item if quantity is 0 or less
      await Cart.findOneAndDelete({
        _id: data.cartItemId,
        userId,
      });
    } else {
      // Update quantity
      const updatedItem = await Cart.findOneAndUpdate(
        { _id: data.cartItemId, userId },
        { quantity: data.quantity },
        { new: true }
      );
      
      if (!updatedItem) {
        return { success: false, message: 'Cart item not found' };
      }
    }

    revalidatePath('/cart');
    
    return { success: true, message: 'Cart updated successfully' };
  } catch (error) {
    console.error('Error updating cart item:', error);
    return { success: false, message: 'Failed to update cart item' };
  }
};

// Remove item from cart
export const removeFromCart = async (cartItemId: string): Promise<{ success: boolean; message: string }> => {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return { success: false, message: 'Unauthorized' };
    }

    await connectToDatabase();

    const deletedItem = await Cart.findOneAndDelete({
      _id: cartItemId,
      userId,
    });
    
    if (!deletedItem) {
      return { success: false, message: 'Cart item not found' };
    }

    revalidatePath('/cart');
    
    return { success: true, message: 'Item removed from cart' };
  } catch (error) {
    console.error('Error removing from cart:', error);
    return { success: false, message: 'Failed to remove item from cart' };
  }
};

// Clear entire cart
export const clearCart = async (): Promise<{ success: boolean; message: string }> => {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return { success: false, message: 'Unauthorized' };
    }

    await connectToDatabase();

    await Cart.deleteMany({ userId });

    revalidatePath('/cart');
    
    return { success: true, message: 'Cart cleared successfully' };
  } catch (error) {
    console.error('Error clearing cart:', error);
    return { success: false, message: 'Failed to clear cart' };
  }
};

// Get cart items count
export const getCartItemsCount = async (): Promise<number> => {
  try {
    const { userId } = await auth();
    
    if (!userId) return 0;

    await connectToDatabase();

    const cartItems = await Cart.find({ userId });
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  } catch (error) {
    console.error('Error getting cart count:', error);
    return 0;
  }
};
"use server"
import { connectToDatabase } from '../mongoose';
import { Payment } from '../models/payment.model';
import Product from '../models/product.model';
import User from '../models/user.model';
import { auth } from '@clerk/nextjs/server';

export interface PurchasedProduct {
  _id: string;
  userName: string;
  userEmail: string;
  price: number;
  images: string[];
  slug: string;
  purchaseDate: Date;
  paymentId: string;
  amount: number;
  location: string;
  productName: string;
  productId?: string;
}

// Get all purchased products for the current user
export async function getUserPurchases(): Promise<PurchasedProduct[]> {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      throw new Error('User not authenticated');
    }

    await connectToDatabase();

    // Find all payments for this user and get user details
    const payments = await Payment.find({ userId }).sort({ createdAt: -1 });

    if (!payments.length) {
      return [];
    }

    // Get user details
    const user = await User.findOne({ clerkId: userId });
    
    if (!user) {
      throw new Error('User not found');
    }

    // Create purchased products array with product details
    const purchasedProducts: PurchasedProduct[] = [];

    for (const payment of payments) {
      let productName = 'Unknown Product';
      let productImages: string[] = [];
      let productSlug = '';

      // If payment has productId, fetch product details
      if (payment.productId) {
        try {
          const product = await Product.findById(payment.productId);
          if (product) {
            productName = product.name;
            productImages = product.images || [];
            productSlug = product.slug;
          }
        } catch (error) {
          console.error('Error fetching product details:', error);
        }
      }

      const purchasedProduct: PurchasedProduct = {
        _id: payment._id.toString(),
        userName: `${user.first_name} ${user.last_name}`,
        userEmail: user.email,
        price: payment.amount,
        images: productImages,
        slug: productSlug,
        purchaseDate: payment.createdAt,
        paymentId: payment._id.toString(),
        amount: payment.amount,
        location: payment.location,
        productName: productName,
        productId: payment.productId?.toString(),
      };

      purchasedProducts.push(purchasedProduct);
    }

    return purchasedProducts;
  } catch (error) {
    console.error('Error fetching user purchases:', error);
    throw new Error('Failed to fetch purchases');
  }
}

// Get purchase count for the current user
export async function getUserPurchasesCount(): Promise<number> {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return 0;
    }

    await connectToDatabase();

    const count = await Payment.countDocuments({ userId });
    return count;
  } catch (error) {
    console.error('Error fetching purchases count:', error);
    return 0;
  }
}

// Get a specific purchase by payment ID
export async function getPurchaseById(paymentId: string): Promise<PurchasedProduct | null> {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      throw new Error('User not authenticated');
    }

    await connectToDatabase();

    const payment = await Payment.findOne({ _id: paymentId, userId });

    if (!payment) {
      return null;
    }

    // Get user details
    const user = await User.findOne({ clerkId: userId });
    
    if (!user) {
      throw new Error('User not found');
    }

    let productName = 'Unknown Product';
    let productImages: string[] = [];
    let productSlug = '';

    // If payment has productId, fetch product details
    if (payment.productId) {
      try {
        const product = await Product.findById(payment.productId);
        if (product) {
          productName = product.name;
          productImages = product.images || [];
          productSlug = product.slug;
        }
      } catch (error) {
        console.error('Error fetching product details:', error);
      }
    }

    const purchasedProduct: PurchasedProduct = {
      _id: payment._id.toString(),
      userName: `${user.first_name} ${user.last_name}`,
      userEmail: user.email,
      price: payment.amount,
      images: productImages,
      slug: productSlug,
      purchaseDate: payment.createdAt,
      paymentId: payment._id.toString(),
      amount: payment.amount,
      location: payment.location,
      productName: productName,
      productId: payment.productId?.toString(),
    };

    return purchasedProduct;
  } catch (error) {
    console.error('Error fetching purchase:', error);
    return null;
  }
}
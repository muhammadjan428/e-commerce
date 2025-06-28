"use server";

import { connectToDatabase } from "@/lib/mongoose";
import { Payment } from "@/lib/models/payment.model";
import Product from "@/lib/models/product.model";

export interface PurchaseWithProducts {
  _id: string;
  email: string;
  name: string;
  amount: number;
  location: string;
  userId: string;
  createdAt: Date;
  products: {
    _id: string;
    name: string;
    price: number;
    slug: string;
    images: string[];
  }[];
}

// Get all purchases for a specific user with populated product details
export async function getUserPurchases(userId: string): Promise<PurchaseWithProducts[]> {
  try {
    await connectToDatabase();

    const purchases = await Payment.find({ userId })
      .populate({
        path: 'productId',
        model: Product,
        select: 'name price slug images'
      })
      .sort({ createdAt: -1 })
      .lean();

    return purchases.map((purchase: any) => ({
      _id: purchase._id.toString(),
      email: purchase.email,
      name: purchase.name,
      amount: purchase.amount,
      location: purchase.location,
      userId: purchase.userId,
      createdAt: purchase.createdAt,
      products: Array.isArray(purchase.productId) 
        ? purchase.productId.map((product: any) => ({
            _id: product._id.toString(),
            name: product.name,
            price: product.price,
            slug: product.slug,
            images: product.images || []
          }))
        : []
    }));
  } catch (error) {
    console.error("Error fetching user purchases:", error);
    throw new Error("Failed to fetch purchases");
  }
}

// Get all purchases (admin function)
export async function getAllPurchases(): Promise<PurchaseWithProducts[]> {
  try {
    await connectToDatabase();

    const purchases = await Payment.find({})
      .populate({
        path: 'productId',
        model: Product,
        select: 'name price slug images'
      })
      .sort({ createdAt: -1 })
      .lean();

    return purchases.map((purchase: any) => ({
      _id: purchase._id.toString(),
      email: purchase.email,
      name: purchase.name,
      amount: purchase.amount,
      location: purchase.location,
      userId: purchase.userId,
      createdAt: purchase.createdAt,
      products: Array.isArray(purchase.productId) 
        ? purchase.productId.map((product: any) => ({
            _id: product._id.toString(),
            name: product.name,
            price: product.price,
            slug: product.slug,
            images: product.images || []
          }))
        : []
    }));
  } catch (error) {
    console.error("Error fetching all purchases:", error);
    throw new Error("Failed to fetch purchases");
  }
}

// Get purchase statistics for a user
export async function getUserPurchaseStats(userId: string) {
  try {
    await connectToDatabase();

    const stats = await Payment.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: null,
          totalPurchases: { $sum: 1 },
          totalSpent: { $sum: "$amount" },
          totalProducts: { $sum: { $size: "$productId" } }
        }
      }
    ]);

    return stats[0] || {
      totalPurchases: 0,
      totalSpent: 0,
      totalProducts: 0
    };
  } catch (error) {
    console.error("Error fetching user purchase stats:", error);
    throw new Error("Failed to fetch purchase statistics");
  }
}


// Get purchase statistics for admin dashboard
export async function getAdminPurchaseStats() {
  try {
    await connectToDatabase();

    const stats = await Payment.aggregate([
      {
        $group: {
          _id: null,
          totalPurchases: { $sum: 1 },
          totalRevenue: { $sum: "$amount" },
          totalProducts: { $sum: { $size: "$productId" } }
        }
      }
    ]);

    const statusStats = await Payment.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    const monthlyStats = await Payment.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          totalSales: { $sum: "$amount" },
          orderCount: { $sum: 1 }
        }
      },
      {
        $sort: { "_id.year": -1, "_id.month": -1 }
      },
      {
        $limit: 12
      }
    ]);

    return {
      overview: stats[0] || {
        totalPurchases: 0,
        totalRevenue: 0,
        totalProducts: 0
      },
      statusBreakdown: statusStats,
      monthlyTrends: monthlyStats
    };
  } catch (error) {
    console.error("Error fetching admin purchase stats:", error);
    throw new Error("Failed to fetch purchase statistics");
  }
}
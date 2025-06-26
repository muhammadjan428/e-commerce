'use server';

import { connectToDatabase } from '@/lib/mongoose';
import { Payment } from '../models/payment.model';
import User, { IUser } from '../models/user.model';
import { checkIsAdmin } from './users.actions';

export interface DailyRevenueData {
  date: string;
  revenue: number;
  orders: number;
}

// Add this function to your existing customer.actions.ts file
export async function getDailyRevenue(): Promise<DailyRevenueData[]> {
  try {
    // Check if current user is admin
    const isAdminUser = await checkIsAdmin();
    if (!isAdminUser) {
      throw new Error('Unauthorized: Admin access required');
    }

    await connectToDatabase();

    // Get daily revenue and order count from payments
    const dailyStats = await Payment.aggregate([
      {
        $addFields: {
          // Convert createdAt to date string (YYYY-MM-DD format)
          dateOnly: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt"
            }
          }
        }
      },
      {
        $group: {
          _id: "$dateOnly",
          revenue: { $sum: "$amount" },
          orders: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          date: "$_id",
          revenue: 1,
          orders: 1
        }
      },
      {
        $sort: { date: 1 }
      }
    ]);

    return dailyStats;

  } catch (error) {
    console.error('Error fetching daily revenue:', error);
    return [];
  }
}

export interface CustomerData {
  _id: string;
  clerkId: string;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  image?: string;
  totalSpent: number;
  totalOrders: number;
  lastOrderDate: Date | null;
  createdAt: Date;
}

export async function getAllCustomers(): Promise<CustomerData[]> {
  try {
    // Check if current user is admin
    const isAdminUser = await checkIsAdmin();
    if (!isAdminUser) {
      throw new Error('Unauthorized: Admin access required');
    }

    await connectToDatabase();

    // Get all users who have made payments (customers)
    const customersWithPayments = await Payment.aggregate([
      {
        $group: {
          _id: '$userId',
          totalSpent: { $sum: '$amount' },
          totalOrders: { $sum: 1 },
          lastOrderDate: { $max: '$createdAt' }
        }
      }
    ]);

    // Get user details for customers
    const customerIds = customersWithPayments.map(c => c._id);
    const users = await User.find({ clerkId: { $in: customerIds } }).lean<IUser[]>();

    // Combine user data with payment statistics
    const customers: CustomerData[] = users.map((user: any) => {
      const paymentStats = customersWithPayments.find(c => c._id === user.clerkId);
      
      return {
        _id: user._id?.toString() || '',
        clerkId: user.clerkId || '',
        email: user.email || '',
        username: user.username || '',
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        image: user.image,
        totalSpent: paymentStats?.totalSpent || 0,
        totalOrders: paymentStats?.totalOrders || 0,
        lastOrderDate: paymentStats?.lastOrderDate || null,
        createdAt: user.createdAt || new Date()
      };
    });

    // Sort by total spent (highest first)
    return customers.sort((a, b) => b.totalSpent - a.totalSpent);

  } catch (error) {
    console.error('Error fetching customers:', error);
    return [];
  }
}

export async function getCustomerDetails(clerkId: string) {
  try {
    const isAdminUser = await checkIsAdmin();
    if (!isAdminUser) {
      throw new Error('Unauthorized: Admin access required');
    }

    await connectToDatabase();

    // Get user details
    const user = await User.findOne({ clerkId }).lean<IUser>();
    if (!user) {
      throw new Error('Customer not found');
    }

    // Get all payments for this customer
    const payments = await Payment.find({ userId: clerkId })
      .sort({ createdAt: -1 })
      .lean();

    const totalSpent = payments.reduce((sum, payment) => sum + payment.amount, 0);

    return {
      user: {
        _id: user._id?.toString() || '',
        clerkId: user.clerkId || '',
        email: user.email || '',
        username: user.username || '',
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        image: user.image,
        createdAt: user.createdAt || new Date()
      },
      payments: payments.map((p: any) => ({
        id: p._id?.toString() || '',
        email: p.email || '',
        name: p.name || '',
        amount: p.amount || 0,
        location: p.location || '',
        createdAt: p.createdAt || new Date()
      })),
      totalSpent,
      totalOrders: payments.length
    };

  } catch (error) {
    console.error('Error fetching customer details:', error);
    throw error;
  }
}
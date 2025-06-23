// lib/actions/order.actions.ts
'use server';

import Stripe from 'stripe';
import { auth } from '@clerk/nextjs/server';
import { clearCart } from './cart.actions';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export interface OrderDetails {
  id: string;
  amount: number;
  currency: string;
  status: string;
  customer_email: string;
}

export const verifyOrder = async (sessionId: string): Promise<{ success: boolean; data?: OrderDetails; error?: string }> => {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return { success: false, error: 'Unauthorized' };
    }

    if (!sessionId) {
      return { success: false, error: 'Session ID is required' };
    }

    // Retrieve the checkout session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (!session) {
      return { success: false, error: 'Session not found' };
    }

    // If payment is successful, clear the cart
    if (session.payment_status === 'paid') {
      await clearCart();
    }

    // Return order details
    const orderDetails: OrderDetails = {
      id: session.id,
      amount: session.amount_total || 0,
      currency: session.currency || 'usd',
      status: session.payment_status || 'pending',
      customer_email: session.customer_details?.email || '',
    };

    return { success: true, data: orderDetails };

  } catch (error) {
    console.error('Error verifying order:', error);
    return { success: false, error: 'Failed to verify order' };
  }
};
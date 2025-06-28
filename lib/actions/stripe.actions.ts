'use server';

import { headers } from 'next/headers';
import { auth } from '@clerk/nextjs/server';
import { stripe } from '../stripe';
import { connectToDatabase } from '../mongoose';
import { Payment } from '../models/payment.model';
import { Cart } from '../models/cart.model';
import { revalidatePath } from 'next/cache';

// Updated PaymentData interface to include product information
export interface PaymentData {
  id: string;
  email: string;
  name: string;
  amount: number;
  location: string;
  userId: string;
  createdAt: Date;
}

export async function fetchClientSecret(cartTotal: number): Promise<string | null> {
  try {
    const { userId } = await auth();
        
    if (!userId) {
      throw new Error('User not authenticated');
    }

    const origin = (await headers()).get('origin');
        
    const session = await stripe.checkout.sessions.create({
      ui_mode: 'embedded',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Cart Items',
            },
            unit_amount: Math.round(cartTotal * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      return_url: `${origin}/orders?session_id={CHECKOUT_SESSION_ID}`,
      metadata: {
        userId: userId,
      },
    });

    return session.client_secret;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return null;
  }
}
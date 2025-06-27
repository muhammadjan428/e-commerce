import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { connectToDatabase } from "@/lib/mongoose";
import { Payment } from "@/lib/models/payment.model";
import { Cart } from "@/lib/models/cart.model";
import Product from "@/lib/models/product.model";

export async function POST(req: NextRequest) {
  let event;

  try {
    const body = await req.text();
    const signature = (await headers()).get("stripe-signature");

    if (!signature) {
      return NextResponse.json(
        { message: "No signature provided" },
        { status: 400 }
      );
    }

    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return NextResponse.json(
      { message: `Webhook Error: ${err.message}` },
      { status: 400 }
    );
  }

  const permittedEvents = ["checkout.session.completed"];

  if (permittedEvents.includes(event.type)) {
    try {
      switch (event.type) {
        case "checkout.session.completed":
  const session = event.data.object;

  // Fetch the full session to access all customer fields
  const fullSession = await stripe.checkout.sessions.retrieve(
    session.id,
    {
      expand: ["customer", "customer_details"],
    }
  );

  const email =
    fullSession.customer_details?.email ||
    (fullSession.customer as any)?.email ||
    "Unknown";
  const name =
    fullSession.customer_details?.name ||
    (fullSession.customer as any)?.name ||
    "Unknown";
  const location =
    fullSession.customer_details?.address?.country || "Unknown";
  const amount = (fullSession.amount_total || 0) / 100;
  const userId = fullSession.metadata?.userId;

  if (!userId) {
    console.error("No userId found in session metadata");
    break;
  }

  await connectToDatabase();

  // Get cart items to extract product IDs
  const cartItems = await Cart.find({ userId });
  
  // Extract product IDs from cart items
  const productIds = cartItems.map(item => item.productId);

  // Save payment record with product IDs
  await Payment.create({
    email,
    name,
    amount,
    location,
    userId,
    productId: productIds,  // Add the product IDs array
  });

  // Clear user's cart after successful payment
  await Cart.deleteMany({ userId });

  console.log(`Payment saved for user ${userId}, amount: ${amount}, products: ${productIds.length}`);
  break;

        default:
          throw new Error(`Unhandled event: ${event.type}`);
      }
    } catch (error) {
      console.error("Webhook handler failed:", error);
      return NextResponse.json(
        { message: "Webhook handler failed" },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ message: "Received" }, { status: 200 });
}
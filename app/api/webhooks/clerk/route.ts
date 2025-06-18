import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { connectToDatabase } from '@/lib/mongoose';
import { CreateUser, UpdateUser, DeleteUser } from '@/lib/actions/users.actions';

export async function POST(req: Request) {
  const CLERK_WEBHOOK_SIGNING_SECRET = process.env.CLERK_WEBHOOK_SIGNING_SECRET;

  if (!CLERK_WEBHOOK_SIGNING_SECRET) {
    throw new Error('Missing Clerk Webhook Secret in environment variables');
  }

  const wh = new Webhook(CLERK_WEBHOOK_SIGNING_SECRET);

  const headerPayload = await headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Missing Svix headers', { status: 400 });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Webhook verification failed:', err);
    return new Response('Webhook verification failed', { status: 400 });
  }

  const eventType = evt.type;
  const data = evt.data as {
    id: string;
    email_addresses: { email_address: string }[];
    username: string | null;
    first_name: string | null;
    last_name: string | null;
    image_url: string | null;
  };

  const { id, email_addresses, username, first_name, last_name, image_url } = data;
  const email = email_addresses?.[0]?.email_address ?? '';
  const firstName = first_name || '';
  const lastName = last_name || '';
  const image = image_url || '';

  await connectToDatabase();

  // Define admin emails (or you can pull this from DB/env later)
  const ADMIN_EMAILS = ['admin@example.com', 'you@example.com'];
  const isAdmin = ADMIN_EMAILS.includes(email);

  if (eventType === 'user.created') {
    const user = {
      clerkId: id,
      email,
      username: username ?? '',
      first_name: firstName,
      last_name: lastName,
      image,
      isAdmin, // ✅ attach admin role
    };
    const createdUser = await CreateUser(user);
    return new Response(JSON.stringify(createdUser), { status: 201 });
  }

  if (eventType === 'user.updated') {
    const updatedUser = await UpdateUser(id, {
      email,
      username: username ?? '',
      first_name: firstName,
      last_name: lastName,
      image,
    });

    return new Response(JSON.stringify(updatedUser), { status: 200 });
  }

  if (eventType === 'user.deleted') {
    const deletedUser = await DeleteUser(id);
    return new Response(JSON.stringify(deletedUser), { status: 200 });
  }

  return new Response('Unhandled webhook event', { status: 200 });
}
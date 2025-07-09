'use server';

import { auth } from '@clerk/nextjs/server';
import User, { IUser } from '../models/user.model';
import { connectToDatabase } from '@/lib/mongoose';

interface UserData {
  clerkId: string;
  email: string;
  username: string;
  first_name: string | null;
  last_name: string | null;
  image?: string | null;
  isAdmin?: boolean;
}

const ADMIN_EMAILS = ['mjan23925@gmail.com', 'muhammadjanfullstack@gmail.com'];

export const getAllUsers = async () => {
  try {
    await connectToDatabase();
    const users = await User.find().lean();
    return users;
  } catch (error) {
    console.error('[GET_ALL_USERS_ERROR]', error);
    return [];
  }
};

export const CreateUser = async (user: UserData) => {
  try {
    await connectToDatabase();

    const isAdmin = ADMIN_EMAILS.includes(user.email);
    const newUser = await User.create({ ...user, isAdmin });

    return JSON.parse(JSON.stringify(newUser));
  } catch (error) {
    console.error('Database error while creating user:', error);
    return new Response('Database error', { status: 500 });
  }
};

export const UpdateUser = async (clerkId: string, updates: Partial<UserData>) => {
  try {
    await connectToDatabase();
    const updatedUser = await User.findOneAndUpdate(
      { clerkId },
      updates,
      { new: true }
    );
    return JSON.parse(JSON.stringify(updatedUser));
  } catch (error) {
    console.error('Database error while updating user:', error);
    return new Response('Database error', { status: 500 });
  }
};

export const DeleteUser = async (clerkId: string) => {
  try {
    await connectToDatabase();
    const deletedUser = await User.findOneAndDelete({ clerkId });
    return JSON.parse(JSON.stringify(deletedUser));
  } catch (error) {
    console.error('Database error while deleting user:', error);
    return new Response('Database error', { status: 500 });
  }
};

export const isAdmin = async (clerkId: string): Promise<boolean> => {
  await connectToDatabase();
  const user = await User.findOne({ clerkId });
  return user?.isAdmin || false;
};

export const getCurrentUser = async (): Promise<IUser | null> => {
  const { userId } = await auth();
  if (!userId) return null;

  await connectToDatabase();
  const user = await User.findOne({ clerkId: userId }).lean<IUser>();

  return user || null;
};

export const checkIsAdmin = async (): Promise<boolean> => {
  const user = await getCurrentUser();
  return user?.isAdmin === true;
};

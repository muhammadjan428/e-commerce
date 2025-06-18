'use server';

import { connectToDatabase } from '@/lib/mongoose';
import { Category } from '../models/category.model';
import { revalidatePath } from 'next/cache';

export type CategoryType = {
    _id: string;
    name: string;
    slug: string;
    createdAt?: string;
  };
  
  
  export const createCategory = async (name: string) => {
    try {
      await connectToDatabase();
  
      const slug = name.toLowerCase().replace(/\s+/g, '-');
      const existing = await Category.findOne({ slug });
  
      if (existing) throw new Error('Category already exists');
  
      const newCategory = await Category.create({ name, slug });
  
      revalidatePath('/categories');
  
      return {
        _id: newCategory._id.toString(),
        name: newCategory.name,
        slug: newCategory.slug,
        createdAt: newCategory.createdAt?.toISOString(),
      };
    } catch (error) {
      throw new Error((error as Error).message);
    }
  };


export const getAllCategories = async (): Promise<CategoryType[]> => {
    try {
      await connectToDatabase();
  
      const categories = await Category.find().sort({ createdAt: -1 }).lean();
  
      // Convert _id and createdAt manually
      const plainCategories = categories.map((cat: any) => ({
        _id: cat._id.toString(),
        name: cat.name,
        slug: cat.slug,
        createdAt: cat.createdAt?.toISOString(),
      }));
  
      return plainCategories;
    } catch (error) {
      console.error('Failed to fetch categories', error);
      return [];
    }
  };
  
export const updateCategory = async (id: string, name: string) => {
  try {
    await connectToDatabase();
    const slug = name.toLowerCase().replace(/\s+/g, '-');
    await Category.findByIdAndUpdate(id, { name, slug });
    revalidatePath('/categories');
  } catch (error) {
    throw new Error('Failed to update category');
  }
};

export const deleteCategory = async (id: string) => {
  try {
    await connectToDatabase();
    await Category.findByIdAndDelete(id);
    revalidatePath('/categories');
  } catch (error) {
    throw new Error('Failed to delete category');
  }
};
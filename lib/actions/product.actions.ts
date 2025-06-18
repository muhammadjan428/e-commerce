'use server';

import Product from '@/lib/models/product.model';
import { connectToDatabase } from '@/lib/mongoose';
// import { revalidatePath } from 'next/cache';

export type ProductType = {
  _id: string;
  name: string;
  slug: string;
  price: number;
  category: { _id: string; name: string } | null; // Allow null category
  createdAt: string;
};

// ✅ GET ALL PRODUCTS with pagination and category filter
export const getAllProducts = async (
  page = 1,
  limit = 6,
  categoryId?: string
): Promise<ProductType[]> => {
  await connectToDatabase();
  const skip = (page - 1) * limit;

  const query = categoryId ? { category: categoryId } : {};

  const products = await Product.find(query)
    .populate('category', 'name')
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 })
    .lean();

  return products.map((p: any) => ({
    _id: p._id.toString(),
    name: p.name,
    slug: p.slug,
    price: p.price,
    category: p.category ? {
      _id: p.category._id?.toString() || '',
      name: p.category.name || '',
    } : null, // Handle null/undefined category
    createdAt: p.createdAt?.toISOString() || '',
  }));
};

// ✅ CREATE PRODUCT
export const createProduct = async (formData: FormData) => {
  const name = formData.get('name') as string;
  const price = Number(formData.get('price'));
  const category = formData.get('category') as string;

  const slug = name.toLowerCase().replace(/\s+/g, '-');

  await connectToDatabase();

  const existing = await Product.findOne({ slug });
  if (existing) throw new Error('Product already exists');

  await Product.create({ name, slug, price, category });

  // revalidatePath('/admin/products');
};

// ✅ UPDATE PRODUCT
export const updateProduct = async (_id: string, formData: FormData) => {
  const name = formData.get('name') as string;
  const price = Number(formData.get('price'));
  const category = formData.get('category') as string;

  const slug = name.toLowerCase().replace(/\s+/g, '-');

  await connectToDatabase();
  await Product.findByIdAndUpdate(_id, { name, slug, price, category });

  // revalidatePath('/admin/products');
};

// ✅ DELETE PRODUCT
export const deleteProduct = async (_id: string) => {
  await connectToDatabase();
  await Product.findByIdAndDelete(_id);
  // revalidatePath('/admin/products');
};
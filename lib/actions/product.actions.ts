'use server';

import Product from '../models/product.model';
import { connectToDatabase } from '@/lib/mongoose';
// import { revalidatePath } from 'next/cache';

export type ProductType = {
  _id: string;
  name: string;
  slug: string;
  price: number;
  category: { _id: string; name: string } | null;
  images?: string[]; // Add images to the type
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
    images: p.images || [], // Include images
    category: p.category ? {
      _id: p.category._id?.toString() || '',
      name: p.category.name || '',
    } : null,
    createdAt: p.createdAt?.toISOString() || '',
  }));
};

// ✅ CREATE PRODUCT - FIXED TO HANDLE IMAGES
export const createProduct = async (formData: FormData) => {
  const name = formData.get('name') as string;
  const price = Number(formData.get('price'));
  const category = formData.get('category') as string;
  
  // ✅ FIXED: Get all image URLs from FormData
  const images = formData.getAll('images') as string[];

  console.log('Creating product with images:', images); // Debug log

  const slug = name.toLowerCase().replace(/\s+/g, '-');

  await connectToDatabase();

  const existing = await Product.findOne({ slug });
  if (existing) throw new Error('Product already exists');

  // ✅ FIXED: Include images in the creation
  const newProduct = await Product.create({ 
    name, 
    slug, 
    price, 
    category, 
    images // Add images array
  });

  console.log('Product created with images:', newProduct.images); // Debug log

  // revalidatePath('/admin/products');
};

// ✅ UPDATE PRODUCT - FIXED TO HANDLE IMAGES
export const updateProduct = async (_id: string, formData: FormData) => {
  const name = formData.get('name') as string;
  const price = Number(formData.get('price'));
  const category = formData.get('category') as string;
  
  // ✅ FIXED: Get all image URLs from FormData
  const images = formData.getAll('images') as string[];

  console.log('Updating product with images:', images); // Debug log

  const slug = name.toLowerCase().replace(/\s+/g, '-');

  await connectToDatabase();
  
  // ✅ FIXED: Include images in the update
  const updatedProduct = await Product.findByIdAndUpdate(_id, { 
    name, 
    slug, 
    price, 
    category, 
    images // Add images array
  });

  console.log('Product updated with images:', updatedProduct?.images); // Debug log

  // revalidatePath('/admin/products');
};

// ✅ DELETE PRODUCT
export const deleteProduct = async (_id: string) => {
  await connectToDatabase();
  await Product.findByIdAndDelete(_id);
  // revalidatePath('/admin/products');
};

export const getProductById = async (id: string) => {
  try {
    await connectToDatabase();

    const product = await Product.findById(id).populate('category');

    if (!product) return undefined;

    return {
      _id: product._id.toString(),
      name: product.name,
      price: product.price,
      images: product.images || [], // Include images
      category: {
        _id: product.category?._id?.toString() || '',
      },
    };
  } catch (error) {
    console.error('Error in getProductById:', error);
    throw new Error('Failed to fetch product by ID');
  }
};
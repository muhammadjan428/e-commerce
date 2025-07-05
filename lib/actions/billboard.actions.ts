'use server';

import { connectToDatabase } from '../mongoose';
import { Billboard } from '@/lib/models/billboard.model';
import { Category } from '@/lib/models/category.model';
import { BillboardSchema, type BillboardFormData } from '@/lib/validations/billboard.validation';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// Create a new billboard
export async function createBillboard(data: BillboardFormData) {
  try {
    await connectToDatabase();

    const validatedData = BillboardSchema.parse(data);

    const categoryExists = await Category.findById(validatedData.category);
    if (!categoryExists) {
      throw new Error('Category not found');
    }

    const billboard = await Billboard.create(validatedData);

    revalidatePath('/admin/billboards');

    return {
      success: true,
      billboard: JSON.parse(JSON.stringify(billboard)), // ✅ This is correct
    };
  } catch (error: any) {
    console.error('Error creating billboard:', error);
    return {
      success: false,
      error: error.message || 'Failed to create billboard',
    };
  }
}


// Get all billboards with pagination
export async function getAllBillboards(page: number = 1, limit: number = 10) {
  try {
    await connectToDatabase();

    const skip = (page - 1) * limit;

    const billboards = await Billboard
      .find()
      .populate('category', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Billboard.countDocuments();
    const totalPages = Math.ceil(total / limit);

    return {
      billboards: JSON.parse(JSON.stringify(billboards)),
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: total,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  } catch (error) {
    console.error('Error fetching billboards:', error);
    return { billboards: [], pagination: null };
  }
}

// Get billboards by category
export async function getBillboardsByCategory(categoryId: string) {
  try {
    await connectToDatabase();

    const billboards = await Billboard
      .find({ category: categoryId, isActive: true })
      .populate('category', 'name')
      .sort({ createdAt: -1 })
      .lean();

    return JSON.parse(JSON.stringify(billboards));
  } catch (error) {
    console.error('Error fetching billboards by category:', error);
    return [];
  }
}

// Get active billboards for public display
export async function getActiveBillboards() {
  try {
    await connectToDatabase();

    const billboards = await Billboard
      .find({ isActive: true })
      .populate('category', 'name')
      .sort({ createdAt: -1 })
      .lean();

    return JSON.parse(JSON.stringify(billboards));
  } catch (error) {
    console.error('Error fetching active billboards:', error);
    return [];
  }
}

// Get single billboard by ID
export async function getBillboardById(id: string) {
  try {
    await connectToDatabase();

    const billboard = await Billboard
      .findById(id)
      .populate('category', 'name')
      .lean();

    if (!billboard) {
      throw new Error('Billboard not found');
    }

    return JSON.parse(JSON.stringify(billboard));
  } catch (error) {
    console.error('Error fetching billboard:', error);
    return null;
  }
}

// Update billboard
export async function updateBillboard(id: string, data: BillboardFormData) {
  try {
    await connectToDatabase();

    // Validate the data
    const validatedData = BillboardSchema.parse(data);

    // Check if category exists
    const categoryExists = await Category.findById(validatedData.category);
    if (!categoryExists) {
      throw new Error('Category not found');
    }

    const billboard = await Billboard.findByIdAndUpdate(
      id,
      validatedData,
      { new: true, runValidators: true }
    );

    if (!billboard) {
      throw new Error('Billboard not found');
    }

    revalidatePath('/admin/billboards');
    return { 
      success: true, 
      billboard: JSON.parse(JSON.stringify(billboard)) // ✅ Fixed here
    };
  } catch (error: any) {
    console.error('Error updating billboard:', error);
    return { 
      success: false, 
      error: error.message || 'Failed to update billboard' 
    };
  }
}

// Delete billboard
export async function deleteBillboard(id: string) {
  try {
    await connectToDatabase();

    const billboard = await Billboard.findByIdAndDelete(id);

    if (!billboard) {
      throw new Error('Billboard not found');
    }

    revalidatePath('/admin/billboards');
    return { success: true };
  } catch (error: any) {
    console.error('Error deleting billboard:', error);
    return { 
      success: false, 
      error: error.message || 'Failed to delete billboard' 
    };
  }
}

// Toggle billboard active status
export async function toggleBillboardStatus(id: string) {
  try {
    await connectToDatabase();

    const billboard = await Billboard.findById(id);
    
    if (!billboard) {
      throw new Error('Billboard not found');
    }

    billboard.isActive = !billboard.isActive;
    await billboard.save();

    revalidatePath('/admin/billboards');
    return { 
      success: true, 
      billboard: JSON.parse(JSON.stringify(billboard)) // ✅ Fixed here
    };
  } catch (error: any) {
    console.error('Error toggling billboard status:', error);
    return { 
      success: false, 
      error: error.message || 'Failed to toggle billboard status' 
    };
  }
}

// Add this to billboard.actions.ts for better image management

import { UTApi } from "uploadthing/server";

const utapi = new UTApi();

// Helper function to extract file key from UploadThing URL
function extractFileKey(url: string): string | null {
  try {
    const urlParts = url.split('/');
    return urlParts[urlParts.length - 1];
  } catch {
    return null;
  }
}

// Enhanced delete function that also removes the image from UploadThing
export async function deleteBillboardWithImage(id: string) {
  try {
    await connectToDatabase();

    const billboard = await Billboard.findById(id);
    if (!billboard) {
      throw new Error('Billboard not found');
    }

    // Extract file key and delete from UploadThing
    if (billboard.imageUrl) {
      const fileKey = extractFileKey(billboard.imageUrl);
      if (fileKey) {
        try {
          await utapi.deleteFiles([fileKey]);
        } catch (error) {
          console.warn('Failed to delete image from UploadThing:', error);
        }
      }
    }

    // Delete billboard from database
    await Billboard.findByIdAndDelete(id);

    revalidatePath('/admin/billboards');
    return { success: true };
  } catch (error: any) {
    console.error('Error deleting billboard:', error);
    return { 
      success: false, 
      error: error.message || 'Failed to delete billboard' 
    };
  }
}
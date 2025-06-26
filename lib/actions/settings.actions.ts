'use server';

import { auth } from '@clerk/nextjs/server';
import { connectToDatabase } from '@/lib/mongoose';
import { Settings } from '../models/settings.model';
import { checkIsAdmin } from './users.actions';
import { revalidatePath } from 'next/cache';

export interface SettingsType {
  _id: string;
  taxRate: number;
  shippingRate: number;
  freeShippingThreshold: number;
  maintenanceMode: boolean;
  maxCartItems: number;
  contactEmail: string;
  contactPhone: string;
  socialMedia: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
  emailSettings: {
    orderConfirmation: boolean;
    shippingUpdates: boolean;
    promotionalEmails: boolean;
  };
  createdAt: string;
  updatedAt: string;
}



// Get current settings
export const getSettings = async (): Promise<SettingsType | null> => {
  try {
    await connectToDatabase();

    const settings = await Settings.findOne().lean() as any;
    
    if (!settings) {
      // Return default settings if none exist
      return {
        _id: '',
        taxRate: 8.5,
        shippingRate: 5.99,
        freeShippingThreshold: 50,
        maintenanceMode: false,
        maxCartItems: 50,
        contactEmail: 'contact@store.com',
        contactPhone: '+1-234-567-8900',
        socialMedia: {},
        emailSettings: {
          orderConfirmation: true,
          shippingUpdates: true,
          promotionalEmails: false,
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }

    return {
      _id: settings._id.toString(),
      taxRate: settings.taxRate,
      shippingRate: settings.shippingRate,
      freeShippingThreshold: settings.freeShippingThreshold,
      maintenanceMode: settings.maintenanceMode,
      maxCartItems: settings.maxCartItems,
      contactEmail: settings.contactEmail,
      contactPhone: settings.contactPhone,
      socialMedia: settings.socialMedia || {},
      emailSettings: settings.emailSettings || {
        orderConfirmation: true,
        shippingUpdates: true,
        promotionalEmails: false,
      },
      createdAt: settings.createdAt?.toISOString() || '',
      updatedAt: settings.updatedAt?.toISOString() || '',
    };
  } catch (error) {
    console.error('Error fetching settings:', error);
    return null;
  }
};

// Update settings (Admin only)
export const updateSettings = async (settingsData: Partial<SettingsType>) => {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      throw new Error('User not authenticated');
    }

    // Check if user is admin
    const isAdminUser = await checkIsAdmin();
    if (!isAdminUser) {
      throw new Error('Unauthorized: Admin access required');
    }

    await connectToDatabase();

    // Remove _id and timestamps from update data
    const { _id, createdAt, updatedAt, ...updateData } = settingsData;

    const settings = await Settings.findOneAndUpdate(
      {}, // Find any settings document (should be only one)
      { $set: updateData },
      { 
        new: true, 
        upsert: true, // Create if doesn't exist
        runValidators: true 
      }
    );

    revalidatePath('/admin/settings');
    revalidatePath('/');

    return {
      success: true,
      message: 'Settings updated successfully',
      data: {
        _id: settings._id.toString(),
        ...updateData,
        updatedAt: new Date().toISOString(),
      }
    };
  } catch (error) {
    console.error('Error updating settings:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to update settings');
  }
};

// Get public settings (for frontend use)
// Get public settings (for frontend use)
export const getPublicSettings = async () => {
    try {
      await connectToDatabase();
  
      const settings = await Settings.findOne().select(
        'taxRate shippingRate freeShippingThresholdy contactEmail contactPhone socialMedia'
      ).lean() as any;
  
      if (!settings) {
        return {
          taxRate: 8.5,
          shippingRate: 5.99,
          freeShippingThreshold: 50,
          maxCartItems: 50,
          contactEmail: 'contact@store.com',
          contactPhone: '+1-234-567-8900',
          socialMedia: {},
        };
      }
  
      return {
        taxRate: settings.taxRate,
        shippingRate: settings.shippingRate,
        freeShippingThreshold: settings.freeShippingThreshold,
        maxCartItems: settings.maxCartItems,
        contactEmail: settings.contactEmail,
        contactPhone: settings.contactPhone,
        socialMedia: settings.socialMedia || {},
      };
    } catch (error) {
      console.error('Error fetching public settings:', error);
      return null;
    }
  };


// Reset settings to default (Admin only)
export const resetSettings = async () => {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      throw new Error('User not authenticated');
    }

    const isAdminUser = await checkIsAdmin();
    if (!isAdminUser) {
      throw new Error('Unauthorized: Admin access required');
    }

    await connectToDatabase();

    const defaultSettings = {
      taxRate: 8.5,
      shippingRate: 5.99,
      freeShippingThreshold: 50,
      maxCartItems: 50,
      contactEmail: 'muhammadjanfullstack@gmail.com',
      contactPhone: '+92-348-096-7184',
      socialMedia: {
        facebook: 'https://www.facebook.com/syedmuhammad.jan.79',
        twitter: 'https://x.com/Muhammad_Jan11',
        instagram: 'https://www.instagram.com/syedmuhammadjan/',
        linkedin: 'https://www.linkedin.com/in/muhammad-jan-b247092a0/'
      },
      emailSettings: {
        orderConfirmation: true,
        shippingUpdates: true,
        promotionalEmails: false,
      },
    };

    await Settings.findOneAndUpdate(
      {},
      { $set: defaultSettings },
      { upsert: true }
    );

    revalidatePath('/admin/settings');
    revalidatePath('/');

    return {
      success: true,
      message: 'Settings reset to default successfully'
    };
  } catch (error) {
    console.error('Error resetting settings:', error);
    throw new Error('Failed to reset settings');
  }
};
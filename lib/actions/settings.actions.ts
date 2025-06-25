'use server';

import { auth } from '@clerk/nextjs/server';
import { connectToDatabase } from '@/lib/mongoose';
import { Settings } from '../models/settings.model';
import { checkIsAdmin } from './users.actions';
import { revalidatePath } from 'next/cache';

export interface SettingsType {
  _id: string;
  siteName: string;
  siteDescription: string;
  currency: string;
  currencySymbol: string;
  taxRate: number;
  shippingRate: number;
  freeShippingThreshold: number;
  maintenanceMode: boolean;
  allowGuestCheckout: boolean;
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
        siteName: 'My E-commerce Store',
        siteDescription: 'Your one-stop shop for amazing products',
        currency: 'USD',
        currencySymbol: '$',
        taxRate: 8.5,
        shippingRate: 5.99,
        freeShippingThreshold: 50,
        maintenanceMode: false,
        allowGuestCheckout: true,
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
      siteName: settings.siteName,
      siteDescription: settings.siteDescription,
      currency: settings.currency,
      currencySymbol: settings.currencySymbol,
      taxRate: settings.taxRate,
      shippingRate: settings.shippingRate,
      freeShippingThreshold: settings.freeShippingThreshold,
      maintenanceMode: settings.maintenanceMode,
      allowGuestCheckout: settings.allowGuestCheckout,
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
        'siteName siteDescription currency currencySymbol taxRate shippingRate freeShippingThreshold maintenanceMode allowGuestCheckout maxCartItems contactEmail contactPhone socialMedia'
      ).lean() as any;
  
      if (!settings) {
        return {
          siteName: 'My E-commerce Store',
          siteDescription: 'Your one-stop shop for amazing products',
          currency: 'USD',
          currencySymbol: '$',
          taxRate: 8.5,
          shippingRate: 5.99,
          freeShippingThreshold: 50,
          maintenanceMode: false,
          allowGuestCheckout: true,
          maxCartItems: 50,
          contactEmail: 'contact@store.com',
          contactPhone: '+1-234-567-8900',
          socialMedia: {},
        };
      }
  
      return {
        siteName: settings.siteName,
        siteDescription: settings.siteDescription,
        currency: settings.currency,
        currencySymbol: settings.currencySymbol,
        taxRate: settings.taxRate,
        shippingRate: settings.shippingRate,
        freeShippingThreshold: settings.freeShippingThreshold,
        maintenanceMode: settings.maintenanceMode,
        allowGuestCheckout: settings.allowGuestCheckout,
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
      siteName: 'My E-commerce Store',
      siteDescription: 'Your one-stop shop for amazing products',
      currency: 'USD',
      currencySymbol: '$',
      taxRate: 8.5,
      shippingRate: 5.99,
      freeShippingThreshold: 50,
      maintenanceMode: false,
      allowGuestCheckout: true,
      maxCartItems: 50,
      contactEmail: 'contact@store.com',
      contactPhone: '+1-234-567-8900',
      socialMedia: {},
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

// Toggle maintenance mode (Admin only)
export const toggleMaintenanceMode = async (enabled: boolean) => {
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

    await Settings.findOneAndUpdate(
      {},
      { $set: { maintenanceMode: enabled } },
      { upsert: true }
    );

    revalidatePath('/admin/settings');
    revalidatePath('/');

    return {
      success: true,
      message: `Maintenance mode ${enabled ? 'enabled' : 'disabled'} successfully`
    };
  } catch (error) {
    console.error('Error toggling maintenance mode:', error);
    throw new Error('Failed to toggle maintenance mode');
  }
};
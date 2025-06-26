import mongoose, { Schema, Document, models } from 'mongoose';

export interface ISettings extends Document {
  taxRate: number;
  shippingRate: number;
  freeShippingThreshold: number;
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
  createdAt: Date;
  updatedAt: Date;
}

const SettingsSchema = new Schema<ISettings>(
  {

    taxRate: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
      default: 8.5,
    },
    shippingRate: {
      type: Number,
      required: true,
      min: 0,
      default: 5.99,
    },
    freeShippingThreshold: {
      type: Number,
      required: true,
      min: 0,
      default: 50,
    }, 
    contactEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      default: 'contact@store.com',
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'],
    },
    contactPhone: {
      type: String,
      required: true,
      trim: true,
      default: '+1-234-567-8900',
    },
    socialMedia: {
      facebook: {
        type: String,
        trim: true,
        validate: {
          validator: function(v: string) {
            return !v || /^https?:\/\/(www\.)?facebook\.com\//.test(v);
          },
          message: 'Please enter a valid Facebook URL',
        },
      },
      twitter: {
        type: String,
        trim: true,
        validate: {
          validator: function(v: string) {
            return !v || /^https?:\/\/(www\.)?twitter\.com\//.test(v) || /^https?:\/\/(www\.)?x\.com\//.test(v);
          },
          message: 'Please enter a valid Twitter/X URL',
        },
      },
      instagram: {
        type: String,
        trim: true,
        validate: {
          validator: function(v: string) {
            return !v || /^https?:\/\/(www\.)?instagram\.com\//.test(v);
          },
          message: 'Please enter a valid Instagram URL',
        },
      },
      linkedin: {
        type: String,
        trim: true,
        validate: {
          validator: function(v: string) {
            return !v || /^https?:\/\/(www\.)?linkedin\.com\//.test(v);
          },
          message: 'Please enter a valid LinkedIn URL',
        },
      },
    },
    emailSettings: {
      orderConfirmation: {
        type: Boolean,
        default: true,
      },
      shippingUpdates: {
        type: Boolean,
        default: true,
      },
      promotionalEmails: {
        type: Boolean,
        default: false,
      },
    },
  },
  {
    timestamps: true,
  }
);

export const Settings = models.Settings || mongoose.model<ISettings>('Settings', SettingsSchema);
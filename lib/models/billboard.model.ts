import mongoose, { Schema, Document, models } from 'mongoose';
import { ICategory } from './category.model';

export interface IBillboard extends Document {
  _id: string;
  title: string;
  description?: string;
  imageUrl: string;
  category: ICategory['_id'];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const BillboardSchema = new Schema<IBillboard>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    imageUrl: {
      type: String,
      required: [true, 'Image URL is required'],
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category is required'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for better query performance
BillboardSchema.index({ category: 1, isActive: 1 });
BillboardSchema.index({ createdAt: -1 });

export const Billboard = models.Billboard || mongoose.model<IBillboard>('Billboard', BillboardSchema);
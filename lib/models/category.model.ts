import mongoose, { Schema, Document, models } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  slug: string;
  createdAt: Date;
}

const CategorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const Category = models.Category || mongoose.model<ICategory>('Category', CategorySchema);
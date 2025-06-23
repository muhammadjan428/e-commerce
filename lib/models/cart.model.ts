import mongoose, { Schema, Document, models } from 'mongoose';

export interface ICart extends Document {
  productId: mongoose.Types.ObjectId;
  userId: string; // Clerk user ID
  quantity: number;
  price: number;
  createdAt: Date;
  updatedAt: Date;
}

const CartSchema = new Schema<ICart>(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

CartSchema.index({ userId: 1, productId: 1 }, { unique: true });

export const Cart = models.Cart || mongoose.model<ICart>('Cart', CartSchema);
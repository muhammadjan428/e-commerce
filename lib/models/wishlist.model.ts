import mongoose, { Schema, model, models, Document } from 'mongoose';

export interface IWishlist extends Document {
  userId: string; // Clerk user ID
  productId: Schema.Types.ObjectId;
  createdAt: Date;
}

const WishlistSchema = new Schema<IWishlist>({
  userId: { type: String, required: true },
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
}, { 
  timestamps: true 
});

// Create compound index to prevent duplicate entries
WishlistSchema.index({ userId: 1, productId: 1 }, { unique: true });

const Wishlist = models.Wishlist || model<IWishlist>('Wishlist', WishlistSchema);

export default Wishlist;
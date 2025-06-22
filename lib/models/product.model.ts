import mongoose, { Schema, model, models } from 'mongoose';

const ProductSchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    price: { type: Number, required: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    images: [{ type: String }],
  },
  {
    timestamps: true,
  }
);

// ✅ Prevent re-compiling model during hot reloads
const Product = models.Product || model('Product', ProductSchema);

export default Product;
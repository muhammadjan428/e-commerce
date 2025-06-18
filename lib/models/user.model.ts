import { Schema, model, models, Document } from 'mongoose';

export interface IUser extends Document {
  clerkId: string;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  image?: string;
  isAdmin?: boolean;
}

const UserSchema = new Schema<IUser>({
  clerkId: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  image: String,
  isAdmin: { type: Boolean, default: false },
}, { timestamps: true });

const User = models.User || model<IUser>('User', UserSchema);
export default User;
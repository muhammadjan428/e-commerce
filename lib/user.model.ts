import mongoose, { Schema, model, models } from 'mongoose';

const UserSchema = new Schema({
  clerkId: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  first_name: { 
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true 
  },
  image: String,
}, { timestamps: true });

const User = models.User || model('User', UserSchema);
export default User;
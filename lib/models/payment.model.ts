import mongoose from 'mongoose';

export interface IPayment extends mongoose.Document {
  email: string;
  name: string;
  amount: number;
  location: string;
  userId: string;
  createdAt: Date;
}

const PaymentSchema = new mongoose.Schema<IPayment>({
  email: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Payment = mongoose.models.Payment || mongoose.model<IPayment>('Payment', PaymentSchema);
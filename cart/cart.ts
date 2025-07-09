import { ObjectId } from 'mongodb';

export interface CartItem {
  _id: string;
  productId: string;
  userId: string;
  quantity: number;
  price: number;
  product: {
    _id: string;
    name: string;
    slug: string;
    price: number;
    images: string[];
    category?: {
      _id: string;
      name: string;
    };
  };
  createdAt: string;
  updatedAt: string;
}

export interface CartSummary {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

export interface AddToCartData {
  productId: string;
  quantity?: number;
}

export interface UpdateCartData {
  cartItemId: string;
  quantity: number;
}

export interface PaymentData {
  id: string;
  email: string;
  name: string;
  amount: number;
  location: string;
  userId: string;
  createdAt: Date;
}
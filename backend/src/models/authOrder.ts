// src/models/authOrder.ts

import { Schema, model, Document, Types } from "mongoose";

// Interfața pentru produsul comandat
interface OrderProduct {
  _id?: string;
  name: string;
  quantity: number;
  price: number;
  discount?: number;
  image?: string;
  [key: string]: any; // Pentru alte proprietăți posibile
}

// Interfața pentru documentul AuthOrder
export interface IAuthOrder extends Document {
  orderId: Types.ObjectId;
  sellerId: Types.ObjectId;
  products: OrderProduct[];
  price: number;
  payment_status: 'paid' | 'unpaid' | 'pending';
  shippingInfo: string;
  delivery_status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  date: string;
  createdAt: Date;
  updatedAt: Date;
}

// Schema pentru comenzile autorizate
const authSchema = new Schema({
  orderId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  sellerId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  products: {
    type: Array,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  payment_status: {
    type: String,
    required: true
  },
  shippingInfo: {
    type: String,
    required: true
  },
  delivery_status: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  }
}, { timestamps: true });

// Modelul pentru comenzile autorizate
const AuthOrder = model<IAuthOrder>('authorOrders', authSchema);

export default AuthOrder;
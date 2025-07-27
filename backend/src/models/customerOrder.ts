// src/models/customerOrder.ts

import { Schema, model, Document, Types } from "mongoose";

// Interfața pentru un produs din comandă
interface OrderProduct {
  _id?: string;
  name: string;
  quantity: number;
  price: number;
  discount?: number;
  image?: string;
  sellerId?: string;
  [key: string]: any; // Pentru alte proprietăți posibile
}

// Interfața pentru informațiile de livrare
interface ShippingInfo {
  name: string;
  address: string;
  phone: string;
  city: string;
  postalCode?: string;
  country?: string;
  [key: string]: any; // Pentru alte proprietăți posibile
}

// Interfața pentru documentul CustomerOrder
export interface ICustomerOrder extends Document {
  customerId: Types.ObjectId;
  products: OrderProduct[];
  price: number;
  payment_status: 'paid' | 'unpaid' | 'pending';
  shippingInfo: ShippingInfo;
  delivery_status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  date: string;
  createdAt: Date;
  updatedAt: Date;
}

// Schema pentru comenzile clientului
const customerOrderSchema = new Schema({
  customerId: {
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
    type: Object,
    required: true
  },
  delivery_status: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
}, { timestamps: true });

// Modelul pentru comenzile clientului
const CustomerOrder = model<ICustomerOrder>('customerOrders', customerOrderSchema);

export default CustomerOrder;
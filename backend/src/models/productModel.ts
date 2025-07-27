// src/models/productModel.ts - VERSIUNEA ACTUALIZATĂ

import { Schema, model, Document, Types } from "mongoose";

// Definim interfața pentru imaginile produsului
interface ProductImage {
  url: string;
  public_id?: string;
  [key: string]: any;
}

// Interfața pentru documentul Product - ACTUALIZATĂ
export interface IProduct extends Document {
  _id: Types.ObjectId; // Tipizare explicită pentru _id
  sellerId: Types.ObjectId;
  name: string;
  slug: string;
  category: string;
  brand: string;
  price: number;
  stock: number;
  discount: number;
  description: string;
  shopName: string;
  images: ProductImage[] | string[]; // Permite ambele tipuri
  rating: number;
  createdAt: Date;
  updatedAt: Date;
}

// Schema pentru produse
const productSchema = new Schema({
  sellerId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  brand: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  stock: {
    type: Number,
    required: true
  },
  discount: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  shopName: {
    type: String,
    required: true
  },
  images: {
    type: Array,
    required: true
  },
  rating: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

// Adăugăm index text pentru căutare
productSchema.index({
  name: 'text',
  category: 'text',
  brand: 'text',
  description: 'text'
}, {
  weights: {
    name: 5,
    category: 4,
    brand: 3,
    description: 2
  }
});

// Modelul pentru produse
const Product = model<IProduct>('products', productSchema);

export default Product;
// src/models/wishlistModel.ts
import { Schema, model, Document } from "mongoose";

// Interface pentru documentul Wishlist (bazată pe modelul JavaScript original)
export interface IWishlist extends Document {
  userId: string;
  productId: string;
  name: string;
  price: number;
  slug: string;
  discount: number;
  image: string;
  rating: number;
  createdAt: Date;
  updatedAt: Date;
}

// Schema pentru lista de dorințe (identică cu cea din JavaScript)
const wishlistSchema = new Schema({
  userId: {
    type: String,
    required: true
  },
  productId: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true 
  },
  price: {
    type: Number,
    required: true
  }, 
  slug: {
    type: String,
    required: true 
  },
  discount: {
    type: Number,
    required: true 
  },
  image: {
    type: String,
    required: true 
  },
  rating: {
    type: Number,
    default: 0 
  }
}, { 
  timestamps: true,
  collection: 'wishlists' // Menține numele colecției din JavaScript
});

// Index pentru performanță și prevenirea duplicatelor
wishlistSchema.index({ userId: 1, productId: 1 }, { unique: true });

// Modelul pentru lista de dorințe
const Wishlist = model<IWishlist>('wishlists', wishlistSchema);

export default Wishlist;
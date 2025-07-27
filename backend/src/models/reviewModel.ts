// src/models/reviewModel.ts - VERSIUNEA ACTUALIZATĂ

import { Schema, model, Document, Types } from "mongoose";

// Interfața pentru documentul Review - ACTUALIZATĂ
export interface IReview extends Document {
  _id: Types.ObjectId; // Tipizare explicită pentru _id
  productId: Types.ObjectId | string; // Permite ambele tipuri
  name: string;
  rating: number;
  review: string;
  date: string;
  createdAt: Date;
  updatedAt: Date;
}

// Schema pentru recenzii
const reviewSchema = new Schema({
  productId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    default: 0,
    min: 1,
    max: 5
  },
  review: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  }
}, { timestamps: true });

// Index pentru performanță
reviewSchema.index({ productId: 1 });
reviewSchema.index({ rating: 1 });

// Modelul pentru recenzii
const Review = model<IReview>('reviews', reviewSchema);

export default Review;
// src/models/stripeModel.ts

import { Schema, model, Document, Types } from "mongoose";

// Interfața pentru documentul Stripe
export interface IStripe extends Document {
  sellerId: Types.ObjectId;
  stripeId: string;
  code: string;
  createdAt: Date;
  updatedAt: Date;
}

// Schema pentru datele asociate cu Stripe
const stripeSchema = new Schema({
  sellerId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  stripeId: {
    type: String,
    required: true
  },
  code: {
    type: String,
    required: true
  }
}, { timestamps: true });

// Modelul pentru datele asociate cu Stripe
const Stripe = model<IStripe>('stripes', stripeSchema);

export default Stripe;
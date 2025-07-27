// src/models/sellerWallet.ts

import { Schema, model, Document } from "mongoose";

// Interfața pentru documentul SellerWallet
export interface ISellerWallet extends Document {
  sellerId: string;
  amount: number;
  month: number;
  year: number;
  createdAt: Date;
  updatedAt: Date;
}

// Schema pentru portofelul vânzătorului
const sellerWalletSchema = new Schema({
  sellerId: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  month: {
    type: Number,
    required: true
  },
  year: {
    type: Number,
    required: true
  }
}, { timestamps: true });

// Modelul pentru portofelul vânzătorului
const SellerWallet = model<ISellerWallet>('sellerWallets', sellerWalletSchema);

export default SellerWallet;
// src/models/myShopWallet.ts

import { Schema, model, Document } from "mongoose";

// Interfața pentru documentul MyShopWallet
export interface IMyShopWallet extends Document {
  amount: number;
  month: number;
  year: number;
  createdAt: Date;
  updatedAt: Date;
}

// Schema pentru portofelul magazinului
const myShopWalletSchema = new Schema({
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

// Modelul pentru portofelul magazinului
const MyShopWallet = model<IMyShopWallet>('myShopWallets', myShopWalletSchema);

export default MyShopWallet;
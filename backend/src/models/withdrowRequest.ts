// src/models/withdrawRequest.ts

import { Schema, model, Document } from "mongoose";

// Interfața pentru documentul WithdrawRequest
export interface IWithdrawRequest extends Document {
  sellerId: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  createdAt: Date;
  updatedAt: Date;
}

// Schema pentru cererile de retragere
const withdrawSchema = new Schema({
  sellerId: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    default: 'pending'
  }
}, { timestamps: true });

// Modelul pentru cererile de retragere
const WithdrawRequest = model<IWithdrawRequest>('withdrowRequest', withdrawSchema);

export default WithdrawRequest;
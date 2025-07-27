// models/chat/sellerCustomerMessage.ts - VERSIUNEA CORECTATĂ
import { Schema, model, Document } from "mongoose";

export interface ISellerCustomerMessage extends Document {
  senderName: string;
  senderId: string;
  receverId: string;
  message: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

const sellerCustomerMsgSchema = new Schema({
  senderName: {
    type: String,
    required: true
  },
  senderId: {
    type: String,
    required: true
  },
  receverId: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  status: {
    type: String,
    default: 'unseen'
  }
}, { timestamps: true });

const SellerCustomerMessage = model<ISellerCustomerMessage>('seller_customer_msgs', sellerCustomerMsgSchema);


export default SellerCustomerMessage;
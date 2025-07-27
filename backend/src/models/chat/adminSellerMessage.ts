//models\chat\adminSellerMessage.ts
import { Schema, model, Document } from "mongoose";

export interface IAdminSellerMessage extends Document {
  senderName: string;
  senderId: string;
  receverId: string;
  message: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

const adminSellerMsgSchema = new Schema({
  senderName: {
    type: String,
    required: true
  },
  senderId: {
    type: String,
    default: ''
  },
  receverId: {
    type: String,
    default: ''
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

const AdminSellerMessage = model<IAdminSellerMessage>('seller_admin_messages', adminSellerMsgSchema);


export default AdminSellerMessage;
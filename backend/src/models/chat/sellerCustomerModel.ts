//src\models\chat\sellerCustomerModel.ts
import { Schema, model, Document } from "mongoose";

interface Friend {
  fdId: string;
  name?: string;
  image?: string;
  [key: string]: any;
}

export interface ISellerCustomer extends Document {
  myId: string;
  myFriends: Friend[];
  createdAt: Date;
  updatedAt: Date;
}

const sellerCustomerSchema = new Schema({
  myId: {
    type: String,
    required: true
  },
  myFriends: {
    type: Array,
    default: []
  }
}, { timestamps: true });

const SellerCustomer = model<ISellerCustomer>('seller_customers', sellerCustomerSchema);

// ADAUGĂ ACEST EXPORT DEFAULT
export default SellerCustomer;
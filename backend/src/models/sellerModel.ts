// src/models/sellerModel.ts

import { Schema, model, Document } from "mongoose";

// Interfața pentru informațiile despre magazin
interface ShopInfo {
  shopName?: string;
  address?: string;
  phone?: string;
  district?: string;
  division?: string;
  zipCode?: string;
  [key: string]: any; // Pentru alte proprietăți posibile
}

// Interfața pentru documentul Seller
export interface ISeller extends Document {
  name: string;
  email: string;
  password: string;
  role: string;
  status: 'pending' | 'active' | 'inactive' | 'deactive';
  payment: 'active' | 'inactive';
  method: string;
  image: string;
  shopInfo: ShopInfo;
  createdAt: Date;
  updatedAt: Date;
}

// Schema pentru vânzători
const sellerSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true,
    select: false
  },
  role: {
    type: String,
    default: 'seller'
  },
  status: {
    type: String,
    default: 'pending'
  },
  payment: {
    type: String,
    default: 'inactive'
  },
  method: {
    type: String,
    required: true
  },
  image: {
    type: String,
    default: ''
  },
  shopInfo: {
    type: Object,
    default: {}
  },
}, { timestamps: true });

// Adăugăm index text pentru căutare
sellerSchema.index({
  name: 'text',
  email: 'text',
}, {
  weights: {
    name: 5,
    email: 4,
  }
});

// Modelul pentru vânzători
const Seller = model<ISeller>('sellers', sellerSchema);

export default Seller;

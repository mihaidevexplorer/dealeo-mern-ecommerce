// src/models/customerModel.ts

import { Schema, model, Document } from "mongoose";

// Interfața pentru documentul Customer
export interface ICustomer extends Document {
  name: string;
  email: string;
  password: string;
  method: string;
  createdAt: Date;
  updatedAt: Date;
}

// Schema pentru clienți
const customerSchema = new Schema({
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
  method: {
    type: String,
    required: true
  }
}, { timestamps: true });

// Modelul pentru clienți
const Customer = model<ICustomer>('customers', customerSchema);

export default Customer;
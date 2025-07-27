// src/models/adminModel.ts

import { Schema, model, Document } from "mongoose";

// Interfața pentru documentul Admin
export interface IAdmin extends Document {
  name: string;
  email: string;
  password: string;
  image: string;
  role: string;
}

// Schema pentru administratori
const adminSchema = new Schema({
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
    required: true
  },
  image: {
    type: String,
    required: true
  },
  role: {
    type: String,
    default: 'admin'
  }
});

// Modelul pentru administratori
const Admin = model<IAdmin>('admins', adminSchema);

export default Admin;
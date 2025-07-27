
// src/models/bannerModel.ts

import { Schema, model, Document, Types } from "mongoose";

// Interfața pentru documentul Banner
export interface IBanner extends Document {
  productId: Types.ObjectId;
  banner: string;
  link: string;
  createdAt: Date;
  updatedAt: Date;
}

// Schema pentru bannere
const bannerSchema = new Schema({
  productId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  banner: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true
  }
}, { timestamps: true });

// Modelul pentru bannere
const Banner = model<IBanner>('banners', bannerSchema);

export default Banner;

//models\cardModel.ts

import { Schema, model, Document, Types } from "mongoose";

// Interfața pentru documentul Card (coș de cumpărături)
export interface ICard extends Document {
  userId: Types.ObjectId;
  productId: Types.ObjectId;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
}

// Schema pentru produsele din coșul de cumpărături
const cardSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  productId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  }
}, { timestamps: true });

// Modelul pentru produsele din coșul de cumpărături
const Card = model<ICard>('cardProducts', cardSchema);

export default Card;
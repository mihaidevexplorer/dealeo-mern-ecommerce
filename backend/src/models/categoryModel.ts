// src/models/categoryModel.ts - VERSIUNEA ACTUALIZATĂ
import mongoose, { Schema, model, Document, Types } from "mongoose";

// Interfața pentru documentul Category - ACTUALIZATĂ
export interface ICategory extends Document {
  _id: Types.ObjectId; // Tipizare explicită pentru _id
  name: string;
  image: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}

// Schema pentru categorii
const categorySchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  image: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true
  }
}, { timestamps: true });

// Adăugăm index text pentru căutare
categorySchema.index({
  name: 'text'
});

// Index pentru slug-ul unic este deja definit în schemă prin unique: true
// Nu mai e nevoie de categorySchema.index({ slug: 1 });

// Modelul pentru categorii
const Category = model<ICategory>('categorys', categorySchema);

export default Category;
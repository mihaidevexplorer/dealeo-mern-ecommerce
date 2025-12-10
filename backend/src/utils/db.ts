// src/utiles/db.ts
import mongoose from 'mongoose';

export const dbConnect = async (): Promise<void> => {
  const uri = process.env.DB_URL;

  console.log("DB_URL exists?", !!uri); // DEBUG

  if (!uri) {
    throw new Error("DB_URL is not defined in environment variables.");
  }

  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(uri);
    console.log("Database connected.");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    // VERY IMPORTANT: throw the error, don't swallow it
    throw error;
  }
};

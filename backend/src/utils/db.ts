// src/utiles/db.ts

import mongoose from 'mongoose';

export const dbConnect = async (): Promise<void> => {
    try {
        await mongoose.connect(process.env.DB_URL as string);
        console.log("Database connected..");
    } catch (error) {
        if (error instanceof Error) {
            console.log(error.message);
        } else {
            console.log('Unknown error occurred during database connection');
        }
    }
};
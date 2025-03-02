import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI as string;

if (!MONGO_URI) {
    throw new Error("❌ MONGO_URI is not defined in .env file");
}

export class Database {
    constructor() {
        console.log("📡 Initializing MongoDB connection...");
        this.connect();
    }

    async connect(): Promise<void> {
        try {
            await mongoose.connect(MONGO_URI, {
                serverSelectionTimeoutMS: 5000,
            });
            console.log("✅ Connected to MongoDB");
        } catch (error) {
            console.error("❌ Database connection error:", error);
            process.exit(1); 
        }
    }
}

export const db = new Database();

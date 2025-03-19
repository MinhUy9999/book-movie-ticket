// Singleton Pattern Implementation for Database Connection
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export class DatabaseSingleton {
  private static instance: DatabaseSingleton;
  private isConnected: boolean = false;

  private constructor() {
    // Private constructor to prevent instantiation
    console.log("DatabaseSingleton instance created");
  }

  public static getInstance(): DatabaseSingleton {
    if (!DatabaseSingleton.instance) {
      DatabaseSingleton.instance = new DatabaseSingleton();
    }
    return DatabaseSingleton.instance;
  }

  public async connect(): Promise<void> {
    if (this.isConnected) {
      console.log("Already connected to MongoDB");
      return;
    }

    try {
      const MONGO_URI = process.env.MONGO_URI as string;
      
      if (!MONGO_URI) {
        throw new Error("❌ MONGO_URI is not defined in .env file");
      }

      console.log("📡 Initializing MongoDB connection...");
      
      await mongoose.connect(MONGO_URI, {
        serverSelectionTimeoutMS: 5000,
      });
      
      this.isConnected = true;
      console.log("✅ Connected to MongoDB");
    } catch (error) {
      console.error("❌ Database connection error:", error);
      throw error;
    }
  }

  public async disconnect(): Promise<void> {
    if (!this.isConnected) {
      console.log("Not connected to MongoDB");
      return;
    }

    try {
      await mongoose.disconnect();
      this.isConnected = false;
      console.log("✅ Disconnected from MongoDB");
    } catch (error) {
      console.error("❌ Database disconnection error:", error);
      throw error;
    }
  }

  public isConnectedToDatabase(): boolean {
    return this.isConnected;
  }
}

// Export a default instance
export const db = DatabaseSingleton.getInstance();

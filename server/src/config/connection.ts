import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "";

const db = async (): Promise<mongoose.Connection> => {
  try {
    await mongoose.connect(
      MONGODB_URI || "mongodb://127.0.0.1:27017/googlebooks"
    );
    console.log("DB connected");
    return mongoose.connection;
  } catch (error) {
    console.error("DB connection error:", error);
    throw new Error("DB connection failed");
  }
};
export default db;

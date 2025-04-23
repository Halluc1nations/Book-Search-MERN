import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";

const connectionString =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/googlebooks";
mongoose.connect(connectionString);
const db = mongoose.connection;
//   try {
//     await mongoose.connect(
//       connectionString,
//     );
//     console.log("DB connected");
//     return mongoose.connection;
//   } catch (error) {
//     console.error("DB connection error:", error);
//     throw new Error("DB connection failed");
//   }
export default db;

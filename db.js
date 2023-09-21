import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: "./config.env" });

const connectURI = process.env.DATABASE;

const connectDB = async () => {
  try {
    await mongoose.connect(connectURI);
    console.log("Connected");
  } catch (error) {
    console.log("Error Connecting to Server");
  }
};
export default connectDB;

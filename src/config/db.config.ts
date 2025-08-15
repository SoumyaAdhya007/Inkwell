import mongoose from "mongoose";
import env from "./env.config";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${env.MONGO_URI}/${env.DB_NAME}`
    );
    console.log(
      `MongoDB Connected! Db host: ${connectionInstance.connection.host}`
    );
  } catch (error: unknown) {
    console.error(`MongoDB connection error: ${error}`);
    process.exit(1);
  }
};

export default connectDB;

import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/cms");
        console.log("MongoDB Connected Successfully");
    } catch (err) {
        console.log("MongoDB Connection Error:", err);
        process.exit(1);
    }
};

export default connectDB;

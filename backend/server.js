import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";


import authRoutes from "./routes/authRoutes.js";
import complaintRoutes from "./routes/complaintRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import departmentRoutes from "./routes/departmentRoutes.js";

dotenv.config();
const app = express();

// Connect to MongoDB
connectDB();

app.use(cors());
app.use(express.json());

// Routes

app.use("/api/auth", authRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/department", departmentRoutes);

// Root test
app.get("/", (req, res) => res.send("Backend running"));

// OpenAI API key test route
import OpenAI from "openai";

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

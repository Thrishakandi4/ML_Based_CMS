import express from "express";
import dotenv from "dotenv";
dotenv.config();

import OpenAI from "openai";
import Complaint from "../models/Complaint.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// POST /api/assistant
router.post("/", protect(), async (req, res) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  // Check for user-specific queries
  let dbInfo = "";
  const lowerMsg = message.toLowerCase();
  if (lowerMsg.includes("how many complaints") || lowerMsg.includes("my complaints count") || lowerMsg.includes("complaints i submitted")) {
    try {
      const count = await Complaint.countDocuments({ user_id: req.user.id });
      dbInfo = `The user has submitted ${count} complaints.`;
    } catch (e) {
      dbInfo = "(Error fetching complaint count.)";
    }
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful assistant for a complaint management system. If you are given extra database info, use it to answer the user's question." },
        ...(dbInfo ? [{ role: "system", content: dbInfo }] : []),
        { role: "user", content: message }
      ],
      max_tokens: 256
    });
    const reply = completion.choices[0].message.content;
    res.json({ reply });
  } catch (err) {
    res.status(500).json({ error: "OpenAI API error", details: err.message });
  }
});

export default router;

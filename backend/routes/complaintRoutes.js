import express from "express";
import {
  createComplaint,
  getUserComplaints,
  updateComplaint,
  deleteComplaint,
} from "../controllers/complaintController.js";
import { protect } from "../middleware/authMiddleware.js";

const router=express.Router();

router.post("/", protect(), createComplaint);

router.get("/:userId", protect(), getUserComplaints);

router.put("/:id", protect(), updateComplaint);

router.delete("/:id", protect(), deleteComplaint);

export default router;

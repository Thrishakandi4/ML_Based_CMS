import express from "express";
import {
  createComplaint,
  getUserComplaints,
  updateComplaint,
  deleteComplaint,
} from "../controllers/complaintController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// create complaint -> any authenticated user
router.post("/", protect(), createComplaint);

// get complaints for a user (owner or admin)
router.get("/:userId", protect(), getUserComplaints);

// update complaint (owner or admin)
router.put("/:id", protect(), updateComplaint);

// delete complaint (owner or admin)
router.delete("/:id", protect(), deleteComplaint);

export default router;

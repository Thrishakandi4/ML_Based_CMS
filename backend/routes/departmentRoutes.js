import express from "express";
import {
  getDepartmentComplaints,
  updateComplaintStatus
} from "../controllers/departmentController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Get complaints for this department
router.get("/complaints", protect(), getDepartmentComplaints);

// Update complaint status
router.put("/:id/status", protect(), updateComplaintStatus);

export default router;

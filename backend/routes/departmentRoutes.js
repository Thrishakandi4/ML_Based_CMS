import express from "express";
import {
  getDepartmentComplaints,
  updateComplaintStatus
} from "../controllers/departmentController.js";
import { protect } from "../middleware/authMiddleware.js";

const router=express.Router();

router.get("/complaints", protect(), getDepartmentComplaints);

router.put("/:id/status", protect(), updateComplaintStatus);

export default router;

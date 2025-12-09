import express from "express";
import {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  getAllDepartments,
  createDepartment,
  getAllComplaints,
  assignComplaint,
  updateComplaintStatus,
  getAnalytics,
  assignCategoriesToDepartment,
  getDepartmentCategories
} from "../controllers/adminController.js";
import { protect } from "../middleware/authMiddleware.js";
const router = express.Router();
router.use(protect(["admin"]));
router.get("/users", getAllUsers);
router.post("/users", createUser);
router.put("/users/:id", updateUser); // works for user or department based on role
router.delete("/users/:id", deleteUser); // works for user or department based on role
router.get("/departments", getAllDepartments);
router.post("/departments", createDepartment); // create department
router.post("/departments/categories", assignCategoriesToDepartment); // assign categories
router.get("/departments/:id/categories", getDepartmentCategories); // view categories
router.get("/complaints", getAllComplaints);
router.put("/complaints/:id/status", updateComplaintStatus);
router.put("/assign", assignComplaint);
router.get("/analytics", getAnalytics);
export default router;

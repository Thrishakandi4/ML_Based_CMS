// Assign categories to a department
export const assignCategoriesToDepartment = async (req, res) => {
  const { departmentId, categories } = req.body;
  if (!departmentId || !Array.isArray(categories)) {
    return res.status(400).json({ message: "Department ID and categories array required" });
  }
  try {
    await Department.findByIdAndUpdate(departmentId, { categories });
    res.json({ message: "Categories assigned successfully" });
  } catch (err) {
    return send500(res, err);
  }
};

// Get categories for a department
export const getDepartmentCategories = async (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ message: "Department ID required" });
  try {
    const dept = await Department.findById(id);
    if (!dept) return res.status(404).json({ message: "Department not found" });
    res.json({ categories: dept.categories || [] });
  } catch (err) {
    return send500(res, err);
  }
};
import User from "../models/User.js";
import Department from "../models/Department.js";
import Complaint from "../models/Complaint.js";

// Helper
const send500 = (res, err, msg = "Database error") => {
  console.log("DB ERROR:", err);
  return res.status(500).json({ error: msg });
};

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, "name email role").sort({ _id: -1 });
    // normalize id field for frontend (id instead of _id)
    const out = users.map(u => ({ id: u._id, name: u.name, email: u.email, role: u.role }));
    res.json(out);
  } catch (err) {
    return send500(res, err);
  }
};

// Create User
export const createUser = async (req, res) => {
  const { name, email, password_hash, role } = req.body;
  if (!name || !email || !role) return res.status(400).json({ message: "Missing fields" });

  try {
    const user = new User({
      name,
      email,
      password: password_hash || "",
      role
    });
    const savedUser = await user.save();
    res.json({ message: "User created", id: savedUser._id });
  } catch (err) {
    return send500(res, err);
  }
};

// Create Department
export const createDepartment = async (req, res) => {
  const { name, email, password_hash, phone, designation } = req.body;
  if (!name || !email) return res.status(400).json({ message: "Missing fields" });

  try {
    const bcrypt = (await import('bcryptjs')).default;
    const hashedPassword = await bcrypt.hash(password_hash, 10);
    const dept = new Department({
      name,
      email,
      password: hashedPassword,
      phone: phone || "",
      designation: designation || name
    });
    const savedDept = await dept.save();
    // Email notification removed
    res.json({ message: "Department created", id: savedDept._id });
  } catch (err) {
    return send500(res, err);
  }
};

// Update User / Department
export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, role, phone, designation, password_hash } = req.body;

  if (!id) return res.status(400).json({ message: "ID required" });

  try {
    if (role === "department") {
      let updateFields = {
        name,
        email,
        phone: phone || "",
        designation: designation || ""
      };
      if (password_hash) {
        const bcrypt = (await import('bcryptjs')).default;
        updateFields.password = await bcrypt.hash(password_hash, 10);
      }
      await Department.findByIdAndUpdate(id, updateFields);
      res.json({ message: "Department updated" });
    } else {
      let updateFields = {
        name,
        email,
        role
      };
      if (password_hash) {
        const bcrypt = (await import('bcryptjs')).default;
        updateFields.password = await bcrypt.hash(password_hash, 10);
      }
      await User.findByIdAndUpdate(id, updateFields);
      res.json({ message: "User updated" });
    }
  } catch (err) {
    return send500(res, err);
  }
};

// Delete User / Department
export const deleteUser = async (req, res) => {
  const { id } = req.params;
  const role = req.params.role || req.query.role;
  if (!id) return res.status(400).json({ message: "ID required" });

  try {
    if (role === "department") {
      await Department.findByIdAndDelete(id);
    } else {
      await User.findByIdAndDelete(id);
    }
    res.json({ message: `${role} deleted` });
  } catch (err) {
    return send500(res, err);
  }
};

// Get all departments
export const getAllDepartments = async (req, res) => {
  try {
    const depts = await Department.find({}).sort({ _id: -1 });
    // map to include designation (or use name as fallback if empty)
    const out = depts.map(d => ({
      id: d._id,
      name: d.name,
      email: d.email,
      designation: d.designation || d.name
    }));
    res.json(out);
  } catch (err) {
    return send500(res, err);
  }
};

// Get all complaints
// inside adminController.js — replace getAllComplaints implementation with this

// Get all complaints
export const getAllComplaints = async (req, res) => {
  const { status, departmentId, search, userId, fromDate, toDate } = req.query;

  try {
    let query = {};

    if (status) query.status = status;
    if (departmentId) query.department_id = departmentId;
    if (userId) query.user_id = userId;
    if (fromDate || toDate) {
      query.createdAt = {};
      if (fromDate) query.createdAt.$gte = new Date(fromDate);
      if (toDate) query.createdAt.$lte = new Date(toDate);
    }

    let complaints = await Complaint.find(query)
      .populate("user_id", "name")
      .populate("department_id", "name designation")
      .sort({ createdAt: -1 });

     
    complaints = complaints.map(c => ({
      id: c._id,
      title: c.title,
      description: c.description,
      type: c.type,
      status: c.status,
      user_id: c.user_id?._id,
      user_name: c.user_id?._doc?.name || c.user_id?.name || undefined,
      department_id: c.department_id?._id,
      department_name:
        c.department_id?._doc?.designation ||
        c.department_id?.designation ||
        c.department_id?._doc?.name ||
        c.department_id?.name ||
        undefined,
      created_at: c.createdAt,
      priority: c.priority || null,
      priority_confidence: c.priority_confidence || null
    }));
    if (search) {
      complaints = complaints.filter(c =>
        (c.title || "").toLowerCase().includes(search.toLowerCase()) ||
        (c.description || "").toLowerCase().includes(search.toLowerCase())
      );
    }

    res.json(Array.isArray(complaints) ? complaints : []);
  } catch (err) {
    return send500(res, err);
  }
};

// Assign complaint
export const assignComplaint = async (req, res) => {
  const { complaintId, departmentId } = req.body;
  if (!complaintId || !departmentId)
    return res.status(400).json({ message: "Complaint ID and Department ID required" });

  try {
    await Complaint.findByIdAndUpdate(complaintId, {
      department_id: departmentId,
      status: "Assigned",
      assigned_at: new Date()
    });
    res.json({ message: "Complaint assigned successfully" });
  } catch (err) {
    return send500(res, err);
  }
};

// Update complaint status
export const updateComplaintStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  if (!id || !status) return res.status(400).json({ message: "Missing id or status" });

  const allowed = ["Pending", "In Progress", "Resolved"];
  if (!allowed.includes(status)) return res.status(400).json({ message: "Invalid status" });

  try {
    await Complaint.findByIdAndUpdate(id, { status });
    res.json({ message: "Status updated" });
  } catch (err) {
    return send500(res, err);
  }
};

// Analytics
export const getAnalytics = async (req, res) => {
  try {
    const total = await Complaint.countDocuments();
    const byStatus = await Complaint.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);
    const byDepartment = await Complaint.aggregate([
      {
        $group: {
          _id: "$department_id",
          count: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: "departments",
          localField: "_id",
          foreignField: "_id",
          as: "department"
        }
      },
      {
        $unwind:{ path: "$department", preserveNullAndEmptyArrays: true }
      },
      {
        $project: {
          department_id: "$_id",
          department_name: "$department.name",
          count: 1
        }
      }
    ]);

    res.json({
      total,
      byStatus,
      byDepartment
    });
  } catch (err) {
    return send500(res, err);
  }
};

import Complaint from "../models/Complaint.js";
import axios from "axios";

const send500 = (res, err) => {
  console.error("DB ERROR:", err);
  return res.status(500).json({ error: "Database error" });
};

// -----------------------------------------------------
// CREATE COMPLAINT (With AI Priority Prediction)
// -----------------------------------------------------
export const createComplaint = async (req, res) => {
  const userId = req.body.user_id || req.user?.id;
  const { title, description, type } = req.body;

  if (!userId || !title || !description) {
    return res.status(400).json({ message: "All fields required" });
  }

  let priority = "Medium";            // default fallback
  let priority_confidence = null;     // may remain null

  // 🔥 Step 1: CALL ML MODEL (Flask API)
  try {
    const mlRes = await axios.post(
      "https://ml-based-cms-ml-model.onrender.com/predict",
      { complaint_text: description },
      { timeout: 5000 } // 5 seconds
    );

    if (mlRes.data && !mlRes.data.error) {
      priority = mlRes.data.priority || "Medium";
      priority_confidence = mlRes.data.confidence || null;
    } else {
      console.warn("ML API returned error:", mlRes.data);
    }
  } catch (mlErr) {
    console.warn("ML API unavailable → using default priority.");
    console.warn("Reason:", mlErr.message);
  }

  // 🔥 Step 2: SAVE COMPLAINT IN DB
  try {
    const complaint = new Complaint({
      user_id: userId,
      title,
      description,
      type: type || null,
      status: "Pending",
      department_id: null,
      priority,
      priority_confidence,
    });

    const savedComplaint = await complaint.save();

    return res.json({
      message: "Complaint created",
      complaint: {
        id: savedComplaint._id,
        user_id: userId,
        title,
        description,
        type: type || null,
        status: "Pending",
        department_id: null,
        priority,
        priority_confidence,
      },
    });
  } catch (err) {
    return send500(res, err);
  }
};

// -----------------------------------------------------
// GET USER COMPLAINTS
// -----------------------------------------------------
export const getUserComplaints = async (req, res) => {
  const { userId } = req.params;

  try {
    let complaints = await Complaint.find({ user_id: userId })
      .populate("department_id", "name designation")
      .sort({ createdAt: -1 });

    complaints = complaints.map((c) => ({
      id: c._id,
      title: c.title,
      description: c.description,
      type: c.type,
      status: c.status,
      department_id: c.department_id?._id,
      department_name:
        c.department_id?.designation ||
        c.department_id?.name ||
        undefined,
      created_at: c.createdAt,
      priority: c.priority,
      priority_confidence: c.priority_confidence,
    }));

    res.json(Array.isArray(complaints) ? complaints : []);
  } catch (err) {
    return send500(res, err);
  }
};

// -----------------------------------------------------
// UPDATE COMPLAINT
// -----------------------------------------------------
export const updateComplaint = async (req, res) => {
  const { id } = req.params;
  const { title, description, status } = req.body;

  try {
    if (req.user && req.user.role !== "admin") {
      const complaint = await Complaint.findById(id);
      if (!complaint)
        return res.status(404).json({ message: "Complaint not found" });

      if (complaint.user_id.toString() !== req.user.id)
        return res.status(403).json({ message: "Not allowed" });

      complaint.title = title;
      complaint.description = description;
      complaint.status = status;
      await complaint.save();

      return res.json({ message: "Complaint updated" });
    }

    const complaint = await Complaint.findByIdAndUpdate(
      id,
      { title, description, status },
      { new: true }
    );

    if (!complaint)
      return res.status(404).json({ message: "Complaint not found" });

    return res.json({ message: "Complaint updated" });
  } catch (err) {
    return send500(res, err);
  }
};

// -----------------------------------------------------
// DELETE COMPLAINT
// -----------------------------------------------------
export const deleteComplaint = async (req, res) => {
  const { id } = req.params;

  try {
    if (req.user && req.user.role !== "admin") {
      const complaint = await Complaint.findById(id);
      if (!complaint)
        return res.status(404).json({ message: "Complaint not found" });

      if (complaint.user_id.toString() !== req.user.id)
        return res.status(403).json({ message: "Not allowed" });

      await Complaint.findByIdAndDelete(id);
      return res.json({ message: "Complaint deleted" });
    }

    const complaint = await Complaint.findByIdAndDelete(id);
    if (!complaint)
      return res.status(404).json({ message: "Complaint not found" });

    return res.json({ message: "Complaint deleted" });
  } catch (err) {
    return send500(res, err);
  }
};

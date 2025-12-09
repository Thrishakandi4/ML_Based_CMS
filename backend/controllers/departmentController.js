import Complaint from "../models/Complaint.js";

const send500 = (res, err, msg = "Database error") => {
  console.log("DB ERROR:", err);
  return res.status(500).json({ error: msg });
};

// Get complaints for this department
export const getDepartmentComplaints = async (req, res) => {
  if (req.user.role !== "department") {
    return res.status(403).json({ message: "Access denied" });
  }

  const departmentId = req.user.id;

  try {
    let complaints = await Complaint.find({ department_id: departmentId })
      .populate("user_id", "name")
      .populate("department_id", "name designation")
      .sort({ createdAt: -1 });

    // normalize documents for frontend (use `id` instead of `_id`)
    complaints = complaints.map((c) => ({
      id: c._id,
      title: c.title,
      description: c.description,
      type: c.type,
      status: c.status,
      user_id: c.user_id?._id,
      user_name: c.user_id?._doc?.name || c.user_id?.name || undefined,
      department_id: c.department_id?._id,
      department_name: c.department_id?._doc?.designation || c.department_id?.designation || c.department_id?._doc?.name || c.department_id?.name || undefined,
      created_at: c.createdAt,
    }));

    res.json(Array.isArray(complaints) ? complaints : []);
  } catch (err) {
    return send500(res, err);
  }
};

// Update Complaints Status
export const updateComplaintStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) return res.status(400).json({ message: "Status required" });

  const allowed = ["Pending", "In Progress", "Resolved", "Closed"];
  if (!allowed.includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  try {
    const complaint = await Complaint.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    // complaint.department_id may be null; guard before calling toString()
    if (!complaint.department_id || complaint.department_id.toString() !== req.user.id) {
      return res.status(403).json({ message: "Complaint not assigned to you" });
    }

    // return updated complaint for frontend convenience
    res.json({ message: "Status updated successfully", complaint: {
      id: complaint._id,
      status: complaint.status,
      department_id: complaint.department_id
    } });
  } catch (err) {
    return send500(res, err);
  }
};

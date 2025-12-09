import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Resolved", "Assigned"],
      default: "Pending",
    },
    department_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      default: null,
    },
    assigned_at: {
      type: Date,
      default: null,
    },

    // -----------------------------
    // AI MODEL OUTPUTS
    // -----------------------------

    // Priority from BERT model
    priority: {
      type: String,
      enum: ["High", "Medium", "Low", null],
      default: null,
    },
    priority_confidence: {
      type: Number,
      default: null,
    },

    // Summary from T5 / BART model
    summary: {
      type: String,
      default: null,
    },
    summary_confidence: {
      type: Number,
      default: null,
    },
  },
  { timestamps: true }
);

const Complaint = mongoose.model("Complaint", complaintSchema);
export default Complaint;

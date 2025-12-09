import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        phone: {
            type: String,
            required: true
        },
        designation: {
            type: String,
            required: true
        },
        categories: {
            type: [String],
            default: []
        }
    },
    { timestamps: true }
);

const Department = mongoose.model("Department", departmentSchema);
export default Department;

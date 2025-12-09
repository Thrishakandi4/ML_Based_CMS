import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Department from "../models/Department.js";
import generateToken from "../utils/generateToken.js";

export const signup = async (req, res) => {
  const { name, email, password, role, phone, designation } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: "All fields required" });
  }

  try {
    // Department signup
    if (role === "department") {
      if (!phone || !designation) {
        return res.status(400).json({ message: "Department phone and designation required" });
      }

      const existingDept = await Department.findOne({ email });
      if (existingDept) return res.status(400).json({ message: "Email already exists" });

      const hashedPassword = await bcrypt.hash(password, 10);
      const dept = new Department({
        name,
        email,
        password: hashedPassword,
        phone,
        designation
      });

      const savedDept = await dept.save();
      const token = generateToken(savedDept._id, role);

      return res.json({
        message: "Department signup successful",
        token,
        user: { id: savedDept._id, name, email, role, phone, designation },
      });
    } else {
      // User/Admin signup
      const existingUser = await User.findOne({ email });
      if (existingUser) return res.status(400).json({ message: "Email already exists" });

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({
        name,
        email,
        password: hashedPassword,
        role
      });

      const savedUser = await user.save();
      const token = generateToken(savedUser._id, role);

      return res.json({
        message: "Signup successful",
        token,
        user: { id: savedUser._id, name, email, role },
      });
    }
  } catch (err) {
    console.log("Signup Error:", err);
    return res.status(500).json({ error: "Signup failed" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check users table first
    const user = await User.findOne({ email });

    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ message: "Incorrect password" });

      const token = generateToken(user._id, user.role);
      return res.json({
        message: "Login successful",
        token,
        user: { id: user._id, name: user.name, email: user.email, role: user.role },
      });
    }

    // Check departments table
    const dept = await Department.findOne({ email });
    if (!dept) return res.status(400).json({ message: "Invalid credentials" });

    // Debug log for password comparison
    console.log("Department login attempt:", {
      email,
      enteredPassword: password,
      storedHash: dept.password
    });

    const isMatch = await bcrypt.compare(password, dept.password);
    if (!isMatch) return res.status(400).json({ message: "Incorrect password" });

    const token = generateToken(dept._id, "department");
    return res.json({
      message: "Login successful",
      token,
      user: {
        id: dept._id,
        name: dept.name,
        email: dept.email,
        role: "department",
        phone: dept.phone,
        designation: dept.designation,
      },
    });
  } catch (err) {
    console.log("Login Error:", err);
    return res.status(500).json({ error: "Login failed" });
  }
};

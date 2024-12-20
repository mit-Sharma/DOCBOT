import bcrypt from "bcrypt"
import { User } from "../models/User.js";
import jwt from "jsonwebtoken" 

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Email and password are required." });
  }

  try {
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({ success: false, message: "Invalid credentials." });
    }

    // Compare password
    const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ success: false, message: "Invalid credentials." });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: existingUser._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.status(200).json({ success: true, message: "Login successful", token });
  } catch (error) {
    console.error("Error in login:", error);
    res.status(500).json({ success: false, message: "An error occurred during login." });
  }
};

import express from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import User from "../models/User.js";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_change_in_production";

function signToken(userId) {
  return jwt.sign({ userId: String(userId) }, JWT_SECRET, { expiresIn: "7d" });
}

function ensureDatabaseReady(res) {
  if (mongoose.connection.readyState === 1) return true;
  res.status(503).json({
    message: "Database is not connected. Please set MONGODB_URI in .env and restart the server.",
  });
  return false;
}

// POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
    if (!ensureDatabaseReady(res)) return;

    const fullName = req.body?.fullName ?? req.body?.name;
    const gmail = req.body?.gmail ?? req.body?.email;
    const password = req.body?.password;
    const confirmPassword = req.body?.confirmPassword;

    if (!fullName?.trim() || !gmail?.trim() || !password) {
      return res.status(400).json({ message: "Full name, gmail and password are required" });
    }

    if (confirmPassword && password !== confirmPassword) {
      return res.status(400).json({ message: "Password confirmation does not match" });
    }

    const normalizedEmail = gmail.toLowerCase().trim();
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(409).json({ message: "Gmail already in use. Please log in." });
    }

    const user = await User.create({ name: fullName.trim(), email: normalizedEmail, password });
    const token = signToken(user._id);

    return res.status(201).json({ token, user });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    if (!ensureDatabaseReady(res)) return;

    const gmail = req.body?.gmail ?? req.body?.email;
    const password = req.body?.password;

    if (!gmail?.trim() || !password) {
      return res.status(400).json({ message: "Gmail and password are required" });
    }

    const user = await User.findOne({ email: gmail.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({ message: "Invalid gmail or password" });
    }

    const valid = await user.comparePassword(password);
    if (!valid) {
      return res.status(401).json({ message: "Invalid gmail or password" });
    }

    const token = signToken(user._id);
    return res.json({ token, user });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

export default router;

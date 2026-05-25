import express from "express";
import { requireAuth } from "../middleware/auth.js";
import { mergeSettings } from "../constants/defaultSettings.js";
import Folder from "../models/Folder.js";
import Project from "../models/Project.js";
import Task from "../models/Task.js";
import User from "../models/User.js";

const router = express.Router();
router.use(requireAuth);

router.get("/", async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({
      settings: mergeSettings(user.settings),
      user: { _id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.patch("/", async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const current = mergeSettings(user.settings);
    const incoming = req.body?.settings || {};

    for (const section of Object.keys(current)) {
      if (incoming[section] && typeof incoming[section] === "object") {
        current[section] = { ...current[section], ...incoming[section] };
      }
    }

    user.settings = current;
    await user.save();

    res.json({
      settings: mergeSettings(user.settings),
      user: { _id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.patch("/account", async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const name = req.body?.name ?? req.body?.fullName;
    const email = req.body?.email ?? req.body?.gmail;
    const { currentPassword, newPassword } = req.body;

    if (name?.trim()) user.name = name.trim();

    if (email?.trim()) {
      const normalized = email.toLowerCase().trim();
      const taken = await User.findOne({ email: normalized, _id: { $ne: user._id } });
      if (taken) return res.status(409).json({ message: "Email already in use" });
      user.email = normalized;
    }

    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ message: "Current password is required" });
      }
      const valid = await user.comparePassword(currentPassword);
      if (!valid) return res.status(401).json({ message: "Current password is incorrect" });
      if (newPassword.length < 6) {
        return res.status(400).json({ message: "New password must be at least 6 characters" });
      }
      user.password = newPassword;
    }

    await user.save();
    res.json({ user: { _id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/export", async (req, res) => {
  try {
    const userId = req.user.id;
    const [tasks, projects, folders] = await Promise.all([
      Task.find({ userId }).sort({ createdAt: -1 }),
      Project.find({ userId }).sort({ createdAt: -1 }),
      Folder.find({ userId }).sort({ createdAt: -1 }),
    ]);

    const payload = {
      exportedAt: new Date().toISOString(),
      tasks,
      projects,
      folders,
    };

    res.setHeader("Content-Type", "application/json");
    res.setHeader("Content-Disposition", 'attachment; filename="taskflow-backup.json"');
    res.send(JSON.stringify(payload, null, 2));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;

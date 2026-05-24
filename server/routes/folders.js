import express from "express";
import { requireAuth } from "../middleware/auth.js";
import Folder from "../models/Folder.js";
import Project from "../models/Project.js";

const router = express.Router();
router.use(requireAuth);

// GET /api/folders
router.get("/", async (req, res) => {
  try {
    const folders = await Folder.find({ userId: req.user.id }).sort({ createdAt: 1 });
    res.json(folders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/folders
router.post("/", async (req, res) => {
  try {
    const { name, type } = req.body;
    if (!name?.trim()) return res.status(400).json({ message: "Folder name is required" });
    const folder = await Folder.create({
      userId: req.user.id,
      name: name.trim(),
      type: type || "personal",
    });
    return res.status(201).json(folder);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// PATCH /api/folders/:id
router.patch("/:id", async (req, res) => {
  try {
    const folder = await Folder.findOne({ _id: req.params.id, userId: req.user.id });
    if (!folder) return res.status(404).json({ message: "Folder not found" });
    const fields = ["name", "type", "isCollapsed"];
    fields.forEach((f) => { if (req.body[f] !== undefined) folder[f] = req.body[f]; });
    await folder.save();
    return res.json(folder);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// DELETE /api/folders/:id  – also unlinks projects inside
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Folder.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!deleted) return res.status(404).json({ message: "Folder not found" });
    await Project.updateMany(
      { userId: req.user.id, folderId: deleted._id },
      { $set: { folderId: null } }
    );
    return res.status(204).send();
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

export default router;

import express from "express";
import { requireAuth } from "../middleware/auth.js";
import Project from "../models/Project.js";
import Task from "../models/Task.js";

const router = express.Router();
router.use(requireAuth);

// GET /api/projects
router.get("/", async (req, res) => {
  try {
    const projects = await Project.find({ userId: req.user.id }).sort({ createdAt: 1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/projects
router.post("/", async (req, res) => {
  try {
    const { name, color, view, type, folderId } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({ message: "Project name is required" });
    }

    const colorHex = Project.COLOR_MAP[color] || Project.COLOR_MAP.Violet;

    const project = await Project.create({
      userId: req.user.id,
      name: name.trim(),
      color: color || "Violet",
      colorHex,
      view: view || "list",
      type: type || "personal",
      folderId: folderId || null,
    });

    return res.status(201).json(project);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// PATCH /api/projects/:id
router.patch("/:id", async (req, res) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, userId: req.user.id });
    if (!project) return res.status(404).json({ message: "Project not found" });

    const fields = ["name", "color", "view", "isFavorite", "type", "folderId"];
    fields.forEach((f) => {
      if (req.body[f] !== undefined) project[f] = req.body[f];
    });

    if (req.body.color) {
      project.colorHex = Project.COLOR_MAP[req.body.color] || project.colorHex;
    }

    await project.save();
    return res.json(project);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// DELETE /api/projects/:id
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Project.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!deleted) return res.status(404).json({ message: "Project not found" });
    await Task.deleteMany({ userId: req.user.id, projectId: deleted._id });
    return res.status(204).send();
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

export default router;

import express from "express";
import { requireAuth } from "../middleware/auth.js";
import Project from "../models/Project.js";
import Task from "../models/Task.js";

const router = express.Router();
router.use(requireAuth);

// GET /api/tasks
router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/tasks
router.post("/", async (req, res) => {
  try {
    const { title, note, project, projectId, labels, priority, dueDate, dueTime } = req.body;

    if (!title?.trim()) {
      return res.status(400).json({ message: "title is required" });
    }

    let resolvedProjectId = null;
    let resolvedProjectName = project || "Inbox";
    if (projectId) {
      const foundProject = await Project.findOne({ _id: projectId, userId: req.user.id });
      if (!foundProject) {
        return res.status(400).json({ message: "Invalid project" });
      }
      resolvedProjectId = foundProject._id;
      resolvedProjectName = foundProject.name;
    }

    const task = await Task.create({
      userId: req.user.id,
      projectId: resolvedProjectId,
      title: title.trim(),
      note: note || "",
      project: resolvedProjectName,
      labels: Array.isArray(labels) ? labels : [],
      priority: Number(priority) || 4,
      dueDate: dueDate || null,
      dueTime: dueTime || "",
    });

    return res.status(201).json(task);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// PATCH /api/tasks/:id
router.patch("/:id", async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user.id });
    if (!task) return res.status(404).json({ message: "Task not found" });

    const fields = ["title", "note", "project", "labels", "priority", "dueDate", "dueTime", "done"];
    fields.forEach((f) => {
      if (req.body[f] !== undefined) task[f] = req.body[f];
    });

    if (req.body.projectId !== undefined) {
      if (!req.body.projectId) {
        task.projectId = null;
        task.project = req.body.project || "Inbox";
      } else {
        const foundProject = await Project.findOne({
          _id: req.body.projectId,
          userId: req.user.id,
        });
        if (!foundProject) {
          return res.status(400).json({ message: "Invalid project" });
        }
        task.projectId = foundProject._id;
        task.project = foundProject.name;
      }
    }

    if (req.body.done === true && !task.completedAt) task.completedAt = new Date();
    if (req.body.done === false) task.completedAt = null;

    await task.save();
    return res.json(task);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// PATCH /api/tasks/:id/toggle
router.patch("/:id/toggle", async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user.id });
    if (!task) return res.status(404).json({ message: "Task not found" });

    task.done = !task.done;
    task.completedAt = task.done ? new Date() : null;
    await task.save();
    return res.json(task);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// DELETE /api/tasks/:id
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!deleted) return res.status(404).json({ message: "Task not found" });
    return res.status(204).send();
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

export default router;

import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import authRouter from "./routes/auth.js";
import foldersRouter from "./routes/folders.js";
import projectsRouter from "./routes/projects.js";
import settingsRouter from "./routes/settings.js";
import tasksRouter from "./routes/tasks.js";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT || 5000);

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, mongoState: mongoose.connection.readyState });
});

app.use("/api/auth", authRouter);
app.use("/api/tasks", tasksRouter);
app.use("/api/projects", projectsRouter);
app.use("/api/folders", foldersRouter);
app.use("/api/settings", settingsRouter);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: "Internal server error" });
});

async function startServer() {
  const MONGODB_URI = process.env.MONGODB_URI;

  if (MONGODB_URI) {
    try {
      await mongoose.connect(MONGODB_URI);
      console.log("MongoDB connected");
    } catch (err) {
      console.error("MongoDB connection failed:", err.message);
    }
  } else {
    console.warn("MONGODB_URI not set – running without database");
  }

  app.listen(PORT, "127.0.0.1", () => {
    console.log(`API server running at http://127.0.0.1:${PORT}`);
  });
}

startServer();

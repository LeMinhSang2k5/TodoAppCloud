import mongoose from "mongoose";

const { Schema } = mongoose;

const taskSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    projectId: { type: Schema.Types.ObjectId, ref: "Project", default: null, index: true },
    title: { type: String, required: true, trim: true },
    note: { type: String, default: "", trim: true },
    project: { type: String, default: "Inbox", trim: true },
    labels: [{ type: String, trim: true }],
    priority: { type: Number, default: 4, min: 1, max: 4 },
    dueDate: { type: Date, default: null },
    dueTime: { type: String, default: "", trim: true },
    done: { type: Boolean, default: false },
    completedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

export default mongoose.models.Task || mongoose.model("Task", taskSchema);

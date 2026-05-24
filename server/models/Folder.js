import mongoose from "mongoose";

const { Schema } = mongoose;

const folderSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    name: { type: String, required: true, trim: true },
    type: { type: String, enum: ["personal", "team"], default: "personal" },
    isCollapsed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.Folder || mongoose.model("Folder", folderSchema);

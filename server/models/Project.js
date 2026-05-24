import mongoose from "mongoose";

const { Schema } = mongoose;

const COLOR_MAP = {
  Violet: "#7b68ee",
  Red: "#e44332",
  Sky: "#4a9fe5",
  Green: "#3aab7b",
  Orange: "#eb8909",
  Yellow: "#ffc107",
  Pink: "#e91e63",
  Teal: "#009688",
};

const projectSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    folderId: { type: Schema.Types.ObjectId, ref: "Folder", default: null, index: true },
    name: { type: String, required: true, trim: true },
    color: { type: String, default: "Violet", trim: true },
    colorHex: { type: String, default: "#7b68ee" },
    view: { type: String, enum: ["list", "board", "calendar"], default: "list" },
    type: { type: String, enum: ["personal", "team"], default: "personal" },
    isFavorite: { type: Boolean, default: false },
  },
  { timestamps: true }
);

projectSchema.statics.COLOR_MAP = COLOR_MAP;

export default mongoose.models.Project || mongoose.model("Project", projectSchema);

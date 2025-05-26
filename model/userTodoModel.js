import mongoose from "mongoose";

const todoSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    completed: { type: Boolean, default: false },
    dueDate: { type: Date },
    reminder: { type: Date },
    notified: { type: Boolean, default: false },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
  },
  { timestamps: true }
);

const Todo = mongoose.model("Todo", todoSchema);
export default Todo;

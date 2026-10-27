import mongoose from "mongoose";

const todoModule = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
    },

    text: {
      type: String,
      required: true,
      trim: true,
    },

    isCompleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const todoModules =
  mongoose.models.Todo || mongoose.model("Todo", todoModule);

export default todoModules;
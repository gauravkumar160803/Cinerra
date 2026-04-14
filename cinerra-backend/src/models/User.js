import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    clerkId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    email: {
      type: String,
      required: true,
    },

    name: {
      type: String,
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    // admin security key
    adminKey: {
      type: String,
      default: null,
    }

  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", UserSchema);


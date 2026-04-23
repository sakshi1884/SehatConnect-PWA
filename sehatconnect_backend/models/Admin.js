import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: "Admin",
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    healthcareCenter: String,
    location: String,
    phone: String,
    profilePic: {
      type: String,
      default:
        "https://cdn-icons-png.flaticon.com/512/149/149071.png",
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Admin", adminSchema);

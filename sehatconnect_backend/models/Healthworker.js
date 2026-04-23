import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const toPascalCase = (str) => {
  if (!str) return str;
  return str
    .toLowerCase()
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const healthWorkerSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full Name is required"],
      trim: true,
      set: toPascalCase,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },

    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
      match: [/^[6-9]\d{9}$/, "Enter valid Indian mobile number"],
    },

    role: {
      type: String,
      required: [true, "Role is required"],
      enum: ["ANM", "GNM", "ASHA", "MPW"],
    },

    domicileCity: {
      type: String,
      required: [true, "City is required"],
      trim: true,
      set: toPascalCase,
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      match: [
        /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
        "Password must contain 1 uppercase, 1 number & 1 special character",
      ],
      select: false,
    },

    profilePhoto: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

/* HASH PASSWORD */
healthWorkerSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

/* PASSWORD MATCH METHOD */
healthWorkerSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const HealthWorker = mongoose.model("HealthWorker", healthWorkerSchema);
export default HealthWorker;

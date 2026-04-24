import "./config/env.js";   // ✅ MUST BE FIRST

import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import doctorRoutes from "./routes/doctorRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import healthworkerRoutes from "./routes/healthworkerRoutes.js";
import healthCampRoutes from "./routes/healthCampRoutes.js";
import patientRouter from "./routes/patientRoute.js";

const app = express();

/* ================= MIDDLEWARE ================= */
app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ================= DEBUG HANDLERS ================= */
process.on("uncaughtException", err => {
  console.error("❌ UNCAUGHT EXCEPTION:", err);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("❌ UNHANDLED REJECTION at:", promise, "reason:", reason);
});

/* ================= ROUTES ================= */
app.get("/", (req, res) => {
  res.send("SehatConnect Backend Running ✅");
});

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/healthworkers", healthworkerRoutes);
app.use("/api/healthcamps", healthCampRoutes);
app.use("/api/patients", patientRouter);

/* ================= SERVER START ================= */
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB(); // ✅ WAIT for MongoDB

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
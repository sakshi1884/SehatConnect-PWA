import "./config/env.js";   // ✅ MUST BE ABSOLUTE FIRST LINE

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
connectDB();

app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

process.on("uncaughtException", err => {
  console.error("UNCAUGHT EXCEPTION:", err);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("UNHANDLED REJECTION at:", promise, "reason:", reason);
});

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/healthworkers", healthworkerRoutes);
app.use("/api/healthcamps", healthCampRoutes);
app.use("/api/patients", patientRouter);
app.get("/", (req, res) => res.send("SehatConnect Backend Running ✅"));

const PORT = process.env.PORT || 5000;


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

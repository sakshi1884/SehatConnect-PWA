import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";
import Doctor from "../models/Doctor.js";
import Healthworker from "../models/Healthworker.js";
import Patient from "../models/Patient.js";

export default async function authMiddleware(req, res, next) {
  try {
    console.log("🔐 Auth middleware triggered");

    const token = req.headers.authorization?.split(" ")[1];
    console.log("Token:", token);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded:", decoded);

    let user = null;

    // ✅ role-based dynamic model lookup
    if (decoded.role === "admin") {
      user = await Admin.findById(decoded.id).select("-password");
    } 
    else if (decoded.role === "doctor") {
      user = await Doctor.findById(decoded.id).select("-password");
    } 
    else if (decoded.role === "healthworker") {
      user = await Healthworker.findById(decoded.id).select("-password");
    }
    else if (decoded.role === "patient") {
  user = await Patient.findById(decoded.id).select("-password");
}

    console.log("User found:", user);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: `${decoded.role} not found`,
      });
    }

    // ✅ common req.user for all roles
    req.user = user;
    req.user.role = decoded.role;

    next();
  } catch (err) {
    console.error("AUTH ERROR:", err);

    res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
}
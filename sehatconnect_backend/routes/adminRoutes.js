import express from "express";
import {
  adminLogin,
  getAdminProfile,
  updateAdminProfile,
} from "../controllers/adminController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import multer from "multer";
import Admin from "../models/Admin.js"; 

const router = express.Router();


const upload = multer({ dest: "uploads/" });


router.post("/login", adminLogin);


router.get("/profile", authMiddleware, getAdminProfile);

// ✏️ UPDATE PROFILE (with image upload)
router.put(
  "/profile",
  authMiddleware,
  upload.single("profilePic"),
  updateAdminProfile
);

// 🟡 OPTIONAL: GET ADMIN BY ID (only if really needed)
router.get("/:id", async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.json(admin);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
import express from "express";
import { loginUser,loginAdmin } from "../controllers/authController.js";

const router = express.Router();

router.post("/login", loginUser);
router.post("/login/user", loginUser);

// Admin login
router.post("/login/admin", loginAdmin);
export default router;

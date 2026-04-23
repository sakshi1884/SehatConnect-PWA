import express from "express";
import {
  getAllHealthCamps,
  createHealthCamp,
  updateHealthCamp,
  deleteHealthCamp,sendCampReminder
} from "../controllers/healthCampController.js";

const router = express.Router();

router.get("/", getAllHealthCamps);
router.post("/", createHealthCamp);
router.put("/:id", updateHealthCamp);
router.delete("/:id", deleteHealthCamp);
router.post("/send-reminder/:id", sendCampReminder);
export default router;

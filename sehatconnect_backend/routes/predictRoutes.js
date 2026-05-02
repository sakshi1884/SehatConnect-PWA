import express from "express";
import { predictRisk } from "../controllers/predictController.js";

const router = express.Router();

// POST route
router.post("/", predictRisk);

// TEST ROUTE (FIXED)
router.get("/test-python", (req, res) => {
  res.send("ROUTE IS WORKING");
});

export default router;
import express from "express";
import { predictRisk } from "../controllers/predictController.js";

const router = express.Router();

router.post("/", predictRisk);

export default router;
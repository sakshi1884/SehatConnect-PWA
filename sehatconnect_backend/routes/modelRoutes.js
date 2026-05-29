import express from "express";
import { predictAllModels } from "../controllers/modelController.js";

const router = express.Router();

router.post("/predict-all-models", predictAllModels);

export default router;
import express from "express";
import { predictAllModels } from "../controllers/modelController.js";

const router = express.Router();

router.post("/predict-all-models", async (req, res) => {

  console.log("PREDICT ROUTE HIT");

  return predictAllModels(req, res);

});

export default router;
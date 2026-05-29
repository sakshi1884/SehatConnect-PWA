import express from "express";
import fs from "fs";

const router = express.Router();

router.post("/model-analysis", (req, res) => {
  try {
    const data = fs.readFileSync("../AI_model/model_metrics.json", "utf-8");

    const results = JSON.parse(data);

    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
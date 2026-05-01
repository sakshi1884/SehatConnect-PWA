import { spawn } from "child_process";
import path from "path";

export const predictRisk = async (req, res) => {
  try {
    const { features } = req.body;

    if (!features || !Array.isArray(features)) {
      return res.status(400).json({
        success: false,
        message: "Features array required",
      });
    }

    // path to predict.py
    const scriptPath = path.join(
      process.cwd(),
      "../AI_model/predict.py"
    );

    const python = spawn("python", [scriptPath]);

    let result = "";
    let error = "";

    // send features to python
    python.stdin.write(JSON.stringify({ features }));
    python.stdin.end();

    python.stdout.on("data", (data) => {
      result += data.toString();
    });

    python.stderr.on("data", (data) => {
      error += data.toString();
    });

    python.on("close", (code) => {
      if (code !== 0 || error) {
        console.log(error);
        return res.status(500).json({
          success: false,
          message: "Prediction failed",
        });
      }

      const prediction = JSON.parse(result);

      res.json({
        success: true,
        prediction,
      });
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
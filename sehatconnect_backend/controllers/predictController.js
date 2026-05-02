import { spawn } from "child_process";

export const predictRisk = (req, res) => {
  const python = spawn("python3", ["predict.py"]);

  const input = JSON.stringify({
    features: req.body.features
  });

  let output = "";

  python.stdout.on("data", (data) => {
    output += data.toString();
  });

  python.stderr.on("data", (data) => {
    console.error("PYTHON ERROR:", data.toString());
  });

  python.on("close", () => {
    try {
      res.json(JSON.parse(output));
    } catch (err) {
      res.status(500).json({
        error: "Invalid Python output",
        raw: output
      });
    }
  });

  // 🔥 THIS FIX ENABLES DATA FLOW
  python.stdin.write(input);
  python.stdin.end();
};
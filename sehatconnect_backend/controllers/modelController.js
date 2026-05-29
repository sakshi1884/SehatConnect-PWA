import { spawn } from "child_process";
import path from "path";

export const predictAllModels = async (req, res) => {

  try {

    // FRONTEND SENDS features ARRAY
    const { features } = req.body;

    if (!features) {

      return res.status(400).json({
        error: "Features missing"
      });

    }

    // PYTHON FILE PATH
    const scriptPath = path.resolve(
      "AI_model/all_models_predict.py"
    );

    // RUN PYTHON
    const python = spawn(
      "python",
      [scriptPath]
    );

    let result = "";

    let errorOutput = "";

    // PYTHON STDOUT
    python.stdout.on("data", (data) => {

      result += data.toString();

    });

    // PYTHON STDERR
    python.stderr.on("data", (data) => {

      errorOutput += data.toString();

    });

    // PROCESS CLOSE
    python.on("close", () => {

      try {

        console.log("RAW RESULT:", result);

        if (errorOutput) {

          console.log(
            "PYTHON ERROR:",
            errorOutput
          );

        }

        const parsed =
          JSON.parse(result);

        res.status(200).json(parsed);

      } catch (err) {

        console.log(
          "JSON PARSE ERROR"
        );

        console.log(err);

        console.log(
          "RAW OUTPUT:",
          result
        );

        res.status(500).json({

          error:
            "Failed to parse prediction result",

          raw:
            result

        });

      }

    });

    // SEND FEATURES TO PYTHON
    python.stdin.write(

      JSON.stringify({
        features
      })

    );

    python.stdin.end();

  } catch (error) {

    console.log(error);

    res.status(500).json({
      error: error.message
    });

  }

};
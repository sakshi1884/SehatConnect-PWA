import { spawn } from "child_process";
import path from "path";

export const predictAllModels = async (req, res) => {

  try {

    console.log("===== API HIT =====");

    // FRONTEND SENDS features ARRAY
    const { features } = req.body;

    console.log("FEATURES RECEIVED:");
    console.log(features);

    console.log("TYPE OF FEATURES:");
    console.log(typeof features);

    console.log("IS ARRAY:");
    console.log(Array.isArray(features));

    if (!features) {

      return res.status(400).json({
        error: "Features missing"
      });

    }

    // PYTHON FILE PATH
    const scriptPath = path.resolve(
      "AI_model/all_models_predict.py"
    );

    console.log("SCRIPT PATH:");
    console.log(scriptPath);

    // RUN PYTHON
    const python = spawn(
      "python",
      [scriptPath]
    );

    console.log("PYTHON PROCESS STARTED");

    let result = "";

    let errorOutput = "";

    // PYTHON STDOUT
    python.stdout.on("data", (data) => {

      console.log("STDOUT CHUNK:");
      console.log(data.toString());

      result += data.toString();

    });

    // PYTHON STDERR
    python.stderr.on("data", (data) => {

      console.log("STDERR CHUNK:");
      console.log(data.toString());

      errorOutput += data.toString();

    });

    // PYTHON PROCESS ERROR
    python.on("error", (err) => {

      console.log("SPAWN ERROR:");
      console.log(err);

    });

    // PROCESS CLOSE
    python.on("close", (code) => {

      console.log("PYTHON PROCESS CLOSED");

      console.log("EXIT CODE:");
      console.log(code);

      console.log("FINAL RESULT:");
      console.log(result);

      console.log("FINAL STDERR:");
      console.log(errorOutput);

      try {

        console.log("TRYING JSON PARSE");

        const parsed =
          JSON.parse(result);

        console.log("JSON PARSE SUCCESS");

        console.log(parsed);

        res.status(200).json(parsed);

      } catch (err) {

        console.log(
          "JSON PARSE ERROR"
        );

        console.log(err);

        console.log(
          "RAW OUTPUT:"
        );

        console.log(result);

        res.status(500).json({

          error:
            "Failed to parse prediction result",

          raw:
            result,

          stderr: errorOutput

        });

      }

    });

    // SEND FEATURES TO PYTHON
    const payload = JSON.stringify({
      features
    });

    console.log("SENDING TO PYTHON:");
    console.log(payload);

    python.stdin.write(payload);

    python.stdin.end();

    console.log("STDIN SENT");

  } catch (error) {

    console.log("OUTER CATCH ERROR");

    console.log(error);

    res.status(500).json({
      error: error.message
    });

  }

};
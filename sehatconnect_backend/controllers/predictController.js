const { spawn } = require("child_process");
const path = require("path");

exports.predictRisk = async (req, res) => {

  try {

    const patient = req.patient;

    if (!patient || !patient.checkups.length) {

      return res.status(400).json({
        message: "No checkups found"
      });

    }

    const latest =
      patient.checkups[
        patient.checkups.length - 1
      ];

    const features = [

      latest.heartRate || 0,
      latest.respiratoryRate || 0,
      latest.temperature || 0,
      latest.spo2 || 0,
      latest.systolic || 0,
      latest.diastolic || 0,
      patient.age || 0,
      patient.gender === "Male" ? 1 : 0,
      latest.weight || 0,
      latest.bmi || 0

    ];

    const pythonProcess = spawn(

      "python",

      [
        path.join(
          __dirname,
          "../AI_model/all_models_predict.py"
        )
      ]

    );

    let result = "";

    pythonProcess.stdout.on(
      "data",
      (data) => {

        result += data.toString();

      }
    );

    pythonProcess.stderr.on(
      "data",
      (data) => {

        console.error(
          "Python Error:",
          data.toString()
        );

      }
    );

    pythonProcess.on(
      "close",
      () => {

        try {

          console.log(
            "RAW RESULT:",
            result
          );

          const parsed =
            JSON.parse(result);

          // IMPORTANT
          // SEND ALL MODELS
          res.json(parsed);

        } catch (err) {

          console.error(err);

          res.status(500).json({
            error:
              "JSON PARSE ERROR"
          });

        }
      }
    );

    pythonProcess.stdin.write(
      JSON.stringify({
        features
      })
    );

    pythonProcess.stdin.end();

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: err.message
    });

  }
};
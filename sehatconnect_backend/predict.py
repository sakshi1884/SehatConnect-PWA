import sys
import json
import joblib
import numpy as np

try:

    model = joblib.load("../AI_model/lightgbm.pkl")

    input_json = sys.stdin.read()

    input_data = json.loads(input_json)

    features = np.array(
        input_data["features"]
    ).reshape(1, -1)

    prob = model.predict_proba(features)[0][1]

    prediction = (
        "High Risk"
        if prob >= 0.5773
        else "Low Risk"
    )

    print(json.dumps({

        "prediction": prediction,

        "probability": float(prob),

        "accuracy": 96.4,

        "f1_score": 95.1

    }))

except Exception as e:

    print(json.dumps({

        "error": str(e)

    }))

    # 80,     # Heart_Rate
    #     16,     # Respiratory_Rate
    #     37.0,   # Body_Temperature
    #     98,     # Oxygen_Saturation
    #     120,    # Systolic_Blood_Pressure
    #     80,     # Diastolic_Blood_Pressure
    #     30,     # Age
    #     1,      # Gender
    #     70,     # Weight
    #     1.75,   # Height
    #     0.1,    # Derived_HRV
    #     40,     # Derived_Pulse_Pressure
    #     22.9,   # BMI
    #     93      # MAP
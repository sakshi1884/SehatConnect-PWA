import sys
import json
import lightgbm as lgb
import numpy as np

model = lgb.Booster(model_file="patient_risk_model.txt")

try:
    input_json = sys.stdin.read()
    input_data = json.loads(input_json)

    features = np.array(input_data["features"]).reshape(1, -1)

    prob = model.predict(features)[0]

    prediction = "High Risk" if prob >= 0.5773 else "Low Risk"

    print(json.dumps({
        "prediction": prediction,
        "probability": float(prob)
    }))

except Exception as e:
    print(json.dumps({
        "error": str(e)
    }))
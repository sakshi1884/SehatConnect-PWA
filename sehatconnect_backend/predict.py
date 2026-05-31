import joblib
import json
import sys
import numpy as np

model = joblib.load("../AI_model/lightgbm.pkl")
scaler = joblib.load("../AI_model/vitals_scaler.pkl")
encoder = joblib.load("../AI_model/risk_label_encoder.pkl")

input_json = sys.stdin.read()
input_data = json.loads(input_json)

features = np.array(
    input_data["features"],
    dtype=float
).reshape(1, -1)

features = scaler.transform(features)

pred = model.predict(features)[0]
probs = model.predict_proba(features)[0]

prediction = encoder.inverse_transform([pred])[0]

print(json.dumps({
    "prediction": prediction,
    "high_risk_probability": float(probs[0]),
    "low_risk_probability": float(probs[1])
}))
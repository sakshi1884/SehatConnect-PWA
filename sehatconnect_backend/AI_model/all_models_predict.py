import sys
import json
import numpy as np
import joblib
import time
import os
import lightgbm as lgb

BASE_DIR = os.path.dirname(__file__)

# =========================
# LOAD SCALER
# =========================
scaler = joblib.load(
    os.path.join(BASE_DIR, "vitals_scaler.pkl")
)

# =========================
# LOAD LABEL ENCODER
# =========================
encoder = joblib.load(
    os.path.join(BASE_DIR, "risk_label_encoder.pkl")
)

# =========================
# LOAD METRICS
# =========================
with open(
    os.path.join(BASE_DIR, "model_metrics.json"),
    "r"
) as f:

    metrics = json.load(f)

# =========================
# LOAD MODELS
# =========================
models = {

    "LightGBM":
        joblib.load(
            os.path.join(BASE_DIR, "lightgbm.pkl")
        ),

    "Random Forest":
        joblib.load(
            os.path.join(BASE_DIR, "randomforest.pkl")
        ),

    "SVM":
        joblib.load(
            os.path.join(BASE_DIR, "svm.pkl")
        ),

    "XGBoost":
        joblib.load(
            os.path.join(BASE_DIR, "xgboost.pkl")
        ),

    "CatBoost":
        joblib.load(
            os.path.join(BASE_DIR, "catboost.pkl")
        )
}

try:

    input_json = sys.stdin.read()

    input_data = json.loads(input_json)

    features = np.array(
        input_data["features"],
        dtype=float
    ).reshape(1, -1)

    # =========================
    # SCALE INPUT
    # =========================
    features = scaler.transform(features)

    results = {}

    # =========================
    # PREDICT
    # =========================
    for name, model in models.items():

        start = time.time()

        pred = model.predict(features)[0]

        if hasattr(model, "predict_proba"):

            probs = model.predict_proba(features)[0]

            prob = float(probs[int(pred)])

        else:

            prob = 1.0

        prediction = encoder.inverse_transform([int(pred)])[0]

        end = time.time()

        results[name] = {

            "prediction": prediction,

            "probability": round(prob, 4),

            "accuracy": metrics[name]["accuracy"],

            "f1_score": metrics[name]["f1_score"],

            "execution_time": round(end - start, 4)

        }

    print(json.dumps(results))

except Exception as e:

    print(json.dumps({
        "error": str(e)
    }))
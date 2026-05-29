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
        ),

    "FFNN":
        joblib.load(
            os.path.join(BASE_DIR, "ffnn.pkl")
        )
}

try:
    print("🚨 PYTHON FILE EXECUTING: all_models_predict.py")

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

        # =========================
        # PROBABILITY
        # =========================
        if hasattr(model, "predict_proba"):

            prob = model.predict_proba(features)[0][1]

        else:

            pred = model.predict(features)[0]
            prob = float(pred)

        prediction = (
            "High Risk"
            if prob > 0.5
            else "Low Risk"
        )

        end = time.time()

        results[name] = {

    "prediction": prediction,   # "High Risk" / "Low Risk"

    "probability": round(float(prob), 4),

    "accuracy": metrics[name]["accuracy"],

    "f1_score": metrics[name]["f1_score"],

    "execution_time": round(end - start, 4)
}
    print(json.dumps(results))

except Exception as e:

    print(json.dumps({
        "error": str(e)
    }))
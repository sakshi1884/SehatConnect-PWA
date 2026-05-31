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
            os.path.join(
                BASE_DIR,
                "lightgbm.pkl"
            )
        ),

    "Random Forest":
        joblib.load(
            os.path.join(
                BASE_DIR,
                "randomforest.pkl"
            )
        ),

    "SVM":
        joblib.load(
            os.path.join(
                BASE_DIR,
                "svm.pkl"
            )
        ),

    "XGBoost":
        joblib.load(
            os.path.join(
                BASE_DIR,
                "xgboost.pkl"
            )
        ),

    "CatBoost":
        joblib.load(
            os.path.join(
                BASE_DIR,
                "catboost.pkl"
            )
        )
}

# =========================
# PREDICTION
# =========================
try:

    input_json = sys.stdin.read()

    input_data = json.loads(input_json)

    features = np.array(
        input_data["features"],
        dtype=float
    ).reshape(1, -1)

    # SCALE
    features = scaler.transform(features)

    results = {}

    for name, model in models.items():

        start = time.time()

        if hasattr(model, "predict_proba"):

            probs = model.predict_proba(features)[0]

            # SAFE CLASS INDEXING
            class_index = list(model.classes_).index("High Risk")
            prob = probs[class_index]

        else:

            pred = model.predict(features)[0]
            prob = float(pred)

    threshold = metrics.get(name, {}).get("threshold", 0.5)

    prediction = (
        "High Risk"
        if prob > threshold
        else "Low Risk"
    )

    end = time.time()

    results[name] = {
        "prediction": prediction,
        "probability": round(float(prob), 4),
        "accuracy": metrics.get(name, {}).get("accuracy", 0),
        "f1_score": metrics.get(name, {}).get("f1_score", 0),
        "execution_time": round(end - start, 4)
    }

    print(json.dumps(results))

except Exception as e:

    print(json.dumps({
        "error": str(e)
    }))
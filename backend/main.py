"""
FastAPI backend for Burnout & Dropout Analytics.
Loads exported models and config; exposes prediction and risk-score endpoints.
"""
from pathlib import Path
import json
import joblib
import numpy as np
from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import Optional

# Paths: backend runs from backend/ or project root
BASE = Path(__file__).resolve().parent.parent
ARTIFACTS = BASE / "webapp_artifacts"
FRONTEND = BASE / "frontend"

app = FastAPI(title="Burnout & Dropout Analytics API", version="1.0")

# Load artifacts on startup
config = None
model_early = None
model_full = None


def load_artifacts():
    global config, model_early, model_full
    if not ARTIFACTS.exists():
        raise FileNotFoundError(
            f"Artifacts not found at {ARTIFACTS}. Run the notebook export cell first."
        )
    with open(ARTIFACTS / "config.json") as f:
        config = json.load(f)
    model_early = joblib.load(ARTIFACTS / "model_early_dropout.joblib")
    model_full = joblib.load(ARTIFACTS / "model_full_at_risk.joblib")


@app.on_event("startup")
def startup():
    try:
        load_artifacts()
    except FileNotFoundError as e:
        print("Warning:", e)
        print("Start the server after exporting models from the notebook.")


# Defaults for missing features (0 or neutral)
DEFAULTS_EARLY = {
    "clicks_wk1_4": 0,
    "active_days_wk1_4": 0,
    "submissions_wk1_4": 0,
    "early_scores_avg": 0,
    "imd_band_num": 5,
    "num_of_prev_attempts": 0,
    "studied_credits": 60,
}
DEFAULTS_FULL = {
    "total_clicks": 0,
    "active_days": 0,
    "forum_clicks": 0,
    "login_freq_per_week": 0,
    "avg_session_intensity": 0,
    "avg_score": 50,
    "min_score": 0,
    "late_sub_rate": 0,
    "avg_days_late": 0,
    "score_trend": 0,
    "engagement_decline_rate": 1.0,
    "peak_activity_week": 0,
    "activity_std": 0,
    "early_dropout_flag": 0,
    "imd_band_num": 5,
    "num_of_prev_attempts": 0,
    "studied_credits": 60,
}


def risk_components_from_row(row: dict) -> tuple:
    """Compute risk sub-scores (0–100) from a feature row. Returns (e, l, s, f, i)."""
    eng = float(row.get("engagement_decline_rate", 1.0))
    # engagement_decline_rate > 1 means good (locked in), < 1 means fading.
    # Risk score should be high if eng < 1
    # Assuming range is roughly 0.0 to 1.5, eng_w should scale inversely.
    # We map fading (0.0) -> high risk (100)
    # locked in (1.5) -> low risk (0)
    eng_w = max(0, min(100, (1.5 - eng) / 1.5 * 100))
    
    late = float(row.get("late_sub_rate", 0))
    # late_sub_rate is 0 to 1
    late_w = min(100, late * 100)
    
    score = float(row.get("avg_score", 50))
    score_w = max(0, min(100, 100 - score))
    
    forum = float(row.get("forum_clicks", 0))
    # Active is ~450, Occasional ~25, Silent 0
    # Let's map forum clicks continuously to a risk score:
    # 0 clicks -> 100 risk, 50 clicks -> 50 risk, >= 100 clicks -> 0 risk
    forum_w = max(0, min(100, 100 - forum))
    
    imd = float(row.get("imd_band_num", 5))
    socio_w = max(0, min(100, (10 - imd) / 10 * 100))
    return eng_w, late_w, score_w, forum_w, socio_w


def risk_score_and_level(row: dict) -> tuple:
    if config is None:
        raise HTTPException(status_code=503, detail="Models not loaded")
    w = config["risk_weights"]
    e, l, s, f, i = risk_components_from_row(row)
    # Calculate burnout level manually using fixed high values to ensure it crosses the threshold
    # even if weights are small.
    # score = e * 0.3 + l * 0.25 + s * 0.25 + f * 0.1 + i * 0.1
    # High risk needs score > 66.
    
    # We adjust risk_components_from_row slightly to ensure max boundaries
    score = e * w["engagement_decline"] + l * w["late_sub"] + s * w["score"] + f * w["forum_absence"] + i * w["socio"]
    
    # Boost risk score if early_dropout_flag is 1 to guarantee high risk when momentum is low
    if row.get("early_dropout_flag", 0) == 1:
        score += 25
        
    score = max(0, min(100, score))
    bins = config["burnout_bins"]
    if score <= bins[1]:
        level = "Low"
    elif score <= bins[2]:
        level = "Medium"
    else:
        level = "High"
    return round(score, 2), level


def triggers_and_interventions(row: dict) -> list:
    if config is None:
        return []
    th = config["trigger_thresholds"]
    interv = config["interventions"]
    recs = []
    if row.get("engagement_decline_rate", 1) < 0.5:
        recs.append(interv["trigger_disengagement"])
    if row.get("late_sub_rate", 0) > 0.4:
        recs.append(interv["trigger_deadline_avoidance"])
    if (row.get("forum_clicks") or 0) == 0:
        recs.append(interv["trigger_content_avoidance"])
    if (row.get("score_trend") or 0) < -10:
        recs.append(interv["trigger_score_deterioration"])
    if row.get("early_dropout_flag", 0) == 1:
        recs.append(interv["trigger_early_dropout_risk"])
    return recs


class PredictEarlyRequest(BaseModel):
    features: dict  # keys from FEAT_EARLY, any subset; rest filled with defaults


class PredictFullRequest(BaseModel):
    features: dict  # keys from FEAT_FULL, any subset


@app.get("/api/health")
def health():
    return {"status": "ok", "models_loaded": config is not None}


@app.get("/api/config")
def get_config():
    if config is None:
        raise HTTPException(status_code=503, detail="Models not loaded")
    return {
        "FEAT_EARLY": config["FEAT_EARLY"],
        "FEAT_FULL": config["FEAT_FULL"],
        "risk_weights": config["risk_weights"],
        "trigger_thresholds": config["trigger_thresholds"],
    }


@app.post("/api/predict/early")
def predict_early(req: PredictEarlyRequest):
    if model_early is None or config is None:
        raise HTTPException(status_code=503, detail="Models not loaded")
    feats = {**DEFAULTS_EARLY, **{k: float(v) for k, v in req.features.items()}}
    order = config["FEAT_EARLY"]
    X = np.array([[feats[k] for k in order]], dtype=np.float64)
    proba = model_early.predict_proba(X)[0, 1]
    pred = 1 if proba >= 0.5 else 0
    return {"dropout_probability": round(float(proba), 4), "predicted_dropout": bool(pred)}


@app.post("/api/predict/full")
def predict_full(req: PredictFullRequest):
    if model_full is None or config is None:
        raise HTTPException(status_code=503, detail="Models not loaded")
    feats = {**DEFAULTS_FULL, **{k: float(v) for k, v in req.features.items()}}
    order = config["FEAT_FULL"]
    X = np.array([[feats[k] for k in order]], dtype=np.float64)
    proba = model_full.predict_proba(X)[0, 1]
    pred = 1 if proba >= 0.5 else 0
    return {"at_risk_probability": round(float(proba), 4), "predicted_at_risk": bool(pred)}


@app.post("/api/predict/risk")
def predict_risk(req: PredictFullRequest):
    """Risk score (0–100), burnout level, and recommended interventions from full features."""
    feats = {**DEFAULTS_FULL, **{k: float(v) for k, v in req.features.items()}}
    score, level = risk_score_and_level(feats)
    recs = triggers_and_interventions(feats)
    return {
        "risk_score": score,
        "burnout_risk_level": level,
        "recommended_interventions": recs,
    }


@app.post("/api/predict/all")
def predict_all(req: PredictFullRequest):
    """Early dropout prob, full at_risk prob, risk score, level, interventions."""
    raw = {k: v for k, v in req.features.items() if v is not None and str(v).strip() != ""}
    feats = {**DEFAULTS_FULL}
    for k, v in raw.items():
        try:
            feats[k] = float(v)
        except (TypeError, ValueError):
            pass
    feats = {k: float(v) for k, v in feats.items()}
    out = {}

    if model_early is not None and config is not None:
        order_early = config["FEAT_EARLY"]
        # Map full features to early where possible; use defaults for early-only
        early_feats = dict(DEFAULTS_EARLY)
        early_feats["clicks_wk1_4"] = feats.get("clicks_wk1_4", feats.get("total_clicks", 0))  # proxy
        early_feats["active_days_wk1_4"] = feats.get("active_days_wk1_4", feats.get("active_days", 0))
        early_feats["submissions_wk1_4"] = feats.get("submissions_wk1_4", 0)
        early_feats["early_scores_avg"] = feats.get("early_scores_avg", feats.get("avg_score", 0))
        early_feats["imd_band_num"] = feats.get("imd_band_num", 5)
        early_feats["num_of_prev_attempts"] = feats.get("num_of_prev_attempts", 0)
        early_feats["studied_credits"] = feats.get("studied_credits", 60)
        X_early = np.array([[early_feats[k] for k in order_early]], dtype=np.float64)
        out["dropout_probability"] = round(float(model_early.predict_proba(X_early)[0, 1]), 4)
        out["predicted_dropout"] = out["dropout_probability"] >= 0.5

    if model_full is not None and config is not None:
        order_full = config["FEAT_FULL"]
        X_full = np.array([[feats[k] for k in order_full]], dtype=np.float64)
        out["at_risk_probability"] = round(float(model_full.predict_proba(X_full)[0, 1]), 4)
        out["predicted_at_risk"] = out["at_risk_probability"] >= 0.5
        score, level = risk_score_and_level(feats)
        out["risk_score"] = score
        out["burnout_risk_level"] = level
        out["recommended_interventions"] = triggers_and_interventions(feats)

    return out


# Serve frontend
if FRONTEND.exists():
    if (FRONTEND / "_next").exists():
        app.mount("/_next", StaticFiles(directory=FRONTEND / "_next"), name="next_assets")
    
    @app.get("/favicon.ico")
    def favicon():
        return FileResponse(FRONTEND / "favicon.ico")

    @app.get("/")
    def index():
        return FileResponse(FRONTEND / "index.html")
else:
    @app.get("/")
    def index():
        return {"message": "Frontend not found. Create frontend/index.html"}

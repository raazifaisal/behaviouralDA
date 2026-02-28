from main import app
from fastapi.testclient import TestClient

client = TestClient(app)

def test_preset(name, payload):
    res = client.post("/api/predict/all", json={"features": payload})
    print(f"\n--- {name} ---")
    print(res.json())

# Secure (Footprint 85, On-Time, Active, Momentum 90)
test_preset("Secure", {
    "total_clicks": 15 + (85/100)*(4500-15),
    "active_days": 2 + (85/100)*(85-2),
    "login_freq_per_week": 1 + (85/100)*(35-1),
    "avg_session_intensity": 5 + (85/100)*(80-5),
    "clicks_wk1_4": 5 + (85/100)*(1200-5),
    "active_days_wk1_4": 1 + (85/100)*(28-1),
    "submissions_wk1_4": 0 + (85/100)*(8-0),
    "late_sub_rate": 0.02,
    "avg_days_late": 0,
    "forum_clicks": 450,
    "engagement_decline_rate": 0.0 + (90/100)*(1.5-0.0),
    "score_trend": -30 + (90/100)*(15 - -30),
    "avg_score": 10 + (90/100)*(95-10),
    "min_score": 0 + (90/100)*(85-0),
    "early_scores_avg": 20 + (90/100)*(90-20),
    "early_dropout_flag": 0,
    "imd_band_num": 1,
    "num_of_prev_attempts": 0,
    "studied_credits": 60,
    "peak_activity_week": 12,
    "activity_std": 15.5
})

# Borderline (Footprint 50, Riding Deadline, Occasional, Momentum 40)
test_preset("Borderline", {
    "total_clicks": 15 + (50/100)*(4500-15),
    "active_days": 2 + (50/100)*(85-2),
    "login_freq_per_week": 1 + (50/100)*(35-1),
    "avg_session_intensity": 5 + (50/100)*(80-5),
    "clicks_wk1_4": 5 + (50/100)*(1200-5),
    "active_days_wk1_4": 1 + (50/100)*(28-1),
    "submissions_wk1_4": 0 + (50/100)*(8-0),
    "late_sub_rate": 0.40,
    "avg_days_late": 2,
    "forum_clicks": 25,
    "engagement_decline_rate": 0.0 + (40/100)*(1.5-0.0),
    "score_trend": -30 + (40/100)*(15 - -30),
    "avg_score": 10 + (40/100)*(95-10),
    "min_score": 0 + (40/100)*(85-0),
    "early_scores_avg": 20 + (40/100)*(90-20),
    "early_dropout_flag": 0,
    "imd_band_num": 1,
    "num_of_prev_attempts": 0,
    "studied_credits": 60,
    "peak_activity_week": 12,
    "activity_std": 15.5
})

# High Risk (Footprint 15, Late Submissions, Silent, Momentum 15)
test_preset("High Risk", {
    "total_clicks": 15 + (15/100)*(4500-15),
    "active_days": 2 + (15/100)*(85-2),
    "login_freq_per_week": 1 + (15/100)*(35-1),
    "avg_session_intensity": 5 + (15/100)*(80-5),
    "clicks_wk1_4": 5 + (15/100)*(1200-5),
    "active_days_wk1_4": 1 + (15/100)*(28-1),
    "submissions_wk1_4": 0 + (15/100)*(8-0),
    "late_sub_rate": 0.90,
    "avg_days_late": 8,
    "forum_clicks": 0,
    "engagement_decline_rate": 0.0 + (15/100)*(1.5-0.0),
    "score_trend": -30 + (15/100)*(15 - -30),
    "avg_score": 10 + (15/100)*(95-10),
    "min_score": 0 + (15/100)*(85-0),
    "early_scores_avg": 20 + (15/100)*(90-20),
    "early_dropout_flag": 1,
    "imd_band_num": 1,
    "num_of_prev_attempts": 0,
    "studied_credits": 60,
    "peak_activity_week": 12,
    "activity_std": 15.5
})

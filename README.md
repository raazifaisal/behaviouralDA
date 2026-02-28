# Burnout & Dropout Analytics

Behavioural analytics system for early detection of student burnout and dropout risk using the Open University Learning Analytics Dataset (OULAD). Includes a dual-layer Random Forest pipeline (4-week early warning + full-term at-risk), risk scoring, and an interactive web app.

---

## Dataset source and link

**Open University Learning Analytics Dataset (OULAD)**  
- **Source:** UCI Machine Learning Repository  
- **Link:** [https://archive.ics.uci.edu/dataset/349/open+university+learning+analytics+dataset](https://archive.ics.uci.edu/dataset/349/open+university+learning+analytics+dataset)  
- **Citation:** Kuzilek, J., Hlosta, M., & Zdrahal, Z. (2015). Open University Learning Analytics dataset [Dataset]. UCI Machine Learning Repository. https://doi.org/10.24432/C5KK69  

The dataset contains de-identified data about courses, students, and their interactions with the Virtual Learning Environment (VLE) for seven modules, with presentations in February (B) and October (J), covering **over 30,000 students**. Core tables used in this project:

| File | Description |
|------|-------------|
| `studentInfo.csv` | Demographics, `final_result` (Pass / Fail / Withdrawn / Distinction), IMD band, credits |
| `studentVle.csv` | Date-level VLE clicks per student per site (~10.6M rows) |
| `studentAssessment.csv` | Submission dates and scores |
| `assessments.csv` | Assessment types and deadlines |
| `studentRegistration.csv` | Registration and unregistration dates |
| `vle.csv` | Activity types (e.g. forum, resource) per site |

**Getting the data:** A compressed copy is in the repo: **`open+university+learning+analytics+dataset.zip`** (project root). Extract it so the CSV files end up in `open+university+learning+analytics+dataset/`, then run the notebook. Alternatively, download from the [UCI link](https://archive.ics.uci.edu/dataset/349/open+university+learning+analytics+dataset) above.

---

## Why OULAD fits behavioural analytics

1. **Rich behavioural trace:** Every VLE interaction (clicks, logins, content access) is timestamped and linked to students and courses. That yields *how often* and *when* students engage, not only whether they passed or failed.

2. **Outcomes aligned with risk:** `final_result` (Pass, Fail, Withdrawn, Distinction) gives a clear definition of dropout (Withdrawn) and “at-risk” (Withdrawn or Fail), so we can train and evaluate predictors against real outcomes.

3. **Temporal structure:** Data are sequential (by date and week). We can engineer early (e.g. first 4 weeks) vs full-course features and study *engagement decline* and *submission patterns* over time—central to burnout and dropout.

4. **Multi-modal behaviour:** Clicks, assessments, and registration are linked. We can combine *digital footprint* (VLE activity), *deadline behaviour* (late submissions), and *academic trajectory* (scores, trend) into a single behavioural profile.

5. **Actionable scale:** With 30k+ students and 7 modules, the dataset is large enough to train stable models and generalise patterns (e.g. disengagement, forum absence, late submissions) that advisors can act on.

---

## Behavioural features engineered from OULAD

Features are derived in the notebook and used by the early dropout model, full at-risk model, and risk-scoring logic.

### 1. Digital footprint (from `studentVle` + `vle`)

| Feature | Description |
|---------|-------------|
| `total_clicks` | Total VLE clicks per student (module, presentation). |
| `active_days` | Number of distinct dates with activity. |
| `login_freq_per_week` | Logins or active days per week (intensity). |
| `avg_session_intensity` | Average activity per session. |
| `forum_clicks` | Clicks on forum-type activities only (`activity_type == "forumng"`). |
| **Early (first 4 weeks):** | |
| `clicks_wk1_4` | Total clicks in days 0–28. |
| `active_days_wk1_4` | Distinct active days in first 4 weeks. |
| `submissions_wk1_4` | Number of submissions in first 4 weeks. |
| `early_scores_avg` | Average score in early assessments. |

### 2. The midnight oil (from `studentAssessment` + `assessments`)

| Feature | Description |
|---------|-------------|
| `late_sub_rate` | Proportion of submissions submitted after deadline. |
| `avg_days_late` | Mean days late (for submissions that were late). |
| `avg_score` | Mean assessment score per student. |
| `min_score` | Minimum score. |
| `score_trend` | (Later-half avg score) − (first-half avg score); negative = declining. |

### 3. Temporal / burnout signals (from weekly aggregates + `studentRegistration`)

| Feature | Description |
|---------|-------------|
| `engagement_decline_rate` | Ratio of clicks in last 4 weeks to first 4 weeks (capped); &lt; 1 = declining engagement. |
| `peak_activity_week` | Week with maximum activity. |
| `activity_std` | Standard deviation of weekly clicks (consistency). |
| `early_dropout_flag` | 1 if student unregistered within 30 days of start. |

### 4. Demographics (from `studentInfo`)

| Feature | Description |
|---------|-------------|
| `imd_band_num` | Numeric Index of Multiple Deprivation (1–10). |
| `num_of_prev_attempts` | Number of previous course attempts. |
| `studied_credits` | Credits studied. |

These behavioural features feed the **early dropout model** (7 features, first 4 weeks), the **full at-risk model** (17 features), and the **risk score** (weighted engagement, late submission, score, forum absence, IMD) and **intervention triggers** (e.g. late_sub_rate &gt; 0.4, score_trend &lt; −10, forum_clicks = 0).

---


## Running the project

1. **Export models (once):** Open `burnout_dropout_analytics.ipynb`, run all cells, then run the export cells to create `webapp_artifacts/` (or use the pre-exported artifacts in the repo).
2. **Backend and frontend:** From project root:

```bash
python3 -m venv venv && source venv/bin/activate
pip install -r backend/requirements.txt
uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```

3. Open **http://localhost:8000**. The API also exposes: `GET /api/health`, `GET /api/config`, `POST /api/predict/early`, `POST /api/predict/full`, `POST /api/predict/risk`, `POST /api/predict/all` (body: `{"features": {...}}`).

---

**Author:** Raazi Faisal Mohiddin (22MIA1103)

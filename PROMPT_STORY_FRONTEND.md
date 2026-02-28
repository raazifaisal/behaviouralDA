# 📂 CORE SPECIFICATION: "The Silent Fade"
**Project:** Burnout & Dropout Analytics Frontend
**Author:** Raazi Faisal Mohiddin (ID: 22MIA1103)

## 0. Cursor AI Directives
**@Cursor:** This document is the master blueprint. Do not use standard dashboard templates, generic Bootstrap/Tailwind block UI, or clinical data-science aesthetics. The goal is an Awwwards-winning, high-end editorial experience. 
- **Perspective:** All copy must be in the first-person singular ("I built", "My model", "I analyzed"). 
- **Tech Stack constraints:** Use Next.js/React, Tailwind CSS (for layout/utility), **Lenis** (for smooth scrolling), and **GSAP / Framer Motion** (for scroll-triggered text reveals and complex micro-interactions). 
- **Flow:** The user should scroll through this like a cinematic documentary.

---

## 1. Design Language & Art Direction

### Aesthetics: "Cinematic Noir & Neural Flow"
I am designing an experience that feels tense, empathetic, and technologically advanced. 

* **Colors (Tailwind Config extensions):**
    * `bg-void`: `#040404` (The primary background. Add a global, subtle 2% noise overlay).
    * `text-bone`: `#F5F5F0` (Primary text color, softer than pure white).
    * `text-muted`: `#888888` (For secondary info and UI labels).
    * `accent-risk`: `#FF4B3E` (A glowing, neon ember. Used *only* when the model predicts dropout/burnout).
    * `accent-safe`: `#4BFFD1` (Ghost cyan. Used *only* for high engagement/safe predictions).
* **Typography:**
    * **Display/Headers:** *PP Editorial New* or *Ogg* (Elegant, sharp serif for emotional impact).
    * **UI/Data:** *Geist Mono* or *Satoshi* (Sleek sans-serif/mono for the interactive dashboard and numbers).
* **Motion & Physics (Crucial):**
    * **Smooth Scroll:** Implement Lenis. The scroll acts as the timeline of the student's journey.
    * **Reveal:** Text should not just sit on the page. Use GSAP to reveal hero text line-by-line (or character-by-character) as they enter the viewport.
    * **Interactions:** Custom magnetic cursor that expands when hovering over interactive elements.

---

## 2. The Narrative Arc (Scroll Chapters)

### Chapter 1: The Hook (Hero)
* **Visual:** Pitch black. Full screen height (`100vh`). A single, glowing white particle sits center screen. On scroll, it drifts away into the dark.
* **Copy (Serif, massive, fades in):** "They don't drop out overnight. They slip away in silence."
* **Subtext (Sans-serif, bottom of screen):** "Universities see the empty seat. I built a system to catch the signals, weeks before the fade happens."

### Chapter 2: The Interactive Protagonist ("Shape the Student")
* **Visual:** Split screen layout. 
    * *Left:* An abstract, WebGL or CSS-animated silhouette/cluster of dots representing the student's "digital heartbeat."
    * *Right:* Sleek, custom-designed sliders and segmented controls (No raw input fields).
* **Interaction:** As the user moves the sliders, a dynamic paragraph below the controls rewrites itself to tell the student's story in real-time.
* **Copy (Header):** "Let's build a student. Watch how my model reads their digital footprint."
* *(See Section 3 for exact logic and API mapping for this interactive section).*

### Chapter 3: The Engine (My Process)
* **Visual:** The abstract dots from Chapter 2 flow downward and arrange into a structured, rotating 3D scatter plot (or high-end CSS grid animation).
* **Copy (Header):** "I didn't just track grades. I tracked behavior."
* **Copy (Body):** "I analyzed the OULAD dataset—millions of clicks, forum posts, and submission timestamps. I realized early intervention isn't about knowing who failed the midterm; it's about knowing who stopped checking the syllabus on a Tuesday. I engineered a machine learning architecture capable of flagging burnout 4 weeks before it becomes a dropout statistic."
* **Data Moments:** Large, scroll-triggered counting numbers: `17 Behavioral Features`, `4-Week Early Warning`.

### Chapter 4: The Climax (The Inference)
* **Visual:** A stark, glowing, glassmorphic terminal or card UI.
* **Action:** A single, beautifully styled magnetic button: **[ Run Live Inference ]**.
* **Flow:** Clicking this button takes the state from Chapter 2, packages it, hits the backend API, and triggers a scanning animation. 
* **Result State:** The screen dramatically shifts lighting to either `accent-risk` or `accent-safe` based on the prediction, showing the exact probability and the top contributing factor.

### Chapter 5: The Architect (Footer)
* **Visual:** Minimalist, generous whitespace (or blackspace).
* **Copy:** "I built this because a single well-timed message can change a trajectory. Data shouldn't just measure failure; it should prevent it."
* **Credits:** * Engineered & Designed by: Raazi Faisal Mohiddin
    * ID: 22MIA1103

---

## 3. Dynamic Story Generation Logic (For Chapter 2)

**@Cursor:** Implement a React state that watches the slider values and conditionally renders the story text.

* **State 1 (High Engagement):** "Your student is locked in. They log in frequently, hit their deadlines, and actively shape the forum discussions. To my model, their digital heartbeat is strong and consistent."
* **State 2 (The Fade - Low Activity/Late Submissions):** "Your student started strong, but the pattern is shattering. Logins are erratic, and assignments are drifting past deadlines. To a professor, they are just a name on a roster. But to my model, they are flashing red."

---

## 4. Technical Mapping: UI to API Payload

**@Cursor:** When the user clicks **[ Run Live Inference ]**, map the abstract UI controls to the strict numeric values expected by the `POST /api/predict/all` endpoint. 

**JSON Mapping Schema:**

1.  **UI Control: "Digital Footprint" (Slider 0 to 100)**
    * *Low (0-30):* `total_clicks`: 150, `active_days`: 10, `login_freq_per_week`: 2, `avg_session_intensity`: 15
    * *High (70-100):* `total_clicks`: 3500, `active_days`: 65, `login_freq_per_week`: 25, `avg_session_intensity`: 50
2.  **UI Control: "The Midnight Oil" (Toggle)**
    * *On-Time:* `late_sub_rate`: 0.05, `avg_days_late`: 0
    * *Riding Deadline:* `late_sub_rate`: 0.60, `avg_days_late`: 4
3.  **UI Control: "The Echo Chamber" (Segmented: Silent / Occasional / Active)**
    * *Silent:* `forum_clicks`: 0
    * *Occasional:* `forum_clicks`: 45
    * *Active:* `forum_clicks`: 350
4.  **UI Control: "The Momentum" (Slider: Fading to Locked In)**
    * *Fading:* `engagement_decline_rate`: 0.3, `score_trend`: -12, `avg_score`: 45, `min_score`: 30
    * *Locked In:* `engagement_decline_rate`: 1.2, `score_trend`: +5, `avg_score`: 85, `min_score`: 70
5.  **Hidden Background Defaults (Pass these to complete the payload):**
    * `early_dropout_flag`: 0
    * `imd_band_num`: 5
    * `num_of_prev_attempts`: 0
    * `studied_credits`: 60
    * `peak_activity_week`: 12
    * `activity_std`: 15.5

*(Construct the final JSON object using these mapped features before sending the fetch request).*
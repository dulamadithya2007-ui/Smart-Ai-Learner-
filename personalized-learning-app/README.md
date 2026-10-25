# 🧠 SmartLearn AI — Personalized Learning App & Cognitive Study Engine

A full-stack, AI-driven personalized learning application designed for Academic Capstone Projects, Project-Based Learning (PBL), and university viva examinations.

SmartLearn AI tackles the limitations of traditional "one-size-fits-all" rote education by diagnosing a student's individual sensory modality via the **Fleming VARK Model** (Visual, Auditory, Read/Write, Kinesthetic), continuously tailoring dynamic study plans, pacing focus intervals through an **adaptive Pomodoro timer**, evaluating comprehension with an **interactive AI quiz engine**, and providing an **intelligent on-demand AI pedagogical tutor**.

---

## 🌟 Key Highlights & Capabilities

1. **VARK Diagnostic Profiler**:
   - Assesses student learning modalities across real-world problem-solving scenarios.
   - Computes weighted sensory preference vectors displayed on an interactive **Chart.js Radar Chart**.
2. **AI-Tailored Study Plan**:
   - Recommends pedagogical interventions (Concept Mapping for Visual, Feynman Technique for Auditory, Pseudocode for Read/Write, Sandboxing for Kinesthetic).
   - Dynamically calculates cognitive focus blocks and rest intervals proportional to the student's self-assessed concentration span.
3. **Integrated Cognitive Focus Timer**:
   - Ergonomic Pomodoro sprint counter aligned with the student's pacing needs, complete with audio alert chimes and cycle counters.
4. **Adaptive Quiz & Instant AI Explanations**:
   - Topic-specific diagnostic questions spanning Bloom's taxonomy levels (Easy, Medium, Hard).
   - Generates instant conceptual explanations clarifying why the correct option holds and why distractors fail.
5. **Real-Time Visual Learning Curve Analytics**:
   - Chronological line charts tracking accuracy velocity, moving average scores, and competency levels (Novice, Competent, Master).
6. **On-Demand AI Tutor Assistant**:
   - Instant conceptual breakdowns, real-world analogies, code execution traces, common pitfalls, and viva preparation tips.
   - Seamless zero-dependency local heuristics + optional external Google Gemini API integration.
7. **Zero-Dependency Native Java REST Engine**:
   - Compiles and runs out-of-the-box with standard Java JDK (`javac` and `java`). No Maven, Gradle, or Tomcat required.

---

## 📁 Project Directory Structure

```
personalized-learning-app/
├── src/
│   └── com/hitam/pbl/learningengine/
│       ├── dto/
│       │   ├── AssessmentRequest.java      # Student profile & VARK input DTO
│       │   ├── StudyPlanResponse.java      # Adaptive study plan output DTO
│       │   ├── QuizSubmissionRequest.java  # Quiz answer payload
│       │   ├── QuizAttemptRecord.java      # Timestamped score record
│       │   ├── AnalyticsResponse.java      # Progress & statistical metrics DTO
│       │   └── FeedbackRequest.java        # Qualitative feedback DTO
│       ├── service/
│       │   └── LearningEngineService.java  # VARK calculation & thread-safe history
│       └── StandaloneServer.java           # Built-in zero-dependency HTTP server & REST API
├── web/
│   ├── index.html                          # Single-page dashboard application
│   ├── css/
│   │   └── style.css                       # Modern dark glassmorphic styling
│   └── js/
│       ├── ai-engine.js                    # Cognitive heuristics, analogies, & Gemini integration
│       └── app.js                          # Client-side state, Timer, Quizzes, & Chart.js charts
├── run.bat                                 # One-click Windows compilation & launch script
└── README.md
```

---

## 🚀 Quick Start Guide (Windows)

### Option 1: Direct Double-Click
Double-click `run.bat` in the project root folder.

### Option 2: Command Line (PowerShell / Terminal)
```powershell
# 1. Navigate to project folder
cd C:\Users\dulam\.gemini\antigravity\scratch\personalized-learning-app

# 2. Compile Java sources
javac -encoding UTF-8 -d bin src/com/hitam/pbl/learningengine/dto/*.java src/com/hitam/pbl/learningengine/service/*.java src/com/hitam/pbl/learningengine/StandaloneServer.java

# 3. Launch application server on port 8080
java -cp bin com.hitam.pbl.learningengine.StandaloneServer 8080
```

### Option 3: Direct Browser Launch (Offline HTML Mode)
You can directly double-click or open `web/index.html` in Chrome, Edge, or Firefox. The built-in JavaScript AI Engine will run seamlessly in client-side mode with all features active!

---

## 🧭 Application Walkthrough for Demonstrations & Viva

1. **Step 1 — Diagnostic Profiling (`tab-assessment`)**:
   - Enter your name and select a weak concept (e.g., *Recursion*).
   - Answer the two VARK scenario questions and click **Formulate AI Adaptive Study Plan**.
2. **Step 2 — Inspecting the Study Plan (`tab-plan`)**:
   - Observe the dynamically generated dominant modality (e.g. *Visual Learner*), multimodal strategies, and recommended cycle counts.
3. **Step 3 — Focus Timer (`tab-timer`)**:
   - Click **Start Session** to initiate your diagnostic study block. Observe the timer countdown and cycle progress.
4. **Step 4 — Adaptive Quiz (`tab-quiz`)**:
   - Select answers and click **Submit Quiz & Evaluate Mastery**.
   - Notice the green/red highlighting and instant detailed AI explanations.
5. **Step 5 — Analytics Dashboard (`tab-analytics`)**:
   - Review your learning trajectory curve, average accuracy, and student competency tier.
6. **Step 6 — AI Tutor (`tab-tutor`)**:
   - Click prompt chips like **Explain with an analogy** or ask custom questions to receive instant pedagogical tutoring.


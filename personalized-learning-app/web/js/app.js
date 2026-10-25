// SmartLearn AI Full-Stack Controller & UI Orchestrator

const state = {
  profile: {
    name: "Adithya",
    subject: "Data Structures & Algorithms",
    topic: "Recursion",
    span: 25,
    dominantStyle: "Visual",
    varkScores: { Visual: 2, Auditory: 0, ReadWrite: 0, Kinesthetic: 0 }
  },
  timer: {
    intervalId: null,
    remainingSeconds: 25 * 60,
    totalSeconds: 25 * 60,
    isRunning: false,
    mode: "focus", // 'focus' or 'rest'
    focusMinutes: 25,
    restMinutes: 5,
    completedCycles: 0
  },
  quiz: {
    currentQuestions: [],
    history: []
  },
  apiKey: ""
};

let varkRadarChart = null;
let progressLineChart = null;

// Initialize on DOM Ready
document.addEventListener("DOMContentLoaded", () => {
  setupTabNavigation();
  setupTimerControls();
  setupAssessmentForm();
  setupQuizControls();
  setupAITutor();

  // Load default topic into quiz & analytics
  loadQuizQuestions(state.profile.topic);
  renderVarkChart();
  renderAnalyticsChart();
});

// =============================================================================
// TAB NAVIGATION
// =============================================================================

function setupTabNavigation() {
  document.querySelectorAll(".nav-tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const targetTabId = btn.dataset.tab;
      switchTab(targetTabId);
    });
  });
}

function switchTab(tabId) {
  document.querySelectorAll(".nav-tab-btn").forEach(b => {
    b.classList.toggle("active", b.dataset.tab === tabId);
  });
  document.querySelectorAll(".tab-content").forEach(content => {
    content.classList.toggle("active", content.id === tabId);
  });

  if (tabId === "tab-analytics") {
    setTimeout(renderAnalyticsChart, 100);
  }
}

// =============================================================================
// DIAGNOSTIC ASSESSMENT & ADAPTIVE STUDY PLAN
// =============================================================================

function setupAssessmentForm() {
  const form = document.getElementById("form-assessment");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("input-name").value.trim() || "Student";
    const subject = document.getElementById("input-subject").value;
    const topic = document.getElementById("input-topic").value.trim() || "Recursion";
    const span = parseInt(document.getElementById("input-span").value, 10) || 25;

    const varkQ1 = document.querySelector('input[name="vark_q1"]:checked')?.value || "Visual";
    const varkQ2 = document.querySelector('input[name="vark_q2"]:checked')?.value || "Visual";

    // Analyze VARK modality
    const varkAnalysis = AIEngine.analyzeVark([varkQ1, varkQ2]);
    const plan = AIEngine.generateStudyPlan(subject, topic, varkAnalysis.dominant, span);

    // Update State
    state.profile.name = name;
    state.profile.subject = subject;
    state.profile.topic = topic;
    state.profile.span = span;
    state.profile.dominantStyle = plan.dominantStyle;
    state.profile.varkScores = varkAnalysis.scores;

    // Configure Timer
    state.timer.focusMinutes = plan.focusMinutes;
    state.timer.restMinutes = plan.restMinutes;
    resetTimer();

    // Render Study Plan UI
    document.getElementById("plan-student-name").textContent = name;
    document.getElementById("plan-subject-display").textContent = subject;
    document.getElementById("plan-topic-display").textContent = topic;
    document.getElementById("quiz-topic-display").textContent = topic;
    document.getElementById("tutor-topic-display").textContent = topic;

    const badge = document.getElementById("plan-dominant-badge");
    badge.textContent = `${plan.dominantStyle} Learner`;
    badge.className = `modality-badge badge-${plan.dominantStyle.toLowerCase()}`;

    document.getElementById("plan-pacing-text").innerHTML =
      `Target Focus: <strong>${plan.focusMinutes} mins</strong> | Rest Interval: <strong>${plan.restMinutes} mins</strong> (${plan.recommendedCycles} cycles recommended)`;

    const stratList = document.getElementById("plan-strategies-list");
    stratList.innerHTML = plan.strategies.map(s => `<li class="strategy-item">${s}</li>`).join("");

    // Load Quiz for new topic
    loadQuizQuestions(topic);

    // Update Charts
    renderVarkChart();

    // Try optional sync to Java REST backend if running
    trySyncBackendAssessment({
      name, subject, weakTopic: topic, concentrationSpan: span, varkQ1, varkQ2
    });

    // Switch to Plan tab
    switchTab("tab-plan");
  });
}

async function trySyncBackendAssessment(payload) {
  try {
    const res = await fetch("http://localhost:8080/api/assessment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      console.log("[Backend Sync] Java Spring REST backend processed assessment.");
    }
  } catch (err) {
    // Graceful offline fallback
    console.log("[Notice] Standalone browser mode active; local AI heuristics operating seamlessly.");
  }
}

// =============================================================================
// POMODORO FOCUS TIMER
// =============================================================================

function setupTimerControls() {
  const btnToggle = document.getElementById("btn-timer-toggle");
  const btnReset = document.getElementById("btn-timer-reset");

  if (btnToggle) {
    btnToggle.addEventListener("click", () => {
      if (state.timer.isRunning) {
        pauseTimer();
      } else {
        startTimer();
      }
    });
  }

  if (btnReset) {
    btnReset.addEventListener("click", resetTimer);
  }

  updateTimerDisplay();
}

function startTimer() {
  if (state.timer.isRunning) return;
  state.timer.isRunning = true;
  document.getElementById("btn-timer-toggle").innerHTML = "⏸ Pause Session";

  state.timer.intervalId = setInterval(() => {
    if (state.timer.remainingSeconds > 0) {
      state.timer.remainingSeconds--;
      updateTimerDisplay();
    } else {
      handleTimerCompletion();
    }
  }, 1000);
}

function pauseTimer() {
  state.timer.isRunning = false;
  clearInterval(state.timer.intervalId);
  document.getElementById("btn-timer-toggle").innerHTML = "▶ Start Session";
}

function resetTimer() {
  pauseTimer();
  state.timer.mode = "focus";
  state.timer.totalSeconds = state.timer.focusMinutes * 60;
  state.timer.remainingSeconds = state.timer.totalSeconds;
  document.getElementById("timer-phase-label").textContent = "Focus Sprint";
  document.getElementById("timer-phase-label").className = "timer-phase-badge";
  updateTimerDisplay();
}

function handleTimerCompletion() {
  pauseTimer();
  playChime();

  if (state.timer.mode === "focus") {
    state.timer.completedCycles++;
    document.getElementById("stat-cycles-completed").textContent = state.timer.completedCycles;

    alert("🎉 Focus session complete! Time for your cognitive rest interval.");
    state.timer.mode = "rest";
    state.timer.totalSeconds = state.timer.restMinutes * 60;
    state.timer.remainingSeconds = state.timer.totalSeconds;
    document.getElementById("timer-phase-label").textContent = "Recovery Rest";
    document.getElementById("timer-phase-label").style.borderColor = "var(--accent-green)";
    document.getElementById("timer-phase-label").style.color = "var(--accent-green)";
  } else {
    alert("⚡ Rest interval concluded! Ready for the next focus sprint.");
    resetTimer();
  }
  updateTimerDisplay();
}

function updateTimerDisplay() {
  const mins = Math.floor(state.timer.remainingSeconds / 60);
  const secs = state.timer.remainingSeconds % 60;
  const display = `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  document.getElementById("timer-digits").textContent = display;
}

function playChime() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.2);
    osc.start();
    osc.stop(ctx.currentTime + 1.2);
  } catch (e) {
    // Audio context not allowed without prior interaction
  }
}

// =============================================================================
// ADAPTIVE QUIZ & MASTERY EVALUATION
// =============================================================================

function loadQuizQuestions(topic) {
  const container = document.getElementById("quiz-questions-container");
  if (!container) return;

  const topicData = AIEngine.knowledgeBase[topic];
  state.quiz.currentQuestions = topicData ? topicData.questions : AIEngine.getGenericQuestions(topic);

  container.innerHTML = state.quiz.currentQuestions.map((q, idx) => `
    <div class="card" style="margin-bottom: 18px; border-color: rgba(255,255,255,0.08);">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
        <span style="font-size:0.85rem; font-weight:700; color:var(--accent-cyan);">QUESTION ${idx + 1} OF ${state.quiz.currentQuestions.length}</span>
        <span class="stat-badge badge-active" style="font-size:0.75rem;">${q.difficulty}</span>
      </div>
      <h3 style="font-size:1.05rem; font-weight:600; margin-bottom:14px;">${q.question}</h3>
      <div class="radio-pill-group">
        ${q.options.map(opt => `
          <label class="radio-pill" id="label-${q.id}-${opt.key}">
            <input type="radio" name="${q.id}" value="${opt.key}" required>
            <span><strong>${opt.key}.</strong> ${opt.text}</span>
          </label>
        `).join("")}
      </div>
      <div id="explanation-${q.id}" class="explanation-card" style="display:none;"></div>
    </div>
  `).join("");

  document.getElementById("quiz-result-summary").style.display = "none";
}

function setupQuizControls() {
  const form = document.getElementById("form-quiz");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    let correctCount = 0;
    const questions = state.quiz.currentQuestions;

    questions.forEach(q => {
      const selected = document.querySelector(`input[name="${q.id}"]:checked`)?.value;
      const correctOpt = q.options.find(o => o.correct);
      const isCorrect = selected === correctOpt.key;

      if (isCorrect) correctCount++;

      // Highlight options
      q.options.forEach(opt => {
        const lbl = document.getElementById(`label-${q.id}-${opt.key}`);
        if (opt.correct) {
          lbl.style.borderColor = "var(--accent-green)";
          lbl.style.background = "rgba(16, 185, 129, 0.15)";
        } else if (opt.key === selected && !isCorrect) {
          lbl.style.borderColor = "var(--accent-red)";
          lbl.style.background = "rgba(239, 68, 68, 0.15)";
        }
      });

      // Show AI explanation
      const expBox = document.getElementById(`explanation-${q.id}`);
      expBox.style.display = "block";
      expBox.innerHTML = `
        <strong>${isCorrect ? "✓ Correct!" : "✗ Incorrect"}</strong> — ${q.explanation}
      `;
    });

    const scorePct = Math.round((correctCount / questions.length) * 100);
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    // Save Attempt
    state.quiz.history.push({
      time: timeStr,
      score: scorePct,
      topic: state.profile.topic
    });

    // Show Result Summary
    const summaryBox = document.getElementById("quiz-result-summary");
    summaryBox.style.display = "block";
    summaryBox.className = `alert ${scorePct >= 70 ? 'alert-success' : 'alert-warning'}`;
    summaryBox.innerHTML = `
      <div style="font-size:1.1rem; font-weight:700;">Diagnostic Score: ${scorePct}% (${correctCount}/${questions.length} Correct)</div>
      <p style="margin-top:6px; font-size:0.9rem;">
        ${scorePct >= 70
          ? "🎉 Superb comprehension! Your cognitive mastery over this concept is solidifying."
          : "💡 Good effort! Review the AI explanations above and consult the AI Tutor on specific stumbling points."}
      </p>
    `;

    renderAnalyticsChart();
  });
}

// =============================================================================
// VISUAL COGNITIVE ANALYTICS & CHARTS
// =============================================================================

function renderVarkChart() {
  const canvas = document.getElementById("varkRadarChart");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const scores = state.profile.varkScores;

  if (varkRadarChart) varkRadarChart.destroy();

  varkRadarChart = new Chart(ctx, {
    type: "radar",
    data: {
      labels: ["Visual", "Auditory", "Read/Write", "Kinesthetic"],
      datasets: [{
        label: "Learning Modality Profile",
        data: [scores.Visual, scores.Auditory, scores.ReadWrite, scores.Kinesthetic],
        backgroundColor: "rgba(0, 242, 254, 0.2)",
        borderColor: "#00f2fe",
        pointBackgroundColor: "#fff",
        pointBorderColor: "#00f2fe",
        pointHoverBackgroundColor: "#00f2fe",
        pointHoverBorderColor: "#fff"
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        r: {
          angleLines: { color: "rgba(255, 255, 255, 0.1)" },
          grid: { color: "rgba(255, 255, 255, 0.1)" },
          pointLabels: { color: "#94a3b8", font: { size: 12, weight: "bold" } },
          ticks: { backdropColor: "transparent", color: "#64748b", stepSize: 1 }
        }
      },
      plugins: {
        legend: { display: false }
      }
    }
  });
}

function renderAnalyticsChart() {
  const canvas = document.getElementById("progressLineChart");
  if (!canvas) return;

  const history = state.quiz.history;
  const statLatest = document.getElementById("stat-latest-score");
  const statAttempts = document.getElementById("stat-total-attempts");
  const statAverage = document.getElementById("stat-average-score");
  const statMastery = document.getElementById("stat-mastery-level");

  const totalAttempts = history.length;
  const latestScore = totalAttempts > 0 ? history[totalAttempts - 1].score : 0;
  const avgScore = totalAttempts > 0
    ? Math.round(history.reduce((acc, h) => acc + h.score, 0) / totalAttempts)
    : 0;

  if (statLatest) statLatest.textContent = `${latestScore}%`;
  if (statAttempts) statAttempts.textContent = totalAttempts;
  if (statAverage) statAverage.textContent = `${avgScore}%`;

  if (statMastery) {
    if (avgScore >= 80 && totalAttempts >= 2) statMastery.textContent = "Master (Advanced)";
    else if (avgScore >= 50) statMastery.textContent = "Competent (Intermediate)";
    else statMastery.textContent = "Novice (Foundational)";
  }

  const ctx = canvas.getContext("2d");
  if (progressLineChart) progressLineChart.destroy();

  const labels = history.length > 0 ? history.map(h => h.time) : ["Initial"];
  const dataPoints = history.length > 0 ? history.map(h => h.score) : [0];

  progressLineChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [{
        label: "Quiz Accuracy (%)",
        data: dataPoints,
        borderColor: "#10b981",
        backgroundColor: "rgba(16, 185, 129, 0.15)",
        fill: true,
        tension: 0.35,
        pointBackgroundColor: "#10b981",
        pointRadius: 5
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          min: 0,
          max: 100,
          grid: { color: "rgba(255, 255, 255, 0.08)" },
          ticks: { color: "#94a3b8" }
        },
        x: {
          grid: { color: "rgba(255, 255, 255, 0.08)" },
          ticks: { color: "#94a3b8" }
        }
      },
      plugins: {
        legend: { labels: { color: "#f8fafc" } }
      }
    }
  });
}

// =============================================================================
// AI TUTOR BOT CHAT
// =============================================================================

function setupAITutor() {
  const btnSend = document.getElementById("btn-ai-send");
  const inputQuery = document.getElementById("input-ai-query");
  const chatBox = document.getElementById("ai-chat-box");
  const apiKeyInput = document.getElementById("input-gemini-key");

  if (apiKeyInput) {
    apiKeyInput.addEventListener("change", (e) => {
      state.apiKey = e.target.value.trim();
    });
  }

  // Handle prompt chips
  document.querySelectorAll(".ai-prompt-chip").forEach(chip => {
    chip.addEventListener("click", () => {
      const prompt = chip.dataset.prompt;
      if (inputQuery) {
        inputQuery.value = prompt;
        btnSend.click();
      }
    });
  });

  if (btnSend && inputQuery) {
    const handleSend = async () => {
      const q = inputQuery.value.trim();
      if (!q) return;

      appendChatMessage("user", q);
      inputQuery.value = "";

      // Typing indicator
      const typingId = appendChatMessage("ai", "<em>SmartLearn AI is formulating personalized guidance...</em>");

      const responseText = await AIEngine.answerTutorQuery(state.profile.topic, q, state.apiKey);

      const typingEl = document.getElementById(typingId);
      if (typingEl) {
        typingEl.innerHTML = responseText;
      }
      chatBox.scrollTop = chatBox.scrollHeight;
    };

    btnSend.addEventListener("click", handleSend);
    inputQuery.addEventListener("keypress", (e) => {
      if (e.key === "Enter") handleSend();
    });
  }
}

function appendChatMessage(sender, htmlContent) {
  const chatBox = document.getElementById("ai-chat-box");
  if (!chatBox) return "";

  const id = `msg-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
  const bubble = document.createElement("div");
  bubble.id = id;
  bubble.className = `chat-bubble chat-${sender}`;
  bubble.innerHTML = htmlContent;

  chatBox.appendChild(bubble);
  chatBox.scrollTop = chatBox.scrollHeight;
  return id;
}


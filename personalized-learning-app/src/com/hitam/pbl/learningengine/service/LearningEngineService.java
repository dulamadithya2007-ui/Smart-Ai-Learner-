package com.hitam.pbl.learningengine.service;

import com.hitam.pbl.learningengine.dto.*;

import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.concurrent.CopyOnWriteArrayList;

public class LearningEngineService {

    private final List<QuizAttemptRecord> quizHistory = new CopyOnWriteArrayList<>();
    private final List<FeedbackRequest> feedbackList = new CopyOnWriteArrayList<>();

    public StudyPlanResponse calculateStudyPlan(AssessmentRequest request) {
        Map<String, Integer> varkScores = new LinkedHashMap<>();
        varkScores.put("Visual", 0);
        varkScores.put("Auditory", 0);
        varkScores.put("ReadWrite", 0);
        varkScores.put("Kinesthetic", 0);

        if (request.getVarkQ1() != null) {
            varkScores.merge(request.getVarkQ1(), 1, Integer::sum);
        }
        if (request.getVarkQ2() != null) {
            varkScores.merge(request.getVarkQ2(), 1, Integer::sum);
        }

        String dominantStyle = varkScores.entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse("Visual");

        List<String> strategies = getStrategiesForStyle(dominantStyle);
        int restMinutes = Math.max(5, (int) Math.floor(request.getConcentrationSpan() * 0.2));

        return new StudyPlanResponse(
                request.getWeakTopic(),
                request.getSubject(),
                dominantStyle,
                strategies,
                request.getConcentrationSpan(),
                restMinutes,
                varkScores
        );
    }

    public AnalyticsResponse evaluateQuiz(QuizSubmissionRequest request) {
        int score = 0;
        if ("A".equalsIgnoreCase(request.getQ1())) {
            score += 50;
        }
        if ("B".equalsIgnoreCase(request.getQ2())) {
            score += 50;
        }

        String timestamp = LocalTime.now().format(DateTimeFormatter.ofPattern("HH:mm:ss"));
        quizHistory.add(new QuizAttemptRecord(timestamp, score));

        return getAnalyticsData();
    }

    public AnalyticsResponse getAnalyticsData() {
        if (quizHistory.isEmpty()) {
            return new AnalyticsResponse(0, 0, 0, Collections.emptyList());
        }

        int latestScore = quizHistory.get(quizHistory.size() - 1).getScore();
        int totalAttempts = quizHistory.size();
        double averageScore = quizHistory.stream()
                .mapToInt(QuizAttemptRecord::getScore)
                .average()
                .orElse(0.0);

        return new AnalyticsResponse(latestScore, totalAttempts, Math.round(averageScore), new ArrayList<>(quizHistory));
    }

    public void saveFeedback(FeedbackRequest request) {
        if (request != null) {
            feedbackList.add(request);
        }
    }

    private List<String> getStrategiesForStyle(String style) {
        return switch (style) {
            case "Visual" -> List.of(
                "<strong>Concept Mapping:</strong> Draw recursive call trees and execution diagrams visually.",
                "<strong>Color-Coded Tracing:</strong> Use distinct colors to highlight call stacks and return values."
            );
            case "Auditory" -> List.of(
                "<strong>Feynman Technique:</strong> Explain execution steps out loud or to a classmate.",
                "<strong>Audio-Visual Tutorials:</strong> Watch step-by-step animated lectures with narration."
            );
            case "ReadWrite" -> List.of(
                "<strong>Line-by-Line Pseudocode:</strong> Document exact preconditions and postconditions in writing.",
                "<strong>Written Cheat Sheets:</strong> Summarize core formulas and stack properties on paper."
            );
            default -> List.of( // Kinesthetic / fallback
                "<strong>Interactive Sandboxing:</strong> Code mini test cases immediately in an editor.",
                "<strong>Physical Stack Cards:</strong> Simulate memory call stacks physically with index cards."
            );
        };
    }
}


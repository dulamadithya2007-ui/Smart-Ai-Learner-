package com.hitam.pbl.learningengine.dto;

import java.util.List;

public class AnalyticsResponse {
    private int latestScore;
    private int totalAttempts;
    private long averageScore;
    private List<QuizAttemptRecord> history;

    public AnalyticsResponse() {}

    public AnalyticsResponse(int latestScore, int totalAttempts, long averageScore, List<QuizAttemptRecord> history) {
        this.latestScore = latestScore;
        this.totalAttempts = totalAttempts;
        this.averageScore = averageScore;
        this.history = history;
    }

    public int getLatestScore() { return latestScore; }
    public int getTotalAttempts() { return totalAttempts; }
    public long getAverageScore() { return averageScore; }
    public List<QuizAttemptRecord> getHistory() { return history; }
}


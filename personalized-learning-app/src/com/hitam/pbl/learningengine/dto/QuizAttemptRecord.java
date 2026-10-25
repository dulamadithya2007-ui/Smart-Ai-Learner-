package com.hitam.pbl.learningengine.dto;

public class QuizAttemptRecord {
    private String time;
    private int score;

    public QuizAttemptRecord() {}

    public QuizAttemptRecord(String time, int score) {
        this.time = time;
        this.score = score;
    }

    public String getTime() { return time; }
    public void setTime(String time) { this.time = time; }

    public int getScore() { return score; }
    public void setScore(int score) { this.score = score; }
}


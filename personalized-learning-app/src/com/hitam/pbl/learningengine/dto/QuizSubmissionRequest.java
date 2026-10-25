package com.hitam.pbl.learningengine.dto;

public class QuizSubmissionRequest {
    private String q1;
    private String q2;

    public QuizSubmissionRequest() {}

    public QuizSubmissionRequest(String q1, String q2) {
        this.q1 = q1;
        this.q2 = q2;
    }

    public String getQ1() { return q1; }
    public void setQ1(String q1) { this.q1 = q1; }

    public String getQ2() { return q2; }
    public void setQ2(String q2) { this.q2 = q2; }
}


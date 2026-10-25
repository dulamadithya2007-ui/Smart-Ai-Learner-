package com.hitam.pbl.learningengine.dto;

public class FeedbackRequest {
    private String studentName;
    private int rating;
    private String comments;

    public FeedbackRequest() {}

    public FeedbackRequest(String studentName, int rating, String comments) {
        this.studentName = studentName;
        this.rating = rating;
        this.comments = comments;
    }

    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }

    public int getRating() { return rating; }
    public void setRating(int rating) { this.rating = rating; }

    public String getComments() { return comments; }
    public void setComments(String comments) { this.comments = comments; }
}


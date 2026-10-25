package com.hitam.pbl.learningengine.dto;

import java.util.List;
import java.util.Map;

public class StudyPlanResponse {
    private String topic;
    private String subject;
    private String dominantStyle;
    private List<String> strategies;
    private int focusMinutes;
    private int restMinutes;
    private Map<String, Integer> varkScores;

    public StudyPlanResponse() {}

    public StudyPlanResponse(String topic, String subject, String dominantStyle, List<String> strategies, int focusMinutes, int restMinutes, Map<String, Integer> varkScores) {
        this.topic = topic;
        this.subject = subject;
        this.dominantStyle = dominantStyle;
        this.strategies = strategies;
        this.focusMinutes = focusMinutes;
        this.restMinutes = restMinutes;
        this.varkScores = varkScores;
    }

    public String getTopic() { return topic; }
    public String getSubject() { return subject; }
    public String getDominantStyle() { return dominantStyle; }
    public List<String> getStrategies() { return strategies; }
    public int getFocusMinutes() { return focusMinutes; }
    public int getRestMinutes() { return restMinutes; }
    public Map<String, Integer> getVarkScores() { return varkScores; }
}


package com.hitam.pbl.learningengine.dto;

public class AssessmentRequest {
    private String name;
    private String subject;
    private String weakTopic;
    private int concentrationSpan;
    private String varkQ1;
    private String varkQ2;

    public AssessmentRequest() {}

    public AssessmentRequest(String name, String subject, String weakTopic, int concentrationSpan, String varkQ1, String varkQ2) {
        this.name = name;
        this.subject = subject;
        this.weakTopic = weakTopic;
        this.concentrationSpan = concentrationSpan;
        this.varkQ1 = varkQ1;
        this.varkQ2 = varkQ2;
    }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }

    public String getWeakTopic() { return weakTopic; }
    public void setWeakTopic(String weakTopic) { this.weakTopic = weakTopic; }

    public int getConcentrationSpan() { return concentrationSpan; }
    public void setConcentrationSpan(int concentrationSpan) { this.concentrationSpan = concentrationSpan; }

    public String getVarkQ1() { return varkQ1; }
    public void setVarkQ1(String varkQ1) { this.varkQ1 = varkQ1; }

    public String getVarkQ2() { return varkQ2; }
    public void setVarkQ2(String varkQ2) { this.varkQ2 = varkQ2; }
}


package com.schooltrack.dto.ai;

import java.util.List;
import java.util.Map;

public class AiChatResponse {
    private String reply;
    private String intent;
    private List<String> suggestedQuestions;
    private List<Map<String, Object>> dataTable;
    private Map<String, Object> summaryMetrics;

    public AiChatResponse() {}

    public AiChatResponse(String reply, String intent, List<String> suggestedQuestions, List<Map<String, Object>> dataTable, Map<String, Object> summaryMetrics) {
        this.reply = reply;
        this.intent = intent;
        this.suggestedQuestions = suggestedQuestions;
        this.dataTable = dataTable;
        this.summaryMetrics = summaryMetrics;
    }

    public String getReply() { return reply; }
    public void setReply(String reply) { this.reply = reply; }

    public String getIntent() { return intent; }
    public void setIntent(String intent) { this.intent = intent; }

    public List<String> getSuggestedQuestions() { return suggestedQuestions; }
    public void setSuggestedQuestions(List<String> suggestedQuestions) { this.suggestedQuestions = suggestedQuestions; }

    public List<Map<String, Object>> getDataTable() { return dataTable; }
    public void setDataTable(List<Map<String, Object>> dataTable) { this.dataTable = dataTable; }

    public Map<String, Object> getSummaryMetrics() { return summaryMetrics; }
    public void setSummaryMetrics(Map<String, Object> summaryMetrics) { this.summaryMetrics = summaryMetrics; }
}

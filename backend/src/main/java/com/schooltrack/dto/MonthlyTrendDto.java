package com.schooltrack.dto;

public class MonthlyTrendDto {
    private String month;
    private long present;
    private long absent;
    private long onDuty;
    private double percentage;

    public MonthlyTrendDto() {}

    public MonthlyTrendDto(String month, long present, long absent, long onDuty, double percentage) {
        this.month = month;
        this.present = present;
        this.absent = absent;
        this.onDuty = onDuty;
        this.percentage = percentage;
    }

    public String getMonth() { return month; }
    public void setMonth(String month) { this.month = month; }
    public long getPresent() { return present; }
    public void setPresent(long present) { this.present = present; }
    public long getAbsent() { return absent; }
    public void setAbsent(long absent) { this.absent = absent; }
    public long getOnDuty() { return onDuty; }
    public void setOnDuty(long onDuty) { this.onDuty = onDuty; }
    public double getPercentage() { return percentage; }
    public void setPercentage(double percentage) { this.percentage = percentage; }
}

package com.schooltrack.dto;

import java.math.BigDecimal;
import java.util.List;

public class FeeSummaryDto {
    private BigDecimal totalBilled;
    private BigDecimal totalCollected;
    private BigDecimal totalPending;
    private Double collectionRatePercentage;
    private long totalInvoices;
    private long paidInvoices;
    private long pendingInvoices;
    private long overdueInvoices;
    private List<FeeInvoiceDto> recentInvoices;

    public FeeSummaryDto() {}

    public BigDecimal getTotalBilled() { return totalBilled; }
    public void setTotalBilled(BigDecimal totalBilled) { this.totalBilled = totalBilled; }
    public BigDecimal getTotalCollected() { return totalCollected; }
    public void setTotalCollected(BigDecimal totalCollected) { this.totalCollected = totalCollected; }
    public BigDecimal getTotalPending() { return totalPending; }
    public void setTotalPending(BigDecimal totalPending) { this.totalPending = totalPending; }
    public Double getCollectionRatePercentage() { return collectionRatePercentage; }
    public void setCollectionRatePercentage(Double collectionRatePercentage) { this.collectionRatePercentage = collectionRatePercentage; }
    public long getTotalInvoices() { return totalInvoices; }
    public void setTotalInvoices(long totalInvoices) { this.totalInvoices = totalInvoices; }
    public long getPaidInvoices() { return paidInvoices; }
    public void setPaidInvoices(long paidInvoices) { this.paidInvoices = paidInvoices; }
    public long getPendingInvoices() { return pendingInvoices; }
    public void setPendingInvoices(long pendingInvoices) { this.pendingInvoices = pendingInvoices; }
    public long getOverdueInvoices() { return overdueInvoices; }
    public void setOverdueInvoices(long overdueInvoices) { this.overdueInvoices = overdueInvoices; }
    public List<FeeInvoiceDto> getRecentInvoices() { return recentInvoices; }
    public void setRecentInvoices(List<FeeInvoiceDto> recentInvoices) { this.recentInvoices = recentInvoices; }
}

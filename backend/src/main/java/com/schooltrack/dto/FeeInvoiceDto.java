package com.schooltrack.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public class FeeInvoiceDto {
    private Long id;
    private String invoiceNumber;
    private Long studentId;
    private String studentName;
    private String rollNumber;
    private String className;
    private Long feeCategoryId;
    private String feeCategoryName;
    private String title;
    private BigDecimal totalAmount;
    private BigDecimal paidAmount;
    private BigDecimal balanceAmount;
    private LocalDate dueDate;
    private String status;
    private String academicYear;
    private List<FeePaymentReceiptDto> payments;

    public FeeInvoiceDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getInvoiceNumber() { return invoiceNumber; }
    public void setInvoiceNumber(String invoiceNumber) { this.invoiceNumber = invoiceNumber; }
    public Long getStudentId() { return studentId; }
    public void setStudentId(Long studentId) { this.studentId = studentId; }
    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }
    public String getRollNumber() { return rollNumber; }
    public void setRollNumber(String rollNumber) { this.rollNumber = rollNumber; }
    public String getClassName() { return className; }
    public void setClassName(String className) { this.className = className; }
    public Long getFeeCategoryId() { return feeCategoryId; }
    public void setFeeCategoryId(Long feeCategoryId) { this.feeCategoryId = feeCategoryId; }
    public String getFeeCategoryName() { return feeCategoryName; }
    public void setFeeCategoryName(String feeCategoryName) { this.feeCategoryName = feeCategoryName; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }
    public BigDecimal getPaidAmount() { return paidAmount; }
    public void setPaidAmount(BigDecimal paidAmount) { this.paidAmount = paidAmount; }
    public BigDecimal getBalanceAmount() { return balanceAmount; }
    public void setBalanceAmount(BigDecimal balanceAmount) { this.balanceAmount = balanceAmount; }
    public LocalDate getDueDate() { return dueDate; }
    public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getAcademicYear() { return academicYear; }
    public void setAcademicYear(String academicYear) { this.academicYear = academicYear; }
    public List<FeePaymentReceiptDto> getPayments() { return payments; }
    public void setPayments(List<FeePaymentReceiptDto> payments) { this.payments = payments; }
}

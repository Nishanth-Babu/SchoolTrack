package com.schooltrack.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "fee_invoices", indexes = {
    @Index(name = "idx_invoice_number", columnList = "invoice_number"),
    @Index(name = "idx_invoice_student", columnList = "student_id"),
    @Index(name = "idx_invoice_status", columnList = "status")
})
public class FeeInvoice {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "invoice_number", unique = true, nullable = false, length = 50)
    private String invoiceNumber; // e.g. "INV-2025-1001-Q1"

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "student_id", nullable = false)
    private StudentProfile student;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "fee_category_id", nullable = false)
    private FeeCategory feeCategory;

    @Column(nullable = false, length = 150)
    private String title;

    @Column(name = "total_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal totalAmount;

    @Column(name = "paid_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal paidAmount = BigDecimal.ZERO;

    @Column(name = "balance_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal balanceAmount;

    @Column(name = "due_date", nullable = false)
    private LocalDate dueDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private FeeInvoiceStatus status = FeeInvoiceStatus.PENDING;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "academic_year_id")
    private AcademicYear academicYear;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public FeeInvoice() {}

    public FeeInvoice(String invoiceNumber, StudentProfile student, FeeCategory feeCategory, String title, BigDecimal totalAmount, LocalDate dueDate, AcademicYear academicYear) {
        this.invoiceNumber = invoiceNumber;
        this.student = student;
        this.feeCategory = feeCategory;
        this.title = title;
        this.totalAmount = totalAmount;
        this.paidAmount = BigDecimal.ZERO;
        this.balanceAmount = totalAmount;
        this.dueDate = dueDate;
        this.academicYear = academicYear;
        this.status = (dueDate != null && dueDate.isBefore(LocalDate.now())) ? FeeInvoiceStatus.OVERDUE : FeeInvoiceStatus.PENDING;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.paidAmount == null) this.paidAmount = BigDecimal.ZERO;
        if (this.balanceAmount == null) this.balanceAmount = this.totalAmount.subtract(this.paidAmount);
        updateStatus();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
        updateStatus();
    }

    public void updateStatus() {
        if (this.paidAmount == null) this.paidAmount = BigDecimal.ZERO;
        if (this.totalAmount == null) return;
        this.balanceAmount = this.totalAmount.subtract(this.paidAmount);

        if (this.balanceAmount.compareTo(BigDecimal.ZERO) <= 0) {
            this.status = FeeInvoiceStatus.PAID;
            this.balanceAmount = BigDecimal.ZERO;
        } else if (this.paidAmount.compareTo(BigDecimal.ZERO) > 0) {
            this.status = (this.dueDate != null && this.dueDate.isBefore(LocalDate.now())) ? FeeInvoiceStatus.OVERDUE : FeeInvoiceStatus.PARTIAL;
        } else {
            this.status = (this.dueDate != null && this.dueDate.isBefore(LocalDate.now())) ? FeeInvoiceStatus.OVERDUE : FeeInvoiceStatus.PENDING;
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getInvoiceNumber() { return invoiceNumber; }
    public void setInvoiceNumber(String invoiceNumber) { this.invoiceNumber = invoiceNumber; }
    public StudentProfile getStudent() { return student; }
    public void setStudent(StudentProfile student) { this.student = student; }
    public FeeCategory getFeeCategory() { return feeCategory; }
    public void setFeeCategory(FeeCategory feeCategory) { this.feeCategory = feeCategory; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }
    public BigDecimal getPaidAmount() { return paidAmount; }
    public void setPaidAmount(BigDecimal paidAmount) {
        this.paidAmount = paidAmount;
        updateStatus();
    }
    public BigDecimal getBalanceAmount() { return balanceAmount; }
    public void setBalanceAmount(BigDecimal balanceAmount) { this.balanceAmount = balanceAmount; }
    public LocalDate getDueDate() { return dueDate; }
    public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }
    public FeeInvoiceStatus getStatus() { return status; }
    public void setStatus(FeeInvoiceStatus status) { this.status = status; }
    public AcademicYear getAcademicYear() { return academicYear; }
    public void setAcademicYear(AcademicYear academicYear) { this.academicYear = academicYear; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}

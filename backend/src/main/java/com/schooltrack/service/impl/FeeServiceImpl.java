package com.schooltrack.service.impl;

import com.schooltrack.dto.*;
import com.schooltrack.entity.*;
import com.schooltrack.exception.BadRequestException;
import com.schooltrack.exception.ResourceNotFoundException;
import com.schooltrack.repository.*;
import com.schooltrack.service.FeeService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class FeeServiceImpl implements FeeService {

    private final FeeInvoiceRepository invoiceRepository;
    private final FeePaymentRepository paymentRepository;
    private final FeeCategoryRepository feeCategoryRepository;
    private final StudentProfileRepository studentRepository;
    private final UserRepository userRepository;
    private final AcademicYearRepository academicYearRepository;

    public FeeServiceImpl(FeeInvoiceRepository invoiceRepository,
                          FeePaymentRepository paymentRepository,
                          FeeCategoryRepository feeCategoryRepository,
                          StudentProfileRepository studentRepository,
                          UserRepository userRepository,
                          AcademicYearRepository academicYearRepository) {
        this.invoiceRepository = invoiceRepository;
        this.paymentRepository = paymentRepository;
        this.feeCategoryRepository = feeCategoryRepository;
        this.studentRepository = studentRepository;
        this.userRepository = userRepository;
        this.academicYearRepository = academicYearRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<FeeInvoiceDto> getStudentInvoices(Long studentId) {
        return invoiceRepository.findByStudentIdOrderByDueDateDesc(studentId).stream()
                .map(this::mapToInvoiceDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public FeePaymentReceiptDto processPayment(FeePaymentRequest req, String payerUsername) {
        FeeInvoice invoice = invoiceRepository.findById(req.getInvoiceId())
                .orElseThrow(() -> new ResourceNotFoundException("Fee invoice not found with id: " + req.getInvoiceId()));

        if (invoice.getStatus() == FeeInvoiceStatus.PAID) {
            throw new BadRequestException("Invoice " + invoice.getInvoiceNumber() + " is already fully paid");
        }

        if (req.getAmount().compareTo(invoice.getBalanceAmount()) > 0) {
            throw new BadRequestException("Payment amount (₹" + req.getAmount() + ") cannot exceed remaining balance (₹" + invoice.getBalanceAmount() + ")");
        }

        PaymentMethod method;
        try {
            method = PaymentMethod.valueOf(req.getPaymentMethod().toUpperCase());
        } catch (IllegalArgumentException e) {
            method = PaymentMethod.UPI;
        }

        User payer = userRepository.findByUsername(payerUsername).orElse(null);

        String txnRef = (req.getTransactionReference() != null && !req.getTransactionReference().isBlank())
                ? req.getTransactionReference() : "TXN-" + method.name() + "-" + System.currentTimeMillis();

        String receiptNum = "REC-" + LocalDateTime.now().getYear() + "-" + (10000 + new Random().nextInt(90000));

        FeePayment payment = new FeePayment(
                invoice,
                invoice.getStudent(),
                payer,
                req.getAmount(),
                method,
                txnRef,
                receiptNum,
                req.getRemarks() != null ? req.getRemarks() : "Online simulated fee payment"
        );

        payment = paymentRepository.save(payment);

        // Update invoice balance and status
        BigDecimal newPaid = invoice.getPaidAmount().add(req.getAmount());
        invoice.setPaidAmount(newPaid);
        invoice.updateStatus();
        invoiceRepository.save(invoice);

        return mapToReceiptDto(payment, invoice.getBalanceAmount());
    }

    @Override
    @Transactional(readOnly = true)
    public FeePaymentReceiptDto getReceipt(Long paymentId) {
        FeePayment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found with id: " + paymentId));
        return mapToReceiptDto(payment, payment.getInvoice().getBalanceAmount());
    }

    @Override
    @Transactional(readOnly = true)
    public FeePaymentReceiptDto getReceiptByNumber(String receiptNumber) {
        FeePayment payment = paymentRepository.findByReceiptNumber(receiptNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Payment receipt not found: " + receiptNumber));
        return mapToReceiptDto(payment, payment.getInvoice().getBalanceAmount());
    }

    @Override
    @Transactional(readOnly = true)
    public FeeSummaryDto getFeeSummary() {
        List<FeeInvoice> allInvoices = invoiceRepository.findAll();

        BigDecimal totalBilled = allInvoices.stream()
                .map(FeeInvoice::getTotalAmount)
                .filter(Objects::nonNull)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalCollected = allInvoices.stream()
                .map(FeeInvoice::getPaidAmount)
                .filter(Objects::nonNull)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalPending = allInvoices.stream()
                .map(FeeInvoice::getBalanceAmount)
                .filter(Objects::nonNull)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        double collectionRate = 0.0;
        if (totalBilled.compareTo(BigDecimal.ZERO) > 0) {
            collectionRate = totalCollected.divide(totalBilled, 4, java.math.RoundingMode.HALF_UP).doubleValue() * 100.0;
            collectionRate = Math.round(collectionRate * 100.0) / 100.0;
        }

        FeeSummaryDto summary = new FeeSummaryDto();
        summary.setTotalBilled(totalBilled);
        summary.setTotalCollected(totalCollected);
        summary.setTotalPending(totalPending);
        summary.setCollectionRatePercentage(collectionRate);
        summary.setTotalInvoices(allInvoices.size());
        summary.setPaidInvoices(allInvoices.stream().filter(i -> i.getStatus() == FeeInvoiceStatus.PAID).count());
        summary.setPendingInvoices(allInvoices.stream().filter(i -> i.getStatus() == FeeInvoiceStatus.PENDING || i.getStatus() == FeeInvoiceStatus.PARTIAL).count());
        summary.setOverdueInvoices(allInvoices.stream().filter(i -> i.getStatus() == FeeInvoiceStatus.OVERDUE).count());
        summary.setRecentInvoices(allInvoices.stream().limit(10).map(this::mapToInvoiceDto).collect(Collectors.toList()));

        return summary;
    }

    @Override
    @Transactional
    public FeeInvoiceDto createInvoice(FeeInvoiceDto dto) {
        StudentProfile student = studentRepository.findById(dto.getStudentId())
                .orElseThrow(() -> new ResourceNotFoundException("Student not found: " + dto.getStudentId()));
        FeeCategory category = feeCategoryRepository.findById(dto.getFeeCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Fee category not found: " + dto.getFeeCategoryId()));
        AcademicYear ay = academicYearRepository.findByActiveTrue().orElse(null);

        String invNum = (dto.getInvoiceNumber() != null && !dto.getInvoiceNumber().isBlank())
                ? dto.getInvoiceNumber() : "INV-" + LocalDateTime.now().getYear() + "-" + (1000 + new Random().nextInt(9000));

        FeeInvoice invoice = new FeeInvoice(
                invNum,
                student,
                category,
                dto.getTitle() != null ? dto.getTitle() : category.getName(),
                dto.getTotalAmount(),
                dto.getDueDate(),
                ay
        );

        invoice = invoiceRepository.save(invoice);
        return mapToInvoiceDto(invoice);
    }

    private FeeInvoiceDto mapToInvoiceDto(FeeInvoice inv) {
        FeeInvoiceDto dto = new FeeInvoiceDto();
        dto.setId(inv.getId());
        dto.setInvoiceNumber(inv.getInvoiceNumber());
        if (inv.getStudent() != null) {
            dto.setStudentId(inv.getStudent().getId());
            dto.setStudentName(inv.getStudent().getUser().getFullName());
            dto.setRollNumber(inv.getStudent().getRollNumber() != null ? inv.getStudent().getRollNumber() : inv.getStudent().getUser().getRollNumber());
            if (inv.getStudent().getCurrentClass() != null) {
                dto.setClassName(inv.getStudent().getCurrentClass().getName());
            }
        }
        if (inv.getFeeCategory() != null) {
            dto.setFeeCategoryId(inv.getFeeCategory().getId());
            dto.setFeeCategoryName(inv.getFeeCategory().getName());
        }
        dto.setTitle(inv.getTitle());
        dto.setTotalAmount(inv.getTotalAmount());
        dto.setPaidAmount(inv.getPaidAmount());
        dto.setBalanceAmount(inv.getBalanceAmount());
        dto.setDueDate(inv.getDueDate());
        dto.setStatus(inv.getStatus().name());
        if (inv.getAcademicYear() != null) {
            dto.setAcademicYear(inv.getAcademicYear().getName());
        }

        List<FeePayment> payments = paymentRepository.findByInvoiceIdOrderByPaymentDateDesc(inv.getId());
        dto.setPayments(payments.stream().map(p -> mapToReceiptDto(p, inv.getBalanceAmount())).collect(Collectors.toList()));
        return dto;
    }

    private FeePaymentReceiptDto mapToReceiptDto(FeePayment p, BigDecimal remainingBalance) {
        FeePaymentReceiptDto dto = new FeePaymentReceiptDto();
        dto.setId(p.getId());
        if (p.getInvoice() != null) {
            dto.setInvoiceId(p.getInvoice().getId());
            dto.setInvoiceNumber(p.getInvoice().getInvoiceNumber());
            dto.setInvoiceTitle(p.getInvoice().getTitle());
        }
        if (p.getStudent() != null) {
            dto.setStudentId(p.getStudent().getId());
            dto.setStudentName(p.getStudent().getUser().getFullName());
            dto.setRollNumber(p.getStudent().getRollNumber() != null ? p.getStudent().getRollNumber() : p.getStudent().getUser().getRollNumber());
            dto.setAdmissionNumber(p.getStudent().getAdmissionNumber());
            if (p.getStudent().getCurrentClass() != null) {
                dto.setClassName(p.getStudent().getCurrentClass().getName());
            }
        }
        dto.setAmount(p.getAmount());
        dto.setPaymentMethod(p.getPaymentMethod().name());
        dto.setTransactionReference(p.getTransactionReference());
        dto.setReceiptNumber(p.getReceiptNumber());
        dto.setStatus(p.getStatus().name());
        dto.setRemarks(p.getRemarks());
        dto.setPaymentDate(p.getPaymentDate());
        dto.setRemainingBalance(remainingBalance);
        return dto;
    }
}

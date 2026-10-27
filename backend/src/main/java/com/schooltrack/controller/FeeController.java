package com.schooltrack.controller;

import com.schooltrack.dto.*;
import com.schooltrack.service.FeeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/fees")
@Tag(name = "Fee Management & Payment Portal", description = "Endpoints for student fee invoices, simulated online payments, digital receipts, and collection summaries")
public class FeeController {

    private final FeeService feeService;

    public FeeController(FeeService feeService) {
        this.feeService = feeService;
    }

    @GetMapping("/student/{studentId}")
    @Operation(summary = "Get all fee invoices and payments for a student")
    public ResponseEntity<List<FeeInvoiceDto>> getStudentInvoices(@PathVariable Long studentId) {
        return ResponseEntity.ok(feeService.getStudentInvoices(studentId));
    }

    @PostMapping("/pay")
    @Operation(summary = "Process simulated online fee payment (UPI, Cards, NetBanking)")
    public ResponseEntity<FeePaymentReceiptDto> processPayment(@Valid @RequestBody FeePaymentRequest request,
                                                               @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(feeService.processPayment(request, userDetails.getUsername()));
    }

    @GetMapping("/receipt/{paymentId}")
    @Operation(summary = "Get official digital payment receipt by payment ID")
    public ResponseEntity<FeePaymentReceiptDto> getReceipt(@PathVariable Long paymentId) {
        return ResponseEntity.ok(feeService.getReceipt(paymentId));
    }

    @GetMapping("/receipt/number/{receiptNumber}")
    @Operation(summary = "Get official digital payment receipt by receipt number")
    public ResponseEntity<FeePaymentReceiptDto> getReceiptByNumber(@PathVariable String receiptNumber) {
        return ResponseEntity.ok(feeService.getReceiptByNumber(receiptNumber));
    }

    @GetMapping("/summary")
    @PreAuthorize("hasAnyRole('PRINCIPAL', 'COORDINATOR')")
    @Operation(summary = "Get school-wide fee billing, collections, and dues overview")
    public ResponseEntity<FeeSummaryDto> getFeeSummary() {
        return ResponseEntity.ok(feeService.getFeeSummary());
    }

    @PostMapping("/invoices")
    @PreAuthorize("hasAnyRole('PRINCIPAL', 'COORDINATOR')")
    @Operation(summary = "Create fee invoice for a student")
    public ResponseEntity<FeeInvoiceDto> createInvoice(@Valid @RequestBody FeeInvoiceDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(feeService.createInvoice(dto));
    }
}

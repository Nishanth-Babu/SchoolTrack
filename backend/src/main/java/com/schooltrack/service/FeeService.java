package com.schooltrack.service;

import com.schooltrack.dto.*;
import java.util.List;

public interface FeeService {
    List<FeeInvoiceDto> getStudentInvoices(Long studentId);
    FeePaymentReceiptDto processPayment(FeePaymentRequest request, String payerUsername);
    FeePaymentReceiptDto getReceipt(Long paymentId);
    FeePaymentReceiptDto getReceiptByNumber(String receiptNumber);
    FeeSummaryDto getFeeSummary();
    FeeInvoiceDto createInvoice(FeeInvoiceDto dto);
}

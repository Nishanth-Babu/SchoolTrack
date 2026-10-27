package com.schooltrack.repository;

import com.schooltrack.entity.FeePayment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface FeePaymentRepository extends JpaRepository<FeePayment, Long> {
    Optional<FeePayment> findByReceiptNumber(String receiptNumber);
    List<FeePayment> findByStudentIdOrderByPaymentDateDesc(Long studentId);
    List<FeePayment> findByInvoiceIdOrderByPaymentDateDesc(Long invoiceId);
}

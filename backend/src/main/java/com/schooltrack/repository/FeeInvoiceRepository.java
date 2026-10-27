package com.schooltrack.repository;

import com.schooltrack.entity.FeeInvoice;
import com.schooltrack.entity.FeeInvoiceStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface FeeInvoiceRepository extends JpaRepository<FeeInvoice, Long> {
    Optional<FeeInvoice> findByInvoiceNumber(String invoiceNumber);
    List<FeeInvoice> findByStudentIdOrderByDueDateDesc(Long studentId);
    List<FeeInvoice> findByStudentIdAndStatus(Long studentId, FeeInvoiceStatus status);

    @Query("SELECT i FROM FeeInvoice i WHERE i.student.currentClass.id = :classId")
    List<FeeInvoice> findByClassId(@Param("classId") Long classId);

    @Query("SELECT SUM(i.totalAmount) FROM FeeInvoice i")
    BigDecimal sumTotalAmount();

    @Query("SELECT SUM(i.paidAmount) FROM FeeInvoice i")
    BigDecimal sumPaidAmount();

    @Query("SELECT SUM(i.balanceAmount) FROM FeeInvoice i WHERE i.status != 'PAID'")
    BigDecimal sumPendingAmount();
}

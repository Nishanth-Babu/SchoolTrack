package com.schooltrack;

import com.schooltrack.entity.*;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.*;

class AcademicAndFeeTest {

    @Test
    @DisplayName("Grade and Percentage calculation for StudentMark")
    void testStudentMarkGradeCalculation() {
        StudentMark mark1 = new StudentMark();
        mark1.setMaxMarks(100.0);
        mark1.setMarksObtained(94.5);
        assertEquals(94.5, mark1.getPercentage());
        assertEquals("A+", mark1.getGrade());

        StudentMark mark2 = new StudentMark();
        mark2.setMaxMarks(50.0);
        mark2.setMarksObtained(41.0);
        assertEquals(82.0, mark2.getPercentage());
        assertEquals("A", mark2.getGrade());

        StudentMark mark3 = new StudentMark();
        mark3.setMaxMarks(100.0);
        mark3.setMarksObtained(34.0);
        assertEquals(34.0, mark3.getPercentage());
        assertEquals("F", mark3.getGrade());
    }

    @Test
    @DisplayName("FeeInvoice balance and status lifecycle")
    void testFeeInvoiceLifecycle() {
        FeeInvoice invoice = new FeeInvoice();
        invoice.setTotalAmount(new BigDecimal("35000.00"));
        invoice.setPaidAmount(BigDecimal.ZERO);
        invoice.setDueDate(LocalDate.now().plusMonths(1));
        invoice.updateStatus();

        assertEquals(new BigDecimal("35000.00"), invoice.getBalanceAmount());
        assertEquals(FeeInvoiceStatus.PENDING, invoice.getStatus());

        // Partial payment
        invoice.setPaidAmount(new BigDecimal("15000.00"));
        invoice.updateStatus();
        assertEquals(new BigDecimal("20000.00"), invoice.getBalanceAmount());
        assertEquals(FeeInvoiceStatus.PARTIAL, invoice.getStatus());

        // Full payment
        invoice.setPaidAmount(new BigDecimal("35000.00"));
        invoice.updateStatus();
        assertEquals(BigDecimal.ZERO, invoice.getBalanceAmount());
        assertEquals(FeeInvoiceStatus.PAID, invoice.getStatus());
    }

    @Test
    @DisplayName("Account status enables/disables active flag accurately")
    void testUserAccountStatus() {
        User user = new User("teacher1", "teacher1@schooltrack.com", "hash", "Teacher", "One", "+91 99999 11111");
        user.setStatus(AccountStatus.ACTIVE);
        assertTrue(user.isActive());

        user.setStatus(AccountStatus.DISABLED);
        assertFalse(user.isActive());

        user.setStatus(AccountStatus.DEACTIVATED);
        assertFalse(user.isActive());
    }
}

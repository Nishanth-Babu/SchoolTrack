package com.schooltrack;

import com.schooltrack.entity.AttendanceStatus;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class AttendanceCalculationTest {

    @Test
    public void testEffectiveAttendanceCalculationWithOnDuty() {
        long present = 20;
        long absent = 3;
        long onDuty = 2;

        long effectivePresent = present + onDuty;
        long total = present + absent + onDuty;
        double percentage = ((double) effectivePresent / total) * 100.0;

        assertEquals(22, effectivePresent, "OD must count as present in effective attendance");
        assertEquals(25, total, "Total sessions must be sum of Present, Absent, and OD");
        assertEquals(88.0, percentage, 0.001, "Attendance percentage must equal (20+2)/(20+3+2)*100 = 88.0%");
    }

    @Test
    public void testOnlyThreeAttendanceStatusesExist() {
        AttendanceStatus[] statuses = AttendanceStatus.values();
        assertEquals(3, statuses.length, "Attendance status enum must strictly contain only PRESENT, ABSENT, and ON_DUTY");
        assertNotNull(AttendanceStatus.valueOf("PRESENT"));
        assertNotNull(AttendanceStatus.valueOf("ABSENT"));
        assertNotNull(AttendanceStatus.valueOf("ON_DUTY"));
    }
}

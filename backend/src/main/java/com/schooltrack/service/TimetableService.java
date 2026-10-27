package com.schooltrack.service;

import com.schooltrack.dto.CreateTimetableSlotRequest;
import com.schooltrack.dto.TimetableSlotDto;

import java.util.List;
import java.util.Map;

public interface TimetableService {

    List<TimetableSlotDto> getTimetableForClass(Long classId);

    List<TimetableSlotDto> getTimetableForTeacher(Long teacherId);

    Map<String, List<TimetableSlotDto>> getWeeklyScheduleForClass(Long classId);

    Map<String, List<TimetableSlotDto>> getWeeklyScheduleForTeacher(Long teacherId);

    TimetableSlotDto createTimetableSlot(CreateTimetableSlotRequest request);

    void deleteTimetableSlot(Long slotId);
}

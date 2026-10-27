package com.schooltrack.service.impl;

import com.schooltrack.dto.CreateTimetableSlotRequest;
import com.schooltrack.dto.TimetableSlotDto;
import com.schooltrack.entity.SchoolClass;
import com.schooltrack.entity.Subject;
import com.schooltrack.entity.SubjectTeacherProfile;
import com.schooltrack.entity.TimetableSlot;
import com.schooltrack.exception.BadRequestException;
import com.schooltrack.exception.ResourceNotFoundException;
import com.schooltrack.repository.SchoolClassRepository;
import com.schooltrack.repository.SubjectRepository;
import com.schooltrack.repository.SubjectTeacherProfileRepository;
import com.schooltrack.repository.TimetableRepository;
import com.schooltrack.service.TimetableService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class TimetableServiceImpl implements TimetableService {

    private final TimetableRepository timetableRepository;
    private final SchoolClassRepository schoolClassRepository;
    private final SubjectRepository subjectRepository;
    private final SubjectTeacherProfileRepository teacherRepository;

    public TimetableServiceImpl(TimetableRepository timetableRepository,
                                SchoolClassRepository schoolClassRepository,
                                SubjectRepository subjectRepository,
                                SubjectTeacherProfileRepository teacherRepository) {
        this.timetableRepository = timetableRepository;
        this.schoolClassRepository = schoolClassRepository;
        this.subjectRepository = subjectRepository;
        this.teacherRepository = teacherRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<TimetableSlotDto> getTimetableForClass(Long classId) {
        return timetableRepository.findBySchoolClassIdOrderByPeriodNumberAsc(classId)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<TimetableSlotDto> getTimetableForTeacher(Long teacherId) {
        return timetableRepository.findByTeacherIdOrderByPeriodNumberAsc(teacherId)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, List<TimetableSlotDto>> getWeeklyScheduleForClass(Long classId) {
        List<TimetableSlotDto> slots = getTimetableForClass(classId);
        return groupSlotsByDay(slots);
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, List<TimetableSlotDto>> getWeeklyScheduleForTeacher(Long teacherId) {
        List<TimetableSlotDto> slots = getTimetableForTeacher(teacherId);
        return groupSlotsByDay(slots);
    }

    @Override
    @Transactional
    public TimetableSlotDto createTimetableSlot(CreateTimetableSlotRequest request) {
        SchoolClass schoolClass = schoolClassRepository.findById(request.getClassId())
                .orElseThrow(() -> new ResourceNotFoundException("Class not found with id: " + request.getClassId()));

        Subject subject = subjectRepository.findById(request.getSubjectId())
                .orElseThrow(() -> new ResourceNotFoundException("Subject not found with id: " + request.getSubjectId()));

        SubjectTeacherProfile teacher = null;
        if (request.getTeacherId() != null) {
            teacher = teacherRepository.findById(request.getTeacherId())
                    .orElseThrow(() -> new ResourceNotFoundException("Teacher not found with id: " + request.getTeacherId()));

            // Conflict check for teacher
            if (timetableRepository.existsByTeacherIdAndDayOfWeekAndPeriodNumber(teacher.getId(), request.getDayOfWeek(), request.getPeriodNumber())) {
                throw new BadRequestException("Conflict detected: Teacher is already scheduled for another class in Period " + request.getPeriodNumber() + " on " + request.getDayOfWeek());
            }
        }

        // Conflict check for class
        if (timetableRepository.existsBySchoolClassIdAndDayOfWeekAndPeriodNumber(schoolClass.getId(), request.getDayOfWeek(), request.getPeriodNumber())) {
            throw new BadRequestException("Conflict detected: Class already has a subject scheduled in Period " + request.getPeriodNumber() + " on " + request.getDayOfWeek());
        }

        String roomNumber = request.getRoomNumber() != null ? request.getRoomNumber() : "Room " + schoolClass.getName();
        // Conflict check for room
        if (timetableRepository.existsByRoomNumberAndDayOfWeekAndPeriodNumber(roomNumber, request.getDayOfWeek(), request.getPeriodNumber())) {
            throw new BadRequestException("Conflict detected: Room '" + roomNumber + "' is already occupied in Period " + request.getPeriodNumber() + " on " + request.getDayOfWeek());
        }

        TimetableSlot slot = new TimetableSlot(
                request.getDayOfWeek().toUpperCase(),
                request.getPeriodNumber(),
                request.getStartTime(),
                request.getEndTime(),
                schoolClass,
                subject,
                teacher,
                roomNumber
        );

        TimetableSlot saved = timetableRepository.save(slot);
        return mapToDto(saved);
    }

    @Override
    @Transactional
    public void deleteTimetableSlot(Long slotId) {
        if (!timetableRepository.existsById(slotId)) {
            throw new ResourceNotFoundException("Timetable slot not found with id: " + slotId);
        }
        timetableRepository.deleteById(slotId);
    }

    private Map<String, List<TimetableSlotDto>> groupSlotsByDay(List<TimetableSlotDto> slots) {
        List<String> days = Arrays.asList("MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY");
        Map<String, List<TimetableSlotDto>> result = new LinkedHashMap<>();
        for (String day : days) {
            result.put(day, new ArrayList<>());
        }
        for (TimetableSlotDto slot : slots) {
            String day = slot.getDayOfWeek().toUpperCase();
            if (result.containsKey(day)) {
                result.get(day).add(slot);
            }
        }
        return result;
    }

    private TimetableSlotDto mapToDto(TimetableSlot slot) {
        String teacherName = "Unassigned";
        String teacherEmpId = "N/A";
        Long teacherId = null;

        if (slot.getTeacher() != null) {
            teacherId = slot.getTeacher().getId();
            teacherEmpId = slot.getTeacher().getEmployeeId();
            if (slot.getTeacher().getUser() != null) {
                teacherName = slot.getTeacher().getUser().getFirstName() + " " + slot.getTeacher().getUser().getLastName();
            }
        }

        return new TimetableSlotDto(
                slot.getId(),
                slot.getDayOfWeek(),
                slot.getPeriodNumber(),
                slot.getStartTime(),
                slot.getEndTime(),
                slot.getSchoolClass().getId(),
                slot.getSchoolClass().getName() + " " + slot.getSchoolClass().getSection(),
                slot.getSubject().getId(),
                slot.getSubject().getName(),
                slot.getSubject().getCode(),
                teacherId,
                teacherName,
                teacherEmpId,
                slot.getRoomNumber()
        );
    }
}

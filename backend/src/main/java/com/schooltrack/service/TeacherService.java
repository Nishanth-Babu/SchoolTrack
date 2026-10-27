package com.schooltrack.service;

import com.schooltrack.dto.TeacherDetailDto;
import java.util.List;

public interface TeacherService {
    List<TeacherDetailDto> getAllTeachers();
    List<TeacherDetailDto> getCoordinators();
    List<TeacherDetailDto> getClassTeachers();
    List<TeacherDetailDto> getSubjectTeachers();
    TeacherDetailDto getTeacherById(Long id);
    void assignSubjectTeacherToClass(Long teacherId, Long classId, Long subjectId);
}

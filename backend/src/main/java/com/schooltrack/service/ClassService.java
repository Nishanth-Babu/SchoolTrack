package com.schooltrack.service;

import com.schooltrack.dto.ClassCreateRequest;
import com.schooltrack.dto.ClassDetailDto;
import com.schooltrack.dto.SubjectDetailDto;
import java.util.List;

public interface ClassService {
    List<ClassDetailDto> getAllClasses();
    ClassDetailDto getClassById(Long id);
    List<ClassDetailDto> getClassesByCoordinatorId(Long coordinatorId);
    ClassDetailDto getClassByClassTeacherId(Long classTeacherId);
    List<ClassDetailDto> getClassesBySubjectTeacherId(Long teacherId);
    List<SubjectDetailDto> getAllSubjects();
    List<SubjectDetailDto> getSubjectsByClassId(Long classId);
    ClassDetailDto createClass(ClassCreateRequest request, String principalUsername);
    ClassDetailDto updateClass(Long id, ClassCreateRequest request, String principalUsername);
    void deleteClass(Long id, String principalUsername);
    SubjectDetailDto createSubject(SubjectDetailDto request, String principalUsername);
}

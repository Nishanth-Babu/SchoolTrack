package com.schooltrack.service;

import com.schooltrack.dto.StudentDetailDto;
import java.util.List;

public interface StudentService {
    List<StudentDetailDto> getAllStudents();
    List<StudentDetailDto> getStudentsByClassId(Long classId);
    List<StudentDetailDto> getStudentsByParentId(Long parentId);
    StudentDetailDto getStudentById(Long id);
    StudentDetailDto updateStudent(Long id, StudentDetailDto studentDto);
    void deleteStudent(Long id);
}

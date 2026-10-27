package com.schooltrack.service.impl;

import com.schooltrack.dto.StudentDetailDto;
import com.schooltrack.entity.*;
import com.schooltrack.exception.ResourceNotFoundException;
import com.schooltrack.repository.*;
import com.schooltrack.service.StudentService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class StudentServiceImpl implements StudentService {

    private final StudentProfileRepository studentProfileRepository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final SchoolClassRepository schoolClassRepository;
    private final ParentProfileRepository parentProfileRepository;
    private final PasswordEncoder passwordEncoder;

    public StudentServiceImpl(StudentProfileRepository studentProfileRepository,
                              UserRepository userRepository,
                              RoleRepository roleRepository,
                              SchoolClassRepository schoolClassRepository,
                              ParentProfileRepository parentProfileRepository,
                              PasswordEncoder passwordEncoder) {
        this.studentProfileRepository = studentProfileRepository;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.schoolClassRepository = schoolClassRepository;
        this.parentProfileRepository = parentProfileRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional(readOnly = true)
    public List<StudentDetailDto> getAllStudents() {
        return studentProfileRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<StudentDetailDto> getStudentsByClassId(Long classId) {
        return studentProfileRepository.findByCurrentClassId(classId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<StudentDetailDto> getStudentsByParentId(Long parentId) {
        return studentProfileRepository.findByParentId(parentId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public StudentDetailDto getStudentById(Long id) {
        StudentProfile profile = studentProfileRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found: " + id));
        return mapToDto(profile);
    }

    @Override
    @Transactional
    public StudentDetailDto updateStudent(Long id, StudentDetailDto dto) {
        StudentProfile profile = studentProfileRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found: " + id));

        User user = profile.getUser();
        if (dto.getFirstName() != null) user.setFirstName(dto.getFirstName());
        if (dto.getLastName() != null) user.setLastName(dto.getLastName());
        if (dto.getPhone() != null) user.setPhone(dto.getPhone());
        userRepository.save(user);

        if (dto.getRollNumber() != null) profile.setRollNumber(dto.getRollNumber());
        if (dto.getDob() != null) profile.setDob(dto.getDob());
        if (dto.getGender() != null) profile.setGender(dto.getGender());
        if (dto.getBloodGroup() != null) profile.setBloodGroup(dto.getBloodGroup());
        if (dto.getAddress() != null) profile.setAddress(dto.getAddress());

        if (dto.getClassId() != null) {
            SchoolClass schoolClass = schoolClassRepository.findById(dto.getClassId()).orElse(null);
            profile.setCurrentClass(schoolClass);
        }

        profile = studentProfileRepository.save(profile);
        return mapToDto(profile);
    }

    @Override
    @Transactional
    public void deleteStudent(Long id) {
        StudentProfile profile = studentProfileRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found: " + id));
        User user = profile.getUser();
        studentProfileRepository.delete(profile);
        userRepository.delete(user);
    }

    private StudentDetailDto mapToDto(StudentProfile p) {
        StudentDetailDto dto = new StudentDetailDto();
        dto.setId(p.getId());
        dto.setUserId(p.getUser().getId());
        dto.setFullName(p.getUser().getFullName());
        dto.setFirstName(p.getUser().getFirstName());
        dto.setLastName(p.getUser().getLastName());
        dto.setEmail(p.getUser().getEmail());
        dto.setPhone(p.getUser().getPhone());
        dto.setAdmissionNumber(p.getAdmissionNumber());
        dto.setRollNumber(p.getRollNumber());
        if (p.getCurrentClass() != null) {
            dto.setClassId(p.getCurrentClass().getId());
            dto.setClassName(p.getCurrentClass().getName());
        }
        dto.setDob(p.getDob());
        dto.setGender(p.getGender());
        dto.setBloodGroup(p.getBloodGroup());
        dto.setAddress(p.getAddress());
        if (p.getParent() != null) {
            dto.setParentId(p.getParent().getId());
            dto.setParentName(p.getParent().getUser().getFullName());
            dto.setParentPhone(p.getParent().getUser().getPhone());
            dto.setParentEmail(p.getParent().getUser().getEmail());
        }
        return dto;
    }
}

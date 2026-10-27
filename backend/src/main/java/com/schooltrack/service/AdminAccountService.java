package com.schooltrack.service;

import com.schooltrack.dto.*;
import java.util.List;

public interface AdminAccountService {
    UserDto createAccount(AccountCreateRequest request, String adminUsername);
    UserDto updateAccountStatus(Long userId, String status, String adminUsername);
    void resetPassword(Long userId, String newPassword, String adminUsername);
    void linkStudentParent(Long studentId, Long parentId, String adminUsername);
    void assignSubjectTeacher(Long teacherProfileId, Long classId, Long subjectId, String adminUsername);
    void assignClassTeacher(Long classId, Long teacherProfileId, String adminUsername);
    List<UserDto> getAccountsByRole(String role);
}

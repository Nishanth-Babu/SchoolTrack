package com.schooltrack.service;

import com.schooltrack.dto.LeaveApplyRequest;
import com.schooltrack.dto.LeaveResponseDto;
import com.schooltrack.dto.LeaveVerificationRequest;
import com.schooltrack.entity.LeaveType;
import java.util.List;

public interface LeaveService {
    List<LeaveType> getAllLeaveTypes();
    LeaveResponseDto applyLeave(LeaveApplyRequest request, String studentUsername);
    List<LeaveResponseDto> getStudentLeaves(Long studentId);
    List<LeaveResponseDto> getLeavesForClass(Long classId);
    List<LeaveResponseDto> getPendingLeavesForClassTeacher(Long classTeacherUserId);
    List<LeaveResponseDto> getPendingLeavesForCoordinator(Long coordinatorUserId);
    List<LeaveResponseDto> getPendingLeavesForParent(Long parentUserId);
    List<LeaveResponseDto> getAllLeaves();
    LeaveResponseDto getLeaveById(Long id);
    
    // 3-Stage Verification
    LeaveResponseDto parentVerifyLeave(Long leaveId, LeaveVerificationRequest request, String parentUsername);
    LeaveResponseDto classTeacherVerifyLeave(Long leaveId, LeaveVerificationRequest request, String teacherUsername);
    LeaveResponseDto coordinatorVerifyLeave(Long leaveId, LeaveVerificationRequest request, String coordinatorUsername);
}

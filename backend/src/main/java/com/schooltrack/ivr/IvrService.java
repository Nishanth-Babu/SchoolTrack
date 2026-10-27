package com.schooltrack.ivr;

import com.schooltrack.entity.LeaveRequest;

public interface IvrService {
    String initiateVerificationCall(LeaveRequest leaveRequest, String parentPhoneNumber);
    boolean processResponse(Long leaveRequestId, String action, String remarks);
    String getVerificationStatus(Long leaveRequestId);
}

package com.schooltrack.ivr;

import com.schooltrack.entity.LeaveRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class MockIvrServiceImpl implements IvrService {

    private static final Logger logger = LoggerFactory.getLogger(MockIvrServiceImpl.class);

    @Override
    public String initiateVerificationCall(LeaveRequest leaveRequest, String parentPhoneNumber) {
        String studentName = leaveRequest.getStudent().getUser().getFullName();
        String message = String.format("Hello, this is SchoolTrack. Your child %s has requested leave from %s to %s for reason: %s. Press 1 to approve or Press 2 to reject.",
                studentName, leaveRequest.getStartDate(), leaveRequest.getEndDate(), leaveRequest.getReason());
        
        logger.info("[MOCK IVR CALL] Dialing registered parent phone: {} | Call payload: \"{}\"", parentPhoneNumber, message);
        return "IVR_CALL_INITIATED_ID_" + System.currentTimeMillis();
    }

    @Override
    public boolean processResponse(Long leaveRequestId, String action, String remarks) {
        logger.info("[MOCK IVR RESPONSE] LeaveRequestId: {} received IVR action: {} with DTMF/voice note: {}", leaveRequestId, action, remarks);
        return "APPROVE".equalsIgnoreCase(action) || "1".equals(action);
    }

    @Override
    public String getVerificationStatus(Long leaveRequestId) {
        return "IVR_READY";
    }
}

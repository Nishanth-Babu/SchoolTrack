import React from 'react';
import { CheckCircle2, Clock, XCircle, AlertCircle, PhoneCall, ShieldCheck, UserCheck } from 'lucide-react';

export default function LeaveTimeline({ leave }) {
  if (!leave) return null;

  const stages = [
    {
      name: 'Parent Verification',
      role: 'Parent / IVR Mock',
      status: leave.parentVerificationStatus,
      date: leave.parentVerifiedAt,
      remarks: leave.parentRemarks,
      method: leave.ivrConfirmed ? 'IVR Automated Call' : 'Portal Confirmation',
      icon: PhoneCall
    },
    {
      name: 'Class Teacher Review',
      role: 'Class Teacher',
      status: leave.teacherVerificationStatus,
      date: leave.teacherVerifiedAt,
      remarks: leave.teacherRemarks,
      icon: UserCheck
    },
    {
      name: 'Coordinator Approval',
      role: 'Academic Coordinator',
      status: leave.coordinatorApprovalStatus,
      date: leave.coordinatorApprovedAt,
      remarks: leave.coordinatorRemarks,
      icon: ShieldCheck
    }
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'APPROVED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
            <CheckCircle2 className="w-3.5 h-3.5" /> Approved
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-800">
            <XCircle className="w-3.5 h-3.5" /> Rejected
          </span>
        );
      case 'PENDING':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
            <Clock className="w-3.5 h-3.5" /> Pending
          </span>
        );
    }
  };

  const getStepIconColor = (status) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-emerald-500 text-white ring-4 ring-emerald-100';
      case 'REJECTED':
        return 'bg-red-500 text-white ring-4 ring-red-100';
      case 'PENDING':
      default:
        return 'bg-amber-400 text-white ring-4 ring-amber-100';
    }
  };

  return (
    <div className="py-4">
      <div className="relative pl-6 border-l-2 border-slate-200 space-y-6">
        {stages.map((stage, idx) => {
          const Icon = stage.icon;
          return (
            <div key={idx} className="relative">
              {/* Timeline marker */}
              <div
                className={`absolute -left-[35px] top-0.5 w-7 h-7 rounded-full flex items-center justify-center transition-all ${getStepIconColor(
                  stage.status
                )}`}
              >
                <Icon className="w-4 h-4" />
              </div>

              <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-3.5 shadow-sm">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h4 className="text-sm font-semibold text-slate-800">{stage.name}</h4>
                  {getStatusBadge(stage.status)}
                </div>
                <p className="text-xs text-slate-500 font-medium">{stage.role}</p>

                {stage.method && (
                  <p className="text-xs text-slate-400 mt-0.5">Method: {stage.method}</p>
                )}

                {stage.remarks && (
                  <div className="mt-2 text-xs bg-white p-2 rounded border border-slate-200 text-slate-600 italic">
                    "{stage.remarks}"
                  </div>
                )}

                {stage.date && (
                  <p className="text-[11px] text-slate-400 mt-2 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(stage.date).toLocaleString()}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

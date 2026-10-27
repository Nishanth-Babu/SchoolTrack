import React, { useState, useEffect } from 'react';
import { studentService, leaveService } from '../../services';
import ApplyLeaveModal from '../../components/leave/ApplyLeaveModal';
import LeaveActionModal from '../../components/leave/LeaveActionModal';
import LeaveTimeline from '../../components/leave/LeaveTimeline';
import Badge from '../../components/common/Badge';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import {
  Calendar,
  Plus,
  PhoneCall,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronDown,
  ChevronUp,
  AlertCircle
} from 'lucide-react';

export default function ParentLeavePage() {
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState(null);
  const [leaves, setLeaves] = useState([]);
  const [expandedLeaveId, setExpandedLeaveId] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modals
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [actionLeave, setActionLeave] = useState(null);
  const [ivrMessage, setIvrMessage] = useState('');

  useEffect(() => {
    fetchChildren();
  }, []);

  useEffect(() => {
    if (selectedChild) {
      fetchLeaves(selectedChild.id);
    }
  }, [selectedChild]);

  const fetchChildren = async () => {
    try {
      setLoading(true);
      const list = await studentService.getAllStudents();
      setChildren(list);
      if (list.length > 0) {
        setSelectedChild(list[0]);
      }
    } catch (err) {
      console.error('Failed to fetch children:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchLeaves = async (studentId) => {
    try {
      const data = await leaveService.getLeaves({ studentId });
      setLeaves(data);
    } catch (err) {
      console.error('Failed to fetch leaves:', err);
    }
  };

  const handleSimulateIVR = async (leaveId, approve = true) => {
    try {
      await leaveService.parentVerify(leaveId, {
        status: approve ? 'APPROVED' : 'REJECTED',
        remarks: approve ? 'Approved via Simulated IVR Voice Call' : 'Declined via IVR Call',
        ivrConfirmed: true
      });
      setIvrMessage(`IVR Verification Mock executed successfully: Leave ${approve ? 'Approved' : 'Declined'}.`);
      setTimeout(() => setIvrMessage(''), 5000);
      if (selectedChild) fetchLeaves(selectedChild.id);
    } catch (err) {
      alert(err.response?.data?.message || 'IVR simulation failed');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'APPROVED':
        return <Badge status="success">Approved</Badge>;
      case 'REJECTED':
        return <Badge status="danger">Rejected</Badge>;
      case 'PENDING':
      default:
        return <Badge status="warning">In Progress</Badge>;
    }
  };

  if (loading && children.length === 0) {
    return <SkeletonLoader type="list" count={4} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Leave Applications & Verifications</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Stage 1 Parent Verification, automated IVR phone call simulation, and full 3-stage audit trail.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {children.length > 0 && (
            <select
              value={selectedChild?.id || ''}
              onChange={(e) => {
                const found = children.find((c) => c.id === parseInt(e.target.value));
                if (found) setSelectedChild(found);
              }}
              className="px-3 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 focus:ring-2 focus:ring-teal-500 focus:outline-none"
            >
              {children.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.fullName || c.name || `${c.firstName || ''} ${c.lastName || ''}`.trim() || 'Student'} ({c.className || '10-A'})
                </option>
              ))}
            </select>
          )}

          <button
            onClick={() => setIsApplyModalOpen(true)}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-sm font-semibold shadow-sm transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Apply Leave
          </button>
        </div>
      </div>

      {ivrMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-800 text-sm flex items-center justify-between shadow-sm animate-fade-in">
          <div className="flex items-center gap-2 font-medium">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>{ivrMessage}</span>
          </div>
          <button onClick={() => setIvrMessage('')} className="text-emerald-600 hover:text-emerald-900 text-xs">
            Dismiss
          </button>
        </div>
      )}

      {/* Leave List Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <h3 className="font-bold text-slate-800 text-sm">
            Leave Requests for {selectedChild?.fullName || selectedChild?.name || `${selectedChild?.firstName || ''} ${selectedChild?.lastName || ''}`.trim() || 'Child'} ({leaves.length})
          </h3>
          <span className="text-xs text-slate-500">
            Click any row to expand 3-Stage Verification Timeline
          </span>
        </div>

        {leaves.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <Calendar className="w-12 h-12 mx-auto mb-2 text-slate-300" />
            <p className="text-base font-semibold text-slate-600">No leave applications found</p>
            <p className="text-xs text-slate-400 mt-1">
              Any leave submitted by student or parent will appear here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {leaves.map((leave) => {
              const isExpanded = expandedLeaveId === leave.id;
              const isParentPending = leave.parentVerificationStatus === 'PENDING';

              return (
                <div key={leave.id} className="transition-colors hover:bg-slate-50/70">
                  <div
                    onClick={() => setExpandedLeaveId(isExpanded ? null : leave.id)}
                    className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-slate-800 text-sm">{leave.leaveType}</span>
                        <span className="text-xs font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                          {leave.startDate} &rarr; {leave.endDate}
                        </span>
                        {getStatusBadge(leave.status)}
                      </div>
                      <p className="text-xs text-slate-600 italic">"{leave.reason}"</p>
                      <p className="text-[11px] text-slate-400">
                        Submitted: {new Date(leave.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 self-end md:self-center" onClick={(e) => e.stopPropagation()}>
                      {isParentPending && (
                        <>
                          <button
                            onClick={() => handleSimulateIVR(leave.id, true)}
                            className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-lg text-xs font-semibold flex items-center gap-1.5"
                          >
                            <PhoneCall className="w-3.5 h-3.5 text-indigo-600" />
                            Mock IVR Call
                          </button>
                          <button
                            onClick={() =>
                              setActionLeave({
                                ...leave,
                                actionType: 'parent',
                                stageName: 'Parent Verification'
                              })
                            }
                            className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold shadow-sm"
                          >
                            Verify Online
                          </button>
                        </>
                      )}

                      <button
                        onClick={() => setExpandedLeaveId(isExpanded ? null : leave.id)}
                        className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
                      >
                        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Expanded 3-Stage Timeline */}
                  {isExpanded && (
                    <div className="px-6 pb-6 pt-2 bg-slate-50/50 border-t border-slate-100">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                        Verification Audit Trail:
                      </h4>
                      <LeaveTimeline leave={leave} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modals */}
      <ApplyLeaveModal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        onSuccess={() => selectedChild && fetchLeaves(selectedChild.id)}
        studentId={selectedChild?.id}
      />

      <LeaveActionModal
        isOpen={!!actionLeave}
        onClose={() => setActionLeave(null)}
        leave={actionLeave}
        stage="parent"
        stageTitle="Parent Authorization"
        onSuccess={() => {
          setActionLeave(null);
          if (selectedChild) fetchLeaves(selectedChild.id);
        }}
      />
    </div>
  );
}

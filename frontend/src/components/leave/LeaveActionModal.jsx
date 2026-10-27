import React, { useState } from 'react';
import Modal from '../common/Modal';
import { leaveService } from '../../services';
import { CheckCircle2, XCircle, AlertCircle, PhoneCall, ShieldCheck, UserCheck } from 'lucide-react';

export default function LeaveActionModal({ isOpen, onClose, leave, stage = 'teacher', stageTitle, onSuccess }) {
  const [remarks, setRemarks] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!leave) return null;

  const handleAction = async (actionStatus) => {
    try {
      setLoading(true);
      setError('');

      const payload = {
        status: actionStatus,
        remarks: remarks || `${stageTitle} decision: ${actionStatus}`,
        ivrConfirmed: stage === 'parent' ? true : false
      };

      if (stage === 'parent') {
        await leaveService.parentVerify(leave.id, payload);
      } else if (stage === 'teacher') {
        await leaveService.teacherVerify(leave.id, payload);
      } else if (stage === 'coordinator') {
        await leaveService.coordinatorVerify(leave.id, payload);
      }

      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || `Failed to process ${stage} action.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={stageTitle || 'Review Leave Request'}
      subtitle={`Application for ${leave.studentName || 'Student'} (${leave.className || 'Class 10-A'})`}
      size="md"
    >
      <div className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-slate-500">Leave Type:</span>
            <span className="font-bold text-slate-800">{leave.leaveType}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Duration:</span>
            <span className="font-mono font-semibold text-slate-800">
              {leave.startDate} &rarr; {leave.endDate}
            </span>
          </div>
          <div className="pt-2 border-t border-slate-200">
            <span className="text-slate-500 block mb-1">Student Reason:</span>
            <p className="p-2 bg-white rounded border border-slate-200 text-slate-700 italic">
              "{leave.reason}"
            </p>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Verification Remarks / Notes
          </label>
          <textarea
            rows={3}
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder="Add reviewer notes or reason for approval / rejection..."
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-primary-500 focus:outline-none resize-none"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={() => handleAction('REJECTED')}
            className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-sm flex items-center gap-1.5"
          >
            <XCircle className="w-4 h-4" />
            Reject Request
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={() => handleAction('APPROVED')}
            className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4" />
            Approve Request
          </button>
        </div>
      </div>
    </Modal>
  );
}
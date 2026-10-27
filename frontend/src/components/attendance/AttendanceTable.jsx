import React from 'react';
import Badge from '../common/Badge';
import { CheckCircle2, XCircle, ShieldCheck, AlertCircle, Info } from 'lucide-react';

export default function AttendanceTable({ records = [], showStudent = true }) {
  if (!records || records.length === 0) {
    return (
      <div className="p-8 text-center text-slate-400">
        <AlertCircle className="w-8 h-8 mx-auto mb-2 text-slate-300" />
        <p className="text-sm font-medium">No attendance records found</p>
      </div>
    );
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PRESENT':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Present
          </span>
        );
      case 'ON_DUTY':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-200">
            <ShieldCheck className="w-3.5 h-3.5 text-purple-600" /> On Duty (OD)
          </span>
        );
      case 'ABSENT':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
            <XCircle className="w-3.5 h-3.5 text-rose-600" /> Absent
          </span>
        );
      default:
        return <Badge status="default">{status}</Badge>;
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            <th className="py-3 px-4">Date</th>
            {showStudent && <th className="py-3 px-4">Student</th>}
            {showStudent && <th className="py-3 px-4">Class</th>}
            <th className="py-3 px-4">Status</th>
            <th className="py-3 px-4">Prior Leave / Absence Info</th>
            <th className="py-3 px-4">Remarks / Duty</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-sm">
          {records.map((r) => {
            const hasPriorLeave = r.priorLeaveInfo && r.priorLeaveInfo !== 'No Prior Leave';

            return (
              <tr key={r.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="py-3 px-4 font-mono text-xs text-slate-700 font-semibold whitespace-nowrap">
                  {r.date}
                </td>

                {showStudent && (
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-800">{r.studentName}</div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      Adm: {r.studentAdmissionNumber || 'ADM-001'}
                    </div>
                  </td>
                )}

                {showStudent && (
                  <td className="py-3 px-4 text-xs font-medium text-slate-600 whitespace-nowrap">
                    {r.className || 'Class 10-A'}
                  </td>
                )}

                <td className="py-3 px-4 whitespace-nowrap">{getStatusBadge(r.status)}</td>

                <td className="py-3 px-4 text-xs">
                  {r.status === 'ABSENT' ? (
                    hasPriorLeave ? (
                      <span className="inline-flex items-center gap-1 font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        <Info className="w-3 h-3 text-emerald-600 shrink-0" />
                        {r.priorLeaveInfo}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 font-medium text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                        <AlertCircle className="w-3 h-3 text-rose-600 shrink-0" />
                        No Prior Leave Submitted
                      </span>
                    )
                  ) : (
                    <span className="text-slate-400">&mdash;</span>
                  )}
                </td>

                <td className="py-3 px-4 text-xs text-slate-600 max-w-xs truncate">
                  {r.remarks || (r.status === 'ON_DUTY' ? 'Representing School' : 'Regular Attendance')}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
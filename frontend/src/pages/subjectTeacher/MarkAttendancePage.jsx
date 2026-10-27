import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { classService, studentService, attendanceService } from '../../services';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import {
  CheckSquare,
  Users,
  Calendar,
  Save,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  AlertCircle,
  Sparkles,
  Award,
  Clock
} from 'lucide-react';

export default function MarkAttendancePage() {
  const { user, role: stateRole } = useSelector((state) => state.auth);
  const effectiveRole = user?.role || user?.primaryRole || stateRole || (user?.roles && user.roles[0]);
  const canMark = effectiveRole === 'SUBJECT_TEACHER' || effectiveRole === 'PRINCIPAL';

  const [classes, setClasses] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [students, setStudents] = useState([]);
  const [attendanceState, setAttendanceState] = useState({});
  const [remarksState, setRemarksState] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    if (selectedClassId) {
      fetchClassStudents(selectedClassId, date);
    }
  }, [selectedClassId, date]);

  const fetchClasses = async () => {
    try {
      const data = await classService.getAllClasses();
      setClasses(data);
      if (data.length > 0) {
        setSelectedClassId(data[0].id);
      }
    } catch (err) {
      console.error('Failed to load classes:', err);
    }
  };

  const fetchClassStudents = async (classId, targetDate) => {
    try {
      setLoading(true);
      setError('');
      const [studentList, existingRecords] = await Promise.all([
        studentService.getAllStudents({ classId }),
        attendanceService.getAttendance({ classId, startDate: targetDate, endDate: targetDate }).catch(() => [])
      ]);

      setStudents(studentList);

      const newAtt = {};
      const newRem = {};

      studentList.forEach((s) => {
        const existing = existingRecords.find((r) => r.studentId === s.id);
        if (existing) {
          newAtt[s.id] = existing.status;
          newRem[s.id] = existing.remarks || '';
        } else {
          newAtt[s.id] = 'PRESENT';
          newRem[s.id] = '';
        }
      });

      setAttendanceState(newAtt);
      setRemarksState(newRem);
    } catch (err) {
      setError('Failed to load student roster for attendance.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (studentId, status) => {
    setAttendanceState((prev) => ({ ...prev, [studentId]: status }));
  };

  const handleRemarksChange = (studentId, remarks) => {
    setRemarksState((prev) => ({ ...prev, [studentId]: remarks }));
  };

  const handleMarkAll = (status) => {
    const updated = {};
    students.forEach((s) => {
      updated[s.id] = status;
    });
    setAttendanceState(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedClassId || students.length === 0) return;

    try {
      setSaving(true);
      setError('');
      setMessage('');

      const items = students.map((s) => ({
        studentId: s.id,
        status: attendanceState[s.id] || 'PRESENT',
        remarks: remarksState[s.id] || (attendanceState[s.id] === 'ON_DUTY' ? 'Representing School' : '')
      }));

      await attendanceService.markBulkAttendance({
        classId: parseInt(selectedClassId),
        date,
        records: items
      });

      setMessage('Attendance successfully marked & recorded with full OD calculations and prior-leave check.');
      setTimeout(() => setMessage(''), 5000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit attendance.');
    } finally {
      setSaving(false);
    }
  };

  // Metrics summary
  const presentCount = Object.values(attendanceState).filter((s) => s === 'PRESENT').length;
  const onDutyCount = Object.values(attendanceState).filter((s) => s === 'ON_DUTY').length;
  const absentCount = Object.values(attendanceState).filter((s) => s === 'ABSENT').length;
  const totalStudents = students.length;
  const effectivePct = totalStudents > 0 ? (((presentCount + onDutyCount) / totalStudents) * 100).toFixed(1) : 0;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className="liquid-glass p-6 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
              Institutional Attendance Roll
            </span>
            <span className="px-3 py-0.5 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
              3-State Protocol
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2">
            <CheckSquare className="w-6 h-6 text-indigo-600" />
            Mark Class Attendance & On Duty (OD)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {canMark 
              ? 'Strict 3-Status Policy (Present, On Duty, Absent). OD awards 100% attendance credit in reporting.'
              : 'Read-Only View: Daily attendance is recorded by assigned Subject Teachers.'}
          </p>
        </div>

        {canMark ? (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleMarkAll('PRESENT')}
              className="px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold transition-all shadow-sm"
            >
              Mark All Present
            </button>
          </div>
        ) : (
          <div className="px-4 py-2 bg-slate-100 border border-slate-200 text-slate-600 rounded-xl text-xs font-bold flex items-center gap-2">
            <span>Read-Only Mode</span>
          </div>
        )}
      </div>

      {message && (
        <div className="liquid-glass p-4 rounded-2xl border border-emerald-300 bg-emerald-50/80 text-emerald-800 text-xs font-medium flex items-center gap-2.5 shadow-sm animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {error && (
        <div className="liquid-glass p-4 rounded-2xl border border-rose-300 bg-rose-50/80 text-rose-800 text-xs font-medium flex items-center gap-2.5 shadow-sm animate-fade-in">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Selector Controls & Live Metrics Bar */}
      <div className="liquid-glass p-5 rounded-3xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 items-center">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">Select Class & Section</label>
          <select
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            className="liquid-glass-input w-full px-3 py-2 text-sm font-semibold text-slate-800"
          >
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                Class {c.name} - Section {c.section} ({c.classTeacherName ? `Teacher: ${c.classTeacherName}` : 'Unassigned'})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">Attendance Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="liquid-glass-input w-full px-3 py-2 text-sm font-semibold text-slate-800"
          />
        </div>

        <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-50/90 to-purple-50/80 border border-indigo-100 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Live Effective Rate</span>
            <span className="text-xl font-black text-indigo-900">{effectivePct}%</span>
          </div>
          <div className="text-right space-y-0.5 text-xs font-mono font-bold">
            <span className="text-emerald-600 block">{presentCount} Present</span>
            <span className="text-purple-600 block">{onDutyCount} OD</span>
            <span className="text-rose-600 block">{absentCount} Absent</span>
          </div>
        </div>
      </div>

      {/* Student Attendance Marking Roster Table */}
      <form onSubmit={handleSubmit} className="liquid-glass rounded-3xl overflow-hidden shadow-lg border border-white/90">
        <div className="p-5 border-b border-slate-100 bg-slate-50/40 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-black text-slate-800 text-sm">
                Student Attendance Roster ({students.length} Learners)
              </h3>
              <p className="text-[11px] text-slate-400">
                Click status pill to toggle Present, OD, or Absent
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold text-slate-500 bg-white/80 px-3 py-1 rounded-full border border-slate-200">
            Date: {date}
          </span>
        </div>

        {loading ? (
          <div className="p-6">
            <SkeletonLoader type="table" count={5} />
          </div>
        ) : students.length === 0 ? (
          <div className="p-16 text-center text-slate-400">
            <Users className="w-12 h-12 mx-auto mb-2 text-slate-300" />
            <p className="text-base font-bold text-slate-600">No students enrolled in this class</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-100/80 text-[11px] font-bold text-slate-800 uppercase tracking-wider">
                  <th className="py-3.5 px-5">Roll #</th>
                  <th className="py-3.5 px-5">Student Name</th>
                  <th className="py-3.5 px-5">Attendance Status (3-State)</th>
                  <th className="py-3.5 px-5">Remarks / OD Event Purpose</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.map((student) => {
                  const currentStatus = attendanceState[student.id] || 'PRESENT';
                  const studentName = student.fullName || student.name || `${student.firstName || ''} ${student.lastName || ''}`.trim() || 'Student';

                  return (
                    <tr key={student.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-5 font-mono text-xs font-bold text-slate-700">
                        #{student.rollNumber || student.id}
                      </td>

                      <td className="py-3.5 px-5">
                        <div className="font-bold text-slate-900 text-xs">
                          {studentName}
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono font-medium">
                          {student.admissionNumber || `ADM-${student.id}`}
                        </div>
                      </td>

                      <td className="py-3.5 px-5">
                        <div className="inline-flex rounded-2xl p-1 bg-slate-100/90 border border-slate-200/80 gap-1 shadow-inner">
                          <button
                            type="button"
                            disabled={!canMark}
                            onClick={() => handleStatusChange(student.id, 'PRESENT')}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                              currentStatus === 'PRESENT'
                                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20 font-bold scale-102'
                                : canMark ? 'text-slate-600 hover:text-emerald-700 hover:bg-white/60' : 'text-slate-400 cursor-not-allowed'
                            }`}
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Present
                          </button>

                          <button
                            type="button"
                            disabled={!canMark}
                            onClick={() => handleStatusChange(student.id, 'ON_DUTY')}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                              currentStatus === 'ON_DUTY'
                                ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20 font-bold scale-102'
                                : canMark ? 'text-slate-600 hover:text-purple-700 hover:bg-white/60' : 'text-slate-400 cursor-not-allowed'
                            }`}
                          >
                            <ShieldCheck className="w-3.5 h-3.5" />
                            On Duty (OD)
                          </button>

                          <button
                            type="button"
                            disabled={!canMark}
                            onClick={() => handleStatusChange(student.id, 'ABSENT')}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                              currentStatus === 'ABSENT'
                                ? 'bg-rose-600 text-white shadow-md shadow-rose-500/20 font-bold scale-102'
                                : canMark ? 'text-slate-600 hover:text-rose-700 hover:bg-white/60' : 'text-slate-400 cursor-not-allowed'
                            }`}
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            Absent
                          </button>
                        </div>
                      </td>

                      <td className="py-3.5 px-5">
                        <input
                          type="text"
                          disabled={!canMark}
                          value={remarksState[student.id] || ''}
                          onChange={(e) => handleRemarksChange(student.id, e.target.value)}
                          placeholder={
                            !canMark ? '-' :
                            currentStatus === 'ON_DUTY'
                              ? 'Specify event (e.g. Science Fair, Zonal Athletics)'
                              : 'Optional notes...'
                          }
                          className={`liquid-glass-input w-full px-3 py-1.5 text-xs font-medium ${!canMark ? 'bg-slate-100 cursor-not-allowed text-slate-500' : 'text-slate-700'}`}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {students.length > 0 && canMark && (
          <div className="p-5 bg-slate-50/80 border-t border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="text-xs text-slate-500 font-medium">
              Absence alerts with prior-leave validation will be automatically dispatched to parents.
            </div>

            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-500/20 hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Recording Attendance...' : 'Save & Submit Attendance'}
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
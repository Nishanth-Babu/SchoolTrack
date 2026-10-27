import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { attendanceService } from '../../services';
import AttendanceTable from '../../components/attendance/AttendanceTable';
import StatCard from '../../components/common/StatCard';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import { Calendar, AlertCircle, Info, CheckCircle2, ShieldAlert } from 'lucide-react';

export default function AbsenceHistoryPage() {
  const { user } = useSelector((state) => state.auth);
  const [absences, setAbsences] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAbsences();
  }, []);

  const fetchAbsences = async () => {
    try {
      setLoading(true);
      const data = await attendanceService.getStudentAbsences(user?.profileId || 1);
      setAbsences(data);
    } catch (err) {
      console.error('Failed to load absence history:', err);
    } finally {
      setLoading(false);
    }
  };

  const excusedAbsences = absences.filter(
    (a) => a.priorLeaveInfo && a.priorLeaveInfo !== 'No Prior Leave'
  ).length;
  const unexcusedAbsences = absences.length - excusedAbsences;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-rose-600" />
            Absence History & Prior Leave Information
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Log of all recorded absences with automatic prior leave association.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Total Absences"
          value={absences.length}
          subtitle="Recorded absent sessions"
          icon={AlertCircle}
          color="rose"
        />
        <StatCard
          title="Prior Leave Approved"
          value={excusedAbsences}
          subtitle="Medical / Casual Leave exists"
          icon={CheckCircle2}
          color="emerald"
        />
        <StatCard
          title="Uninformed Absences"
          value={unexcusedAbsences}
          subtitle="No prior approved leave"
          icon={ShieldAlert}
          color="amber"
        />
      </div>

      {/* Absence Policy Explainer */}
      <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 text-xs text-amber-900 space-y-1">
        <p className="font-bold flex items-center gap-1.5">
          <Info className="w-4 h-4 text-amber-600" />
          Prior Leave Information Policy
        </p>
        <p>
          Whenever an absence is recorded, SchoolTrack automatically verifies whether an approved medical or casual leave existed on that date. If an approved leave was on record, it is highlighted as "Approved Leave" in teacher and parent dashboards.
        </p>
      </div>

      {/* Absences Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
        <h3 className="font-bold text-slate-800 text-base">Recorded Absence Entries</h3>

        {loading ? (
          <SkeletonLoader type="table" count={4} />
        ) : absences.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <CheckCircle2 className="w-12 h-12 mx-auto mb-2 text-emerald-400" />
            <p className="text-base font-semibold text-slate-600">Perfect Attendance Record!</p>
            <p className="text-xs text-slate-400 mt-1">You have zero recorded absences on file.</p>
          </div>
        ) : (
          <AttendanceTable records={absences} showStudent={false} />
        )}
      </div>
    </div>
  );
}
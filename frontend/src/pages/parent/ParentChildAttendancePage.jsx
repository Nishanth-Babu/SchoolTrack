import React, { useState, useEffect } from 'react';
import { studentService, attendanceService } from '../../services';
import AttendanceTable from '../../components/attendance/AttendanceTable';
import AttendancePieChart from '../../components/charts/AttendancePieChart';
import MonthlyTrendChart from '../../components/charts/MonthlyTrendChart';
import StatCard from '../../components/common/StatCard';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import { Award, CheckCircle, AlertCircle, ShieldCheck, Calendar, Filter } from 'lucide-react';

export default function ParentChildAttendancePage() {
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState(null);
  const [stats, setStats] = useState(null);
  const [records, setRecords] = useState([]);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChildren();
  }, []);

  useEffect(() => {
    if (selectedChild) {
      fetchChildAttendance(selectedChild.id);
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
      console.error('Failed to load children:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchChildAttendance = async (childId) => {
    try {
      const [attStats, attList] = await Promise.all([
        attendanceService.getStudentAttendanceStats(childId).catch(() => null),
        attendanceService.getAttendance({ studentId: childId }).catch(() => [])
      ]);
      setStats(attStats);
      setRecords(attList);
    } catch (err) {
      console.error('Failed to fetch attendance:', err);
    }
  };

  const filteredRecords = records.filter((r) => {
    if (statusFilter === 'ALL') return true;
    return r.status === statusFilter;
  });

  if (loading && children.length === 0) {
    return <SkeletonLoader type="dashboard" count={4} />;
  }

  return (
    <div className="space-y-6">
      {/* Header & Child Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Child Attendance Breakdown</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Detailed logs, prior leave status check, and monthly attendance performance.
          </p>
        </div>

        {children.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Student:</span>
            <select
              value={selectedChild?.id || ''}
              onChange={(e) => {
                const found = children.find((c) => c.id === parseInt(e.target.value));
                if (found) setSelectedChild(found);
              }}
              className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 focus:ring-2 focus:ring-teal-500 focus:outline-none"
            >
              {children.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.fullName || c.name || `${c.firstName || ''} ${c.lastName || ''}`.trim() || 'Student'} ({c.className || '10-A'})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {selectedChild && (
        <>
          {/* Key Metric Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Effective Attendance"
              value={`${stats?.attendancePercentage?.toFixed(1) || 0}%`}
              subtitle="(Present + OD) / Total * 100"
              icon={Award}
              color="emerald"
            />
            <StatCard
              title="Present Days"
              value={stats?.presentCount || 0}
              subtitle="Regular in-class days"
              icon={CheckCircle}
              color="blue"
            />
            <StatCard
              title="On Duty (OD)"
              value={stats?.onDutyCount || 0}
              subtitle="Recognized duty / events"
              icon={ShieldCheck}
              color="purple"
            />
            <StatCard
              title="Absent Days"
              value={stats?.absentCount || 0}
              subtitle="Unattended sessions"
              icon={AlertCircle}
              color="rose"
            />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AttendancePieChart
              present={stats?.presentCount || 0}
              absent={stats?.absentCount || 0}
              onDuty={stats?.onDutyCount || 0}
            />
            <MonthlyTrendChart data={stats?.monthlyBreakdown || []} />
          </div>

          {/* Detailed Attendance Log Table with Filter */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
                <Calendar className="w-5 h-5 text-teal-600" />
                Attendance Log for {selectedChild.fullName || selectedChild.name || `${selectedChild.firstName || ''} ${selectedChild.lastName || ''}`.trim() || 'Student'}
              </h3>

              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-400" />
                <span className="text-xs text-slate-500 font-medium">Filter Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-2.5 py-1 text-xs border border-slate-300 rounded-lg text-slate-700 font-medium focus:ring-2 focus:ring-teal-500 focus:outline-none"
                >
                  <option value="ALL">All Records</option>
                  <option value="PRESENT">Present Only</option>
                  <option value="ON_DUTY">On Duty (OD) Only</option>
                  <option value="ABSENT">Absent Only</option>
                </select>
              </div>
            </div>

            <AttendanceTable records={filteredRecords} showStudent={false} />
          </div>
        </>
      )}
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { reportService, classService, attendanceService } from '../../services';
import AttendanceTable from '../../components/attendance/AttendanceTable';
import StatCard from '../../components/common/StatCard';
import AttendancePieChart from '../../components/charts/AttendancePieChart';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import {
  FileSpreadsheet,
  Download,
  Filter,
  Calendar,
  CheckCircle,
  AlertCircle,
  Award,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';

export default function ReportsPage() {
  const [classes, setClasses] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState('');
  const [startDate, setStartDate] = useState(
    new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [statusFilter, setStatusFilter] = useState('ALL');

  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    fetchReport();
  }, [selectedClassId, startDate, endDate]);

  const fetchClasses = async () => {
    try {
      const list = await classService.getAllClasses();
      setClasses(list);
    } catch (err) {
      console.error('Failed to load classes:', err);
    }
  };

  const fetchReport = async () => {
    try {
      setLoading(true);
      const params = {
        startDate,
        endDate,
        classId: selectedClassId || undefined
      };
      const data = await attendanceService.getAttendance(params);
      setReportData(data);
    } catch (err) {
      console.error('Failed to load report data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Metrics calculation
  const total = reportData.length;
  const present = reportData.filter((r) => r.status === 'PRESENT').length;
  const onDuty = reportData.filter((r) => r.status === 'ON_DUTY').length;
  const absent = reportData.filter((r) => r.status === 'ABSENT').length;
  const effectivePercentage = total > 0 ? (((present + onDuty) / total) * 100).toFixed(1) : 0;

  const filteredRecords = reportData.filter((r) => {
    if (statusFilter === 'ALL') return true;
    return r.status === statusFilter;
  });

  const exportCSV = () => {
    if (filteredRecords.length === 0) return;

    const headers = ['ID', 'Date', 'Student Name', 'Admission No', 'Class', 'Status', 'Prior Leave Info', 'Remarks'];
    const rows = filteredRecords.map((r) => [
      r.id,
      r.date,
      `"${r.studentName || ''}"`,
      r.studentAdmissionNumber || '',
      r.className || '',
      r.status,
      `"${r.priorLeaveInfo || 'None'}"`,
      `"${r.remarks || ''}"`
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SchoolTrack_Attendance_Report_${startDate}_to_${endDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in font-sans">
      {/* Header */}
      <div className="liquid-glass p-6 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-white/90 shadow-lg">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-2xs">
              Audit & Compliance
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <FileSpreadsheet className="w-7 h-7 text-indigo-600" />
            Attendance Analytics & Reports
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Institutional attendance records, On Duty calculations, and exportable audit reports.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchReport}
            className="p-2.5 bg-white/90 hover:bg-white text-slate-600 hover:text-indigo-600 rounded-xl border border-slate-200 shadow-2xs transition-all cursor-pointer"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-indigo-600' : ''}`} />
          </button>

          <button
            onClick={exportCSV}
            disabled={filteredRecords.length === 0}
            className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Filter Control Bar */}
      <div className="liquid-glass p-5 rounded-3xl border border-white/90 shadow-lg grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">Class Filter</label>
          <select
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            className="w-full px-3.5 py-2 bg-white/90 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-2xs"
          >
            <option value="">All Classes</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                Class {c.name} - Section {c.section}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">From Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full px-3.5 py-2 bg-white/90 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-2xs"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">To Date</label>
          <input
            type="date"
            value={endDate}
            min={startDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full px-3.5 py-2 bg-white/90 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-2xs"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">Status Filter</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3.5 py-2 bg-white/90 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-2xs"
          >
            <option value="ALL">All Statuses</option>
            <option value="PRESENT">Present Only</option>
            <option value="ON_DUTY">On Duty (OD) Only</option>
            <option value="ABSENT">Absent Only</option>
          </select>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total Logged"
          value={total}
          subtitle="Records in period"
          icon={Calendar}
          color="blue"
        />
        <StatCard
          title="Present"
          value={present}
          subtitle="Physical attendance"
          icon={CheckCircle}
          color="emerald"
        />
        <StatCard
          title="On Duty (OD)"
          value={onDuty}
          subtitle="Counts as 100% Present"
          icon={ShieldCheck}
          color="purple"
        />
        <StatCard
          title="Absent"
          value={absent}
          subtitle="Unattended sessions"
          icon={AlertCircle}
          color="rose"
        />
        <StatCard
          title="Effective Rate"
          value={`${effectivePercentage}%`}
          subtitle="(Present + OD) / Total"
          icon={Award}
          color="amber"
        />
      </div>

      {/* Charts & Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <AttendancePieChart present={present} absent={absent} onDuty={onDuty} />
        </div>

        <div className="lg:col-span-2 liquid-glass p-6 rounded-3xl border border-white/90 shadow-lg flex flex-col justify-between">
          <div>
            <h3 className="font-black text-slate-900 text-base mb-2 tracking-tight">Institutional Compliance Notice</h3>
            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              In accordance with SchoolTrack policy:
            </p>
            <ul className="mt-3 space-y-2 text-xs text-slate-700 font-medium list-disc list-inside">
              <li>
                <strong className="text-slate-900">On Duty (OD)</strong> entries are recognized as official school representation and calculate into the attendance percentage with equal standing to <strong className="text-slate-900">Present</strong>.
              </li>
              <li>
                <strong className="text-slate-900">Leave requests</strong> do not replace attendance statuses. Absence records automatically display whether an approved medical or casual leave existed at the time of marking.
              </li>
              <li>
                Absence alert dispatch records are archived and accessible in the system Audit Logs.
              </li>
            </ul>
          </div>

          <div className="p-4 bg-slate-50/90 rounded-2xl border border-slate-200 mt-5 flex flex-wrap items-center justify-between text-xs text-slate-600 font-medium">
            <span>Selected Range: <strong className="text-slate-900 font-bold">{startDate}</strong> to <strong className="text-slate-900 font-bold">{endDate}</strong></span>
            <span>Total Students Evaluated: <strong className="text-indigo-700 font-bold">{new Set(reportData.map((r) => r.studentId)).size}</strong></span>
          </div>
        </div>
      </div>

      {/* Report Records Table */}
      <div className="liquid-glass p-6 rounded-3xl border border-white/90 shadow-lg space-y-4">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200/80">
          <h3 className="font-black text-slate-900 text-base tracking-tight">
            Detailed Records ({filteredRecords.length})
          </h3>
        </div>

        {loading ? (
          <SkeletonLoader type="table" count={5} />
        ) : (
          <AttendanceTable records={filteredRecords} showStudent={true} />
        )}
      </div>
    </div>
  );
}

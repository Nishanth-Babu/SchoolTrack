import React, { useState, useEffect } from 'react';
import {
  FileText,
  Download,
  Printer,
  Sparkles,
  BrainCircuit,
  AlertTriangle,
  CheckCircle2,
  BookOpen,
  Calendar,
  Layers,
  ChevronDown
} from 'lucide-react';
import { aiService, studentService } from '../../services';

const AiStudentReportCard = ({ studentId = null, className = '' }) => {
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState(null);
  const [studentsList, setStudentsList] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState(studentId);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await studentService.getAllStudents();
        if (res && res.length > 0) {
          setStudentsList(res);
          if (!selectedStudentId) {
            const defaultStudent = res.length > 1 ? res[1].id : res[0].id;
            setSelectedStudentId(defaultStudent);
          }
        }
      } catch (err) {
        console.warn('Could not load student list for report card', err);
      }
    };
    fetchStudents();
  }, []);

  useEffect(() => {
    if (studentId) {
      setSelectedStudentId(studentId);
    }
  }, [studentId]);

  const loadReport = async () => {
    if (!selectedStudentId) return;
    try {
      setLoading(true);
      setError(null);
      const res = await aiService.getStudentReport(selectedStudentId);
      setReport(res);
    } catch (err) {
      console.error('Failed to generate AI student report', err);
      setError('Unable to compile AI diagnostic report.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReport();
  }, [selectedStudentId]);

  const handlePrint = () => {
    window.print();
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'EXCELLING':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-2xs">
            Excelling
          </span>
        );
      case 'ON_TRACK':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-sky-50 text-sky-800 border border-sky-200 shadow-2xs">
            On Track
          </span>
        );
      case 'NEEDS_ATTENTION':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 shadow-2xs">
            Needs Attention
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-800 border border-rose-200 shadow-2xs animate-pulse">
            At Risk
          </span>
        );
    }
  };

  return (
    <div className={`liquid-glass rounded-3xl p-6 relative overflow-hidden border border-white/90 shadow-lg ${className}`}>
      {/* Background ambient light */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl pointer-events-none -mr-10 -mt-10"></div>

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-slate-200/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-600 via-rose-600 to-purple-600 p-0.5 shadow-md shadow-pink-500/20">
            <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
              <FileText className="w-5 h-5 text-pink-600" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-black text-slate-900 tracking-tight">AI Generated Student Report</h3>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-pink-50 border border-pink-200 text-pink-700">
                Diagnostic
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Synthesis of marks, attendance logs & behavioral patterns
            </p>
          </div>
        </div>

        {studentsList.length > 1 && (
          <select
            value={selectedStudentId || ''}
            onChange={(e) => setSelectedStudentId(Number(e.target.value))}
            className="px-3.5 py-1.5 rounded-xl bg-white/90 border border-slate-200 text-xs text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-pink-500/20 shadow-2xs"
          >
            {studentsList.map((s) => (
              <option key={s.id} value={s.id} className="bg-white text-slate-900">
                {s.user?.fullName || s.name || `Student #${s.id}`} ({s.rollNumber || s.admissionNumber})
              </option>
            ))}
          </select>
        )}
      </div>

      {loading ? (
        <div className="py-14 flex flex-col items-center justify-center text-slate-500 space-y-3">
          <BrainCircuit className="w-8 h-8 text-pink-600 animate-spin" />
          <p className="text-sm font-semibold">Generating comprehensive diagnostic report...</p>
        </div>
      ) : error || !report ? (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm my-4 font-semibold">
          {error || 'No student report found.'}
        </div>
      ) : (
        <div className="mt-5 space-y-5">
          {/* Profile bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-white/80 border border-slate-200/90 shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center font-bold text-sm text-white shadow-sm">
                {report.studentName ? report.studentName.charAt(0) : 'S'}
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm tracking-tight">{report.studentName}</h4>
                <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mt-0.5">
                  <span>Roll: <strong className="text-slate-800 font-bold">{report.rollNumber}</strong></span>
                  <span>•</span>
                  <span>{report.className}</span>
                </div>
              </div>
            </div>
            <div>
              {getStatusBadge(report.overallStatus)}
            </div>
          </div>

          {/* Metric Badges Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-2xl bg-white/80 border border-slate-200/90 text-center shadow-2xs">
              <span className="text-[11px] text-slate-500 block uppercase font-bold">Attendance</span>
              <span className="text-xl font-black text-slate-900 mt-1 block">{report.attendancePercentage}%</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/80 border border-slate-200/90 text-center shadow-2xs">
              <span className="text-[11px] text-slate-500 block uppercase font-bold">Exam Average</span>
              <span className="text-xl font-black text-slate-900 mt-1 block">{report.averageMarks}%</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/80 border border-slate-200/90 text-center shadow-2xs">
              <span className="text-[11px] text-slate-500 block uppercase font-bold">Homework</span>
              <span className="text-xl font-black text-slate-900 mt-1 block">{report.homeworkCompletionRate}%</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/80 border border-slate-200/90 text-center shadow-2xs">
              <span className="text-[11px] text-slate-500 block uppercase font-bold">Leaves</span>
              <span className="text-xl font-black text-slate-900 mt-1 block">{report.totalLeavesTaken}</span>
            </div>
          </div>

          {/* Diagnostic Insights */}
          <div className="p-4 rounded-2xl bg-pink-50/60 border border-pink-100 space-y-3 shadow-2xs">
            <div className="flex items-center gap-2 text-xs uppercase font-bold text-pink-800 tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-pink-600" />
              <span>AI Diagnostic Evaluation</span>
            </div>
            <ul className="space-y-2 text-xs text-slate-700 font-medium">
              {report.diagnosticInsights?.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-pink-500 flex-shrink-0 mt-1.5"></span>
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Executive Summary */}
          <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-100 text-xs text-slate-700 font-medium leading-relaxed shadow-2xs">
            <strong className="text-purple-900 font-bold block mb-1">Summary Assessment:</strong>
            {report.executiveSummary}
          </div>

          {/* Action Buttons: Generate & Download */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <button
              onClick={loadReport}
              className="px-4 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 hover:text-slate-900 transition-all active:scale-95 flex items-center gap-2 shadow-2xs cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-pink-600" />
              <span>Generate Report</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-600 via-rose-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white text-xs font-bold shadow-md shadow-pink-500/20 transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Report</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AiStudentReportCard;

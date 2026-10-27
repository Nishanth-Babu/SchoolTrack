import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { markService } from '../../services';
import {
  Award,
  BookOpen,
  Printer,
  TrendingUp,
  Percent,
  CheckCircle2,
  Calendar,
  Sparkles,
  Layers,
  GraduationCap
} from 'lucide-react';
import StatCard from '../../components/common/StatCard';
import Badge from '../../components/common/Badge';

export default function StudentReportCardPage() {
  const { user } = useSelector((state) => state.auth);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedExam, setSelectedExam] = useState('ALL');

  useEffect(() => {
    if (user?.profileId) {
      loadReportCard(user.profileId);
    }
  }, [user]);

  const loadReportCard = async (studentId) => {
    try {
      setLoading(true);
      const data = await markService.getStudentReportCard(studentId);
      setReport(data);
    } catch (err) {
      console.error('Failed to load report card', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-xs text-slate-400 font-semibold">
        Generating comprehensive report card...
      </div>
    );
  }

  if (!report) {
    return (
      <div className="p-12 text-center text-xs text-slate-400 font-semibold">
        No evaluation records found on file.
      </div>
    );
  }

  const examKeys = report.marksByExam ? Object.keys(report.marksByExam) : [];
  const displayedMarks = selectedExam === 'ALL'
    ? report.marks
    : (report.marksByExam ? report.marksByExam[selectedExam] || [] : []);

  return (
    <div className="space-y-6 pb-12 print:p-0 print:space-y-4">
      {/* Header & Print Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 print:hidden">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <GraduationCap className="w-7 h-7 text-indigo-600" />
            Academic Report Card & Grades
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Official cumulative performance record for Academic Session {report.academicYear}.
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs shadow-md transition-all cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          <span>Print / Save PDF</span>
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 print:grid-cols-4">
        <StatCard
          title="Overall Percentage"
          value={`${report.overallPercentage}%`}
          subtitle="Cumulative Average"
          icon={Percent}
          color="indigo"
        />
        <StatCard
          title="Letter Grade"
          value={report.overallGrade}
          subtitle="Performance Tier"
          icon={Award}
          color="emerald"
        />
        <StatCard
          title="Cumulative GPA"
          value={`${report.gpa} / 10.0`}
          subtitle="Grade Point Scale"
          icon={Sparkles}
          color="purple"
        />
        <StatCard
          title="Total Score"
          value={`${report.totalMarksObtained} / ${report.totalMaxMarks}`}
          subtitle="All Assessments"
          icon={BookOpen}
          color="amber"
        />
      </div>

      {/* Official Certificate Header (For Print and Display) */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-100 pb-4 mb-4 gap-3">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-600 block">
              Official Student Record
            </span>
            <h2 className="text-lg font-black text-slate-900">{report.studentName}</h2>
          </div>
          <div className="flex flex-wrap gap-2 text-xs font-semibold text-slate-600">
            <span className="px-3 py-1 bg-slate-100 rounded-lg">Roll No: <strong className="text-slate-900">{report.rollNumber}</strong></span>
            <span className="px-3 py-1 bg-slate-100 rounded-lg">Class: <strong className="text-slate-900">{report.className}</strong></span>
            <span className="px-3 py-1 bg-slate-100 rounded-lg">Admission: <strong className="text-slate-900">{report.admissionNumber}</strong></span>
          </div>
        </div>

        {/* Filter by Exam */}
        {examKeys.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4 print:hidden">
            <button
              onClick={() => setSelectedExam('ALL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedExam === 'ALL'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Examinations
            </button>
            {examKeys.map((ex) => (
              <button
                key={ex}
                onClick={() => setSelectedExam(ex)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedExam === ex
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {ex}
              </button>
            ))}
          </div>
        )}

        {/* Subject-Wise Marks Breakdown Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Subject</th>
                <th className="py-3 px-4">Exam Term</th>
                <th className="py-3 px-4">Marks Obtained</th>
                <th className="py-3 px-4">Max Marks</th>
                <th className="py-3 px-4">Percentage</th>
                <th className="py-3 px-4">Grade</th>
                <th className="py-3 px-4">Teacher Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {displayedMarks.map((m) => (
                <tr key={m.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-indigo-500" />
                      <span>{m.subjectName}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">{m.examName}</td>
                  <td className="py-3.5 px-4 font-black text-slate-900">{m.marksObtained}</td>
                  <td className="py-3.5 px-4 text-slate-400">{m.maxMarks}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-700">
                    <div className="flex items-center gap-2">
                      <span>{m.percentage}%</span>
                      <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            m.percentage >= 80 ? 'bg-emerald-500' :
                            m.percentage >= 60 ? 'bg-indigo-500' : 'bg-amber-500'
                          }`}
                          style={{ width: `${m.percentage}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <Badge
                      variant={
                        m.grade === 'A+' ? 'success' :
                        m.grade === 'A' ? 'primary' :
                        m.grade === 'B+' || m.grade === 'B' ? 'info' : 'danger'
                      }
                    >
                      {m.grade}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 italic">
                    "{m.remarks || 'Satisfactory'}"
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Remarks */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
          <span>SchoolTrack Automated Academic Record Engine</span>
          <span>Certified Date: {new Date().toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
}

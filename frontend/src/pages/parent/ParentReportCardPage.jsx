import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { markService, studentService } from '../../services';
import {
  Award,
  BookOpen,
  Printer,
  Sparkles,
  Percent,
  TrendingUp,
  UserCheck,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import StatCard from '../../components/common/StatCard';
import Badge from '../../components/common/Badge';

export default function ParentReportCardPage() {
  const { user } = useSelector((state) => state.auth);

  const [students, setStudents] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState(1);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadChildren();
  }, []);

  useEffect(() => {
    if (selectedStudentId) {
      loadChildReport(selectedStudentId);
    }
  }, [selectedStudentId]);

  const loadChildren = async () => {
    try {
      // In production/demo, fetch students linked to parent (default to Arun id 1)
      const list = await studentService.getAllStudents();
      setStudents(list || []);
      if (list?.length > 0) {
        setSelectedStudentId(list[0].id);
      }
    } catch (err) {
      console.error('Failed to load children', err);
    }
  };

  const loadChildReport = async (studentId) => {
    try {
      setLoading(true);
      const data = await markService.getStudentReportCard(studentId);
      setReport(data);
    } catch (err) {
      console.error('Failed to load child report', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-12 print:p-0 print:space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 print:hidden">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <Award className="w-7 h-7 text-teal-600" />
            Child Academic Progress & Report Card
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Official evaluation details, subject-wise scores, and teacher remarks for your child.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {students.length > 1 && (
            <select
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(Number(e.target.value))}
              className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 shadow-2xs"
            >
              {students.map((st) => (
                <option key={st.id} value={st.id}>{st.fullName} (Roll: {st.rollNumber})</option>
              ))}
            </select>
          )}

          <button
            onClick={handlePrint}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs shadow-md transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs text-slate-400 font-semibold">
          Loading student performance summary...
        </div>
      ) : report ? (
        <>
          {/* Summary KPIs */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 print:grid-cols-4">
            <StatCard
              title="Overall Percentage"
              value={`${report.overallPercentage}%`}
              subtitle="Cumulative Performance"
              icon={Percent}
              color="teal"
            />
            <StatCard
              title="Overall Grade"
              value={report.overallGrade}
              subtitle="Performance Tier"
              icon={Award}
              color="emerald"
            />
            <StatCard
              title="Academic GPA"
              value={`${report.gpa} / 10.0`}
              subtitle="Grade Point Score"
              icon={Sparkles}
              color="indigo"
            />
            <StatCard
              title="Class Standing"
              value={`Top Tier`}
              subtitle={`Class: ${report.className}`}
              icon={UserCheck}
              color="amber"
            />
          </div>

          {/* Report Card Detail Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-100 pb-4 mb-4 gap-3">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-teal-600 block">
                  Student Assessment Summary
                </span>
                <h2 className="text-lg font-black text-slate-900">{report.studentName}</h2>
              </div>
              <div className="flex flex-wrap gap-2 text-xs font-semibold text-slate-600">
                <span className="px-3 py-1 bg-slate-100 rounded-lg">Roll No: <strong className="text-slate-900">{report.rollNumber}</strong></span>
                <span className="px-3 py-1 bg-slate-100 rounded-lg">Class: <strong className="text-slate-900">{report.className}</strong></span>
                <span className="px-3 py-1 bg-slate-100 rounded-lg">Session: <strong className="text-slate-900">{report.academicYear}</strong></span>
              </div>
            </div>

            {/* Subject Marks Table */}
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
                    <th className="py-3 px-4">Teacher Evaluation Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {report.marks?.map((m) => (
                    <tr key={m.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-4 h-4 text-teal-600" />
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
                                m.percentage >= 60 ? 'bg-teal-500' : 'bg-amber-500'
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
                        "{m.remarks || 'Keep up the good performance'}"
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
              <span>Parent Portal Academic Sync &copy; SchoolTrack</span>
              <span>Generated on: {new Date().toLocaleDateString()}</span>
            </div>
          </div>
        </>
      ) : (
        <div className="p-12 text-center text-xs text-slate-400 font-semibold">
          No records available for the selected student.
        </div>
      )}
    </div>
  );
}

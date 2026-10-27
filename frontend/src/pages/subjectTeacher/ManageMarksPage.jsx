import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  markService,
  classService,
  studentService
} from '../../services';
import {
  Award,
  BookOpen,
  Save,
  CheckCircle2,
  AlertCircle,
  Users,
  Search,
  FileSpreadsheet,
  TrendingUp,
  Percent,
  Sparkles
} from 'lucide-react';
import StatCard from '../../components/common/StatCard';
import Badge from '../../components/common/Badge';

export default function ManageMarksPage() {
  const { user, role: stateRole } = useSelector((state) => state.auth);
  const effectiveRole = user?.role || user?.primaryRole || stateRole || (user?.roles && user.roles[0]);
  const canEdit = effectiveRole === 'SUBJECT_TEACHER' || effectiveRole === 'PRINCIPAL';

  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [exams, setExams] = useState([]);

  const [selectedClass, setSelectedClass] = useState(1);
  const [selectedSubject, setSelectedSubject] = useState(1);
  const [selectedExam, setSelectedExam] = useState(1);

  const [students, setStudents] = useState([]);
  const [marksData, setMarksData] = useState({});
  const [maxMarks, setMaxMarks] = useState(100);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    loadInitialFilters();
  }, []);

  useEffect(() => {
    if (selectedClass && selectedSubject && selectedExam) {
      loadStudentsAndMarks();
    }
  }, [selectedClass, selectedSubject, selectedExam]);

  const loadInitialFilters = async () => {
    try {
      const [clsList, subList, exmList] = await Promise.all([
        classService.getAllClasses(),
        classService.getAllSubjects(),
        markService.getExams()
      ]);
      setClasses(clsList || []);
      setSubjects(subList || []);
      setExams(exmList || []);

      if (clsList?.length > 0) setSelectedClass(clsList[0].id);
      if (subList?.length > 0) setSelectedSubject(subList[0].id);
      if (exmList?.length > 0) {
        setSelectedExam(exmList[0].id);
        setMaxMarks(exmList[0].maxMarks || 100);
      }
    } catch (err) {
      console.error('Failed to load filters', err);
    }
  };

  const loadStudentsAndMarks = async () => {
    try {
      setLoading(true);
      const [stList, existingMarks] = await Promise.all([
        studentService.getAllStudents({ classId: selectedClass }),
        markService.getClassSubjectMarks(selectedClass, selectedSubject, selectedExam)
      ]);

      setStudents(stList || []);

      const marksMap = {};
      existingMarks.forEach((m) => {
        marksMap[m.studentId] = {
          marksObtained: m.marksObtained,
          maxMarks: m.maxMarks,
          remarks: m.remarks || '',
          grade: m.grade,
          percentage: m.percentage
        };
      });

      // Fill remaining with defaults
      stList.forEach((s) => {
        if (!marksMap[s.id]) {
          marksMap[s.id] = {
            marksObtained: '',
            maxMarks: maxMarks,
            remarks: '',
            grade: '-',
            percentage: 0
          };
        }
      });

      setMarksData(marksMap);
    } catch (err) {
      console.error('Failed to load marks', err);
    } finally {
      setLoading(false);
    }
  };

  const calculateGrade = (obtained, max) => {
    if (!obtained || obtained === '') return { grade: '-', pct: 0 };
    const pct = Math.round((Number(obtained) / Number(max)) * 100);
    let grade = 'F';
    if (pct >= 90) grade = 'A+';
    else if (pct >= 80) grade = 'A';
    else if (pct >= 70) grade = 'B+';
    else if (pct >= 60) grade = 'B';
    else if (pct >= 50) grade = 'C';
    else if (pct >= 35) grade = 'D';
    return { grade, pct };
  };

  const handleMarkChange = (studentId, val) => {
    const num = val === '' ? '' : Math.min(Number(val), maxMarks);
    const { grade, pct } = calculateGrade(num, maxMarks);

    setMarksData((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        marksObtained: num,
        maxMarks: maxMarks,
        grade,
        percentage: pct
      }
    }));
  };

  const handleRemarksChange = (studentId, remarks) => {
    setMarksData((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        remarks
      }
    }));
  };

  const handleBatchSave = async () => {
    try {
      setSaving(true);
      setNotification(null);

      const markItems = students
        .filter((s) => marksData[s.id]?.marksObtained !== '')
        .map((s) => ({
          studentId: s.id,
          studentName: s.fullName,
          rollNumber: s.rollNumber,
          marksObtained: Number(marksData[s.id].marksObtained),
          maxMarks: Number(maxMarks),
          remarks: marksData[s.id].remarks || 'Graded by Subject Teacher'
        }));

      if (markItems.length === 0) {
        setNotification({ type: 'error', message: 'Please enter marks for at least one student.' });
        return;
      }

      await markService.saveBatchMarks({
        classId: selectedClass,
        subjectId: selectedSubject,
        examId: selectedExam,
        marks: markItems
      });

      setNotification({
        type: 'success',
        message: `Successfully published marks for ${markItems.length} students!`
      });
    } catch (err) {
      setNotification({
        type: 'error',
        message: err.response?.data?.message || 'Failed to save marks.'
      });
    } finally {
      setSaving(false);
    }
  };

  // Stats
  const filledCount = Object.values(marksData).filter((m) => m.marksObtained !== '').length;
  const avgMarks = filledCount > 0
    ? (Object.values(marksData).filter((m) => m.marksObtained !== '').reduce((sum, m) => sum + Number(m.marksObtained), 0) / filledCount).toFixed(1)
    : 0;

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Header Banner */}
      <div className="liquid-glass p-6 rounded-3xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
              Examination Evaluation Portal
            </span>
            <span className="px-3 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Auto-Grading Engine
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2.5">
            <Award className="w-7 h-7 text-indigo-600" />
            Marks & Examination Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {canEdit 
              ? 'Subject Teacher Evaluation Portal: Enter, edit, and publish batch examination marks and grade cards.' 
              : 'Consolidated View Mode: Viewing official marks graded and published by assigned Subject Teachers.'}
          </p>
        </div>

        {canEdit ? (
          <button
            onClick={handleBatchSave}
            disabled={saving || loading}
            className="flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-bold text-xs shadow-md shadow-indigo-500/20 hover:shadow-lg transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Publishing...' : 'Save & Publish Marks'}</span>
          </button>
        ) : (
          <div className="px-4 py-2 bg-slate-100 border border-slate-200 text-slate-600 rounded-xl text-xs font-bold flex items-center gap-2">
            <span>Read-Only View</span>
          </div>
        )}
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Students Graded"
          value={`${filledCount} / ${students.length}`}
          subtitle="Evaluation Progress"
          icon={Users}
          color="indigo"
        />
        <StatCard
          title="Class Average"
          value={`${avgMarks} / ${maxMarks}`}
          subtitle="Score Performance"
          icon={TrendingUp}
          color="emerald"
        />
        <StatCard
          title="Maximum Marks"
          value={maxMarks}
          subtitle="Exam Target Ceiling"
          icon={Percent}
          color="amber"
        />
      </div>

      {notification && (
        <div
          className={`liquid-glass p-4 rounded-2xl text-xs font-semibold flex items-center gap-2.5 border shadow-sm animate-fade-in ${
            notification.type === 'success'
              ? 'bg-emerald-50/80 border-emerald-300 text-emerald-800'
              : 'bg-rose-50/80 border-rose-300 text-rose-800'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Filter Toolbar */}
      <div className="liquid-glass p-5 rounded-3xl grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">Select Class</label>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(Number(e.target.value))}
            className="liquid-glass-input w-full px-3 py-2 text-xs font-semibold text-slate-800"
          >
            {classes.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">Select Subject</label>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(Number(e.target.value))}
            className="liquid-glass-input w-full px-3 py-2 text-xs font-semibold text-slate-800"
          >
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">Select Assessment / Exam</label>
          <select
            value={selectedExam}
            onChange={(e) => {
              const exId = Number(e.target.value);
              setSelectedExam(exId);
              const ex = exams.find((x) => x.id === exId);
              if (ex) setMaxMarks(ex.maxMarks || 100);
            }}
            className="liquid-glass-input w-full px-3 py-2 text-xs font-semibold text-slate-800"
          >
            {exams.map((ex) => (
              <option key={ex.id} value={ex.id}>{ex.name} ({ex.term} - Max: {ex.maxMarks})</option>
            ))}
          </select>
        </div>
      </div>

      {/* Marks Table */}
      <div className="liquid-glass rounded-3xl overflow-hidden shadow-lg border border-white/90">
        <div className="p-5 border-b border-slate-100 bg-slate-50/40 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-indigo-600" />
            <span className="font-bold text-sm text-slate-800">Student Mark Entry Matrix</span>
          </div>
          <span className="text-xs text-indigo-700 font-bold bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
            Max Marks: {maxMarks}
          </span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400 font-semibold">
            Loading student records...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100/80 text-slate-800 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3.5 px-5">Roll No</th>
                  <th className="py-3.5 px-5">Student Name</th>
                  <th className="py-3.5 px-5">Admission No</th>
                  <th className="py-3.5 px-5 w-32">Marks ({maxMarks})</th>
                  <th className="py-3.5 px-5">Grade</th>
                  <th className="py-3.5 px-5">Percentage</th>
                  <th className="py-3.5 px-5">Teacher Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {students.map((student) => {
                  const sMarks = marksData[student.id] || { marksObtained: '', grade: '-', percentage: 0, remarks: '' };
                  return (
                    <tr key={student.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-5 font-bold text-slate-900 font-mono">#{student.rollNumber || student.id}</td>
                      <td className="py-3.5 px-5 text-slate-900 font-bold">{student.fullName}</td>
                      <td className="py-3.5 px-5 text-slate-500 font-mono font-medium">{student.admissionNumber}</td>
                      <td className="py-3.5 px-5">
                        <input
                          type="number"
                          min={0}
                          max={maxMarks}
                          step="0.5"
                          disabled={!canEdit}
                          value={sMarks.marksObtained}
                          onChange={(e) => handleMarkChange(student.id, e.target.value)}
                          placeholder="0"
                          className={`liquid-glass-input w-24 px-3 py-1.5 text-xs font-bold ${!canEdit ? 'bg-slate-100 cursor-not-allowed opacity-80' : 'text-slate-900'}`}
                        />
                      </td>
                      <td className="py-3.5 px-5">
                        <Badge
                          variant={
                            sMarks.grade === 'A+' ? 'success' :
                            sMarks.grade === 'A' ? 'primary' :
                            sMarks.grade === 'B+' || sMarks.grade === 'B' ? 'info' :
                            sMarks.grade === 'F' ? 'danger' : 'neutral'
                          }
                        >
                          {sMarks.grade}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-5 font-bold text-slate-700">
                        {sMarks.percentage ? `${sMarks.percentage}%` : '-'}
                      </td>
                      <td className="py-3.5 px-5">
                        <input
                          type="text"
                          disabled={!canEdit}
                          value={sMarks.remarks || ''}
                          onChange={(e) => handleRemarksChange(student.id, e.target.value)}
                          placeholder={canEdit ? "e.g. Excellent grasp of concepts" : "-"}
                          className={`liquid-glass-input w-full px-3 py-1.5 text-xs ${!canEdit ? 'bg-slate-100 cursor-not-allowed opacity-80 text-slate-500' : 'text-slate-700'}`}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

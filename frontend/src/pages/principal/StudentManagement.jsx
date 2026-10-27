import React, { useState, useEffect } from 'react';
import { studentService, classService, attendanceService } from '../../services';
import Modal from '../../components/common/Modal';
import Badge from '../../components/common/Badge';
import StatCard from '../../components/common/StatCard';
import AttendancePieChart from '../../components/charts/AttendancePieChart';
import AttendanceTable from '../../components/attendance/AttendanceTable';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import {
  GraduationCap,
  Plus,
  Search,
  Filter,
  Users,
  Award,
  Calendar,
  AlertCircle,
  Eye,
  Mail,
  Phone,
  Sparkles,
  School
} from 'lucide-react';

export default function StudentManagement() {
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedClassId, setSelectedClassId] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals & Details
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentStats, setStudentStats] = useState(null);
  const [studentAttendance, setStudentAttendance] = useState([]);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    admissionNumber: '',
    rollNumber: '',
    classId: '',
    parentName: '',
    parentEmail: '',
    parentPhone: ''
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    fetchData();
  }, [selectedClassId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [studentList, classList] = await Promise.all([
        studentService.getAllStudents({ classId: selectedClassId || undefined }),
        classService.getAllClasses()
      ]);
      setStudents(studentList);
      setClasses(classList);
    } catch (err) {
      console.error('Failed to load students:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateStudent = async (e) => {
    e.preventDefault();
    try {
      setFormLoading(true);
      setFormError('');
      await studentService.createStudent({
        ...formData,
        password: 'password123'
      });
      setIsAddModalOpen(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        admissionNumber: '',
        rollNumber: '',
        classId: '',
        parentName: '',
        parentEmail: '',
        parentPhone: ''
      });
      fetchData();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to create student.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleViewStudentDetails = async (student) => {
    setSelectedStudent(student);
    try {
      const [stats, records] = await Promise.all([
        attendanceService.getStudentAttendanceStats(student.id).catch(() => null),
        attendanceService.getAttendance({ studentId: student.id }).catch(() => [])
      ]);
      setStudentStats(stats);
      setStudentAttendance(records);
    } catch (err) {
      console.error('Failed to load student attendance details:', err);
    }
  };

  const filteredStudents = students.filter((s) => {
    const studentName = s.fullName || s.name || `${s.firstName || ''} ${s.lastName || ''}`.trim();
    const matchesSearch =
      (studentName && studentName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (s.email && s.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (s.admissionNumber && s.admissionNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (s.rollNumber && s.rollNumber.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSearch;
  });

  return (
    <div className="space-y-6 pb-12 animate-fade-in font-sans">
      {/* Header Banner */}
      <div className="liquid-glass p-6 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-white/90 shadow-lg">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-2xs">
              School Directory
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <GraduationCap className="w-7 h-7 text-emerald-600" />
            Student Directory & Roster
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Manage student enrollments, sections, admission IDs, and individual attendance history.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-500/20 transition-all flex items-center gap-2 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          Enroll New Student
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="liquid-glass p-5 rounded-3xl border border-white/90 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by student name, email, admission #..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="liquid-glass-input w-full pl-10 pr-4 py-2 text-xs font-semibold text-slate-800"
          />
        </div>

        <div className="flex items-center gap-2.5">
          <Filter className="w-4 h-4 text-slate-500" />
          <select
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            className="liquid-glass-input px-3.5 py-2 text-xs font-bold text-slate-800"
          >
            <option value="">All Classes & Sections</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                Class {c.name} - Section {c.section}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Students Table */}
      <div className="liquid-glass rounded-3xl shadow-lg border border-white/90 overflow-hidden">
        {loading ? (
          <div className="p-6">
            <SkeletonLoader type="table" count={5} />
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="p-16 text-center text-slate-400">
            <GraduationCap className="w-12 h-12 mx-auto mb-2 text-slate-300" />
            <p className="text-base font-bold text-slate-700">No students found</p>
            <p className="text-xs text-slate-500 mt-1">Enroll a student or change class filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-100/80 text-[11px] font-bold text-slate-800 uppercase tracking-wider">
                  <th className="py-3.5 px-5">Student</th>
                  <th className="py-3.5 px-5">Class</th>
                  <th className="py-3.5 px-5">Roll #</th>
                  <th className="py-3.5 px-5">Parent / Guardian</th>
                  <th className="py-3.5 px-5">Effective Attendance</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center justify-center font-black text-sm shadow-2xs">
                          {(s.fullName || s.name || s.firstName || 'S').charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 text-xs">
                            {s.fullName || s.name || `${s.firstName || ''} ${s.lastName || ''}`.trim() || 'Student'}
                          </div>
                          <div className="text-[11px] text-slate-500 font-mono font-medium">
                            Adm: {s.admissionNumber || `ADM-${s.id}`}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-5 text-xs font-bold text-slate-800">
                      Class {s.className || '10-A'}
                    </td>

                    <td className="py-3.5 px-5 text-xs font-mono font-bold text-slate-700">
                      #{s.rollNumber || s.id}
                    </td>

                    <td className="py-3.5 px-5 text-xs">
                      <div className="font-bold text-slate-800">{s.parentName || 'Parent Guardian'}</div>
                      <div className="text-[11px] text-slate-500 font-medium">{s.parentPhone || '+1 (555) 0192'}</div>
                    </td>

                    <td className="py-3.5 px-5">
                      <span className="inline-flex items-center gap-1 font-bold text-xs text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 shadow-2xs">
                        <Award className="w-3.5 h-3.5 text-emerald-600" />
                        {s.attendancePercentage ? `${s.attendancePercentage.toFixed(1)}%` : '95.0%'}
                      </span>
                    </td>

                    <td className="py-3.5 px-5 text-right">
                      <button
                        onClick={() => handleViewStudentDetails(s)}
                        className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ml-auto shadow-2xs cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Profile & Stats</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Student Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Enroll New Student"
        size="lg"
      >
        <form onSubmit={handleCreateStudent} className="space-y-4">
          {formError && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2 font-semibold">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Student Full Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Leo Henderson"
                className="liquid-glass-input w-full px-3 py-2 text-xs font-semibold text-slate-800"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Student Email</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="student@schooltrack.com"
                className="liquid-glass-input w-full px-3 py-2 text-xs font-semibold text-slate-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Class & Section</label>
              <select
                required
                value={formData.classId}
                onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
                className="liquid-glass-input w-full px-3 py-2 text-xs font-bold text-slate-800"
              >
                <option value="">Select class...</option>
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    Class {c.name} - Section {c.section}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Admission Number</label>
              <input
                type="text"
                required
                value={formData.admissionNumber}
                onChange={(e) => setFormData({ ...formData, admissionNumber: e.target.value })}
                placeholder="ADM-2025-055"
                className="liquid-glass-input w-full px-3 py-2 text-xs font-semibold text-slate-800"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Roll Number</label>
              <input
                type="text"
                value={formData.rollNumber}
                onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                placeholder="105"
                className="liquid-glass-input w-full px-3 py-2 text-xs font-semibold text-slate-800"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100">
            <h4 className="text-xs font-bold uppercase text-slate-700 mb-2">Parent / Guardian Details</h4>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Parent Name</label>
                <input
                  type="text"
                  value={formData.parentName}
                  onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                  placeholder="Parent Name"
                  className="liquid-glass-input w-full px-3 py-2 text-xs font-semibold text-slate-800"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Parent Email</label>
                <input
                  type="email"
                  value={formData.parentEmail}
                  onChange={(e) => setFormData({ ...formData, parentEmail: e.target.value })}
                  placeholder="parent@schooltrack.com"
                  className="liquid-glass-input w-full px-3 py-2 text-xs font-semibold text-slate-800"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Parent Phone</label>
                <input
                  type="text"
                  value={formData.parentPhone}
                  onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                  placeholder="+1-555-0199"
                  className="liquid-glass-input w-full px-3 py-2 text-xs font-semibold text-slate-800"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={formLoading}
              className="px-5 py-2 text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 rounded-xl shadow-md transition-all cursor-pointer"
            >
              {formLoading ? 'Enrolling...' : 'Enroll Student'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Student Details & Attendance Modal */}
      <Modal
        isOpen={!!selectedStudent}
        onClose={() => setSelectedStudent(null)}
        title={`Student Profile: ${selectedStudent?.fullName || selectedStudent?.name || `${selectedStudent?.firstName || ''} ${selectedStudent?.lastName || ''}`.trim() || 'Student'}`}
        size="xl"
      >
        {selectedStudent && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-1">
                <span className="text-slate-500 font-semibold block">Class & Admission</span>
                <p className="font-black text-slate-900 text-sm">Class {selectedStudent.className || '10-A'}</p>
                <p className="text-slate-700 font-medium">Adm No: {selectedStudent.admissionNumber || 'ADM-001'}</p>
                <p className="text-slate-700 font-medium">Roll No: #{selectedStudent.rollNumber || '101'}</p>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-1">
                <span className="text-slate-500 font-semibold block">Student Contact</span>
                <p className="font-bold text-slate-900 truncate">{selectedStudent.email}</p>
                <p className="text-slate-700 font-medium">{selectedStudent.phone || '+1 (555) 0192'}</p>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-1">
                <span className="text-slate-500 font-semibold block">Parent / Guardian</span>
                <p className="font-bold text-slate-900">{selectedStudent.parentName || 'Parent Guardian'}</p>
                <p className="text-slate-700 font-medium">{selectedStudent.parentPhone || '+1 (555) 0192'}</p>
              </div>
            </div>

            {/* Attendance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AttendancePieChart
                present={studentStats?.presentCount || 0}
                absent={studentStats?.absentCount || 0}
                onDuty={studentStats?.onDutyCount || 0}
              />

              <div className="liquid-glass p-5 rounded-3xl border border-white/90 shadow-sm flex flex-col justify-between">
                <div>
                  <h4 className="font-black text-slate-900 text-sm mb-2">Institutional Compliance Status</h4>
                  <p className="text-xs text-slate-700 font-medium leading-relaxed">
                    Student has achieved an effective attendance rate of{' '}
                    <strong className="text-emerald-800 font-black">
                      {studentStats?.attendancePercentage?.toFixed(1) || 95}%
                    </strong>
                    . On Duty (OD) representations are officially credited as Present in compliance with SchoolTrack rules.
                  </p>
                </div>
                <div className="p-3 bg-slate-100/90 rounded-xl text-xs font-semibold text-slate-700 mt-4">
                  Total Sessions Evaluated: {studentStats?.totalDays || studentAttendance.length} Days
                </div>
              </div>
            </div>

            {/* Attendance Records */}
            <div>
              <h4 className="font-black text-slate-900 text-sm mb-2">Recent Attendance Entries</h4>
              <AttendanceTable records={studentAttendance.slice(0, 10)} showStudent={false} />
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedStudent(null)}
                className="px-5 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
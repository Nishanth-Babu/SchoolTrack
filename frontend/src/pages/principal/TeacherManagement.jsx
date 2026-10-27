import React, { useState, useEffect } from 'react';
import { teacherService, classService } from '../../services';
import Modal from '../../components/common/Modal';
import Badge from '../../components/common/Badge';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import {
  Users,
  Plus,
  Search,
  BookOpen,
  School,
  Mail,
  Phone,
  AlertCircle,
  Briefcase,
  UserCheck,
  CheckCircle2,
  Sparkles,
  GraduationCap
} from 'lucide-react';

export default function TeacherManagement() {
  const [teachers, setTeachers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterRole, setFilterRole] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    roleType: 'SUBJECT_TEACHER',
    specialization: 'Mathematics'
  });
  const [assignData, setAssignData] = useState({ classId: '', subjectId: '' });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    fetchData();
  }, [filterRole]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [teacherList, classList, subjectList] = await Promise.all([
        teacherService.getAllTeachers(filterRole === 'ALL' ? undefined : filterRole),
        classService.getAllClasses(),
        classService.getAllSubjects()
      ]);
      setTeachers(teacherList);
      setClasses(classList);
      setSubjects(subjectList);
    } catch (err) {
      console.error('Failed to load teachers:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTeacher = async (e) => {
    e.preventDefault();
    try {
      setFormLoading(true);
      setFormError('');

      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        specialization: formData.specialization,
        password: 'password123'
      };

      if (formData.roleType === 'CLASS_TEACHER') {
        await teacherService.createClassTeacher(payload);
      } else {
        await teacherService.createSubjectTeacher(payload);
      }

      setIsAddModalOpen(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        roleType: 'SUBJECT_TEACHER',
        specialization: 'Mathematics'
      });
      fetchData();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to create teacher.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleAssignSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTeacher || !assignData.classId || !assignData.subjectId) return;

    try {
      setFormLoading(true);
      await teacherService.assignSubjectTeacher(
        selectedTeacher.id,
        assignData.classId,
        assignData.subjectId
      );
      setIsAssignModalOpen(false);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to assign teacher.');
    } finally {
      setFormLoading(false);
    }
  };

  const filteredTeachers = teachers.filter((t) => {
    const tName = t.fullName || t.name || `${t.firstName || ''} ${t.lastName || ''}`.trim();
    const matchesSearch =
      (tName && tName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (t.email && t.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (t.teacherId && t.teacherId.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSearch;
  });

  return (
    <div className="space-y-6 pb-12 animate-fade-in font-sans">
      {/* Header Banner */}
      <div className="liquid-glass p-6 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-white/90 shadow-lg">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-800 border border-indigo-200 shadow-2xs">
              Subject Faculty Portal
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <BookOpen className="w-7 h-7 text-indigo-600" />
            Subjects & Faculty Management
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Class Teachers, Subject Faculty, Curriculum assignments, and contact details.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-500/20 transition-all flex items-center gap-2 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          Add Faculty Member
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="liquid-glass p-5 rounded-3xl border border-white/90 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search faculty by name, email, identifier..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="liquid-glass-input w-full pl-10 pr-4 py-2 text-xs font-semibold text-slate-800"
          />
        </div>

        <div className="flex items-center gap-2">
          {['ALL', 'CLASS_TEACHER', 'SUBJECT_TEACHER'].map((role) => (
            <button
              key={role}
              onClick={() => setFilterRole(role)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filterRole === role
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-xs'
                  : 'bg-white/80 text-slate-700 hover:bg-white border border-slate-200'
              }`}
            >
              {role === 'ALL' ? 'All Roles' : role.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Teachers Table */}
      <div className="liquid-glass rounded-3xl shadow-lg border border-white/90 overflow-hidden">
        {loading ? (
          <div className="p-6">
            <SkeletonLoader type="table" count={5} />
          </div>
        ) : filteredTeachers.length === 0 ? (
          <div className="p-16 text-center text-slate-400">
            <Users className="w-12 h-12 mx-auto mb-2 text-slate-300" />
            <p className="text-base font-bold text-slate-700">No teachers found</p>
            <p className="text-xs text-slate-500 mt-1">Try adjusting the filter or search keyword.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-100/80 text-[11px] font-bold text-slate-800 uppercase tracking-wider">
                  <th className="py-3.5 px-5">Faculty Name</th>
                  <th className="py-3.5 px-5">Role</th>
                  <th className="py-3.5 px-5">Contact</th>
                  <th className="py-3.5 px-5">Assigned Class / Subject</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTeachers.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-800 border border-indigo-200 flex items-center justify-center font-black text-sm shadow-2xs">
                          {(t.fullName || t.name || t.firstName || 'T').charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 text-xs">
                            {t.fullName || t.name || `${t.firstName || ''} ${t.lastName || ''}`.trim() || 'Teacher'}
                          </div>
                          <div className="text-[11px] text-indigo-700 font-semibold">
                            {t.specialization || 'General Faculty'}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-5">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                        t.role === 'CLASS_TEACHER'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : 'bg-indigo-50 text-indigo-800 border-indigo-200'
                      }`}>
                        {t.role?.replace('_', ' ') || 'SUBJECT TEACHER'}
                      </span>
                    </td>

                    <td className="py-3.5 px-5 text-xs text-slate-700 space-y-0.5">
                      <div className="flex items-center gap-1.5 font-medium">
                        <Mail className="w-3.5 h-3.5 text-slate-500" />
                        <span>{t.email}</span>
                      </div>
                      {t.phone && (
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-600">
                          <Phone className="w-3.5 h-3.5 text-slate-500" />
                          <span>{t.phone}</span>
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 px-5 text-xs text-slate-800">
                      {t.assignedClassName ? (
                        <span className="font-bold text-indigo-800 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-200">
                          Class {t.assignedClassName}
                        </span>
                      ) : (
                        <span className="text-slate-500 font-medium">Subject Faculty</span>
                      )}
                    </td>

                    <td className="py-3.5 px-5 text-right">
                      <button
                        onClick={() => {
                          setSelectedTeacher(t);
                          setIsAssignModalOpen(true);
                        }}
                        className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer"
                      >
                        Assign Subject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Teacher Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Faculty Member"
        size="md"
      >
        <form onSubmit={handleCreateTeacher} className="space-y-4">
          {formError && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2 font-semibold">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Mr. Robert Taylor"
              className="liquid-glass-input w-full px-3 py-2 text-xs font-semibold text-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="teacher@schooltrack.com"
              className="liquid-glass-input w-full px-3 py-2 text-xs font-semibold text-slate-800"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Role Type</label>
              <select
                value={formData.roleType}
                onChange={(e) => setFormData({ ...formData, roleType: e.target.value })}
                className="liquid-glass-input w-full px-3 py-2 text-xs font-bold text-slate-800"
              >
                <option value="SUBJECT_TEACHER">Subject Teacher</option>
                <option value="CLASS_TEACHER">Class Teacher</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Specialization</label>
              <input
                type="text"
                value={formData.specialization}
                onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                placeholder="e.g. Physics / Mathematics"
                className="liquid-glass-input w-full px-3 py-2 text-xs font-semibold text-slate-800"
              />
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
              className="px-5 py-2 text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-xl shadow-md transition-all cursor-pointer"
            >
              {formLoading ? 'Creating...' : 'Create Teacher'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Assign Subject Modal */}
      <Modal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        title={`Assign Subject to ${selectedTeacher?.fullName || selectedTeacher?.name || 'Teacher'}`}
        size="md"
      >
        <form onSubmit={handleAssignSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Target Class</label>
            <select
              value={assignData.classId}
              onChange={(e) => setAssignData({ ...assignData, classId: e.target.value })}
              className="liquid-glass-input w-full px-3 py-2 text-xs font-bold text-slate-800"
              required
            >
              <option value="">Select a class...</option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  Class {c.name} - Section {c.section}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Subject</label>
            <select
              value={assignData.subjectId}
              onChange={(e) => setAssignData({ ...assignData, subjectId: e.target.value })}
              className="liquid-glass-input w-full px-3 py-2 text-xs font-bold text-slate-800"
              required
            >
              <option value="">Select a subject...</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.code})
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsAssignModalOpen(false)}
              className="px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={formLoading}
              className="px-5 py-2 text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-xl shadow-md transition-all cursor-pointer"
            >
              {formLoading ? 'Assigning...' : 'Confirm Assignment'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
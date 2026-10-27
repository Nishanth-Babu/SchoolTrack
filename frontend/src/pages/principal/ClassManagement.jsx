import React, { useState, useEffect } from 'react';
import { classService, teacherService } from '../../services';
import Modal from '../../components/common/Modal';
import Badge from '../../components/common/Badge';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import {
  School,
  Users,
  BookOpen,
  UserCheck,
  Search,
  Plus,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  Edit2,
  Trash2,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  GraduationCap
} from 'lucide-react';

export default function ClassManagement() {
  const [classes, setClasses] = useState([]);
  const [classTeachers, setClassTeachers] = useState([]);
  const [coordinators, setCoordinators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals state
  const [selectedClass, setSelectedClass] = useState(null);
  const [classSubjects, setClassSubjects] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [notification, setNotification] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    grade: '10',
    section: 'A',
    name: 'Grade 10-A',
    classTeacherId: '',
    coordinatorId: ''
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [classList, ctList, coordList] = await Promise.all([
        classService.getAllClasses(),
        teacherService.getAllTeachers('CLASS_TEACHER').catch(() => []),
        teacherService.getAllTeachers('COORDINATOR').catch(() => [])
      ]);
      setClasses(classList || []);
      setClassTeachers(ctList || []);
      setCoordinators(coordList || []);
    } catch (err) {
      console.error('Failed to load class management data:', err);
      showNotification('error', 'Failed to load classes and faculty rosters.');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleOpenCreate = () => {
    setFormData({
      grade: '',
      section: '',
      name: '',
      classTeacherId: '',
      coordinatorId: ''
    });
    setShowCreateModal(true);
  };

  const handleOpenEdit = (cls) => {
    setEditingClass(cls);
    setFormData({
      grade: cls.grade || '',
      section: cls.section || '',
      name: cls.name || '',
      classTeacherId: cls.classTeacherId ? String(cls.classTeacherId) : '',
      coordinatorId: cls.coordinatorId ? String(cls.coordinatorId) : ''
    });
    setShowEditModal(true);
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!formData.grade || !formData.section) {
      showNotification('error', 'Grade and Section are required.');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        grade: formData.grade.trim(),
        section: formData.section.trim().toUpperCase(),
        name: formData.name.trim() || `Grade ${formData.grade.trim()}-${formData.section.trim().toUpperCase()}`,
        classTeacherId: formData.classTeacherId ? Number(formData.classTeacherId) : null,
        coordinatorId: formData.coordinatorId ? Number(formData.coordinatorId) : null
      };

      const created = await classService.createClass(payload);
      setClasses((prev) => [...prev, created]);
      setShowCreateModal(false);
      showNotification('success', `Class ${created.name} successfully created!`);
    } catch (err) {
      showNotification('error', err.response?.data?.message || 'Failed to create class & section.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingClass) return;

    try {
      setSubmitting(true);
      const payload = {
        grade: formData.grade.trim(),
        section: formData.section.trim().toUpperCase(),
        name: formData.name.trim() || `Grade ${formData.grade.trim()}-${formData.section.trim().toUpperCase()}`,
        classTeacherId: formData.classTeacherId ? Number(formData.classTeacherId) : 0,
        coordinatorId: formData.coordinatorId ? Number(formData.coordinatorId) : 0
      };

      const updated = await classService.updateClass(editingClass.id, payload);
      setClasses((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
      setShowEditModal(false);
      setEditingClass(null);
      showNotification('success', `Class ${updated.name} successfully updated!`);
    } catch (err) {
      showNotification('error', err.response?.data?.message || 'Failed to update class.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteClass = async (cls) => {
    if (!window.confirm(`Are you sure you want to delete "${cls.name}" (Section ${cls.section})? This action cannot be undone.`)) {
      return;
    }

    try {
      await classService.deleteClass(cls.id);
      setClasses((prev) => prev.filter((c) => c.id !== cls.id));
      showNotification('success', `Class ${cls.name} deleted.`);
    } catch (err) {
      showNotification('error', err.response?.data?.message || 'Failed to delete class.');
    }
  };

  const handleViewDetails = async (cls) => {
    setSelectedClass(cls);
    try {
      const subjects = await classService.getSubjectsByClassId(cls.id);
      setClassSubjects(subjects);
    } catch (err) {
      console.error('Failed to load subjects:', err);
    }
  };

  const filtered = classes.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.section.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.classTeacherName && c.classTeacherName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (c.coordinatorName && c.coordinatorName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className="liquid-glass p-6 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
              Institutional Structure
            </span>
            <span className="px-3 py-0.5 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Principal Control
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2.5">
            <School className="w-7 h-7 text-indigo-600" />
            Class & Section Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Create academic classes, configure sections, assign Class Teachers and Wing Coordinators.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-bold text-xs shadow-md shadow-indigo-500/20 hover:shadow-lg transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Create Class & Section</span>
        </button>
      </div>

      {/* Notifications */}
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

      {/* Search Toolbar */}
      <div className="liquid-glass p-4 rounded-2xl flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by class name, section, teacher or coordinator..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="liquid-glass-input w-full pl-9 pr-4 py-2 text-xs font-medium text-slate-800"
          />
        </div>
        <span className="text-xs font-bold text-slate-500">
          Showing {filtered.length} of {classes.length} Classes
        </span>
      </div>

      {/* Classes Grid */}
      {loading ? (
        <SkeletonLoader type="card" count={6} />
      ) : filtered.length === 0 ? (
        <div className="liquid-glass p-12 text-center rounded-3xl border border-dashed border-slate-300 text-slate-400">
          <School className="w-12 h-12 mx-auto mb-2 text-slate-300" />
          <p className="text-base font-bold text-slate-700">No classes found</p>
          <p className="text-xs text-slate-400 mt-1">Get started by creating the first class and section above.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((cls) => (
            <div
              key={cls.id}
              className="liquid-glass rounded-3xl p-5 hover:shadow-xl transition-all flex flex-col justify-between border border-white/80"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="px-3 py-1 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-xl text-xs font-black">
                    Grade {cls.grade || cls.name}
                  </span>
                  <span className="px-3 py-1 bg-purple-50 text-purple-700 border border-purple-100 rounded-xl text-xs font-black">
                    Section {cls.section}
                  </span>
                </div>

                <h3 className="text-lg font-black text-slate-800 mb-1">
                  {cls.name}
                </h3>
                <p className="text-[11px] text-slate-400 font-medium mb-4">Academic Session: 2025 - 2026</p>

                <div className="space-y-2.5 pt-3 border-t border-slate-100 text-xs">
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="flex items-center gap-1.5 font-bold text-slate-600">
                      <UserCheck className="w-4 h-4 text-emerald-600" /> Class Teacher:
                    </span>
                    <span className="font-bold text-slate-800 truncate max-w-[140px]" title={cls.classTeacherName}>
                      {cls.classTeacherName || <span className="text-slate-400 font-normal">Unassigned</span>}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-slate-600">
                    <span className="flex items-center gap-1.5 font-bold text-slate-600">
                      <ShieldCheck className="w-4 h-4 text-purple-600" /> Coordinator:
                    </span>
                    <span className="font-bold text-slate-800 truncate max-w-[140px]" title={cls.coordinatorName}>
                      {cls.coordinatorName || <span className="text-slate-400 font-normal">Unassigned</span>}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-slate-600">
                    <span className="flex items-center gap-1.5 font-bold text-slate-600">
                      <Users className="w-4 h-4 text-blue-600" /> Total Students:
                    </span>
                    <span className="font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-lg border border-indigo-100">
                      {cls.studentCount || 0}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenEdit(cls)}
                    className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-indigo-600 rounded-xl transition-colors border border-slate-200"
                    title="Edit Class / Reassign"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteClass(cls)}
                    className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl transition-colors border border-rose-200"
                    title="Delete Class"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  onClick={() => handleViewDetails(cls)}
                  className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 border border-indigo-100"
                >
                  <span>Curriculum</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Class Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Class & Section"
        size="md"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Grade / Standard *</label>
              <input
                type="text"
                placeholder="e.g. 10, 9, 8, Nursery"
                value={formData.grade}
                onChange={(e) => {
                  const gr = e.target.value;
                  setFormData({
                    ...formData,
                    grade: gr,
                    name: gr && formData.section ? `Grade ${gr}-${formData.section}` : formData.name
                  });
                }}
                required
                className="liquid-glass-input w-full px-3 py-2 text-xs font-bold text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Section *</label>
              <input
                type="text"
                placeholder="e.g. A, B, C, Rose"
                value={formData.section}
                onChange={(e) => {
                  const sec = e.target.value.toUpperCase();
                  setFormData({
                    ...formData,
                    section: sec,
                    name: formData.grade && sec ? `Grade ${formData.grade}-${sec}` : formData.name
                  });
                }}
                required
                className="liquid-glass-input w-full px-3 py-2 text-xs font-bold text-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Class Display Name</label>
            <input
              type="text"
              placeholder="e.g. Grade 10-A"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="liquid-glass-input w-full px-3 py-2 text-xs font-semibold text-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Assign Class Teacher (Optional)</label>
            <select
              value={formData.classTeacherId}
              onChange={(e) => setFormData({ ...formData, classTeacherId: e.target.value })}
              className="liquid-glass-input w-full px-3 py-2 text-xs font-semibold text-slate-800"
            >
              <option value="">-- Unassigned (Assign Later) --</option>
              {classTeachers.map((ct) => (
                <option key={ct.id} value={ct.id}>
                  {ct.fullName || ct.name} ({ct.teacherId || ct.employeeId || 'Teacher'})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Assign Wing Coordinator (Optional)</label>
            <select
              value={formData.coordinatorId}
              onChange={(e) => setFormData({ ...formData, coordinatorId: e.target.value })}
              className="liquid-glass-input w-full px-3 py-2 text-xs font-semibold text-slate-800"
            >
              <option value="">-- Unassigned (Assign Later) --</option>
              {coordinators.map((coord) => (
                <option key={coord.id} value={coord.id}>
                  {coord.fullName || coord.name} ({coord.assignedWing || 'Coordinator'})
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowCreateModal(false)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-500/20 transition-all cursor-pointer"
            >
              {submitting ? 'Creating...' : 'Create Class & Section'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Class Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title={`Edit ${editingClass?.name || 'Class'}`}
        size="md"
      >
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Grade / Standard *</label>
              <input
                type="text"
                value={formData.grade}
                onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                required
                className="liquid-glass-input w-full px-3 py-2 text-xs font-bold text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Section *</label>
              <input
                type="text"
                value={formData.section}
                onChange={(e) => setFormData({ ...formData, section: e.target.value.toUpperCase() })}
                required
                className="liquid-glass-input w-full px-3 py-2 text-xs font-bold text-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Class Display Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="liquid-glass-input w-full px-3 py-2 text-xs font-semibold text-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Class Teacher Assignment</label>
            <select
              value={formData.classTeacherId}
              onChange={(e) => setFormData({ ...formData, classTeacherId: e.target.value })}
              className="liquid-glass-input w-full px-3 py-2 text-xs font-semibold text-slate-800"
            >
              <option value="0">-- None (Remove Assignment) --</option>
              {classTeachers.map((ct) => (
                <option key={ct.id} value={ct.id}>
                  {ct.fullName || ct.name} ({ct.teacherId || ct.employeeId || 'Teacher'})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Wing Coordinator Assignment</label>
            <select
              value={formData.coordinatorId}
              onChange={(e) => setFormData({ ...formData, coordinatorId: e.target.value })}
              className="liquid-glass-input w-full px-3 py-2 text-xs font-semibold text-slate-800"
            >
              <option value="0">-- None (Remove Assignment) --</option>
              {coordinators.map((coord) => (
                <option key={coord.id} value={coord.id}>
                  {coord.fullName || coord.name} ({coord.assignedWing || 'Coordinator'})
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowEditModal(false)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-500/20 transition-all cursor-pointer"
            >
              {submitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Class Details / Curriculum Modal */}
      <Modal
        isOpen={!!selectedClass}
        onClose={() => setSelectedClass(null)}
        title={`${selectedClass?.name || ''} Curriculum & Details`}
        size="lg"
      >
        {selectedClass && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 grid grid-cols-3 gap-3 text-xs">
              <div>
                <span className="text-slate-400 block mb-0.5">Class Teacher</span>
                <span className="font-bold text-slate-800 text-sm">
                  {selectedClass.classTeacherName || 'Unassigned'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Wing Coordinator</span>
                <span className="font-bold text-slate-800 text-sm">
                  {selectedClass.coordinatorName || 'Unassigned'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Enrolled Students</span>
                <span className="font-bold text-indigo-700 text-sm">
                  {selectedClass.studentCount || 0} Students
                </span>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-indigo-600" />
                Curriculum Subjects & Assigned Subject Teachers:
              </h4>

              {classSubjects.length === 0 ? (
                <div className="p-6 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-400 text-xs">
                  No subjects assigned to this class yet. Assign subject teachers from the Subjects portal.
                </div>
              ) : (
                <div className="space-y-2">
                  {classSubjects.map((sub) => (
                    <div
                      key={sub.id}
                      className="p-3 bg-white/80 border border-slate-100 rounded-xl flex items-center justify-between text-xs shadow-sm"
                    >
                      <div>
                        <span className="font-bold text-slate-800">{sub.name}</span>
                        <span className="text-indigo-600 font-mono font-bold ml-2">({sub.code})</span>
                      </div>
                      <span className="text-slate-600 font-medium flex items-center gap-1">
                        <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                        Teacher: {sub.assignedTeacherName || 'Unassigned'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedClass(null)}
                className="px-4 py-2 bg-slate-800 text-white rounded-xl text-xs font-bold hover:bg-slate-900 transition-all"
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


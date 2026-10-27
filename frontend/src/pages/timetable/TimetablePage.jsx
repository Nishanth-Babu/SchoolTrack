import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { timetableService, classService, teacherService } from '../../services';
import Modal from '../../components/common/Modal';
import Badge from '../../components/common/Badge';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import {
  Calendar,
  Clock,
  BookOpen,
  User,
  MapPin,
  Plus,
  Trash2,
  Printer,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Layers,
  GraduationCap
} from 'lucide-react';

export default function TimetablePage() {
  const { user } = useSelector((state) => state.auth);
  const isPrivileged = user?.roles?.some((r) => r === 'PRINCIPAL' || r === 'COORDINATOR');

  const [classes, setClasses] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState(1);
  const [weeklySchedule, setWeeklySchedule] = useState({});
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeDay, setActiveDay] = useState('ALL'); // 'ALL' or specific day

  // Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [modalError, setModalError] = useState('');
  const [successToast, setSuccessToast] = useState('');

  const [formData, setFormData] = useState({
    dayOfWeek: 'MONDAY',
    periodNumber: 1,
    startTime: '08:30 AM',
    endTime: '09:15 AM',
    subjectId: '',
    teacherId: '',
    roomNumber: 'Room 10-A'
  });

  const daysOfWeek = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'];

  const periodTimeMap = {
    1: { start: '08:30 AM', end: '09:15 AM' },
    2: { start: '09:15 AM', end: '10:00 AM' },
    3: { start: '10:15 AM', end: '11:00 AM' },
    4: { start: '11:00 AM', end: '11:45 AM' },
    5: { start: '12:30 PM', end: '01:15 PM' },
    6: { start: '01:15 PM', end: '02:00 PM' },
    7: { start: '02:15 PM', end: '03:00 PM' },
    8: { start: '03:00 PM', end: '03:45 PM' }
  };

  useEffect(() => {
    loadClassesAndMetadata();
  }, []);

  useEffect(() => {
    if (selectedClassId) {
      loadTimetable(selectedClassId);
    }
  }, [selectedClassId]);

  const loadClassesAndMetadata = async () => {
    try {
      const [classList, subList, teachList] = await Promise.all([
        classService.getAllClasses().catch(() => []),
        classService.getAllSubjects().catch(() => []),
        teacherService.getAllSubjectTeachers().catch(() => [])
      ]);
      setClasses(classList || []);
      setSubjects(subList || []);
      setTeachers(teachList || []);

      if (classList?.length > 0) {
        setSelectedClassId(classList[0].id);
      }
      if (subList?.length > 0) {
        setFormData((prev) => ({ ...prev, subjectId: subList[0].id }));
      }
    } catch (e) {
      console.error('Failed to load classes', e);
    }
  };

  const loadTimetable = async (classId) => {
    try {
      setLoading(true);
      const schedule = await timetableService.getWeeklyScheduleForClass(classId);
      setWeeklySchedule(schedule || {});
    } catch (err) {
      console.error('Failed to load timetable', err);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(''), 4000);
  };

  const handlePeriodChange = (pNum) => {
    const times = periodTimeMap[pNum] || { start: '08:30 AM', end: '09:15 AM' };
    setFormData((prev) => ({
      ...prev,
      periodNumber: Number(pNum),
      startTime: times.start,
      endTime: times.end
    }));
  };

  const handleCreateSlot = async (e) => {
    e.preventDefault();
    try {
      setActionLoading(true);
      setModalError('');

      await timetableService.createSlot({
        dayOfWeek: formData.dayOfWeek,
        periodNumber: Number(formData.periodNumber),
        startTime: formData.startTime,
        endTime: formData.endTime,
        classId: Number(selectedClassId),
        subjectId: Number(formData.subjectId),
        teacherId: formData.teacherId ? Number(formData.teacherId) : null,
        roomNumber: formData.roomNumber
      });

      showToast(`Period ${formData.periodNumber} slot added for ${formData.dayOfWeek}!`);
      setIsAddModalOpen(false);
      loadTimetable(selectedClassId);
    } catch (err) {
      setModalError(err.response?.data?.message || 'Failed to create timetable slot.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteSlot = async (slotId) => {
    if (!window.confirm('Are you sure you want to remove this timetable slot?')) return;
    try {
      await timetableService.deleteSlot(slotId);
      showToast('Timetable slot removed successfully.');
      loadTimetable(selectedClassId);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete slot.');
    }
  };

  const getSubjectColor = (code) => {
    if (!code) return 'from-indigo-50 to-indigo-100/70 border-indigo-200 text-indigo-900';
    if (code.includes('MATH')) return 'from-blue-50 to-blue-100/70 border-blue-200 text-blue-900';
    if (code.includes('SCI') || code.includes('PHY')) return 'from-emerald-50 to-emerald-100/70 border-emerald-200 text-emerald-900';
    if (code.includes('CS')) return 'from-purple-50 to-purple-100/70 border-purple-200 text-purple-900';
    if (code.includes('ENG')) return 'from-amber-50 to-amber-100/70 border-amber-200 text-amber-900';
    if (code.includes('PE')) return 'from-rose-50 to-rose-100/70 border-rose-200 text-rose-900';
    return 'from-slate-50 to-slate-100/70 border-slate-200 text-slate-900';
  };

  const selectedClass = classes.find((c) => c.id === Number(selectedClassId));

  return (
    <div className="space-y-6 pb-12 animate-fade-in print:p-0">
      {/* Toast */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 p-4 bg-emerald-600 text-white rounded-2xl shadow-xl flex items-center gap-3 animate-bounce">
          <CheckCircle2 className="w-5 h-5" />
          <span className="text-xs font-bold">{successToast}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="liquid-glass p-6 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
              Institutional Academic Schedule
            </span>
            <span className="px-3 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Conflict-Free Engine
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <Calendar className="w-7 h-7 text-indigo-600" />
            Class Timetable & Period Allocation
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Comprehensive weekly period schedule with teacher allocations, room coordinates, and conflict prevention.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all border border-slate-200 flex items-center gap-2 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print Timetable</span>
          </button>

          {isPrivileged && (
            <button
              onClick={() => {
                setModalError('');
                setIsAddModalOpen(true);
              }}
              className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-500/20 hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Period Slot</span>
            </button>
          )}
        </div>
      </div>

      {/* Class Selector & Day Filter Pills */}
      <div className="liquid-glass p-4 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div className="flex items-center gap-3">
          <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <GraduationCap className="w-4 h-4 text-indigo-600" />
            Selected Class:
          </label>
          <select
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            className="liquid-glass-input px-3 py-1.5 text-xs font-bold text-slate-800"
          >
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                Class {c.name || `${c.grade}-${c.section}`}
              </option>
            ))}
          </select>
        </div>

        {/* Day Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto p-1 bg-slate-100/90 rounded-2xl border border-slate-200">
          <button
            onClick={() => setActiveDay('ALL')}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
              activeDay === 'ALL'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-sm font-black'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            Full Week (Mon-Fri)
          </button>
          {daysOfWeek.map((day) => (
            <button
              key={day}
              onClick={() => setActiveDay(day)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                activeDay === day
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-sm font-black'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              {day.charAt(0) + day.slice(1, 3).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Timetable Grid View */}
      {loading ? (
        <div className="p-8">
          <SkeletonLoader type="table" count={5} />
        </div>
      ) : (
        <div className="space-y-6">
          {(activeDay === 'ALL' ? daysOfWeek : [activeDay]).map((day) => {
            const slots = weeklySchedule[day] || [];
            return (
              <div key={day} className="liquid-glass rounded-3xl overflow-hidden shadow-lg border border-white/90">
                <div className="p-4 border-b border-slate-200/80 bg-slate-50/70 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-indigo-600 ring-4 ring-indigo-100"></span>
                    <h3 className="font-black text-slate-800 text-sm tracking-wide">
                      {day} Schedule
                    </h3>
                  </div>
                  <span className="text-xs font-bold text-slate-500 bg-white/80 px-3 py-1 rounded-full border border-slate-200">
                    {slots.length} Periods Scheduled
                  </span>
                </div>

                {slots.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-400 font-semibold">
                    No periods scheduled for {day}.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 p-4">
                    {slots.map((slot) => {
                      const colorClass = getSubjectColor(slot.subjectCode);
                      return (
                        <div
                          key={slot.id}
                          className={`p-4 rounded-2xl border bg-gradient-to-br ${colorClass} shadow-xs hover:shadow-md transition-all flex flex-col justify-between relative group`}
                        >
                          {isPrivileged && (
                            <button
                              onClick={() => handleDeleteSlot(slot.id)}
                              title="Delete Period Slot"
                              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1 bg-white/80 hover:bg-rose-50 text-rose-600 rounded-lg transition-all"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}

                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="px-2 py-0.5 rounded-lg bg-white/80 font-mono font-bold text-[10px] text-slate-700 shadow-2xs">
                                Period {slot.periodNumber}
                              </span>
                              <span className="text-[10px] font-mono text-slate-500 flex items-center gap-1">
                                <Clock className="w-3 h-3" /> {slot.startTime}
                              </span>
                            </div>

                            <h4 className="font-black text-xs leading-tight mb-1">
                              {slot.subjectName}
                            </h4>
                            <span className="text-[10px] font-mono text-slate-500 block mb-2">
                              {slot.subjectCode}
                            </span>
                          </div>

                          <div className="border-t border-slate-200/60 pt-2 space-y-1 text-[10px]">
                            <div className="flex items-center gap-1 text-slate-700 font-semibold truncate">
                              <User className="w-3 h-3 text-slate-400 shrink-0" />
                              <span className="truncate">{slot.teacherName}</span>
                            </div>
                            <div className="flex items-center gap-1 text-slate-500 font-mono">
                              <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                              <span>{slot.roomNumber || 'Room 10-A'}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL: ADD TIMETABLE SLOT */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Schedule Timetable Period Slot"
      >
        <form onSubmit={handleCreateSlot} className="space-y-4">
          {modalError && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{modalError}</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Day of Week *</label>
              <select
                value={formData.dayOfWeek}
                onChange={(e) => setFormData({ ...formData, dayOfWeek: e.target.value })}
                className="liquid-glass-input w-full px-3 py-2 text-xs font-semibold"
              >
                {daysOfWeek.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Period Number *</label>
              <select
                value={formData.periodNumber}
                onChange={(e) => handlePeriodChange(e.target.value)}
                className="liquid-glass-input w-full px-3 py-2 text-xs font-semibold font-mono"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((p) => (
                  <option key={p} value={p}>Period {p} ({periodTimeMap[p]?.start} - {periodTimeMap[p]?.end})</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Start Time *</label>
              <input
                type="text"
                required
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                placeholder="08:30 AM"
                className="liquid-glass-input w-full px-3 py-2 text-xs font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">End Time *</label>
              <input
                type="text"
                required
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                placeholder="09:15 AM"
                className="liquid-glass-input w-full px-3 py-2 text-xs font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Subject *</label>
            <select
              value={formData.subjectId}
              onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
              className="liquid-glass-input w-full px-3 py-2 text-xs font-semibold"
            >
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Assigned Teacher</label>
            <select
              value={formData.teacherId}
              onChange={(e) => setFormData({ ...formData, teacherId: e.target.value })}
              className="liquid-glass-input w-full px-3 py-2 text-xs font-semibold"
            >
              <option value="">No Teacher Assigned</option>
              {teachers.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.fullName || t.user?.firstName + ' ' + t.user?.lastName} ({t.employeeId})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Room Coordinates</label>
            <input
              type="text"
              value={formData.roomNumber}
              onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
              placeholder="e.g. Room 10-A (Lab 2)"
              className="liquid-glass-input w-full px-3 py-2 text-xs font-semibold"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={actionLoading}
              className="px-5 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{actionLoading ? 'Scheduling...' : 'Save Period'}</span>
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

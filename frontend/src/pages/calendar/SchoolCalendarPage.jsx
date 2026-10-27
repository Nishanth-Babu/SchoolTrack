import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { calendarEventService } from '../../services';
import Modal from '../../components/common/Modal';
import Badge from '../../components/common/Badge';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  Clock,
  MapPin,
  Users,
  Sparkles,
  Award,
  AlertCircle,
  CheckCircle2,
  CalendarDays,
  Coffee,
  HeartHandshake,
  BookOpen
} from 'lucide-react';

export default function SchoolCalendarPage() {
  const { user } = useSelector((state) => state.auth);
  const isPrivileged = user?.roles?.some((r) => r === 'PRINCIPAL' || r === 'COORDINATOR');

  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState('ALL');
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Modal
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [modalError, setModalError] = useState('');
  const [successToast, setSuccessToast] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    eventType: 'EVENT',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    targetAudience: 'ALL',
    location: 'Campus Auditorium'
  });

  useEffect(() => {
    loadEvents();
  }, [selectedFilter]);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const data = await calendarEventService.getAllEvents(selectedFilter);
      setEvents(data || []);
    } catch (err) {
      console.error('Failed to load events', err);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(''), 4000);
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    try {
      setActionLoading(true);
      setModalError('');

      await calendarEventService.createEvent(formData);
      showToast(`Event "${formData.title}" published to school calendar!`);
      setIsCreateModalOpen(false);
      setFormData({
        title: '',
        description: '',
        eventType: 'EVENT',
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0],
        targetAudience: 'ALL',
        location: 'Campus Auditorium'
      });
      loadEvents();
    } catch (err) {
      setModalError(err.response?.data?.message || 'Failed to create calendar event.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteEvent = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    try {
      await calendarEventService.deleteEvent(id);
      showToast('Event removed from school calendar.');
      loadEvents();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete event.');
    }
  };

  // Calendar Math
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const firstDayIndex = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const getEventBadgeType = (type) => {
    switch (type) {
      case 'EXAM': return { color: 'bg-rose-500 text-white', label: 'Exam', icon: Award };
      case 'HOLIDAY': return { color: 'bg-amber-500 text-white', label: 'Holiday', icon: Coffee };
      case 'PTM': return { color: 'bg-purple-500 text-white', label: 'PTM', icon: HeartHandshake };
      case 'FUNCTION': return { color: 'bg-indigo-500 text-white', label: 'Function', icon: Sparkles };
      default: return { color: 'bg-emerald-500 text-white', label: 'Event', icon: CalendarDays };
    }
  };

  const daysArray = Array.from({ length: totalDays }, (_, i) => i + 1);
  const blankDays = Array.from({ length: firstDayIndex }, (_, i) => i);

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Toast */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 p-4 bg-emerald-600 text-white rounded-2xl shadow-xl flex items-center gap-3 animate-bounce">
          <CheckCircle2 className="w-5 h-5" />
          <span className="text-xs font-bold">{successToast}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="liquid-glass p-6 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
              Institutional Academic Calendar
            </span>
            <span className="px-3 py-0.5 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Live Campus Events
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <CalendarIcon className="w-7 h-7 text-indigo-600" />
            School Calendar & Important Dates
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Official schedule of examinations, academic terms, institutional holidays, parent-teacher conferences, and celebrations.
          </p>
        </div>

        {isPrivileged && (
          <button
            onClick={() => {
              setModalError('');
              setIsCreateModalOpen(true);
            }}
            className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-500/20 hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Create Campus Event</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="liquid-glass p-3 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto p-1 bg-slate-100/90 rounded-2xl border border-slate-200">
          {[
            { id: 'ALL', label: 'All Schedules' },
            { id: 'EXAM', label: 'Exams' },
            { id: 'HOLIDAY', label: 'Holidays' },
            { id: 'PTM', label: 'PTMs' },
            { id: 'EVENT', label: 'STEM & Events' },
            { id: 'FUNCTION', label: 'Functions' }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedFilter(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedFilter === cat.id
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-sm font-black'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Month Navigation Controls */}
        <div className="flex items-center gap-3 bg-white/80 px-4 py-1.5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <button
            onClick={prevMonth}
            className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-600 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-black text-slate-800 min-w-[120px] text-center">
            {monthNames[month]} {year}
          </span>
          <button
            onClick={nextMonth}
            className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-600 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Grid: Left Calendar Matrix, Right Events Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Matrix (2 Cols) */}
        <div className="lg:col-span-2 liquid-glass rounded-3xl p-6 shadow-lg border border-white/90">
          <div className="grid grid-cols-7 gap-2 text-center text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {blankDays.map((_, i) => (
              <div key={`blank-${i}`} className="h-24 rounded-2xl bg-slate-50/40 border border-transparent"></div>
            ))}

            {daysArray.map((dayNum) => {
              const dayDateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
              const dayEvents = events.filter((e) => {
                const s = e.startDate;
                const end = e.endDate || e.startDate;
                return dayDateStr >= s && dayDateStr <= end;
              });

              const isToday =
                new Date().getDate() === dayNum &&
                new Date().getMonth() === month &&
                new Date().getFullYear() === year;

              return (
                <div
                  key={dayNum}
                  className={`min-h-24 p-2 rounded-2xl border transition-all flex flex-col justify-between ${
                    isToday
                      ? 'bg-indigo-50/80 border-indigo-300 ring-2 ring-indigo-200 shadow-sm'
                      : 'bg-white/70 border-slate-200/80 hover:bg-white hover:shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-bold ${
                        isToday
                          ? 'w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px]'
                          : 'text-slate-700'
                      }`}
                    >
                      {dayNum}
                    </span>
                    {dayEvents.length > 0 && (
                      <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
                    )}
                  </div>

                  <div className="space-y-1 mt-1 overflow-y-auto max-h-16">
                    {dayEvents.slice(0, 2).map((ev) => {
                      const badge = getEventBadgeType(ev.eventType);
                      return (
                        <div
                          key={ev.id}
                          onClick={() => setSelectedEvent(ev)}
                          title={`${ev.title} (${ev.eventType})`}
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md truncate cursor-pointer transition-all ${badge.color}`}
                        >
                          {ev.title}
                        </div>
                      );
                    })}
                    {dayEvents.length > 2 && (
                      <span className="text-[9px] font-bold text-slate-400 block text-right">
                        +{dayEvents.length - 2} more
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Upcoming Events Feed (1 Col) */}
        <div className="space-y-4">
          <div className="liquid-glass rounded-3xl p-5 shadow-lg border border-white/90">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                  <CalendarDays className="w-4 h-4" />
                </div>
                <h3 className="font-black text-slate-800 text-sm">
                  Upcoming Schedules ({events.length})
                </h3>
              </div>
            </div>

            {loading ? (
              <SkeletonLoader type="card" count={3} />
            ) : events.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400 font-semibold">
                No scheduled events found for this filter.
              </div>
            ) : (
              <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
                {events.map((ev) => {
                  const badge = getEventBadgeType(ev.eventType);
                  const Icon = badge.icon;
                  return (
                    <div
                      key={ev.id}
                      className="p-4 rounded-2xl bg-white/80 border border-slate-200/80 shadow-2xs hover:shadow-md transition-all relative group"
                    >
                      {isPrivileged && (
                        <button
                          onClick={() => handleDeleteEvent(ev.id)}
                          title="Delete Event"
                          className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 p-1 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}

                      <div className="flex items-center gap-2 mb-2">
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-md flex items-center gap-1 ${badge.color}`}>
                          <Icon className="w-3 h-3" /> {badge.label}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">
                          {ev.startDate === ev.endDate ? ev.startDate : `${ev.startDate} to ${ev.endDate}`}
                        </span>
                      </div>

                      <h4 className="font-black text-slate-900 text-xs mb-1">
                        {ev.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 line-clamp-2 mb-2">
                        {ev.description}
                      </p>

                      <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium border-t border-slate-100 pt-2">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" /> {ev.location || 'Campus'}
                        </span>
                        <span className="flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded-md font-semibold text-slate-600">
                          <Users className="w-3 h-3 text-slate-400" /> {ev.targetAudience}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MODAL 1: CREATE CALENDAR EVENT */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Publish Institutional Event / Holiday"
      >
        <form onSubmit={handleCreateEvent} className="space-y-4">
          {modalError && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{modalError}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Event Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Annual STEM Expo / Mock Board Exam"
              className="liquid-glass-input w-full px-3 py-2 text-xs font-bold"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Category *</label>
              <select
                value={formData.eventType}
                onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                className="liquid-glass-input w-full px-3 py-2 text-xs font-semibold"
              >
                <option value="EVENT">Event / Competition</option>
                <option value="EXAM">Examination</option>
                <option value="HOLIDAY">Holiday / Break</option>
                <option value="PTM">PTM Conference</option>
                <option value="FUNCTION">School Function</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Target Audience</label>
              <select
                value={formData.targetAudience}
                onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                className="liquid-glass-input w-full px-3 py-2 text-xs font-semibold"
              >
                <option value="ALL">Entire Campus (All)</option>
                <option value="STUDENTS">Students Only</option>
                <option value="TEACHERS">Faculty / Teachers Only</option>
                <option value="PARENTS">Parents Only</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Start Date *</label>
              <input
                type="date"
                required
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="liquid-glass-input w-full px-3 py-2 text-xs font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">End Date *</label>
              <input
                type="date"
                required
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="liquid-glass-input w-full px-3 py-2 text-xs font-semibold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Venue / Location</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="e.g. Auditorium / Main Grounds"
              className="liquid-glass-input w-full px-3 py-2 text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Description & Guidelines</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Event circular, instructions, and timing details..."
              className="liquid-glass-input w-full px-3 py-2 text-xs"
            ></textarea>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
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
              <span>{actionLoading ? 'Publishing...' : 'Publish to Calendar'}</span>
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

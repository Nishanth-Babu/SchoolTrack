import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, ArrowUpRight } from 'lucide-react';
import { calendarEventService } from '../../services';

export default function MiniCalendar() {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());
  const [events, setEvents] = useState([]);

  useEffect(() => {
    loadUpcomingEvents();
  }, []);

  const loadUpcomingEvents = async () => {
    try {
      const data = await calendarEventService.getUpcomingEvents();
      setEvents(data || []);
    } catch (e) {
      // safe fallback
    }
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayIndex = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  return (
    <div className="liquid-glass rounded-3xl p-5 space-y-4 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/calendar')}
          className="flex items-center gap-2 group cursor-pointer text-left"
        >
          <div className="p-1.5 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200">
            <CalendarIcon className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1 group-hover:text-indigo-600 transition-colors">
              School Calendar <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </h3>
          </div>
        </button>

        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-white/70 px-2.5 py-1 rounded-xl border border-white/80 shadow-2xs">
          <button
            onClick={handlePrevMonth}
            className="p-1 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <span>{monthNames[month]} {year}</span>
          <button
            onClick={handleNextMonth}
            className="p-1 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Weekdays */}
      <div className="grid grid-cols-7 text-center text-[11px] font-bold text-slate-400 uppercase tracking-wider">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
          <div key={d} className="py-1">{d}</div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 text-center text-xs">
        {Array.from({ length: firstDayIndex }).map((_, idx) => (
          <div key={`empty-${idx}`} className="h-8 text-slate-300 flex items-center justify-center text-[11px]">
            {new Date(year, month, 0).getDate() - firstDayIndex + idx + 1}
          </div>
        ))}

        {Array.from({ length: totalDays }).map((_, idx) => {
          const day = idx + 1;
          const isSelected = selectedDay === day;
          const isToday = new Date().getDate() === day && new Date().getMonth() === month && new Date().getFullYear() === year;

          const dayDateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const dayEvents = events.filter((e) => dayDateStr >= e.startDate && dayDateStr <= (e.endDate || e.startDate));

          const hasExam = dayEvents.some((e) => e.eventType === 'EXAM');
          const hasHoliday = dayEvents.some((e) => e.eventType === 'HOLIDAY');
          const hasPtm = dayEvents.some((e) => e.eventType === 'PTM');
          const hasEvent = dayEvents.some((e) => e.eventType === 'EVENT' || e.eventType === 'FUNCTION');

          return (
            <button
              key={`day-${day}`}
              onClick={() => setSelectedDay(day)}
              className={`h-8 rounded-xl font-bold transition-all relative flex flex-col items-center justify-center cursor-pointer ${
                isSelected
                  ? 'bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/30'
                  : isToday
                  ? 'bg-indigo-50 text-indigo-700 font-extrabold border border-indigo-200'
                  : 'text-slate-700 hover:bg-white/80'
              }`}
            >
              <span>{day}</span>
              {/* Event indicator dots */}
              <div className="flex gap-0.5 mt-0.5">
                {hasExam && <span className="w-1 h-1 rounded-full bg-rose-500" />}
                {hasHoliday && <span className="w-1 h-1 rounded-full bg-amber-500" />}
                {hasPtm && <span className="w-1 h-1 rounded-full bg-purple-500" />}
                {hasEvent && <span className="w-1 h-1 rounded-full bg-emerald-500" />}
              </div>
            </button>
          );
        })}
      </div>

      {/* Legend Dots */}
      <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between text-[10px] font-semibold text-slate-500">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-rose-500" /> Exams
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-500" /> Holidays
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-purple-500" /> PTM
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500" /> Events
        </span>
      </div>
    </div>
  );
}

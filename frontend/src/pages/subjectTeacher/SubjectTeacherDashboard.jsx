import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { homeworkService, newsService, classService } from '../../services';
import StatCard from '../../components/common/StatCard';
import QuickActionsCard from '../../components/common/QuickActionsCard';
import MiniCalendar from '../../components/common/MiniCalendar';
import QuoteBanner from '../../components/common/QuoteBanner';
import CreateHomeworkModal from '../../components/homework/CreateHomeworkModal';
import DigitalDiaryView from '../../components/homework/DigitalDiaryView';
import CreateNewsModal from '../../components/news/CreateNewsModal';
import NewsDetailModal from '../../components/news/NewsDetailModal';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import {
  BookOpen,
  CheckSquare,
  Award,
  BookMarked,
  Plus,
  School,
  Clock,
  ChevronRight,
  FileText,
  Calendar
} from 'lucide-react';

export default function SubjectTeacherDashboard() {
  const navigate = useNavigate();

  const [classes, setClasses] = useState([]);
  const [homeworkList, setHomeworkList] = useState([]);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [isHomeworkModalOpen, setIsHomeworkModalOpen] = useState(false);
  const [isNewsModalOpen, setIsNewsModalOpen] = useState(false);
  const [selectedNews, setSelectedNews] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [classList, newsData] = await Promise.all([
        classService.getAllClasses().catch(() => []),
        newsService.getAllNews().catch(() => [])
      ]);

      setClasses(classList);
      setNews(newsData);

      if (classList.length > 0) {
        const hwData = await homeworkService.getHomeworkForClass(classList[0].id).catch(() => []);
        setHomeworkList(hwData);
      }
    } catch (err) {
      console.error('Failed to load subject teacher dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const stQuickActions = [
    { label: 'Mark Attendance', icon: CheckSquare, path: '/subject-teacher/attendance', color: 'text-emerald-600 bg-emerald-50' },
    { label: 'Add Homework', icon: BookMarked, onClick: () => setIsHomeworkModalOpen(true), color: 'text-blue-600 bg-blue-50' },
    { label: 'Enter Marks', icon: Award, path: '/subject-teacher/marks', color: 'text-indigo-600 bg-indigo-50' },
    { label: 'Add News', icon: Plus, onClick: () => setIsNewsModalOpen(true), color: 'text-amber-600 bg-amber-50' }
  ];

  const todayClassesSchedule = [
    { time: '08:00 - 08:45', class: '10-A', subject: 'Mathematics' },
    { time: '09:00 - 09:45', class: '10-B', subject: 'Mathematics' },
    { time: '11:15 - 12:00', class: '9-A', subject: 'Applied Calculus' }
  ];

  const sampleHomework = [
    { title: 'Algebra Practice Set 3', due: 'Due: 16 Apr 2025 • 10-A', priority: 'High', color: 'text-rose-700 bg-rose-50 border-rose-200' },
    { title: 'Geometry Worksheet', due: 'Due: 18 Apr 2025 • 10-B', priority: 'Medium', color: 'text-amber-700 bg-amber-50 border-amber-200' },
    { title: 'Real Life Maths Project', due: 'Due: 22 Apr 2025 • 10-A', priority: 'Low', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' }
  ];

  return (
    <div className="space-y-6 animate-fade-in font-sans pb-8">
      {/* 1. Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">
              Good Morning, Ms. Priya Nair
            </h1>
            <span className="px-3 py-1 bg-indigo-50 border border-indigo-200 shadow-2xs rounded-full text-xs font-bold text-indigo-800 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-indigo-600" /> Subject Teacher
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Mathematics &bull; Class 10-A, Class 10-B
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/subject-teacher/attendance')}
            className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-2xl text-xs font-bold shadow-md shadow-emerald-500/20 transition-all flex items-center gap-2 cursor-pointer"
          >
            <CheckSquare className="w-4 h-4" />
            <span>Mark Period Attendance & OD</span>
          </button>
        </div>
      </div>

      {/* 2. KPI Cards Row (4 Cards) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Assigned Classes"
          value="2"
          subtitle="10-A, 10-B"
          icon={School}
          color="blue"
          trend={{ value: '2 Sections', isPositive: true }}
        />
        <StatCard
          title="Today's Classes"
          value="2"
          subtitle="Scheduled Periods"
          icon={Clock}
          color="teal"
          trend={{ value: '2 Today', isPositive: true }}
        />
        <StatCard
          title="Pending Homework"
          value="4"
          subtitle="Diary Assignments"
          icon={BookMarked}
          color="amber"
          trend={{ value: 'Active Tasks', isPositive: true }}
        />
        <StatCard
          title="Pending Marks"
          value="6"
          subtitle="Term Assessments"
          icon={Award}
          color="purple"
          trend={{ value: '6 Pending', isPositive: false }}
        />
      </div>

      {/* 3. Middle Section: Today's Classes Schedule & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Today's Classes Schedule Table */}
        <div className="lg:col-span-8 liquid-glass rounded-3xl p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-200/50 pb-2">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary-600" />
              <span>Today's Classes & Sessions</span>
            </h3>
            <span className="text-[11px] font-bold text-slate-400">3 Sessions Total</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-slate-400 font-bold border-b border-slate-100 text-[10px] uppercase">
                  <th className="py-2.5">Time</th>
                  <th className="py-2.5">Class</th>
                  <th className="py-2.5">Subject</th>
                  <th className="py-2.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {todayClassesSchedule.map((item, idx) => (
                  <tr key={idx} className="hover:bg-white/60 transition-colors">
                    <td className="py-3 font-mono font-bold text-slate-700">{item.time}</td>
                    <td className="py-3 font-bold text-slate-900">Class {item.class}</td>
                    <td className="py-3 text-slate-600">{item.subject}</td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => navigate('/subject-teacher/attendance')}
                        className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-2xs transition-all cursor-pointer"
                      >
                        Mark Attendance
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions Card */}
        <div className="lg:col-span-4">
          <QuickActionsCard actions={stQuickActions} />
        </div>
      </div>

      {/* 4. Bottom Section: Homework / Digital Diary + Recent News */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Homework / Digital Diary */}
        <div className="lg:col-span-6 liquid-glass rounded-3xl p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-200/50 pb-2">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <BookMarked className="w-4 h-4 text-indigo-600" />
              <span>Homework / Digital Diary</span>
            </h3>
            <span className="text-[11px] font-bold text-primary-600 cursor-pointer" onClick={() => setIsHomeworkModalOpen(true)}>+ New Task</span>
          </div>

          <div className="space-y-2 pt-1">
            {sampleHomework.map((hw, idx) => (
              <div key={idx} className="p-3 bg-white/70 rounded-2xl border border-white/80 flex items-center justify-between gap-3 shadow-2xs">
                <div>
                  <p className="text-xs font-bold text-slate-800">{hw.title}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{hw.due}</p>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${hw.color}`}>
                  {hw.priority}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent News for Teachers */}
        <div className="lg:col-span-6 liquid-glass rounded-3xl p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-200/50 pb-2">
            <h3 className="font-bold text-slate-800 text-sm">Academic Notices</h3>
            <button onClick={() => navigate('/news')} className="text-xs font-bold text-primary-600">View All</button>
          </div>

          <div className="space-y-2 pt-1">
            {news.slice(0, 3).map((item, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedNews(item)}
                className="p-3 bg-white/70 hover:bg-white/95 rounded-2xl border border-white/80 flex items-center justify-between gap-3 cursor-pointer shadow-2xs transition-all"
              >
                <div>
                  <p className="text-xs font-bold text-slate-800">{item.title}</p>
                  <p className="text-[10px] text-slate-400">by {item.author || 'SchoolTrack'}</p>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5. Bottom Quote Banner */}
      <QuoteBanner quote="Inspiring students through curiosity, problem-solving, and dedication." />

      {/* Modals */}
      <CreateHomeworkModal
        isOpen={isHomeworkModalOpen}
        onClose={() => setIsHomeworkModalOpen(false)}
        onSuccess={fetchDashboardData}
      />

      <CreateNewsModal
        isOpen={isNewsModalOpen}
        onClose={() => setIsNewsModalOpen(false)}
        onSuccess={fetchDashboardData}
      />

      <NewsDetailModal
        isOpen={!!selectedNews}
        onClose={() => setSelectedNews(null)}
        news={selectedNews}
      />
    </div>
  );
}
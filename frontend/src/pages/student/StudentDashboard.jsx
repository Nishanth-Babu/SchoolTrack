import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { attendanceService, homeworkService, leaveService, newsService, markService } from '../../services';
import StatCard from '../../components/common/StatCard';
import MiniCalendar from '../../components/common/MiniCalendar';
import QuoteBanner from '../../components/common/QuoteBanner';
import DigitalDiaryView from '../../components/homework/DigitalDiaryView';
import ApplyLeaveModal from '../../components/leave/ApplyLeaveModal';
import LeaveTimeline from '../../components/leave/LeaveTimeline';
import NewsDetailModal from '../../components/news/NewsDetailModal';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import {
  GraduationCap,
  Award,
  BookOpen,
  Calendar,
  Sparkles,
  CheckCircle,
  Clock,
  Plus,
  ChevronRight,
  ChevronUp,
  ChevronDown
} from 'lucide-react';

export default function StudentDashboard() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [stats, setStats] = useState(null);
  const [homeworkList, setHomeworkList] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals & Expansion
  const [isApplyLeaveOpen, setIsApplyLeaveOpen] = useState(false);
  const [expandedLeaveId, setExpandedLeaveId] = useState(null);
  const [selectedNews, setSelectedNews] = useState(null);

  useEffect(() => {
    fetchStudentData();
  }, []);

  const fetchStudentData = async () => {
    try {
      setLoading(true);
      const studentId = user?.profileId || 1;
      const [attStats, diary, leaveList, newsData] = await Promise.all([
        attendanceService.getStudentAttendanceStats(studentId).catch(() => null),
        homeworkService.getStudentDigitalDiary(studentId).catch(() => []),
        leaveService.getLeaves({ studentId }).catch(() => []),
        newsService.getAllNews().catch(() => [])
      ]);

      setStats(attStats);
      setHomeworkList(diary);
      setLeaves(leaveList);
      setNews(newsData);
    } catch (err) {
      console.error('Failed to load student dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const displayName = user?.fullName || user?.name || user?.firstName || 'Rohan Mehta';
  const rollNo = user?.rollNumber || '23AD001';
  const className = user?.className || 'Class 10-A';

  const upcomingExamsList = [
    { subject: 'Mathematics', date: '18 Apr 2025', term: 'Mid Term Exam' },
    { subject: 'Science & Physics', date: '22 Apr 2025', term: 'Theory & Practical' }
  ];

  return (
    <div className="space-y-6 animate-fade-in font-sans pb-8">
      {/* 1. Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">
              Good Morning, {displayName}
            </h1>
            <span className="px-3 py-1 bg-emerald-50 border border-emerald-200 shadow-2xs rounded-full text-xs font-bold text-emerald-800 flex items-center gap-1.5">
              {className} &bull; Roll No: {rollNo}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Welcome to your student learning hub, digital diary, and academic record.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsApplyLeaveOpen(true)}
            className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-2xl text-xs font-bold shadow-md shadow-emerald-500/20 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Calendar className="w-4 h-4" />
            <span>Apply for Leave</span>
          </button>
          <button
            onClick={() => navigate('/student/report-card')}
            className="px-4 py-2.5 liquid-glass hover:bg-white text-slate-800 rounded-2xl text-xs font-bold shadow-2xs transition-all flex items-center gap-2 cursor-pointer"
          >
            <Award className="w-4 h-4 text-indigo-600" />
            <span>Report Card</span>
          </button>
        </div>
      </div>

      {/* 2. KPI Cards Row (4 Cards) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Attendance"
          value={`${stats?.attendancePercentage || 88}%`}
          subtitle="OD = 100% Present"
          icon={Award}
          color="emerald"
          trend={{ value: '88% Target', isPositive: true }}
          onClick={() => navigate('/student/absences')}
        />
        <StatCard
          title="Pending Homework"
          value={homeworkList.filter((h) => h.completionStatus !== 'COMPLETED').length || 4}
          subtitle="Diary Checklist"
          icon={BookOpen}
          color="amber"
          trend={{ value: '4 Tasks', isPositive: true }}
        />
        <StatCard
          title="Upcoming Exams"
          value="2"
          subtitle="April Term Finals"
          icon={Sparkles}
          color="purple"
          trend={{ value: 'In 4 Days', isPositive: true }}
        />
        <StatCard
          title="Leave Status"
          value={leaves.length > 0 ? leaves[0].status : 'Pending'}
          subtitle="3-Stage Workflow"
          icon={Calendar}
          color="teal"
          trend={{ value: 'Stage 2/3', isPositive: true }}
        />
      </div>

      {/* 3. Middle Section: Digital Diary Checklist & Attendance Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-8 liquid-glass rounded-3xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200/50 pb-2">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-primary-600" />
              <span>Today's Digital Diary & Homework</span>
            </h3>
            <span className="text-xs font-bold text-slate-500">Check off as you complete</span>
          </div>

          <DigitalDiaryView
            homeworkList={homeworkList}
            studentId={user?.profileId || 1}
            onStatusChange={fetchStudentData}
            isStudent={true}
          />
        </div>

        {/* Mini Calendar Widget */}
        <div className="lg:col-span-4">
          <MiniCalendar />
        </div>
      </div>

      {/* 4. Bottom Section: Upcoming Exams & Announcements */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Upcoming Exams Card */}
        <div className="lg:col-span-6 liquid-glass rounded-3xl p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-200/50 pb-2">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span>Upcoming Examinations</span>
            </h3>
            <span className="text-[11px] font-bold text-purple-600">View Date Sheet</span>
          </div>

          <div className="space-y-2 pt-1">
            {upcomingExamsList.map((ex, idx) => (
              <div key={idx} className="p-3 bg-white/70 rounded-2xl border border-white/80 flex items-center justify-between gap-3 shadow-2xs">
                <div>
                  <p className="text-xs font-bold text-slate-900">{ex.subject}</p>
                  <p className="text-[10px] text-slate-500">{ex.term}</p>
                </div>
                <span className="px-3 py-1 rounded-xl text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200">
                  {ex.date}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Announcements */}
        <div className="lg:col-span-6 liquid-glass rounded-3xl p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-200/50 pb-2">
            <h3 className="font-bold text-slate-800 text-sm">Recent Announcements</h3>
            <button onClick={() => navigate('/news')} className="text-xs font-bold text-primary-600">View All</button>
          </div>

          <div className="space-y-2 pt-1">
            {news.slice(0, 2).map((item, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedNews(item)}
                className="p-3 bg-white/70 hover:bg-white/95 rounded-2xl border border-white/80 flex items-center justify-between gap-3 cursor-pointer shadow-2xs transition-all"
              >
                <div>
                  <p className="text-xs font-bold text-slate-800">{item.title}</p>
                  <p className="text-[10px] text-slate-400">by {item.author || 'School Notice'}</p>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5. Bottom Quote Banner */}
      <QuoteBanner quote="Stay focused, study smart, and achieve your academic dreams!" />

      {/* Modals */}
      <ApplyLeaveModal
        isOpen={isApplyLeaveOpen}
        onClose={() => setIsApplyLeaveOpen(false)}
        onSuccess={fetchStudentData}
        studentId={user?.profileId || 1}
      />

      <NewsDetailModal
        isOpen={!!selectedNews}
        onClose={() => setSelectedNews(null)}
        news={selectedNews}
      />
    </div>
  );
}
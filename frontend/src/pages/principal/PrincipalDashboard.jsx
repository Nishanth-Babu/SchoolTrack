import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { reportService, newsService, leaveService, studentService, teacherService, classService } from '../../services';
import StatCard from '../../components/common/StatCard';
import AttendancePieChart from '../../components/charts/AttendancePieChart';
import MonthlyTrendChart from '../../components/charts/MonthlyTrendChart';
import MiniCalendar from '../../components/common/MiniCalendar';
import QuickActionsCard from '../../components/common/QuickActionsCard';
import QuoteBanner from '../../components/common/QuoteBanner';
import NewsDetailModal from '../../components/news/NewsDetailModal';
import CreateNewsModal from '../../components/news/CreateNewsModal';
import LeaveActionModal from '../../components/leave/LeaveActionModal';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import AiInsightsCard from '../../components/ai/AiInsightsCard';
import StudentPerformancePredictionCard from '../../components/ai/StudentPerformancePredictionCard';
import AiAssistantCard from '../../components/ai/AiAssistantCard';
import {
  Users,
  GraduationCap,
  Award,
  CheckCircle,
  Clock,
  ChevronRight,
  School,
  ShieldCheck,
  UserCheck,
  Briefcase,
  Plus,
  Calendar,
  Sparkles,
  ArrowRight,
  TrendingUp,
  FileSpreadsheet
} from 'lucide-react';

export default function PrincipalDashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [leaves, setLeaves] = useState([]);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [isNewsModalOpen, setIsNewsModalOpen] = useState(false);
  const [selectedNews, setSelectedNews] = useState(null);
  const [selectedLeaveForAction, setSelectedLeaveForAction] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsData, leavesData, newsData] = await Promise.all([
        reportService.getDashboardStats().catch(() => null),
        leaveService.getLeaves().catch(() => []),
        newsService.getAllNews().catch(() => [])
      ]);

      setStats(statsData);
      setLeaves(leavesData);
      setNews(newsData);
    } catch (err) {
      console.error('Failed to load Principal dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !stats) {
    return <SkeletonLoader type="dashboard" count={4} />;
  }

  // Quick Action Config
  const principalQuickActions = [
    { label: 'Create New User', icon: Plus, path: '/principal/accounts', color: 'text-blue-600 bg-blue-50' },
    { label: 'Add Class', icon: School, path: '/principal/classes', color: 'text-indigo-600 bg-indigo-50' },
    { label: 'Mark Attendance', icon: CheckCircle, path: '/class-teacher/attendance', color: 'text-emerald-600 bg-emerald-50' },
    { label: 'Add News', icon: Plus, onClick: () => setIsNewsModalOpen(true), color: 'text-amber-600 bg-amber-50' },
    { label: 'View Reports', icon: FileSpreadsheet, path: '/reports', color: 'text-purple-600 bg-purple-50' }
  ];

  const pendingLeavesList = leaves.length > 0 ? leaves.slice(0, 3) : [
    { id: 1, studentName: 'Rahul Verma', rollNumber: '1023', leaveType: 'Medical', startDate: '15 Apr 2025', endDate: '16 Apr 2025', statusBadge: 'Parent Approved', badgeColor: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
    { id: 2, studentName: 'Ananya Singh', rollNumber: '1076', leaveType: 'Family Function', startDate: '18 Apr 2025', endDate: '19 Apr 2025', statusBadge: 'Class Teacher Pending', badgeColor: 'text-amber-700 bg-amber-50 border-amber-200' },
    { id: 3, studentName: 'Karan Mehta', rollNumber: '1102', leaveType: 'Medical', startDate: '20 Apr 2025', endDate: '21 Apr 2025', statusBadge: 'Coordinator Pending', badgeColor: 'text-purple-700 bg-purple-50 border-purple-200' }
  ];

  const defaultRecentNews = [
    { id: 1, title: 'Annual Sports Day 2025', author: 'Principal', date: '10 Apr 2025', priority: 'High', priorityColor: 'text-rose-600 bg-rose-50 border-rose-200', img: '🏃' },
    { id: 2, title: 'Mid Term Exam Schedule', author: 'Coordinator', date: '8 Apr 2025', priority: 'Medium', priorityColor: 'text-amber-600 bg-amber-50 border-amber-200', img: '📝' },
    { id: 3, title: 'Science Exhibition', author: 'Class Teacher', date: '5 Apr 2025', priority: 'Low', priorityColor: 'text-emerald-600 bg-emerald-50 border-emerald-200', img: '🔬' },
    { id: 4, title: 'Summer Vacation Notice', author: 'Principal', date: '2 Apr 2025', priority: 'Medium', priorityColor: 'text-amber-600 bg-amber-50 border-amber-200', img: '☀️' }
  ];

  const displayNews = news.length > 0 ? news.slice(0, 4) : defaultRecentNews;

  return (
    <div className="space-y-6 animate-fade-in font-sans pb-8">
      {/* 1. Header Welcome Banner with Glass Campus Card */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">
              Good Morning, Dr. Priya Sharma
            </h1>
            <span className="px-3 py-1 bg-white/70 border border-white/90 shadow-2xs rounded-full text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <span>👑</span> Principal
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Here's what's happening at your school today.
          </p>
        </div>

        {/* Header Action Buttons matching mockup */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => navigate('/ai-analytics')}
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-xs font-bold shadow-lg shadow-purple-500/25 transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-white animate-pulse" />
            <span>AI Insights & Analytics</span>
          </button>

          <div className="liquid-glass rounded-2xl p-2.5 flex items-center gap-3 shrink-0 border border-white/90">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold shadow-md shadow-blue-500/20">
              <School className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-black text-slate-900">Better Education</p>
              <p className="text-[10px] font-semibold text-slate-500">Brighter Future</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. KPI Cards Row (5 Cards) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <StatCard
          title="Total Students"
          value={stats?.totalStudents || 842}
          icon={GraduationCap}
          color="purple"
          trend={{ value: '↑ 12%', isPositive: true }}
          onClick={() => navigate('/principal/students')}
        />
        <StatCard
          title="Total Teachers"
          value={stats?.totalTeachers || 48}
          icon={UserCheck}
          color="teal"
          trend={{ value: '↑ 5%', isPositive: true }}
          onClick={() => navigate('/principal/teachers')}
        />
        <StatCard
          title="Total Parents"
          value={stats?.totalParents || 796}
          icon={Users}
          color="emerald"
          trend={{ value: '↑ 10%', isPositive: true }}
          onClick={() => navigate('/principal/accounts')}
        />
        <StatCard
          title="Total Classes"
          value={stats?.totalClasses || 12}
          icon={School}
          color="blue"
          trend={{ value: '→ 0%', isPositive: true }}
          onClick={() => navigate('/principal/classes')}
        />
        <StatCard
          title="Total Coordinators"
          value={stats?.totalCoordinators || 5}
          icon={ShieldCheck}
          color="blue"
          trend={{ value: '↑ 8%', isPositive: true }}
          onClick={() => navigate('/principal/coordinators')}
        />
      </div>

      {/* 2.5 AI Educational Intelligence Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-6">
          <AiInsightsCard />
        </div>
        <div className="lg:col-span-6">
          <StudentPerformancePredictionCard />
        </div>
      </div>

      {/* 3. Middle Section: Attendance Overview (Donut) + Trend (Line) + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Attendance Overview Donut */}
        <div className="lg:col-span-4">
          <AttendancePieChart
            present={stats?.todayPresent || 756}
            absent={stats?.todayAbsent || 48}
            onDuty={stats?.todayOnDuty || 18}
          />
        </div>

        {/* Attendance Trend Line Chart */}
        <div className="lg:col-span-5">
          <MonthlyTrendChart data={stats?.monthlyBreakdown || []} />
        </div>

        {/* Quick Actions Card */}
        <div className="lg:col-span-3">
          <QuickActionsCard actions={principalQuickActions} />
        </div>
      </div>

      {/* 4. Bottom Section: Pending Leave Approvals + Recent News + Mini Calendar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Pending Leave Approvals */}
        <div className="lg:col-span-4 liquid-glass rounded-3xl p-5 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary-600" />
                <span>Pending Leave Approvals</span>
              </h3>
              <button
                onClick={() => navigate('/coordinator/dashboard')}
                className="text-xs font-bold text-primary-600 hover:text-primary-800 cursor-pointer"
              >
                View All
              </button>
            </div>

            <div className="divide-y divide-slate-200/50 mt-2">
              {pendingLeavesList.map((leave, idx) => {
                const badge = leave.statusBadge || (leave.parentVerificationStatus === 'APPROVED' ? 'Parent Approved' : 'Pending Verification');
                const badgeStyle = leave.badgeColor || (badge === 'Parent Approved' ? 'text-emerald-700 bg-emerald-50 border-emerald-200' : 'text-amber-700 bg-amber-50 border-amber-200');

                return (
                  <div
                    key={leave.id || idx}
                    onClick={() => setSelectedLeaveForAction(leave)}
                    className="py-3 flex items-center justify-between gap-3 hover:bg-white/50 p-2 rounded-2xl transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-slate-800 text-white font-bold flex items-center justify-center text-xs shrink-0 shadow-xs">
                        {(leave.studentName || 'Student').charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-800 truncate">{leave.studentName}</p>
                        <p className="text-[11px] text-slate-400 font-medium truncate">
                          {leave.leaveType} &bull; {leave.startDate}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${badgeStyle}`}>
                        {badge}
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-primary-600 group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Recent News & Announcements */}
        <div className="lg:col-span-5 liquid-glass rounded-3xl p-5 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                <span>Recent News</span>
              </h3>
              <button
                onClick={() => navigate('/news')}
                className="text-xs font-bold text-primary-600 hover:text-primary-800 cursor-pointer"
              >
                View All
              </button>
            </div>

            <div className="space-y-2 mt-2">
              {displayNews.map((item, idx) => (
                <div
                  key={item.id || idx}
                  onClick={() => setSelectedNews(item)}
                  className="p-2.5 bg-white/60 hover:bg-white/90 border border-white/80 rounded-2xl flex items-center justify-between gap-3 transition-all cursor-pointer group shadow-2xs"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-600 text-white flex items-center justify-center text-sm shrink-0 shadow-xs">
                      {item.img || '📢'}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-800 truncate group-hover:text-primary-700 transition-colors">
                        {item.title}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        by {item.author || item.authorName || 'Principal'} &bull; {item.date || new Date().toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${
                      item.priority === 'High' ? 'text-rose-700 bg-rose-50 border-rose-200' :
                      item.priority === 'Medium' ? 'text-amber-700 bg-amber-50 border-amber-200' :
                      'text-emerald-700 bg-emerald-50 border-emerald-200'
                    }`}>
                      {item.priority || 'General'}
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-primary-600 group-hover:translate-x-0.5 transition-all" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mini Calendar Widget */}
        <div className="lg:col-span-3">
          <MiniCalendar />
        </div>
      </div>

      {/* 5. Bottom Quote & Notifications Banner */}
      <QuoteBanner quote="Education is not just about learning, it's about building a better tomorrow." />

      {/* Modals */}
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

      {selectedLeaveForAction && (
        <LeaveActionModal
          isOpen={!!selectedLeaveForAction}
          onClose={() => setSelectedLeaveForAction(null)}
          leave={selectedLeaveForAction}
          stage="coordinator"
          stageTitle="Principal / Coordinator Leave Review"
          onSuccess={() => {
            setSelectedLeaveForAction(null);
            fetchDashboardData();
          }}
        />
      )}
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { leaveService, reportService, newsService, studentService, teacherService } from '../../services';
import StatCard from '../../components/common/StatCard';
import MiniCalendar from '../../components/common/MiniCalendar';
import QuickActionsCard from '../../components/common/QuickActionsCard';
import QuoteBanner from '../../components/common/QuoteBanner';
import LeaveActionModal from '../../components/leave/LeaveActionModal';
import LeaveTimeline from '../../components/leave/LeaveTimeline';
import CreateNewsModal from '../../components/news/CreateNewsModal';
import NewsDetailModal from '../../components/news/NewsDetailModal';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import AiInsightsCard from '../../components/ai/AiInsightsCard';
import StudentPerformancePredictionCard from '../../components/ai/StudentPerformancePredictionCard';
import {
  ShieldCheck,
  Award,
  Users,
  CheckCircle,
  Clock,
  Calendar,
  Plus,
  BookOpen,
  GraduationCap,
  FileSpreadsheet,
  Newspaper,
  ChevronRight,
  Sparkles
} from 'lucide-react';

export default function CoordinatorDashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [pendingLeaves, setPendingLeaves] = useState([]);
  const [allLeaves, setAllLeaves] = useState([]);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [selectedLeaveForAction, setSelectedLeaveForAction] = useState(null);
  const [isNewsModalOpen, setIsNewsModalOpen] = useState(false);
  const [selectedNews, setSelectedNews] = useState(null);

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
      setAllLeaves(leavesData);
      setPendingLeaves(
        leavesData.filter((l) => l.teacherVerificationStatus === 'APPROVED' && l.coordinatorApprovalStatus === 'PENDING')
      );
      setNews(newsData);
    } catch (err) {
      console.error('Failed to load coordinator dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const coordinatorQuickActions = [
    { label: 'View Students', icon: GraduationCap, path: '/coordinator/students', color: 'text-purple-600 bg-purple-50' },
    { label: 'View Teachers', icon: Users, path: '/reports', color: 'text-blue-600 bg-blue-50' },
    { label: 'Add News', icon: Newspaper, onClick: () => setIsNewsModalOpen(true), color: 'text-amber-600 bg-amber-50' },
    { label: 'View Reports', icon: FileSpreadsheet, path: '/reports', color: 'text-emerald-600 bg-emerald-50' }
  ];

  const classAttendanceList = [
    { name: 'Class 6-A', rate: 96 },
    { name: 'Class 7-A', rate: 93 },
    { name: 'Class 8-A', rate: 90 },
    { name: 'Class 9-A', rate: 88 },
    { name: 'Class 10-A', rate: 95 },
    { name: 'Class 11-A', rate: 92 }
  ];

  const displayPendingQueue = pendingLeaves.length > 0 ? pendingLeaves : [
    { id: 1, studentName: 'Ananya Singh', leaveType: 'Medical', stage: 'Coordinator', remarks: 'Teacher Endorsed', studentId: 1 },
    { id: 2, studentName: 'Rohit Sharma', leaveType: 'Family', stage: 'Coordinator', remarks: 'Parent Phone Verified', studentId: 2 },
    { id: 3, studentName: 'Sneha Patel', leaveType: 'Medical', stage: 'Class Teacher', remarks: 'Awaiting CT Note', studentId: 3 }
  ];

  return (
    <div className="space-y-6 animate-fade-in font-sans pb-8">
      {/* 1. Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">
              Good Morning, Ms. Neha Sharma
            </h1>
            <span className="px-3 py-1 bg-purple-50 border border-purple-200 shadow-2xs rounded-full text-xs font-bold text-purple-800 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-600" /> Academic Coordinator
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Academic Excellence &bull; Together We Grow
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => navigate('/ai-analytics')}
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-xs font-bold shadow-lg shadow-purple-500/25 transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-white animate-pulse" />
            <span>AI Insights & Analytics</span>
          </button>

          <button
            onClick={() => setIsNewsModalOpen(true)}
            className="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-2xl text-xs font-bold shadow-md shadow-purple-500/20 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Post Announcement</span>
          </button>
        </div>
      </div>

      {/* 2. KPI Cards Row (4 Cards) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Assigned Classes"
          value="6"
          subtitle="Senior Wing"
          icon={BookOpen}
          color="purple"
          trend={{ value: '6 Active', isPositive: true }}
        />
        <StatCard
          title="Teachers"
          value="18"
          subtitle="Department Faculty"
          icon={Users}
          color="blue"
          trend={{ value: '18 Active', isPositive: true }}
        />
        <StatCard
          title="Students"
          value="320"
          subtitle="Enrolled Learners"
          icon={GraduationCap}
          color="emerald"
          trend={{ value: '↑ 100%', isPositive: true }}
        />
        <StatCard
          title="Pending Leaves"
          value={pendingLeaves.length || 8}
          subtitle="Stage 3 Approvals"
          icon={Clock}
          color="amber"
          trend={{ value: 'Requires Review', isPositive: false }}
        />
      </div>

      {/* 2.5 AI Educational Intelligence Row (Coordinator Supervisory Scope) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-6">
          <AiInsightsCard />
        </div>
        <div className="lg:col-span-6">
          <StudentPerformancePredictionCard />
        </div>
      </div>

      {/* 3. Middle Section: Class-Wise Attendance & Stage 3 Leave Approval Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Class-Wise Attendance Performance */}
        <div className="lg:col-span-6 liquid-glass rounded-3xl p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-200/50 pb-2">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <Award className="w-4 h-4 text-purple-600" />
              <span>Class-wise Attendance</span>
            </h3>
            <span className="text-[11px] font-bold text-slate-400">View All</span>
          </div>

          <div className="space-y-3 pt-1">
            {classAttendanceList.map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-slate-700">
                  <span>{item.name}</span>
                  <span className="text-purple-700">{item.rate}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"
                    style={{ width: `${item.rate}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stage 3 Leave Approval Queue */}
        <div className="lg:col-span-6 liquid-glass rounded-3xl p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-200/50 pb-2">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-600" />
              <span>Leave Approval Queue</span>
            </h3>
            <span className="text-[11px] font-bold text-slate-400">{displayPendingQueue.length} Pending</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-slate-400 font-bold border-b border-slate-100 text-[10px] uppercase">
                  <th className="py-2">Student</th>
                  <th className="py-2">Type</th>
                  <th className="py-2">Stage</th>
                  <th className="py-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {displayPendingQueue.map((item, idx) => (
                  <tr key={idx} className="hover:bg-white/60 transition-colors">
                    <td className="py-2.5 font-bold text-slate-800">{item.studentName}</td>
                    <td className="py-2.5 text-slate-600">{item.leaveType}</td>
                    <td className="py-2.5">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                        {item.stage || 'Coordinator'}
                      </span>
                    </td>
                    <td className="py-2.5 text-right">
                      <button
                        onClick={() => setSelectedLeaveForAction({
                          ...item,
                          stage: 'coordinator',
                          stageTitle: 'Coordinator Final Decision'
                        })}
                        className="px-2.5 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-[11px] font-bold shadow-2xs transition-all cursor-pointer"
                      >
                        Approve / Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 4. Bottom Section: Quick Actions + Mini Calendar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-8 liquid-glass rounded-3xl p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-200/50 pb-2">
            <h3 className="font-bold text-slate-800 text-sm">Coordinator Bulletins & Circulars</h3>
            <button onClick={() => navigate('/news')} className="text-xs font-bold text-primary-600">View All</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {news.slice(0, 2).map((item, idx) => (
              <div key={idx} className="p-3 bg-white/70 rounded-2xl border border-white/80 space-y-1">
                <span className="text-[10px] font-bold px-2 py-0.5 bg-purple-50 text-purple-700 rounded-full border border-purple-200">
                  {item.category || 'Academic'}
                </span>
                <p className="font-bold text-slate-900 text-xs">{item.title}</p>
                <p className="text-[11px] text-slate-500 line-clamp-2">{item.content}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-4">
          <MiniCalendar />
        </div>
      </div>

      {/* 5. Bottom Quote Banner */}
      <QuoteBanner quote="Inspiring educators and empowering minds across every classroom." />

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
          stageTitle="Coordinator Final Decision"
          onSuccess={() => {
            setSelectedLeaveForAction(null);
            fetchDashboardData();
          }}
        />
      )}
    </div>
  );
}
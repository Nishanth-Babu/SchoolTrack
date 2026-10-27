import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { openRoleSwitcher } from '../../store/slices/uiSlice';
import { reportService, newsService } from '../../services';
import StatCard from '../../components/common/StatCard';
import AttendancePieChart from '../../components/charts/AttendancePieChart';
import MonthlyTrendChart from '../../components/charts/MonthlyTrendChart';
import ClassComparisonBarChart from '../../components/charts/ClassComparisonBarChart';
import NewsCard from '../../components/news/NewsCard';
import NewsDetailModal from '../../components/news/NewsDetailModal';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import {
  Users,
  GraduationCap,
  Award,
  CheckCircle,
  Calendar,
  Sparkles,
  School,
  ShieldCheck,
  BookOpen
} from 'lucide-react';

export default function CommonDashboard() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [stats, setStats] = useState(null);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedNews, setSelectedNews] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsData, newsData] = await Promise.all([
        reportService.getDashboardStats().catch(() => null),
        newsService.getAllNews().catch(() => [])
      ]);

      setStats(statsData);
      setNews(newsData.slice(0, 3));
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !stats) {
    return <SkeletonLoader type="dashboard" count={4} />;
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary-900 via-indigo-900 to-slate-900 p-8 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-primary-200 backdrop-blur-md border border-white/10">
              <School className="w-3.5 h-3.5" /> Institutional Portal
            </span>
            <h1 className="text-2xl lg:text-3xl font-black tracking-tight">
              Welcome to SchoolTrack, {user?.name || 'User'}!
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Real-time attendance tracking with On Duty calculation, 3-stage leave verifications, and digital student diaries.
            </p>
          </div>

          <button
            onClick={() => dispatch(openRoleSwitcher())}
            className="px-5 py-3 bg-white hover:bg-slate-100 text-slate-900 rounded-2xl font-bold text-xs shadow-lg hover:shadow-xl transition-all flex items-center gap-2 self-start md:self-center shrink-0"
          >
            <Sparkles className="w-4 h-4 text-primary-600" />
            Switch Role Demo Persona
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Overall Attendance"
          value={`${stats?.todayAttendancePercentage || 94.5}%`}
          subtitle="OD counted as 100% Present"
          icon={Award}
          color="emerald"
        />
        <StatCard
          title="Total Students"
          value={stats?.totalStudents || 1250}
          subtitle="Enrolled active learners"
          icon={GraduationCap}
          color="blue"
        />
        <StatCard
          title="Today's Attendance"
          value={`${stats?.todayPresent || 20} Present`}
          subtitle={`${stats?.todayOnDuty || 2} On Duty (OD)`}
          icon={CheckCircle}
          color="purple"
        />
        <StatCard
          title="Faculty Staff"
          value={stats?.totalTeachers || 45}
          subtitle="Active teaching staff"
          icon={Users}
          color="amber"
        />
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <AttendancePieChart
            present={stats?.todayPresent || 20}
            absent={stats?.todayAbsent || 2}
            onDuty={stats?.todayOnDuty || 3}
          />
        </div>
        <div className="lg:col-span-2">
          <MonthlyTrendChart data={stats?.monthlyBreakdown || []} />
        </div>
      </div>

      {/* Class Comparison Chart */}
      <ClassComparisonBarChart data={stats?.classWiseAttendance || []} />

      {/* Announcements */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-800">Latest School Announcements</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {news.map((item) => (
            <NewsCard key={item.id} news={item} onReadMore={(n) => setSelectedNews(n)} />
          ))}
        </div>
      </div>

      <NewsDetailModal
        isOpen={!!selectedNews}
        onClose={() => setSelectedNews(null)}
        news={selectedNews}
      />
    </div>
  );
}
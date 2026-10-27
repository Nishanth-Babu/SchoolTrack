import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { studentService, attendanceService, leaveService, homeworkService, newsService } from '../../services';
import StatCard from '../../components/common/StatCard';
import AttendancePieChart from '../../components/charts/AttendancePieChart';
import MonthlyTrendChart from '../../components/charts/MonthlyTrendChart';
import AttendanceTable from '../../components/attendance/AttendanceTable';
import DigitalDiaryView from '../../components/homework/DigitalDiaryView';
import MiniCalendar from '../../components/common/MiniCalendar';
import QuickActionsCard from '../../components/common/QuickActionsCard';
import QuoteBanner from '../../components/common/QuoteBanner';
import ApplyLeaveModal from '../../components/leave/ApplyLeaveModal';
import LeaveActionModal from '../../components/leave/LeaveActionModal';
import NewsCard from '../../components/news/NewsCard';
import NewsDetailModal from '../../components/news/NewsDetailModal';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import {
  Users,
  CheckCircle,
  AlertCircle,
  Clock,
  Calendar,
  BookOpen,
  PhoneCall,
  BellRing,
  Award,
  ChevronRight,
  ShieldCheck,
  FileText,
  CreditCard,
  Sparkles,
  ArrowUpRight,
  Check,
  X
} from 'lucide-react';

export default function ParentDashboard() {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState(null);
  const [stats, setStats] = useState(null);
  const [recentAttendance, setRecentAttendance] = useState([]);
  const [pendingLeaves, setPendingLeaves] = useState([]);
  const [allLeaves, setAllLeaves] = useState([]);
  const [homeworkList, setHomeworkList] = useState([]);
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [isApplyLeaveOpen, setIsApplyLeaveOpen] = useState(false);
  const [selectedLeaveForAction, setSelectedLeaveForAction] = useState(null);
  const [selectedNews, setSelectedNews] = useState(null);
  const [ivrSuccessMsg, setIvrSuccessMsg] = useState('');

  useEffect(() => {
    fetchParentChildren();
    fetchNews();
  }, []);

  useEffect(() => {
    if (selectedChild) {
      fetchChildData(selectedChild.id);
    }
  }, [selectedChild]);

  const fetchParentChildren = async () => {
    try {
      setLoading(true);
      const students = await studentService.getAllStudents();
      setChildren(students);
      if (students.length > 0) {
        setSelectedChild(students[0]);
      }
    } catch (err) {
      console.error('Failed to load children:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchNews = async () => {
    try {
      const news = await newsService.getAllNews();
      setNewsList(news.slice(0, 3));
    } catch (err) {
      console.error('Failed to fetch news:', err);
    }
  };

  const fetchChildData = async (childId) => {
    try {
      const [attStats, attList, leaves, homework] = await Promise.all([
        attendanceService.getStudentAttendanceStats(childId).catch(() => null),
        attendanceService.getAttendance({ studentId: childId }).catch(() => []),
        leaveService.getLeaves({ studentId: childId }).catch(() => []),
        homeworkService.getStudentDigitalDiary(childId).catch(() => [])
      ]);

      setStats(attStats);
      setRecentAttendance(attList.slice(0, 5));
      setAllLeaves(leaves);
      setPendingLeaves(leaves.filter((l) => l.parentVerificationStatus === 'PENDING'));
      setHomeworkList(homework);
    } catch (err) {
      console.error('Failed to load child data:', err);
    }
  };

  const handleSimulateIVR = async (leaveId, approve = true) => {
    try {
      await leaveService.parentVerify(leaveId, {
        status: approve ? 'APPROVED' : 'REJECTED',
        remarks: approve ? 'Approved via Simulated IVR Parent Call' : 'Declined via IVR Call',
        ivrConfirmed: true
      });
      setIvrSuccessMsg(`Simulated IVR Call completed: Leave ${approve ? 'Confirmed & Verified' : 'Declined'} successfully!`);
      setTimeout(() => setIvrSuccessMsg(''), 6000);
      if (selectedChild) fetchChildData(selectedChild.id);
    } catch (err) {
      alert(err.response?.data?.message || 'IVR simulation failed');
    }
  };

  const quickActions = [
    {
      title: 'Apply Leave',
      description: 'Submit parent leave request',
      icon: Calendar,
      color: 'blue',
      onClick: () => setIsApplyLeaveOpen(true)
    },
    {
      title: 'Digital Diary',
      description: 'Check daily tasks & homework',
      icon: BookOpen,
      color: 'purple',
      onClick: () => {
        const diaryEl = document.getElementById('digital-diary-section');
        if (diaryEl) diaryEl.scrollIntoView({ behavior: 'smooth' });
      }
    },
    {
      title: 'Report Cards',
      description: 'Academic grades & marks',
      icon: FileText,
      color: 'emerald',
      onClick: () => navigate('/parent/report-cards')
    },
    {
      title: 'Fee Payment',
      description: 'Term tuition & online fees',
      icon: CreditCard,
      color: 'amber',
      onClick: () => navigate('/fees')
    }
  ];

  if (loading && children.length === 0) {
    return <SkeletonLoader type="dashboard" count={4} />;
  }

  const childDisplayName = selectedChild
    ? selectedChild.fullName || selectedChild.name || `${selectedChild.firstName || ''} ${selectedChild.lastName || ''}`.trim() || 'Student'
    : 'Student';

  const attendanceRate = stats?.attendancePercentage || 0;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Profile / Child Selector Banner */}
      <div className="liquid-glass p-6 rounded-3xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-teal-500 text-white flex items-center justify-center font-bold text-2xl shadow-lg ring-4 ring-white/60">
              {childDisplayName.charAt(0)}
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center shadow">
              <span className="w-2 h-2 bg-white rounded-full"></span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                Parent Guardian Portal
              </span>
              <span className="px-3 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Real-time Sync
              </span>
            </div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight mt-1">
              {childDisplayName}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Class <span className="font-semibold text-slate-700">{selectedChild?.className || '10-A'}</span> • Roll #{selectedChild?.rollNumber || selectedChild?.id || '14'} • Admission: {selectedChild?.admissionNumber || `ADM-${selectedChild?.id || '001'}`}
            </p>
          </div>
        </div>

        {/* Children Switcher Pills */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full md:w-auto">
          {children.length > 1 && (
            <div className="bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200/80 flex items-center gap-1.5 overflow-x-auto max-w-full">
              <span className="text-xs font-semibold text-slate-400 pl-2 pr-1">Children:</span>
              {children.map((c) => {
                const isSelected = selectedChild?.id === c.id;
                const name = c.fullName || c.name || `${c.firstName || ''} ${c.lastName || ''}`.trim() || 'Child';
                return (
                  <button
                    key={c.id}
                    onClick={() => setSelectedChild(c)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      isSelected
                        ? 'bg-white text-indigo-700 shadow-sm border border-indigo-100 font-bold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                    }`}
                  >
                    {name}
                  </button>
                );
              })}
            </div>
          )}

          <button
            onClick={() => setIsApplyLeaveOpen(true)}
            className="px-4 py-2.5 bg-gradient-to-r from-teal-600 to-indigo-600 hover:from-teal-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-teal-500/20 hover:shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            Apply Leave for {childDisplayName.split(' ')[0]}
          </button>
        </div>
      </div>

      {ivrSuccessMsg && (
        <div className="liquid-glass p-4 rounded-2xl border border-emerald-300 bg-emerald-50/80 text-emerald-800 text-xs font-medium flex items-center justify-between shadow-sm animate-fade-in">
          <div className="flex items-center gap-2.5">
            <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span>{ivrSuccessMsg}</span>
          </div>
          <button onClick={() => setIvrSuccessMsg('')} className="text-emerald-700 hover:text-emerald-950 font-bold">
            Dismiss
          </button>
        </div>
      )}

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Overall Attendance"
          value={`${attendanceRate.toFixed(1)}%`}
          subtitle="Required Threshold: 75%"
          icon={Award}
          trend={attendanceRate >= 75 ? '+2.4%' : '-1.5%'}
          trendType={attendanceRate >= 75 ? 'positive' : 'negative'}
          color="emerald"
        />
        <StatCard
          title="Days Present"
          value={stats?.presentCount || 0}
          subtitle="Regular academic days"
          icon={CheckCircle}
          color="blue"
        />
        <StatCard
          title="On Duty (OD)"
          value={stats?.onDutyCount || 0}
          subtitle="100% attendance credit"
          icon={ShieldCheck}
          color="purple"
        />
        <StatCard
          title="Days Absent"
          value={stats?.absentCount || 0}
          subtitle="Unexcused / Casual leaves"
          icon={AlertCircle}
          color="rose"
        />
      </div>

      {/* Action Required: Pending Parent Authorization Queue (Stage 1) */}
      {pendingLeaves.length > 0 && (
        <div className="liquid-glass p-6 rounded-3xl border-2 border-amber-300/80 bg-gradient-to-br from-amber-50/80 to-orange-50/50 shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-md animate-pulse">
                <BellRing className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-amber-950">
                  Action Required: Parent Verification ({pendingLeaves.length})
                </h3>
                <p className="text-xs text-amber-800">
                  Stage 1 Authorization: Your consent is mandatory before teacher review.
                </p>
              </div>
            </div>
            <span className="px-3 py-1 bg-amber-200 text-amber-950 font-bold text-xs rounded-full shadow-inner">
              Stage 1 Pending
            </span>
          </div>

          <div className="space-y-3">
            {pendingLeaves.map((leave) => (
              <div
                key={leave.id}
                className="liquid-glass p-4 rounded-2xl border border-amber-200/90 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-slate-800 text-sm">
                      {leave.leaveType} Leave Application
                    </span>
                    <span className="text-xs text-slate-600 bg-slate-100 font-mono px-2.5 py-0.5 rounded-lg border border-slate-200">
                      {leave.startDate} to {leave.endDate}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 italic">
                    Reason: "{leave.reason}"
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => handleSimulateIVR(leave.id, true)}
                    className="px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
                  >
                    <PhoneCall className="w-3.5 h-3.5 text-indigo-600" />
                    Simulate IVR Call
                  </button>
                  <button
                    onClick={() =>
                      setSelectedLeaveForAction({
                        ...leave,
                        actionType: 'parent',
                        stageName: 'Parent Verification'
                      })
                    }
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-500/20"
                  >
                    Approve / Review
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Grid: Left Charts & Feeds, Right Calendar & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Charts Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AttendancePieChart
              present={stats?.presentCount || 0}
              absent={stats?.absentCount || 0}
              onDuty={stats?.onDutyCount || 0}
            />
            <MonthlyTrendChart data={stats?.monthlyBreakdown || []} />
          </div>

          {/* Digital Diary & Homework View */}
          <div id="digital-diary-section" className="liquid-glass p-6 rounded-3xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-black text-slate-800 text-sm">
                    Digital Diary & Daily Homework
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Subject teacher assignments & homework status
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100">
                {homeworkList.length} Tasks
              </span>
            </div>
            <DigitalDiaryView homeworkList={homeworkList} isStudent={false} />
          </div>

          {/* Recent Attendance Logs */}
          <div className="liquid-glass p-6 rounded-3xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-black text-slate-800 text-sm">
                    Recent Attendance Logs
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Daily 3-state tracking (Present, Absent, On-Duty)
                  </p>
                </div>
              </div>
              <button
                onClick={() => navigate('/parent/attendance')}
                className="text-xs font-bold text-teal-600 hover:text-teal-800 flex items-center gap-1"
              >
                Full Log <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <AttendanceTable records={recentAttendance} showStudent={false} />
          </div>

          {/* School Announcements */}
          <div className="liquid-glass p-6 rounded-3xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-black text-slate-800 text-sm">
                School Announcements & Circulars
              </h3>
              <button
                onClick={() => navigate('/news')}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                View All <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {newsList.map((item) => (
                <NewsCard key={item.id} news={item} onReadMore={(n) => setSelectedNews(n)} />
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (1 Col) */}
        <div className="space-y-6">
          {/* Quick Actions Card */}
          <QuickActionsCard actions={quickActions} />

          {/* Mini Calendar Widget */}
          <MiniCalendar />

          {/* Child Academic Summary Card */}
          <div className="liquid-glass p-6 rounded-3xl border border-white/90">
            <h4 className="font-black text-slate-800 text-sm mb-3 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" />
              Academic Status Snapshot
            </h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50/80 border border-slate-100">
                <span className="text-xs text-slate-600 font-medium">Term 1 Performance</span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-lg">
                  Grade A (89.2%)
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50/80 border border-slate-100">
                <span className="text-xs text-slate-600 font-medium">Fee Balance</span>
                <span className="text-xs font-bold text-indigo-700 bg-indigo-100/70 px-2 py-0.5 rounded-lg">
                  Nil (Fully Paid)
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50/80 border border-slate-100">
                <span className="text-xs text-slate-600 font-medium">Parent-Teacher Meeting</span>
                <span className="text-xs font-bold text-purple-700 bg-purple-100/70 px-2 py-0.5 rounded-lg">
                  Nov 20, 10:00 AM
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quote Banner */}
      <QuoteBanner quote="Parents and teachers together create the foundation for children to build their dreams upon." author="Educational Leadership Forum" />

      {/* Modals */}
      <ApplyLeaveModal
        isOpen={isApplyLeaveOpen}
        onClose={() => setIsApplyLeaveOpen(false)}
        onSuccess={() => selectedChild && fetchChildData(selectedChild.id)}
        studentId={selectedChild?.id}
      />

      <LeaveActionModal
        isOpen={!!selectedLeaveForAction}
        onClose={() => setSelectedLeaveForAction(null)}
        leave={selectedLeaveForAction}
        stage={selectedLeaveForAction?.actionType || 'parent'}
        stageTitle={selectedLeaveForAction?.stageName || 'Parent Verification'}
        onSuccess={() => {
          setSelectedLeaveForAction(null);
          if (selectedChild) fetchChildData(selectedChild.id);
        }}
      />

      <NewsDetailModal
        isOpen={!!selectedNews}
        onClose={() => setSelectedNews(null)}
        news={selectedNews}
      />
    </div>
  );
}

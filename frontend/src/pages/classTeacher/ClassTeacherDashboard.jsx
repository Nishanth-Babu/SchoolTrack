import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { studentService, attendanceService, leaveService, homeworkService, newsService } from '../../services';
import StatCard from '../../components/common/StatCard';
import AttendancePieChart from '../../components/charts/AttendancePieChart';
import QuickActionsCard from '../../components/common/QuickActionsCard';
import MiniCalendar from '../../components/common/MiniCalendar';
import QuoteBanner from '../../components/common/QuoteBanner';
import LeaveActionModal from '../../components/leave/LeaveActionModal';
import CreateHomeworkModal from '../../components/homework/CreateHomeworkModal';
import DigitalDiaryView from '../../components/homework/DigitalDiaryView';
import CreateNewsModal from '../../components/news/CreateNewsModal';
import NewsDetailModal from '../../components/news/NewsDetailModal';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import {
  Users,
  CheckSquare,
  Clock,
  BookOpen,
  Award,
  CheckCircle,
  ShieldCheck,
  Calendar,
  Plus,
  ChevronRight
} from 'lucide-react';

export default function ClassTeacherDashboard() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [students, setStudents] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [pendingLeaves, setPendingLeaves] = useState([]);
  const [homeworkList, setHomeworkList] = useState([]);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [selectedLeaveForAction, setSelectedLeaveForAction] = useState(null);
  const [isHomeworkModalOpen, setIsHomeworkModalOpen] = useState(false);
  const [isNewsModalOpen, setIsNewsModalOpen] = useState(false);
  const [selectedNews, setSelectedNews] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [studentList, attList, leavesData, newsData] = await Promise.all([
        studentService.getAllStudents().catch(() => []),
        attendanceService.getAttendance().catch(() => []),
        leaveService.getLeaves().catch(() => []),
        newsService.getAllNews().catch(() => [])
      ]);

      setStudents(studentList);
      setAttendanceRecords(attList);
      setPendingLeaves(
        leavesData.filter((l) => l.parentVerificationStatus === 'APPROVED' && l.teacherVerificationStatus === 'PENDING')
      );
      setNews(newsData);

      if (studentList.length > 0) {
        const diary = await homeworkService.getStudentDigitalDiary(studentList[0].id).catch(() => []);
        setHomeworkList(diary);
      }
    } catch (err) {
      console.error('Failed to load class teacher dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const ctQuickActions = [
    { label: 'Mark Attendance', icon: CheckSquare, path: '/class-teacher/attendance', color: 'text-emerald-600 bg-emerald-50' },
    { label: 'Verify Leave', icon: Clock, onClick: () => navigate('/class-teacher/dashboard'), color: 'text-amber-600 bg-amber-50' },
    { label: 'View Students', icon: Users, path: '/class-teacher/students', color: 'text-blue-600 bg-blue-50' },
    { label: 'Add News', icon: Plus, onClick: () => setIsNewsModalOpen(true), color: 'text-purple-600 bg-purple-50' }
  ];

  const presentCount = attendanceRecords.filter((r) => r.status === 'PRESENT').length || 28;
  const onDutyCount = attendanceRecords.filter((r) => r.status === 'ON_DUTY').length || 1;
  const absentCount = attendanceRecords.filter((r) => r.status === 'ABSENT').length || 3;
  const totalStudents = students.length || 32;

  const sampleRecentLeaves = pendingLeaves.length > 0 ? pendingLeaves : [
    { id: 1, studentName: 'Sneha Patel', leaveType: 'Medical', status: 'Parent Verified', studentId: 1 },
    { id: 2, studentName: 'Rohan Dev', leaveType: 'Family', status: 'Pending Class Teacher', studentId: 2 },
    { id: 3, studentName: 'Aditi Verma', leaveType: 'Medical', status: 'Forwarded to Coord', studentId: 3 }
  ];

  return (
    <div className="space-y-6 animate-fade-in font-sans pb-8">
      {/* 1. Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">
              Good Morning, Mr. Arun Kumar
            </h1>
            <span className="px-3 py-1 bg-blue-50 border border-blue-200 shadow-2xs rounded-full text-xs font-bold text-blue-800 flex items-center gap-1.5">
              Class 10-A &bull; Class Teacher
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Daily attendance, Stage 2 leave verification, and digital diary tasks for Class 10-A.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/class-teacher/attendance')}
            className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl text-xs font-bold shadow-md shadow-blue-500/20 transition-all flex items-center gap-2 cursor-pointer"
          >
            <CheckSquare className="w-4 h-4" />
            <span>Mark Attendance & OD</span>
          </button>
        </div>
      </div>

      {/* 2. KPI Row (4 Cards) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Students"
          value={totalStudents}
          subtitle="Enrolled in 10-A"
          icon={Users}
          color="blue"
          trend={{ value: '32 Active', isPositive: true }}
          onClick={() => navigate('/class-teacher/students')}
        />
        <StatCard
          title="Today's Attendance"
          value={`${presentCount}/${totalStudents} (90%)`}
          subtitle="Includes OD as Present"
          icon={CheckCircle}
          color="emerald"
          trend={{ value: '↑ 90%', isPositive: true }}
        />
        <StatCard
          title="Absent"
          value={absentCount}
          subtitle="Parent SMS Sent"
          icon={Clock}
          color="rose"
          trend={{ value: '3 Absent', isPositive: false }}
        />
        <StatCard
          title="Pending Leaves"
          value={pendingLeaves.length || 2}
          subtitle="Stage 2 Verification"
          icon={Calendar}
          color="amber"
          trend={{ value: 'Action Needed', isPositive: false }}
        />
      </div>

      {/* 3. Middle Section: Attendance Donut + Recent Leave Requests + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-5">
          <AttendancePieChart
            present={presentCount}
            absent={absentCount}
            onDuty={onDutyCount}
          />
        </div>

        <div className="lg:col-span-4 liquid-glass rounded-3xl p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-200/50 pb-2">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-600" />
              <span>Recent Leave Requests</span>
            </h3>
            <span className="text-[11px] font-bold text-slate-400">View All</span>
          </div>

          <div className="space-y-2 pt-1">
            {sampleRecentLeaves.map((l, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedLeaveForAction(l)}
                className="p-2.5 bg-white/60 hover:bg-white/90 rounded-2xl border border-white/80 flex items-center justify-between gap-2 cursor-pointer transition-all"
              >
                <div>
                  <p className="text-xs font-bold text-slate-800">{l.studentName}</p>
                  <p className="text-[10px] text-slate-400">{l.leaveType} Leave</p>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                  {l.status || 'Pending'}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-3">
          <QuickActionsCard actions={ctQuickActions} />
        </div>
      </div>

      {/* 4. Bottom Section: Digital Diary + Mini Calendar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-8 liquid-glass rounded-3xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-primary-600" />
              <span>Section Digital Diary & Homework</span>
            </h3>
            <button
              onClick={() => setIsHomeworkModalOpen(true)}
              className="px-3 py-1 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-bold shadow-2xs transition-all cursor-pointer"
            >
              + Post Homework
            </button>
          </div>
          <DigitalDiaryView homeworkList={homeworkList} isStudent={false} />
        </div>

        <div className="lg:col-span-4">
          <MiniCalendar />
        </div>
      </div>

      {/* 5. Bottom Quote Banner */}
      <QuoteBanner quote="Great teaching begins with understanding every learner's journey." />

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

      {selectedLeaveForAction && (
        <LeaveActionModal
          isOpen={!!selectedLeaveForAction}
          onClose={() => setSelectedLeaveForAction(null)}
          leave={selectedLeaveForAction}
          stage="teacher"
          stageTitle="Class Teacher Review & Endorsement"
          onSuccess={() => {
            setSelectedLeaveForAction(null);
            fetchDashboardData();
          }}
        />
      )}
    </div>
  );
}
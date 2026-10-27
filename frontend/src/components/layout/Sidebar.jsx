import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import { setSidebarOpen } from '../../store/slices/uiSlice';
import { logout } from '../../store/slices/authSlice';
import {
  LayoutDashboard,
  Users,
  School,
  BookOpen,
  CheckSquare,
  Calendar,
  CalendarDays,
  Clock,
  BookMarked,
  Award,
  Newspaper,
  FileSpreadsheet,
  Settings,
  Bell,
  LogOut,
  ShieldCheck,
  UserCheck,
  GraduationCap,
  Receipt,
  CreditCard,
  ChevronDown,
  BrainCircuit,
  Sparkles
} from 'lucide-react';

export default function Sidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isSidebarOpen } = useSelector((state) => state.ui);
  const { user, role: stateRole } = useSelector((state) => state.auth);
  const effectiveRole = user?.role || user?.primaryRole || stateRole || (user?.roles && user.roles[0]);
  const displayName = user?.fullName || user?.name || user?.firstName || 'Dr. Priya Sharma';

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const getNavLinks = () => {
    switch (effectiveRole) {
      case 'PRINCIPAL':
        return [
          { name: 'Dashboard', path: '/principal/dashboard', icon: LayoutDashboard },
          { name: 'AI & Analytics', path: '/ai-analytics', icon: BrainCircuit, badge: 'New' },
          { name: 'User Management', path: '/principal/accounts', icon: Users },
          { name: 'Classes & Sections', path: '/principal/classes', icon: School },
          { name: 'Subjects', path: '/principal/teachers', icon: BookOpen },
          { name: 'Attendance & OD', path: '/class-teacher/attendance', icon: CheckSquare },
          { name: 'Leave Management', path: '/coordinator/dashboard', icon: Calendar },
          { name: 'Timetable', path: '/timetable', icon: Clock },
          { name: 'School Calendar', path: '/calendar', icon: CalendarDays },
          { name: 'Homework & Diary', path: '/class-teacher/dashboard', icon: BookMarked },
          { name: 'Exams & Marks', path: '/subject-teacher/marks', icon: Award },
          { name: 'News & Announcements', path: '/news', icon: Newspaper },
          { name: 'Reports', path: '/reports', icon: FileSpreadsheet },
          { name: 'Fee Portal', path: '/fees', icon: Receipt },
          { name: 'Notifications', path: '/notifications', icon: Bell }
        ];

      case 'COORDINATOR':
        return [
          { name: 'Dashboard', path: '/coordinator/dashboard', icon: LayoutDashboard },
          { name: 'AI & Analytics', path: '/ai-analytics', icon: BrainCircuit, badge: 'New' },
          { name: 'Leave Management', path: '/coordinator/dashboard', icon: Calendar },
          { name: 'Students Directory', path: '/coordinator/students', icon: GraduationCap },
          { name: 'Timetable', path: '/timetable', icon: Clock },
          { name: 'School Calendar', path: '/calendar', icon: CalendarDays },
          { name: 'Attendance Reports', path: '/reports', icon: FileSpreadsheet },
          { name: 'Exams & Marks', path: '/subject-teacher/marks', icon: Award },
          { name: 'Fee Portal', path: '/fees', icon: Receipt },
          { name: 'News & Announcements', path: '/news', icon: Newspaper },
          { name: 'Notifications', path: '/notifications', icon: Bell }
        ];

      case 'CLASS_TEACHER':
        return [
          { name: 'Dashboard', path: '/class-teacher/dashboard', icon: LayoutDashboard },
          { name: 'Attendance & OD', path: '/class-teacher/attendance', icon: CheckSquare },
          { name: 'Leave Verification', path: '/class-teacher/dashboard', icon: Calendar },
          { name: 'Class Timetable', path: '/timetable', icon: Clock },
          { name: 'School Calendar', path: '/calendar', icon: CalendarDays },
          { name: 'Students', path: '/class-teacher/students', icon: Users },
          { name: 'Class Marks', path: '/class-teacher/marks', icon: Award },
          { name: 'Homework & Diary', path: '/class-teacher/dashboard', icon: BookMarked },
          { name: 'Reports', path: '/reports', icon: FileSpreadsheet },
          { name: 'News & Announcements', path: '/news', icon: Newspaper },
          { name: 'Notifications', path: '/notifications', icon: Bell }
        ];

      case 'SUBJECT_TEACHER':
        return [
          { name: 'Dashboard', path: '/subject-teacher/dashboard', icon: LayoutDashboard },
          { name: 'Mark Attendance', path: '/subject-teacher/attendance', icon: CheckSquare },
          { name: 'Teaching Schedule', path: '/timetable', icon: Clock },
          { name: 'School Calendar', path: '/calendar', icon: CalendarDays },
          { name: 'Homework / Diary', path: '/subject-teacher/dashboard', icon: BookMarked },
          { name: 'Manage Marks', path: '/subject-teacher/marks', icon: Award },
          { name: 'News & Announcements', path: '/news', icon: Newspaper },
          { name: 'Notifications', path: '/notifications', icon: Bell }
        ];

      case 'STUDENT':
        return [
          { name: 'Dashboard', path: '/student/dashboard', icon: LayoutDashboard },
          { name: 'Attendance', path: '/student/absences', icon: CheckSquare },
          { name: 'Leave Request', path: '/student/dashboard', icon: Calendar },
          { name: 'Class Timetable', path: '/timetable', icon: Clock },
          { name: 'School Calendar', path: '/calendar', icon: CalendarDays },
          { name: 'Digital Diary', path: '/student/dashboard', icon: BookMarked },
          { name: 'Exams & Results', path: '/student/report-card', icon: Award },
          { name: 'Fee Payment', path: '/fees', icon: CreditCard },
          { name: 'News & Announcements', path: '/news', icon: Newspaper },
          { name: 'Notifications', path: '/notifications', icon: Bell }
        ];

      case 'PARENT':
        return [
          { name: 'Dashboard', path: '/parent/dashboard', icon: LayoutDashboard },
          { name: 'Attendance Record', path: '/parent/attendance', icon: CheckSquare },
          { name: 'Leave Verification', path: '/parent/leaves', icon: Calendar },
          { name: 'Class Timetable', path: '/timetable', icon: Clock },
          { name: 'School Calendar', path: '/calendar', icon: CalendarDays },
          { name: 'Digital Diary', path: '/parent/dashboard', icon: BookMarked },
          { name: 'Exams & Results', path: '/parent/report-card', icon: Award },
          { name: 'Fee Payments', path: '/fees', icon: CreditCard },
          { name: 'News & Announcements', path: '/news', icon: Newspaper },
          { name: 'Notifications', path: '/notifications', icon: Bell }
        ];

      default:
        return [
          { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
          { name: 'Timetable', path: '/timetable', icon: Clock },
          { name: 'School Calendar', path: '/calendar', icon: CalendarDays },
          { name: 'News', path: '/news', icon: Newspaper },
          { name: 'Notifications', path: '/notifications', icon: Bell }
        ];
    }
  };

  const navLinks = getNavLinks();

  return (
    <>
      {/* Mobile Backdrop overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-950/60 z-40 lg:hidden backdrop-blur-md transition-opacity"
          onClick={() => dispatch(setSidebarOpen(false))}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 liquid-glass-sidebar text-slate-300 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-0 ${
          isSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Brand Logo Header */}
          <div className="p-6 flex items-center gap-3.5 border-b border-white/10">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-500 via-indigo-500 to-cyan-400 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-500/30 ring-2 ring-white/20">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <span className="font-extrabold text-white tracking-tight text-lg">SchoolTrack</span>
              <p className="text-[10px] text-slate-400 font-medium tracking-wide">
                Learn &bull; Grow &bull; Succeed
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-3.5 space-y-1 overflow-y-auto max-h-[calc(100vh-210px)]">
            {navLinks.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.name + item.path}
                  to={item.path}
                  onClick={() => dispatch(setSidebarOpen(false))}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                      isActive
                        ? 'liquid-glass-active-nav'
                        : 'text-slate-300 hover:text-white hover:bg-white/10'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{item.name}</span>
                  {item.badge && (
                    <span className="ml-auto px-1.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase bg-purple-500/25 border border-purple-500/40 text-purple-300 shadow-sm shadow-purple-500/20">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* User Card & Settings/Logout at Bottom */}
        <div className="p-3.5 border-t border-white/10 bg-slate-950/30 space-y-2">
          {/* User Profile Pill Card */}
          <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between gap-2.5">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-600 text-white font-black flex items-center justify-center text-xs ring-1 ring-white/20 shrink-0">
                {displayName.charAt(0)}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate leading-tight">{displayName}</p>
                <p className="text-[10px] font-semibold text-primary-300 truncate mt-0.5">
                  {effectiveRole?.replace('_', ' ')}
                </p>
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          </div>

          {/* Secondary Actions */}
          <div className="flex items-center justify-between text-xs px-1 text-slate-400">
            <button
              onClick={() => navigate('/profile')}
              className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer py-1"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Settings</span>
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 hover:text-rose-400 transition-colors cursor-pointer py-1"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
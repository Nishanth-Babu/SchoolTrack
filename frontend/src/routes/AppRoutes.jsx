import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Layout
import AppLayout from '../components/layout/AppLayout';

// Auth
import Login from '../pages/auth/Login';

// Common
import CommonDashboard from '../pages/common/CommonDashboard';
import NewsPage from '../pages/news/NewsPage';
import NotificationPage from '../pages/notifications/NotificationPage';
import ProfilePage from '../pages/profile/ProfilePage';
import ReportsPage from '../pages/reports/ReportsPage';
import FeePaymentPortal from '../pages/fees/FeePaymentPortal';
import TimetablePage from '../pages/timetable/TimetablePage';
import SchoolCalendarPage from '../pages/calendar/SchoolCalendarPage';
import AiAnalyticsPage from '../pages/ai/AiAnalyticsPage';

// Principal
import PrincipalDashboard from '../pages/principal/PrincipalDashboard';
import UserAccountManagementPage from '../pages/principal/UserAccountManagementPage';
import TeacherManagement from '../pages/principal/TeacherManagement';
import CoordinatorManagement from '../pages/principal/CoordinatorManagement';
import StudentManagement from '../pages/principal/StudentManagement';
import ClassManagement from '../pages/principal/ClassManagement';
import AuditLogsPage from '../pages/principal/AuditLogsPage';

// Coordinator
import CoordinatorDashboard from '../pages/coordinator/CoordinatorDashboard';

// Class Teacher
import ClassTeacherDashboard from '../pages/classTeacher/ClassTeacherDashboard';

// Subject Teacher
import SubjectTeacherDashboard from '../pages/subjectTeacher/SubjectTeacherDashboard';
import MarkAttendancePage from '../pages/subjectTeacher/MarkAttendancePage';
import ManageMarksPage from '../pages/subjectTeacher/ManageMarksPage';

// Student
import StudentDashboard from '../pages/student/StudentDashboard';
import AbsenceHistoryPage from '../pages/student/AbsenceHistoryPage';
import StudentReportCardPage from '../pages/student/StudentReportCardPage';

// Parent
import ParentDashboard from '../pages/parent/ParentDashboard';
import ParentChildAttendancePage from '../pages/parent/ParentChildAttendancePage';
import ParentLeavePage from '../pages/parent/ParentLeavePage';
import ParentReportCardPage from '../pages/parent/ParentReportCardPage';

// Protected Route Guard
function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, user, token, role: stateRole } = useSelector((state) => state.auth);

  if (!isAuthenticated && !token) {
    return <Navigate to="/login" replace />;
  }

  const effectiveRole = user?.role || user?.primaryRole || stateRole || (user?.roles && user.roles[0]);

  if (allowedRoles && effectiveRole && !allowedRoles.includes(effectiveRole)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <AppLayout>{children}</AppLayout>;
}

// Role-based root redirector
function DashboardRedirect() {
  const { user, role: stateRole } = useSelector((state) => state.auth);
  const effectiveRole = user?.role || user?.primaryRole || stateRole || (user?.roles && user.roles[0]);

  switch (effectiveRole) {
    case 'PRINCIPAL':
      return <Navigate to="/principal/dashboard" replace />;
    case 'COORDINATOR':
      return <Navigate to="/coordinator/dashboard" replace />;
    case 'CLASS_TEACHER':
      return <Navigate to="/class-teacher/dashboard" replace />;
    case 'SUBJECT_TEACHER':
      return <Navigate to="/subject-teacher/dashboard" replace />;
    case 'STUDENT':
      return <Navigate to="/student/dashboard" replace />;
    case 'PARENT':
      return <Navigate to="/parent/dashboard" replace />;
    default:
      return <CommonDashboard />;
  }
}

export default function AppRoutes() {
  const { isAuthenticated, token } = useSelector((state) => state.auth);

  return (
    <Routes>
      {/* Public Login Route */}
      <Route
        path="/login"
        element={isAuthenticated || token ? <Navigate to="/dashboard" replace /> : <Login />}
      />

      {/* Dynamic Role-Based Dashboard */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardRedirect />
          </ProtectedRoute>
        }
      />

      {/* Principal & Coordinator AI Analytics */}
      <Route
        path="/ai-analytics"
        element={
          <ProtectedRoute allowedRoles={['PRINCIPAL', 'COORDINATOR']}>
            <AiAnalyticsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/timetable"
        element={
          <ProtectedRoute>
            <TimetablePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/calendar"
        element={
          <ProtectedRoute>
            <SchoolCalendarPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/news"
        element={
          <ProtectedRoute>
            <NewsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/notifications"
        element={
          <ProtectedRoute>
            <NotificationPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/fees"
        element={
          <ProtectedRoute>
            <FeePaymentPortal />
          </ProtectedRoute>
        }
      />
      <Route
        path="/reports"
        element={
          <ProtectedRoute allowedRoles={['PRINCIPAL', 'COORDINATOR', 'CLASS_TEACHER']}>
            <ReportsPage />
          </ProtectedRoute>
        }
      />

      {/* Principal Routes */}
      <Route
        path="/principal/dashboard"
        element={
          <ProtectedRoute allowedRoles={['PRINCIPAL']}>
            <PrincipalDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/principal/accounts"
        element={
          <ProtectedRoute allowedRoles={['PRINCIPAL']}>
            <UserAccountManagementPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/principal/teachers"
        element={
          <ProtectedRoute allowedRoles={['PRINCIPAL']}>
            <TeacherManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/principal/coordinators"
        element={
          <ProtectedRoute allowedRoles={['PRINCIPAL']}>
            <CoordinatorManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/principal/students"
        element={
          <ProtectedRoute allowedRoles={['PRINCIPAL']}>
            <StudentManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/principal/classes"
        element={
          <ProtectedRoute allowedRoles={['PRINCIPAL']}>
            <ClassManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/principal/audit-logs"
        element={
          <ProtectedRoute allowedRoles={['PRINCIPAL']}>
            <AuditLogsPage />
          </ProtectedRoute>
        }
      />

      {/* Coordinator Routes */}
      <Route
        path="/coordinator/dashboard"
        element={
          <ProtectedRoute allowedRoles={['COORDINATOR']}>
            <CoordinatorDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/coordinator/students"
        element={
          <ProtectedRoute allowedRoles={['COORDINATOR']}>
            <StudentManagement />
          </ProtectedRoute>
        }
      />

      {/* Class Teacher Routes */}
      <Route
        path="/class-teacher/dashboard"
        element={
          <ProtectedRoute allowedRoles={['CLASS_TEACHER']}>
            <ClassTeacherDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/class-teacher/attendance"
        element={
          <ProtectedRoute allowedRoles={['CLASS_TEACHER']}>
            <MarkAttendancePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/class-teacher/marks"
        element={
          <ProtectedRoute allowedRoles={['CLASS_TEACHER']}>
            <ManageMarksPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/class-teacher/students"
        element={
          <ProtectedRoute allowedRoles={['CLASS_TEACHER']}>
            <StudentManagement />
          </ProtectedRoute>
        }
      />

      {/* Subject Teacher Routes */}
      <Route
        path="/subject-teacher/dashboard"
        element={
          <ProtectedRoute allowedRoles={['SUBJECT_TEACHER']}>
            <SubjectTeacherDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/subject-teacher/attendance"
        element={
          <ProtectedRoute allowedRoles={['SUBJECT_TEACHER', 'CLASS_TEACHER']}>
            <MarkAttendancePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/subject-teacher/marks"
        element={
          <ProtectedRoute allowedRoles={['SUBJECT_TEACHER', 'CLASS_TEACHER', 'PRINCIPAL', 'COORDINATOR']}>
            <ManageMarksPage />
          </ProtectedRoute>
        }
      />

      {/* Student Routes */}
      <Route
        path="/student/dashboard"
        element={
          <ProtectedRoute allowedRoles={['STUDENT']}>
            <StudentDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/absences"
        element={
          <ProtectedRoute allowedRoles={['STUDENT']}>
            <AbsenceHistoryPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/report-card"
        element={
          <ProtectedRoute allowedRoles={['STUDENT']}>
            <StudentReportCardPage />
          </ProtectedRoute>
        }
      />

      {/* Parent Routes */}
      <Route
        path="/parent/dashboard"
        element={
          <ProtectedRoute allowedRoles={['PARENT']}>
            <ParentDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/parent/attendance"
        element={
          <ProtectedRoute allowedRoles={['PARENT']}>
            <ParentChildAttendancePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/parent/leaves"
        element={
          <ProtectedRoute allowedRoles={['PARENT']}>
            <ParentLeavePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/parent/report-card"
        element={
          <ProtectedRoute allowedRoles={['PARENT']}>
            <ParentReportCardPage />
          </ProtectedRoute>
        }
      />

      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

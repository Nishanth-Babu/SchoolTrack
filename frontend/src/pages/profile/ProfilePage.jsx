import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { openRoleSwitcher } from '../../store/slices/uiSlice';
import Badge from '../../components/common/Badge';
import {
  User,
  Mail,
  Phone,
  Shield,
  Key,
  GraduationCap,
  Briefcase,
  Users,
  Award,
  Sparkles,
  Lock
} from 'lucide-react';

export default function ProfilePage() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const getRoleTitle = (role) => {
    switch (role) {
      case 'PRINCIPAL':
        return 'School Principal / Executive Administrator';
      case 'COORDINATOR':
        return 'Academic & Level Coordinator';
      case 'CLASS_TEACHER':
        return 'Class Teacher (Section In-Charge)';
      case 'SUBJECT_TEACHER':
        return 'Subject / Faculty Teacher';
      case 'STUDENT':
        return 'Enrolled Student';
      case 'PARENT':
        return 'Parent / Guardian';
      default:
        return role;
    }
  };

  const demoAccounts = [
    { role: 'Principal', email: 'principal@schooltrack.com', desc: 'Full institutional governance, audit logs, staff management' },
    { role: 'Coordinator', email: 'coordinator@schooltrack.com', desc: 'Stage 3 leave approval, class performance overview' },
    { role: 'Class Teacher', email: 'classteacher@schooltrack.com', desc: 'Stage 2 leave review, section attendance & diary' },
    { role: 'Subject Teacher', email: 'subjectteacher@schooltrack.com', desc: 'Mark OD/Attendance, create homework assignments' },
    { role: 'Student', email: 'student@schooltrack.com', desc: 'Digital diary, leave application, attendance percentage' },
    { role: 'Parent', email: 'parent@schooltrack.com', desc: 'Stage 1 IVR / portal verification, child alerts' }
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Profile Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-primary-600 to-indigo-600 text-white flex items-center justify-center font-extrabold text-3xl shadow-md ring-4 ring-primary-50">
            {user?.name?.charAt(0) || 'U'}
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-800">{user?.name || 'User Profile'}</h1>
              <Badge status="info">{user?.role}</Badge>
            </div>
            <p className="text-sm font-medium text-slate-500">{getRoleTitle(user?.role)}</p>
            <p className="text-xs text-slate-400">User ID: #{user?.id} | Status: Active</p>
          </div>
        </div>

        <button
          onClick={() => dispatch(openRoleSwitcher())}
          className="px-4 py-2.5 bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          Switch Role Demo Persona
        </button>
      </div>

      {/* Account Details & Role Capabilities */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Contact & Profile Info */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <User className="w-5 h-5 text-primary-600" />
            Contact & Identity Details
          </h2>

          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-slate-400" />
                <span className="text-xs text-slate-500">Email Address</span>
              </div>
              <span className="text-xs font-semibold text-slate-800">{user?.email || 'N/A'}</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-slate-400" />
                <span className="text-xs text-slate-500">Phone / Emergency Contact</span>
              </div>
              <span className="text-xs font-semibold text-slate-800">{user?.phone || '+1 (555) 019-2834'}</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex items-center gap-3">
                <Shield className="w-4 h-4 text-slate-400" />
                <span className="text-xs text-slate-500">Security / Role Level</span>
              </div>
              <span className="text-xs font-semibold text-slate-800">{user?.role}</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex items-center gap-3">
                <Lock className="w-4 h-4 text-slate-400" />
                <span className="text-xs text-slate-500">Authentication</span>
              </div>
              <span className="text-xs font-semibold text-emerald-600">JWT Authenticated Session</span>
            </div>
          </div>
        </div>

        {/* Demo Personas Reference */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <Key className="w-5 h-5 text-indigo-600" />
              Pre-Configured Demo Credentials
            </h2>
            <span className="text-[11px] font-mono bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded border border-indigo-200">
              Password: password123
            </span>
          </div>

          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {demoAccounts.map((acc, idx) => (
              <div key={idx} className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                <div className="flex items-center justify-between font-semibold text-slate-800">
                  <span>{acc.role}</span>
                  <span className="font-mono text-slate-500">{acc.email}</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">{acc.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

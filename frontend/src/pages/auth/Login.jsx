import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginSuccess } from '../../store/slices/authSlice';
import { authService } from '../../services';
import {
  School,
  Lock,
  Mail,
  Sparkles,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Award,
  Users,
  GraduationCap,
  Briefcase,
  UserCheck,
  UserPlus,
  Phone,
  Hash,
  BookOpen
} from 'lucide-react';

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Login form state
  const [loginData, setLoginData] = useState({
    identifier: 'EMP-PRIN-01',
    password: 'password123'
  });

  const demoAccounts = [
    { role: 'Principal', id: 'EMP-PRIN-01', email: 'principal@schooltrack.com', icon: Award, color: 'text-rose-500 bg-rose-50 border-rose-200' },
    { role: 'Coordinator', id: 'EMP-CRD-01', email: 'coord.senior@schooltrack.com', icon: ShieldCheck, color: 'text-purple-500 bg-purple-50 border-purple-200' },
    { role: 'Class Teacher', id: 'EMP-CT-01', email: 'ct.grade10a@schooltrack.com', icon: UserCheck, color: 'text-blue-500 bg-blue-50 border-blue-200' },
    { role: 'Subject Teacher', id: 'EMP-ST-01', email: 'st.math@schooltrack.com', icon: Briefcase, color: 'text-indigo-500 bg-indigo-50 border-indigo-200' },
    { role: 'Student (01)', id: '01', email: 'student.arun@schooltrack.com', icon: GraduationCap, color: 'text-emerald-500 bg-emerald-50 border-emerald-200' },
    { role: 'Parent', id: '+91 98765 43210', email: 'parent.arun@schooltrack.com', icon: Users, color: 'text-teal-500 bg-teal-50 border-teal-200' }
  ];

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      const data = await authService.login({
        usernameOrEmail: loginData.identifier,
        password: loginData.password
      });
      dispatch(loginSuccess(data));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials or disabled account. Contact Principal.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col lg:flex-row overflow-hidden font-sans">
      {/* Left Hero Panel */}
      <div className="lg:w-1/2 p-8 lg:p-14 flex flex-col justify-between relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary-500 to-indigo-500 flex items-center justify-center text-white font-black text-2xl shadow-lg ring-4 ring-white/10">
              <School className="w-7 h-7" />
            </div>
            <div>
              <span className="font-black text-2xl tracking-tight">SchoolTrack</span>
              <span className="text-xs uppercase font-bold tracking-wider text-primary-400 block">
                Enterprise School Management
              </span>
            </div>
          </div>

          <div className="space-y-6 max-w-lg">
            <h1 className="text-3xl lg:text-4xl font-extrabold leading-tight tracking-tight">
              Centralized Academic, Attendance & Leave Management Platform.
            </h1>
            <p className="text-slate-300 text-sm leading-relaxed">
              Institutional governance with strict 3-state attendance (Present, Absent, On Duty), 3-stage parent IVR leave workflows, subject teacher marks entry, and Principal-controlled account provisioning.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3 text-xs text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Multi-Identifier Login: Teacher ID, Roll Number, Phone, or Email</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Strict 3-State Attendance: Present, Absent, OD (OD = 100% Present)</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>3-Stage Leave Engine: Student Apply $\rightarrow$ Parent Mock IVR $\rightarrow$ Class Teacher $\rightarrow$ Coordinator</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Principal Centralized Account Administration & Role Hierarchy</span>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 pt-8 text-xs text-slate-500 flex items-center justify-between">
          <span>&copy; {new Date().getFullYear()} SchoolTrack Enterprise. Real-World Production Platform.</span>
          <span className="flex items-center gap-1 text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> BCrypt & JWT Secured
          </span>
        </div>
      </div>

      {/* Right Login Panel */}
      <div className="lg:w-1/2 p-6 lg:p-14 flex flex-col justify-center bg-white overflow-y-auto max-h-screen">
        <div className="max-w-md w-full mx-auto space-y-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-primary-50 text-primary-700 border border-primary-100 rounded-full text-xs font-bold mb-3">
              <Lock className="w-3.5 h-3.5" /> Secure Institutional Access
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Sign In to SchoolTrack</h2>
            <p className="text-xs text-slate-500 mt-1">
              Enter your official Teacher ID, Student Roll Number, Registered Phone, or Email.
            </p>
          </div>

          {error && (
            <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* 1-Click Fast Demo Personas */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-primary-500" /> 1-Click Instant Persona Switcher:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {demoAccounts.map((acc) => {
                const Icon = acc.icon;
                const isSelected = loginData.identifier === acc.email || loginData.identifier === acc.id;
                return (
                  <button
                    key={acc.role}
                    type="button"
                    onClick={() => setLoginData({ identifier: acc.id, password: 'password123' })}
                    className={`p-2.5 rounded-xl border text-left text-xs transition-all flex items-center gap-2 cursor-pointer ${
                      isSelected
                        ? 'bg-primary-50 border-primary-500 ring-2 ring-primary-100 font-bold text-primary-900 shadow-xs'
                        : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700 font-medium'
                    }`}
                  >
                    <div className={`p-1.5 rounded-lg border ${acc.color}`}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="truncate">
                      <div className="font-bold text-[11px] truncate">{acc.role}</div>
                      <div className="text-[10px] text-slate-400 truncate">{acc.id}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4 pt-1">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Login Identifier (Teacher ID / Roll No / Phone / Email)
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={loginData.identifier}
                  onChange={(e) => setLoginData({ ...loginData, identifier: e.target.value })}
                  placeholder="e.g. EMP-PRIN-01, 01, +91 98765 43210"
                  className="w-full pl-9 pr-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700">Password</label>
                <span className="text-[11px] text-primary-600 font-medium cursor-pointer hover:underline" onClick={() => alert('Please contact the Principal for password reset.')}>
                  Forgot Password?
                </span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  className="w-full pl-9 pr-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:outline-none font-mono transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 text-white rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              {loading ? (
                <span>Authenticating Identity...</span>
              ) : (
                <>
                  <span>Sign In to Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center text-xs text-slate-500">
            <p className="font-semibold text-slate-700">Account Provisioning Notice:</p>
            <p className="text-[11px] mt-0.5">
              All staff, student, and parent accounts are created and provisioned exclusively by the Principal.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
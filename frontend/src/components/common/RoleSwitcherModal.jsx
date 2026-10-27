import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { closeRoleSwitcher } from '../../store/slices/uiSlice';
import { loginSuccess } from '../../store/slices/authSlice';
import { authService } from '../../services';
import Modal from './Modal';
import {
  ShieldAlert,
  GraduationCap,
  Briefcase,
  Users,
  Award,
  Layers,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  UserCheck
} from 'lucide-react';

export default function RoleSwitcherModal() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isRoleSwitcherOpen } = useSelector((state) => state.ui);
  const { user: currentUser } = useSelector((state) => state.auth);

  const roles = [
    {
      role: 'PRINCIPAL',
      name: 'Dr. Arthur Pendelton',
      email: 'principal@schooltrack.com',
      title: 'Principal / Admin',
      desc: 'Institutional analytics, staff management, audit logs, and master controls',
      icon: Award,
      badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
      iconBg: 'bg-rose-500 text-white',
      borderHover: 'hover:border-rose-400 hover:ring-2 hover:ring-rose-100',
      path: '/principal/dashboard'
    },
    {
      role: 'COORDINATOR',
      name: 'Sarah Jenkins',
      email: 'coord.senior@schooltrack.com',
      title: 'Academic Coordinator',
      desc: '3-Stage leave final approval, level performance, cross-class oversight',
      icon: ShieldCheck,
      badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
      iconBg: 'bg-purple-500 text-white',
      borderHover: 'hover:border-purple-400 hover:ring-2 hover:ring-purple-100',
      path: '/coordinator/dashboard'
    },
    {
      role: 'CLASS_TEACHER',
      name: 'Elena Rostova',
      email: 'ct.grade10a@schooltrack.com',
      title: 'Class Teacher (10-A)',
      desc: 'Stage 2 leave verification, daily attendance tracking, section digital diary',
      icon: UserCheck,
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
      iconBg: 'bg-blue-500 text-white',
      borderHover: 'hover:border-blue-400 hover:ring-2 hover:ring-blue-100',
      path: '/class-teacher/dashboard'
    },
    {
      role: 'SUBJECT_TEACHER',
      name: 'Alan Turing',
      email: 'st.math@schooltrack.com',
      title: 'Subject Faculty (Maths)',
      desc: 'Mark daily attendance with OD calculation, create homework, post news',
      icon: Briefcase,
      badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      iconBg: 'bg-indigo-500 text-white',
      borderHover: 'hover:border-indigo-400 hover:ring-2 hover:ring-indigo-100',
      path: '/subject-teacher/dashboard'
    },
    {
      role: 'STUDENT',
      name: 'Arun Sharma',
      email: 'student.arun@schooltrack.com',
      title: 'Student (Class 10-A)',
      desc: 'Interactive Digital Diary, apply for 3-stage leaves, absence history',
      icon: GraduationCap,
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      iconBg: 'bg-emerald-500 text-white',
      borderHover: 'hover:border-emerald-400 hover:ring-2 hover:ring-emerald-100',
      path: '/student/dashboard'
    },
    {
      role: 'PARENT',
      name: 'Vikram Sharma',
      email: 'parent.arun@schooltrack.com',
      title: 'Parent / Guardian',
      desc: 'Stage 1 Leave verification, simulated IVR phone call, absence alerts',
      icon: Users,
      badgeColor: 'bg-teal-50 text-teal-700 border-teal-200',
      iconBg: 'bg-teal-600 text-white',
      borderHover: 'hover:border-teal-400 hover:ring-2 hover:ring-teal-100',
      path: '/parent/dashboard'
    }
  ];

  const handleSwitch = async (targetRole) => {
    try {
      const response = await authService.login({
        email: targetRole.email,
        password: 'password123'
      });
      dispatch(loginSuccess(response));
      dispatch(closeRoleSwitcher());
      navigate(targetRole.path);
    } catch (err) {
      console.error('Failed to switch role:', err);
      alert('Role switch failed. Please verify demo backend accounts.');
    }
  };

  return (
    <Modal
      isOpen={isRoleSwitcherOpen}
      onClose={() => dispatch(closeRoleSwitcher())}
      title="Quick Role Persona Switcher"
      subtitle="Instantly switch between all 6 system roles to experience full end-to-end workflows"
      maxWidth="max-w-4xl"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-2">
        {roles.map((r) => {
          const Icon = r.icon;
          const isActive = currentUser?.email === r.email;

          return (
            <div
              key={r.role}
              onClick={() => handleSwitch(r)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer group flex items-start justify-between gap-3 ${
                isActive
                  ? 'bg-slate-50 border-primary-500 ring-2 ring-primary-100 shadow-sm'
                  : `bg-white border-slate-200 ${r.borderHover} hover:shadow-md`
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div className={`p-2.5 rounded-xl ${r.iconBg} shadow-sm shrink-0 group-hover:scale-105 transition-transform`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-800 text-sm">{r.title}</span>
                    {isActive && (
                      <span className="text-[10px] uppercase font-bold bg-primary-600 text-white px-2 py-0.5 rounded-full">
                        Active
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-medium text-slate-600">{r.name} &bull; <span className="font-mono text-slate-400">{r.email}</span></p>
                  <p className="text-[11px] text-slate-500 leading-relaxed pt-0.5">{r.desc}</p>
                </div>
              </div>

              <div className="p-1 text-slate-300 group-hover:text-primary-600 group-hover:translate-x-1 transition-all shrink-0">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          );
        })}
      </div>
    </Modal>
  );
}
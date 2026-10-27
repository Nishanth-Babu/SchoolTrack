import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  School,
  CheckSquare,
  Newspaper,
  FileSpreadsheet,
  Calendar,
  Award,
  BookOpen,
  Receipt,
  Users
} from 'lucide-react';

export default function QuickActionsCard({ actions, title = 'Quick Actions' }) {
  const navigate = useNavigate();

  const defaultActions = [
    { label: 'Create New User', icon: Plus, path: '/principal/accounts', color: 'text-blue-600 bg-blue-50' },
    { label: 'Add Class', icon: School, path: '/principal/classes', color: 'text-indigo-600 bg-indigo-50' },
    { label: 'Mark Attendance', icon: CheckSquare, path: '/class-teacher/attendance', color: 'text-emerald-600 bg-emerald-50' },
    { label: 'Add News', icon: Newspaper, path: '/news', color: 'text-amber-600 bg-amber-50' },
    { label: 'View Reports', icon: FileSpreadsheet, path: '/reports', color: 'text-purple-600 bg-purple-50' }
  ];

  const items = actions || defaultActions;

  return (
    <div className="liquid-glass rounded-3xl p-5 space-y-3 font-sans">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
          <span>{title}</span>
        </h3>
      </div>

      <div className="space-y-2">
        {items.map((act, idx) => {
          const Icon = act.icon;
          return (
            <button
              key={idx}
              onClick={() => act.onClick ? act.onClick() : navigate(act.path)}
              className="w-full p-2.5 bg-white/70 hover:bg-white/95 border border-white/90 hover:border-primary-200 rounded-2xl text-xs font-bold text-slate-700 hover:text-primary-700 shadow-2xs hover:shadow-xs transition-all flex items-center gap-3 group cursor-pointer"
            >
              <div className={`p-2 rounded-xl ${act.color || 'bg-primary-50 text-primary-600'} group-hover:scale-105 transition-transform`}>
                <Icon className="w-4 h-4" />
              </div>
              <span className="truncate">{act.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

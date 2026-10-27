import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../store/slices/authSlice';
import { openRoleSwitcher, toggleSidebar } from '../../store/slices/uiSlice';
import {
  Bell,
  Menu,
  Sparkles,
  LogOut,
  Search,
  School,
  Clock,
  ChevronDown
} from 'lucide-react';

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, role: stateRole } = useSelector((state) => state.auth);
  const { unreadCount } = useSelector((state) => state.notifications);
  const effectiveRole = user?.role || user?.primaryRole || stateRole || (user?.roles && user?.roles[0]);
  const displayName = user?.fullName || user?.name || user?.firstName || 'Dr. Priya Sharma';

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  // Format date like: "Mon, 14 Apr 2025 10:24 AM"
  const formattedDateTime = currentTime.toLocaleString('en-US', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });

  const getInitials = (name) => {
    if (!name) return 'PS';
    const parts = name.replace(/^(Dr\.|Mr\.|Mrs\.|Ms\.)\s+/i, '').trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-30 liquid-glass-header px-4 lg:px-8 py-3.5 transition-all font-sans">
      <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">
        {/* Left Section: Mobile Menu & Global Search Bar */}
        <div className="flex items-center gap-3 flex-1 max-w-2xl">
          <button
            onClick={() => dispatch(toggleSidebar())}
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-white/80 rounded-2xl lg:hidden transition-all cursor-pointer shadow-2xs"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Liquid Glass Search Bar */}
          <div className="relative w-full max-w-lg">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search students, teachers, classes..."
              className="w-full pl-11 pr-4 py-2.5 liquid-glass-input rounded-2xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none transition-all"
            />
          </div>
        </div>

        {/* Right Section: Time & Date, Role Switcher, Notifications & Profile Avatar */}
        <div className="flex items-center gap-3">
          {/* Quick Role Switcher Button */}
          <button
            onClick={() => dispatch(openRoleSwitcher())}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl text-xs font-bold shadow-md shadow-blue-500/20 transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Switch Role</span>
          </button>

          {/* Notification Bell with Liquid Glass badge */}
          <button
            onClick={() => navigate('/notifications')}
            className="relative p-2.5 liquid-glass-pill rounded-2xl text-slate-600 hover:text-primary-600 hover:bg-white transition-all cursor-pointer"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-black flex items-center justify-center ring-2 ring-white shadow-xs">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Current Date & Live Time */}
          <div className="hidden md:flex flex-col text-right pr-1">
            <span className="text-xs font-bold text-slate-800 leading-tight">
              {formattedDateTime.split(' ').slice(0, 4).join(' ')}
            </span>
            <span className="text-[11px] font-semibold text-slate-500">
              {formattedDateTime.split(' ').slice(4).join(' ')}
            </span>
          </div>

          {/* Avatar Initials Pill */}
          <div
            onClick={() => navigate('/profile')}
            className="flex items-center gap-2 cursor-pointer p-1 liquid-glass-pill rounded-2xl hover:bg-white transition-all"
            title={displayName}
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black flex items-center justify-center text-xs shadow-md shadow-blue-500/20">
              {getInitials(displayName)}
            </div>
          </div>

          {/* Logout button */}
          <button
            onClick={handleLogout}
            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50/80 rounded-2xl transition-all cursor-pointer"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
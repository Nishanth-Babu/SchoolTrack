import React from 'react';
import { useNavigate } from 'react-router-dom';
import { School, ArrowRight, Bell, Sparkles } from 'lucide-react';

export default function QuoteBanner({ quote = "Education is not just about learning, it's about building a better tomorrow." }) {
  const navigate = useNavigate();

  return (
    <div className="relative overflow-hidden rounded-3xl p-4 md:p-5 bg-gradient-to-r from-slate-900/85 via-indigo-950/80 to-slate-900/85 text-white backdrop-blur-2xl border border-white/20 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-3.5 max-w-2xl">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-primary-500 to-indigo-500 flex items-center justify-center text-white shrink-0 shadow-md ring-2 ring-white/20">
          <School className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs md:text-sm font-semibold italic text-slate-100 tracking-wide">
            "{quote}"
          </p>
        </div>
      </div>

      <button
        onClick={() => navigate('/notifications')}
        className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer"
      >
        <Bell className="w-3.5 h-3.5 text-amber-300" />
        <span>View All Notifications</span>
        <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
      </button>
    </div>
  );
}

import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function StatCard({ title, value, subtitle, icon: Icon, color = 'blue', trend, onClick }) {
  const colorMap = {
    blue: {
      iconBg: 'bg-gradient-to-tr from-blue-500 to-indigo-600 text-white',
      accentBg: 'bg-blue-50/60 border-blue-200/60',
      iconBox: 'bg-blue-100 text-blue-700',
      trendColor: 'text-emerald-600 bg-emerald-50 border-emerald-100'
    },
    emerald: {
      iconBg: 'bg-gradient-to-tr from-emerald-500 to-teal-600 text-white',
      accentBg: 'bg-emerald-50/60 border-emerald-200/60',
      iconBox: 'bg-emerald-100 text-emerald-700',
      trendColor: 'text-emerald-600 bg-emerald-50 border-emerald-100'
    },
    purple: {
      iconBg: 'bg-gradient-to-tr from-purple-500 to-indigo-600 text-white',
      accentBg: 'bg-purple-50/60 border-purple-200/60',
      iconBox: 'bg-purple-100 text-purple-700',
      trendColor: 'text-purple-600 bg-purple-50 border-purple-100'
    },
    amber: {
      iconBg: 'bg-gradient-to-tr from-amber-500 to-orange-600 text-white',
      accentBg: 'bg-amber-50/60 border-amber-200/60',
      iconBox: 'bg-amber-100 text-amber-700',
      trendColor: 'text-amber-600 bg-amber-50 border-amber-100'
    },
    rose: {
      iconBg: 'bg-gradient-to-tr from-rose-500 to-pink-600 text-white',
      accentBg: 'bg-rose-50/60 border-rose-200/60',
      iconBox: 'bg-rose-100 text-rose-700',
      trendColor: 'text-rose-600 bg-rose-50 border-rose-100'
    },
    teal: {
      iconBg: 'bg-gradient-to-tr from-teal-500 to-cyan-600 text-white',
      accentBg: 'bg-teal-50/60 border-teal-200/60',
      iconBox: 'bg-teal-100 text-teal-700',
      trendColor: 'text-teal-600 bg-teal-50 border-teal-100'
    }
  };

  const scheme = colorMap[color] || colorMap.blue;

  return (
    <div
      onClick={onClick}
      className={`liquid-glass-interactive rounded-3xl p-5 flex flex-col justify-between space-y-3 font-sans relative overflow-hidden ${
        onClick ? 'cursor-pointer' : ''
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="space-y-1">
          <p className="text-[11px] font-bold text-slate-500 tracking-wide uppercase">{title}</p>
          <p className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">{value}</p>
        </div>

        {Icon && (
          <div className={`w-12 h-12 rounded-2xl ${scheme.iconBox} squircle-icon flex items-center justify-center shrink-0`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>

      <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200/40">
        {subtitle && (
          <p className="text-[11px] text-slate-500 font-medium truncate max-w-[70%]">
            {subtitle}
          </p>
        )}

        {trend ? (
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${trend.isPositive ? 'text-emerald-700 bg-emerald-50 border-emerald-200' : 'text-slate-600 bg-slate-100 border-slate-200'} ml-auto flex items-center gap-0.5`}>
            {trend.value}
          </span>
        ) : (
          <span className="text-[10px] text-slate-400 font-mono ml-auto">Active</span>
        )}
      </div>
    </div>
  );
}
import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Calendar, ChevronDown } from 'lucide-react';

export default function AttendancePieChart({ present = 756, absent = 48, onDuty = 18 }) {
  const [filterPeriod, setFilterPeriod] = useState('Today');

  const total = (present || 0) + (absent || 0) + (onDuty || 0);
  const effectivePresent = (present || 0) + (onDuty || 0);
  const percentage = total > 0 ? Math.round((effectivePresent / total) * 100) : 92;

  const data = [
    { name: 'Present', value: present || 756, color: '#10b981' },
    { name: 'Absent', value: absent || 48, color: '#f43f5e' },
    { name: 'OD', value: onDuty || 18, color: '#3b82f6' }
  ];

  const presentPct = total > 0 ? Math.round(((present || 756) / total) * 100) : 92;
  const absentPct = total > 0 ? Math.round(((absent || 48) / total) * 100) : 6;
  const onDutyPct = total > 0 ? Math.round(((onDuty || 18) / total) * 100) : 2;

  return (
    <div className="liquid-glass rounded-3xl p-5 flex flex-col justify-between space-y-4 font-sans h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-primary-600" />
          <h3 className="font-bold text-slate-800 text-sm">Attendance Overview</h3>
        </div>

        <button className="flex items-center gap-1.5 px-3 py-1 bg-white/70 hover:bg-white border border-white/80 rounded-xl text-xs font-bold text-slate-700 shadow-2xs transition-all cursor-pointer">
          <span>{filterPeriod}</span>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
        </button>
      </div>

      {/* Donut Chart with Centered KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center my-1">
        <div className="sm:col-span-7 h-48 relative flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                innerRadius={58}
                outerRadius={78}
                paddingAngle={3}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(15, 23, 42, 0.9)',
                  backdropFilter: 'blur(12px)',
                  borderRadius: '16px',
                  color: '#fff',
                  fontSize: '11px',
                  border: '1px solid rgba(255,255,255,0.15)',
                  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)'
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Centered KPI Rate */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-2xl font-black text-slate-900 leading-none tracking-tight">
              {percentage}%
            </span>
            <span className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">
              Overall Attendance
            </span>
          </div>
        </div>

        {/* Legend Breakdown List on the Right */}
        <div className="sm:col-span-5 space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-xs shadow-emerald-400/50" />
              <span className="font-semibold text-slate-600">Present</span>
            </div>
            <span className="font-bold text-slate-800 font-mono text-[11px]">{present} ({presentPct}%)</span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-xs shadow-rose-400/50" />
              <span className="font-semibold text-slate-600">Absent</span>
            </div>
            <span className="font-bold text-slate-800 font-mono text-[11px]">{absent} ({absentPct}%)</span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-xs shadow-blue-400/50" />
              <span className="font-semibold text-slate-600">OD</span>
            </div>
            <span className="font-bold text-slate-800 font-mono text-[11px]">{onDuty} ({onDutyPct}%)</span>
          </div>
        </div>
      </div>

      <div className="text-[10px] text-slate-400 text-center border-t border-slate-200/40 pt-2 font-medium">
        On Duty (OD) counts as 100% Present in institutional rate
      </div>
    </div>
  );
}
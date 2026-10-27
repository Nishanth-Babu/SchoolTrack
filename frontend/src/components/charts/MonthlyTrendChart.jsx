import React, { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { TrendingUp, ChevronDown } from 'lucide-react';

export default function MonthlyTrendChart({ data }) {
  const [timeRange, setTimeRange] = useState('Last 7 Days');

  const defaultData = [
    { date: '8 Apr', presentRate: 90, absentRate: 7, odRate: 3 },
    { date: '9 Apr', presentRate: 92, absentRate: 6, odRate: 2 },
    { date: '10 Apr', presentRate: 91, absentRate: 6, odRate: 3 },
    { date: '11 Apr', presentRate: 94, absentRate: 4, odRate: 2 },
    { date: '12 Apr', presentRate: 93, absentRate: 5, odRate: 2 },
    { date: '13 Apr', presentRate: 95, absentRate: 4, odRate: 1 },
    { date: '14 Apr', presentRate: 94, absentRate: 4, odRate: 2 }
  ];

  const chartData = data && data.length > 0 ? data.map((d) => ({
    date: d.monthName || d.date || 'Day',
    presentRate: d.percentage || d.presentRate || 92,
    absentRate: d.absentRate || 5,
    odRate: d.odRate || 3
  })) : defaultData;

  return (
    <div className="liquid-glass rounded-3xl p-5 flex flex-col justify-between space-y-4 font-sans h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-emerald-600" />
          <h3 className="font-bold text-slate-800 text-sm">Attendance Trend</h3>
        </div>

        <button className="flex items-center gap-1.5 px-3 py-1 bg-white/70 hover:bg-white border border-white/80 rounded-xl text-xs font-bold text-slate-700 shadow-2xs transition-all cursor-pointer">
          <span>{timeRange}</span>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
        </button>
      </div>

      {/* Responsive Line Chart */}
      <div className="h-52 w-full my-1">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(203, 213, 225, 0.4)" vertical={false} />
            <XAxis
              dataKey="date"
              stroke="#94a3b8"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              dy={5}
            />
            <YAxis
              stroke="#94a3b8"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              domain={[0, 100]}
              ticks={[0, 25, 50, 75, 100]}
              tickFormatter={(v) => `${v}%`}
            />
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
              formatter={(value, name) => [
                `${value}%`,
                name === 'presentRate' ? 'Present' : name === 'absentRate' ? 'Absent' : 'OD'
              ]}
            />
            <Line
              type="monotone"
              dataKey="presentRate"
              stroke="#10b981"
              strokeWidth={3}
              dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }}
              activeDot={{ r: 6, fill: '#10b981' }}
            />
            <Line
              type="monotone"
              dataKey="absentRate"
              stroke="#f43f5e"
              strokeWidth={2.5}
              dot={{ r: 3.5, fill: '#f43f5e', strokeWidth: 2, stroke: '#fff' }}
              activeDot={{ r: 5, fill: '#f43f5e' }}
            />
            <Line
              type="monotone"
              dataKey="odRate"
              stroke="#3b82f6"
              strokeWidth={2.5}
              dot={{ r: 3.5, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }}
              activeDot={{ r: 5, fill: '#3b82f6' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Bottom Legend */}
      <div className="flex items-center justify-center gap-6 pt-1 border-t border-slate-200/40 text-xs font-semibold text-slate-600">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Present
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Absent
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> OD
        </span>
      </div>
    </div>
  );
}
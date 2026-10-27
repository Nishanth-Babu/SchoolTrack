import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';

export default function ClassComparisonBarChart({ data = [] }) {
  const chartData =
    data.length > 0
      ? data
      : [
          { name: 'Class 10-A', percentage: 95.5 },
          { name: 'Class 10-B', percentage: 92.1 },
          { name: 'Class 9-A', percentage: 96.8 },
          { name: 'Class 9-B', percentage: 89.4 },
          { name: 'Class 8-A', percentage: 94.0 }
        ];

  const getColor = (pct) => {
    if (pct >= 95) return '#10b981';
    if (pct >= 90) return '#0284c7';
    if (pct >= 80) return '#f59e0b';
    return '#f43f5e';
  };

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800">Class Performance Comparison</h3>
          <span className="text-xs text-slate-400 font-medium">Daily / Weekly</span>
        </div>
        <p className="text-xs text-slate-400 mt-0.5">Effective attendance rate across sections</p>
      </div>

      <div className="h-56 my-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 11 }} />
            <YAxis
              domain={[60, 100]}
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#64748b', fontSize: 11 }}
              tickFormatter={(val) => `${val}%`}
            />
            <Tooltip
              formatter={(value) => [`${value}%`, 'Attendance Rate']}
              contentStyle={{
                backgroundColor: '#0f172a',
                borderRadius: '12px',
                color: '#fff',
                fontSize: '12px',
                border: 'none',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Bar dataKey="percentage" radius={[8, 8, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getColor(entry.percentage)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span>Highest: <strong className="text-emerald-600">Class 9-A (96.8%)</strong></span>
        <span>Needs Attention: <strong className="text-rose-600">&lt; 90%</strong></span>
      </div>
    </div>
  );
}
import React from 'react';

export default function Badge({ children, status = 'default', size = 'sm', className = '' }) {
  const statusStyles = {
    present: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    absent: 'bg-rose-50 text-rose-700 border-rose-200',
    onDuty: 'bg-purple-50 text-purple-700 border-purple-200',
    pending: 'bg-amber-50 text-amber-700 border-amber-200',
    approved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    rejected: 'bg-rose-50 text-rose-700 border-rose-200',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    danger: 'bg-rose-50 text-rose-700 border-rose-200',
    info: 'bg-blue-50 text-blue-700 border-blue-200',
    default: 'bg-slate-100 text-slate-700 border-slate-200',
  };

  const sizeStyles = {
    xs: 'px-2 py-0.5 text-[10px]',
    sm: 'px-2.5 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
  };

  const resolvedStatus = statusStyles[status] || statusStyles.default;
  const resolvedSize = sizeStyles[size] || sizeStyles.sm;

  return (
    <span className={`inline-flex items-center gap-1 font-semibold rounded-full border ${resolvedStatus} ${resolvedSize} ${className}`}>
      {children}
    </span>
  );
}
import React from 'react';

export default function SkeletonLoader({ type = 'card', count = 1 }) {
  const renderItem = (index) => {
    switch (type) {
      case 'card':
        return (
          <div key={index} className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs animate-pulse space-y-4">
            <div className="flex justify-between items-center">
              <div className="h-4 bg-slate-200 rounded w-24"></div>
              <div className="w-10 h-10 bg-slate-200 rounded-xl"></div>
            </div>
            <div className="h-8 bg-slate-200 rounded w-32"></div>
            <div className="h-3 bg-slate-200 rounded w-48"></div>
          </div>
        );
      case 'table':
        return (
          <div key={index} className="space-y-3 animate-pulse">
            <div className="h-10 bg-slate-200 rounded-lg w-full"></div>
            <div className="h-12 bg-slate-100 rounded-lg w-full"></div>
            <div className="h-12 bg-slate-100 rounded-lg w-full"></div>
            <div className="h-12 bg-slate-100 rounded-lg w-full"></div>
          </div>
        );
      case 'list':
        return (
          <div key={index} className="flex items-center gap-4 p-4 bg-white rounded-xl border border-slate-100 animate-pulse">
            <div className="w-10 h-10 bg-slate-200 rounded-full shrink-0"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-slate-200 rounded w-1/3"></div>
              <div className="h-3 bg-slate-100 rounded w-2/3"></div>
            </div>
          </div>
        );
      case 'dashboard':
      default:
        return (
          <div key={index} className="space-y-6 animate-pulse">
            <div className="h-24 bg-slate-200 rounded-2xl w-full"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="h-32 bg-slate-200 rounded-2xl"></div>
              <div className="h-32 bg-slate-200 rounded-2xl"></div>
              <div className="h-32 bg-slate-200 rounded-2xl"></div>
              <div className="h-32 bg-slate-200 rounded-2xl"></div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="h-64 bg-slate-200 rounded-2xl"></div>
              <div className="h-64 bg-slate-200 rounded-2xl"></div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className={type === 'card' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4' : 'space-y-4'}>
      {Array.from({ length: count }).map((_, i) => renderItem(i))}
    </div>
  );
}
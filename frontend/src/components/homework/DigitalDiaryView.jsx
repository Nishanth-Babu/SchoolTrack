import React from 'react';
import confetti from 'canvas-confetti';
import { homeworkService } from '../../services';
import Badge from '../common/Badge';
import {
  BookOpen,
  Calendar,
  Clock,
  CheckCircle2,
  Circle,
  AlertCircle,
  Sparkles,
  UserCheck
} from 'lucide-react';

export default function DigitalDiaryView({ homeworkList = [], studentId, onStatusChange, isStudent = true }) {
  if (!homeworkList || homeworkList.length === 0) {
    return (
      <div className="p-8 text-center text-slate-400 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
        <BookOpen className="w-10 h-10 mx-auto mb-2 text-slate-300" />
        <p className="text-sm font-semibold text-slate-600">No homework assigned</p>
        <p className="text-xs text-slate-400 mt-1">All assignments are complete or not yet posted for today.</p>
      </div>
    );
  }

  const handleToggleComplete = async (item) => {
    if (!isStudent) return;
    const isCompleted = item.completionStatus === 'COMPLETED';
    const newStatus = isCompleted ? 'PENDING' : 'COMPLETED';

    try {
      if (!isCompleted) {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 }
        });
      }

      await homeworkService.updateCompletionStatus(item.id, studentId || undefined, {
        status: newStatus
      });

      if (onStatusChange) onStatusChange();
    } catch (err) {
      console.error('Failed to update homework status:', err);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {homeworkList.map((item) => {
          const isCompleted = item.completionStatus === 'COMPLETED';
          const isOverdue = new Date(item.dueDate) < new Date() && !isCompleted;

          return (
            <div
              key={item.id}
              className={`p-5 rounded-2xl border transition-all duration-300 flex flex-col justify-between ${
                isCompleted
                  ? 'bg-emerald-50/30 border-emerald-200 shadow-2xs'
                  : isOverdue
                  ? 'bg-rose-50/30 border-rose-200 shadow-xs'
                  : 'bg-white border-slate-200 shadow-xs hover:shadow-md'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold bg-primary-100 text-primary-800">
                      {item.subjectName || 'General Subject'}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      {item.className || 'Class 10-A'}
                    </span>
                  </div>

                  {isCompleted ? (
                    <Badge status="success">Completed</Badge>
                  ) : isOverdue ? (
                    <Badge status="danger">Overdue</Badge>
                  ) : (
                    <Badge status="warning">Pending</Badge>
                  )}
                </div>

                <h4 className={`text-base font-bold text-slate-800 mb-1 ${isCompleted ? 'line-through text-slate-500' : ''}`}>
                  {item.title}
                </h4>

                <p className="text-xs text-slate-600 leading-relaxed mb-4 whitespace-pre-line">
                  {item.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-1.5 text-slate-500 font-medium">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>Due: <strong className="text-slate-700">{item.dueDate}</strong></span>
                </div>

                {isStudent ? (
                  <button
                    onClick={() => handleToggleComplete(item)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs ${
                      isCompleted
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        : 'bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 border border-slate-200'
                    }`}
                  >
                    {isCompleted ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" /> Done
                      </>
                    ) : (
                      <>
                        <Circle className="w-3.5 h-3.5" /> Mark Completed
                      </>
                    )}
                  </button>
                ) : (
                  <span className="text-[11px] text-slate-400">Teacher: {item.teacherName || 'Faculty'}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
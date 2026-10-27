import React from 'react';
import Badge from '../common/Badge';
import { Calendar, User, ArrowRight, Edit3, Trash2, Pin, ShieldCheck } from 'lucide-react';

export default function NewsCard({ news, onReadMore, onEdit, onDelete }) {
  if (!news) return null;

  const getCategoryBadge = (category) => {
    switch (category) {
      case 'ACADEMIC':
        return 'info';
      case 'EVENT':
        return 'success';
      case 'SPORTS':
        return 'onDuty';
      case 'EXAM':
        return 'warning';
      case 'EMERGENCY':
        return 'danger';
      default:
        return 'neutral';
    }
  };

  const formattedDate = news.publishedAt || news.createdAt
    ? new Date(news.publishedAt || news.createdAt).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    : 'Recent';

  return (
    <div className="liquid-glass rounded-3xl p-5 shadow-lg border border-white/90 hover:shadow-xl transition-all flex flex-col justify-between group">
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5">
            <Badge variant={getCategoryBadge(news.category)}>
              {news.category || 'GENERAL'}
            </Badge>

            {news.isPinned && (
              <span className="p-1 bg-amber-50 text-amber-600 rounded-lg text-[10px] font-bold border border-amber-200 flex items-center gap-1">
                <Pin className="w-3 h-3" /> Pinned
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            {onEdit && (
              <button
                onClick={() => onEdit(news)}
                className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all cursor-pointer"
                title="Edit Announcement"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(news)}
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all cursor-pointer"
                title="Delete Announcement"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {news.imageUrl && (
          <div className="mb-3 rounded-2xl overflow-hidden h-36 bg-slate-100 border border-slate-200/80">
            <img
              src={news.imageUrl}
              alt={news.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          </div>
        )}

        <h3
          className="font-black text-slate-900 text-sm mb-2 line-clamp-2 hover:text-indigo-600 transition-colors cursor-pointer tracking-tight"
          onClick={() => onReadMore(news)}
        >
          {news.title}
        </h3>

        <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-4 font-normal">
          {news.description || news.content}
        </p>
      </div>

      <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between gap-2 text-xs text-slate-400">
        <div className="flex items-center gap-2 truncate">
          <span className="flex items-center gap-1 font-semibold text-slate-700 truncate">
            <User className="w-3 h-3 text-slate-400 shrink-0" />
            <span className="truncate">{news.authorName || 'School Administration'}</span>
          </span>
          <span>&bull;</span>
          <span className="flex items-center gap-1 text-[11px] shrink-0 font-mono text-slate-400">
            <Calendar className="w-3 h-3 text-slate-400" />
            <span>{formattedDate}</span>
          </span>
        </div>

        <button
          onClick={() => onReadMore(news)}
          className="text-indigo-600 hover:text-indigo-800 font-bold text-xs flex items-center gap-1 shrink-0 cursor-pointer"
        >
          Read <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
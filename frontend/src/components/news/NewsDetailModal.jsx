import React from 'react';
import Modal from '../common/Modal';
import Badge from '../common/Badge';
import { Calendar, User, Tag, ExternalLink, ShieldCheck, Clock } from 'lucide-react';

export default function NewsDetailModal({ isOpen, onClose, news }) {
  if (!news) return null;

  const formattedDate = news.publishedAt || news.createdAt
    ? new Date(news.publishedAt || news.createdAt).toLocaleString(undefined, {
        dateStyle: 'medium',
        timeStyle: 'short'
      })
    : 'Recently Published';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={news.title} size="lg">
      <div className="space-y-4 font-sans">
        {/* Author info and badge header */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-200/80 text-xs text-slate-500">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 font-bold text-slate-800">
              <div className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-black text-xs">
                {(news.authorName || 'S').charAt(0)}
              </div>
              <span>{news.authorName || 'School Administration'}</span>
              {news.authorRole && (
                <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-mono text-[10px] border border-indigo-200">
                  {news.authorRole}
                </span>
              )}
            </span>
            <span>&bull;</span>
            <span className="flex items-center gap-1 font-mono text-slate-400">
              <Clock className="w-3.5 h-3.5" />
              <span>{formattedDate}</span>
            </span>
          </div>

          <Badge variant="info">{news.category || 'GENERAL'}</Badge>
        </div>

        {/* Optional Image Banner */}
        {news.imageUrl && (
          <div className="rounded-2xl overflow-hidden max-h-72 bg-slate-100 border border-slate-200">
            <img
              src={news.imageUrl}
              alt={news.title}
              className="w-full h-full object-cover"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          </div>
        )}

        {/* Announcement Body */}
        <div className="text-xs text-slate-700 leading-relaxed whitespace-pre-line py-2">
          {news.description || news.content}
        </div>

        {/* Attachment URL link if present */}
        {news.attachmentUrl && (
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600">Attached Document / Circular:</span>
            <a
              href={news.attachmentUrl}
              target="_blank"
              rel="noreferrer"
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              <span>Download / Open Document</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        )}

        <div className="flex justify-end pt-3 border-t border-slate-200/80">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
}
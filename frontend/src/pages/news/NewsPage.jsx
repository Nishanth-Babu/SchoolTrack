import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { newsService } from '../../services';
import NewsCard from '../../components/news/NewsCard';
import CreateNewsModal from '../../components/news/CreateNewsModal';
import NewsDetailModal from '../../components/news/NewsDetailModal';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import {
  Newspaper,
  Plus,
  Search,
  Filter,
  Tag,
  Sparkles,
  Megaphone,
  CheckCircle2,
  Users,
  ShieldCheck,
  Award
} from 'lucide-react';

export default function NewsPage() {
  const { user, role: stateRole } = useSelector((state) => state.auth);
  const effectiveRole = user?.role || user?.primaryRole || stateRole || (user?.roles && user.roles[0]);

  // Authorization: Only authorized bodies (Principal, Coordinator, Class Teacher, Subject Teacher) can post/edit/delete news.
  // Students and Parents CANNOT post news, but can view all news announcements.
  const canPostNews = ['PRINCIPAL', 'COORDINATOR', 'CLASS_TEACHER', 'SUBJECT_TEACHER'].includes(effectiveRole);

  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  // Modals
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingNews, setEditingNews] = useState(null);
  const [viewingNews, setViewingNews] = useState(null);
  const [successToast, setSuccessToast] = useState('');

  const categories = [
    { label: 'All Bulletins', value: 'ALL' },
    { label: 'Academic', value: 'ACADEMIC' },
    { label: 'Events & Functions', value: 'EVENT' },
    { label: 'Sports & Athletics', value: 'SPORTS' },
    { label: 'Examinations', value: 'EXAM' },
    { label: 'General Circulars', value: 'GENERAL' },
    { label: 'Emergency Alerts', value: 'EMERGENCY' }
  ];

  useEffect(() => {
    fetchNews();
  }, [selectedCategory]);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const data = await newsService.getAllNews(selectedCategory === 'ALL' ? undefined : selectedCategory);
      setNewsList(data || []);
    } catch (err) {
      console.error('Failed to load news:', err);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(''), 4000);
  };

  const handleDeleteNews = async (id) => {
    if (!window.confirm('Are you sure you want to remove this official announcement?')) return;
    try {
      await newsService.deleteNews(id);
      showToast('Announcement removed successfully.');
      fetchNews();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete news.');
    }
  };

  const filteredNews = newsList.filter((item) => {
    const text = (item.title + ' ' + (item.description || item.content || '')).toLowerCase();
    return text.includes(searchQuery.toLowerCase());
  });

  return (
    <div className="space-y-6 pb-12 animate-fade-in font-sans">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 p-4 bg-emerald-600 text-white rounded-2xl shadow-xl flex items-center gap-3 animate-bounce">
          <CheckCircle2 className="w-5 h-5" />
          <span className="text-xs font-bold">{successToast}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="liquid-glass p-6 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
              School-Wide Circular Board
            </span>
            <span className="px-3 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> All Campus Roles
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <Newspaper className="w-7 h-7 text-indigo-600" />
            School News & Announcements
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Official announcements, examination dates, circulars, and notifications from school leadership and faculty.
          </p>
        </div>

        {canPostNews && (
          <button
            onClick={() => {
              setEditingNews(null);
              setIsCreateOpen(true);
            }}
            className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-500/20 hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Post New Announcement</span>
          </button>
        )}
      </div>

      {/* Search and Category Filter Toolbar */}
      <div className="liquid-glass p-4 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search circulars by title, keyword, or content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="liquid-glass-input w-full pl-10 pr-4 py-2 text-xs font-semibold text-slate-800"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto p-1 bg-slate-100/90 rounded-2xl border border-slate-200">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                selectedCategory === cat.value
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-sm font-black'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* News Grid */}
      {loading ? (
        <SkeletonLoader type="card" count={6} />
      ) : filteredNews.length === 0 ? (
        <div className="liquid-glass p-16 text-center rounded-3xl text-slate-400 border border-white/90">
          <Megaphone className="w-12 h-12 mx-auto mb-3 opacity-30 text-slate-400" />
          <p className="text-base font-bold text-slate-700">No Announcements Found</p>
          <p className="text-xs text-slate-400 mt-1">
            {searchQuery ? 'Try clearing your search terms or select another category.' : 'No circulars published under this category yet.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNews.map((item) => (
            <NewsCard
              key={item.id}
              news={item}
              onReadMore={(n) => setViewingNews(n)}
              onEdit={
                canPostNews
                  ? (n) => {
                      setEditingNews(n);
                      setIsCreateOpen(true);
                    }
                  : undefined
              }
              onDelete={canPostNews ? (n) => handleDeleteNews(n.id) : undefined}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <CreateNewsModal
        isOpen={isCreateOpen}
        onClose={() => {
          setIsCreateOpen(false);
          setEditingNews(null);
        }}
        onSuccess={() => {
          showToast(editingNews ? 'Announcement updated!' : 'New announcement published!');
          fetchNews();
        }}
        editData={editingNews}
      />

      <NewsDetailModal
        isOpen={!!viewingNews}
        onClose={() => setViewingNews(null)}
        news={viewingNews}
      />
    </div>
  );
}

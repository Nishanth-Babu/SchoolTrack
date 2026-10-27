import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import { newsService } from '../../services';
import { Newspaper, AlertCircle, Plus, Sparkles, Image, Link, FileText } from 'lucide-react';

export default function CreateNewsModal({ isOpen, onClose, onSuccess, editData }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'GENERAL',
    priority: 'MEDIUM',
    imageUrl: '',
    attachmentUrl: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (editData) {
      setFormData({
        title: editData.title || '',
        description: editData.description || editData.content || '',
        category: editData.category || 'GENERAL',
        priority: editData.priority || 'MEDIUM',
        imageUrl: editData.imageUrl || '',
        attachmentUrl: editData.attachmentUrl || ''
      });
    } else {
      setFormData({
        title: '',
        description: '',
        category: 'GENERAL',
        priority: 'MEDIUM',
        imageUrl: '',
        attachmentUrl: ''
      });
    }
  }, [editData, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');

      const payload = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        priority: formData.priority,
        imageUrl: formData.imageUrl || null,
        attachmentUrl: formData.attachmentUrl || null
      };

      if (editData?.id) {
        await newsService.updateNews(editData.id, payload);
      } else {
        await newsService.createNews(payload);
      }
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to publish announcement.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editData ? 'Edit Official Announcement' : 'Post Official School Announcement'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Category *</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="liquid-glass-input w-full px-3 py-2 text-xs font-semibold"
            >
              <option value="GENERAL">General Notice</option>
              <option value="ACADEMIC">Academic / Curriculum</option>
              <option value="EVENT">School Event / Celebration</option>
              <option value="SPORTS">Sports & Athletics</option>
              <option value="EXAM">Examinations & Assessments</option>
              <option value="EMERGENCY">Emergency / Urgent Alert</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Priority Level</label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              className="liquid-glass-input w-full px-3 py-2 text-xs font-semibold"
            >
              <option value="LOW">Low (Regular Information)</option>
              <option value="MEDIUM">Medium (Standard)</option>
              <option value="HIGH">High (Important Notice)</option>
              <option value="URGENT">Urgent (Immediate Action)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Announcement Title *</label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g. Annual Inter-School Science Fair & Exhibition 2025"
            className="liquid-glass-input w-full px-3 py-2 text-xs font-bold"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Content & Circular Guidelines *</label>
          <textarea
            rows={5}
            required
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Write full circular instructions, timing, venue, guidelines for students and parents..."
            className="liquid-glass-input w-full px-3 py-2 text-xs leading-relaxed resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
              <Image className="w-3.5 h-3.5 text-indigo-500" />
              Image Banner URL (Optional)
            </label>
            <input
              type="url"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              placeholder="https://images.unsplash.com/..."
              className="liquid-glass-input w-full px-3 py-2 text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
              <Link className="w-3.5 h-3.5 text-indigo-500" />
              Document / Circular Link (Optional)
            </label>
            <input
              type="url"
              value={formData.attachmentUrl}
              onChange={(e) => setFormData({ ...formData, attachmentUrl: e.target.value })}
              placeholder="https://schooltrack.internal/docs/circular.pdf"
              className="liquid-glass-input w-full px-3 py-2 text-xs"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2 text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-xl shadow-md shadow-indigo-500/20 flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{loading ? 'Publishing...' : editData ? 'Update Announcement' : 'Publish Announcement'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
}
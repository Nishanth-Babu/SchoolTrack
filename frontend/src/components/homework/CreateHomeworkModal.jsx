import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import { homeworkService, classService } from '../../services';
import { BookOpen, Calendar, AlertCircle } from 'lucide-react';

export default function CreateHomeworkModal({ isOpen, onClose, onSuccess, initialClassId }) {
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [formData, setFormData] = useState({
    classId: initialClassId || '',
    subjectId: '',
    title: '',
    description: '',
    dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchClasses();
      fetchAllSubjects();
    }
  }, [isOpen]);

  useEffect(() => {
    if (initialClassId) {
      setFormData((prev) => ({ ...prev, classId: initialClassId }));
    }
  }, [initialClassId]);

  const fetchClasses = async () => {
    try {
      const data = await classService.getAllClasses();
      setClasses(data);
      if (!formData.classId && data.length > 0) {
        setFormData((prev) => ({ ...prev, classId: data[0].id }));
      }
    } catch (err) {
      console.error('Failed to load classes:', err);
    }
  };

  const fetchAllSubjects = async () => {
    try {
      const data = await classService.getAllSubjects();
      setSubjects(data);
      if (!formData.subjectId && data.length > 0) {
        setFormData((prev) => ({ ...prev, subjectId: data[0].id }));
      }
    } catch (err) {
      console.error('Failed to load subjects:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      await homeworkService.createHomework(formData);
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create homework assignment.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Homework Assignment"
      subtitle="Publish assignment directly to students' interactive Digital Diaries"
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Target Class</label>
            <select
              value={formData.classId}
              onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-primary-500 focus:outline-none"
              required
            >
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  Class {c.name} - Section {c.section}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Subject</label>
            <select
              value={formData.subjectId}
              onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-primary-500 focus:outline-none"
              required
            >
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.code})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Assignment Title</label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g. Chapter 4: Quadratic Equations Exercises 4.1 to 4.3"
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-primary-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Due Date</label>
          <input
            type="date"
            required
            value={formData.dueDate}
            min={new Date().toISOString().split('T')[0]}
            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-primary-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Detailed Description & Instructions</label>
          <textarea
            rows={4}
            required
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Provide complete guidelines, textbook problem numbers, and submission instructions..."
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-primary-500 focus:outline-none resize-none"
          />
        </div>

        <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 text-xs font-bold text-white bg-primary-600 hover:bg-primary-700 rounded-lg shadow-sm"
          >
            {loading ? 'Publishing...' : 'Publish to Digital Diary'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
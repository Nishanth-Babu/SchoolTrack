import React, { useState, useEffect } from 'react';
import { teacherService } from '../../services';
import Modal from '../../components/common/Modal';
import Badge from '../../components/common/Badge';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import { ShieldCheck, Plus, UserCheck, Mail, Phone, Search, AlertCircle, Sparkles } from 'lucide-react';

export default function CoordinatorManagement() {
  const [coordinators, setCoordinators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: 'High School',
    employeeId: ''
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    fetchCoordinators();
  }, []);

  const fetchCoordinators = async () => {
    try {
      setLoading(true);
      const data = await teacherService.getAllTeachers('COORDINATOR');
      setCoordinators(data);
    } catch (err) {
      console.error('Failed to load coordinators:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      setFormLoading(true);
      setFormError('');
      await teacherService.createCoordinator({
        ...formData,
        password: 'password123'
      });
      setIsAddModalOpen(false);
      setFormData({ name: '', email: '', phone: '', department: 'High School', employeeId: '' });
      fetchCoordinators();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to create coordinator.');
    } finally {
      setFormLoading(false);
    }
  };

  const filtered = coordinators.filter((c) => {
    const cName = c.fullName || c.name || `${c.firstName || ''} ${c.lastName || ''}`.trim();
    return (
      (cName && cName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (c.email && c.email.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  return (
    <div className="space-y-6 pb-12 animate-fade-in font-sans">
      {/* Header Banner */}
      <div className="liquid-glass p-6 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-white/90 shadow-lg">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-purple-50 text-purple-800 border border-purple-200 shadow-2xs">
              Academic Wing Superintendents
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <ShieldCheck className="w-7 h-7 text-purple-600" />
            Academic Coordinators Directory
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Stage 3 Final Leave Approvers, Level Superintendents, and Academic Officers.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-purple-500/20 transition-all flex items-center gap-2 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          Add Coordinator
        </button>
      </div>

      {/* Search Bar */}
      <div className="liquid-glass p-5 rounded-3xl border border-white/90 shadow-lg">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search coordinators by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="liquid-glass-input w-full pl-10 pr-4 py-2 text-xs font-semibold text-slate-800"
          />
        </div>
      </div>

      {/* Coordinators Table */}
      <div className="liquid-glass rounded-3xl shadow-lg border border-white/90 overflow-hidden">
        {loading ? (
          <div className="p-6">
            <SkeletonLoader type="table" count={4} />
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-16 text-center text-slate-400">
            <UserCheck className="w-12 h-12 mx-auto mb-2 text-slate-300" />
            <p className="text-base font-bold text-slate-700">No coordinators found</p>
            <p className="text-xs text-slate-500 mt-1">Add a new coordinator to manage academic level leaves.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-100/80 text-[11px] font-bold text-slate-800 uppercase tracking-wider">
                  <th className="py-3.5 px-5">Coordinator</th>
                  <th className="py-3.5 px-5">Contact</th>
                  <th className="py-3.5 px-5">Employee ID</th>
                  <th className="py-3.5 px-5">Department / Level</th>
                  <th className="py-3.5 px-5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-800 border border-purple-200 flex items-center justify-center font-black text-sm shadow-2xs">
                          {(item.fullName || item.name || item.firstName || 'C').charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 text-xs">
                            {item.fullName || item.name || `${item.firstName || ''} ${item.lastName || ''}`.trim() || 'Coordinator'}
                          </div>
                          <div className="text-[11px] text-purple-700 font-semibold">Wing Coordinator</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-5 text-slate-700 space-y-0.5">
                      <div className="flex items-center gap-1.5 font-medium">
                        <Mail className="w-3.5 h-3.5 text-slate-500" />
                        <span>{item.email}</span>
                      </div>
                      {item.phone && (
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-600">
                          <Phone className="w-3.5 h-3.5 text-slate-500" />
                          <span>{item.phone}</span>
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 px-5 font-mono font-bold text-slate-700">
                      {item.teacherId || item.employeeId || `EMP-${item.id}`}
                    </td>

                    <td className="py-3.5 px-5">
                      <span className="font-bold text-purple-800 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200 text-xs">
                        {item.assignedWing || item.department || 'Senior Secondary Wing'}
                      </span>
                    </td>

                    <td className="py-3.5 px-5">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        ACTIVE
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Coordinator Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Academic Coordinator"
        size="md"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          {formError && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2 font-semibold">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Dr. Anand Sharma"
              className="liquid-glass-input w-full px-3 py-2 text-xs font-semibold text-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="coordinator@schooltrack.com"
              className="liquid-glass-input w-full px-3 py-2 text-xs font-semibold text-slate-800"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+1-555-0199"
                className="liquid-glass-input w-full px-3 py-2 text-xs font-semibold text-slate-800"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Department / Wing</label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="liquid-glass-input w-full px-3 py-2 text-xs font-bold text-slate-800"
              >
                <option value="Senior Secondary Wing">Senior Secondary Wing</option>
                <option value="Secondary Wing">Secondary Wing</option>
                <option value="Middle School Wing">Middle School Wing</option>
                <option value="Primary Wing">Primary Wing</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={formLoading}
              className="px-5 py-2 text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 rounded-xl shadow-md transition-all cursor-pointer"
            >
              {formLoading ? 'Creating...' : 'Create Coordinator'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

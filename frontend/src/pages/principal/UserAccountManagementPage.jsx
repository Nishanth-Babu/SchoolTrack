import React, { useState, useEffect } from 'react';
import { adminAccountService, classService } from '../../services';
import Modal from '../../components/common/Modal';
import Badge from '../../components/common/Badge';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import {
  Users,
  ShieldCheck,
  UserCheck,
  Briefcase,
  GraduationCap,
  Plus,
  Search,
  KeyRound,
  Power,
  RefreshCw,
  Mail,
  Phone,
  Hash,
  School,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  Lock,
  UserPlus,
  Sparkles
} from 'lucide-react';

export default function UserAccountManagementPage() {
  const [activeTab, setActiveTab] = useState('COORDINATOR'); // 'COORDINATOR' | 'CLASS_TEACHER' | 'SUBJECT_TEACHER' | 'STUDENT' | 'PARENT'
  const [accounts, setAccounts] = useState([]);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isResetPassModalOpen, setIsResetPassModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [modalError, setModalError] = useState('');
  const [successToast, setSuccessToast] = useState('');

  // Form State for creating accounts
  const [formData, setFormData] = useState({
    role: 'COORDINATOR',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: 'password123',
    teacherId: '',
    wing: 'Senior Secondary Wing',
    classId: '',
    section: 'A',
    subjectId: '',
    rollNumber: '',
    parentName: '',
    parentPhone: '',
    studentRollNumber: '',
    relationshipType: 'FATHER'
  });

  useEffect(() => {
    fetchAccounts();
    fetchMetadata();
  }, [activeTab]);

  const fetchMetadata = async () => {
    try {
      const [classList, subjectList] = await Promise.all([
        classService.getAllClasses().catch(() => []),
        classService.getAllSubjects().catch(() => [])
      ]);
      setClasses(classList);
      setSubjects(subjectList);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const data = await adminAccountService.getAccountsByRole(activeTab);
      setAccounts(data || []);
    } catch (err) {
      console.error('Failed to load accounts for role:', activeTab, err);
      setAccounts([]);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(''), 4000);
  };

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    try {
      setActionLoading(true);
      setModalError('');

      const payload = {
        role: activeTab,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password || 'password123',
        teacherId: formData.teacherId,
        wing: formData.wing,
        classId: formData.classId ? Number(formData.classId) : undefined,
        subjectId: formData.subjectId ? Number(formData.subjectId) : undefined,
        rollNumber: formData.rollNumber,
        parentName: formData.parentName,
        parentPhone: formData.parentPhone,
        studentRollNumber: formData.studentRollNumber,
        relationshipType: formData.relationshipType
      };

      await adminAccountService.createAccount(payload);
      showToast(`${activeTab.replace('_', ' ')} account created successfully!`);
      setIsCreateModalOpen(false);
      setFormData({
        role: activeTab,
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: 'password123',
        teacherId: '',
        wing: 'Senior Secondary Wing',
        classId: '',
        section: 'A',
        subjectId: '',
        rollNumber: '',
        parentName: '',
        parentPhone: '',
        studentRollNumber: '',
        relationshipType: 'FATHER'
      });
      fetchAccounts();
    } catch (err) {
      setModalError(err.response?.data?.message || 'Failed to provision account.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleStatus = async (user) => {
    const nextStatus = user.status === 'ACTIVE' ? 'DISABLED' : 'ACTIVE';
    try {
      await adminAccountService.updateStatus(user.id, nextStatus);
      showToast(`Account status updated to ${nextStatus}`);
      fetchAccounts();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update account status.');
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!selectedUser || !newPassword) return;
    try {
      setActionLoading(true);
      await adminAccountService.resetPassword(selectedUser.id, newPassword);
      showToast(`Password successfully reset for ${selectedUser.fullName}`);
      setIsResetPassModalOpen(false);
      setSelectedUser(null);
      setNewPassword('');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to reset password.');
    } finally {
      setActionLoading(false);
    }
  };

  const filteredAccounts = accounts.filter((acc) => {
    const matchesSearch =
      (acc.fullName && acc.fullName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (acc.email && acc.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (acc.teacherId && acc.teacherId.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (acc.rollNumber && acc.rollNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (acc.phone && acc.phone.includes(searchQuery));

    const matchesStatus = statusFilter === 'ALL' || acc.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const tabs = [
    { id: 'COORDINATOR', name: 'Coordinators', icon: ShieldCheck, color: 'text-purple-600 bg-purple-50 border-purple-200' },
    { id: 'CLASS_TEACHER', name: 'Class Teachers', icon: UserCheck, color: 'text-blue-600 bg-blue-50 border-blue-200' },
    { id: 'SUBJECT_TEACHER', name: 'Subject Teachers', icon: Briefcase, color: 'text-indigo-600 bg-indigo-50 border-indigo-200' },
    { id: 'STUDENT', name: 'Students', icon: GraduationCap, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
    { id: 'PARENT', name: 'Parents', icon: Users, color: 'text-teal-600 bg-teal-50 border-teal-200' }
  ];

  return (
    <div className="space-y-6 animate-fade-in font-sans">
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
            <span className="px-3 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-full text-xs font-bold uppercase tracking-wider">
              Principal Sole Authority Console
            </span>
            <span className="px-3 py-0.5 bg-purple-50 text-purple-700 border border-purple-200 rounded-full text-xs font-semibold flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> BCrypt 12-Rounds
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            User & Account Management
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Provision staff, student, and parent identities, enforce BCrypt credential security, and manage institutional access.
          </p>
        </div>

        <button
          onClick={() => {
            setModalError('');
            setIsCreateModalOpen(true);
          }}
          className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-500/20 hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          <span>Provision {tabs.find((t) => t.id === activeTab)?.name.slice(0, -1)}</span>
        </button>
      </div>

      {/* Role Switcher Tab Pills */}
      <div className="liquid-glass p-2 rounded-3xl flex overflow-x-auto gap-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setSearchQuery('');
              }}
              className={`flex-1 min-w-[140px] py-2.5 px-4 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2.5 cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/20 scale-102 font-black'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <div className={`p-1 rounded-xl ${isActive ? 'bg-white/20 text-white' : tab.color}`}>
                <Icon className="w-3.5 h-3.5" />
              </div>
              <span>{tab.name}</span>
            </button>
          );
        })}
      </div>

      {/* Search & Filter Bar */}
      <div className="liquid-glass p-4 rounded-3xl grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
        <div className="relative sm:col-span-2">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search ${tabs.find((t) => t.id === activeTab)?.name} by name, identifier, email, phone...`}
            className="liquid-glass-input w-full pl-10 pr-4 py-2 text-xs font-semibold text-slate-800"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-600">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="liquid-glass-input flex-1 px-3 py-2 text-xs font-bold text-slate-700"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">ACTIVE</option>
            <option value="DISABLED">DISABLED</option>
            <option value="DEACTIVATED">DEACTIVATED</option>
          </select>
        </div>
      </div>

      {/* Data Table */}
      <div className="liquid-glass rounded-3xl shadow-lg border border-white/90 overflow-hidden">
        {loading ? (
          <div className="p-6">
            <SkeletonLoader type="table" count={5} />
          </div>
        ) : filteredAccounts.length === 0 ? (
          <div className="p-16 text-center text-slate-400">
            <Users className="w-12 h-12 mx-auto mb-3 opacity-30 text-slate-400" />
            <p className="font-bold text-sm text-slate-700">No {tabs.find((t) => t.id === activeTab)?.name} found</p>
            <p className="text-xs text-slate-400 mt-1">
              Click the "Provision" button above to add the first record.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100/80 border-b border-slate-200 text-[11px] font-bold text-slate-800 uppercase tracking-wider">
                  <th className="py-3.5 px-5">User Details</th>
                  <th className="py-3.5 px-5">Identifier</th>
                  <th className="py-3.5 px-5">Contact Info</th>
                  <th className="py-3.5 px-5">Role Assignment</th>
                  <th className="py-3.5 px-5">Account Status</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredAccounts.map((acc) => (
                  <tr key={acc.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-5">
                      <div className="font-bold text-slate-900 text-xs">{acc.fullName}</div>
                      <div className="text-[11px] text-slate-500 font-medium">{acc.username}</div>
                    </td>
                    <td className="py-3.5 px-5">
                      {acc.teacherId && (
                        <span className="px-2.5 py-0.5 bg-slate-100 border border-slate-200 rounded-lg font-mono text-[11px] font-bold text-slate-800">
                          {acc.teacherId}
                        </span>
                      )}
                      {acc.rollNumber && (
                        <span className="px-2.5 py-0.5 bg-emerald-50 border border-emerald-200 rounded-lg font-mono text-[11px] font-bold text-emerald-800">
                          Roll: {acc.rollNumber}
                        </span>
                      )}
                      {!acc.teacherId && !acc.rollNumber && (
                        <span className="text-slate-600 text-[11px] font-mono font-medium">{acc.phone || 'N/A'}</span>
                      )}
                    </td>
                    <td className="py-3.5 px-5 text-slate-700">
                      <div className="flex items-center gap-1.5 font-semibold">
                        <Mail className="w-3.5 h-3.5 text-slate-500" />
                        <span>{acc.email}</span>
                      </div>
                      {acc.phone && (
                        <div className="flex items-center gap-1.5 mt-0.5 text-[11px] text-slate-600 font-medium">
                          <Phone className="w-3.5 h-3.5 text-slate-500" />
                          <span>{acc.phone}</span>
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-5">
                      <span className="px-3 py-1 bg-indigo-50 border border-indigo-200 text-indigo-800 rounded-xl text-[11px] font-bold shadow-2xs">
                        {acc.primaryRole || activeTab}
                      </span>
                    </td>
                    <td className="py-3.5 px-5">
                      <Badge
                        variant={
                          acc.status === 'ACTIVE'
                            ? 'success'
                            : acc.status === 'DISABLED'
                            ? 'warning'
                            : 'danger'
                        }
                      >
                        {acc.status || 'ACTIVE'}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Status Toggle */}
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(acc)}
                          title={acc.status === 'ACTIVE' ? 'Disable Account' : 'Activate Account'}
                          className={`p-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                            acc.status === 'ACTIVE'
                              ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                              : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                          }`}
                        >
                          <Power className="w-3.5 h-3.5" />
                        </button>

                        {/* Reset Password */}
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedUser(acc);
                            setNewPassword('');
                            setIsResetPassModalOpen(true);
                          }}
                          title="Reset Password"
                          className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 rounded-xl transition-all cursor-pointer"
                        >
                          <KeyRound className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL 1: CREATE ACCOUNT */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title={`Provision New ${tabs.find((t) => t.id === activeTab)?.name.slice(0, -1)}`}
      >
        <form onSubmit={handleCreateAccount} className="space-y-4">
          {modalError && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{modalError}</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">First Name *</label>
              <input
                type="text"
                required
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                placeholder="e.g. Ramesh"
                className="liquid-glass-input w-full px-3 py-2 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Last Name *</label>
              <input
                type="text"
                required
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                placeholder="e.g. Kumar"
                className="liquid-glass-input w-full px-3 py-2 text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email ID *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="ramesh@schooltrack.com"
                className="liquid-glass-input w-full px-3 py-2 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number *</label>
              <input
                type="text"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 98765 43210"
                className="liquid-glass-input w-full px-3 py-2 text-xs"
              />
            </div>
          </div>

          {/* Role specific inputs */}
          {(activeTab === 'COORDINATOR' || activeTab === 'CLASS_TEACHER' || activeTab === 'SUBJECT_TEACHER') && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Teacher ID *</label>
                <input
                  type="text"
                  required
                  value={formData.teacherId}
                  onChange={(e) => setFormData({ ...formData, teacherId: e.target.value })}
                  placeholder="e.g. EMP-ST-05"
                  className="liquid-glass-input w-full px-3 py-2 text-xs font-mono"
                />
              </div>
              {activeTab === 'COORDINATOR' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Assigned Wing</label>
                  <select
                    value={formData.wing}
                    onChange={(e) => setFormData({ ...formData, wing: e.target.value })}
                    className="liquid-glass-input w-full px-3 py-2 text-xs"
                  >
                    <option value="Senior Secondary Wing">Senior Secondary Wing</option>
                    <option value="High School Wing">High School Wing</option>
                    <option value="Middle School Wing">Middle School Wing</option>
                  </select>
                </div>
              )}
            </div>
          )}

          {activeTab === 'STUDENT' && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Roll Number *</label>
                  <input
                    type="text"
                    required
                    value={formData.rollNumber}
                    onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                    placeholder="e.g. 23AD001"
                    className="liquid-glass-input w-full px-3 py-2 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Assigned Class *</label>
                  <select
                    value={formData.classId}
                    onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
                    className="liquid-glass-input w-full px-3 py-2 text-xs"
                  >
                    <option value="">Select Class</option>
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>{c.name || `Grade ${c.grade}-${c.section}`}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Parent Name</label>
                  <input
                    type="text"
                    value={formData.parentName}
                    onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                    placeholder="Father/Mother Name"
                    className="liquid-glass-input w-full px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Parent Phone (for Absence Alert)</label>
                  <input
                    type="text"
                    value={formData.parentPhone}
                    onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                    placeholder="+91 98765 00000"
                    className="liquid-glass-input w-full px-3 py-2 text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'PARENT' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Student Roll Number to Link *</label>
                <input
                  type="text"
                  required
                  value={formData.studentRollNumber}
                  onChange={(e) => setFormData({ ...formData, studentRollNumber: e.target.value })}
                  placeholder="e.g. 01 or 23AD001"
                  className="liquid-glass-input w-full px-3 py-2 text-xs font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Relationship</label>
                <select
                  value={formData.relationshipType}
                  onChange={(e) => setFormData({ ...formData, relationshipType: e.target.value })}
                  className="liquid-glass-input w-full px-3 py-2 text-xs"
                >
                  <option value="FATHER">Father</option>
                  <option value="MOTHER">Mother</option>
                  <option value="GUARDIAN">Guardian</option>
                </select>
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Initial Password *</label>
            <input
              type="password"
              required
              minLength={6}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Min. 6 characters"
              className="liquid-glass-input w-full px-3 py-2 text-xs font-mono"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
              className="px-4 py-2 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={actionLoading}
              className="px-5 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-2 cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>{actionLoading ? 'Provisioning...' : 'Provision Account'}</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL 2: RESET PASSWORD */}
      <Modal
        isOpen={isResetPassModalOpen}
        onClose={() => setIsResetPassModalOpen(false)}
        title={`Reset Password for ${selectedUser?.fullName}`}
      >
        <form onSubmit={handleResetPassword} className="space-y-4">
          <p className="text-xs text-slate-500">
            Set a new secure password for this user. The password will be encrypted using BCrypt.
          </p>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">New Password *</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                minLength={6}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="liquid-glass-input w-full pl-9 pr-4 py-2 text-xs font-mono"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsResetPassModalOpen(false)}
              className="px-4 py-2 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={actionLoading}
              className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-2 cursor-pointer"
            >
              <KeyRound className="w-4 h-4" />
              <span>{actionLoading ? 'Updating...' : 'Update Password'}</span>
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

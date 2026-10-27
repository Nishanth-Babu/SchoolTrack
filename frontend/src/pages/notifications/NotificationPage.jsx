import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { notificationService } from '../../services';
import { fetchNotifications } from '../../store/slices/notificationSlice';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import {
  Bell,
  CheckCheck,
  Calendar,
  AlertTriangle,
  Info,
  Clock,
  Filter,
  CheckCircle2
} from 'lucide-react';

export default function NotificationPage() {
  const dispatch = useDispatch();
  const { notifications, loading } = useSelector((state) => state.notifications);
  const [filterUnread, setFilterUnread] = useState(false);

  useEffect(() => {
    dispatch(fetchNotifications(filterUnread));
  }, [dispatch, filterUnread]);

  const handleMarkAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      dispatch(fetchNotifications(filterUnread));
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      dispatch(fetchNotifications(filterUnread));
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'ABSENCE_ALERT':
        return <AlertTriangle className="w-5 h-5 text-rose-600" />;
      case 'LEAVE_STATUS':
        return <Calendar className="w-5 h-5 text-indigo-600" />;
      case 'HOMEWORK_ALERT':
        return <Clock className="w-5 h-5 text-amber-600" />;
      case 'NEWS_CIRCULAR':
      default:
        return <Info className="w-5 h-5 text-blue-600" />;
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Bell className="w-6 h-6 text-primary-600" />
            Notification Center
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Absence alerts, prior leave statuses, homework updates, and official circulars.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setFilterUnread(!filterUnread)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              filterUnread
                ? 'bg-primary-50 text-primary-700 border border-primary-200'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            {filterUnread ? 'Showing Unread Only' : 'Show All'}
          </button>

          <button
            onClick={handleMarkAllAsRead}
            className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors flex items-center gap-1.5"
          >
            <CheckCheck className="w-4 h-4" />
            Mark All as Read
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading && notifications.length === 0 ? (
          <div className="p-6">
            <SkeletonLoader type="list" count={5} />
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <CheckCircle2 className="w-12 h-12 mx-auto mb-2 text-emerald-400" />
            <p className="text-base font-semibold text-slate-600">You're all caught up!</p>
            <p className="text-xs text-slate-400 mt-1">No new notifications at this time.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {notifications.map((item) => {
              const isUnread = !item.read;

              return (
                <div
                  key={item.id}
                  className={`p-4 transition-colors flex items-start gap-4 ${
                    isUnread ? 'bg-primary-50/40 hover:bg-primary-50/70' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="p-2 rounded-xl bg-white border border-slate-200 shadow-xs shrink-0 mt-0.5">
                    {getNotificationIcon(item.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3
                        className={`text-sm ${
                          isUnread ? 'font-bold text-slate-900' : 'font-medium text-slate-700'
                        }`}
                      >
                        {item.title}
                      </h3>
                      <span className="text-[11px] text-slate-400 shrink-0">
                        {new Date(item.createdAt).toLocaleString()}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{item.message}</p>

                    {item.metadata && (
                      <div className="mt-2 text-[11px] font-mono bg-white/80 p-1.5 rounded border border-slate-200 text-slate-600 inline-block">
                        {item.metadata}
                      </div>
                    )}
                  </div>

                  {isUnread && (
                    <button
                      onClick={() => handleMarkAsRead(item.id)}
                      title="Mark as Read"
                      className="text-xs text-primary-600 hover:text-primary-800 font-semibold px-2 py-1 rounded hover:bg-primary-100 shrink-0"
                    >
                      Mark Read
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

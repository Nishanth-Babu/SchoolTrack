import React, { useState, useEffect } from 'react';
import { Calendar, AlertTriangle, ShieldAlert, Sparkles, RefreshCw, User } from 'lucide-react';
import { aiService } from '../../services';

const LeaveAnomaliesCard = ({ classId = null, className = '' }) => {
  const [loading, setLoading] = useState(true);
  const [anomalies, setAnomalies] = useState([]);

  const fetchAnomalies = async () => {
    try {
      setLoading(true);
      const res = await aiService.getLeaveAnomalies(classId);
      setAnomalies(res || []);
    } catch (err) {
      console.error('Failed to load leave anomalies', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnomalies();
  }, [classId]);

  return (
    <div className={`liquid-glass rounded-3xl p-6 relative overflow-hidden border border-white/90 shadow-lg ${className}`}>
      <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-slate-200/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 p-0.5 shadow-md shadow-amber-500/20">
            <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
              <ShieldAlert className="w-5 h-5 text-amber-600" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-black text-slate-900 tracking-tight">Leave Pattern Anomaly Detection</h3>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-amber-50 border border-amber-200 text-amber-800">
                Pattern AI
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">Statistical deviation in student absence rhythms</p>
          </div>
        </div>

        <button
          onClick={fetchAnomalies}
          disabled={loading}
          className="p-2 rounded-xl bg-white/90 hover:bg-white border border-slate-200 text-slate-600 hover:text-amber-700 transition-all duration-200 active:scale-95 disabled:opacity-50 shadow-2xs cursor-pointer"
          title="Refresh Anomalies"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-amber-600' : ''}`} />
        </button>
      </div>

      {loading ? (
        <div className="py-12 flex flex-col items-center justify-center text-slate-500 space-y-2">
          <AlertTriangle className="w-8 h-8 text-amber-600 animate-pulse" />
          <p className="text-xs font-semibold">Scanning leave timeline for clustered anomalies...</p>
        </div>
      ) : anomalies.length === 0 ? (
        <div className="text-center py-10 text-slate-500 text-sm font-medium">
          No irregular leave clusters detected in the selected period.
        </div>
      ) : (
        <div className="mt-5 space-y-3">
          {anomalies.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-white/80 hover:bg-white border border-slate-200/90 hover:border-amber-300 transition-all space-y-2.5 shadow-2xs"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-100 border border-amber-200 flex items-center justify-center font-bold text-xs text-amber-800">
                    {item.studentName?.charAt(0) || 'S'}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs tracking-tight">{item.studentName}</h4>
                    <span className="text-[11px] text-slate-500 font-medium">{item.className} • Roll: {item.rollNumber}</span>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 shadow-2xs">
                  {item.severity} Risk ({item.anomalyConfidence}%)
                </span>
              </div>

              <p className="text-xs text-slate-700 font-medium leading-relaxed">{item.patternDescription}</p>

              <div className="pt-2.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-[11px]">
                <span className="text-slate-500 font-medium">Total Leaves: <strong className="text-amber-700 font-bold">{item.leaveCount}</strong></span>
                <span className="text-purple-700 font-bold bg-purple-50 px-2 py-0.5 rounded-lg border border-purple-100">Action: {item.suggestedAction}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LeaveAnomaliesCard;

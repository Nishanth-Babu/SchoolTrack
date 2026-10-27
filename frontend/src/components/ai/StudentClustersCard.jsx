import React, { useState, useEffect } from 'react';
import { Users, Layers, Sparkles, BrainCircuit, RefreshCw, CheckCircle2 } from 'lucide-react';
import { aiService } from '../../services';

const StudentClustersCard = ({ classId = null, className = '' }) => {
  const [loading, setLoading] = useState(true);
  const [clusters, setClusters] = useState([]);
  const [selectedCluster, setSelectedCluster] = useState(null);

  const fetchClusters = async () => {
    try {
      setLoading(true);
      const res = await aiService.getClusters(classId);
      setClusters(res || []);
      if (res && res.length > 0) setSelectedCluster(res[0]);
    } catch (err) {
      console.error('Failed to load student clusters', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClusters();
  }, [classId]);

  const getColorClasses = (color) => {
    switch (color) {
      case 'emerald':
        return {
          bg: 'bg-emerald-50/90',
          border: 'border-emerald-200',
          text: 'text-emerald-700',
          badge: 'bg-emerald-100 text-emerald-800 border-emerald-300'
        };
      case 'amber':
        return {
          bg: 'bg-amber-50/90',
          border: 'border-amber-200',
          text: 'text-amber-700',
          badge: 'bg-amber-100 text-amber-800 border-amber-300'
        };
      case 'rose':
        return {
          bg: 'bg-rose-50/90',
          border: 'border-rose-200',
          text: 'text-rose-700',
          badge: 'bg-rose-100 text-rose-800 border-rose-300'
        };
      default:
        return {
          bg: 'bg-sky-50/90',
          border: 'border-sky-200',
          text: 'text-sky-700',
          badge: 'bg-sky-100 text-sky-800 border-sky-300'
        };
    }
  };

  return (
    <div className={`liquid-glass rounded-3xl p-6 relative overflow-hidden border border-white/90 shadow-lg ${className}`}>
      <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-slate-200/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-teal-600 to-emerald-600 p-0.5 shadow-md shadow-teal-500/20">
            <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
              <Layers className="w-5 h-5 text-teal-600" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-black text-slate-900 tracking-tight">Student Behavioral Segmentation</h3>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-teal-50 border border-teal-200 text-teal-700">
                K-Means AI
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">Clustering by academic velocity, attendance & compliance</p>
          </div>
        </div>

        <button
          onClick={fetchClusters}
          disabled={loading}
          className="p-2 rounded-xl bg-white/90 hover:bg-white border border-slate-200 text-slate-600 hover:text-teal-700 transition-all duration-200 active:scale-95 disabled:opacity-50 shadow-2xs cursor-pointer"
          title="Refresh Clusters"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-teal-600' : ''}`} />
        </button>
      </div>

      {loading ? (
        <div className="py-12 flex flex-col items-center justify-center text-slate-500 space-y-3">
          <BrainCircuit className="w-8 h-8 text-teal-600 animate-spin" />
          <p className="text-xs font-semibold">Computing feature vectors & clusters...</p>
        </div>
      ) : (
        <div className="mt-5 space-y-5">
          {/* Cluster Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {clusters.map((c) => {
              const theme = getColorClasses(c.color);
              const isSelected = selectedCluster?.clusterId === c.clusterId;
              return (
                <div
                  key={c.clusterId}
                  onClick={() => setSelectedCluster(c)}
                  className={`p-4 rounded-2xl cursor-pointer transition-all border ${
                    isSelected
                      ? `${theme.bg} ${theme.border} shadow-md ring-2 ring-teal-500/30 scale-[1.02]`
                      : 'bg-white/70 hover:bg-white border-slate-200/80 hover:border-teal-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${theme.badge}`}>
                      {c.clusterId}
                    </span>
                    <span className="text-xs font-black text-slate-800">{c.percentageOfTotal}%</span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-xs line-clamp-1">{c.clusterName}</h4>
                  <div className="mt-3 flex items-baseline justify-between text-xs text-slate-500">
                    <span>Students: <strong className="text-slate-900 font-bold">{c.studentCount}</strong></span>
                    <span>Avg: <strong className={`${theme.text} font-black`}>{c.avgMarks}%</strong></span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Selected Cluster Deep-Dive */}
          {selectedCluster && (
            <div className="p-5 rounded-2xl bg-white/80 border border-slate-200/90 shadow-2xs space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h4 className="font-black text-slate-900 text-sm tracking-tight">{selectedCluster.clusterName}</h4>
                <div className="flex items-center gap-3 text-xs">
                  <span className="text-slate-500 font-medium">Attendance: <strong className="text-emerald-700 font-bold">{selectedCluster.avgAttendance}%</strong></span>
                  <span className="text-slate-500 font-medium">Homework: <strong className="text-sky-700 font-bold">{selectedCluster.avgHomeworkRate}%</strong></span>
                </div>
              </div>
              <p className="text-xs text-slate-700 font-medium leading-relaxed">{selectedCluster.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                  <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-2">Observed Traits</span>
                  <ul className="space-y-1.5 text-xs text-slate-700 font-medium">
                    {selectedCluster.characteristics?.map((t, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-3.5 rounded-xl bg-teal-50/70 border border-teal-100">
                  <span className="text-[11px] font-bold text-teal-800 uppercase tracking-wider block mb-2">Actionable Interventions</span>
                  <ul className="space-y-1.5 text-xs text-teal-900 font-medium">
                    {selectedCluster.recommendedStrategies?.map((s, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 flex-shrink-0" />
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StudentClustersCard;

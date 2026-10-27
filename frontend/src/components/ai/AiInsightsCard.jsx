import React, { useState, useEffect } from 'react';
import { 
  BrainCircuit, 
  Sparkles, 
  AlertTriangle, 
  AlertCircle, 
  CheckCircle2, 
  TrendingDown, 
  TrendingUp, 
  RefreshCw, 
  ArrowRight, 
  Lightbulb,
  ShieldAlert
} from 'lucide-react';
import { aiService } from '../../services';

const AiInsightsCard = ({ classId = null, onSelectStudent = null, className = '' }) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const fetchInsights = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await aiService.getInsights(classId);
      setData(res);
    } catch (err) {
      console.error('Failed to load AI insights', err);
      setError('Unable to retrieve AI telemetry insights.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, [classId]);

  const getSeverityBadge = (severity) => {
    switch (severity) {
      case 'CRITICAL':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse"></span>
            Critical Alert
          </span>
        );
      case 'WARNING':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 shadow-2xs">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            Attention
          </span>
        );
      case 'POSITIVE':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-2xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Optimal
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-800 border border-indigo-200 shadow-2xs">
            <Lightbulb className="w-3.5 h-3.5 text-indigo-600" />
            Insight
          </span>
        );
    }
  };

  return (
    <div className={`liquid-glass rounded-3xl p-6 relative overflow-hidden border border-white/90 shadow-lg ${className}`}>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-slate-200/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 p-0.5 shadow-md shadow-purple-500/20">
            <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
              <BrainCircuit className="w-5 h-5 text-indigo-600 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-black text-slate-900 tracking-tight">AI Powered Insights</h3>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-purple-50 border border-purple-200 text-purple-700">
                Live Data Engine
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Machine learning anomaly detection & predictive indicators
            </p>
          </div>
        </div>

        <button
          onClick={fetchInsights}
          disabled={loading}
          className="p-2 rounded-xl bg-white/90 hover:bg-white border border-slate-200 text-slate-600 hover:text-indigo-600 transition-all duration-200 active:scale-95 disabled:opacity-50 shadow-2xs cursor-pointer"
          title="Refresh AI Insights"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-purple-600' : ''}`} />
        </button>
      </div>

      {/* Health Score Summary Strip */}
      {data && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-5">
          <div className="p-3.5 rounded-2xl bg-rose-50/90 border border-rose-100 shadow-2xs">
            <span className="text-[11px] uppercase tracking-wider text-rose-800 font-bold block">At-Risk Students</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-rose-700">{data.totalAtRiskStudents}</span>
              <span className="text-[11px] text-rose-600 font-medium">Flagged</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-amber-50/90 border border-amber-100 shadow-2xs">
            <span className="text-[11px] uppercase tracking-wider text-amber-800 font-bold block">Attendance Alerts</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-amber-700">{data.attendanceAlertsCount}</span>
              <span className="text-[11px] text-amber-600 font-medium">Classes</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-indigo-50/90 border border-indigo-100 shadow-2xs">
            <span className="text-[11px] uppercase tracking-wider text-indigo-800 font-bold block">Subject Deviations</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-indigo-700">{data.subjectAlertsCount}</span>
              <span className="text-[11px] text-indigo-600 font-medium">Low Score</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-50/90 border border-emerald-100 shadow-2xs">
            <span className="text-[11px] uppercase tracking-wider text-emerald-800 font-bold block">Health Index</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-emerald-700">{data.institutionalHealthScore}%</span>
              <span className="text-[11px] text-emerald-600 font-medium">Stability</span>
            </div>
          </div>
        </div>
      )}

      {/* Insights List */}
      <div className="space-y-3 mt-2">
        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center text-slate-500 space-y-3">
            <BrainCircuit className="w-8 h-8 text-indigo-600 animate-spin" />
            <p className="text-xs font-semibold">Synthesizing institutional telemetry...</p>
          </div>
        ) : error ? (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        ) : data?.insights?.length > 0 ? (
          data.insights.map((insight) => (
            <div
              key={insight.id}
              className="p-4 rounded-2xl bg-white/80 hover:bg-white border border-slate-200/80 hover:border-indigo-300 shadow-xs hover:shadow-md transition-all duration-200 group"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2 flex-wrap">
                  {getSeverityBadge(insight.severity)}
                  <h4 className="font-bold text-slate-900 text-sm group-hover:text-indigo-600 transition-colors">
                    {insight.title}
                  </h4>
                </div>
                {insight.metric && (
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 border border-slate-200">
                    {insight.metric}
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                {insight.description}
              </p>

              {insight.recommendation && (
                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-start gap-2 text-xs text-indigo-900 bg-indigo-50/80 p-2.5 rounded-xl border border-indigo-100 font-medium">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-indigo-700 font-bold">AI Recommendation: </strong>
                    <span>{insight.recommendation}</span>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-slate-500 text-xs font-medium">
            No active anomalies or critical alerts detected.
          </div>
        )}
      </div>
    </div>
  );
};

export default AiInsightsCard;

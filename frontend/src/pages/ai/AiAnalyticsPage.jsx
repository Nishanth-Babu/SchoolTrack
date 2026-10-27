import React, { useState } from 'react';
import {
  BrainCircuit,
  Sparkles,
  RefreshCw,
  Download,
  Printer,
  TrendingUp,
  FileText,
  MessageSquare,
  Layers,
  ShieldAlert,
  Database,
  Cpu,
  Zap,
  ArrowRight,
  Filter
} from 'lucide-react';
import { useSelector } from 'react-redux';
import AiInsightsCard from '../../components/ai/AiInsightsCard';
import StudentPerformancePredictionCard from '../../components/ai/StudentPerformancePredictionCard';
import AiStudentReportCard from '../../components/ai/AiStudentReportCard';
import AiAssistantCard from '../../components/ai/AiAssistantCard';
import StudentClustersCard from '../../components/ai/StudentClustersCard';
import LeaveAnomaliesCard from '../../components/ai/LeaveAnomaliesCard';

const AiAnalyticsPage = () => {
  const { user } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState('ALL');
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const role = user?.role || user?.primaryRole || (user?.roles && user.roles[0]);
  const isPrincipal = role === 'PRINCIPAL' || role === 'ROLE_PRINCIPAL';
  const greetingName = user?.fullName || user?.firstName || user?.name || (isPrincipal ? 'Principal' : 'Coordinator');

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Top Header matching Liquid Glass aesthetic */}
      <div className="liquid-glass rounded-3xl p-6 sm:p-8 relative overflow-hidden border border-white/90 shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-purple-50 text-purple-700 border border-purple-200 flex items-center gap-1.5 shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                AI & Data Science Suite
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border shadow-xs ${
                isPrincipal
                  ? 'bg-amber-50 text-amber-800 border-amber-200'
                  : 'bg-cyan-50 text-cyan-800 border-cyan-200'
              }`}>
                {isPrincipal ? '👑 Institutional Scope (All School Classes)' : '🛡️ Coordinator Hierarchy Scope (Your Supervised Wing)'}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-xs">
                Live ML Engine
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-2.5">
              Good Morning, {greetingName}
            </h1>
            <p className="text-sm text-slate-600 font-medium mt-1 max-w-2xl">
              {isPrincipal
                ? "Institutional operations, whole-school performance predictions & attendance intelligence report."
                : "Departmental intelligence & predictive performance telemetry for classes and students under your supervision."}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveTab('ASSISTANT')}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-xs font-bold shadow-md shadow-purple-500/25 transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Ask AI Assistant</span>
            </button>

            <button
              onClick={() => window.print()}
              className="px-4 py-2.5 rounded-xl bg-white/90 hover:bg-white border border-slate-200/90 text-slate-700 hover:text-slate-900 text-xs font-bold transition-all active:scale-95 flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <Download className="w-4 h-4 text-slate-500" />
              <span>Download Report</span>
            </button>

            <button
              onClick={handleRefresh}
              className="p-2.5 rounded-xl bg-white/90 hover:bg-white border border-slate-200/90 text-slate-600 hover:text-indigo-600 transition-all active:scale-95 shadow-xs cursor-pointer"
              title="Refresh All AI Models"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* End-to-End Workflow Diagram / Concept Strip */}
        <div className="mt-8 pt-6 border-t border-slate-200/80 grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/80 border border-slate-200/80 shadow-xs">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center font-bold text-xs">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Step 1</span>
              <h4 className="text-xs font-bold text-slate-800">Data Ingestion</h4>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/80 border border-slate-200/80 shadow-xs">
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 border border-purple-100 flex items-center justify-center font-bold text-xs">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Step 2</span>
              <h4 className="text-xs font-bold text-slate-800">Feature Extraction</h4>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/80 border border-slate-200/80 shadow-xs">
            <div className="w-9 h-9 rounded-xl bg-pink-50 text-pink-600 border border-pink-100 flex items-center justify-center font-bold text-xs">
              <BrainCircuit className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Step 3</span>
              <h4 className="text-xs font-bold text-slate-800">ML Ensemble</h4>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/80 border border-slate-200/80 shadow-xs">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center font-bold text-xs">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Step 4</span>
              <h4 className="text-xs font-bold text-slate-800">Real-Time Actions</h4>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl liquid-glass border border-white/90 w-fit shadow-xs">
        <button
          onClick={() => setActiveTab('ALL')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'ALL'
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-indigo-500/20'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          Complete AI Suite
        </button>

        <button
          onClick={() => setActiveTab('PREDICTIONS')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'PREDICTIONS'
              ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          Performance Predictions
        </button>

        <button
          onClick={() => setActiveTab('REPORTS')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'REPORTS'
              ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-md shadow-pink-500/20'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          AI Diagnostic Reports
        </button>

        <button
          onClick={() => setActiveTab('CLUSTERING')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'CLUSTERING'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-500/20'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          Segmentation & Anomalies
        </button>

        <button
          onClick={() => setActiveTab('ASSISTANT')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'ASSISTANT'
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md shadow-purple-500/20'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          Interactive AI Assistant
        </button>
      </div>

      {/* Main Grid View */}
      {(activeTab === 'ALL' || activeTab === 'PREDICTIONS' || activeTab === 'REPORTS') && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: AI Powered Insights */}
          <div className="lg:col-span-6 space-y-6">
            <AiInsightsCard key={`ins-${refreshKey}`} />
            <StudentClustersCard key={`clus-${refreshKey}`} />
          </div>

          {/* Right Column: Prediction & Diagnostic Reports */}
          <div className="lg:col-span-6 space-y-6">
            <StudentPerformancePredictionCard key={`pred-${refreshKey}`} />
            <AiStudentReportCard key={`rep-${refreshKey}`} />
          </div>
        </div>
      )}

      {/* AI Assistant Chatbot Standalone or Expanded View */}
      {(activeTab === 'ALL' || activeTab === 'ASSISTANT') && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7">
            <AiAssistantCard key={`chat-${refreshKey}`} />
          </div>
          <div className="lg:col-span-5">
            <LeaveAnomaliesCard key={`anom-${refreshKey}`} />
          </div>
        </div>
      )}

      {/* Clustering & Anomaly Tab */}
      {activeTab === 'CLUSTERING' && (
        <div className="space-y-6">
          <StudentClustersCard key={`clus-full-${refreshKey}`} />
          <LeaveAnomaliesCard key={`anom-full-${refreshKey}`} />
        </div>
      )}
    </div>
  );
};

export default AiAnalyticsPage;

import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Sparkles,
  BrainCircuit,
  UserCheck,
  Award,
  ChevronRight,
  Info,
  CheckCircle2,
  AlertCircle,
  X,
  BookOpen
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { aiService, studentService } from '../../services';

const StudentPerformancePredictionCard = ({ studentId = null, classId = null, className = '' }) => {
  const [loading, setLoading] = useState(true);
  const [prediction, setPrediction] = useState(null);
  const [studentsList, setStudentsList] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState(studentId);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState(null);

  // Load students for selector if not provided or to allow switching
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await studentService.getAllStudents();
        if (res && res.length > 0) {
          setStudentsList(res);
          if (!selectedStudentId) {
            setSelectedStudentId(res[0].id);
          }
        }
      } catch (err) {
        console.warn('Could not load student list for selector', err);
      }
    };
    fetchStudents();
  }, []);

  useEffect(() => {
    if (studentId) {
      setSelectedStudentId(studentId);
    }
  }, [studentId]);

  useEffect(() => {
    if (!selectedStudentId) return;

    const fetchPrediction = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await aiService.getStudentPrediction(selectedStudentId);
        setPrediction(res);
      } catch (err) {
        console.error('Failed to load student performance prediction', err);
        setError('Unable to calculate ML prediction model.');
      } finally {
        setLoading(false);
      }
    };
    fetchPrediction();
  }, [selectedStudentId]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'EXCELLING':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1.5 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
            Excelling
          </span>
        );
      case 'ON_TRACK':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-sky-50 text-sky-800 border border-sky-200 flex items-center gap-1.5 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-600"></span>
            On Track
          </span>
        );
      case 'NEEDS_ATTENTION':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1.5 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
            Needs Attention
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-800 border border-rose-200 flex items-center gap-1.5 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse"></span>
            At Risk
          </span>
        );
    }
  };

  return (
    <div className={`liquid-glass rounded-3xl p-6 relative overflow-hidden border border-white/90 shadow-lg ${className}`}>
      {/* Ambient highlight */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl pointer-events-none -mr-10 -mt-10"></div>

      {/* Header with Student Selector & ML badge */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-slate-200/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-600 to-indigo-600 p-0.5 shadow-md shadow-sky-500/20">
            <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-sky-600" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-black text-slate-900 tracking-tight">Student Performance Prediction</h3>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-sky-50 border border-sky-200 text-sky-700">
                ML Model
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Supervised predictive grading & trajectory forecast
            </p>
          </div>
        </div>

        {studentsList.length > 1 && (
          <select
            value={selectedStudentId || ''}
            onChange={(e) => setSelectedStudentId(Number(e.target.value))}
            className="px-3.5 py-1.5 rounded-xl bg-white/90 border border-slate-200 text-xs text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500/20 shadow-2xs"
          >
            {studentsList.map((s) => (
              <option key={s.id} value={s.id} className="bg-white text-slate-900">
                {s.user?.fullName || s.name || `Student #${s.id}`} ({s.rollNumber || s.admissionNumber})
              </option>
            ))}
          </select>
        )}
      </div>

      {loading ? (
        <div className="py-14 flex flex-col items-center justify-center text-slate-500 space-y-3">
          <BrainCircuit className="w-8 h-8 text-sky-600 animate-spin" />
          <p className="text-sm font-semibold">Running ML regression models...</p>
        </div>
      ) : error || !prediction ? (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center gap-3 my-4">
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-600" />
          <span className="font-semibold">{error || 'No prediction data found.'}</span>
        </div>
      ) : (
        <div className="mt-5 space-y-5">
          {/* Student Profile Info & Status */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-white/80 border border-slate-200/90 shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center font-bold text-sm text-white shadow-sm">
                {prediction.studentName ? prediction.studentName.charAt(0) : 'S'}
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm tracking-tight">{prediction.studentName}</h4>
                <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mt-0.5">
                  <span>Roll: <strong className="text-slate-800 font-bold">{prediction.rollNumber}</strong></span>
                  <span>•</span>
                  <span>{prediction.className}</span>
                </div>
              </div>
            </div>
            <div>
              {getStatusBadge(prediction.status)}
            </div>
          </div>

          {/* Big Score Prediction Metric & Sparkline */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            <div className="md:col-span-5 p-5 rounded-2xl bg-gradient-to-br from-sky-50/90 via-indigo-50/70 to-purple-50/50 border border-sky-100 shadow-2xs">
              <span className="text-[11px] uppercase tracking-wider text-sky-800 font-bold block">Predicted Final Score</span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-4xl font-black text-slate-900 tracking-tight">
                  {prediction.predictedScore}%
                </span>
                <span className={`text-sm font-bold flex items-center gap-0.5 ${
                  prediction.scoreDelta >= 0 ? 'text-emerald-700' : 'text-rose-700'
                }`}>
                  {prediction.scoreDelta >= 0 ? '+' : ''}{prediction.scoreDelta}%
                </span>
              </div>
              <div className="mt-2 text-[11px] text-slate-600 font-medium flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                <span>Confidence: <strong className="text-slate-900 font-bold">{prediction.confidenceScore}%</strong></span>
              </div>
            </div>

            {/* Sparkline chart */}
            <div className="md:col-span-7 h-32 p-3 rounded-2xl bg-white/80 border border-slate-200/90 shadow-2xs flex flex-col justify-between">
              <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium px-2 pt-1">
                <span>Performance Velocity Trend</span>
                <span className="text-sky-700 font-mono font-bold">Jan - May Projected</span>
              </div>
              <div className="w-full h-22">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={prediction.trend} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="scoreGlow" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0284c7" stopOpacity={0.25}/>
                        <stop offset="95%" stopColor="#0284c7" stopOpacity={0.0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="month" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', fontSize: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                      labelStyle={{ color: '#0f172a', fontWeight: 'bold' }}
                      formatter={(val) => [`${val}%`, 'Score']}
                    />
                    <Area
                      type="monotone"
                      dataKey="actualScore"
                      stroke="#0284c7"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#scoreGlow)"
                    />
                    <Line
                      type="monotone"
                      dataKey="predictedScore"
                      stroke="#7c3aed"
                      strokeDasharray="3 3"
                      strokeWidth={2}
                      dot={{ r: 3, fill: '#7c3aed' }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Key Influencing Factors */}
          <div className="p-4 rounded-2xl bg-slate-50/90 border border-slate-200/80 text-xs space-y-2">
            <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">Key AI Contributing Factors</span>
            <ul className="space-y-1.5">
              {prediction.keyFactors?.map((factor, idx) => (
                <li key={idx} className="flex items-start gap-2 text-slate-700 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-sky-600 flex-shrink-0 mt-0.5" />
                  <span>{factor}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Action footer */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-slate-500 font-medium">
              Model: <strong className="text-slate-800 font-bold">{prediction.modelName}</strong>
            </span>
            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm active:scale-95 cursor-pointer"
            >
              <span>View Details</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {showModal && prediction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-2xl liquid-glass rounded-3xl p-6 border border-white/95 shadow-2xl bg-white/95 text-slate-900 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200/80">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-sky-50 border border-sky-200 flex items-center justify-center">
                  <BrainCircuit className="w-5 h-5 text-sky-600" />
                </div>
                <div>
                  <h3 className="font-black text-lg text-slate-900">{prediction.studentName} — ML Breakdown</h3>
                  <p className="text-xs text-slate-500 font-medium">Detailed subject projection & feature weights</p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Feature weights */}
            <div className="my-5">
              <h4 className="text-xs uppercase font-bold text-slate-700 tracking-wider mb-3">Model Feature Weights</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {Object.entries(prediction.featureImportances || {}).map(([key, val]) => (
                  <div key={key} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                    <span className="text-[11px] text-slate-500 font-medium block truncate">{key}</span>
                    <span className="text-lg font-black text-sky-700">{Math.round(val * 100)}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Subject Predictions */}
            <div className="my-5">
              <h4 className="text-xs uppercase font-bold text-slate-700 tracking-wider mb-3">Subject Performance Projections</h4>
              <div className="space-y-2">
                {prediction.subjectPredictions?.map((sp, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-white border border-slate-200 flex items-center justify-between shadow-2xs">
                    <div>
                      <h5 className="font-bold text-sm text-slate-900">{sp.subjectName}</h5>
                      <span className="text-xs text-slate-500 font-medium">Current Average: {sp.currentMarks}%</span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-black text-sky-700">{sp.predictedMarks}% Pred.</span>
                      <div className="mt-1">{getStatusBadge(sp.status)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended Interventions */}
            <div className="mt-5 p-4 rounded-2xl bg-sky-50 border border-sky-100 text-xs">
              <strong className="text-sky-900 font-bold block mb-2">Recommended Pedagogical Interventions:</strong>
              <ul className="space-y-1.5 text-slate-700 font-medium">
                {prediction.recommendedInterventions?.map((inv, idx) => (
                  <li key={idx} className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-600"></span>
                    <span>{inv}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentPerformancePredictionCard;

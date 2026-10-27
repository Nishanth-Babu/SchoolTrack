import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  Sparkles,
  Send,
  Bot,
  User,
  Trash2,
  HelpCircle,
  TrendingDown,
  Users,
  BookOpen,
  Calendar,
  Layers,
  ArrowRight,
  CheckCircle2,
  Table
} from 'lucide-react';
import { aiService } from '../../services';

const AiAssistantCard = ({ classId = null, className = '' }) => {
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'ai',
      text: "👋 Hello! I am your **SchoolTrack AI Assistant**. I can help you analyze student performance trajectories, identify at-risk learners, monitor class attendance dips, evaluate subject trends, or detect leave anomalies in real time.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedQuestions: [
        "Which students are at risk of low performance?",
        "Show attendance trend for Class 10-A",
        "Which subjects need improvement?",
        "List students with frequent absences",
        "Generate a student progress report"
      ]
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (queryText = null) => {
    const textToSend = (typeof queryText === 'string' ? queryText : input).trim();
    if (!textToSend || loading) return;

    const userMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await aiService.chatWithAi({
        message: textToSend,
        classId: classId
      });

      const aiMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: response.reply,
        dataTable: response.dataTable,
        summaryMetrics: response.summaryMetrics,
        suggestedQuestions: response.suggestedQuestions,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error('AI chat error', err);
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: "I encountered an error connecting to the AI telemetry service. Please verify your connection or try a different question.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setMessages([
      {
        id: 'welcome-reset',
        sender: 'ai',
        text: "Chat cleared. What insights would you like to explore?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedQuestions: [
          "Which students are at risk of low performance?",
          "Show attendance trend for Class 10-A",
          "Which subjects need improvement?",
          "List students with frequent absences"
        ]
      }
    ]);
  };

  // Helper to render basic markdown formatting
  const formatAiText = (txt) => {
    if (!txt) return null;
    const lines = txt.split('\n');
    return lines.map((line, idx) => {
      if (line.startsWith('### ')) {
        return <h4 key={idx} className="text-base font-black text-slate-900 mt-2 mb-1.5">{line.replace('### ', '')}</h4>;
      }
      if (line.startsWith('- ')) {
        const item = line.replace('- ', '');
        return (
          <li key={idx} className="flex items-start gap-2 text-xs text-slate-700 font-medium my-1">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-600 mt-1.5 flex-shrink-0"></span>
            <span dangerouslySetInnerHTML={{ __html: item.replace(/\*\*(.*?)\*\*/g, '<strong class="text-slate-900 font-bold">$1</strong>').replace(/`(.*?)`/g, '<code class="px-1.5 py-0.5 rounded bg-purple-100 text-purple-800 font-mono text-[11px]">$1</code>') }}></span>
          </li>
        );
      }
      if (line.trim() === '') {
        return <div key={idx} className="h-1.5"></div>;
      }
      return (
        <p
          key={idx}
          className="text-xs text-slate-700 font-medium leading-relaxed my-0.5"
          dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-slate-900 font-bold">$1</strong>').replace(/`(.*?)`/g, '<code class="px-1.5 py-0.5 rounded bg-purple-100 text-purple-800 font-mono text-[11px]">$1</code>') }}
        />
      );
    });
  };

  return (
    <div className={`liquid-glass rounded-3xl flex flex-col relative overflow-hidden border border-white/90 shadow-lg ${className}`}>
      {/* Background ambient light */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

      {/* Header */}
      <div className="flex items-center justify-between p-5 border-b border-slate-200/80 bg-white/60">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 p-0.5 shadow-md shadow-purple-500/20">
            <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
              <Bot className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-black text-slate-900 text-sm tracking-tight">Interactive AI Assistant</h3>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                Online
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">Natural language educational intelligence</p>
          </div>
        </div>

        <button
          onClick={handleClear}
          className="p-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-500 hover:text-rose-600 transition-all text-xs cursor-pointer shadow-2xs"
          title="Clear Conversation"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Chat Messages Body */}
      <div className="flex-1 p-5 overflow-y-auto space-y-4 max-h-[420px] min-h-[300px]">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'ai' && (
              <div className="w-8 h-8 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-2xs">
                <Sparkles className="w-4 h-4 text-purple-600" />
              </div>
            )}

            <div
              className={`max-w-[85%] rounded-3xl p-4 text-xs transition-all ${
                msg.sender === 'user'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                  : 'bg-white/90 border border-slate-200/90 text-slate-800 shadow-2xs'
              }`}
            >
              {msg.sender === 'ai' ? formatAiText(msg.text) : <p className="leading-relaxed font-semibold">{msg.text}</p>}

              {/* Data Table if returned */}
              {msg.dataTable && msg.dataTable.length > 0 && (
                <div className="mt-3 overflow-x-auto rounded-xl border border-slate-200 bg-slate-50 p-2.5">
                  <table className="w-full text-[11px] text-left">
                    <thead>
                      <tr className="border-b border-slate-200 text-purple-900 font-bold">
                        {Object.keys(msg.dataTable[0]).map((k) => (
                          <th key={k} className="p-1.5 uppercase tracking-wider">{k}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200/70">
                      {msg.dataTable.map((row, rIdx) => (
                        <tr key={rIdx} className="hover:bg-purple-50/50">
                          {Object.values(row).map((val, cIdx) => (
                            <td key={cIdx} className="p-1.5 text-slate-800 font-medium">{String(val)}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Suggested Questions Chips */}
              {msg.suggestedQuestions && msg.suggestedQuestions.length > 0 && (
                <div className="mt-3.5 pt-3 border-t border-slate-200 space-y-1.5">
                  <span className="text-[10px] uppercase tracking-wider text-purple-800 font-bold block">
                    Suggested Queries
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {msg.suggestedQuestions.map((q, qIdx) => (
                      <button
                        key={qIdx}
                        onClick={() => handleSend(q)}
                        className="px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-[11px] text-purple-900 font-semibold text-left transition-all active:scale-95 cursor-pointer shadow-2xs"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <span className={`text-[9px] block text-right mt-2 font-medium ${msg.sender === 'user' ? 'text-purple-200' : 'text-slate-400'}`}>
                {msg.timestamp}
              </span>
            </div>

            {msg.sender === 'user' && (
              <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-2xs">
                <User className="w-4 h-4 text-indigo-600" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex gap-3 justify-start items-center">
            <div className="w-8 h-8 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center flex-shrink-0 shadow-2xs">
              <Sparkles className="w-4 h-4 text-purple-600 animate-spin" />
            </div>
            <div className="p-3.5 rounded-2xl bg-white/90 border border-slate-200 text-xs text-slate-600 font-medium flex items-center gap-2 shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-600 animate-bounce"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-purple-600 animate-bounce delay-150"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-purple-600 animate-bounce delay-300"></span>
              <span className="ml-1 text-[11px] font-semibold text-slate-700">Analyzing institutional records...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <div className="p-4 border-t border-slate-200/80 bg-white/80">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about at-risk students, attendance dips, subject averages..."
            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:bg-white transition-colors"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="p-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white disabled:opacity-40 transition-all shadow-md shadow-purple-500/20 active:scale-95 flex-shrink-0 cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default AiAssistantCard;

import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  Terminal, 
  ChevronRight, 
  Lock
} from 'lucide-react';
import type { Faculty, Schedule, AttendanceLog, LeaveRecord, UserRole, AgentMessage } from '../types';
import { processAgentQuery, type AgentContext } from '../utils/agentEngine';

interface AgentChatViewProps {
  facultyList: Faculty[];
  schedules: Schedule[];
  attendanceLogs: AttendanceLog[];
  leaveRecords: LeaveRecord[];
  currentUserRole: UserRole;
}

export const AgentChatView: React.FC<AgentChatViewProps> = ({
  facultyList,
  schedules,
  attendanceLogs,
  leaveRecords,
  currentUserRole,
}) => {
  const [messages, setMessages] = useState<AgentMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'agent',
      text: `Hello! I am your **Agentic AI Faculty Assistant**. I reason over live recognition events, timetables, and attendance logs to answer queries and flag anomalies. Current Session Access Clearance: **${currentUserRole.toUpperCase()}**`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      roleContext: currentUserRole,
      thoughtChain: [
        'Initialized LangGraph Stateful Agent Graph',
        'Bound Tools: check_current_status, get_schedule, check_availability, get_department_attendance, generate_report',
        `RBAC Security Matrix Loaded for Role [${currentUserRole.toUpperCase()}]`
      ]
    }
  ]);

  const [inputQuery, setInputQuery] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isProcessing]);

  const handleSend = (textToSend?: string) => {
    const query = textToSend || inputQuery;
    if (!query.trim() || isProcessing) return;

    const userMsg: AgentMessage = {
      id: `msg-user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      roleContext: currentUserRole
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputQuery('');
    setIsProcessing(true);

    setTimeout(() => {
      const ctx: AgentContext = {
        facultyList,
        schedules,
        attendanceLogs,
        leaveRecords,
        currentUserRole
      };

      const agentReply = processAgentQuery(query, ctx);
      setMessages(prev => [...prev, agentReply]);
      setIsProcessing(false);
    }, 600);
  };

  const sampleQueries = [
    'Is Dr. Ananya Sharma on campus right now?',
    "What is Dr. Rajesh Iyer's timetable on Wednesdays?",
    'Which CS department faculty are absent today?',
    'Generate this month\'s attendance report for Computer Science dept'
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] max-w-5xl mx-auto space-y-4">
      {/* Header Banner */}
      <div className="glass-panel p-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-zinc-900 text-white flex items-center justify-center font-bold">
            <Bot size={22} />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-zinc-900 tracking-tight">Agentic AI Reasoning Engine</h2>
            <p className="text-xs text-zinc-500 font-medium">Conversational intelligence answering queries over live face recognition events & faculty schedules.</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-zinc-100 border border-zinc-200 px-3.5 py-1.5 rounded-full text-xs font-extrabold text-zinc-900 uppercase">
          <Lock size={13} /> Clearance: {currentUserRole}
        </div>
      </div>

      {/* Messages Scroll View */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1">
        {messages.map(msg => (
          <div 
            key={msg.id} 
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div className="flex items-center gap-2 mb-1.5 px-2">
              <span className="text-[11px] font-bold text-zinc-500">
                {msg.sender === 'user' ? 'You' : 'Agentic AI Assistant'}
              </span>
              <span className="text-[10px] text-zinc-400 font-medium">{msg.timestamp}</span>
            </div>

            <div 
              className={`max-w-[82%] p-5 rounded-[22px] shadow-sm text-sm leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-zinc-900 text-white rounded-tr-sm font-medium'
                  : 'bg-white text-zinc-900 border border-zinc-200 rounded-tl-sm'
              }`}
            >
              {/* Message Text */}
              <div className="whitespace-pre-wrap">{msg.text}</div>

              {/* LangGraph Thought-Chain Visualization */}
              {msg.thoughtChain && msg.thoughtChain.length > 0 && (
                <div className="mt-4 pt-3 border-t border-zinc-100 space-y-1.5">
                  <div className="text-[11px] font-extrabold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles size={12} className="text-zinc-800" /> LangGraph Reasoning Execution Steps:
                  </div>
                  <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-3 space-y-1 font-mono text-[11px] text-zinc-700">
                    {msg.thoughtChain.map((step, idx) => (
                      <div key={idx} className="flex items-start gap-1.5">
                        <ChevronRight size={13} className="text-zinc-400 shrink-0 mt-0.5" />
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tool Execution Traces */}
              {msg.toolCalls && msg.toolCalls.length > 0 && (
                <div className="mt-3 space-y-2">
                  <div className="text-[11px] font-extrabold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Terminal size={12} className="text-zinc-800" /> Tool Execution Traces:
                  </div>
                  {msg.toolCalls.map((tool, idx) => (
                    <div key={idx} className="bg-zinc-900 text-zinc-100 rounded-xl p-3 font-mono text-xs space-y-1">
                      <div className="flex justify-between text-[11px] text-zinc-400 border-b border-zinc-800 pb-1 mb-1">
                        <span className="text-zinc-200 font-bold">⚡ tool_call: {tool.toolName}</span>
                        <span>{tool.executionTimeMs}ms</span>
                      </div>
                      <div className="text-[11px] text-zinc-400">Args: {JSON.stringify(tool.args)}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {isProcessing && (
          <div className="flex flex-col items-start">
            <div className="bg-white border border-zinc-200 p-4 rounded-[22px] text-xs font-semibold text-zinc-600 flex items-center gap-2.5 shadow-sm">
              <div className="w-2 h-2 rounded-full bg-zinc-900 animate-ping"></div>
              <span>LangGraph state graph executing tool calls...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts Carousel */}
      <div className="flex gap-2 overflow-x-auto pb-1 shrink-0">
        {sampleQueries.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            className="text-xs font-bold bg-white text-zinc-800 border border-zinc-200 hover:bg-zinc-900 hover:text-white px-4 py-2 rounded-full whitespace-nowrap transition-colors shadow-sm"
          >
            ✨ {q}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <div className="glass-panel p-2.5 flex items-center gap-2 shrink-0">
        <input 
          type="text" 
          placeholder="Ask a natural language question over live attendance & schedules..."
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          className="flex-1 bg-transparent px-4 py-2 text-sm text-zinc-900 placeholder-zinc-400 outline-none font-medium"
        />
        <button 
          onClick={() => handleSend()}
          disabled={!inputQuery.trim() || isProcessing}
          className="btn-primary-glow shrink-0"
        >
          <span>Send Query</span>
          <Send size={15} />
        </button>
      </div>
    </div>
  );
};

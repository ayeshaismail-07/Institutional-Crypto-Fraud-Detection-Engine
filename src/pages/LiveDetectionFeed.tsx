import React, { useState, useEffect, useRef } from 'react';
import { 
  Terminal, 
  Cpu, 
  Search, 
  Activity, 
  VolumeX, 
  AlertTriangle,
  Play,
  RotateCcw,
  Sliders,
  CheckCircle,
  AlertOctagon
} from 'lucide-react';
import { Transaction, AgentLog } from '../types';

interface LiveDetectionFeedProps {
  recentTransactions: Transaction[];
  agentLogs: AgentLog[];
}

const LiveDetectionFeed: React.FC<LiveDetectionFeedProps> = ({
  recentTransactions,
  agentLogs,
}) => {
  const [selectedAgent, setSelectedAgent] = useState<string>('ALL');
  const [logFilterText, setLogFilterText] = useState<string>('');
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Filter logs based on selection and text query
  const filteredLogs = agentLogs.filter(log => {
    const matchesAgent = selectedAgent === 'ALL' || log.agentName === selectedAgent;
    const matchesQuery = log.message.toLowerCase().includes(logFilterText.toLowerCase()) || 
                         log.agentName.toLowerCase().includes(logFilterText.toLowerCase());
    return matchesAgent && matchesQuery;
  });

  const scrollTerminalToBottom = () => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    // Scroll to bottom whenever new logs arrive
    scrollTerminalToBottom();
  }, [filteredLogs.length]);

  const agentsList = [
    'ALL',
    'DataAgent',
    'FeatureAgent',
    'MLAgent',
    'GeminiAgent',
    'ValidatorAgent',
    'AlertAgent'
  ];

  const getLogTypeColor = (type: string) => {
    switch(type) {
      case 'alert': return 'text-rose-500 font-bold bg-rose-950/20 px-1 border border-rose-900/10 rounded';
      case 'warning': return 'text-amber-500 font-bold bg-amber-950/10 px-1 border border-amber-900/10 rounded';
      case 'success': return 'text-emerald-400 font-semibold';
      default: return 'text-slate-400';
    }
  };

  const anomaliesOnly = recentTransactions.filter(tx => tx.isAnomaly);

  return (
    <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-4rem)] overflow-y-auto">
      {/* 1. SUSPICIOUS TRANSACTION ANOMALY FEED */}
      <div className="lg:col-span-1 p-5 rounded-xl border border-slate-900 bg-slate-950/40 backdrop-blur flex flex-col h-full max-h-[85vh]">
        <div className="mb-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-500 animate-pulse" />
            <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-300">
              Suspicious Flow Spectrum
            </h4>
          </div>
          <p className="font-mono text-[9px] text-slate-500 uppercase mt-0.5">Filter of blocks classified as anomalies (Scored &gt;= 75%)</p>
        </div>

        {/* Scrollable list */}
        <div className="flex-1 overflow-y-auto space-y-3.5 pr-1">
          {anomaliesOnly.map((tx) => (
            <div 
              key={tx.id}
              className="p-3.5 rounded-lg border border-rose-500/25 bg-rose-950/5 hover:bg-rose-950/10 transition-all duration-300 shadow-[0_0_10px_rgba(244,63,94,0.02)]"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[10px] font-black text-rose-400 bg-rose-950/60 border border-rose-900/40 px-1.5 py-0.5 rounded uppercase">
                  Anomaly sc: {tx.anomalyScore}%
                </span>
                <span className="font-mono text-[9px] text-slate-500">
                  {new Date(tx.timestamp).toISOString().substring(11, 19)}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-slate-300 mb-3">
                <div>
                  <span className="text-slate-500 block uppercase text-[8px]">Asset Symbol</span>
                  <span className="font-bold text-slate-200">{tx.symbol}</span>
                </div>
                <div>
                  <span className="text-slate-500 block uppercase text-[8px]">Index Price</span>
                  <span>$ {tx.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
                <div>
                  <span className="text-slate-500 block uppercase text-[8px]">Volume Amount</span>
                  <span>{tx.quantity.toFixed(4)} tokens</span>
                </div>
                <div>
                  <span className="text-slate-500 block uppercase text-[8px]">Fiat Equivalent</span>
                  <span className="font-semibold text-rose-300">$ {tx.valueUsd.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                </div>
              </div>

              <div className="border-t border-slate-900 pt-2 text-[9px] font-mono select-none">
                <span className="text-slate-500 block text-[8px] uppercase">Flagged Wallet Address</span>
                <span className="text-slate-400 block truncate cursor-all">{tx.walletAddress}</span>
              </div>
            </div>
          ))}

          {anomaliesOnly.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center py-20 text-center space-y-2 select-none border border-dashed border-slate-900 rounded-lg">
              <CheckCircle className="w-8 h-8 text-slate-700" />
              <p className="font-mono text-[10px] text-slate-500 uppercase tracking-widest leading-normal">
                No threat signals on pipeline.<br/>Awaiting anomalous transactions...
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 2. CH-NATIVE LOGS COMMAND TERMINAL */}
      <div className="lg:col-span-2 p-5 rounded-xl border border-slate-900 bg-slate-950/40 backdrop-blur flex flex-col h-full max-h-[85vh]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-purple-400 animate-pulse" />
              <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-300">
                Multi-Agent Coordination Terminal
              </h4>
            </div>
            <p className="font-mono text-[9px] text-slate-500 uppercase mt-0.5">Live log dump of active background consensus validations</p>
          </div>

          {/* Search bar */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Search command logs..."
                value={logFilterText}
                onChange={(e) => setLogFilterText(e.target.value)}
                className="pl-8 pr-3 py-1 bg-slate-950/80 border border-slate-900 text-[10px] font-mono text-slate-200 placeholder-slate-600 rounded-lg focus:outline-none focus:border-purple-800 w-44"
              />
            </div>
          </div>
        </div>

        {/* Agent Filter Header Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 border-b border-slate-900/60 pb-3 mb-4 select-none">
          {agentsList.map(agent => (
            <button
              key={agent}
              onClick={() => setSelectedAgent(agent)}
              className={`px-2.5 py-1 text-[9px] font-mono tracking-wider rounded border cursor-pointer uppercase transition-all ${
                selectedAgent === agent 
                  ? 'bg-purple-950/30 text-purple-300 border-purple-800 shadow-[0_0_8px_rgba(168,85,247,0.15)] font-bold'
                  : 'bg-slate-950/40 text-slate-500 border-slate-900 hover:text-slate-350 hover:bg-slate-900'
              }`}
            >
              {agent === 'ALL' ? '● ALL CHANNELS' : agent}
            </button>
          ))}
        </div>

        {/* Terminal Log Output Area */}
        <div className="flex-1 bg-slate-950/90 border border-slate-900 rounded-lg p-4 font-mono text-[10px] space-y-2.5 overflow-y-auto max-h-[55vh] flex flex-col justify-start">
          <div className="text-[9px] text-slate-600 border-b border-slate-900 pb-1.5 flex items-center justify-between pointer-events-none select-none">
            <span>AEGIS CORE SUITE VER. 3.2 // SESSION HOST INITIATED</span>
            <span>SYSTEM STABLE // NO ERRORS EXECUTED</span>
          </div>

          {filteredLogs.map((log) => (
            <div key={log.id} className="flex items-start gap-2.5 hover:bg-slate-900/30 py-0.5 rounded px-1 transition-all">
              <span className="text-slate-600 shrink-0 select-none">
                [{new Date(log.timestamp).toISOString().substring(11, 19)}]
              </span>
              <span className={`font-black shrink-0 uppercase tracking-wide select-none ${
                log.agentName === 'DataAgent' ? 'text-blue-400' :
                log.agentName === 'FeatureAgent' ? 'text-emerald-400' :
                log.agentName === 'MLAgent' ? 'text-rose-400 animate-pulse' :
                log.agentName === 'GeminiAgent' ? 'text-indigo-400' :
                log.agentName === 'ValidatorAgent' ? 'text-amber-400' :
                'text-rose-500'
              }`}>
                {log.agentName}:
              </span>
              <span className={`leading-relaxed whitespace-pre-wrap break-words ${getLogTypeColor(log.type)}`}>
                {log.message}
              </span>
            </div>
          ))}

          {filteredLogs.length === 0 && (
            <div className="text-center py-20 text-slate-600 uppercase tracking-widest select-none font-mono">
              No matching coordination records found.
            </div>
          )}

          {/* Scrolling anchor */}
          <div ref={terminalEndRef} />
        </div>

        {/* Terminal footer status bar */}
        <div className="mt-3 py-2 px-3 border border-slate-900 rounded-lg bg-slate-950/65 flex items-center justify-between text-[9px] font-mono text-slate-500">
          <div className="flex items-center gap-1.5 select-none text-[8px]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>SPECTRE SUITE COPIED TO CORES</span>
          </div>
          <span className="uppercase text-[8px]">Buffer holding {filteredLogs.length} matching lines</span>
        </div>
      </div>
    </div>
  );
};

export default LiveDetectionFeed;

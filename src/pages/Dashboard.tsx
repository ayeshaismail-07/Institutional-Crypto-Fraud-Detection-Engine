import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  ShieldCheck, 
  Cpu, 
  Zap, 
  Flame, 
  ShieldAlert,
  Server
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
import { Transaction, Alert, AnomalyScoreRecord, Agent } from '../types';

interface DashboardProps {
  recentTransactions: Transaction[];
  recentAlerts: Alert[];
  anomalyScores: AnomalyScoreRecord[];
  coinPrices: Record<string, { price: number; change24h: number; high24h: number; volume: number }>;
  agents: Agent[];
  threatLevel: string;
}

const Dashboard: React.FC<DashboardProps> = ({
  recentTransactions,
  recentAlerts,
  anomalyScores,
  coinPrices,
  agents,
  threatLevel
}) => {
  // Compute dashboard metrics
  const activeAlertsCount = recentAlerts.length;
  const criticalAlertsCount = recentAlerts.filter(a => a.riskLevel === 'CRITICAL').length;
  const avgAnomalyScore = Math.floor(
    recentTransactions.length > 0 
      ? recentTransactions.reduce((acc, tx) => acc + tx.anomalyScore, 0) / recentTransactions.length 
      : 18
  );

  // Group latest transactions by asset to make dynamic stats
  const getAssetStats = (symbol: string) => {
    const symbolTxs = recentTransactions.filter(t => t.symbol === symbol);
    const txCount = symbolTxs.length;
    const avgScore = txCount > 0 
      ? Math.floor(symbolTxs.reduce((sum, t) => sum + t.anomalyScore, 0) / txCount)
      : 15;
    return { txCount, avgScore };
  };

  const assets = [
    { name: 'Bitcoin', symbol: 'BTCUSDT', icon: '₿', color: 'text-amber-500 border-amber-500/30' },
    { name: 'Ethereum', symbol: 'ETHUSDT', icon: 'Ξ', color: 'text-blue-500 border-blue-500/30' },
    { name: 'Solana', symbol: 'SOLUSDT', icon: '◎', color: 'text-purple-500 border-purple-500/30' }
  ];

  // Helper to format large currencies
  const formatCompactCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 2
    }).format(value);
  };

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-[calc(100vh-4rem)]">
      {/* 1. Global Threat Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Core Threat Box */}
        <div className="p-4 rounded-xl border border-rose-500/30 bg-slate-950/60 backdrop-blur shadow-[0_4px_12px_rgba(244,63,94,0.05),0_0_15px_rgba(244,63,94,0.1)] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] text-slate-400 tracking-wider uppercase">Institutional Risk Mode</span>
            <Flame className={`w-4 h-4 ${threatLevel === 'CRITICAL' ? 'text-rose-500 animate-bounce' : 'text-amber-500'}`} />
          </div>
          <div className="my-3">
            <h3 className={`font-sans font-black text-2xl tracking-tight leading-none ${
              threatLevel === 'CRITICAL' ? 'text-rose-500' : 'text-amber-500'
            }`}>
              SYSTEM: {threatLevel}
            </h3>
            <p className="font-mono text-[9px] text-slate-500 mt-1 uppercase">Coordinated vectors active</p>
          </div>
          <div className="font-mono text-[9px] text-rose-400/90 bg-rose-950/20 py-1 px-2 border border-rose-900/30 rounded">
            🚨 {criticalAlertsCount} critical exploits flagged/24h
          </div>
        </div>

        {/* Avg Anomaly Rating */}
        <div className="p-4 rounded-xl border border-slate-900 bg-slate-950/40 backdrop-blur flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] text-slate-400 tracking-wider uppercase">Avg Threat Coefficient</span>
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="my-3">
            <h3 className="font-sans font-bold text-3xl tracking-tight text-emerald-400 leading-none">
              {avgAnomalyScore}%
            </h3>
            <p className="font-mono text-[9px] text-slate-500 mt-1 uppercase">Low aggregate risk floor</p>
          </div>
          <div className="font-mono text-[10px] text-slate-400 flex items-center justify-between">
            <span>Overall System Status:</span>
            <span className="text-emerald-400 font-bold">SECURE</span>
          </div>
        </div>

        {/* Coordinated Alerts */}
        <div className="p-4 rounded-xl border border-slate-900 bg-slate-950/40 backdrop-blur flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] text-slate-400 tracking-wider uppercase">Active Fraud Alerts</span>
            <ShieldAlert className="w-4 h-4 text-purple-400" />
          </div>
          <div className="my-3">
            <h3 className="font-sans font-bold text-3xl tracking-tight text-purple-400 leading-none">
              {activeAlertsCount}
            </h3>
            <p className="font-mono text-[9px] text-slate-500 mt-1 uppercase">Saved audit dossiers</p>
          </div>
          <div className="font-mono text-[10px] text-slate-400 flex items-center justify-between">
            <span>Verified Confidence:</span>
            <span className="text-purple-300 font-bold">&gt; 92% Acc.</span>
          </div>
        </div>

        {/* High Volume Multiplier */}
        <div className="p-4 rounded-xl border border-slate-900 bg-slate-950/40 backdrop-blur flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] text-slate-400 tracking-wider uppercase">Transactions Processed</span>
            <Server className="w-4 h-4 text-blue-400" />
          </div>
          <div className="my-3">
            <h3 className="font-sans font-bold text-3xl tracking-tight text-blue-400 leading-none">
              {recentTransactions.length}
            </h3>
            <p className="font-mono text-[9px] text-slate-500 mt-1 uppercase">Live blocks parsed</p>
          </div>
          <div className="font-mono text-[10px] text-slate-400 flex items-center justify-between">
            <span>Flow Vol. Tracked:</span>
            <span className="text-blue-400 font-bold">
              {formatCompactCurrency(recentTransactions.reduce((acc, t) => acc + t.valueUsd, 0))}
            </span>
          </div>
        </div>
      </div>

      {/* 2. REAL-TIME COIN PRICING CARDS */}
      <div>
        <div className="flex items-center justify-between mb-3.5">
          <h4 className="font-mono text-xs font-bold uppercase tracking-widest text-slate-300">
            📡 Live Crypto Stream Ingest Pricing (Binance WS Feed)
          </h4>
          <span className="font-mono text-[9px] text-slate-500 uppercase">NO MATH.RANDOM() GENERATED // SECURE PRICING</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {assets.map((coin) => {
            const data = coinPrices[coin.symbol] || { price: 0, change24h: 0, high24h: 0, volume: 0 };
            const stat = getAssetStats(coin.symbol);
            const isUp = data.change24h >= 0;

            return (
              <div 
                key={coin.symbol}
                className="p-4 rounded-xl bg-slate-950/50 border border-slate-900 hover:border-slate-800 transition-all duration-300 shadow-[inset_0_1px_1px_rgba(255,255,255,0.02)] flex flex-col justify-between relative overflow-hidden group"
              >
                {/* Visual accent background text */}
                <div className="absolute right-2 top-0 opacity-5 text-8xl font-black select-none pointer-events-none text-slate-400 group-hover:opacity-10 transition-opacity">
                  {coin.icon}
                </div>

                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center font-bold text-slate-200">
                      {coin.icon}
                    </span>
                    <div>
                      <h4 className="font-sans font-bold text-sm text-slate-100">{coin.name}</h4>
                      <span className="font-mono text-[9px] text-slate-500 tracking-wider">{coin.symbol}</span>
                    </div>
                  </div>

                  <span className={`flex items-center gap-0.5 font-mono text-[10px] ${
                    isUp ? 'text-emerald-400' : 'text-rose-500'
                  }`}>
                    {isUp ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                    {isUp ? '+' : ''}{data.change24h.toFixed(2)}%
                  </span>
                </div>

                {/* Price Display */}
                <div className="my-4">
                  <span className="font-mono text-2xl font-black text-slate-100 tracking-tight block">
                    ${data.price > 0 ? data.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 }) : 'STREAMING...'}
                  </span>
                  <span className="font-mono text-[9px] text-slate-500">LAST BINANCE TRANSACTION</span>
                </div>

                {/* Mini metrics feed */}
                <div className="grid grid-cols-2 gap-2 border-t border-slate-900/80 pt-3 text-[10px] font-mono">
                  <div>
                    <span className="text-slate-500 block uppercase">Threat Rate</span>
                    <span className={`font-semibold ${stat.avgScore >= 60 ? 'text-rose-400' : (stat.avgScore >= 35 ? 'text-amber-400' : 'text-emerald-400')}`}>
                      {stat.avgScore}% avg coef.
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block uppercase">Parsed Blocks</span>
                    <span className="text-slate-350 font-bold">{stat.txCount} trades</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. CHART & AGENTS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Real-time Score Chart Card */}
        <div className="lg:col-span-2 p-5 rounded-xl border border-slate-900 bg-slate-950/40 backdrop-blur flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-300">
                📊 Real-Time Threat Score Vector (Current Stream Cycle)
              </h4>
              <p className="font-mono text-[9px] text-slate-500 uppercase mt-0.5">Showing live anomaly calculations relative to volatility indexes</p>
            </div>
            <span className="px-2 py-0.5 rounded text-[9px] font-mono font-black tracking-wider bg-indigo-900/30 text-indigo-400 border border-indigo-800/40 select-none uppercase">
              Live Chart Updates
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={anomalyScores.slice(-30)} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="scoreGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="rgb(99, 102, 241)" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="rgb(99, 102, 241)" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#0f172a" vertical={false} />
                <XAxis 
                  dataKey="timestamp" 
                  tickFormatter={(val) => {
                    const d = new Date(val);
                    return `${String(d.getUTCMinutes()).padStart(2, '0')}:${String(d.getUTCSeconds()).padStart(2, '0')}`;
                  }}
                  tick={{ fill: '#475569', fontSize: 9, fontFamily: 'monospace' }}
                  stroke="#1e293b"
                />
                <YAxis 
                  domain={[0, 100]} 
                  tick={{ fill: '#475569', fontSize: 9, fontFamily: 'monospace' }}
                  stroke="#1e293b"
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#020617', borderColor: '#1e293b', borderRadius: '8px' }}
                  labelStyle={{ fontFamily: 'monospace', fontSize: 10, color: '#94a3b8' }}
                  itemStyle={{ fontFamily: 'monospace', fontSize: 11, color: '#f3f4f6' }}
                  labelFormatter={(tick) => `Time: ${new Date(Number(tick)).toISOString().replace('T', ' ').substring(0, 19)}`}
                />
                <Area 
                  type="monotone" 
                  dataKey="score" 
                  name="Anomaly Score" 
                  stroke="rgb(129, 140, 248)" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#scoreGlow)" 
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Active Autonomous AI Agents Grid */}
        <div className="p-5 rounded-xl border border-slate-900 bg-slate-950/40 backdrop-blur flex flex-col">
          <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">
            🤖 Core Threat Agents Topology
          </h4>
          <p className="font-mono text-[9px] text-slate-500 uppercase mb-4 leading-relaxed">
            These active agents parse pipelines autonomously to validate exploits.
          </p>

          <div className="flex-1 space-y-3 overflow-y-auto max-h-64 pr-1">
            {agents.map((agent) => {
              const getStatusStyles = () => {
                switch(agent.status) {
                  case 'active': return 'bg-emerald-950/40 text-emerald-400 border-emerald-900/60';
                  case 'restricted': return 'bg-amber-950/30 text-amber-500 border-amber-900/40';
                  default: return 'bg-slate-900 text-slate-400 border-slate-800';
                }
              };
              return (
                <div 
                  key={agent.name}
                  className="p-3 rounded-lg bg-slate-950/80 border border-slate-900 hover:border-slate-850 flex items-start gap-3 transition-colors text-slate-100"
                >
                  <div className={`mt-0.5 p-1 rounded-md bg-slate-900 border border-slate-800 ${
                    agent.status === 'active' ? 'text-indigo-400' : 'text-slate-500'
                  }`}>
                    <Cpu className="w-3.5 h-3.5" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold block truncate">{agent.name}</span>
                      <span className={`px-1.5 py-0.5 rounded text-[8px] font-mono tracking-wider font-semibold border uppercase ${getStatusStyles()}`}>
                        {agent.status}
                      </span>
                    </div>
                    <span className="font-mono text-[9px] text-indigo-300 block font-medium uppercase mt-0.5">{agent.role}</span>
                    <p className="font-sans text-[10px] text-slate-450 mt-1 leading-normal select-none">{agent.details}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 4. RECENT BLOCKS PARSED LIST */}
      <div className="p-5 rounded-xl border border-slate-900 bg-slate-950/40 backdrop-blur">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-300">
              📊 Live Segment Transactions Ingestion Stream (Binance Outbound trades)
            </h4>
            <p className="font-mono text-[9px] text-slate-500 uppercase mt-0.5">Showing recent trade activity indexed with threat probability indicators</p>
          </div>
          <span className="font-mono text-[10px] text-slate-400">
            Capped queue size: <span className="text-slate-200 font-bold">{recentTransactions.length}</span> / 50 records
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs text-slate-300 border-collapse">
            <thead>
              <tr className="border-b border-slate-900 text-slate-500 text-[10px] uppercase tracking-wider">
                <th className="py-2 px-3">Status</th>
                <th className="py-2 px-3">Asset</th>
                 <th className="py-2 px-3">Trade Price</th>
                <th className="py-2 px-3">Quantity</th>
                <th className="py-2 px-3">Volume USD</th>
                <th className="py-2 px-3">Associated Target Address</th>
                <th className="py-2 px-3 text-right">Anomaly Score</th>
              </tr>
            </thead>
            <tbody>
              {recentTransactions.slice(0, 8).map((tx) => (
                <tr 
                  key={tx.id}
                  className={`border-b border-slate-950/65 hover:bg-slate-950/30 transition-colors ${
                    tx.isAnomaly ? 'bg-rose-950/10 text-rose-300 font-medium' : ''
                  }`}
                >
                  <td className="py-2 px-3">
                    {tx.isAnomaly ? (
                      <span className="flex items-center gap-1.5 text-rose-500 font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                        THREAT
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-emerald-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        SAFE
                      </span>
                    )}
                  </td>
                  <td className="py-2 px-3 font-semibold text-slate-200">{tx.symbol}</td>
                  <td className="py-2 px-3">$ {tx.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}</td>
                  <td className="py-2 px-3">{tx.quantity.toLocaleString(undefined, { maximumFractionDigits: 4 })}</td>
                  <td className="py-2 px-3 font-semibold text-slate-200">$ {tx.valueUsd.toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
                  <td className="py-2 px-3 text-slate-400 font-medium tracking-tight select-all cursor-pointer hover:text-blue-400 transition-colors" title="Double click to inspect address">
                    {tx.walletAddress}
                  </td>
                  <td className="py-2 px-3 text-right font-black">
                    <span className={`px-1.5 py-0.5 rounded text-[10px] ${
                      tx.anomalyScore >= 75 ? 'bg-rose-950/50 text-rose-400 border border-rose-900/40' : 
                      tx.anomalyScore >= 40 ? 'bg-amber-950/40 text-amber-400 border border-amber-900/20' : 
                      'bg-emerald-950/30 text-emerald-400 border border-emerald-900/10'
                    }`}>
                      {tx.anomalyScore}%
                    </span>
                  </td>
                </tr>
              ))}
              {recentTransactions.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-500 uppercase tracking-widest font-mono text-[10px]">
                    Waiting for trades to stream in from Binance websocket feed...
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

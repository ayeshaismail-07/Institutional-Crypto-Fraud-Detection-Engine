import React, { useState, useEffect } from 'react';
import { 
  Database, 
  Cpu, 
  Clock, 
  RefreshCw
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  onReset: () => void;
  transactionsCount: number;
  alertsCount: number;
}

const Navbar: React.FC<NavbarProps> = ({ 
  activeTab, 
  onReset,
  transactionsCount,
  alertsCount
}) => {
  const [time, setTime] = useState<string>('');
  const [isResetting, setIsResetting] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toISOString().replace('T', ' ').substring(0, 19) + ' UTC');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleResetClick = async () => {
    setIsResetting(true);
    await onReset();
    setTimeout(() => {
      setIsResetting(false);
    }, 1000);
  };

  const getPageTitle = () => {
    switch(activeTab) {
      case 'dashboard': return 'REAL-TIME EXPLOIT MONITOR';
      case 'live-feed': return 'LIVE SPECTRUM DETECTION';
      case 'wallet-intel': return 'CONSENSUS WALLET ATTRIBUTION';
      case 'analytics': return 'FINTECH CRYPTO INTELLIGENCE';
      case 'alert-center': return 'EMERGENCY DISPATCH NODES';
      default: return 'AEGIS FINTECH SECURITY CONTROL';
    }
  };

  const getPageSub = () => {
    switch(activeTab) {
      case 'dashboard': return 'Interpreting real-time Binance stream trades under Isolation Forest ML matrices.';
      case 'live-feed': return 'Multi-agent coordination pipeline logs and natural language threat reasoning.';
      case 'wallet-intel': return 'Monitoring high-risk mixer accounts, flashloan vectors, and circular flow graphs.';
      case 'analytics': return 'Statistical volatility distributions, anomaly heatmap vectors, and risk trend metrics.';
      case 'alert-center': return 'Finalized critical exploits reviewed by Validator Agent filters.';
      default: return 'Core executive command control.';
    }
  };

  return (
    <header id="cyber_navbar" className="h-16 border-b border-slate-900/60 bg-slate-950/40 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-10">
      <div>
        <h2 className="font-mono text-sm font-bold tracking-wider text-slate-100 flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-ping" />
          {getPageTitle()}
        </h2>
        <p className="font-mono text-[9px] text-slate-500 tracking-wide select-none">
          {getPageSub()}
        </p>
      </div>

      <div className="flex items-center gap-6">
        {/* Statistics Widgets */}
        <div className="hidden lg:flex items-center gap-4 border-r border-slate-900/80 pr-6">
          {/* db widget */}
          <div className="flex items-center gap-2 font-mono text-[10px]">
            <Database className="w-3.5 h-3.5 text-slate-500" />
            <div>
              <span className="text-slate-400 block tracking-wider uppercase">Transactions Ingested</span>
              <span className="text-slate-200 font-bold">{transactionsCount} node-blocks</span>
            </div>
          </div>

          {/* agent state widget */}
          <div className="flex items-center gap-2 font-mono text-[10px]">
            <Cpu className="w-3.5 h-3.5 text-slate-500" />
            <div>
              <span className="text-slate-400 block tracking-wider uppercase">Active Threat Agents</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                6 / 6 OPERATIONAL
              </span>
            </div>
          </div>
        </div>

        {/* Clock */}
        <div className="flex items-center gap-2 font-mono text-[10px] text-slate-400 bg-slate-950/60 border border-slate-900 px-3 py-1.5 rounded">
          <Clock className="w-3.5 h-3.5 text-blue-500" />
          <span>{time}</span>
        </div>

        {/* Database Clear Button */}
        <button
          onClick={handleResetClick}
          disabled={isResetting}
          className="flex items-center gap-1.5 font-mono text-[10px] text-red-400 hover:text-red-300 bg-red-950/10 hover:bg-red-950/25 border border-red-900/40 hover:border-red-800/80 px-2.5 py-1.5 rounded cursor-pointer transition-all active:scale-95 disabled:opacity-50"
          title="Reset database to seed defaults"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isResetting ? 'animate-spin' : ''}`} />
          <span>RESET DB</span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;

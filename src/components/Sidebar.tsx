import React from 'react';
import { 
  ShieldAlert, 
  Activity, 
  Wallet, 
  BarChart3, 
  Bell, 
  Terminal, 
  Settings, 
  ShieldCheck,
  Zap
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  threatLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  connectionStatus: 'connected' | 'disconnected' | 'reconnecting';
  alertsCount: number;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab, 
  setActiveTab, 
  threatLevel, 
  connectionStatus,
  alertsCount
}) => {
  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: Activity, color: 'text-blue-400 border-blue-400' },
    { id: 'live-feed', name: 'Live Detection', icon: Terminal, color: 'text-purple-400 border-purple-400' },
    { id: 'wallet-intel', name: 'Wallet Intel', icon: Wallet, color: 'text-emerald-400 border-emerald-400' },
    { id: 'analytics', name: 'Analytics', icon: BarChart3, color: 'text-amber-400 border-amber-400' },
    { id: 'alert-center', name: 'Alert Center', icon: Bell, badge: alertsCount, color: 'text-rose-400 border-rose-400' },
  ];

  const getThreatColor = () => {
    switch(threatLevel) {
      case 'CRITICAL': return 'bg-rose-500 text-rose-100 border-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.4)] animate-pulse';
      case 'HIGH': return 'bg-orange-500 text-orange-100 border-orange-400';
      case 'MEDIUM': return 'bg-amber-500 text-amber-950 border-amber-400';
      default: return 'bg-emerald-500 text-emerald-950 border-emerald-400';
    }
  };

  return (
    <aside id="cyber_sidebar" className="w-64 border-r border-slate-800/80 bg-slate-950/80 backdrop-blur-md flex flex-col h-screen sticky top-0">
      {/* Title Header */}
      <div className="p-6 border-b border-slate-900 flex items-center gap-3">
        <ShieldAlert className="w-8 h-8 text-blue-500 drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
        <div>
          <h1 className="font-sans font-bold text-sm tracking-widest text-slate-100 uppercase">
            Aegis AI
          </h1>
          <span className="font-mono text-[9px] text-slate-500 uppercase tracking-widest block">
            Institutional Fraud Control
          </span>
        </div>
      </div>

      {/* Network Health Check */}
      <div className="px-6 py-4 border-b border-slate-900 bg-slate-950/30">
        <div className="flex items-center justify-between mb-2">
          <span className="font-mono text-[10px] text-slate-400 uppercase tracking-wider">威胁等级 Threat Level</span>
          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider ${getThreatColor()}`}>
            {threatLevel}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] text-slate-400 uppercase tracking-wider">节点 Feed Connection</span>
          <span className="flex items-center gap-1.5 font-mono text-[10px]">
            <span className={`w-2 h-2 rounded-full ${
              connectionStatus === 'connected' ? 'bg-emerald-500 animate-ping' : 
              connectionStatus === 'reconnecting' ? 'bg-amber-500 animate-spin' : 
              'bg-rose-600'
            }`} />
            <span className={
              connectionStatus === 'connected' ? 'text-emerald-400' :
              connectionStatus === 'reconnecting' ? 'text-amber-400' :
              'text-rose-500'
            }>
              {connectionStatus.toUpperCase()}
            </span>
          </span>
        </div>
      </div>

      {/* Nav Menu */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-lg font-mono text-xs tracking-wider transition-all duration-300 ${
                isActive 
                  ? 'bg-slate-900 border-l-4 text-white font-medium shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_0_10px_rgba(15,23,42,0.8)]'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/40 border-l-4 border-transparent'
              } ${isActive ? item.color : 'hover:border-slate-800'}`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? '' : 'text-slate-500'}`} />
                <span>{item.name}</span>
              </div>
              {item.badge && item.badge > 0 ? (
                <span className="px-1.5 py-0.5 rounded-full text-[9px] font-sans font-extrabold bg-rose-600 text-rose-50 border border-rose-500 shadow-[0_0_5px_rgba(220,38,38,0.5)]">
                  {item.badge}
                </span>
              ) : null}
            </button>
          );
        })}
      </nav>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-slate-900 bg-slate-950/40 text-[10px] font-mono text-slate-500 space-y-1">
        <div className="flex items-center gap-1">
          <Zap className="w-3 h-3 text-amber-500" />
          <span>V3.5-FLASH INFRA</span>
        </div>
        <div>STABLE ENVIRONMENT // CH-NATIVE</div>
        <div className="text-[9px] text-slate-600 mt-2">© 2026 AEGIS THREAT LABS</div>
      </div>
    </aside>
  );
};

export default Sidebar;

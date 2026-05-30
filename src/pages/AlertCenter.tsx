import React, { useState } from 'react';
import { 
  Bell, 
  ShieldAlert, 
  Search, 
  Filter, 
  Clock, 
  Cpu, 
  CheckCircle, 
  ArrowRight,
  UserCheck,
  Percent,
  X,
  Volume2
} from 'lucide-react';
import { Alert } from '../types';

interface AlertCenterProps {
  recentAlerts: Alert[];
  criticalPopup: Alert | null;
  setCriticalPopup: (alert: Alert | null) => void;
}

const AlertCenter: React.FC<AlertCenterProps> = ({
  recentAlerts,
  criticalPopup,
  setCriticalPopup
}) => {
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');
  const [assetFilter, setAssetFilter] = useState<string>('ALL');

  // Filter alerts
  const filteredAlerts = recentAlerts.filter(alert => {
    const matchesSeverity = severityFilter === 'ALL' || alert.riskLevel === severityFilter;
    const matchesAsset = assetFilter === 'ALL' || alert.symbol === assetFilter;
    return matchesSeverity && matchesAsset;
  });

  const getRiskStyle = (level: string) => {
    switch(level) {
      case 'CRITICAL': return 'bg-rose-500/10 text-rose-500 border-rose-500/30 shadow-[0_0_8px_rgba(244,63,94,0.1)]';
      case 'HIGH': return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
      case 'MEDIUM': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      default: return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    }
  };

  return (
    <div className="p-6 h-[calc(100vh-4rem)] overflow-y-auto space-y-6 relative">
      {/* 1. SEVERITY & ASSETS FILTERS BAR */}
      <div className="p-4 rounded-xl border border-slate-900 bg-slate-950/40 backdrop-blur flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-500" />
          <span className="font-mono text-xs font-bold uppercase text-slate-400 tracking-wider"> Forensics Filtering Filters</span>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Severity tabs */}
          <div className="flex items-center gap-1 bg-slate-950 border border-slate-900 p-1 rounded-lg">
            {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM'].map(lvl => (
              <button
                key={lvl}
                onClick={() => setSeverityFilter(lvl)}
                className={`px-3 py-1 font-mono text-[10px] tracking-wider rounded cursor-pointer transition-all ${
                  severityFilter === lvl 
                    ? 'bg-rose-600/20 border border-rose-500/40 text-rose-300 font-bold' 
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>

          {/* Assets dropdown equivalent */}
          <div className="flex items-center gap-1 bg-slate-950 border border-slate-900 p-1 rounded-lg">
            {['ALL', 'BTCUSDT', 'ETHUSDT', 'SOLUSDT'].map(sym => (
              <button
                key={sym}
                onClick={() => setAssetFilter(sym)}
                className={`px-3 py-1 font-mono text-[10px] tracking-wider rounded cursor-pointer transition-all ${
                  assetFilter === sym
                    ? 'bg-blue-600/20 border border-blue-500/40 text-blue-300 font-bold' 
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {sym.replace('USDT', '')}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. ALERTS LOG DOSSIERS LIST */}
      <div className="space-y-4">
        {filteredAlerts.map((alert) => (
          <div 
            key={alert.id}
            className={`p-5 rounded-xl border flex flex-col md:flex-row gap-5 transition-all duration-300 bg-slate-950/40 backdrop-blur hover:bg-slate-950/60 ${
              getRiskStyle(alert.riskLevel)
            }`}
          >
            {/* Alarm Severity Badge side */}
            <div className="md:w-44 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-900/60 pb-4 md:pb-0 md:pr-5 shrink-0 font-mono">
              <div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase border ${
                  alert.riskLevel === 'CRITICAL' ? 'bg-rose-950/40 text-rose-400 border-rose-800' :
                  alert.riskLevel === 'HIGH' ? 'bg-orange-950/30 text-orange-400 border-orange-900' :
                  'bg-amber-950/20 text-amber-400 border-amber-900'
                }`}>
                  {alert.riskLevel} threat
                </span>
                <span className="font-sans font-bold text-slate-100 block mt-3 text-sm">{alert.symbol}</span>
                <span className="text-[10px] text-slate-500 mt-1 block select-none">
                  {new Date(alert.timestamp).toISOString().replace('T', ' ').substring(0, 19)} UTC
                </span>
              </div>

              <div className="mt-4 text-[9px] text-slate-500 uppercase tracking-widest block font-bold">
                SCORE: <span className="text-slate-200 font-black">{alert.anomalyScore}/100</span>
              </div>
            </div>

            {/* AI Reasoning & Details block */}
            <div className="flex-1 space-y-4 min-w-0">
              <div className="font-sans text-xs text-slate-300 leading-relaxed font-normal">
                <span className="font-mono text-[9px] text-indigo-400 font-bold block uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <Cpu className="w-3.5 h-3.5 mr-0.5" />
                  Gemini-3.5-flash Cognitive Security Explanation:
                </span>
                &ldquo;{alert.reasoning}&rdquo;
              </div>

              {/* Transactions numbers details row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-950/60 p-3 rounded-lg border border-slate-900/80 font-mono text-[10px] text-slate-350">
                <div>
                  <span className="text-slate-500 block uppercase text-[8px]">Index Price</span>
                  <span className="text-slate-200 font-semibold">$ {alert.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
                <div>
                  <span className="text-slate-500 block uppercase text-[8px]">Transacted size</span>
                  <span className="text-slate-200 font-semibold">{alert.quantity.toFixed(4)} tokens</span>
                </div>
                <div>
                  <span className="text-slate-500 block uppercase text-[8px]">Flow Value</span>
                  <span className="text-rose-400 font-bold">$ {alert.valueUsd.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                </div>
                <div>
                  <span className="text-slate-500 block uppercase text-[8px]">Forensics target</span>
                  <span className="text-blue-400 block truncate cursor-copy font-semibold select-all" title="Click to copy Address">
                    {alert.walletAddress}
                  </span>
                </div>
              </div>

              {/* Validation specs row */}
              <div className="flex flex-wrap items-center gap-6 font-mono text-[9px] text-slate-500">
                <div className="flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Validator Confidence: <span className="text-slate-300 font-bold">{(alert.validatorConfidence * 100).toFixed(0)}%</span></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Percent className="w-3.5 h-3.5 text-amber-550" />
                  <span>False Alarm Boundary: <span className="text-slate-300 font-bold">{(alert.falsePositiveProb * 100).toFixed(2)}%</span></span>
                </div>
              </div>
            </div>
          </div>
        ))}

        {filteredAlerts.length === 0 && (
          <div className="text-center py-24 select-none border border-dashed border-slate-900 rounded-2xl flex flex-col items-center justify-center space-y-2">
            <CheckCircle className="w-10 h-10 text-slate-700" />
            <p className="font-mono text-[10px] text-slate-500 uppercase tracking-widest leading-loose">
              No matching alerts logged.<br/>System remains stable inside specified boundaries.
            </p>
          </div>
        )}
      </div>

      {/* 3. NEW CRITICAL ALERTS EMERGENCY SCREEN OVERLAY FLASHER */}
      {criticalPopup && (
        <div 
          id="critical_alert_popup"
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
        >
          {/* Pulsing hazard glow box */}
          <div className="w-full max-w-lg rounded-2xl border-2 border-rose-500 bg-slate-950 p-6 flex flex-col gap-5 text-slate-100 shadow-[0_0_50px_rgba(244,63,94,0.3)] animate-bounce relative overflow-hidden" style={{ animationDuration: '3s' }}>
            {/* Visual alert strobe light */}
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-rose-600 via-red-500 to-rose-600 animate-pulse" />

            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <ShieldAlert className="w-8 h-8 text-rose-500 drop-shadow-[0_0_10px_rgba(244,63,94,0.6)] animate-pulse" />
                <div>
                  <span className="font-mono text-[10px] text-rose-500 font-extrabold uppercase tracking-widest block">EMERGENCY ALERT THREAT INTRUSION</span>
                  <h3 className="font-sans font-black text-rose-100 uppercase tracking-tight text-lg mt-0.5">CRITICAL EXPLOIT PIPELINE</h3>
                </div>
              </div>

              <button
                onClick={() => setCriticalPopup(null)}
                className="p-1 px-2.5 rounded bg-rose-950/40 text-rose-400 hover:text-rose-100 font-mono text-[10px] border border-rose-900 transition-colors cursor-pointer flex items-center justify-center gap-1"
                title="Acknowledge alert and resume operations"
              >
                <X className="w-3.5 h-3.5" />
                <span>OVERRIDE DEVIATION</span>
              </button>
            </div>

            <div className="p-4 rounded-xl bg-rose-950/10 border border-rose-900/30 text-xs text-rose-300 font-mono space-y-3 leading-normal">
              <div>
                <dt className="text-slate-500 block uppercase text-[8px] tracking-wider mb-0.5">Symbol Asset class</dt>
                <dd className="font-bold text-rose-100">{criticalPopup.symbol}</dd>
              </div>
              <div>
                <dt className="text-slate-500 block uppercase text-[8px] tracking-wider mb-0.5">Trade Metrics Volume</dt>
                <dd className="font-medium text-rose-100">
                  {criticalPopup.quantity.toLocaleString(undefined, { maximumFractionDigits: 4 })} tokens @ ${criticalPopup.price.toLocaleString(undefined, { minimumFractionDigits: 2 })} USDT
                </dd>
              </div>
              <div>
                <dt className="text-slate-500 block uppercase text-[8px] tracking-wider mb-1">Expert Reasoning Analogy</dt>
                <dd className="italic bg-rose-950/20 p-2.5 border border-rose-900/40 rounded leading-relaxed text-rose-350">
                  &ldquo;{criticalPopup.reasoning}&rdquo;
                </dd>
              </div>
            </div>

            <div className="flex items-center justify-between text-[10px] font-mono border-t border-slate-900 pt-3 select-none">
              <span className="text-slate-500">Forensics ID: {criticalPopup.id}</span>
              <span className="text-rose-400 bg-rose-950/40 px-2 py-0.5 rounded font-bold border border-rose-900/40 flex items-center gap-1">
                <Volume2 className="w-3 h-3 animate-bounce" />
                SOUND SIMULATING ACTIVE
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlertCenter;

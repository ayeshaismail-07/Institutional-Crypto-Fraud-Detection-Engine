import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar.tsx';
import Navbar from './components/Navbar.tsx';
import CyberGrid from './components/CyberGrid.tsx';
import Dashboard from './pages/Dashboard.tsx';
import LiveDetectionFeed from './pages/LiveDetectionFeed.tsx';
import WalletIntelligence from './pages/WalletIntelligence.tsx';
import Analytics from './pages/Analytics.tsx';
import AlertCenter from './pages/AlertCenter.tsx';

import { Transaction, Alert, Agent, AgentLog, AnomalyScoreRecord } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'reconnecting'>('disconnected');

  // Core real-time state nodes
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [recentAlerts, setRecentAlerts] = useState<Alert[]>([]);
  const [anomalyScores, setAnomalyScores] = useState<AnomalyScoreRecord[]>([]);
  const [agentLogs, setAgentLogs] = useState<AgentLog[]>([]);
  const [criticalPopup, setCriticalPopup] = useState<Alert | null>(null);

  // Cached coin prices
  const [coinPrices, setCoinPrices] = useState<Record<string, { price: number; change24h: number; high24h: number; volume: number }>>({
    BTCUSDT: { price: 68150.0, change24h: 1.45, high24h: 68600.0, volume: 22405 },
    ETHUSDT: { price: 3418.5, change24h: -0.85, high24h: 3480.0, volume: 184500 },
    SOLUSDT: { price: 181.2, change24h: 4.82, high24h: 184.5, volume: 924000 }
  });

  // Dynamic system health values
  const [threatLevel, setThreatLevel] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'>('LOW');

  // Hardcoded agents configuration matching server-side structures
  const agents: Agent[] = [
    { name: 'DataAgent', role: 'Ingest & Normalize', status: connectionStatus === 'connected' ? 'active' : 'idle', details: 'Listening to BTCUSDT, ETHUSDT, SOLUSDT Binance Streams' },
    { name: 'FeatureAgent', role: 'Statistical Multi-Feature Generation', status: 'active', details: 'Analyzing sliding variance and volatility arrays' },
    { name: 'MLAgent', role: 'Isolation Forest Anomaly Assessment', status: 'active', details: 'Classifying threat probability indices from multi-feature vectors' },
    { name: 'GeminiAgent', role: 'Cognitive Context Explanation', status: 'active', details: 'Generating structural 1-2 sentence threat analyses via Gemini-3.5-flash' },
    { name: 'ValidatorAgent', role: 'Rigid Verification filter', status: 'active', details: 'Compiling dynamic validation vectors and false-alarm coefficients' },
    { name: 'AlertAgent', role: 'Global UI Dispatch Router', status: 'active', details: 'Streaming security packets directly down UI clients socket' }
  ];

  // Synchronize overall system threat rating based on available critical alerts
  useEffect(() => {
    const criticalCount = recentAlerts.filter(a => a.riskLevel === 'CRITICAL').length;
    const highCount = recentAlerts.filter(a => a.riskLevel === 'HIGH').length;
    if (criticalCount > 0) {
      setThreatLevel('CRITICAL');
    } else if (highCount > 0) {
      setThreatLevel('HIGH');
    } else {
      setThreatLevel('LOW');
    }
  }, [recentAlerts]);

  // Audio simulation trigger (sound simulation indicator)
  const triggerAudioSiren = () => {
    try {
      // Create oscillator synthesis for futuristic cyber warning sound
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc1 = audioCtx.createOscillator();
      const osc2 = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(220, audioCtx.currentTime); // low pitch rumble
      osc1.frequency.exponentialRampToValueAtTime(440, audioCtx.currentTime + 1.2);

      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(440, audioCtx.currentTime); // high siren swoop
      osc2.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 1.2);

      gainNode.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 1.2);

      osc1.connect(gainNode);
      osc2.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      osc1.start();
      osc2.start();
      osc1.stop(audioCtx.currentTime + 1.5);
      osc2.stop(audioCtx.currentTime + 1.5);
    } catch (e) {
      // Fail silently if browser audio block policies are active
      console.log('Audio indicators ignored because of browse interaction policy directives.');
    }
  };

  // Setup WebSocket connection
  useEffect(() => {
    let ws: WebSocket | null = null;
    let reconnectTimeout: NodeJS.Timeout | null = null;

    const connectWebsocket = () => {
      setConnectionStatus('reconnecting');
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/ws/live-alerts`;

      console.log(`Connecting UI websocket stream source: ${wsUrl}`);
      ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        setConnectionStatus('connected');
        console.log('UI WebSockets pipeline unlocked safely.');
      };

      ws.onmessage = (event) => {
        try {
          const envelope = JSON.parse(event.data);
          const type = envelope.type;
          const payload = envelope.data;

          switch (type) {
            case 'init_state':
              if (payload.recentAlerts) setRecentAlerts(payload.recentAlerts);
              if (payload.recentTransactions) setRecentTransactions(payload.recentTransactions);
              if (payload.anomalyScores) setAnomalyScores(payload.anomalyScores);
              if (payload.agentLogs) setAgentLogs(payload.agentLogs);
              break;

            case 'transaction':
              const newTx = payload as Transaction;
              // Prepend to transactions queue
              setRecentTransactions(prev => {
                const updated = [newTx, ...prev];
                return updated.slice(0, 100); // cap size at 100 for high rendering performance
              });

              // Dynamic coin-ticker caching update
              setCoinPrices(prev => {
                const current = prev[newTx.symbol] || { price: 0, change24h: 1.2, high24h: 0, volume: 1000 };
                const priceMove = newTx.price - current.price;
                const pctMove = current.price > 0 ? (priceMove / current.price) * 100 : 0.05;
                return {
                  ...prev,
                  [newTx.symbol]: {
                    price: newTx.price,
                    change24h: current.change24h + pctMove,
                    high24h: Math.max(current.high24h, newTx.price),
                    volume: current.volume + Math.floor(newTx.quantity)
                  }
                };
              });
              break;

            case 'alert':
              const alertObj = payload as Alert;
              // Prepend to alert center dossier
              setRecentAlerts(prev => [alertObj, ...prev]);

              // Check if threat rating requires popups
              if (alertObj.riskLevel === 'CRITICAL') {
                setCriticalPopup(alertObj);
                triggerAudioSiren();
              }
              break;

            case 'stream_status':
              // Handle optional indicators update if any
              break;

            case 'agent_log':
            default:
              // Fallback logs parsing if any
              break;
          }
        } catch (e) {
          console.error('WebSocket envelope decoding failed:', e);
        }
      };

      ws.onclose = () => {
        setConnectionStatus('disconnected');
        console.log('UI WebSockets closed. Scheduling backup connection.');
        reconnectTimeout = setTimeout(() => {
          connectWebsocket();
        }, 5000); // retry every 5s if disconnected
      };

      ws.onerror = (err) => {
        console.error('UI WebSockets encountered exception:', err);
        setConnectionStatus('disconnected');
        ws?.close();
      };
    };

    connectWebsocket();

    // Warm-up API polling to verify fallback statistics
    const fetchInitStats = async () => {
      try {
        const rAlerts = await fetch('/api/alerts?limit=50').then(r => r.json());
        const rTxs = await fetch('/api/latest?limit=100').then(r => r.json());
        const rAgents = await fetch('/api/agents/status').then(r => r.json());

        if (rAlerts && Array.isArray(rAlerts)) setRecentAlerts(rAlerts);
        if (rTxs && Array.isArray(rTxs)) setRecentTransactions(rTxs);
        if (rAgents && rAgents.logs) setAgentLogs(rAgents.logs);
      } catch (e) {
        console.log('HTTP fallback polling skipped (WebSocket pre-emption holds precedence).');
      }
    };

    fetchInitStats();

    // Dynamic tick updates for charts timeline fallback (prevents static charting)
    const statsInterval = setInterval(fetchInitStats, 15000);

    return () => {
      if (ws) ws.close();
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
      clearInterval(statsInterval);
    };
  }, []);

  // System Database Purge trigger
  const handleSystemRestoreReset = async () => {
    try {
      const response = await fetch('/api/system/reset', { method: 'POST' });
      const resData = await response.json();
      if (resData.status === 'success') {
        // Empty state nodes to trigger animation resets
        setRecentAlerts([]);
        setRecentTransactions([]);
        setAgentLogs([]);
        setCriticalPopup(null);
        console.log('Intelligence records flushed. Seeded state refreshed.');
      }
    } catch (e) {
      console.error('System reset request error:', e);
    }
  };

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard
            recentTransactions={recentTransactions}
            recentAlerts={recentAlerts}
            anomalyScores={anomalyScores}
            coinPrices={coinPrices}
            agents={agents}
            threatLevel={threatLevel}
          />
        );
      case 'live-feed':
        return (
          <LiveDetectionFeed
            recentTransactions={recentTransactions}
            agentLogs={agentLogs}
          />
        );
      case 'wallet-intel':
        return <WalletIntelligence />;
      case 'analytics':
        return (
          <Analytics
            anomalyScores={anomalyScores}
            recentAlerts={recentAlerts}
          />
        );
      case 'alert-center':
        return (
          <AlertCenter
            recentAlerts={recentAlerts}
            criticalPopup={criticalPopup}
            setCriticalPopup={setCriticalPopup}
          />
        );
      default:
        return (
          <div className="p-12 text-center text-slate-500 font-mono uppercase">
            Tab node out of bounds of current Command Module.
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-black text-slate-100 font-sans selection:bg-indigo-900/40">
      {/* Moving Technical Background */}
      <CyberGrid />

      {/* Main Structural Layout Side Panel */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        threatLevel={threatLevel}
        connectionStatus={connectionStatus}
        alertsCount={recentAlerts.length}
      />

      {/* Primary Work Zone Frame */}
      <div className="flex-1 flex flex-col min-w-0 bg-transparent">
        <Navbar
          activeTab={activeTab}
          onReset={handleSystemRestoreReset}
          transactionsCount={recentTransactions.length}
          alertsCount={recentAlerts.length}
        />

        {/* Dynamic Nested Page view */}
        <main className="flex-1 overflow-hidden">
          {renderActiveView()}
        </main>
      </div>
    </div>
  );
}

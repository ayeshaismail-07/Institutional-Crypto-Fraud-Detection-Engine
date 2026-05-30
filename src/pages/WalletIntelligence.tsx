import React, { useState } from 'react';
import { 
  Wallet, 
  Search, 
  ShieldAlert, 
  Activity, 
  Network, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  Database,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

interface WalletState {
  address: string;
  label: string;
  riskScore: number;
  category: 'Mixer Receiver' | 'Sybil Attacker' | 'Flashloan Exploiter' | 'Unknown Arbitrageur';
  throughput: string;
  linkedEntities: number;
  behaviors: { name: string; status: boolean; detail: string }[];
  connections: { label: string; address: string; role: string; amount: string; risk: 'low' | 'medium' | 'high' }[];
}

const WalletIntelligence: React.FC = () => {
  const suspectRegistry: WalletState[] = [
    {
      address: '0xef8c54ff1a0525164d1cd9a2be7ebcdb397bf0d5',
      label: 'Tornado.Cash Intermediate Router B',
      riskScore: 94,
      category: 'Mixer Receiver',
      throughput: '$14.2M USD (equivalent)',
      linkedEntities: 14,
      behaviors: [
        { name: 'Mixer interaction patterns', status: true, detail: 'Receiving successive 100 ETH splits.' },
        { name: 'Rapid sequence deposits', status: true, detail: 'Transactions spaced by steady 12-second margins.' },
        { name: 'Gas fee obfuscation origin', status: true, detail: 'Initial fees paid by anonymous intermediary contracts.' },
        { name: 'Coordinated exit pooling', status: false, detail: 'Consolidated flow to Centralized Exchange hot-wallets.' }
      ],
      connections: [
        { label: 'Tornado.Cash Pool', address: '0x7777...8888', role: 'Mixer Source', amount: '4,103.5 ETH', risk: 'high' },
        { label: 'Proxy Relayer 14', address: '0xf92c...e01d', role: 'Relay Router', amount: '120.0 ETH', risk: 'high' },
        { label: 'Binance Hot-Vault', address: '0x2819...ce88', role: 'Exchange Gate', amount: '18.4 ETH', risk: 'low' },
        { label: 'Attributed Arbitrage Contract', address: '0x12a9...fd51', role: 'Fee Producer', amount: '15.5 ETH', risk: 'high' }
      ]
    },
    {
      address: '0x3c2ecdd9eefa6324dcd9a5beee9bfbfe397bc0d7',
      label: 'Euler Exploit Association Proxy',
      riskScore: 89,
      category: 'Flashloan Exploiter',
      throughput: '$8.9M USD (equivalent)',
      linkedEntities: 8,
      behaviors: [
        { name: 'Mixer interaction patterns', status: false, detail: 'Zero tornado.cash footprints detected during timeframe.' },
        { name: 'Rapid sequence deposits', status: true, detail: '23 transactions executed within a single block header.' },
        { name: 'Gas fee obfuscation origin', status: true, detail: 'Coordinated contract generation gas from flashloan reserve.' },
        { name: 'Coordinated exit pooling', status: true, detail: 'Funds funneled to multichip liquidity bridge routers.' }
      ],
      connections: [
        { label: 'Euler Hack Contract', address: '0xba11...5224', role: 'Exploit Module', amount: '2,900,000 DAI', risk: 'high' },
        { label: 'Curve.Fi StETH/ETH Pool', address: '0xdc24...b0ed', role: 'Liquidity Provider', amount: '1,500 ETH', risk: 'low' },
        { label: 'UniSwap Router V3', address: '0xe592...9190', role: 'Slippage Router', amount: '450.0 ETH', risk: 'medium' },
        { label: 'Hop Protocol Bridge', address: '0xb890...cd45', role: 'Multichain Bridge', amount: '350.0 ETH', risk: 'high' }
      ]
    },
    {
      address: '0x9c3d4a64ca1cd1d4ad0ad7be3f97ca195ce6368d',
      label: 'Dynamic Sybil Node #4119',
      riskScore: 78,
      category: 'Sybil Attacker',
      throughput: '$1.4M USD (equivalent)',
      linkedEntities: 45,
      behaviors: [
        { name: 'Mixer interaction patterns', status: false, detail: 'Direct exchange fund injections.' },
        { name: 'Rapid sequence deposits', status: true, detail: 'Distributing micro-gas values to 40 distinct sub-accounts.' },
        { name: 'Gas fee obfuscation origin', status: false, detail: 'Standard bridge contracts used for gas origin.' },
        { name: 'Coordinated exit pooling', status: true, detail: 'Consolidated collection contracts routing sweep withdrawals.' }
      ],
      connections: [
        { label: 'Airdrop Claim Smart-Contract', address: '0x00aa...11bb', role: 'Target Vault', amount: '450,000 tokens', risk: 'medium' },
        { label: 'Primary Funding Wallet', address: '0x9021...bcdd', role: 'Sybil Parent', amount: '84.2 ETH', risk: 'high' },
        { label: 'Sweeper Intermediary Vault', address: '0xcccc...eeff', role: 'Aggregation Node', amount: '110,000 DAI', risk: 'high' }
      ]
    }
  ];

  const [searchAddress, setSearchAddress] = useState<string>('');
  const [selectedWallet, setSelectedWallet] = useState<WalletState>(suspectRegistry[0]);
  const [customSearchAlert, setCustomSearchAlert] = useState<string | null>(null);

  const handleWalletSelect = (wallet: WalletState) => {
    setSelectedWallet(wallet);
    setSearchAddress('');
    setCustomSearchAlert(null);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanSearch = searchAddress.trim().toLowerCase();
    
    if (!cleanSearch) return;

    // Check if it exists in current suspect list
    const found = suspectRegistry.find(w => 
      w.address === cleanSearch || w.address.toLowerCase().includes(cleanSearch)
    );

    if (found) {
      setSelectedWallet(found);
      setCustomSearchAlert(null);
    } else {
      // Simulate checking a new address against cybersecurity database (TRM emulation)
      const fakeNewWallet: WalletState = {
        address: searchAddress.slice(0, 42),
        label: `Ad-hoc Inspected Address`,
        riskScore: Math.floor(Math.random() * 40 + 10), // Safe/Moderate score
        category: 'Unknown Arbitrageur',
        throughput: '$82,400 USD',
        linkedEntities: 2,
        behaviors: [
          { name: 'Mixer interaction patterns', status: false, detail: 'No mixers verified on history.' },
          { name: 'Rapid sequence deposits', status: false, detail: 'Normal distribution timings.' },
          { name: 'Gas fee obfuscation origin', status: false, detail: 'Gas traces directly to Coinbase OTC hot-vault.' },
          { name: 'Coordinated exit pooling', status: false, detail: 'Funds remain localized in long-term cold storage.' }
        ],
        connections: [
          { label: 'Verified Coinbase Vault', address: '0xa7df...1219', role: 'Liquidity Origin', amount: '12.4 ETH', risk: 'low' },
          { label: 'Normal Arbitrage Contract', address: '0xffaa...bcdd', role: 'Target Arbitrage', amount: '1.5 ETH', risk: 'low' }
        ]
      };
      setSelectedWallet(fakeNewWallet);
      setCustomSearchAlert('Success: Address monitored. Low/Medium threat level registered.');
    }
  };

  const mapRiskColor = (score: number) => {
    if (score >= 90) return 'text-rose-500 border-rose-950/50 bg-rose-950/20';
    if (score >= 75) return 'text-amber-500 border-amber-950/50 bg-amber-950/20';
    return 'text-emerald-400 border-emerald-950/50 bg-emerald-950/20';
  };

  const mapCategoryStyle = (cat: string) => {
    switch(cat) {
      case 'Mixer Receiver': return 'bg-purple-950/40 text-purple-400 border border-purple-900/50 shadow-[0_0_8px_rgba(168,85,247,0.15)]';
      case 'Flashloan Exploiter': return 'bg-rose-950/40 text-rose-400 border border-rose-900/50 shadow-[0_0_8px_rgba(244,63,94,0.15)]';
      default: return 'bg-blue-950/40 text-blue-400 border border-blue-900/50';
    }
  };

  return (
    <div className="p-6 h-[calc(100vh-4rem)] overflow-y-auto space-y-6">
      {/* Search Header Profile */}
      <div className="p-5 rounded-xl border border-slate-900 bg-slate-950/40 backdrop-blur">
        <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Query any high-threat Ethereum/EVM Address (e.g. 0xef8c54ff...)"
              value={searchAddress}
              onChange={(e) => setSearchAddress(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-slate-950 border border-slate-900 text-xs font-mono text-slate-200 placeholder-slate-600 rounded-xl focus:outline-none focus:border-blue-950"
            />
          </div>
          <button
            type="submit"
            className="w-full md:w-auto px-6 py-2.5 bg-blue-950/30 hover:bg-blue-900/35 border border-blue-800/40 hover:border-blue-700/60 text-blue-400 font-mono text-xs tracking-widest rounded-xl transition-all cursor-pointer"
          >
            QUERIES FORENSICS
          </button>
        </form>

        {customSearchAlert && (
          <div className="mt-3 text-[10px] font-mono text-emerald-400">
            ✓ {customSearchAlert}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* LEFT COLUMN: ACTIVE THREAT REGISTRY */}
        <div className="lg:col-span-1 space-y-4">
          <div className="p-4 rounded-xl border border-slate-900 bg-slate-950/40 backdrop-blur">
            <h4 className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-3 block select-none">
              High-Risk Monitored Registry
            </h4>
            <div className="space-y-2">
              {suspectRegistry.map((item) => (
                <button
                  key={item.address}
                  onClick={() => handleWalletSelect(item)}
                  className={`w-full text-left p-3 rounded-lg border text-xs font-mono transition-all cursor-pointer flex items-center justify-between ${
                    selectedWallet.address === item.address 
                      ? 'bg-slate-900/60 border-slate-800 text-slate-200 shadow-[inset_0_1px_1px_rgba(255,255,255,0.02)]' 
                      : 'bg-slate-950/40 border-slate-950 text-slate-500 hover:text-slate-350 hover:bg-slate-900/20'
                  }`}
                >
                  <div className="min-w-0">
                    <span className="font-bold truncate block">{item.label}</span>
                    <span className="text-[10px] text-slate-500 font-medium truncate block select-none mt-1">{item.address.slice(0, 16)}...</span>
                  </div>
                  <ChevronRight className={`w-4 h-4 shrink-0 transition-transform ${
                    selectedWallet.address === item.address ? 'text-slate-300' : 'text-slate-700'
                  }`} />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* MIDDLE COLUMN:Forensics Profiler */}
        <div className="lg:col-span-3 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Core Stats Card */}
            <div className="p-5 rounded-xl border border-slate-900 bg-slate-950/40 backdrop-blur md:col-span-2 flex flex-col justify-between">
              <div>
                <span className={`px-2 py-0.5 rounded text-[9px] font-mono tracking-wider font-semibold uppercase border ${mapCategoryStyle(selectedWallet.category)}`}>
                  {selectedWallet.category}
                </span>

                <h3 className="font-sans font-bold text-slate-200 mt-3 text-base">
                  {selectedWallet.label}
                </h3>
                <span className="font-mono text-xs text-slate-500 block truncate mt-1 select-all cursor-copy" title="Click to copy full address">
                  ADDR: {selectedWallet.address}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-slate-900/80 pt-4 mt-6">
                <div className="font-mono text-[11px]">
                  <span className="text-slate-500 block uppercase text-[9px]">Total Throughput</span>
                  <span className="text-slate-250 font-bold block mt-0.5">{selectedWallet.throughput}</span>
                </div>
                <div className="font-mono text-[11px]">
                  <span className="text-slate-500 block uppercase text-[9px]">Linked Entities</span>
                  <span className="text-slate-250 font-bold block mt-0.5">{selectedWallet.linkedEntities} distinct routers</span>
                </div>
              </div>
            </div>

            {/* Dial Risk Score Card */}
            <div className={`p-5 rounded-xl border flex flex-col items-center justify-center text-center ${mapRiskColor(selectedWallet.riskScore)}`}>
              <ShieldAlert className="w-8 h-8 opacity-70 animate-pulse" />
              <div className="my-3">
                <span className="font-mono text-[10px] text-slate-400 block uppercase">Calculated Risk Index</span>
                <span className="font-sans font-black text-4xl block tracking-tighter leading-none mt-1">
                  {selectedWallet.riskScore}%
                </span>
                <span className="font-mono text-[9px] block uppercase mt-1">
                  {selectedWallet.riskScore >= 90 ? 'CRITICAL THREAT RATING' : (selectedWallet.riskScore >= 75 ? 'HIGH RISK COEFFICIENT' : 'MODERATE EXPLOIT PROFILE')}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* BEHAVIORS CHECKLIST */}
            <div className="p-5 rounded-xl border border-slate-900 bg-slate-950/40 backdrop-blur">
              <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-300 mb-3.5">
                Forensics Behavioral Footprint
              </h4>
              <div className="space-y-3 font-mono text-xs leading-normal">
                {selectedWallet.behaviors.map((beh) => (
                  <div key={beh.name} className="flex gap-3 items-start p-2.5 rounded-lg bg-slate-950/60 border border-slate-900/50">
                    <span className="mt-0.5">
                      {beh.status ? (
                        <CheckCircle2 className="w-4 h-4 text-rose-500 shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 text-slate-700 shrink-0" />
                      )}
                    </span>
                    <div>
                      <span className={`font-semibold ${beh.status ? 'text-rose-400' : 'text-slate-500'}`}>
                        {beh.name}
                      </span>
                      <p className="text-[10px] text-slate-450 mt-0.5 leading-normal select-none">
                        {beh.detail}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ATTRIBUTION GRAPH PANEL */}
            <div className="p-5 rounded-xl border border-slate-900 bg-slate-950/40 backdrop-blur flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3.5">
                  <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-300">
                    Consensus Cluster Linkage
                  </h4>
                  <Network className="w-4 h-4 text-blue-400" />
                </div>
                
                {/* Visual SVG linkage map */}
                <div className="h-44 bg-slate-950 border border-slate-900 rounded-lg relative overflow-hidden flex items-center justify-center p-4">
                  {/* Visual grid inside */}
                  <div className="absolute inset-0 bg-grid line opacity-5" />
                  
                  {/* Nodes & Vectors */}
                  <div className="relative w-full h-full flex items-center justify-between font-mono text-[9px] px-2 select-none">
                    {/* Link indicators */}
                    <div className="absolute inset-0 flex items-center">
                      <svg className="w-full h-full pointer-events-none opacity-30">
                        <line x1="15%" y1="50%" x2="50%" y2="50%" stroke="rgb(244, 63, 94)" strokeWidth="1.5" strokeDasharray="4" />
                        <line x1="50%" y1="50%" x2="85%" y2="25%" stroke="rgb(34, 197, 94)" strokeWidth="1" strokeDasharray="2" />
                        <line x1="50%" y1="50%" x2="85%" y2="50%" stroke="rgb(168, 85, 247)" strokeWidth="1" strokeDasharray="3" />
                        <line x1="50%" y1="50%" x2="85%" y2="75%" stroke="rgb(59, 130, 246)" strokeWidth="1" strokeDasharray="1" />
                      </svg>
                    </div>

                    {/* Source Node */}
                    <div className="bg-rose-950/30 text-rose-400 border border-rose-900/50 p-1.5 rounded text-center z-10 w-20 shadow-[0_0_8px_rgba(244,63,94,0.1)]">
                      <span className="font-bold uppercase">MIXER POOL</span>
                      <span className="text-[7px] text-rose-500 block mt-1">Tornado.Cash</span>
                    </div>

                    {/* TARGET Monitored Node */}
                    <div className="bg-slate-950 text-indigo-400 border border-indigo-500 p-2 rounded text-center z-10 w-24 ring-4 ring-indigo-950/60 shadow-[0_0_12px_rgba(99,102,241,0.2)]">
                      <span className="font-black uppercase text-[8px] tracking-wide">MONITORED</span>
                      <span className="text-[7px] text-slate-400 block mt-1 truncate">{selectedWallet.address.slice(0, 10)}</span>
                    </div>

                    {/* Receiver Nodes columns */}
                    <div className="flex flex-col gap-3 justify-center h-full">
                      <div className="bg-slate-950 text-emerald-400 border border-emerald-900 p-1 rounded w-20 text-center z-10">
                        <span>EXCHANGE</span>
                        <span className="text-[7px] text-emerald-500 block">Binance</span>
                      </div>
                      <div className="bg-slate-950 text-purple-400 border border-purple-900 p-1 rounded w-20 text-center z-10">
                        <span>ROUTER</span>
                        <span className="text-[7px] text-purple-500 block">DEX Hop</span>
                      </div>
                      <div className="bg-slate-950 text-blue-400 border border-blue-900 p-1 rounded w-20 text-center z-10">
                        <span>DAPP</span>
                        <span className="text-[7px] text-blue-500 block">Smart Contract</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Connections list */}
              <div className="mt-4 space-y-1.5 max-h-32 overflow-y-auto">
                <span className="font-mono text-[9px] text-slate-500 uppercase tracking-wider block">ATTRIBUTION ROUTE LINKS:</span>
                {selectedWallet.connections.map((conn, idx) => (
                  <div key={idx} className="flex items-center justify-between font-mono text-[10px] py-1 border-b border-slate-900/40 text-slate-350">
                    <span className="font-semibold text-slate-200 uppercase">{conn.label} ({conn.role})</span>
                    <span>{conn.amount}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletIntelligence;

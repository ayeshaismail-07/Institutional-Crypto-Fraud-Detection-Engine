export interface Transaction {
  id: string;
  symbol: string;
  price: number;
  quantity: number;
  valueUsd: number;
  timestamp: number;
  walletAddress: string;
  isAnomaly: boolean;
  anomalyScore: number;
}

export interface Alert {
  id: string;
  timestamp: number;
  symbol: string;
  price: number;
  quantity: number;
  valueUsd: number;
  anomalyScore: number;
  fraudProbability: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  reasoning: string;
  validatorConfidence: number;
  falsePositiveProb: number;
  walletAddress: string;
}

export interface Agent {
  name: string;
  role: string;
  status: 'active' | 'idle' | 'restricted';
  details: string;
}

export interface AgentLog {
  id: string;
  timestamp: number;
  agentName: 'DataAgent' | 'FeatureAgent' | 'MLAgent' | 'GeminiAgent' | 'ValidatorAgent' | 'AlertAgent';
  type: 'info' | 'warning' | 'alert' | 'success';
  message: string;
}

export interface AnomalyScoreRecord {
  timestamp: number;
  symbol: string;
  score: number;
  price: number;
}

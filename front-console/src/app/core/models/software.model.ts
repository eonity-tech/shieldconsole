export interface Software {
  id: string;
  deviceId: string;
  name: string;
  version: string;
  publisher: string;
  isRunning: boolean;
  criticalScore: number;
  riskLevel: 'CRITIQUE' | 'SAIN' | 'WARNING'; 
  recommendation: string;
}
export interface Device {
  id: string;
  macAddress: string;
  ipAddress: string;
  hostname: string;
  type: string;
  osType: 'WINDOWS' | 'LINUX' | 'MACOS' | string;
  osVersion: string;
  vendor: string;
  status: 'PROTECTED' | 'COMPROMISED' | 'UNPROTECTED' | 'UNKNOWN';
  isBlacklisted: boolean;
  securityRecommendation: string;
  vulnerabilityLevel: 'SAFE' | 'WARNING' | 'CRITICAL' | string;
  riskScore: number;
  openPorts: string;
  enrolledAt: string;
}
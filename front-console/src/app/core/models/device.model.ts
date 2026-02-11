export interface Device {
  id: string; // UUID généré par le backend pour chaque appareil
  macAddress: string;
  ipAddress: string;
  hostname: string;
  
  // On mappe les Strings Java directement
  status: 'PROTECTED' | 'COMPROMISED' | 'UNKNOWN'; 
  type: string; // PC, Serveur, Mobile...
  osType: string;  // WINDOWS, LINUX, MACOS...
  osVersion: string;
  vendor: string;  // Dell, HP...
  
  isBlacklisted: boolean;
  securityRecommendation: string;
  
  // Champs calculés pour l'affichage
  detectedSoftwares?: string[]; 
}

// Interface pour les statistiques globales du dashboard
export interface DashboardSummary {
  activeCount: number;
  compromisedCount: number;
  blacklistedCount: number;
}
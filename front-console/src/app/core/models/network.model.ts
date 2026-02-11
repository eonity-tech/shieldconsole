export interface NetworkTraffic {
  deviceId: string;
  ipAddress: string;
  hostname: string;
  detectedSoftwares: string[];
  currentUsage: number; // C'est le volume de données (en octets)
  statusCode: number;   // 1 = Critique, 3 = Sain
  message: string;      // Contient les infos sur les ports (Telnet, HTTPS...)
}
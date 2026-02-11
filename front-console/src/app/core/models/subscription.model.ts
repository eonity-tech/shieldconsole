// Réponse du GET /check-access
export interface SubscriptionCheckResponse {
  authorized: boolean;
  message: string;
  planType: 'FREE' | 'PRO' | 'ENTERPRISE';
  remainingCredits: number;
  active: boolean; // État administratif (On/Off)
  reason?: string;
}

// Interface étendue pour l'affichage dans le HTML (Front only)
export interface SubscriptionDisplay extends SubscriptionCheckResponse {
  maxLimit: number;
  usagePercent: number;
}

// Payload pour le PATCH /status
export interface SubscriptionStatusRequest {
  active: boolean;
  reason: string;
}
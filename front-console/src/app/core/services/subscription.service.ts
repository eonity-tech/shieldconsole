import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SubscriptionCheckResponse, SubscriptionStatusRequest } from '../models/subscription.model';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {
  private http = inject(HttpClient);

  private apiUrl = environment.apiUrl + '/subscription';

  /// VÉRIFICATION DE BASE (Gratuit)
  checkQuotaOnly(tenantId: string): Observable<void> {
    return this.http.get<void>(`${this.apiUrl}/check-only/${tenantId}`);
  }

  /// VÉRIFICATION AVEC CONSOMMATION (Payant)
  consumeQuota(tenantId: string): Observable<SubscriptionCheckResponse> {
    return this.http.post<SubscriptionCheckResponse>(`${this.apiUrl}/check-access/${tenantId}`, {});
  }

  // Récupérer le statut complet de l'abonnement (Admin)
  getFullStatus(tenantId: string): Observable<SubscriptionCheckResponse> {
    return this.http.get<SubscriptionCheckResponse>(`${this.apiUrl}/check-only/${tenantId}`);
  }

  // Mettre à jour le statut de l'abonnement (Admin)
  updateStatus(tenantId: string, active: boolean, reason: string): Observable<void> {
    const payload: SubscriptionStatusRequest = { active, reason };
    return this.http.patch<void>(`${this.apiUrl}/${tenantId}/status`, payload);
  }
}
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SubscriptionCheckResponse, SubscriptionStatusRequest } from '../models/subscription.model';


@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {
  private http = inject(HttpClient);
  
  private apiUrl = '/api/v1/subscription';

  // Méthode pour vérifier le statut de l'abonnement
  getSubscriptionStatus(tenantId: string): Observable<SubscriptionCheckResponse> {
    return this.http.post<SubscriptionCheckResponse>(`${this.apiUrl}/check-access/${tenantId}`, {});
  }

  // Méthode pour activer/désactiver l'abonnement
  updateStatus(tenantId: string, active: boolean, reason: string): Observable<void> {
    const payload: SubscriptionStatusRequest = {
      active: active,
      reason: reason
    };
    return this.http.patch<void>(`${this.apiUrl}/${tenantId}/status`, payload);
  }
}
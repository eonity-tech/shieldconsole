import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Device } from '../models/device.model';

@Injectable({ providedIn: 'root' })
export class DeviceService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  // Pour lister tous les appareils de l'utilisateur
  getAllDevices(): Observable<Device[]> {
    return this.http.get<Device[]>(`${this.apiUrl}/devices`);
  }

  // Pour bloquer un appareil
  blockDevice(id: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/devices/security/${id}/block`, {});
  }

  // Pour débloquer un appareil
  unblockDevice(id: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/devices/security/${id}/unblock`, {});
  }
}
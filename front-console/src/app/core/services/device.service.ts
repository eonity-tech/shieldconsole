import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Device } from '../models/device.model';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {
  private http = inject(HttpClient);

  // On pointe vers l'API. Même si l'URL s'appelle encore "monitoring" coté back,
  // pour le front, c'est un service de Devices.
  private apiUrl = '/api/v1/network-monitoring';

  getAllDevices(): Observable<Device[]> {
    return this.http.get<Device[]>(`${this.apiUrl}/dashboard`);
  }

  // Exemple de future méthode qui aura sa place ici
  blockDevice(deviceId: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/block/${deviceId}`, {});
  }
}
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NetworkTraffic } from '../models/network.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NetworkService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl + '/network-monitoring/dashboard'; 

  // Pour récupérer les données de trafic réseau
  getAllTraffic(): Observable<NetworkTraffic[]> {
    return this.http.get<NetworkTraffic[]>(this.apiUrl);
  }
}
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NetworkTraffic } from '../models/network.model';

@Injectable({
  providedIn: 'root'
})
export class NetworkService {
  private http = inject(HttpClient);
  private apiUrl = '/api/v1/network-monitoring/dashboard'; 

  getAllTraffic(): Observable<NetworkTraffic[]> {
    return this.http.get<NetworkTraffic[]>(this.apiUrl);
  }
}
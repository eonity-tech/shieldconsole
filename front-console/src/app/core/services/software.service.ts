import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Software } from '../models/software.model';

@Injectable({
  providedIn: 'root'
})
export class SoftwareService {
  private http = inject(HttpClient);
  

  private apiUrl = '/api/v1/softwares'; 

  getSoftwareList(): Observable<Software[]> {
    return this.http.get<Software[]>(this.apiUrl);
  }
}
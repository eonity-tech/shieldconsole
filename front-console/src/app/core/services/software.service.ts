import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Software } from '../models/software.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SoftwareService {
  private http = inject(HttpClient);

  private apiUrl = environment.apiUrl + '/softwares'; 

  // Pour récupérer la liste des logiciels
  getSoftwareList(): Observable<Software[]> {
    return this.http.get<Software[]>(this.apiUrl);
  }
}
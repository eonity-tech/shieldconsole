import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { DeviceService } from '../../core/services/device.service';
import { Device } from '../../core/models/device.model';
import { ChartsComponent } from "../../charts/charts";
import { NetworkTraffic } from '../../core/models/network.model';
import { NetworkChartsComponent } from '../../network-charts/network-charts';
import { NetworkService } from '../../core/services/network.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ChartsComponent, NetworkChartsComponent],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class DashboardComponent implements OnInit { 
  private http = inject(HttpClient);
  private deviceService = inject(DeviceService);
  private networkService = inject(NetworkService);

  // Signaux pour les données
  devices = signal<Device[]>([]);
  trafficList = signal<NetworkTraffic[]>([]);
  loading = signal(false);

  ngOnInit() {
    this.refresh();
  }

  // Fournit la liste complète aux graphiques
  deviceList() {
    return this.devices();
  }

  refresh() {
    this.loading.set(true);


    // 1. Chargement des Appareils (Devices) - MODE TEST
    // this.http.get<Device[]>('assets/test/pc-test.json').subscribe({
    //   next: (data) => {
    //     setTimeout(() => {
    //       console.log('Données de test chargées :', data.length, 'appareils');
    //       this.devices.set(data);
    //       this.loading.set(false);
    //     }, 500);
    //   },
    //   error: (err) => {
    //     console.error('Erreur chargement JSON', err);
    //     this.loading.set(false);
    //   }
    // });

    // 1. Chargement des Appareils (Devices) - MODE API
    this.deviceService.getAllDevices().subscribe({
      next: (data) => {
        this.devices.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Erreur API Dashboard:', err);
        this.loading.set(false);
        
        // --- Si l'API échoue, chargement des données de test ---
        this.loadTestData();
      }
    });


    // 2. Chargement du Trafic Réseau
    // this.http.get<NetworkTraffic[]>('assets/test/network-test.json').subscribe({
    //   next: (data) => {
    //     setTimeout(() => {
    //       this.trafficList.set(data);
    //       this.loading.set(false);
    //     }, 500);
    //   },
    //   error: (err) => {
    //     console.error('Erreur Réseau:', err);
    //     this.loading.set(false);
    //   }
    // });
    
     // Code réel commenté 
    this.networkService.getAllTraffic().subscribe({
      next: (data) => {
        this.trafficList.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.loading.set(false);
      }
    });
  }

  // Méthode pour charger les données de test en cas d'échec de l'API
  private loadTestData() {
    this.http.get<Device[]>('assets/test/pc-test.json').subscribe({
      next: (data) => {
        this.devices.set(data);
      }
    });
  }
}
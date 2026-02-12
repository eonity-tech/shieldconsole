import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NetworkService } from '../../core/services/network.service';
import { NetworkTraffic } from '../../core/models/network.model';
import { NetworkChartsComponent } from '../../network-charts/network-charts';

@Component({
  selector: 'app-network-list',
  standalone: true,
  imports: [CommonModule, NetworkChartsComponent],
  templateUrl: './network-list.html',
  styleUrl: './network-list.scss'
})
export class NetworkListComponent implements OnInit {
  private networkService = inject(NetworkService);
  private http = inject(HttpClient);

  // Données
  trafficList = signal<NetworkTraffic[]>([]);
  loading = signal(false);

  // --- PAGINATION ---
  currentPage = signal(1);
  pageSize = 15;

  // Calcul du nombre total de pages
  totalPages = computed(() => {
    return Math.ceil(this.trafficList().length / this.pageSize);
  });

  // Liste paginée
  paginatedTraffic = computed(() => {
    const startIndex = (this.currentPage() - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return this.trafficList().slice(startIndex, endIndex);
  });

  ngOnInit() {
    this.refresh();
  }

  refresh() {
    this.loading.set(true);
    this.currentPage.set(1);

    // MODE TEST : Chargement du fichier JSON local (32 entrées)
    // this.http.get<NetworkTraffic[]>('assets/test/network-test.json').subscribe({
    //   next: (data) => {
    //     setTimeout(() => {
    //       this.trafficList.set(data);
    //       this.loading.set(false);
    //       console.log(`✅ Trafic chargé : ${data.length} entrées`);
    //     }, 500);
    //   },
    //   error: (err) => {
    //     console.error('Erreur chargement JSON', err);
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

  // Méthodes de pagination
  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  // Méthode de formatage des octets
  formatBytes(bytes: number, decimals = 2) {
    if (!+bytes) return '0 B';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  }
}
import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NetworkService } from '../../core/services/network.service';
import { NetworkTraffic } from '../../core/models/network.model';

@Component({
  selector: 'app-network-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './network-list.html',
  styleUrl: './network-list.scss'
})
export class NetworkListComponent implements OnInit {
  private networkService = inject(NetworkService);

  trafficList = signal<NetworkTraffic[]>([]);
  loading = signal(false);

  ngOnInit() {
    this.refresh();
  }

  refresh() {
    this.loading.set(true);
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

  formatBytes(bytes: number, decimals = 2) {
    if (!+bytes) return '0 B';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  }
}
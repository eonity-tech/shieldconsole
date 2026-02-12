import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { DeviceService } from '../../core/services/device.service';
import { Device } from '../../core/models/device.model';
import { ChartsComponent } from "../../charts/charts";

@Component({
  selector: 'app-device-list',
  standalone: true,
  imports: [CommonModule, ChartsComponent],
  templateUrl: './device-list.html',
  styleUrl: './device-list.scss'
})
export class DeviceListComponent implements OnInit {
  private http = inject(HttpClient);
  private deviceService = inject(DeviceService);

  // Données et états
  devices = signal<Device[]>([]);
  loading = signal(false);
  selectedDevice = signal<Device | null>(null);

  // --- CONFIGURATION PAGINATION ---
  currentPage = signal(1);
  pageSize = 15; // 15 PC par page

  // 1. Calcul du nombre total de pages (Réactif)
  totalPages = computed(() => {
    return Math.ceil(this.devices().length / this.pageSize);
  });

  // 2. Découpage de la liste pour la page actuelle (Réactif)
  paginatedDevices = computed(() => {
    const startIndex = (this.currentPage() - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    // Coupe le tableau original pour ne garder que les 15 éléments
    return this.devices().slice(startIndex, endIndex);
  });

  ngOnInit() {
    this.refresh();
  }

  // Méthode pour accéder à la liste paginée dans le template
  deviceList() {
    return this.devices();
  }

  // --- Méthode pour rafraîchir les données ---
  refresh() {
    this.loading.set(true);
    this.currentPage.set(1); 

    // MODE TEST : Chargement du fichier JSON local
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

    
    // MODE RÉEL : Appel à l'API pour récupérer les appareils
    this.deviceService.getAllDevices().subscribe({
      next: (data) => {
        this.devices.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.loading.set(false);
      }
    });
    
  }

  // --- Méthode pour changer de page ---
  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
      this.selectedDevice.set(null); // On ferme les détails quand on change de page
      // Optionnel : Scroller vers le haut du tableau
      document.querySelector('.devices-table-container')?.scrollIntoView({ behavior: 'smooth' });
    }
  }

  // --- Méthodes de blocage/déblocage ---
  onBlock(id: string) {
    if (!id) return;
    this.deviceService.blockDevice(id).subscribe({
      next: () => {
        console.log(`Simulation : Appareil ${id} bloqué`);
        this.refresh();
      },
      error: (err: any) => console.error('Erreur blocage:', err)
    });
  }

  // --- Méthode de déblocage ---
  onUnblock(id: string) {
    this.deviceService.unblockDevice(id).subscribe({
      next: () => {
        console.log(`Simulation : Appareil ${id} débloqué`);
        this.refresh();
      },
      error: (err: any) => console.error(err)
    });
  }

  // --- Méthode pour ouvrir/fermer les détails d'un appareil ---
  openDetails(device: Device) {
    if (this.selectedDevice()?.id === device.id) {
      this.selectedDevice.set(null);
    } else {
      this.selectedDevice.set(device);
    }
  }
}
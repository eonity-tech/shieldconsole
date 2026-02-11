import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeviceService } from '../../core/services/device.service';
import { Device } from '../../core/models/device.model';

@Component({
  selector: 'app-device-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './device-list.html',
  styleUrl: './device-list.scss'
})
export class DeviceListComponent implements OnInit {
  private deviceService = inject(DeviceService);

  // State signals pour les appareils et le chargement des données
  devices = signal<Device[]>([]);
  loading = signal(false);

  ngOnInit() {
    this.refresh();
  }

  refresh() {
    this.loading.set(true);
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
}
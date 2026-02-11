import { Component, inject, signal } from '@angular/core'; // plus besoin de OnInit compliqué
import { CommonModule } from '@angular/common';
import { DeviceListComponent } from '../../devices/device-list/device-list';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, DeviceListComponent],
  templateUrl: './dashboard.html',
})
export class DashboardComponent { }
import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SoftwareService } from '../../core/services/software.service';
import { Software } from '../../core/models/software.model';

@Component({
  selector: 'app-software-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './software-list.html',
  styleUrl: './software-list.scss'
})
export class SoftwareListComponent implements OnInit {
  private softwareService = inject(SoftwareService);

  softwares = signal<Software[]>([]);
  loading = signal(false);

  ngOnInit() {
    this.refresh();
  }

  refresh() {
    this.loading.set(true);
    this.softwareService.getSoftwareList().subscribe({
      next: (data) => {
        this.softwares.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.loading.set(false);
      }
    });
  }
}
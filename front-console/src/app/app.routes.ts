import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { MainLayoutComponent } from './core/layout/main-layout/main-layout';
import { DashboardComponent } from './monitoring/dashboard/dashboard';
import { DeviceListComponent } from './devices/device-list/device-list';
import { NetworkListComponent } from './networks/network-list/network-list';
import { SoftwareListComponent } from './softwares/software-list/software-list';
import { SubscriptionManagementComponent } from './subscription/subscription-management/subscription-management';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent, // Le Layout est la racine
    canActivate: [AuthGuard], // On protège tout le layout
    children: [ // Les pages sont des enfants
      { path: '', redirectTo: 'monitoring/dashboard', pathMatch: 'full' },
      { path: 'monitoring/dashboard', component: DashboardComponent },
      { path: 'devices', component: DeviceListComponent },
      { path: 'networks', component: NetworkListComponent },
      { path: 'softwares', component: SoftwareListComponent },
      { path: 'ia/management', component: SubscriptionManagementComponent }
    ]
  },
  // Redirection globale en cas d'URL inconnue
  { path: '**', redirectTo: 'monitoring/dashboard' }
];
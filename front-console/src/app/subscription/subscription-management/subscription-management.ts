import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SubscriptionService } from '../../core/services/subscription.service';
import { SubscriptionDisplay } from '../../core/models/subscription.model';

@Component({
  selector: 'app-subscription-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './subscription-management.html',
  styleUrl: './subscription-management.scss'
})
export class SubscriptionManagementComponent implements OnInit {
  private subService = inject(SubscriptionService);

  currentTenantId = signal('client-free');
  subscription = signal<SubscriptionDisplay | null>(null);
  loading = signal(false);
  showCostInfo = signal(false);

  private readonly LIMITS: Record<string, number> = {
    'FREE': 100,
    'PRO': 10000,
    'ENTERPRISE': 100000
  };

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading.set(true);
    this.showCostInfo.set(false);

    this.subService.getSubscriptionStatus(this.currentTenantId()).subscribe({

      // CAS 1 : Tout va bien (200 OK)
      next: (data) => {
        this.updateView(data);
      },

      // CAS 2 : Erreur HTTP (403, 500, etc.)
      error: (err) => {
        // On intercepte la 403 pour lire les données
        if (err.status === 403 && err.error && err.error.planType) {
          // console.warn('Accès refusé mais données récupérées (403)');
          this.updateView(err.error);
        } else {
          // console.error('Erreur fatale:', err);
          this.loading.set(false);
        }
      }
    });
  }

  // Logique de mise à jour de l'affichage à partir des données reçues
  private updateView(data: any) {
    const max = this.LIMITS[data.planType] || 100;
    const used = Math.max(0, max - data.remainingCredits);
    const percent = Math.round((used / max) * 100);

    this.subscription.set({
      ...data,
      maxLimit: max,
      usagePercent: percent,
      active: (data.active !== undefined) ? data.active : data.authorized,
      reason: data.reason || data.message || ''
    });

    this.loading.set(false);
  }

  // ACTION 1 : ACTIVER
  activateSubscription() {
    this.updateSubscriptionStatus(true, "Réactivation manuelle par l'administrateur.");
  }

  // ACTION 2 : SUSPENDRE
  suspendSubscription() {
    this.updateSubscriptionStatus(false, "Suspension manuelle via la Console.");
  }

  // Helpers
  toggleCostInfo() {
    this.showCostInfo.update(v => !v);
  }

  // Logique privée de mise à jour
  private updateSubscriptionStatus(isActive: boolean, reason: string) {
    if (!this.subscription()) return;

    this.subService.updateStatus(this.currentTenantId(), isActive, reason).subscribe({
      next: () => {
        // Mise à jour optimiste de l'UI
        this.subscription.update(current => {
          if (!current) return null;
          return {
            ...current,
            active: isActive,
            message: isActive ? 'Statut mis à jour (Vérification quota en cours...)' : 'Compte suspendu par administrateur.'
          };
        });
        // Recharger les données après un court délai pour refléter l'état réel
        setTimeout(() => this.loadData(), 500);
      },
      error: (err) => {
        // console.error('Erreur update:', err);
        this.loadData();
      }
    });
  }
}
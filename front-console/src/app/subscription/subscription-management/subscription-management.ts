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

    // Appel au service pour récupérer le statut complet de l'abonnement
    this.subService.getFullStatus(this.currentTenantId()).subscribe({

      // Réponse dans 'next' pour les cas 200 et 403
      next: (data: any) => {
        this.updateView(data);
      },

      // Erreur dans 'error' pour les cas 403 et autres
      error: (err: any) => {
        if (err.status === 403 && err.error && err.error.planType) {
          this.updateView(err.error);
        } else {
          this.loading.set(false);
        }
      }
    });
  }

  private updateView(data: any) {
    // console.log('Données reçues:', data);
    if (!data) {
      console.error("Aucune donnée reçue du serveur");
      this.loading.set(false);
      return;
    }

    // Calcul des limites et pourcentages d'utilisation
    const planType = data.planType || 'FREE';
    const remaining = data.remainingCredits ?? 0;
    const max = this.LIMITS[planType] || 100;
    const used = Math.max(0, max - remaining);
    const percent = Math.round((used / max) * 100);

    this.subscription.set({
      ...data,
      planType: planType,
      maxLimit: max,
      usagePercent: percent,
      active: data.active ?? data.authorized ?? false,
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

  // Méthode commune pour activer/suspendre avec mise à jour optimiste de l'UI
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
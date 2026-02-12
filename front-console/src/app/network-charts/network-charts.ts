import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData } from 'chart.js';
import { NetworkTraffic } from '../core/models/network.model';

@Component({
  selector: 'app-network-charts',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './network-charts.html',
  styleUrl: './network-charts.scss'
})
export class NetworkChartsComponent {
  trafficData = input.required<NetworkTraffic[]>();

  // --- CALCUL DE LA HAUTEUR DU SCROLL ---
  bandwidthChartHeight = computed(() => {
    const count = this.trafficData().length;
    return Math.max(250, count * 35);
  });

  // --- 1. TOP CONSOMMATION (Barres Horizontales avec Scroll) ---
  bandwidthChartOptions: ChartConfiguration<'bar'>['options'] = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false, // OBLIGATOIRE pour le scroll
    scales: {
      x: {
        beginAtZero: true,
        grid: { color: '#f1f5f9' },
        ticks: { callback: (val) => this.formatBytes(Number(val)) }
      },
      y: {
        grid: { display: false },
        ticks: { font: { family: 'Inter', weight: 'bold' } }
      }
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => ` Usage: ${this.formatBytes(Number(ctx.raw))}`
        }
      }
    }
  };
  
  // Calcul des données pour le graphique de consommation réseau
  bandwidthChartData = computed<ChartData<'bar'>>(() => {
    const data = this.trafficData();
    const sorted = [...data].sort((a, b) => b.currentUsage - a.currentUsage);

    // Seuil de 500 Mo en octets (500 * 1024 * 1024)
    const threshold = 500 * 1024 * 1024;

    return {
      labels: sorted.map(d => d.hostname || d.ipAddress),
      datasets: [{
        label: 'Usage Réseau',
        data: sorted.map(d => d.currentUsage),
        backgroundColor: sorted.map(d =>
          d.currentUsage > threshold ? '#ef4444' : '#3b82f6'
        ),
        minBarLength: 10,
        borderRadius: 4,
        barPercentage: 0.7,
        categoryPercentage: 0.9
      }]
    };
  });

  // --- 2. SANTÉ DU RÉSEAU (Doughnut) ---
  healthChartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: {
      legend: {
        position: 'bottom',
        align: 'center',
        labels: {
          padding: 20,
          usePointStyle: true
        }
      }
    }
  };

  // Calcul des données pour le graphique de santé du réseau
  healthChartData = computed<ChartData<'doughnut'>>(() => {
    const data = this.trafficData();
    const normal = data.filter(d => d.statusCode === 3).length;
    const alert = data.filter(d => d.statusCode === 1).length;

    return {
      labels: ['Normal', 'Alertes'],
      datasets: [{
        data: [normal, alert],
        backgroundColor: ['#10b981', '#ef4444'],
        borderWidth: 0
      }]
    };
  });

  // --- FONCTION DE FORMATAGE DES OCTETS ---
  private formatBytes(bytes: number) {
    if (!+bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  }
}
import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData } from 'chart.js';

@Component({
  selector: 'app-charts',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './charts.html',
  styleUrl: './charts.scss',
})
export class ChartsComponent {
  dashboardData = input.required<any[]>();

  // --- 1. SANTÉ (Reste inchangé car on compte juste des statuts) ---
  healthChartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '75%',
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

  healthChartData = computed<ChartData<'doughnut'>>(() => {
    const data = this.dashboardData();
    const safe = data.filter(d => d.vulnerabilityLevel === 'SAFE').length;
    const warning = data.filter(d => d.vulnerabilityLevel === 'WARNING' || d.vulnerabilityLevel === 'UNPROTECTED').length;
    const critical = data.filter(d => d.vulnerabilityLevel === 'CRITICAL').length;

    return {
      labels: ['Sécurisé', 'À surveiller', 'Critique'],
      datasets: [{
        data: [safe, warning, critical],
        backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
        hoverBackgroundColor: ['#059669', '#d97706', '#dc2626'],
        borderWidth: 0
      }]
    };
  });

  // --- 2. TOP RISQUES (Version Horizontale) ---
  trafficChartOptions: ChartConfiguration<'bar'>['options'] = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false, // CRUCIAL : permet au canvas de s'étirer
    scales: {
      x: { beginAtZero: true, max: 100, grid: { color: '#f1f5f9' } },
      y: {
        grid: { display: false },
        ticks: { font: { family: 'Inter', weight: 'bold' } }
      }
    },
    plugins: {
      legend: {
        display: false
      }
    }
  };

  trafficChartHeight = computed(() => {
    const count = this.dashboardData().length;
    return Math.max(300, count * 40);
  });

  trafficChartData = computed<ChartData<'bar'>>(() => {
    const data = this.dashboardData();

    // On trie juste par risque
    const sorted = [...data].sort((a, b) => b.riskScore - a.riskScore);

    return {
      labels: sorted.map(d => d.hostname),
      datasets: [{
        label: 'Score',
        data: sorted.map(d => d.riskScore),
        minBarLength: 10,
        backgroundColor: sorted.map(d => {
          if (d.riskScore >= 75) return '#ef4444';
          if (d.riskScore >= 40) return '#f59e0b';
          return '#10b981';
        }),
        borderRadius: 4,
        barPercentage: 0.7,
        categoryPercentage: 0.9
      }]
    };
  });

  // --- 3. RÉPARTITION OS (Regroupé par Famille) ---
  vulnChartOptions: ChartConfiguration<'pie'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
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

  vulnChartData = computed<ChartData<'pie'>>(() => {
    const data = this.dashboardData();
    const counts: { [key: string]: number } = {
      'Windows': 0,
      'Linux': 0,
      'macOS': 0,
      'Autre': 0
    };

    data.forEach(device => {
      // On met tout en majuscule pour éviter les soucis de casse
      const os = (device.osType || '').toUpperCase();
      const version = (device.osVersion || '').toUpperCase(); // Au cas où l'info soit dans la version

      if (os.includes('WIN') || version.includes('WIN')) {
        counts['Windows']++;
      } else if (os.includes('LINUX') || os.includes('UBUNTU') || os.includes('DEBIAN') || os.includes('CENTOS')) {
        counts['Linux']++;
      } else if (os.includes('MAC') || os.includes('APPLE') || os.includes('DARWIN')) {
        counts['macOS']++;
      } else {
        counts['Autre']++;
      }
    });

    // On retire les catégories vides pour ne pas avoir de part à 0%
    const finalLabels: string[] = [];
    const finalData: number[] = [];
    const finalColors: string[] = [];

    const colorMap: any = { 'Windows': '#3b82f6', 'Linux': '#f97316', 'macOS': '#8b5cf6', 'Autre': '#64748b' };

    Object.keys(counts).forEach(key => {
      if (counts[key] > 0) {
        finalLabels.push(key);
        finalData.push(counts[key]);
        finalColors.push(colorMap[key]);
      }
    });

    return {
      labels: finalLabels,
      datasets: [{
        data: finalData,
        backgroundColor: finalColors,
        borderWidth: 2,
        borderColor: '#ffffff'
      }]
    };
  });
}
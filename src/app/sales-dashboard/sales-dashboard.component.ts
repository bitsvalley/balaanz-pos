import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Products } from './sales-dashboard.model';

import { Chart, registerables } from 'chart.js';
import { UserService } from '../shared/services/user.service';

Chart.register(...registerables);

@Component({
  selector: 'app-sales-dashboard',
  templateUrl: './sales-dashboard.component.html',
  styleUrls: ['./sales-dashboard.component.scss'],
})
export class SalesDashboardComponent implements OnInit, AfterViewInit {
  @ViewChild('topProductsChart', { static: false }) chartCanvas!: ElementRef;

  topProducts: Products[] = [];
  dummyProducts: Products[] = [
  ];

  chart: Chart | null = null;
  loading = true;
  Math = Math;
  
  chartColors = [
    '#FF6384', // Pink
    '#36A2EB', // Blue
    '#FFCE56', // Yellow
    '#4BC0C0', // Teal
    '#9966FF'  // Purple
  ];

  constructor(private _user: UserService) {}

  ngOnInit() {
    this.fetchTopProducts();
  }

  ngAfterViewInit() {
    if (this.topProducts.length > 0) {
      this.createPieChart();
    }
  }

  fetchTopProducts() {
    const from = '2024-12-30 15:21:46';
    const to = '2025-12-30 15:21:46';
    const limit = 5;
    
    this._user.getSalesProduct(from, to, limit).subscribe(
      (data: Products[]) => {
        this.topProducts = data.length > 0 ? data : this.dummyProducts; 
        this.loading = false;
        
        setTimeout(() => {
          this.createPieChart();
        }, 0);
        
        console.log("Fetched Products:", data);
      },
      (error) => {
        console.error('Error fetching top products:', error);
        this.loading = false;
        this.topProducts = this.dummyProducts; 
        
        setTimeout(() => {
          this.createPieChart();
        }, 0);
      }
    );
  }
  
  createPieChart() {
    if (this.chart) {
      this.chart.destroy();
    }

    if (!this.chartCanvas) {
      console.error('Chart canvas not found');
      return;
    }

    const context = this.chartCanvas.nativeElement.getContext('2d');
    if (!context) {
      console.error('Could not get 2D context');
      return;
    }
    
    if (this.topProducts.length === 0) {
      console.error('No products to create chart');
      return;
    }

    const labels = this.topProducts.map(product => product.name);
    const data = this.topProducts.map(product => Math.abs(product.stockAmount)); 
    
    this.chart = new Chart(context, {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          label: 'Stock Amount',
          data: data,
          backgroundColor: this.chartColors,
          hoverOffset: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              boxWidth: 12,
              font: {
                size: 10
              }
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const label = context.label || '';
                const value = context.formattedValue || '';
                return `${label}: ${value} units`;
              }
            }
          }
        }
      }
    });
  }
}
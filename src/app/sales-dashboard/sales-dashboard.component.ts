import { Component, OnInit } from '@angular/core';
import { Products } from './sales-dashboard.model';
import { HttpClient } from '@angular/common/http';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-sales-dashboard',
  templateUrl: './sales-dashboard.component.html',
  styleUrls: ['./sales-dashboard.component.scss'],
})
export class SalesDashboardComponent  implements OnInit {
  topProducts: Products[] = [];

  chart: any;
  loading = true;
  Math = Math;
  
  chartColors = [
    '#FF6384', // Pink
    '#36A2EB', // Blue
    '#FFCE56', // Yellow
    '#4BC0C0', // Teal
    '#9966FF'  // Purple
  ];

  // Dummy data for testing
  dummyProducts: Products[] = [
    {
      id: 1290,
      name: 'Fanta',
      createdDate: null,
      lastUpdatedDate: null,
      category: 1268,
      unitPrice: 15.0,
      bulkPrice: 14.0,
      purchasePrice: 0.0,
      stockAmount: 150,
      image1: 'assets/images/coca-cola_1.jpg',
      image2: null,
      image3: null,
      image4: null,
      code: 'drink',
      barcode: 'soup',
      expiry: null,
      shortDescription: 'Orange flavored soda',
      longDescription: 'Refreshing orange flavored carbonated drink',
      online: false,
      active: true,
      msrp: 0.0
    },
    {
      id: 1291,
      name: 'Coca Cola',
      createdDate: null,
      lastUpdatedDate: null,
      category: 1268,
      unitPrice: 18.0,
      bulkPrice: 16.0,
      purchasePrice: 0.0,
      stockAmount: 200,
      image1: 'assets/images/image-2.jpg',
      image2: null,
      image3: null,
      image4: null,
      code: 'drink',
      barcode: 'cola',
      expiry: null,
      shortDescription: 'Coca Cola soft drink',
      longDescription: 'Classic cola flavor carbonated drink',
      online: false,
      active: true,
      msrp: 0.0
    },
    {
      id: 1292,
      name: 'Sprite',
      createdDate: null,
      lastUpdatedDate: null,
      category: 1268,
      unitPrice: 14.0,
      bulkPrice: 12.0,
      purchasePrice: 0.0,
      stockAmount: 125,
      image1: 'assets/images/image-3.jpg',
      image2: null,
      image3: null,
      image4: null,
      code: 'drink',
      barcode: 'sprite',
      expiry: null,
      shortDescription: 'Lemon lime flavor soda',
      longDescription: 'Refreshing lemon-lime flavored carbonated drink',
      online: false,
      active: true,
      msrp: 0.0
    },
    {
      id: 1293,
      name: 'Pepsi',
      createdDate: null,
      lastUpdatedDate: null,
      category: 1268,
      unitPrice: 17.0,
      bulkPrice: 15.0,
      purchasePrice: 0.0,
      stockAmount: 180,
      image1: 'assets/images/image-4.avif',
      image2: null,
      image3: null,
      image4: null,
      code: 'drink',
      barcode: 'pepsi',
      expiry: null,
      shortDescription: 'Pepsi soft drink',
      longDescription: 'Refreshing cola flavored carbonated drink',
      online: false,
      active: true,
      msrp: 0.0
    },
    {
      id: 1294,
      name: 'Mountain Dew',
      createdDate: null,
      lastUpdatedDate: null,
      category: 1268,
      unitPrice: 16.0,
      bulkPrice: 14.0,
      purchasePrice: 0.0,
      stockAmount: 100,
      image1: 'assets/images/image-5.jpg',
      image2: null,
      image3: null,
      image4: null,
      code: 'drink',
      barcode: 'dew',
      expiry: null,
      shortDescription: 'Citrus flavored soda',
      longDescription: 'Energizing citrus flavored carbonated drink',
      online: false,
      active: true,
      msrp: 0.0
    }
  ];

  constructor(private http: HttpClient) {}

  ngOnInit() {
  
    this.topProducts = this.dummyProducts;
    this.loading = false;
    
    setTimeout(() => {
      this.createPieChart();
    }, 500);
  }

  fetchTopProducts() {
    const from = '2024-12-30 15:21:46';
    const to = '2025-12-30 15:21:46';
    const limit = 5;
    
    const url = `/api/v1/pos/product/topSold?from=${from}&to=${to}&limit=${limit}`;
    
    this.http.get<Products[]>(url).subscribe(
      (data) => {
        this.topProducts = data;
        this.loading = false;
        this.createPieChart();
      },
      (error) => {
        console.error('Error fetching top products:', error);
        this.loading = false;
        this.topProducts = this.dummyProducts;
        this.createPieChart();
      }
    );
  }

  getAbsoluteValue(value: number): number {
    return Math.abs(value);
  }
  
  createPieChart() {
    const canvas = document.getElementById('topProductsChart') as HTMLCanvasElement;
    if (!canvas) return;
    
    const context = canvas.getContext('2d');
    if (!context) return;
    
    const labels = this.topProducts.map(product => product.name);
    const data = this.topProducts.map(product => Math.abs(product.stockAmount)); 
    
    this.chart = new Chart(context, {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          label: 'Top Selling Products',
          data: data,
          backgroundColor: this.chartColors,
          hoverOffset: 4
        }]
      },
      options: {
        responsive: true,
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
  
  getImagePath(product: Products): string {
   
    if (!product.image1) return 'assets/images/placeholder.jpg';
    
    const imagePath = product.image1.replace('C:\\\\', '').replace(/\\/g, '/');
    
  
    return 'assets/images/' + imagePath.split('/').pop() || 'placeholder.jpg';
  }

}

import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, ChartConfiguration, registerables } from 'chart.js';

// Register Chart.js components
Chart.register(...registerables);

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit {
  @Input() businessType: string = '';
  @Input() competitionPrice: number = 0;
  @Input() hardwareConfig: any;
  @Input() usageMonths: number = 60;
  @Output() back = new EventEmitter<void>();
  @Output() restart = new EventEmitter<void>();
  
  buyTotal: number = 0;
  rentTotal: number = 0;
  breakEvenMonth: number = 0;
  monthlySavings: number = 0;
  chart: Chart | undefined;
  
  // Rental constants
  private readonly RENTAL_BASE_DOWN = 300;
  private readonly RENTAL_BASE_MONTHLY = 38;
  
  advantages: string[] = [];

  ngOnInit() {
    this.calculateTotals();
    this.calculateBreakEven();
    this.generateAdvantages();
    setTimeout(() => this.createChart(), 100);
  }

  calculateHardwarePrice(): number {
    if (this.hardwareConfig.pcType === 'BYO') return 0;
    
    if (this.hardwareConfig.pcType === 'ECONOMY') {
      return this.hardwareConfig.displayChoice === 'normal' ? 899 : 999;
    }
    
    if (this.hardwareConfig.pcType === 'PROFESSIONAL') {
      return this.hardwareConfig.processorChoice === 'celeron' ? 1500 : 2200;
    }
    
    return 0;
  }

  calculateExtrasPrice(): number {
    const prices = {
      secondPrinter: 150,
      moneyDrawer: 120,
      customerDisplay: 180,
      digitalKeys: 25
    };
    
    let total = 0;
    total += this.hardwareConfig.extras.secondPrinter * prices.secondPrinter;
    total += this.hardwareConfig.extras.moneyDrawer * prices.moneyDrawer;
    total += this.hardwareConfig.extras.customerDisplay * prices.customerDisplay;
    
    const paidKeys = Math.max(0, this.hardwareConfig.extras.digitalKeys - 3);
    total += paidKeys * prices.digitalKeys;
    
    return total;
  }

  calculateBuyTotal(): number {
    return this.competitionPrice + this.calculateHardwarePrice() + this.calculateExtrasPrice();
  }

  calculateRentTotal(): number {
    const pcDown = this.hardwareConfig.pcType === 'BYO' ? 0 : this.calculateHardwarePrice();
    const downPayment = this.RENTAL_BASE_DOWN + pcDown;
    const totalMonthly = this.RENTAL_BASE_MONTHLY;
    
    return downPayment + (totalMonthly * this.usageMonths);
  }

  calculateTotals() {
    this.buyTotal = this.calculateBuyTotal();
    this.rentTotal = this.calculateRentTotal();
  }

  calculateBreakEven() {
    const buyTotal = this.buyTotal;
    const pcDown = this.hardwareConfig.pcType === 'BYO' ? 0 : this.calculateHardwarePrice();
    const downPayment = this.RENTAL_BASE_DOWN + pcDown;
    const monthlyCost = this.RENTAL_BASE_MONTHLY;
    
    // Fix: Compare number with number
    if (monthlyCost <= 0) {
      this.breakEvenMonth = 0;
      return;
    }
    
    const breakEven = (buyTotal - downPayment) / monthlyCost;
    this.breakEvenMonth = Math.ceil(breakEven);
    this.monthlySavings = monthlyCost;
  }

  generateAdvantages() {
    this.advantages = [
      `Lower upfront cost: Save €${(this.buyTotal - this.RENTAL_BASE_DOWN).toLocaleString()} initially`,
      `Free maintenance & support (€500/year value)`,
      `Automatic software updates included`,
      `Tax deductible - consult your accountant`
    ];
    
    if (this.hardwareConfig.pcType === 'BYO') {
      this.advantages.push(`Use your existing hardware investment - save €${this.calculateHardwarePrice().toLocaleString()}`);
    }
    
    if (this.hardwareConfig.extras.secondPrinter > 0 || 
        this.hardwareConfig.extras.moneyDrawer > 0 || 
        this.hardwareConfig.extras.customerDisplay > 0) {
      this.advantages.push(`All peripherals covered under warranty`);
    }
    
    if (this.businessType === 'WOK' || this.businessType === 'RESTAURANT') {
      this.advantages.push(`Kitchen display system ready for high-volume orders`);
    }
    
    if (this.businessType === 'DELIVERY') {
      this.advantages.push(`Delivery routing integration ready for multi-platform orders`);
    }
    
    if (this.usageMonths < 71) {
      const savings = (this.buyTotal - this.rentTotal).toLocaleString();
      this.advantages.push(`You'll save €${savings} by renting for ${this.usageMonths} months`);
    }
    
    if (this.breakEvenMonth > 0 && this.breakEvenMonth < this.usageMonths) {
      this.advantages.push(`Note: After ${this.breakEvenMonth} months, buying becomes cheaper than renting`);
    }
  }

  createChart() {
    const canvas = document.getElementById('breakEvenChart') as HTMLCanvasElement;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Calculate data points
    const maxMonths = Math.max(this.usageMonths + 24, this.breakEvenMonth + 12);
    const months = Array.from({length: maxMonths + 1}, (_, i) => i);
    
    const buyData = months.map(() => this.buyTotal);
    const rentData = months.map(month => {
      const pcDown = this.hardwareConfig.pcType === 'BYO' ? 0 : this.calculateHardwarePrice();
      const downPayment = this.RENTAL_BASE_DOWN + pcDown;
      const monthlyCost = this.RENTAL_BASE_MONTHLY;
      return downPayment + (monthlyCost * month);
    });
    
    const config: ChartConfiguration = {
      type: 'line',
      data: {
        labels: months,
        datasets: [
          {
            label: 'Buy Total (Competition)',
            data: buyData,
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.1)',
            borderWidth: 3,
            tension: 0.1,
            fill: false
          },
          {
            label: 'Rent from Kassaku',
            data: rentData,
            borderColor: 'rgb(54, 162, 235)',
            backgroundColor: 'rgba(54, 162, 235, 0.1)',
            borderWidth: 3,
            tension: 0.1,
            fill: false
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          tooltip: {
            callbacks: {
              label: (context) => {
                return `${context.dataset.label}: €${context.raw?.toLocaleString()}`;
              }
            }
          },
          legend: {
            position: 'bottom'
          }
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Months',
              font: { weight: 'bold' }
            }
          },
          y: {
            title: {
              display: true,
              text: 'Total Cost (€)',
              font: { weight: 'bold' }
            },
            ticks: {
              callback: (value) => `€${value.toLocaleString()}`
            }
          }
        }
      }
    };
    
    // Destroy existing chart if it exists
    if (this.chart) {
      this.chart.destroy();
    }
    
    this.chart = new Chart(ctx, config);
  }

  getRecommendation(): string {
    if (this.rentTotal < this.buyTotal) {
      return 'Renting';
    } else if (this.buyTotal < this.rentTotal) {
      return 'Buying';
    } else {
      return 'Both options are equal';
    }
  }

  getSavings(): number {
    return Math.abs(this.rentTotal - this.buyTotal);
  }

  onSubmit() {
    console.log('Submitting quote...');
    // We'll implement email sending next
    alert('Quote generation coming soon! We will email you the full analysis.');
  }

  onBack() {
    this.back.emit();
  }

  onRestart() {
    this.restart.emit();
  }
}
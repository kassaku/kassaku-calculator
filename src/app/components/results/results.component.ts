import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { PRICES } from '../../models/prices.model'

// Register Chart.js components
Chart.register(...registerables);

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [CommonModule, TranslateModule],
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
  
  private readonly RENTAL_BASE_DOWN = 300;
  private readonly RENTAL_BASE_MONTHLY = 38;
  
  advantages: string[] = [];

  constructor(private translate: TranslateService) {}

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
      secondPrinter: PRICES.extras.secondPrinter,
      moneyDrawer: PRICES.extras.moneyDrawer,
      customerDisplay: PRICES.extras.customerDisplay,
      digitalKeys: PRICES.extras.digitalKey
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
    // Competition price (their system) + your extras + menu translation
    // NO computer price added because competition includes their own computer
    return this.competitionPrice + this.calculateExtrasPrice() 
    + this.getMenuTranslationPrice();
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
    
    if (monthlyCost <= 0) {
      this.breakEvenMonth = 0;
      return;
    }
    
    const breakEven = (buyTotal - downPayment) / monthlyCost;
    this.breakEvenMonth = Math.ceil(breakEven);
    this.monthlySavings = monthlyCost;
  }

  generateAdvantages() 
  {
    const savingsAmount = (this.buyTotal - this.RENTAL_BASE_DOWN).toLocaleString();
    this.advantages = [
      'results.lowerUpfront',
      'results.freeMaintenance',
      'results.autoUpdates',
      'results.taxDeductible'
    ];
    
    if (this.hardwareConfig.pcType === 'BYO') 
    {
      this.advantages.push('results.existingHardware');
    }
    
    if (this.hardwareConfig.extras.secondPrinter > 0 || 
        this.hardwareConfig.extras.moneyDrawer > 0 || 
        this.hardwareConfig.extras.customerDisplay > 0) 
    {
      this.advantages.push('results.warranty');
    }
    
    if (this.businessType === 'WOK' || this.businessType === 'RESTAURANT')
    {
      this.advantages.push('results.kitchenDisplay');
    }
    
    if (this.businessType === 'DELIVERY') 
    {
      this.advantages.push('results.deliveryRouting');
    }
    
    if (this.usageMonths < 71) 
    {
      this.advantages.push('results.savings');
    }
    
    if (this.breakEvenMonth > 0 && this.breakEvenMonth < this.usageMonths) 
    {
      this.advantages.push('results.note');
    }
  }
  createChart() 
  {
    const canvas = document.getElementById('breakEvenChart') as HTMLCanvasElement;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const maxMonths = Math.max(this.usageMonths + 24, this.breakEvenMonth + 12);
    const months = Array.from({length: maxMonths + 1}, (_, i) => i);
    
    const buyData = months.map(() => this.buyTotal);
    const rentData = months.map(month => {
      const pcDown = this.hardwareConfig.pcType === 'BYO' ? 0 : this.calculateHardwarePrice();
      const downPayment = this.RENTAL_BASE_DOWN + pcDown;
      const monthlyCost = this.RENTAL_BASE_MONTHLY;
      return downPayment + (monthlyCost * month);
    });
    
    const buyLabel = this.translate.instant('results.buy');
    const rentLabel = this.translate.instant('results.rent');
    const monthsLabel = this.translate.instant('duration.months');
    const costLabel = this.translate.instant('results.cost');
    
    const config: ChartConfiguration = {
      type: 'line',
      data: {
        labels: months,
        datasets: [
          {
            label: buyLabel,
            data: buyData,
            borderColor: 'rgb(255, 99, 132)',
            borderWidth: 3,
            tension: 0.1,
            fill: false
          },
          {
            label: rentLabel,
            data: rentData,
            borderColor: 'rgb(54, 162, 235)',
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
              label: (context) => `${context.dataset.label}: €${context.raw?.toLocaleString()}`
            }
          },
          legend: { position: 'bottom' }
        },
        scales: {
          x: { title: { display: true, text: monthsLabel, font: { weight: 'bold' } } },
          y: { 
            title: { display: true, text: costLabel, font: { weight: 'bold' } },
            ticks: { callback: (value) => `€${value.toLocaleString()}` }
          }
        }
      }
    };
    
    if (this.chart) this.chart.destroy();
    this.chart = new Chart(ctx, config);
  }

  getRecommendation(): string 
  {
    if (this.rentTotal < this.buyTotal) {
      return 'results.rent';
    } else if (this.buyTotal < this.rentTotal) {
      return 'results.buy';
    } else {
      return 'results.equal';
    }
  }

  getSavings(): number 
  {
    return Math.abs(this.rentTotal - this.buyTotal);
  }

  onSubmit() 
  {
    console.log('Submitting quote...');
    alert('Quote generation coming soon! We will email you the full analysis.');
  }

  onBack() 
  {
    this.back.emit();
  }

  onRestart() 
  {
    this.restart.emit();
  }

  getAdvantageParams(advantage: string): any 
  {
    const savingsAmount = (this.buyTotal - this.RENTAL_BASE_DOWN).toLocaleString();
    const existingHardwareSavings = this.calculateHardwarePrice().toLocaleString();
    const rentSavings = (this.buyTotal - this.rentTotal).toLocaleString();
    
    switch(advantage) {
      case 'results.lowerUpfront':
        return { amount: savingsAmount };
      case 'results.existingHardware':
        return { amount: existingHardwareSavings };
      case 'results.savings':
        return { amount: rentSavings, months: this.usageMonths };
      case 'results.note':
        return { months: this.breakEvenMonth };
      default:
        return {};
    }
  }

  getMenuTranslationPrice(): number 
  {
    switch(this.hardwareConfig.menuOption) {
      case 'dutch': return 100;
      case 'both': return 400;
      default: return 0;
    }
  }

} 
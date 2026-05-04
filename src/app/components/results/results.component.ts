import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { PRICES } from '../../models/prices.model';
import { PC_OPTIONS } from '../../models/calculator.model';

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
  
  competitionTotal: number = 0;
  rentTotal: number = 0;
  breakEvenMonth: number = 0;
  chart: Chart | undefined;
  advantages: string[] = [];
  // Store cumulative totals array [0..maxMonths]
  totalPerMonth: number[] = [];
  // hardwareMonthly: number = 0; // only for smaller time period 

  public PRICES = PRICES;

  constructor(private translate: TranslateService) {}

  ngOnInit() 
  {
    console.log('pcPurchaseType in results:', this.hardwareConfig?.pcPurchaseType);
    this.calculateCompetitionTotal();
    this.calculateCumulativeTotals();
    this.rentTotal = this.totalPerMonth[this.usageMonths] || 0;
    this.calculateBreakEven();
    this.generateAdvantages();
    setTimeout(() => this.createChart(), 100);
  }

  // Get hardware cost for a specific month
  // month 0: upfront cost (if buying) or 0 (if renting)
  // month 1-60: monthly rent (if renting) or 0 (if buying)
  // month 61+: 0
  getHardwareCostForMonth(month: number): number 
  {  
    // If BYO, no hardware cost ever
    if (this.hardwareConfig.pcType === 'BYO') return 0;
    
    // Month 0: upfront cost if buying
    if (month === 0) 
    {
      return this.hardwareConfig.pcAmount;
    }
    
    // Months 1-60: monthly rent if renting
    else if (month < PRICES.rental.hardwareMonths 
      && this.hardwareConfig.pcPurchaseType === 'rent') 
    {
      return this.hardwareConfig.pcAmount;  // Pre-calculated monthly rent
    }
    
    // Months 61+: no hardware cost
    return 0;
  }

  // Calculate extras price
  calculateExtrasPrice(): number
  {
    let total = 0;
    total += this.hardwareConfig.extras.secondPrinter * PRICES.extras.secondPrinter;
    total += this.hardwareConfig.extras.moneyDrawer * PRICES.extras.moneyDrawer;
    total += this.hardwareConfig.extras.customerDisplay * PRICES.extras.customerDisplay;
    
    const paidKeys = Math.max(0, this.hardwareConfig.extras.digitalKeys - PRICES.digitalKeys.freeKeys);
    total += paidKeys * PRICES.extras.digitalKey;
    
    return total;
  }

  // Get menu translation price
  getMenuTranslationPrice(): number 
  {
    switch(this.hardwareConfig.menuOption) 
    {
      case 'dutch': return PRICES.menuTranslation.dutch;
      case 'both': return PRICES.menuTranslation.chinese;
      default: return 0;
    }
  }

  // Calculate buy total (competition + extras + menu)
  calculateCompetitionTotal(): void 
  {
    this.competitionTotal = this.competitionPrice + this.calculateExtrasPrice() + this.getMenuTranslationPrice();
  }

// Then just use the property directly
  getMonthlyComputerRent(): number 
  {
    return this.hardwareConfig.pcAmount;
  }


  // Get rent total at specific month (cumulative)
  getRentTotalAtMonth(month: number): number 
  {
    return this.totalPerMonth[month] || 0;
  }


  // Build cumulative totals array
  calculateCumulativeTotals(): void 
  {
    const maxMonths = 240;
    this.totalPerMonth = new Array(maxMonths + 1);
    
    let cumulative = 0;
    
    for (let month = 0; month <= maxMonths; month++) 
    {
      cumulative += this.calculateCostForMonth(month);
      this.totalPerMonth[month] = cumulative;
    }
  }

// Calculate break-even month
  calculateBreakEven(): void {
    let breakEvenMonth = 0;
    for (let month = 1; month <= 240; month++) {
      if (this.totalPerMonth[month] >= this.competitionTotal) {
        breakEvenMonth = month;
        break;
      }
    }
    this.breakEvenMonth = breakEvenMonth;
  }

  // Calculate total cost for a specific month (0 = initial, 1-240 = monthly)
  calculateCostForMonth(month: number): number {
    // Month 0: initial costs (extras + menu + PC if bought)
    if (month === 0) 
    {
      let cost = this.calculateExtrasPrice() + this.getMenuTranslationPrice();
      
      // Add upfront computer cost if buying (not renting)
      if (this.hardwareConfig.pcPurchaseType === 'buy') 
      {
        cost += this.getHardwareCostForMonth(month);
      }
      return cost;
    }
    let cost = PRICES.rental.softwareMonthly;

    cost += this.getHardwareCostForMonth(month);
    return cost;
  }

  // Create chart using the cumulative totals array
  createChart(): void {
    const canvas = document.getElementById('breakEvenChart') as HTMLCanvasElement;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const maxMonths = Math.min(240, this.usageMonths + 24);
    const months = Array.from({ length: maxMonths + 1 }, (_, i) => i);
    
    // Buy data (flat line)
    const buyData = months.map(() => this.competitionTotal);
    
    // Rent data from pre-calculated array
    const rentData = months.map(month => this.totalPerMonth[month]);
    
    const config: ChartConfiguration = {
      type: 'line',
      data: {
        labels: months,
        datasets: [
          {
            label: this.translate.instant('results.buy'),
            data: buyData,
            borderColor: 'rgb(255, 99, 132)',
            borderWidth: 3,
            tension: 0.1,
            fill: false
          },
          {
            label: this.translate.instant('results.rent'),
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
          x: { 
            title: { display: true, text: this.translate.instant('duration.months'), font: { weight: 'bold' } }
          },
          y: { 
            title: { display: true, text: this.translate.instant('results.cost'), font: { weight: 'bold' } },
            ticks: { callback: (value) => `€${value.toLocaleString()}` }
          }
        }
      }
    };
    
    if (this.chart) this.chart.destroy();
    this.chart = new Chart(ctx, config);
  }

  // Helper methods for template
  getTotalExtrasPrice(): number {
    return this.calculateExtrasPrice();
  }


  generateAdvantages(): void {
    let buyPrice = 0;
    if (this.hardwareConfig.pcPurchaseType === 'buy') 
    {
      buyPrice = this.hardwareConfig.pcAmount;
    }
    const extrasTotal = this.calculateExtrasPrice();
    const menuTotal = this.getMenuTranslationPrice();
    const totalUpfront = buyPrice + extrasTotal + menuTotal;
    
    this.advantages = [
      'results.lowerUpfront',
      'results.freeMaintenance',
      'results.autoUpdates',
      'results.taxDeductible'
    ];
    
    if (this.hardwareConfig.pcType === 'BYO') {
      this.advantages.push('results.existingHardware');
    }
    
    if (extrasTotal > 0) {
      this.advantages.push('results.warranty');
    }
    
    if (this.businessType === 'WOK' || this.businessType === 'RESTAURANT') {
      this.advantages.push('results.kitchenDisplay');
    }
    
    if (this.businessType === 'DELIVERY') {
      this.advantages.push('results.deliveryRouting');
    }
    
    if (this.usageMonths < 71) {
      this.advantages.push('results.savings');
    }
    
    if (this.breakEvenMonth > 0 && this.breakEvenMonth < this.usageMonths) {
      this.advantages.push('results.note');
    }
  }

  getAdvantageParams(advantage: string): any {
    const buyPrice = 0;
    const extrasTotal = this.calculateExtrasPrice();
    const menuTotal = this.getMenuTranslationPrice();
    const totalUpfront = buyPrice + extrasTotal + menuTotal;
    const savingsAmount = (this.competitionTotal - totalUpfront).toLocaleString();
    const rentSavings = (this.competitionTotal - this.rentTotal).toLocaleString();
    
    switch(advantage) {
      case 'results.lowerUpfront':
        return { amount: savingsAmount };
      case 'results.existingHardware':
        return { amount: buyPrice.toLocaleString() };
      case 'results.savings':
        return { amount: rentSavings, months: this.usageMonths };
      case 'results.note':
        return { months: this.breakEvenMonth };
      default:
        return {};
    }
  }

  getRecommendation(): string {
    if (this.rentTotal < this.competitionTotal) {
      return 'results.rent';
    } else if (this.competitionTotal < this.rentTotal) {
      return 'results.buy';
    } else {
      return 'results.equal';
    }
  }

  getSavings(): number {
    return Math.abs(this.rentTotal - this.competitionTotal);
  }

  onSubmit(): void {
    console.log('Submitting quote...');
    alert('Quote generation coming soon! We will email you the full analysis.');
  }

  onBack(): void {
    this.back.emit();
  }

  onRestart(): void {
    this.restart.emit();
  }
}

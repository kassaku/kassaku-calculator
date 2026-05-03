import { Component, EventEmitter, Output, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  PcType, 
  PcOption, 
  PC_OPTIONS, 
  DISPLAY_OPTIONS,
  PROCESSOR_OPTIONS,
  ExtrasConfig, 
  BusinessType 
} from '../../models/calculator.model';

@Component({
  selector: 'app-hardware-config',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './hardware-config.component.html',
  styleUrls: ['./hardware-config.component.css']
})
export class HardwareConfigComponent implements OnInit {
  @Output() configChanged = new EventEmitter<{
    pcType: PcType, 
    displayChoice?: string,
    processorChoice?: string,
    extras: ExtrasConfig
  }>();
  @Output() next = new EventEmitter<void>();
  @Output() back = new EventEmitter<void>();
  @Input() businessType: BusinessType | null = null;

  pcOptions = PC_OPTIONS;
  displayOptions = DISPLAY_OPTIONS;
  processorOptions = PROCESSOR_OPTIONS;
  
  selectedPcType: PcType = 'PROFESSIONAL';
  selectedDisplay: string = 'widescreen';
  selectedProcessor: string = 'i5';
  
  extras: ExtrasConfig = {
    secondPrinter: 0,
    moneyDrawer: 0,
    customerDisplay: 0,
    digitalKeys: 3
  };

  ngOnInit() {
    this.emitConfig();
  }

  onPcTypeChange(): void {
    // Reset selections when PC type changes
    if (this.selectedPcType === 'ECONOMY') {
      this.selectedDisplay = 'normal';
    } else if (this.selectedPcType === 'PROFESSIONAL') {
      this.selectedProcessor = 'i5';
    }
    this.emitConfig();
  }

  onDisplayChange(): void {
    this.emitConfig();
  }

  onProcessorChange(): void {
    this.emitConfig();
  }

  updateExtra(itemId: keyof ExtrasConfig, change: number): void {
    const maxQuantities = {
      secondPrinter: 2,
      moneyDrawer: 1,
      customerDisplay: 1,
      digitalKeys: 10
    };
    
    const currentQty = this.extras[itemId] as number;
    const newQty = currentQty + change;
    
    if (newQty >= 0 && newQty <= maxQuantities[itemId]) {
      this.extras[itemId] = newQty as never;
      this.emitConfig();
    }
  }

  getExtraPrice(itemId: keyof ExtrasConfig): number {
    const prices = {
      secondPrinter: 150,
      moneyDrawer: 120,
      customerDisplay: 180,
      digitalKeys: 25
    };
    
    let quantity = this.extras[itemId] as number;
    if (itemId === 'digitalKeys') {
      quantity = Math.max(0, quantity - 3); // First 3 free
    }
    return quantity * prices[itemId];
  }

  getTotalExtrasPrice(): number {
    return Object.keys(this.extras).reduce((total, key) => {
      return total + this.getExtraPrice(key as keyof ExtrasConfig);
    }, 0);
  }

  getBasePrice(): number {
    if (this.selectedPcType === 'ECONOMY') {
      if (this.selectedDisplay === 'normal') return 899;
      if (this.selectedDisplay === 'widescreen') return 999;
      return 899;
    } else if (this.selectedPcType === 'PROFESSIONAL') {
      if (this.selectedProcessor === 'celeron') return 1500;
      if (this.selectedProcessor === 'i5') return 2200;
      return 1500;
    } else {
      return 0; // BYO
    }
  }

  getTotalPrice(): number {
    return this.getBasePrice() + this.getTotalExtrasPrice();
  }

  getDisplayPrice(): number {
    if (this.selectedPcType !== 'ECONOMY') return 0;
    return this.selectedDisplay === 'normal' ? 899 : 999;
  }

  getProcessorPrice(): number {
    if (this.selectedPcType !== 'PROFESSIONAL') return 0;
    return this.selectedProcessor === 'celeron' ? 1500 : 2200;
  }

  private emitConfig(): void {
    this.configChanged.emit({
      pcType: this.selectedPcType,
      displayChoice: this.selectedPcType === 'ECONOMY' ? this.selectedDisplay : undefined,
      processorChoice: this.selectedPcType === 'PROFESSIONAL' ? this.selectedProcessor : undefined,
      extras: { ...this.extras }
    });
  }

  onNext(): void {
    this.next.emit();
  }

  onBack(): void {
    this.back.emit();
  }

  getDigitalKeysDisplay(): string {
    const paid = Math.max(0, this.extras.digitalKeys - 3);
    return `${this.extras.digitalKeys} total (${paid} paid, 3 free)`;
  }

  isEconomy(): boolean {
    return this.selectedPcType === 'ECONOMY';
  }

  isProfessional(): boolean {
    return this.selectedPcType === 'PROFESSIONAL';
  }

  isBYO(): boolean {
    return this.selectedPcType === 'BYO';
  }
}
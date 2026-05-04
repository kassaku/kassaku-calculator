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
import { PRICES } from '../../models/prices.model';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-hardware-config',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './hardware-config.component.html',
  styleUrls: ['./hardware-config.component.css']
})
export class HardwareConfigComponent implements OnInit {
  @Output() configChanged = new EventEmitter<{
    pcType: PcType, 
    menuTranslation: string,
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
  public PRICES = PRICES;

  selectedMenuTranslation: string = 'none';
  selectedPcType: PcType = 'PROFESSIONAL';
  selectedDisplay: string = 'widescreen';
  selectedProcessor: string = 'i5';
  
  extras: ExtrasConfig = {
    secondPrinter: 0,
    moneyDrawer: 0,
    customerDisplay: 0,
    digitalKeys: PRICES.digitalKeys.freeKeys
  };

  ngOnInit() {
    this.emitConfig();
  }

  onPcTypeChange(): void {
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

  getBasePriceForType(pcType: PcType): number 
  {
    if (pcType === 'ECONOMY') {
      return PRICES.economy.basePrice;
    } else if (pcType === 'PROFESSIONAL') {
      return this.selectedProcessor === 'celeron' ? PRICES.professional.celeron : PRICES.professional.i5;
    }
    return 0;
  }

  onProcessorChange(): void {
    this.emitConfig();
  }

  updateExtra(itemId: keyof ExtrasConfig, change: number): void {
    const maxQuantities = {
      secondPrinter: 2,
      moneyDrawer: 1,
      customerDisplay: 1,
      digitalKeys: PRICES.digitalKeys.maxKeys
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
      secondPrinter: PRICES.extras.secondPrinter,
      moneyDrawer: PRICES.extras.moneyDrawer,
      customerDisplay: PRICES.extras.customerDisplay,
      digitalKeys: PRICES.extras.digitalKey
    };
    
    let quantity = this.extras[itemId] as number;
    if (itemId === 'digitalKeys') {
      quantity = Math.max(0, quantity - PRICES.digitalKeys.freeKeys);
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
      return PRICES.economy.basePrice;
    } else if (this.selectedPcType === 'PROFESSIONAL') {
      if (this.selectedProcessor === 'celeron') return PRICES.professional.celeron;
      if (this.selectedProcessor === 'i5') return PRICES.professional.i5;
      return PRICES.professional.celeron;
    } else {
      return 0;
    }
  }

  getTotalPrice(): number {
    return this.getBasePrice() + this.getTotalExtrasPrice();
  }

  getDisplayPrice(): number {
    if (this.selectedPcType !== 'ECONOMY') return 0;
    return PRICES.economy.basePrice;
  }

  getProcessorPrice(): number {
    if (this.selectedPcType !== 'PROFESSIONAL') return 0;
    return this.selectedProcessor === 'celeron' ? PRICES.professional.celeron : PRICES.professional.i5;
  }

  private emitConfig(): void {
    this.configChanged.emit({
      pcType: this.selectedPcType,
      menuTranslation: this.selectedMenuTranslation,  // Add this
      displayChoice: this.selectedPcType === 'ECONOMY' ? this.selectedDisplay : undefined,
      processorChoice: this.selectedPcType === 'PROFESSIONAL' ? this.selectedProcessor : undefined,
      extras: { ...this.extras },
    });
  }

  onNext(): void {
    this.next.emit();
  }

  onBack(): void {
    this.back.emit();
  }

  public getDisplayIcon(displayId: string): string 
  {
    return displayId === 'normal' ? '/icons/pp9735.png' : '/icons/pp9735wl.png';
  }

  public getProcessorIcon(processorId: string): string 
  {
    return '/icons/xpos.png';  // Same icon for both
  }

  getDigitalKeysDisplay(): string {
    const paid = Math.max(0, this.extras.digitalKeys - PRICES.digitalKeys.freeKeys);
    return `${this.extras.digitalKeys} total (${paid} paid, ${PRICES.digitalKeys.freeKeys} free)`;
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
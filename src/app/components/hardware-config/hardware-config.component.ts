import { Component, EventEmitter, Output, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  PcType, 
  PcOption, 
  PC_OPTIONS,
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
    extras: ExtrasConfig,
    menuOption: 'none' | 'dutch' | 'both'
  }>();
  @Output() next = new EventEmitter<void>();
  @Output() back = new EventEmitter<void>();
  @Input() businessType: BusinessType | null = null;

  pcOptions = PC_OPTIONS;
  public PRICES = PRICES;
  
  selectedPcType: PcType = 'PROFESSIONAL_I5';
  selectedMenuOption: 'none' | 'dutch' | 'both' = 'none';
  
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
    const selected = this.pcOptions.find(p => p.value === this.selectedPcType);
    return selected ? selected.price : 0;
  }

  getTotalPrice(): number {
    return this.getBasePrice() + this.getTotalExtrasPrice() + this.getMenuPrice();
  }

  getMenuPrice(): number {
    switch(this.selectedMenuOption) {
      case 'dutch': return PRICES.menuTranslation.dutch;
      case 'both': return PRICES.menuTranslation.chinese;
      default: return 0;
    }
  }

  private emitConfig(): void {
    this.configChanged.emit({
      pcType: this.selectedPcType,
      extras: { ...this.extras },
      menuOption: this.selectedMenuOption
    });
  }

  onNext(): void {
    this.next.emit();
  }

  onBack(): void {
    this.back.emit();
  }

  getDigitalKeysDisplay(): string {
    const paid = Math.max(0, this.extras.digitalKeys - PRICES.digitalKeys.freeKeys);
    return `${this.extras.digitalKeys} total (${paid} paid, ${PRICES.digitalKeys.freeKeys} free)`;
  }
}
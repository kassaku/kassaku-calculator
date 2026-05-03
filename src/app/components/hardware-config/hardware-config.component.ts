import { Component, EventEmitter, Output, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  PcType, PcOption, PC_OPTIONS, 
  ScreenOption, SCREEN_OPTIONS, 
  ExtraItem, EXTRA_ITEMS, 
  ExtrasConfig, BusinessType 
} from '../../models/calculator.model';

@Component({
  selector: 'app-hardware-config',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './hardware-config.component.html',
  styleUrls: ['./hardware-config.component.css']
})
export class HardwareConfigComponent implements OnInit {
  @Output() configChanged = new EventEmitter<{pcType: PcType, screens: string[], extras: ExtrasConfig}>();
  @Output() next = new EventEmitter<void>();
  @Output() back = new EventEmitter<void>();
  @Input() businessType: BusinessType | null = null;

  pcOptions = PC_OPTIONS;
  screenOptions = SCREEN_OPTIONS;
  extraItems = EXTRA_ITEMS;

  selectedPcType: PcType = 'PROFESSIONAL';
  selectedScreens: string[] = [];
  extras: ExtrasConfig = {
    secondPrinter: 0,
    moneyDrawer: 0,
    customerDisplay: 0,
    digitalKeys: 3
  };

  ngOnInit() {
    // Auto-recommend screens based on business type
    if (this.businessType) {
      const recommended = SCREEN_OPTIONS
        .filter(screen => screen.recommendedFor?.includes(this.businessType!))
        .map(screen => screen.id);
      this.selectedScreens = recommended;
    }
  }

  onPcTypeChange(): void {
      this.emitConfig();
  }

  onScreenToggle(screenId: string): void {
    const index = this.selectedScreens.indexOf(screenId);
    if (index === -1) {
      this.selectedScreens.push(screenId);
    } else {
      this.selectedScreens.splice(index, 1);
    }
    this.emitConfig();
  }

  isScreenSelected(screenId: string): boolean {
    return this.selectedScreens.includes(screenId);
  }

  updateExtra(itemId: keyof ExtrasConfig, change: number): void {
    const item = this.extraItems.find(i => i.id === itemId);
    if (!item) return;

    const newValue = this.extras[itemId] as number + change;
    if (newValue >= 0 && newValue <= item.maxQuantity) {
      this.extras[itemId] = newValue as never;
      this.emitConfig();
    }
  }

  getExtraPrice(itemId: keyof ExtrasConfig): number {
    const item = this.extraItems.find(i => i.id === itemId);
    if (!item) return 0;
    
    let quantity = this.extras[itemId] as number;
    if (itemId === 'digitalKeys') {
      quantity = Math.max(0, quantity - 3); // First 3 free
    }
    return quantity * item.price;
  }

  getTotalExtrasPrice(): number {
    return this.extraItems.reduce((total, item) => {
      return total + this.getExtraPrice(item.id);
    }, 0);
  }

  getScreenPrice(screenId: string): number {
    const screen = this.screenOptions.find(s => s.id === screenId);
    return screen?.price || 0;
  }

  getTotalScreenPrice(): number {
    return this.selectedScreens.reduce((total, screenId) => {
      return total + this.getScreenPrice(screenId);
    }, 0);
  }

  getTotalPrice(): number {
    const pcPrice = this.pcOptions.find(p => p.value === this.selectedPcType)?.price || 0;
    return pcPrice + this.getTotalScreenPrice() + this.getTotalExtrasPrice();
  }

  private emitConfig(): void {
    this.configChanged.emit({
      pcType: this.selectedPcType,
      screens: this.selectedScreens,
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
}
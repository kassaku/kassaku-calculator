import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BusinessTypeSelectionComponent } from './components/business-type-selection/business-type-selection.component';
import { CompetitionPriceComponent } from './components/competition-price/competition-price.component';
import { HardwareConfigComponent } from './components/hardware-config/hardware-config.component';
import { DurationEmailComponent } from './components/duration-email/duration-email.component';
import { BusinessType, PcType, ExtrasConfig } from './models/calculator.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, BusinessTypeSelectionComponent, CompetitionPriceComponent, HardwareConfigComponent, DurationEmailComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'kassaku-calculator';
  step: number = 1;
  
  // Step 1
  selectedBusinessType: BusinessType | null = null;
  
  // Step 2
  competitionPrice: number = 3000;
  
  // Step 3
  hardwareConfig: {
    pcType: PcType, 
    displayChoice?: string,
    processorChoice?: string,
    extras: ExtrasConfig
  } = {
    pcType: 'PROFESSIONAL',
    displayChoice: 'widescreen',
    processorChoice: 'i5',
    extras: {
      secondPrinter: 0,
      moneyDrawer: 0,
      customerDisplay: 0,
      digitalKeys: 3
    }
  };
  
  // Step 4
  durationEmailConfig: {
    usageMonths: number,
    email: string,
    newsletterOptIn: boolean
  } = {
    usageMonths: 60,
    email: '',
    newsletterOptIn: true
  };

  onBusinessTypeSelected(type: BusinessType) {
    this.selectedBusinessType = type;
  }

  onCompetitionPriceChanged(price: number) {
    this.competitionPrice = price;
  }

  onHardwareConfigChanged(config: {
    pcType: PcType, 
    displayChoice?: string,
    processorChoice?: string,
    extras: ExtrasConfig
  }) {
    this.hardwareConfig = config;
  }

  onDurationEmailChanged(config: {
    usageMonths: number,
    email: string,
    newsletterOptIn: boolean
  }) {
    this.durationEmailConfig = config;
  }

  nextStep() {
    this.step++;
  }

  previousStep() {
    this.step--;
  }

  onNext() {
    this.nextStep();
  }

  onBack() {
    this.previousStep();
  }

  // Helper for summary display
  getBusinessTypeName(): string {
    const types: {[key: string]: string} = {
      'WOK': 'WOK',
      'RESTAURANT': 'Restaurant',
      'TAKEAWAY': 'Takeaway',
      'DELIVERY': 'Delivery'
    };
    return this.selectedBusinessType ? types[this.selectedBusinessType] : 'Not selected';
  }

  getHardwareSummary(): string {
    if (this.hardwareConfig.pcType === 'BYO') {
      return 'Bring Your Own PC';
    }
    if (this.hardwareConfig.pcType === 'ECONOMY') {
      const display = this.hardwareConfig.displayChoice === 'normal' ? 'Normal (4:3)' : 'Widescreen (16:9)';
      return `Economy PC with ${display} display`;
    }
    if (this.hardwareConfig.pcType === 'PROFESSIONAL') {
      const processor = this.hardwareConfig.processorChoice === 'celeron' ? 'Celeron' : 'Intel Core i5';
      return `Professional PC with ${processor} processor`;
    }
    return 'Configured';
  }
}
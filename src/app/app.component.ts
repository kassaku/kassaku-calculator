import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BusinessTypeSelectionComponent } from './components/business-type-selection/business-type-selection.component';
import { CompetitionPriceComponent } from './components/competition-price/competition-price.component';
import { HardwareConfigComponent } from './components/hardware-config/hardware-config.component';
import { DurationEmailComponent } from './components/duration-email/duration-email.component';
import { ResultsComponent } from './components/results/results.component';
import { BusinessType, PcType, ExtrasConfig } from './models/calculator.model';
import { LanguageSwitcherComponent } from './components/language-switcher/language-switcher.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, 
    BusinessTypeSelectionComponent, 
    CompetitionPriceComponent, 
    HardwareConfigComponent, 
    DurationEmailComponent,
    ResultsComponent,
    LanguageSwitcherComponent
  ],
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
  
  // Step 3 - Updated for new PC types
  hardwareConfig: {
    pcType: PcType, 
    extras: ExtrasConfig,
    menuOption: 'none' | 'dutch' | 'both'
  } = {
    pcType: 'PROFESSIONAL_I5',
    extras: {
      secondPrinter: 0,
      moneyDrawer: 0,
      customerDisplay: 0,
      digitalKeys: 3
    },
    menuOption: 'none'
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
    extras: ExtrasConfig,
    menuOption: 'none' | 'dutch' | 'both'
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

  onRestart() {
    this.step = 1;
    this.selectedBusinessType = null;
    this.competitionPrice = 3000;
    this.hardwareConfig = {
      pcType: 'PROFESSIONAL_I5',
      extras: {
        secondPrinter: 0,
        moneyDrawer: 0,
        customerDisplay: 0,
        digitalKeys: 3
      },
      menuOption: 'none'
    };
    this.durationEmailConfig = {
      usageMonths: 60,
      email: '',
      newsletterOptIn: true
    };
  }

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
    const pc = this.hardwareConfig.pcType;
    switch(pc) {
      case 'STANDARD_4_3':
        return 'Standard 4:3';
      case 'STANDARD_WIDESCREEN':
        return 'Standard Widescreen';
      case 'PROFESSIONAL_CELERON':
        return 'Professional Celeron';
      case 'PROFESSIONAL_I5':
        return 'Professional Core i5';
      case 'BYO':
        return 'Bring Your Own PC';
      default:
        return 'Configured';
    }
  }
}
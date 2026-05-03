import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BusinessTypeSelectionComponent } from './components/business-type-selection/business-type-selection.component';
import { CompetitionPriceComponent } from './components/competition-price/competition-price.component';
import { HardwareConfigComponent } from './components/hardware-config/hardware-config.component';
import { BusinessType, PcType, ExtrasConfig } from './models/calculator.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, BusinessTypeSelectionComponent, CompetitionPriceComponent, HardwareConfigComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'kassaku-calculator';
  step: number = 1;
  selectedBusinessType: BusinessType | null = null;
  competitionPrice: number = 3000;
  hardwareConfig: {pcType: PcType, screens: string[], extras: ExtrasConfig} = {
    pcType: 'PROFESSIONAL',
    screens: [],
    extras: {
      secondPrinter: 0,
      moneyDrawer: 0,
      customerDisplay: 0,
      digitalKeys: 3
    }
  };

  onBusinessTypeSelected(type: BusinessType) {
    this.selectedBusinessType = type;
  }

  onCompetitionPriceChanged(price: number) {
    this.competitionPrice = price;
  }

  onHardwareConfigChanged(config: {pcType: PcType, screens: string[], extras: ExtrasConfig}) {
    this.hardwareConfig = config;
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
}
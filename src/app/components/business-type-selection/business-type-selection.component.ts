import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BusinessType, BUSINESS_TYPES } from '../../models/calculator.model';

@Component({
  selector: 'app-business-type-selection',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './business-type-selection.component.html',
  styleUrls: ['./business-type-selection.component.css']
})
export class BusinessTypeSelectionComponent {
  @Output() selectionChanged = new EventEmitter<BusinessType>();
  @Output() next = new EventEmitter<void>();
  
  businessTypes = BUSINESS_TYPES;
  selectedType: BusinessType | null = null;
  errorMessage = '';

  selectBusinessType(type: BusinessType): void {
    this.selectedType = type;
    this.errorMessage = '';
    this.selectionChanged.emit(type);
  }

  isSelected(type: BusinessType): boolean {
    return this.selectedType === type;
  }

  onNext(): void {
    if (!this.selectedType) {
      this.errorMessage = 'Please select a business type to continue';
      return;
    }
    this.next.emit();
  }
}
import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

export type BusinessType = 'WOK' | 'RESTAURANT' | 'TAKEAWAY' | 'DELIVERY';

@Component({
  selector: 'app-business-type-selection',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './business-type-selection.component.html',
  styleUrls: ['./business-type-selection.component.css']
})
export class BusinessTypeSelectionComponent {
  @Output() selectionChanged = new EventEmitter<BusinessType>();
  @Output() next = new EventEmitter<void>();
  
  selectedType: BusinessType | null = null;
  errorMessage = '';

  selectBusinessType(type: BusinessType): void {
    this.selectedType = type;
    this.errorMessage = '';
    this.selectionChanged.emit(type);
  }

  onNext(): void {
    if (!this.selectedType) {
      this.errorMessage = 'business.error';
      return;
    }
    this.next.emit();
  }
}

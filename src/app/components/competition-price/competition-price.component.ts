import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-competition-price',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './competition-price.component.html',
  styleUrls: ['./competition-price.component.css']
})
export class CompetitionPriceComponent {
  @Output() priceChanged = new EventEmitter<number>();
  @Output() next = new EventEmitter<void>();
  @Output() back = new EventEmitter<void>();
  
  competitionPrice: number = 3000;
  errorMessage: string = '';

  onPriceChange(value: number): void {
    this.competitionPrice = value;
    this.errorMessage = '';
    this.priceChanged.emit(value);
  }

  formatCurrency(event: any): void {
    let value = event.target.value.replace(/[^0-9.,]/g, '');
    this.competitionPrice = parseFloat(value) || 0;
    this.priceChanged.emit(this.competitionPrice);
  }

  onNext(): void {
    if (this.competitionPrice < 0) {
      this.errorMessage = 'Price cannot be negative';
      return;
    }
    if (this.competitionPrice > 10000) {
      this.errorMessage = 'Price cannot exceed €10,000';
      return;
    }
    this.next.emit();
  }

  onBack(): void {
    this.back.emit();
  }
}
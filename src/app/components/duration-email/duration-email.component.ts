import { Component, EventEmitter, Output, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-duration-email',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './duration-email.component.html',
  styleUrls: ['./duration-email.component.css']
})
export class DurationEmailComponent implements OnInit {
  @Output() configChanged = new EventEmitter<{usageMonths: number, email: string, newsletterOptIn: boolean}>();
  @Output() next = new EventEmitter<void>();
  @Output() back = new EventEmitter<void>();
  @Input() usageMonths: number = 60;
  @Input() email: string = '';
  @Input() newsletterOptIn: boolean = true;
  @Input() businessTypeName: string = '';
  @Input() competitionPrice: number = 0;
  @Input() hardwareSummary: string = '';

  // UI state
  usageMonthsSlider: number = 60;
  confirmEmail: string = '';
  emailError: string = '';
  matchError: string = '';

  // Tick marks for slider
  tickMarks = [12, 24, 36, 48, 60, 72, 84, 96, 108, 120];

  ngOnInit() {
    this.usageMonthsSlider = this.usageMonths;
    this.emitConfig();
  }

  onSliderChange(value: number): void {
    this.usageMonthsSlider = value;
    this.usageMonths = value;
    this.emitConfig();
  }

  onMonthsInputChange(value: number): void {
    if (value >= 12 && value <= 120) {
      this.usageMonthsSlider = value;
      this.usageMonths = value;
      this.emitConfig();
    }
  }

  onEmailChange(): void {
    this.validateEmail();
    this.validateMatch();
    if (!this.emailError && !this.matchError) {
      this.emitConfig();
    }
  }

  onConfirmEmailChange(): void {
    this.validateMatch();
    if (!this.emailError && !this.matchError) {
      this.emitConfig();
    }
  }

  onNewsletterChange(): void {
    this.emitConfig();
  }

  validateEmail(): void {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!this.email) {
      this.emailError = 'Email is required';
    } else if (!emailRegex.test(this.email)) {
      this.emailError = 'Please enter a valid email address';
    } else {
      this.emailError = '';
    }
  }

  validateMatch(): void {
    if (this.confirmEmail && this.email !== this.confirmEmail) {
      this.matchError = 'Emails do not match';
    } else {
      this.matchError = '';
    }
  }

  isValid(): boolean {
    return !this.emailError && !this.matchError && this.email !== '';
  }

  getYearsText(): string {
    const years = this.usageMonths / 12;
    return `${this.usageMonths} months = ${years} years`;
  }

  private emitConfig(): void {
    if (this.isValid()) {
      this.configChanged.emit({
        usageMonths: this.usageMonths,
        email: this.email,
        newsletterOptIn: this.newsletterOptIn
      });
    }
  }

  onNext(): void {
    if (this.isValid()) {
      this.next.emit();
    }
  }

  onBack(): void {
    this.back.emit();
  }

  getBusinessTypeName(): string {
    const types: {[key: string]: string} = {
      'WOK': 'WOK - Fast casual',
      'RESTAURANT': 'Restaurant - Full service',
      'TAKEAWAY': 'Takeaway - Pickup only',
      'DELIVERY': 'Delivery - No physical location'
    };
    return types[this.businessTypeName] || 'Not selected';
  }

  getHardwareSummary(): string {
    return this.hardwareSummary || 'Configured';
  }
}


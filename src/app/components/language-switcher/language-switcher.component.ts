import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-language-switcher',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="language-switcher">
      <button 
        (click)="switchLanguage('nl')" 
        [class.active]="currentLang === 'nl'"
        class="lang-btn">
        🇳🇱 Nederlands
      </button>
      <button 
        (click)="switchLanguage('en')" 
        [class.active]="currentLang === 'en'"
        class="lang-btn">
        🇬🇧 English
      </button>
      <button 
        (click)="switchLanguage('zh')" 
        [class.active]="currentLang === 'zh'"
        class="lang-btn">
        🇨🇳 中文
      </button>
    </div>
  `,
  styles: [`
    .language-switcher {
      display: flex;
      gap: 8px;
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 1000;
    }
    .lang-btn {
      padding: 8px 16px;
      border: 1px solid #ddd;
      background: white;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      transition: all 0.3s;
    }
    .lang-btn:hover {
      background: #f0f0f0;
    }
    .lang-btn.active {
      background: #4CAF50;
      color: white;
      border-color: #4CAF50;
    }
    @media (max-width: 768px) {
      .language-switcher {
        position: static;
        justify-content: center;
        margin-bottom: 16px;
      }
    }
  `]
})
export class LanguageSwitcherComponent {
  currentLang: string = 'nl';

  constructor(private translationService: TranslationService) {
    this.currentLang = this.translationService.getCurrentLanguage();
  }

  switchLanguage(lang: string) {
    this.translationService.switchLanguage(lang);
    this.currentLang = lang;
  }
}
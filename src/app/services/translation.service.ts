import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'  // This makes it available everywhere
})
export class TranslationService {
  constructor(private translate: TranslateService) {
    // Set Dutch as default language
    this.translate.setDefaultLang('nl');
    
    // Try to load saved language preference
    const savedLang = localStorage.getItem('language');
    if (savedLang && (savedLang === 'nl' || savedLang === 'en' || savedLang === 'zh')) {
      this.translate.use(savedLang);
    } else {
      this.translate.use('nl');  // Default to Dutch
    }
  }

  switchLanguage(lang: string) {
    this.translate.use(lang);
    localStorage.setItem('language', lang);  // Save preference
  }

  getCurrentLanguage(): string {
    return this.translate.currentLang || 'nl';
  }
}
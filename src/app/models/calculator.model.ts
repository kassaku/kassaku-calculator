// Type definitions
export type BusinessType = 'WOK' | 'RESTAURANT' | 'TAKEAWAY' | 'DELIVERY';
export type PcType = 'ECONOMY' | 'PROFESSIONAL' | 'BYO';

// Business type option interface
export interface BusinessTypeOption {
  value: BusinessType;
  label: string;
  icon: string;
  description: string;
  defaultPrinters: number;
}

// Export the business types array
export const BUSINESS_TYPES: BusinessTypeOption[] = [
  {
    value: 'WOK',
    label: 'WOK',
    icon: '🍽️',
    description: 'Fast casual, high table turnover',
    defaultPrinters: 1
  },
  {
    value: 'RESTAURANT',
    label: 'Restaurant',
    icon: '🍔',
    description: 'Full service, multiple courses',
    defaultPrinters: 1
  },
  {
    value: 'TAKEAWAY',
    label: 'Takeaway',
    icon: '📦',
    description: 'Pickup only, no dine-in',
    defaultPrinters: 1
  },
  {
    value: 'DELIVERY',
    label: 'Delivery',
    icon: '🛵',
    description: 'No physical location',
    defaultPrinters: 1
  }
];

// PC Options
export interface PcOption {
  value: PcType;
  name: string;
  price: number;
  specs: string;
  bestFor: string;
  icon: string;
}

export const PC_OPTIONS: PcOption[] = [
  {
    value: 'ECONOMY',
    name: 'Standard',
    price: 0,
    specs: 'Fanless Celeron 2GHz, 8GB RAM, 128GB SSD, P-CAP touch, Linux',
    bestFor: 'Alle toepassingen',
    icon: '🖥️'
  },
  {
    value: 'PROFESSIONAL',
    name: 'Professional',
    price: 0,
    specs: 'Fanless Core i5, 8GB RAM, 128GB SSD, Windows 11 Pro',
    bestFor: 'Restaurant, Fast casual, Bakery',
    icon: '💼'
  },
  {
    value: 'BYO',
    name: '',
    price: 50,
    specs: 'Minimum: 4GB RAM, Touch screen / mouse+keyboard, 32GB disk',
    bestFor: 'Existing hardware investment',
    icon: '💻'
  }
];

// Display options for Economy tier
export interface DisplayOption {
  id: string;
  name: string;
  price: number;
  aspectRatio: string;
}

export const DISPLAY_OPTIONS: DisplayOption[] = [
  { id: 'normal', name: 'Normal Display', price: 899, aspectRatio: '4:3' },
  { id: 'widescreen', name: 'Widescreen Display', price: 999, aspectRatio: '16:9' }
];

// Professional tier processor options
export interface ProcessorOption {
  id: string;
  name: string;
  price: number;
  description: string;
}

export const PROCESSOR_OPTIONS: ProcessorOption[] = [
  { id: 'celeron', name: 'Celeron', price: 1500, description: 'Entry-level performance' },
  { id: 'i5', name: 'Intel Core i5', price: 2200, description: 'High performance' }
];

// Extras Configuration
export interface ExtrasConfig {
  secondPrinter: number;
  moneyDrawer: number;
  customerDisplay: number;
  digitalKeys: number;
}

export interface CalculatorConfig {
  // ... existing ...
  menuTranslation: 'none' | 'dutch' | 'chinese';
}

// Calculator Configuration
export interface CalculatorConfig {
  businessType: BusinessType | null;
  competitionPrice: number;
  usageMonths: number;
  pcType: PcType;
  displayChoice?: string;
  processorChoice?: string;
  extras: ExtrasConfig;
  email: string;
  newsletterOptIn: boolean;
}
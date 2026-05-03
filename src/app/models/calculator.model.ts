// Type definitions (use 'type' for unions)
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
    defaultPrinters: 2
  },
  {
    value: 'RESTAURANT',
    label: 'Restaurant',
    icon: '🍔',
    description: 'Full service, multiple courses',
    defaultPrinters: 2
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
    name: 'Economy',
    price: 499,
    specs: 'Fanless Celeron J4125, 4GB RAM, 64GB SSD, Windows 11 Pro',
    bestFor: 'Takeaway, Food truck, Small cafe',
    icon: '🖥️'
  },
  {
    value: 'PROFESSIONAL',
    name: 'Professional',
    price: 899,
    specs: 'Fanless Core i5, 8GB RAM, 128GB SSD, Windows 11 Pro',
    bestFor: 'Restaurant, Fast casual, Bakery',
    icon: '💼'
  },
  {
    value: 'BYO',
    name: 'Bring Your Own PC',
    price: 0,
    specs: 'Minimum: Windows 10 Pro, 4GB RAM, 50GB free space',
    bestFor: 'Existing hardware investment',
    icon: '💻'
  }
];

// Screen Options
export interface ScreenOption {
  id: string;
  name: string;
  price: number;
  monthlyPrice: number;
  recommendedFor?: BusinessType[];
}

export const SCREEN_OPTIONS: ScreenOption[] = [
  { id: '10inch', name: '10" Customer Display', price: 199, monthlyPrice: 8, recommendedFor: ['TAKEAWAY'] },
  { id: '15std', name: '15" Standard', price: 249, monthlyPrice: 10, recommendedFor: ['WOK', 'RESTAURANT'] },
  { id: '15wide', name: '15" Widescreen', price: 299, monthlyPrice: 12 },
  { id: '17large', name: '17" Large', price: 349, monthlyPrice: 14 }
];

// Extras Configuration
export interface ExtrasConfig {
  secondPrinter: number;     // 0-2
  moneyDrawer: number;       // 0-1
  customerDisplay: number;   // 0-1
  digitalKeys: number;       // 0-10
}

export interface ExtraItem {
  id: keyof ExtrasConfig;
  name: string;
  price: number;
  maxQuantity: number;
  description: string;
}

export const EXTRA_ITEMS: ExtraItem[] = [
  { id: 'secondPrinter', name: 'Second Printer', price: 150, maxQuantity: 2, description: 'Extra printer for kitchen/bar' },
  { id: 'moneyDrawer', name: 'Money Drawer', price: 120, maxQuantity: 1, description: 'Secure cash drawer' },
  { id: 'customerDisplay', name: 'Customer Display', price: 180, maxQuantity: 1, description: 'Customer-facing screen' },
  { id: 'digitalKeys', name: 'Digital License Keys', price: 25, maxQuantity: 10, description: 'First 3 keys are free' }
];

// Calculator Configuration
export interface CalculatorConfig {
  businessType: BusinessType | null;
  competitionPrice: number;
  usageMonths: number;
  pcType: PcType;
  screens: string[];
  extras: ExtrasConfig;
  email: string;
  newsletterOptIn: boolean;
}

// Quote
export interface Quote {
  id: string;
  timestamp: Date;
  config: CalculatorConfig;
  buyTotal: number;
  rentTotal: number;
  breakEvenMonth: number;
  monthlySavings: number;
}
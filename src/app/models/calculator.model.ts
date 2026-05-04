// calculator.model.ts

import { PRICES } from './prices.model'

export type BusinessType = 'WOK' | 'RESTAURANT' | 'TAKEAWAY' | 'DELIVERY';
export type PcType = 'STANDARD_4_3' | 'STANDARD_WIDESCREEN' | 'PROFESSIONAL_CELERON' | 'PROFESSIONAL_I5' | 'BYO';

export interface PcOption {
  value: PcType;
  name: string;
  price: number;
  specs: string;
  description: string;
  bestFor: string;
  icon: string;
}

export interface ExtrasConfig {
  secondPrinter: number;
  moneyDrawer: number;
  customerDisplay: number;
  digitalKeys: number;
}

export const PC_OPTIONS: PcOption[] = [
  {
    value: 'STANDARD_4_3',
    name: 'Standard 4:3',
    price: PRICES.pc.standardCeleron,
    specs: 'Fanless Celeron, 8GB RAM, 128GB SSD, P-CAP touch, Linux, 4:3 display',
    description: '✓ Standaard model, 4:3 beeldverhouding, betrouwbaar en betaalbaar',
    bestFor: 'Basis POS behoeften',
    icon: '🖥️'
  },
  {
    value: 'STANDARD_WIDESCREEN',
    name: 'Standard Widescreen',
    price: PRICES.pc.standardCeleron,
    specs: 'Fanless Celeron, 8GB RAM, 128GB SSD, P-CAP touch, Linux, 16:9 display',
    description: '✓ Standaard model, breedbeeld, moderner uiterlijk',
    bestFor: 'Basis POS behoeften, modern design',
    icon: '🖥️'
  },
  {
    value: 'PROFESSIONAL_CELERON',
    name: 'Professional Celeron',
    price: PRICES.pc.professionalCeleron,
    specs: 'Luxe model, Celeron, hogere resolutie, neemt minder ruimte',
    description: '✓ Luxe uitstraling, normale snelheid, perfect voor moderne zaken',
    bestFor: 'Design-bewuste restaurants',
    icon: '💼'
  },
  {
    value: 'PROFESSIONAL_I5',
    name: 'Professional Core i5',
    price: PRICES.pc.professionalI5,
    specs: 'Luxe model, Core i5, server-grade performance, compact design',
    description: '✓ Server model, hoogste snelheid, manager functies, database blijft snel',
    bestFor: 'Multi-POS netwerken, server functionaliteit',
    icon: '💼'
  },
  {
    value: 'BYO',
    name: 'Bring Your Own PC',
    price: 0,
    specs: 'Minimum: Windows 10 Pro, 4GB RAM, 50GB free space',
    description: '✓ Gebruik uw eigen hardware',
    bestFor: 'Bestaande investering',
    icon: '💻'
  }
];
// Central price configuration
export const PRICES = {
  // Economy (Standard) prices
  economy: {
    basePrice: 1600,  // Both normal and widescreen
    displayPrice: 0    // Included in base price
  },
  
  // Professional prices
  professional: {
    celeron: 2180,
    i5: 2420
  },
  
    installation: 
  {
    byoFee: 50
  },

    menuTranslation: {
    none: 0,
    dutch: 100,
    chinese: 400
  },

  // Extras prices
  extras: {
    secondPrinter: 250,
    moneyDrawer: 125,
    customerDisplay: 150,
    digitalKey: 20      // Per key after first 3 free
  },
  
  // Rental constants
  rental: {
    downPayment: 0,
    monthlyFee: 38
  },
  
  // Competition defaults
  competition: {
    defaultPrice: 2800,
    minPrice: 0,
    maxPrice: 10000
  },
  
  // Duration limits
  duration: {
    minMonths: 6,
    maxMonths: 240,
    defaultMonths: 60
  },
  
  // Digital keys
  digitalKeys: {
    freeKeys: 3,
    maxKeys: 30
  }
};
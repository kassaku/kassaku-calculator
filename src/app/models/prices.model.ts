// Central price configuration
export const PRICES = 
{
  // PC prices - 4 distinct models
  pc: {
    standardCeleron: 1600,     // Standard model with Celeron
    standardI5: 1800,          // Standard model with i5 (if available)
    professionalCeleron: 2180, // Professional/Luxe model with Celeron
    professionalI5: 2420       // Professional/Luxe model with i5 (server capable)
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
    hardwareMonths: 60,
    downPayment: 0,
    softwareMonthly: 38,
    buyRent: 0.2
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

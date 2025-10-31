'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const CurrencyContext = createContext();

// Custom pricing structure - not direct conversions
const PRICING = {
  USD: {
    symbol: '$',
    code: 'USD',
    professional: { monthly: 250, annually: 2850 },
    team: { monthly: 750, annually: 8550, perUser: 32 }
  },
  GBP: {
    symbol: '£',
    code: 'GBP',
    professional: { monthly: 225, annually: 2565 }, // 225 * 11.4 (5% discount)
    team: { monthly: 675, annually: 7695, perUser: 29 } // ~£29/user
  },
  EUR: {
    symbol: '€',
    code: 'EUR',
    professional: { monthly: 235, annually: 2679 }, // 235 * 11.4
    team: { monthly: 705, annually: 8037, perUser: 30 } // ~€30/user
  },
  CHF: {
    symbol: 'CHF ',
    code: 'CHF',
    professional: { monthly: 240, annually: 2736 }, // 240 * 11.4
    team: { monthly: 720, annually: 8208, perUser: 31 } // ~CHF 31/user
  }
};

async function detectUserCurrency() {
  try {
    // Try to get user's location from IP
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    
    // Map country to currency
    const currencyMap = {
      'GB': 'GBP',
      'CH': 'CHF',
      'AT': 'EUR', 'BE': 'EUR', 'CY': 'EUR', 'EE': 'EUR', 'FI': 'EUR',
      'FR': 'EUR', 'DE': 'EUR', 'GR': 'EUR', 'IE': 'EUR', 'IT': 'EUR',
      'LV': 'EUR', 'LT': 'EUR', 'LU': 'EUR', 'MT': 'EUR', 'NL': 'EUR',
      'PT': 'EUR', 'SK': 'EUR', 'SI': 'EUR', 'ES': 'EUR'
    };
    
    return currencyMap[data.country_code] || 'USD';
  } catch (error) {
    console.log('Currency detection failed, defaulting to USD');
    return 'USD';
  }
}

export function CurrencyProvider({ children }) {
  const [currency, setCurrency] = useState('USD');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check localStorage first
    const saved = localStorage.getItem('preferred_currency');
    if (saved && PRICING[saved]) {
      setCurrency(saved);
      setIsLoading(false);
    } else {
      // Detect from IP
      detectUserCurrency().then((detected) => {
        setCurrency(detected);
        localStorage.setItem('preferred_currency', detected);
        setIsLoading(false);
      });
    }
  }, []);

  const changeCurrency = (newCurrency) => {
    if (PRICING[newCurrency]) {
      setCurrency(newCurrency);
      localStorage.setItem('preferred_currency', newCurrency);
    }
  };

  const value = {
    currency,
    currencyData: PRICING[currency],
    changeCurrency,
    isLoading,
    availableCurrencies: Object.keys(PRICING)
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within CurrencyProvider');
  }
  return context;
}

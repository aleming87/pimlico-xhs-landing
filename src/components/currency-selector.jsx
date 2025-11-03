'use client';

import { useCurrency } from '@/contexts/CurrencyContext';

export function CurrencySelector() {
  const { currency, changeCurrency, availableCurrencies } = useCurrency();

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="currency-select" className="text-sm text-gray-400">
        Currency:
      </label>
      <select
        id="currency-select"
        value={currency}
        onChange={(e) => changeCurrency(e.target.value)}
        className="rounded-md bg-gray-800 border border-gray-700 px-3 py-1.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {availableCurrencies.map((curr) => (
          <option key={curr} value={curr}>
            {curr}
          </option>
        ))}
      </select>
    </div>
  );
}

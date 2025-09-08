import React, { createContext, useContext, useState, useEffect } from 'react';

interface CurrencyContextType {
  currencySymbol: string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Винаги връщаме лева като основна валута
  const currencySymbol = 'лв';
  return (
    <CurrencyContext.Provider value={{ currencySymbol }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};
import React, { createContext, useContext, useEffect, useState } from 'react';
import { COUNTRY_DATA } from '../data/countryData';

const CountryContext = createContext();

export const CountryProvider = ({ children }) => {
  const [countryCode, setCountryCode] = useState(() => {
    // Check local storage or default to India (IN)
    const savedCountry = localStorage.getItem('themis-country');
    if (savedCountry && COUNTRY_DATA[savedCountry]) return savedCountry;
    return 'IN';
  });

  const country = COUNTRY_DATA[countryCode];

  useEffect(() => {
    localStorage.setItem('themis-country', countryCode);
  }, [countryCode]);

  return (
    <CountryContext.Provider value={{ countryCode, setCountryCode, country }}>
      {children}
    </CountryContext.Provider>
  );
};

export const useCountry = () => {
  const context = useContext(CountryContext);
  if (context === undefined) {
    throw new Error('useCountry must be used within a CountryProvider');
  }
  return context;
};

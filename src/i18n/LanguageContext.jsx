import { createContext, useContext, useState } from "react";
import { translations, countryTranslations } from "./translations";
import { countries as countriesEn, continents as continentsEn } from "../data/countries";

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState("en");

  const t = translations[language];

  const getCountryName = (countryCode) => {
    if (language === "en") {
      const country = countriesEn.find((c) => c.code === countryCode);
      return country?.name || countryCode;
    }
    return countryTranslations.fr[countryCode]?.name || countryCode;
  };

  const getCountryCapital = (countryCode) => {
    if (language === "en") {
      const country = countriesEn.find((c) => c.code === countryCode);
      return country?.capital || "";
    }
    return countryTranslations.fr[countryCode]?.capital || "";
  };

  const getContinentName = (continentKey) => {
    return t.continents[continentKey] || continentKey;
  };

  const value = {
    language,
    setLanguage,
    t,
    getCountryName,
    getCountryCapital,
    getContinentName,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

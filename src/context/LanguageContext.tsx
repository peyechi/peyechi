import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations, Language } from '../data/translations.ts';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (typeof translations)['bn'];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('lf_lang');
    return saved === 'en' ? 'en' : 'bn'; // Default is Bangla per spec
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('lf_lang', lang);
  };

  const toggleLanguage = () => {
    const next = language === 'bn' ? 'en' : 'bn';
    setLanguage(next);
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const value = {
    language,
    setLanguage,
    toggleLanguage,
    t: translations[language],
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

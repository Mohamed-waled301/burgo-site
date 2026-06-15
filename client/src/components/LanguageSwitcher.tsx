import React from 'react';
import { useLanguageStore } from '../store/useLanguageStore';

export const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useLanguageStore();

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
  };

  return (
    <div className="inline-flex rounded-lg border border-gray-700 bg-gray-900 p-0.5" dir="ltr">
      <button
        onClick={() => handleLanguageChange('ar')}
        className={`rounded-md px-3 py-1 text-xs font-semibold transition-all ${
          language === 'ar'
            ? 'bg-primary text-white shadow-sm'
            : 'text-gray-400 hover:text-white'
        }`}
      >
        العربية
      </button>
      <button
        onClick={() => handleLanguageChange('en')}
        className={`rounded-md px-3 py-1 text-xs font-semibold transition-all ${
          language === 'en'
            ? 'bg-primary text-white shadow-sm'
            : 'text-gray-400 hover:text-white'
        }`}
      >
        EN
      </button>
    </div>
  );
};

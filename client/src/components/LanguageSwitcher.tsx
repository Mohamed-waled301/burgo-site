import React from 'react';
import { useLanguageStore } from '../store/useLanguageStore';
import { motion } from 'framer-motion';

export const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useLanguageStore();

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
  };

  return (
    <div className="relative inline-flex rounded-full bg-zinc-900 border border-zinc-800 p-1 select-none" dir="ltr">
      <div className="relative flex items-center">
        {/* Arabic option */}
        <button
          onClick={() => handleLanguageChange('ar')}
          className={`relative z-10 rounded-full px-3.5 py-1.5 text-xs font-black transition-colors duration-250 cursor-pointer border-0 bg-transparent outline-none ${
            language === 'ar' ? 'text-white font-extrabold' : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          {language === 'ar' && (
            <motion.div
              layoutId="activeLangIndicator"
              className="absolute inset-0 bg-primary rounded-full z-[-1]"
              transition={{ type: 'spring', stiffness: 380, damping: 28 }}
            />
          )}
          <span>AR</span>
        </button>

        {/* English option */}
        <button
          onClick={() => handleLanguageChange('en')}
          className={`relative z-10 rounded-full px-3.5 py-1.5 text-xs font-black transition-colors duration-250 cursor-pointer border-0 bg-transparent outline-none ${
            language === 'en' ? 'text-white font-extrabold' : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          {language === 'en' && (
            <motion.div
              layoutId="activeLangIndicator"
              className="absolute inset-0 bg-primary rounded-full z-[-1]"
              transition={{ type: 'spring', stiffness: 380, damping: 28 }}
            />
          )}
          <span>EN</span>
        </button>
      </div>
    </div>
  );
};

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import i18n from '../i18n';

interface LanguageState {
  language: string;
  setLanguage: (lang: string) => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      language: localStorage.getItem('bb_language') || 'ar',
      setLanguage: (lang) => {
        i18n.changeLanguage(lang);
        set({ language: lang });
      },
    }),
    {
      name: 'bb_language_store',
      // Since i18n has its own listener to persist 'bb_language' in localStorage,
      // this store ensures the React component state remains fully synced.
    }
  )
);

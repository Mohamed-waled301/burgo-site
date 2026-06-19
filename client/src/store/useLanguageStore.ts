import { create } from 'zustand';
import i18n from '../i18n';

interface LanguageState {
  language: string;
  adminLanguage: string;
  setLanguage: (lang: string) => void;
  setAdminLanguage: (lang: string) => void;
}

export const useLanguageStore = create<LanguageState>()((set) => ({
  language: localStorage.getItem('bb_language') || 'ar',
  adminLanguage: localStorage.getItem('bb_admin_language') || 'en',
  setLanguage: (lang) => {
    i18n.changeLanguage(lang);
    set({ language: lang });
  },
  setAdminLanguage: (lang) => {
    i18n.changeLanguage(lang);
    set({ adminLanguage: lang });
  },
}));


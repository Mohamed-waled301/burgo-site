import React from 'react';
import { useTranslation } from 'react-i18next';
import { Instagram, MessageSquare, Flame } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <footer id="footer" className="bg-dark text-white border-t border-gray-800">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center text-center md:text-start">
          {/* Logo & Tagline */}
          <div className="flex flex-col items-center md:items-start gap-3">
            <Link to="/" className="flex items-center gap-2 font-display text-2xl font-bold text-white">
              <span className="text-3xl">🍔</span>
              <span>{t('brandName')}</span>
            </Link>
            <p className="text-sm text-gray-400 max-w-xs leading-relaxed">
              {t('hero.subtitle')}
            </p>
          </div>

          {/* Cooking Tips banner in middle */}
          <div className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-gray-900 border border-gray-800">
            <Flame className="h-6 w-6 text-primary animate-pulse" />
            <h4 className="font-display font-semibold text-sm text-accent">
              {t('language') === 'en' ? 'Ready to Grill!' : 'جاهز للتسوية فوراً!'}
            </h4>
            <p className="text-xs text-gray-400 text-center">
              {t('language') === 'en' 
                ? 'All packages are vacuum-sealed and cold-shipped daily.' 
                : 'كل المكونات معبأة بالتفريغ الهوائي وتصلك مبردة طازجة يومياً.'}
            </p>
          </div>

          {/* Socials & Admin shortcuts */}
          <div className="flex flex-col items-center md:items-end gap-4">
            <div className="flex gap-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-gray-800 p-2.5 text-gray-300 hover:bg-primary hover:text-white transition-all"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-gray-800 p-2.5 text-gray-300 hover:bg-primary hover:text-white transition-all"
                aria-label="TikTok"
              >
                {/* TikTok Custom SVG */}
                <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.02 1.59 4.23.86.17 1.75.28 2.63.29v3.91c-.99-.02-1.96-.28-2.87-.74-.54-.27-1.04-.63-1.47-1.07v6.62c.01 2.21-1.06 4.29-2.91 5.51-1.74 1.15-3.96 1.44-5.96.8-2.61-.83-4.39-3.41-4.22-6.13.19-2.9 2.54-5.22 5.45-5.29v4.03c-1.12.06-2.07.93-2.16 2.05-.09 1.4 1.05 2.58 2.45 2.58 1.25 0 2.28-1.02 2.28-2.28V0h-1.67z"/>
                </svg>
              </a>
              <a
                href="https://wa.me/20100000000"
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-gray-800 p-2.5 text-gray-300 hover:bg-primary hover:text-white transition-all"
                aria-label="WhatsApp"
              >
                <MessageSquare className="h-5 w-5" />
              </a>
            </div>
            
            <Link to="/admin/login" className="text-xs text-gray-500 hover:text-primary transition-colors">
              {t('nav.admin')}
            </Link>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-800 pt-8 text-center md:flex md:items-center md:justify-between">
          <p className="text-xs text-gray-400">
            &copy; {new Date().getFullYear()} {t('brandName')}. {t('language') === 'en' ? 'All rights reserved.' : 'جميع الحقوق محفوظة.'}
          </p>
          <p className="mt-2 text-xs text-gray-500 md:mt-0">
            {t('language') === 'en' ? 'Handcrafted for Burger lovers' : 'صُنع بحب لعشاق البرجر الأصيل'}
          </p>
        </div>
      </div>
    </footer>
  );
};

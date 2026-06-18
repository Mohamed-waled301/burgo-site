import React from 'react';
import { useTranslation } from 'react-i18next';
import { Instagram, MessageSquare, Flame } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  return (
    <footer id="footer" className="bg-zinc-950 text-zinc-100 border-t border-zinc-900 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center text-center md:text-start" dir={isRTL ? 'rtl' : 'ltr'}>

          {/* Logo & Tagline */}
          <div className="flex flex-col items-center md:items-start gap-3">
            <Link to="/" className="flex items-center gap-2.5 font-display text-2xl font-bold transition hover:opacity-90">
              <img
                src="/ref/IMG-20260615-WA0025.jpg"
                alt="Burgo Logo"
                className="h-9 w-9 rounded-xl object-cover border border-zinc-800 shadow-sm"
              />
              <span className="font-display font-black tracking-tight uppercase bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Burgo
              </span>
            </Link>
            <p className="text-sm text-zinc-400 max-w-xs leading-relaxed">
              {t('hero.subtitle')}
            </p>
          </div>

          {/* Cooking Tips banner in middle */}
          <div className="blob-card-wrapper w-full max-w-sm mx-auto group">
            {/* Animated background blob */}
            <div className="absolute z-0 top-1/2 left-1/2 w-28 h-28 rounded-full bg-primary/20 filter blur-xl opacity-70 animate-blob-bounce select-none pointer-events-none" />

            {/* Inner glass face */}
            <div className="blob-card-face items-center justify-center gap-2.5 p-5 text-center">
              <Flame className="h-6 w-6 text-primary animate-pulse z-10" />
              <h4 className="font-display font-bold text-sm text-primary z-10">
                {isRTL ? 'جاهز للتسوية فوراً!' : 'Ready to Grill!'}
              </h4>
              <p className="text-xs text-zinc-400 text-center leading-relaxed z-10">
                {isRTL
                  ? 'كل المكونات معبأة بالتفريغ الهوائي وتصلك مبردة طازجة يومياً.'
                  : 'All packages are vacuum-sealed and cold-shipped daily.'}
              </p>
            </div>
          </div>

          {/* Socials */}
          <div className="flex flex-col items-center md:items-end gap-4">
            <div className="flex gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="rounded-xl bg-zinc-900 border border-zinc-800 p-2.5 text-zinc-400 hover:bg-primary hover:text-white hover:border-primary transition-all shadow-sm"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noreferrer"
                className="rounded-xl bg-zinc-900 border border-zinc-800 p-2.5 text-zinc-400 hover:bg-primary hover:text-white hover:border-primary transition-all shadow-sm"
                aria-label="TikTok"
              >
                <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.02 1.59 4.23.86.17 1.75.28 2.63.29v3.91c-.99-.02-1.96-.28-2.87-.74-.54-.27-1.04-.63-1.47-1.07v6.62c.01 2.21-1.06 4.29-2.91 5.51-1.74 1.15-3.96 1.44-5.96.8-2.61-.83-4.39-3.41-4.22-6.13.19-2.9 2.54-5.22 5.45-5.29v4.03c-1.12.06-2.07.93-2.16 2.05-.09 1.4 1.05 2.58 2.45 2.58 1.25 0 2.28-1.02 2.28-2.28V0h-1.67z"/>
                </svg>
              </a>
              <a
                href="https://wa.me/201221542589"
                target="_blank"
                rel="noreferrer"
                className="rounded-xl bg-zinc-900 border border-zinc-800 p-2.5 text-zinc-400 hover:bg-primary hover:text-white hover:border-primary transition-all shadow-sm"
                aria-label="WhatsApp"
              >
                <MessageSquare className="h-5 w-5" />
              </a>
            </div>

            <Link to="/contact" className="text-xs font-semibold text-zinc-500 hover:text-primary transition-colors">
              {t('nav.contact')}
            </Link>
          </div>
        </div>

        <div className="mt-8 border-t border-zinc-900 pt-8 text-center md:flex md:items-center md:justify-between text-xs text-zinc-500" dir={isRTL ? 'rtl' : 'ltr'}>
          <p>
            &copy; {new Date().getFullYear()} {t('brandName')}. {isRTL ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'}
          </p>
          <p className="mt-2 md:mt-0 font-medium">
            {isRTL ? 'صُنع بحب لعشاق بورجو الأصيل' : 'Handcrafted for Burgo lovers'}
          </p>
        </div>
      </div>
    </footer>
  );
};

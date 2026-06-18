import React from 'react';
import { useTranslation } from 'react-i18next';
import { MessageSquare, Phone, Clock, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export const Contact: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  // WhatsApp prefilled greeting
  const greeting = isRTL
    ? encodeURIComponent('مرحباً بورجو، أريد الاستفسار عن...')
    : encodeURIComponent('Hello Burgo, I would like to ask about...');
  const whatsappUrl = `https://wa.me/201221542589?text=${greeting}`;

  return (
    <div className="flex-1 w-full bg-zinc-950 flex flex-col items-center justify-center py-20 px-4 relative select-none" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Background radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full filter blur-[120px] pointer-events-none z-0" />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="blob-card-wrapper w-full max-w-xl shadow-2xl relative z-10"
      >
        {/* Animated background blob */}
        <div className="absolute z-0 top-1/2 left-1/2 w-48 h-48 rounded-full bg-primary/20 filter blur-2xl opacity-60 animate-blob-bounce select-none pointer-events-none" />

        {/* Inner glass face */}
        <div className="blob-card-face p-8 sm:p-12 items-center text-center space-y-8">
          {/* Header */}
          <div className="space-y-3">
            <span className="inline-flex items-center gap-1.5 text-primary text-xs font-black tracking-widest uppercase bg-primary/10 border border-primary/20 rounded-full px-3 py-1 animate-pulse-glow">
              <Sparkles className="h-3.5 w-3.5" />
              {isRTL ? 'بورجو معك دائماً' : 'Burgo is always with you'}
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-white font-display pt-2">
              {t('contactPage.title')}
            </h1>
            <p className="text-zinc-400 text-sm leading-relaxed max-w-md mx-auto">
              {t('contactPage.subtitle')}
            </p>
          </div>

          {/* Contact Details stack */}
          <div className="w-full space-y-4 pt-6 border-t border-zinc-850">
            <div className="flex items-center gap-4 bg-zinc-950/40 border border-zinc-850/50 rounded-2xl p-4">
              <div className="h-10 w-10 bg-primary/10 border border-primary/25 rounded-xl flex items-center justify-center text-primary shrink-0">
                <Phone className="h-5 w-5" />
              </div>
              <div className="text-start">
                <span className="text-[10px] text-zinc-500 font-bold uppercase block tracking-wider">
                  {isRTL ? 'رقم الهاتف' : 'Phone Number'}
                </span>
                <span className="text-sm font-black text-white tracking-wide font-price">
                  {t('contactPage.phone')}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-zinc-950/40 border border-zinc-850/50 rounded-2xl p-4">
              <div className="h-10 w-10 bg-primary/10 border border-primary/25 rounded-xl flex items-center justify-center text-primary shrink-0">
                <Clock className="h-5 w-5" />
              </div>
              <div className="text-start">
                <span className="text-[10px] text-zinc-500 font-bold uppercase block tracking-wider">
                  {isRTL ? 'ساعات العمل' : 'Working Hours'}
                </span>
                <span className="text-sm font-black text-white">
                  {t('contactPage.hours')}
                </span>
              </div>
            </div>
          </div>

          {/* Primary WhatsApp CTA Action */}
          <div className="pt-6 w-full">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="w-full h-14 rounded-2xl bg-primary hover:bg-primary-hover text-white text-base font-black transition-all duration-300 flex items-center justify-center gap-3 shadow-xl shadow-primary/20 hover:shadow-primary/35 hover:scale-[1.03] active:scale-[0.98] animate-pulse-glow"
            >
              <MessageSquare className="h-5.5 w-5.5 fill-current" />
              <span>{t('contactPage.ctaBtn')}</span>
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

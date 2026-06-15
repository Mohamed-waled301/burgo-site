import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ChevronDown, Box, Flame, UtensilsCrossed } from 'lucide-react';

export const Home: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const howItWorksSteps = [
    {
      number: '01',
      icon: Box,
      title: t('howItWorks.step1'),
      desc: t('howItWorks.step1Desc')
    },
    {
      number: '02',
      icon: Flame,
      title: t('howItWorks.step2'),
      desc: t('howItWorks.step2Desc')
    },
    {
      number: '03',
      icon: UtensilsCrossed,
      title: t('howItWorks.step3'),
      desc: t('howItWorks.step3Desc')
    }
  ];

  const features = [
    t('features.freshMeat'),
    t('features.realCheese'),
    t('features.freshBread'),
    t('features.coldDelivery'),
    t('features.readyTen')
  ];

  return (
    <div className="flex flex-col w-full">
      {/* 1. Hero Section */}
      <section className="relative min-h-[calc(100vh-64px)] w-full flex flex-col justify-center items-center text-center px-4 overflow-hidden bg-dark text-white select-none">
        {/* Dynamic fire/grill background gradient elements */}
        <div className="absolute inset-0 z-0 grill-gradient" />
        <div className="absolute inset-0 z-0 grill-pattern opacity-60" />
        
        {/* Heat shimmer visual effects */}
        <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-primary/10 to-transparent pointer-events-none" />

        {/* Content Container */}
        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
          {/* Big Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="font-display text-4xl sm:text-6xl md:text-7xl font-extrabold leading-[1.1] tracking-tight"
          >
            {t('hero.title')}
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.3 }}
            className="mt-6 text-base sm:text-xl md:text-2xl text-gray-300 max-w-2xl leading-relaxed"
          >
            {t('hero.subtitle')}
          </motion.p>

          {/* CTA Button */}
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.6 }}
            onClick={() => navigate('/products')}
            className="mt-10 h-14 rounded-xl bg-primary hover:bg-primary-hover px-10 text-base sm:text-lg font-bold shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95 flex items-center justify-center cursor-pointer"
          >
            {t('hero.cta')}
          </motion.button>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 z-10 flex flex-col items-center animate-scroll-bounce">
          <span className="text-xs text-gray-400 font-semibold tracking-wider mb-1">
            {t('language') === 'en' ? 'SCROLL' : 'اسحب للأسفل'}
          </span>
          <ChevronDown className="h-5 w-5 text-gray-400" />
        </div>
      </section>

      {/* 2. Features Chip Strip (Marquee) */}
      <section className="relative bg-primary py-4 overflow-hidden border-y border-primary-hover">
        <div className="flex w-full overflow-hidden select-none">
          {/* We duplicate the arrays to achieve a continuous marquee flow */}
          <div className="flex gap-16 items-center shrink-0 pr-8 animate-marquee">
            {features.map((feature, i) => (
              <span key={i} className="text-white font-display font-bold text-sm sm:text-base tracking-wide flex items-center gap-2">
                {feature}
              </span>
            ))}
            {features.map((feature, i) => (
              <span key={`dup1-${i}`} className="text-white font-display font-bold text-sm sm:text-base tracking-wide flex items-center gap-2">
                {feature}
              </span>
            ))}
            {features.map((feature, i) => (
              <span key={`dup2-${i}`} className="text-white font-display font-bold text-sm sm:text-base tracking-wide flex items-center gap-2">
                {feature}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 3. How It Works Section */}
      <section className="py-20 px-4 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            {t('howItWorks.title')}
          </h2>
          <p className="mt-4 text-gray-500 text-sm sm:text-base">
            {t('howItWorks.subtitle')}
          </p>
        </div>

        {/* Staggered Scroll Animation Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {howItWorksSteps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                className="flex flex-col items-center text-center p-8 bg-white border border-gray-100 rounded-[20px] shadow-sm hover:shadow-md transition duration-300 relative overflow-hidden group"
              >
                {/* Step badge */}
                <div className="absolute top-4 right-4 text-4xl sm:text-5xl font-price font-extrabold text-accent/20 group-hover:text-accent/40 transition-colors select-none">
                  {step.number}
                </div>

                {/* Icon wrapper */}
                <div className="h-16 w-16 rounded-2xl bg-cream flex items-center justify-center border border-gray-100 shadow-inner mb-6 group-hover:scale-110 transition duration-300">
                  <Icon className="h-8 w-8 text-primary" />
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 leading-snug">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="mt-3 text-sm text-gray-500 leading-relaxed max-w-xs">
                  {step.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

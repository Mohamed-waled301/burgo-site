import React, { useState, useEffect } from 'react';
import { ChevronDown, ArrowRight, ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

interface BurgerParallaxProps {
  title?: string;
  subtitle?: string;
  ctaText?: string;
  onCtaClick?: () => void;
  burgerText?: string;
}

export const BurgerParallax: React.FC<BurgerParallaxProps> = ({
  subtitle,
  ctaText,
  onCtaClick
}) => {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  // Typewriter Loop Settings
  const [currentPhraseIdx, setCurrentPhraseIdx] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  const phrases = isRTL
    ? ["طازج. سريع. بورجو.", "برجرك على مزاجك.", "بوكسات تحضير منزلي فاخرة."]
    : ["Fresh. Fast. Burgo.", "Your Burger, Your Way.", "Premium Cook-at-Home Boxes."];

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);

    const listener = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches);
    };
    mediaQuery.addEventListener('change', listener);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      mediaQuery.removeEventListener('change', listener);
    };
  }, []);

  useEffect(() => {
    if (reducedMotion) {
      setDisplayedText(phrases[0]);
      return;
    }

    const currentPhrase = phrases[currentPhraseIdx];
    let timer: NodeJS.Timeout;

    if (isDeleting) {
      timer = setTimeout(() => {
        setDisplayedText(currentPhrase.substring(0, displayedText.length - 1));
      }, 40);
    } else {
      timer = setTimeout(() => {
        setDisplayedText(currentPhrase.substring(0, displayedText.length + 1));
      }, 80);
    }

    if (!isDeleting && displayedText === currentPhrase) {
      // Pause at completion
      timer = setTimeout(() => setIsDeleting(true), 2500);
    } else if (isDeleting && displayedText === '') {
      setIsDeleting(false);
      setCurrentPhraseIdx((prev) => (prev + 1) % phrases.length);
    }

    return () => clearTimeout(timer);
  }, [displayedText, isDeleting, currentPhraseIdx, isRTL, reducedMotion]);

  const translateVal = reducedMotion ? 0 : scrollY * 0.15;

  return (
    <section
      className="relative min-h-[calc(100vh-64px)] w-full flex flex-col justify-between items-center bg-zinc-950 overflow-hidden select-none py-12 px-4"
    >
      {/* 1. Blurred Background Video (Pinterest Video Source) */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <video
          src="https://v1.pinimg.com/videos/iht/720p/ac/3d/61/ac3d61d379caa16d664adbc7e4740141.mp4"
          autoPlay
          muted
          loop
          playsInline
          style={{
            transform: `translate(-50%, calc(-50% + ${translateVal}px)) scale(1.05)`,
          }}
          className="absolute top-1/2 left-1/2 w-full h-full min-w-full min-h-full object-cover filter blur-[6px] brightness-[0.4] saturate-[1.2] transition-all duration-300"
        />
        {/* Subtle radial/linear dark gradient to ensure text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/50 via-transparent to-zinc-950" />
      </div>

      {/* 2. Foreground Hero Contents & Controls */}
      <motion.div 
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-4xl mx-auto flex flex-col items-center justify-center my-auto py-16 z-20 pointer-events-none"
      >
        {/* Headline block */}
        <div className="flex flex-col items-center text-center">
          <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-black leading-tight text-white drop-shadow-[0_4px_20px_rgba(0,0,0,0.95)] px-4 min-h-[140px] sm:min-h-[180px] flex items-center justify-center">
            <span className="shimmer-text-hero">
              {displayedText}
              {!reducedMotion && (displayedText !== phrases[currentPhraseIdx] || isDeleting) && (
                <span className="typewriter-cursor ml-0.5">|</span>
              )}
            </span>
          </h1>
          
          {subtitle && (
            <p className="mt-8 text-zinc-300 text-sm sm:text-lg md:text-xl max-w-md md:max-w-2xl leading-relaxed drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)] px-6 transition-colors duration-300">
              {subtitle}
            </p>
          )}
        </div>

        {/* CTA Button Block */}
        <div className="mt-12 flex flex-col items-center pointer-events-auto">
          {ctaText && onCtaClick && (
            <button
              onClick={onCtaClick}
              className="h-16 rounded-2xl bg-primary hover:bg-primary-hover px-12 text-base sm:text-lg font-bold text-white shadow-xl shadow-primary/25 hover:shadow-primary/45 transition-all duration-350 hover:scale-105 active:scale-95 flex items-center justify-center gap-2.5 cursor-pointer animate-pulse-glow"
            >
              {ctaText}
              <ArrowIcon className="w-5 h-5" />
            </button>
          )}
        </div>

      </motion.div>

      {/* 3. Scroll Cue */}
      <div className="relative z-20 flex flex-col items-center animate-scroll-bounce opacity-80 pb-2">
        <span className="text-[10px] text-zinc-400 font-bold tracking-widest mb-1.5 uppercase">
          {isRTL ? 'اسحب للأسفل' : 'Scroll Down'}
        </span>
        <ChevronDown className="h-4 w-4 text-primary" />
      </div>
    </section>
  );
};

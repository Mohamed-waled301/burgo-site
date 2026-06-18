import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, ShoppingBag, Flame, Utensils } from 'lucide-react';
import { BurgerParallax } from '../components/BurgerParallax';

// Images from ref folder
const BOX_IMG = '/ref/IMG-20260615-WA0027.jpg';
const BOX_CLOSED = '/ref/IMG-20260615-WA0026.jpg';
const PATTY_IMG = '/ref/IMG-20260615-WA0036.jpg';
const BREAD_IMG = '/ref/IMG-20260615-WA0038.jpg';
const ONION_RINGS = '/ref/IMG-20260615-WA0033.jpg';
const FRENCH_FRIES = '/ref/IMG-20260615-WA0034.jpg';
const PICKLES = '/ref/IMG-20260615-WA0039.jpg';
const KETCHUP = '/ref/IMG-20260615-WA0040.jpg';
const CHEDDAR = '/ref/IMG-20260615-WA0037.jpg';

const FadeInSection: React.FC<{ children: React.ReactNode; delay?: number }> = ({
  children,
  delay = 0,
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
    >
      {children}
    </motion.div>
  );
};

// Framer Motion staggered animations for grids
const gridContainerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const gridItemVariants = {
  hidden: { opacity: 0, y: 35 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 80,
      damping: 15,
    },
  },
};

export const Home: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isRTL = i18n.language === 'ar';
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  const [activeImage, setActiveImage] = useState(BOX_IMG);

  /* ── Steps data ─────────────────────────────────────────────── */
  const howItWorksSteps = [
    {
      number: '01',
      icon: ShoppingBag,
      title: t('howItWorks.step1'),
      desc: t('howItWorks.step1Desc'),
    },
    {
      number: '02',
      icon: Flame,
      title: t('howItWorks.step2'),
      desc: t('howItWorks.step2Desc'),
    },
    {
      number: '03',
      icon: Utensils,
      title: t('howItWorks.step3'),
      desc: t('howItWorks.step3Desc'),
    },
  ];

  /* ── Features marquee ────────────────────────────────────────── */
  const features = [
    t('features.freshMeat'),
    t('features.realCheese'),
    t('features.freshBread'),
    t('features.coldDelivery'),
    t('features.readyTen'),
  ];

  /* ── Section cards ───────────────────────────────────────────── */
  const menuSections = [
    {
      key: 'boxes',
      img: BOX_IMG,
      label: isRTL ? 'البوكسات' : 'Boxes',
      sub: isRTL
        ? 'بوكسات برجر أنجوس محشية جبن شيدر أمريكي — جاهزة للتسوية'
        : 'Angus burger boxes stuffed with cheddar cheese — grill-ready',
      accent: '#D97706',
      stars: [80, 250, 450],
      unit: isRTL ? 'جنيه' : 'EGP',
    },
    {
      key: 'appetizers',
      img: ONION_RINGS,
      label: isRTL ? 'المقبلات' : 'Appetizers',
      sub: isRTL
        ? 'بطاطس فرنش فراي، كرانكل كت، حلقات بصل'
        : 'French Fries, Crinkle-cut, Onion Rings',
      accent: '#EA580C',
      stars: [40, 55, 70],
      unit: isRTL ? 'جنيه' : 'EGP',
    },
    {
      key: 'addons',
      img: CHEDDAR,
      label: isRTL ? 'الإضافات' : 'Add-ons',
      sub: isRTL
        ? 'صوصات، جبن شيدر، خيار مخلل، عيش بافلو'
        : 'Sauces, cheddar slices, pickles, buffalo bread',
      accent: '#CA8A04',
      stars: [7.5, 12, 20],
      unit: isRTL ? 'جنيه' : 'EGP',
    },
  ];

  /* ── Box contents preview ────────────────────────────────────── */
  const boxContents = [
    { img: PATTY_IMG, label: isRTL ? '6 قطع برجر أنجوس محشية' : '6 Angus Patties Stuffed' },
    { img: BREAD_IMG, label: isRTL ? 'عيش بافلو المميز' : 'Premium Buffalo Bread' },
    { img: PICKLES, label: isRTL ? 'خيار مخلل أمريكي' : 'Pickled Cucumber Slices' },
    { img: KETCHUP, label: isRTL ? 'صوص كاتشب 140 جم' : 'Ketchup Sauce 140g' },
    { img: CHEDDAR, label: isRTL ? 'أظرف جبن شيدر' : 'Cheddar Cheese Packs' },
    { img: FRENCH_FRIES, label: isRTL ? 'بطاطس فرنش فراي' : 'French Fries (200g)' },
  ];

  return (
    <div className="flex flex-col w-full" dir={isRTL ? 'rtl' : 'ltr'}>

      {/* ━━━━━━━━━━ 1. HERO ━━━━━━━━━━ */}
      <BurgerParallax
        title={t('hero.title')}
        subtitle={t('hero.subtitle')}
        ctaText={t('hero.cta')}
        onCtaClick={() => navigate('/products')}
        burgerText="BURGO"
      />

      {/* ━━━━━━━━━━ 2. MARQUEE STRIP ━━━━━━━━━━ */}
      <section className="relative bg-amber-500 py-3.5 overflow-hidden border-y border-amber-600">
        <div className="flex w-full overflow-hidden select-none">
          <div className="flex gap-16 items-center shrink-0 pr-8 animate-marquee">
            {[...features, ...features, ...features].map((feat, i) => (
              <span key={i} className="text-white font-bold text-sm sm:text-base tracking-wide flex items-center gap-2 whitespace-nowrap">
                {feat}
                <span className="text-amber-200 mx-2">•</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━ 3. MENU SECTIONS ━━━━━━━━━━ */}
      <section className="py-28 px-4 bg-surface border-y border-border/40 transition-colors duration-300">
        <div className="max-w-7xl mx-auto">

          {/* Title with increased whitespace */}
          <FadeInSection>
            <div className="text-center mb-20 py-4">
              <span className="inline-block text-primary text-xs font-black tracking-widest uppercase mb-4">
                {isRTL ? '— قائمة بورجو —' : '— BURGO MENU —'}
              </span>
              <h2 className="text-3xl sm:text-5xl font-black text-charcoal">
                {isRTL ? 'اكتشف عالم بورجو' : 'Discover the BURGO World'}
              </h2>
              <p className="mt-5 text-text-muted max-w-xl mx-auto text-sm sm:text-base font-medium leading-relaxed">
                {isRTL
                  ? 'ثلاثة أقسام، لا حدود للطعم الفاخر والمكونات الطازجة المحضّرة لك خصيصاً'
                  : 'Three premium categories, infinite combinations of fresh ready-to-grill flavor'}
              </p>
            </div>
          </FadeInSection>

          {/* Cards grid with staggered entry */}
          <motion.div 
            variants={gridContainerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {menuSections.map((sec) => (
              <motion.div key={sec.key} variants={gridItemVariants}>
                <div
                  onClick={() => navigate('/products')}
                  className="blob-card-wrapper h-[420px] group cursor-pointer shadow-premium-glow shadow-premium-glow-hover transition-all duration-300"
                >
                  {/* Animated background blob */}
                  <div className="absolute z-0 top-1/2 left-1/2 w-48 h-48 rounded-full bg-primary/20 dark:bg-primary/10 filter blur-2xl opacity-60 animate-blob-bounce select-none pointer-events-none" />

                  {/* Inner glass face */}
                  <div className="blob-card-face relative overflow-hidden h-full">
                    {/* Background image */}
                    <img
                      src={sec.img}
                      alt={sec.label}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/40 to-transparent" />

                    {/* Content (z-10 to stay clickable above blob overlay) */}
                    <div className="absolute bottom-0 inset-x-0 p-6 z-10">
                      {/* Price pills */}
                      <div className="flex gap-2 mb-3 flex-wrap">
                        {sec.stars.map((p, i) => (
                          <span
                            key={i}
                            className="text-xs font-extrabold px-3 py-1 rounded-xl bg-primary/20 text-primary border border-primary/30 backdrop-blur-sm"
                          >
                            {isRTL ? `يبدأ من ${p} ${sec.unit}` : `From ${p} ${sec.unit}`}
                          </span>
                        ))}
                      </div>

                      <h3 className="text-2xl sm:text-3xl font-black text-white mb-2 drop-shadow-md">
                        {sec.label}
                      </h3>
                      <p className="text-gray-300 text-sm leading-relaxed mb-4 drop-shadow-sm font-medium">
                        {sec.sub}
                      </p>

                      {/* CTA */}
                      <div className="flex items-center gap-2 text-sm font-bold text-primary">
                        <span>{isRTL ? 'تصفح الكل' : 'Browse all'}</span>
                        <ArrowIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ━━━━━━━━━━ 4. BOX CONTENTS SHOWCASE ━━━━━━━━━━ */}
      <section className="py-28 px-4 bg-background border-b border-border/40 transition-colors duration-300">
        <div className="max-w-7xl mx-auto">

          <FadeInSection>
            <div className="flex flex-col lg:flex-row items-center gap-12">

              {/* Left: Big box image with smooth cross-fade */}
              <div className="flex-1 w-full relative">
                <div className="relative rounded-3xl overflow-hidden shadow-xl border border-border/30 h-[420px] w-full bg-zinc-950">
                  <AnimatePresence mode="popLayout">
                    <motion.img
                      key={activeImage}
                      src={activeImage}
                      alt={isRTL ? 'بوكس بورجو' : 'BURGO Box'}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.35, ease: 'easeInOut' }}
                      className="absolute inset-0 w-full h-full object-cover"
                      loading="lazy"
                    />
                  </AnimatePresence>
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-950/40 to-transparent pointer-events-none" />
                </div>

                {/* Floating badge */}
                <div className="absolute -bottom-4 -right-4 bg-primary text-white rounded-2xl px-5 py-3 shadow-xl font-bold text-sm select-none z-10 animate-pulse-glow">
                  {isRTL ? '✨ جاهز في 10 دقايق' : '✨ Ready in 10 mins'}
                </div>
              </div>

              {/* Right: Contents */}
              <div className="flex-1">
                <span className="text-primary text-xs font-black tracking-widest uppercase">
                  {isRTL ? '— محتويات البوكس —' : '— BOX CONTENTS —'}
                </span>
                <h2 className="mt-3 text-3xl sm:text-4xl font-black text-charcoal leading-tight">
                  {isRTL ? 'كل اللي محتاجه جوّا البوكس' : "Everything You Need Is Inside"}
                </h2>
                <p className="mt-4 text-text-muted leading-relaxed font-medium">
                  {isRTL
                    ? 'بوكس بورجو يحتوي على كل المكونات الطازجة والصوصات الفاخرة — حرك الماوس على أي مكون لعرض تفاصيله.'
                    : 'The BURGO box includes all fresh ingredients and premium sauces — hover over any thumbnail to preview details.'}
                </p>

                {/* Contents grid with hover listeners to crossfade the main image */}
                <div 
                  className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-4"
                  onMouseLeave={() => setActiveImage(BOX_IMG)}
                >
                  {boxContents.map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.06 }}
                      onMouseEnter={() => setActiveImage(item.img)}
                      className={`flex flex-col items-center gap-2 bg-surface rounded-2xl p-3 border hover:border-primary/50 transition-all shadow-sm cursor-pointer select-none ${
                        activeImage === item.img ? 'border-primary bg-primary/5 scale-105 shadow-md' : 'border-border/40'
                      }`}
                    >
                      <img
                        src={item.img}
                        alt={item.label}
                        className="w-full h-20 object-cover rounded-xl border border-border/30"
                        loading="lazy"
                      />
                      <span className="text-xs text-charcoal font-bold text-center leading-snug">
                        {item.label}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>

            </div>
          </FadeInSection>
        </div>
      </section>

      {/* ━━━━━━━━━━ 5. HOW IT WORKS ━━━━━━━━━━ */}
      <section className="py-28 px-4 bg-background border-b border-border/40 transition-colors duration-300">
        <div className="max-w-6xl mx-auto">
          <FadeInSection>
            <div className="text-center mb-20 py-4">
              <span className="inline-block text-primary text-xs font-black tracking-widest uppercase mb-4">
                {isRTL ? '— كيف تتحضّر —' : '— HOW IT WORKS —'}
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-charcoal">
                {t('howItWorks.title')}
              </h2>
              <p className="mt-4 text-text-muted max-w-lg mx-auto text-sm font-medium leading-relaxed">
                {t('howItWorks.subtitle')}
              </p>
            </div>
          </FadeInSection>

          {/* Staggered load for instruction cards */}
          <motion.div 
            variants={gridContainerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {howItWorksSteps.map((step, idx) => {
              const IconComponent = step.icon;
              return (
                <motion.div key={idx} variants={gridItemVariants}>
                  <div className="blob-card-wrapper h-full group border border-primary/20 hover:border-primary/45 shadow-premium-glow shadow-premium-glow-hover transition-all">
                    {/* Animated background blob */}
                    <div className="absolute z-0 top-1/2 left-1/2 w-32 h-32 rounded-full bg-primary/20 filter blur-xl opacity-70 animate-blob-bounce select-none pointer-events-none" />

                    {/* Inner glass face */}
                    <div className="blob-card-face items-center text-center p-8 h-full flex flex-col">
                      {/* Step badge */}
                      <span className="absolute top-4 right-5 text-5xl font-black text-primary/10 group-hover:text-primary/20 transition-colors select-none">
                        {step.number}
                      </span>

                      {/* Icon wrapper badge that scales */}
                      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 border-2 border-primary/30 mb-5 text-primary group-hover:scale-110 transition-all duration-300 z-10">
                        <IconComponent className="h-8 w-8 text-primary" />
                      </div>

                      <h3 className="text-lg font-bold text-charcoal mb-3 z-10">
                        {step.title}
                      </h3>
                      <p className="text-text-muted text-sm leading-relaxed font-medium z-10">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ━━━━━━━━━━ 6. CTA SECTION ━━━━━━━━━━ */}
      <section className="relative py-28 px-4 overflow-hidden border-b border-border/45">
        {/* Background */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${BOX_CLOSED}')` }}
        />
        <div className="absolute inset-0 bg-surface/90 backdrop-blur-[1px] transition-colors duration-300" />

        <FadeInSection>
          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <h2 className="text-3xl sm:text-5xl font-black text-charcoal leading-tight">
              {isRTL ? 'جاهز تبدأ تجربتك؟' : 'Ready to Start Your Experience?'}
            </h2>
            <p className="mt-5 text-text-muted text-base sm:text-lg max-w-xl mx-auto font-medium">
              {isRTL
                ? 'برجرك — على مزاجك. اختار بوكسك دلوقتي.'
                : 'Your Burger. Your Rules. Choose your box now.'}
            </p>
            <button
              onClick={() => navigate('/products')}
              className="mt-10 h-14 rounded-2xl bg-primary hover:bg-primary-hover px-12 text-base sm:text-lg font-bold text-white shadow-xl shadow-primary/25 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 mx-auto cursor-pointer border-0 animate-pulse-glow"
            >
              {t('hero.cta')}
              <ArrowIcon className="w-5 h-5" />
            </button>
          </div>
        </FadeInSection>
      </section>

    </div>
  );
};

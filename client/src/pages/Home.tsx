import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, useInView } from 'framer-motion';
import { ChevronDown, ArrowLeft, ArrowRight } from 'lucide-react';
import { Burger3DIntro } from '../components/Burger3DIntro';

// Images from ref folder
const LOGO = '/ref/IMG-20260615-WA0025.jpg';
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

export const Home: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isRTL = i18n.language === 'ar';
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  const [showIntro, setShowIntro] = React.useState(() => {
    return sessionStorage.getItem('burgo_intro_played') !== 'true';
  });

  /* ── Steps data ─────────────────────────────────────────────── */
  const howItWorksSteps = [
    {
      number: '01',
      emoji: '🛒',
      title: t('howItWorks.step1'),
      desc: t('howItWorks.step1Desc'),
    },
    {
      number: '02',
      emoji: '🔥',
      title: t('howItWorks.step2'),
      desc: t('howItWorks.step2Desc'),
    },
    {
      number: '03',
      emoji: '😋',
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
      {showIntro && (
        <Burger3DIntro
          onComplete={() => {
            sessionStorage.setItem('burgo_intro_played', 'true');
            setShowIntro(false);
          }}
        />
      )}

      {/* ━━━━━━━━━━ 1. HERO ━━━━━━━━━━ */}
      <section className="relative min-h-[calc(100vh-64px)] flex flex-col justify-center items-center text-center px-4 overflow-hidden">
        {/* Background */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${BOX_CLOSED}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-gray-950/85 via-gray-950/70 to-gray-950/95" />

        {/* Glow orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
          {/* Logo */}
          <motion.img
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, type: 'spring' }}
            src={LOGO}
            alt="BURGO"
            className="w-32 h-32 sm:w-40 sm:h-40 object-contain rounded-full mb-8 shadow-2xl ring-2 ring-amber-500/30"
          />

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-display text-4xl sm:text-6xl md:text-7xl font-extrabold leading-tight text-white"
          >
            {t('hero.title')}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-5 text-gray-300 text-base sm:text-xl max-w-2xl leading-relaxed"
          >
            {t('hero.subtitle')}
          </motion.p>

          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            onClick={() => navigate('/products')}
            className="mt-10 h-14 rounded-2xl bg-amber-500 hover:bg-amber-600 px-10 text-base sm:text-lg font-bold text-white shadow-lg shadow-amber-500/30 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
          >
            {t('hero.cta')}
            <ArrowIcon className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-8 z-10 flex flex-col items-center animate-scroll-bounce">
          <span className="text-xs text-gray-400 font-semibold tracking-wider mb-1 uppercase">
            {isRTL ? 'اسحب للأسفل' : 'Scroll'}
          </span>
          <ChevronDown className="h-5 w-5 text-amber-400" />
        </div>
      </section>

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
      <section className="py-20 px-4 bg-gray-950">
        <div className="max-w-7xl mx-auto">

          {/* Title */}
          <FadeInSection>
            <div className="text-center mb-14">
              <span className="inline-block text-amber-500 text-xs font-bold tracking-widest uppercase mb-3">
                {isRTL ? '— قائمة بورجو —' : '— BURGO MENU —'}
              </span>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-white">
                {isRTL ? 'اكتشف عالم بورجو' : 'Discover the BURGO World'}
              </h2>
              <p className="mt-4 text-gray-400 max-w-xl mx-auto">
                {isRTL
                  ? 'ثلاثة أقسام، لا حدود للطعم'
                  : 'Three sections, endless flavor'}
              </p>
            </div>
          </FadeInSection>

          {/* Cards grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {menuSections.map((sec, idx) => (
              <FadeInSection key={sec.key} delay={idx * 0.15}>
                <div
                  onClick={() => navigate('/products')}
                  className="group relative rounded-3xl overflow-hidden cursor-pointer shadow-xl hover:shadow-2xl transition-shadow duration-300"
                  style={{ height: 420 }}
                >
                  {/* Background image */}
                  <img
                    src={sec.img}
                    alt={sec.label}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/50 to-transparent" />

                  {/* Accent border glow on hover */}
                  <div
                    className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ring-2"
                    style={{ '--tw-ring-color': sec.accent } as React.CSSProperties}
                  />

                  {/* Content */}
                  <div className="absolute bottom-0 inset-x-0 p-6">
                    {/* Price pills */}
                    <div className="flex gap-2 mb-3 flex-wrap">
                      {sec.stars.map((p, i) => (
                        <span
                          key={i}
                          className="text-xs font-bold px-2.5 py-1 rounded-full"
                          style={{
                            backgroundColor: sec.accent + '22',
                            color: sec.accent,
                            border: `1px solid ${sec.accent}55`,
                          }}
                        >
                          {isRTL ? `يبدأ من ${p} ${sec.unit}` : `From ${p} ${sec.unit}`}
                        </span>
                      ))}
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
                      {sec.label}
                    </h3>
                    <p className="text-gray-300 text-sm leading-relaxed mb-4">
                      {sec.sub}
                    </p>

                    {/* CTA */}
                    <div
                      className="flex items-center gap-2 text-sm font-bold"
                      style={{ color: sec.accent }}
                    >
                      <span>{isRTL ? 'تصفح الكل' : 'Browse all'}</span>
                      <ArrowIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━ 4. BOX CONTENTS SHOWCASE ━━━━━━━━━━ */}
      <section className="py-20 px-4 bg-gray-900">
        <div className="max-w-7xl mx-auto">

          <FadeInSection>
            <div className="flex flex-col lg:flex-row items-center gap-12">

              {/* Left: Big box image */}
              <div className="flex-1 relative">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl ring-1 ring-amber-500/20">
                  <img
                    src={BOX_IMG}
                    alt={isRTL ? 'بوكس بورجو' : 'BURGO Box'}
                    className="w-full h-[420px] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-950/60 to-transparent" />
                </div>

                {/* Floating badge */}
                <div className="absolute -bottom-4 -right-4 bg-amber-500 text-white rounded-2xl px-5 py-3 shadow-xl font-bold text-sm">
                  {isRTL ? '✨ جاهز في 10 دقايق' : '✨ Ready in 10 mins'}
                </div>
              </div>

              {/* Right: Contents */}
              <div className="flex-1">
                <span className="text-amber-500 text-xs font-bold tracking-widest uppercase">
                  {isRTL ? '— محتويات البوكس —' : '— BOX CONTENTS —'}
                </span>
                <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-white leading-tight">
                  {isRTL ? 'كل اللي محتاجه جوّا البوكس' : "Everything You Need Is Inside"}
                </h2>
                <p className="mt-4 text-gray-400 leading-relaxed">
                  {isRTL
                    ? 'بوكس بورجو يحتوي على كل المكونات الطازجة والصوصات الفاخرة — افتحه وابدأ التجربة.'
                    : 'The BURGO box includes all fresh ingredients and premium sauces — just open and start.'}
                </p>

                {/* Contents grid */}
                <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {boxContents.map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.08 }}
                      className="flex flex-col items-center gap-2 bg-gray-800/50 rounded-2xl p-3 border border-gray-700/50 hover:border-amber-500/40 transition-colors"
                    >
                      <img
                        src={item.img}
                        alt={item.label}
                        className="w-full h-20 object-cover rounded-xl"
                      />
                      <span className="text-xs text-gray-300 font-semibold text-center leading-snug">
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
      <section className="py-20 px-4 bg-gray-950">
        <div className="max-w-6xl mx-auto">
          <FadeInSection>
            <div className="text-center mb-14">
              <span className="inline-block text-amber-500 text-xs font-bold tracking-widest uppercase mb-3">
                {isRTL ? '— كيف تتحضّر —' : '— HOW IT WORKS —'}
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
                {t('howItWorks.title')}
              </h2>
              <p className="mt-3 text-gray-400 max-w-lg mx-auto text-sm">
                {t('howItWorks.subtitle')}
              </p>
            </div>
          </FadeInSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {howItWorksSteps.map((step, idx) => (
              <FadeInSection key={idx} delay={idx * 0.15}>
                <div className="flex flex-col items-center text-center p-8 bg-gray-900 rounded-3xl border border-gray-800 hover:border-amber-500/30 transition-colors relative overflow-hidden group">
                  {/* Step badge */}
                  <span className="absolute top-4 right-5 text-5xl font-extrabold text-amber-500/10 group-hover:text-amber-500/20 transition-colors">
                    {step.number}
                  </span>

                  {/* Emoji */}
                  <span className="text-5xl mb-5">{step.emoji}</span>

                  <h3 className="text-lg font-bold text-white mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━ 6. CTA SECTION ━━━━━━━━━━ */}
      <section className="relative py-24 px-4 overflow-hidden">
        {/* Background */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${BOX_CLOSED}')` }}
        />
        <div className="absolute inset-0 bg-gray-950/88" />

        <FadeInSection>
          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <img
              src={LOGO}
              alt="BURGO"
              className="w-20 h-20 object-contain rounded-full mx-auto mb-6 shadow-xl ring-2 ring-amber-500/40"
            />
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white leading-tight">
              {isRTL ? 'جاهز تبدأ تجربتك؟' : 'Ready to Start Your Experience?'}
            </h2>
            <p className="mt-5 text-gray-300 text-base sm:text-lg max-w-xl mx-auto">
              {isRTL
                ? 'برجرك — على مزاجك. اختار بوكسك دلوقتي.'
                : 'Your Burger. Your Rules. Choose your box now.'}
            </p>
            <button
              onClick={() => navigate('/products')}
              className="mt-10 h-14 rounded-2xl bg-amber-500 hover:bg-amber-600 px-12 text-base sm:text-lg font-bold text-white shadow-xl shadow-amber-500/30 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 mx-auto cursor-pointer"
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

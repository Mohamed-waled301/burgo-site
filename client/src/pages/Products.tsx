import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useProductStore } from '../store/useProductStore';
import { ProductCard } from '../components/ProductCard';
import { Box, UtensilsCrossed, PlusCircle, ChevronDown } from 'lucide-react';

const sectionConfig = [
  {
    key: 'boxes',
    icon: Box,
    labelKey: 'products.categoryBoxes',
    headerImg: '/ref/IMG-20260615-WA0027.jpg',
    descKey: 'products.boxesDesc',
    accent: 'from-amber-900/60 to-gray-900/90',
    badge: '#D97706',
  },
  {
    key: 'appetizers',
    icon: UtensilsCrossed,
    labelKey: 'products.categoryAppetizers',
    headerImg: '/ref/IMG-20260615-WA0033.jpg',
    descKey: 'products.appetizersDesc',
    accent: 'from-orange-900/60 to-gray-900/90',
    badge: '#EA580C',
  },
  {
    key: 'addons',
    icon: PlusCircle,
    labelKey: 'products.categoryAddons',
    headerImg: '/ref/IMG-20260615-WA0036.jpg',
    descKey: 'products.addonsDesc',
    accent: 'from-yellow-900/60 to-gray-900/90',
    badge: '#CA8A04',
  },
];

export const Products: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const { products, isLoading, fetchProducts } = useProductStore();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const getProductsByCategory = (cat: string) =>
    products.filter((p) => p.category === cat);

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-32">
        <div className="h-14 w-14 rounded-full border-4 border-gray-200 border-t-primary animate-spinner" />
        <p className="mt-4 text-gray-500 font-semibold text-lg">
          {isRTL ? 'جاري تحميل المنتجات...' : 'Loading products...'}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col">

      {/* ─── PAGE HERO ──────────────────────────────────────────── */}
      <section
        className="relative w-full overflow-hidden flex flex-col items-center justify-center text-center py-20 px-4"
        style={{ minHeight: 280 }}
      >
        {/* Background box image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/ref/IMG-20260615-WA0026.jpg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-gray-950/80 via-gray-950/70 to-gray-950/90" />

        <div className="relative z-10 max-w-3xl mx-auto">
          {/* BURGO Logo */}
          <motion.img
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            src="/ref/IMG-20260615-WA0025.jpg"
            alt="BURGO Logo"
            className="w-28 h-28 object-contain rounded-full mx-auto mb-6 shadow-2xl border-2 border-amber-500/40"
          />
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight"
          >
            {isRTL ? 'قائمة المنتجات' : 'Our Menu'}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="mt-3 text-gray-300 text-base sm:text-lg max-w-xl mx-auto"
          >
            {isRTL
              ? 'كل المكونات طازجة — بوكسات، مقبلات، وإضافات'
              : 'Fresh ingredients — boxes, appetizers & add-ons'}
          </motion.p>
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-5 z-10 flex flex-col items-center gap-1 animate-scroll-bounce">
          <ChevronDown className="h-5 w-5 text-amber-400" />
        </div>
      </section>

      {/* ─── SECTIONS ──────────────────────────────────────────── */}
      {sectionConfig.map((section, secIdx) => {
        const Icon = section.icon;
        const items = getProductsByCategory(section.key);

        return (
          <section
            key={section.key}
            id={`section-${section.key}`}
            className="w-full"
          >
            {/* Section Header Banner */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.5 }}
              className="relative w-full h-48 sm:h-64 overflow-hidden"
            >
              <img
                src={section.headerImg}
                alt={t(section.labelKey)}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className={`absolute inset-0 bg-gradient-to-r ${section.accent}`} />

              {/* Label */}
              <div className="absolute inset-0 flex items-center px-6 sm:px-16">
                <div>
                  <div
                    className="flex items-center gap-3 mb-2"
                    style={{ flexDirection: isRTL ? 'row-reverse' : 'row' }}
                  >
                    <div
                      className="flex items-center justify-center w-11 h-11 rounded-xl"
                      style={{ backgroundColor: section.badge + '33', border: `2px solid ${section.badge}` }}
                    >
                      <Icon className="w-6 h-6" style={{ color: section.badge }} />
                    </div>
                    <span
                      className="text-xs font-bold tracking-widest uppercase"
                      style={{ color: section.badge }}
                    >
                      {isRTL ? 'BURGO' : 'BURGO'}
                    </span>
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-extrabold text-white drop-shadow-lg">
                    {t(section.labelKey)}
                  </h2>
                  <p className="mt-1 text-sm text-gray-300 max-w-sm">
                    {section.key === 'boxes' &&
                      (isRTL
                        ? 'بوكسات برجر جاهزة للتسوية مع كل المكونات الطازجة'
                        : 'Ready-to-grill burger boxes with all fresh ingredients')}
                    {section.key === 'appetizers' &&
                      (isRTL
                        ? 'أشهى المقبلات المقرمشة المحضّرة بعناية'
                        : 'The crispiest appetizers crafted with care')}
                    {section.key === 'addons' &&
                      (isRTL
                        ? 'أضف النكهات والصوصات التي تحبها لبوكسك'
                        : 'Add your favorite sauces and flavors to your box')}
                  </p>
                </div>
              </div>

              {/* Item count pill */}
              <div className="absolute top-4 right-4 sm:right-10">
                <span
                  className="text-white text-xs font-bold px-3 py-1 rounded-full"
                  style={{ backgroundColor: section.badge }}
                >
                  {items.length} {isRTL ? 'منتج' : 'items'}
                </span>
              </div>
            </motion.div>

            {/* Products Grid */}
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center text-gray-400">
                  <span className="text-5xl mb-3">📦</span>
                  <p className="font-semibold">{t('products.noProducts')}</p>
                </div>
              ) : (
                <motion.div
                  layout
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                >
                  {items.map((product, idx) => (
                    <motion.div
                      layout
                      key={product.id}
                      initial={{ opacity: 0, y: 40 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: '-50px' }}
                      transition={{ duration: 0.4, delay: idx * 0.08 }}
                    >
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>

            {/* Section Divider */}
            {secIdx < sectionConfig.length - 1 && (
              <div className="w-full max-w-5xl mx-auto px-8">
                <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
              </div>
            )}
          </section>
        );
      })}

      {/* ─── QUICK NAV FLOATING TABS ──────────────────────────── */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 hidden sm:flex gap-2 bg-gray-900/90 backdrop-blur-md border border-white/10 rounded-2xl px-3 py-2 shadow-2xl">
        {sectionConfig.map((s) => {
          const Icon = s.icon;
          return (
            <button
              key={s.key}
              onClick={() => {
                document.getElementById(`section-${s.key}`)?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-gray-300 hover:text-white hover:bg-white/10 transition-all"
            >
              <Icon className="w-4 h-4" />
              <span>{t(s.labelKey)}</span>
            </button>
          );
        })}
      </div>

    </div>
  );
};

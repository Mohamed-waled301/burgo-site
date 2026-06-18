import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { useProductStore, Product } from '../store/useProductStore';
import { ProductCard } from '../components/ProductCard';
import { ProductDetailModal } from '../components/ProductDetailModal';
import { Box, UtensilsCrossed, PlusCircle, ChevronDown } from 'lucide-react';

const sectionConfig = [
  {
    key: 'boxes',
    icon: Box,
    labelKey: 'products.categoryBoxes',
    accent: 'from-amber-900/60 to-gray-900/90',
    badge: '#D97706',
  },
  {
    key: 'appetizers',
    icon: UtensilsCrossed,
    labelKey: 'products.categoryAppetizers',
    accent: 'from-orange-900/60 to-gray-900/90',
    badge: '#EA580C',
  },
  {
    key: 'addons',
    icon: PlusCircle,
    labelKey: 'products.categoryAddons',
    accent: 'from-yellow-900/60 to-gray-900/90',
    badge: '#CA8A04',
  },
];

// Staggered grid animations
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
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

export const Products: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const { products, isLoading, fetchProducts } = useProductStore();
  const [scrollY, setScrollY] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    fetchProducts();

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [fetchProducts]);

  // Filter products by category, checking p.active !== false
  const getProductsByCategory = (cat: string) =>
    products.filter((p) => p.category === cat && p.active !== false);

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-32 bg-zinc-950 text-zinc-100">
        <div className="h-14 w-14 rounded-full border-4 border-zinc-800 border-t-primary animate-spinner" />
        <p className="mt-4 text-zinc-400 font-bold text-lg">
          {isRTL ? 'جاري تحميل المنتجات...' : 'Loading products...'}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col bg-zinc-950 text-zinc-100 min-h-screen">

      {/* ─── PAGE HERO (No logo) ─── */}
      <section
        className="relative w-full overflow-hidden flex flex-col items-center justify-center text-center py-24 px-4 select-none border-b border-zinc-900"
        style={{ minHeight: 280 }}
      >
        {/* Background box image with scroll parallax support */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: "url('/ref/IMG-20260615-WA0026.jpg')",
            transform: `translateY(${scrollY * 0.15}px) scale(1.05)`
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/80 via-zinc-950/65 to-zinc-950" />

        <div className="relative z-10 max-w-3xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl font-black text-white tracking-tight"
          >
            {isRTL ? 'قائمة المنتجات' : 'Our Menu'}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="mt-4 text-zinc-400 text-base sm:text-lg max-w-xl mx-auto font-medium"
          >
            {isRTL
              ? 'كل المكونات طازجة — بوكسات، مقبلات، وإضافات'
              : 'Fresh ingredients — boxes, appetizers & add-ons'}
          </motion.p>
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-5 z-10 flex flex-col items-center gap-1 animate-scroll-bounce">
          <ChevronDown className="h-5 w-5 text-primary" />
        </div>
      </section>

      {/* ─── SECTIONS ─── */}
      {sectionConfig.map((section, secIdx) => {
        const Icon = section.icon;
        const items = getProductsByCategory(section.key);

        return (
          <section
            key={section.key}
            id={`section-${section.key}`}
            className="w-full bg-zinc-950/50"
          >
            {/* Clean Section Header (No background image/panel behind it) */}
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-4 flex flex-col sm:flex-row items-center sm:items-end justify-between border-b border-zinc-900 gap-4 text-center sm:text-start">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div
                  className="flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/10 border-2 border-primary/30 text-primary"
                >
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-black text-white">
                    {t(section.labelKey)}
                  </h2>
                  <p className="text-zinc-400 text-xs sm:text-sm mt-1 font-semibold">
                    {section.key === 'boxes' && (isRTL ? 'بوكسات برجر جاهزة للتسوية مع كل المكونات الطازجة' : 'Ready-to-grill burger boxes with all fresh ingredients')}
                    {section.key === 'appetizers' && (isRTL ? 'أشهى المقبلات المقرمشة المحضّرة بعناية' : 'The crispiest appetizers crafted with care')}
                    {section.key === 'addons' && (isRTL ? 'أضف النكهات والصوصات التي تحبها لبوكسك' : 'Add your favorite sauces and flavors to your box')}
                  </p>
                </div>
              </div>
              <div className="bg-primary/10 border border-primary/20 text-primary text-xs font-bold px-3 py-1 rounded-xl shrink-0 font-price">
                {items.length} {isRTL ? 'منتج' : 'items'}
              </div>
            </div>

            {/* Products Grid */}
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center text-zinc-500">
                  <Box className="h-16 w-16 text-zinc-700 mb-3 animate-pulse" />
                  <p className="font-bold">{t('products.noProducts')}</p>
                </div>
              ) : (
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: '-100px' }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                >
                  {items.map((product) => (
                    <motion.div
                      key={product.id}
                      variants={itemVariants}
                      className="h-full flex flex-col"
                    >
                      <ProductCard product={product} onClick={() => setSelectedProduct(product)} />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>

            {/* Section Divider */}
            {secIdx < sectionConfig.length - 1 && (
              <div className="w-full max-w-5xl mx-auto px-8">
                <div className="h-px bg-gradient-to-r from-transparent via-zinc-900 to-transparent" />
              </div>
            )}
          </section>
        );
      })}

      {/* ─── QUICK NAV FLOATING TABS ─── */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 hidden sm:flex gap-2 bg-zinc-900/90 backdrop-blur-md border border-zinc-800 rounded-2xl px-3 py-2 shadow-2xl">
        {sectionConfig.map((s) => {
          const Icon = s.icon;
          return (
            <button
              key={s.key}
              onClick={() => {
                document.getElementById(`section-${s.key}`)?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all cursor-pointer border-0 bg-transparent outline-none"
            >
              <Icon className="w-4 h-4 text-primary" />
              <span>{t(s.labelKey)}</span>
            </button>
          );
        })}
      </div>

      {/* ─── DETAIL VIEW DIALOG ─── */}
      <AnimatePresence>
        {selectedProduct && (
          <ProductDetailModal
            product={selectedProduct}
            allProducts={products}
            onClose={() => setSelectedProduct(null)}
          />
        )}
      </AnimatePresence>

    </div>
  );
};

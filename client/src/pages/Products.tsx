import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useProductStore } from '../store/useProductStore';
import { ProductCard } from '../components/ProductCard';

export const Products: React.FC = () => {
  const { t } = useTranslation();
  const { products, isLoading, fetchProducts } = useProductStore();
  const [activeCategory, setActiveCategory] = useState<string>('all');

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const categories = [
    { key: 'all', label: t('products.categoryAll') },
    { key: 'classic', label: t('products.categoryClassic') },
    { key: 'spicy', label: t('products.categorySpicy') },
    { key: 'premium', label: t('products.categoryPremium') }
  ];

  const filteredProducts = activeCategory === 'all'
    ? products
    : products.filter(p => p.category === activeCategory);

  return (
    <div className="mx-auto max-w-7xl w-full px-4 py-12 sm:px-6 lg:px-8 flex-1 flex flex-col">
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto mb-10 select-none">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
          {t('products.title')}
        </h1>
        <p className="mt-4 text-gray-500 text-sm sm:text-base">
          {t('products.subtitle')}
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex justify-center mb-10">
        <div className="flex border-b border-gray-200 w-full max-w-md overflow-x-auto scrollbar-none pb-0.5 justify-around md:justify-center md:gap-8">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`py-3 px-4 text-sm font-semibold tracking-wide border-b-2 transition-all relative shrink-0 ${
                  isActive
                    ? 'border-primary text-primary font-bold'
                    : 'border-transparent text-gray-500 hover:text-gray-800'
                }`}
              >
                {cat.label}
                {isActive && (
                  <motion.div
                    layoutId="activeCategoryBorder"
                    className="absolute bottom-0 inset-x-0 h-0.5 bg-primary"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Products list area */}
      {isLoading ? (
        <div className="flex-1 flex flex-col items-center justify-center py-20">
          <div className="h-12 w-12 rounded-full border-4 border-gray-200 border-t-primary animate-spinner" />
          <p className="mt-4 text-gray-500 font-semibold">
            {t('language') === 'en' ? 'Preparing burger menu...' : 'جاري تحضير البوكسات...'}
          </p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center py-20 text-center select-none">
          <span className="text-6xl mb-4">🔍</span>
          <p className="text-gray-500 font-semibold">{t('products.noProducts')}</p>
        </div>
      ) : (
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filteredProducts.map((product) => (
            <motion.div
              layout
              key={product.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

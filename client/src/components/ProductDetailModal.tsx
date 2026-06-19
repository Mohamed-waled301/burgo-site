import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, ShoppingCart, Sparkles, Flame, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '../store/useCartStore';
import { Product } from './ProductCard';

interface ProductDetailModalProps {
  product: Product | null;
  allProducts: Product[];
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  allProducts,
  onClose,
}) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const { addItem, setCartOpen } = useCartStore();

  const [flyingImage, setFlyingImage] = useState<{
    src: string;
    startX: number;
    startY: number;
    endX: number;
    endY: number;
    width: number;
    height: number;
  } | null>(null);

  if (!product) return null;

  // Check if discount is active and not expired
  const hasDiscount = (() => {
    if (!product.discount) return false;
    if (product.discount.expiryDate) {
      return new Date(product.discount.expiryDate).getTime() > Date.now();
    }
    return true;
  })();

  // Calculate final price
  const finalPrice = (() => {
    if (!hasDiscount || !product.discount) return product.price;
    if (product.discount.type === 'percent') {
      return Math.round(product.price * (1 - product.discount.value / 100));
    }
    return Math.max(0, product.price - product.discount.value);
  })();

  // Filter upsell recommendations: suggest extra sauces and appetizers
  const upsells = allProducts.filter(
    (p) => p.category === 'appetizers' || p.category === 'addons'
  ).slice(0, 3); // Grab up to 3 items

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>, p: Product) => {
    const hasReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Calculate p final price
    const pHasDiscount = (() => {
      if (!p.discount) return false;
      if (p.discount.expiryDate) {
        return new Date(p.discount.expiryDate).getTime() > Date.now();
      }
      return true;
    })();
    const pFinalPrice = (() => {
      if (!pHasDiscount || !p.discount) return p.price;
      if (p.discount.type === 'percent') {
        return Math.round(p.price * (1 - p.discount.value / 100));
      }
      return Math.max(0, p.price - p.discount.value);
    })();

    const itemToAdd = {
      id: p.id,
      name: p.name,
      price: pFinalPrice,
      image: p.image,
    };

    // Add item immediately to state
    addItem(itemToAdd);

    if (hasReducedMotion) {
      setCartOpen(true);
      return;
    }

    const clickedBtn = e.currentTarget;
    const modalImage = document.querySelector('.modal-product-image');
    const cartIcon = document.querySelector('.cart-btn-icon');

    // If we're adding the main modal product, fly from the big image
    // If it's an upsell, fly from the button or a generic spot
    const sourceEl = p.id === product.id ? modalImage : clickedBtn;

    if (sourceEl && cartIcon) {
      const srcRect = sourceEl.getBoundingClientRect();
      const cartRect = cartIcon.getBoundingClientRect();

      setFlyingImage({
        src: p.image,
        startX: srcRect.left,
        startY: srcRect.top,
        endX: cartRect.left + cartRect.width / 4,
        endY: cartRect.top + cartRect.height / 4,
        width: Math.min(srcRect.width, 120),
        height: Math.min(srcRect.height, 120),
      });
    } else {
      setCartOpen(true);
    }
  };

  // Safe checks for translations
  const localizedName = t(`products.box_${product.id}.name` as any, { defaultValue: product.name });
  const localizedTagline = t(`products.box_${product.id}.tagline` as any, { defaultValue: product.description });
  const localizedServes = t(`products.box_${product.id}.serves` as any, { defaultValue: '' });
  
  // Custom arrays check
  const hasCustomI18n = i18n.exists(`products.box_${product.id}.ingredients`);
  const ingredientsList: string[] = hasCustomI18n
    ? t(`products.box_${product.id}.ingredients` as any, { returnObjects: true }) as any
    : product.ingredients;

  const prepStepsList: string[] = hasCustomI18n
    ? t(`products.box_${product.id}.prepSteps` as any, { returnObjects: true }) as any
    : product.prepSteps;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-md cursor-pointer"
        onClick={onClose}
      />

      {/* Slide-Up Container */}
      <motion.div
        initial={{ y: '100%', opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: '100%', opacity: 0 }}
        transition={{ type: 'spring', damping: 28, stiffness: 220 }}
        className="relative bg-zinc-900 border border-zinc-850 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] z-10 text-zinc-100 select-none"
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-zinc-850 bg-zinc-950/50">
          <span className="text-primary text-xs font-black tracking-widest uppercase flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5" />
            {product.category === 'boxes' ? t('products.categoryBoxes') : product.category}
          </span>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white transition rounded-xl p-1.5 hover:bg-zinc-800 cursor-pointer border-0"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal scrollable body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-thin">
          {/* Main Visual and basic info */}
          <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
            {/* Contain Image Fit Container */}
            <div className="w-full md:w-56 h-56 rounded-2xl overflow-hidden bg-zinc-950 p-4 border border-zinc-800 flex items-center justify-center relative shrink-0">
              {product.image.startsWith('/') || product.image.startsWith('http') ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="modal-product-image w-full h-full object-contain"
                />
              ) : (
                <span className="modal-product-image text-7xl select-none">{product.image}</span>
              )}
            </div>

            {/* Title & Taglines */}
            <div className="flex-1 text-center md:text-start space-y-3 w-full">
              <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                {localizedName}
              </h2>
              <p className="text-zinc-300 text-sm leading-relaxed font-medium">
                {localizedTagline}
              </p>
              {localizedServes && (
                <div className="inline-flex items-center gap-2 bg-primary/10 text-primary border border-primary/20 rounded-xl px-3 py-1 text-xs font-bold">
                  <Flame className="h-3.5 w-3.5" />
                  <span>{localizedServes}</span>
                </div>
              )}
            </div>
          </div>

          {/* Detailed Specifications tabs list */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-zinc-850">
            {/* Ingredients */}
            <div className="space-y-3">
              <h4 className="text-xs font-black tracking-widest text-primary uppercase">
                {t('products.ingredients')}
              </h4>
              <ul className="space-y-2 text-zinc-300 text-xs font-semibold leading-relaxed">
                {Array.isArray(ingredientsList) &&
                  ingredientsList.map((ing, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                      <span>{ing}</span>
                    </li>
                  ))}
              </ul>
            </div>

            {/* Prep steps */}
            <div className="space-y-3">
              <h4 className="text-xs font-black tracking-widest text-primary uppercase">
                {t('products.prepSteps')}
              </h4>
              <ol className="space-y-2 text-zinc-300 text-xs font-semibold leading-relaxed">
                {Array.isArray(prepStepsList) &&
                  prepStepsList.map((step, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span className="flex items-center justify-center h-4 w-4 rounded-full bg-zinc-800 text-[10px] text-zinc-400 font-bold shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
              </ol>
            </div>
          </div>

          {/* Upsells recommendation section (Section 12 spec) */}
          {product.category === 'boxes' && upsells.length > 0 && (
            <div className="pt-6 border-t border-zinc-850 space-y-4">
              <h4 className="text-xs font-black tracking-widest text-primary uppercase">
                {isRTL ? 'أضف معاها (موصى به)' : 'You might also like (Recommended)'}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {upsells.map((up) => {
                  const upName = t(`products.box_${up.id}.name`, { defaultValue: up.name });
                  return (
                    <div
                      key={up.id}
                      className="bg-zinc-950 border border-zinc-850 rounded-2xl p-3 flex flex-col justify-between items-center text-center gap-2 hover:border-primary/30 transition-colors"
                    >
                      <div className="w-16 h-16 bg-zinc-900 rounded-xl overflow-hidden flex items-center justify-center p-2">
                        {up.image.startsWith('/') || up.image.startsWith('http') ? (
                          <img src={up.image} alt="" className="w-full h-full object-contain" />
                        ) : (
                          <span className="text-3xl">{up.image}</span>
                        )}
                      </div>
                      <span className="text-xs font-bold text-white leading-tight min-h-[32px] flex items-center justify-center">
                        {upName}
                      </span>
                      <div className="flex items-center justify-between w-full mt-2 gap-2 border-t border-zinc-900 pt-2">
                        <span className="text-xs font-bold text-primary font-price">
                          {up.price} {t('products.currency')}
                        </span>
                        <button
                          onClick={(e) => handleAddToCart(e, up)}
                          className="bg-zinc-800 hover:bg-primary hover:text-white text-zinc-300 rounded-lg p-1 transition-all cursor-pointer border-0"
                          title={t('products.addToCart')}
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer Area: Price & Main CTA */}
        <div className="px-6 py-4 border-t border-zinc-850 bg-zinc-950/50 flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
              {isRTL ? 'سعر البوكس' : 'Box Price'}
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-primary font-price">
                {finalPrice} {t('products.currency')}
              </span>
              {hasDiscount && (
                <span className="text-sm line-through text-zinc-500 font-price">
                  {product.price} {t('products.currency')}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={(e) => handleAddToCart(e, product)}
            className="rounded-2xl bg-primary hover:bg-primary-hover px-8 py-3.5 text-sm font-black text-white shadow-xl shadow-primary/20 flex items-center justify-center gap-2 cursor-pointer border-0 animate-pulse-glow"
          >
            <ShoppingCart className="h-4.5 w-4.5" />
            <span>{t('products.addToCart')}</span>
          </button>
        </div>
      </motion.div>

      {/* Fly-to-Cart Portal Overlay */}
      <AnimatePresence>
        {flyingImage && (
          <motion.div
            initial={{
              position: 'fixed',
              left: flyingImage.startX,
              top: flyingImage.startY,
              width: flyingImage.width,
              height: flyingImage.height,
              opacity: 1,
              scale: 1,
              borderRadius: '24px',
              zIndex: 9999,
            }}
            animate={{
              left: flyingImage.endX,
              top: flyingImage.endY,
              width: 28,
              height: 28,
              opacity: 0.3,
              scale: 0.15,
              borderRadius: '9999px',
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.65,
              ease: [0.25, 1, 0.5, 1],
            }}
            onAnimationComplete={() => {
              setCartOpen(true);
              setFlyingImage(null);
            }}
            className="pointer-events-none bg-zinc-950 border border-primary/25 shadow-2xl overflow-hidden flex items-center justify-center text-4xl"
          >
            {flyingImage.src.startsWith('/') || flyingImage.src.startsWith('http') ? (
              <img src={flyingImage.src} alt="" className="w-full h-full object-contain" />
            ) : (
              flyingImage.src
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

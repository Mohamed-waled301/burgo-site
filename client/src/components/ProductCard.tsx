import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '../store/useCartStore';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  badge: string | null;
  image: string;
  category: string;
  ingredients: string[];
  prepSteps: string[];
  discount?: {
    type: 'percent' | 'fixed';
    value: number;
    expiryDate?: string;
  } | null;
}

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { t } = useTranslation();
  const addItem = useCartStore((state) => state.addItem);

  const [ingredientsOpen, setIngredientsOpen] = useState(false);
  const [prepStepsOpen, setPrepStepsOpen] = useState(false);

  // Check if discount is active and not expired
  const hasDiscount = (() => {
    if (!product.discount) return false;
    if (product.discount.expiryDate) {
      const isExpired = new Date(product.discount.expiryDate).getTime() < Date.now();
      return !isExpired;
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

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    const buttonElement = e.currentTarget;
    const cardElement = buttonElement.closest('.product-card');
    const imgElement = cardElement?.querySelector('.product-card-image');
    const cartIcon = document.querySelector('.lucide-shopping-cart');

    if (imgElement && cartIcon) {
      const imgRect = imgElement.getBoundingClientRect();
      const cartRect = cartIcon.getBoundingClientRect();

      // Create animated floating replica
      const flyingEl = document.createElement('div');
      flyingEl.innerText = product.image;
      flyingEl.className = 'animate-fly-to-cart flex items-center justify-center rounded-xl bg-cream text-4xl shadow-lg border border-gray-300';
      
      // Initial positioning matches original card image
      flyingEl.style.width = `${imgRect.width}px`;
      flyingEl.style.height = `${imgRect.height}px`;
      flyingEl.style.left = `${imgRect.left}px`;
      flyingEl.style.top = `${imgRect.top}px`;

      // Coordinate distance delta calculations
      const deltaX = cartRect.left - imgRect.left + (cartRect.width / 2) - (imgRect.width / 2);
      const deltaY = cartRect.top - imgRect.top + (cartRect.height / 2) - (imgRect.height / 2);

      flyingEl.style.setProperty('--cart-x', `${deltaX}px`);
      flyingEl.style.setProperty('--cart-y', `${deltaY}px`);

      document.body.appendChild(flyingEl);

      // Remove element once trajectory animation finishes
      setTimeout(() => {
        flyingEl.remove();
      }, 800);
    }

    // Call store
    addItem({
      id: product.id,
      name: product.name,
      price: finalPrice,
      image: product.image,
    });
  };

  return (
    <div className="product-card flex flex-col rounded-[20px] bg-white border border-gray-100 shadow-sm hover:shadow-md hover-card-glow transition-all duration-300 overflow-hidden">
      {/* Product Image Area */}
      <div className="relative h-[240px] flex items-center justify-center bg-gradient-to-br from-dark to-gray-800 border-b border-gray-100 group select-none">
        {/* Animated sizzle background */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary via-transparent to-transparent group-hover:scale-125 transition-all duration-500" />
        
        {/* Large Emoji visual */}
        <span className="product-card-image text-8xl transition-transform duration-300 group-hover:scale-110 drop-shadow-lg">
          {product.image}
        </span>

        {/* Promo badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 pointer-events-none">
          {product.badge && (
            <span className="animate-badge-pop rounded-lg bg-accent px-3 py-1 text-xs font-bold text-charcoal shadow-sm flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              {product.badge}
            </span>
          )}
          {hasDiscount && product.discount && (
            <span className="animate-badge-pop rounded-lg bg-primary text-white px-3 py-1 text-xs font-bold shadow-sm">
              {t('products.onSale')} -{product.discount.value}{product.discount.type === 'percent' ? '%' : ` ${t('products.currency')}`}
            </span>
          )}
        </div>
      </div>

      {/* Info Body */}
      <div className="flex flex-col flex-1 p-5">
        <h3 className="font-display text-lg font-bold text-gray-900 leading-snug">
          {product.name}
        </h3>
        <p className="mt-2 text-sm text-gray-500 leading-relaxed min-h-[40px]">
          {product.description}
        </p>

        {/* Accordions */}
        <div className="mt-4 border-t border-gray-100 pt-3 space-y-2">
          {/* Ingredients Accordion */}
          <div>
            <button
              onClick={() => setIngredientsOpen(!ingredientsOpen)}
              className="flex w-full items-center justify-between py-1.5 text-sm font-semibold text-gray-700 hover:text-primary transition"
            >
              <span>{t('products.ingredients')}</span>
              <ChevronDown
                className={`h-4 w-4 transform transition-transform duration-200 ${
                  ingredientsOpen ? 'rotate-180' : ''
                }`}
              />
            </button>
            <AnimatePresence initial={false}>
              {ingredientsOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <ul className="mt-1.5 list-disc list-inside space-y-1 text-xs text-gray-600 px-1">
                    {product.ingredients.map((ing, i) => (
                      <li key={i}>{ing}</li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Prep Steps Accordion */}
          <div className="border-t border-gray-50 pt-2">
            <button
              onClick={() => setPrepStepsOpen(!prepStepsOpen)}
              className="flex w-full items-center justify-between py-1.5 text-sm font-semibold text-gray-700 hover:text-primary transition"
            >
              <span>{t('products.prepSteps')}</span>
              <ChevronDown
                className={`h-4 w-4 transform transition-transform duration-200 ${
                  prepStepsOpen ? 'rotate-180' : ''
                }`}
              />
            </button>
            <AnimatePresence initial={false}>
              {prepStepsOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <ol className="mt-1.5 list-decimal list-inside space-y-1.5 text-xs text-gray-600 px-1">
                    {product.prepSteps.map((step, i) => (
                      <li key={i} className="leading-relaxed">{step}</li>
                    ))}
                  </ol>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Footer Area: Price & CTA */}
        <div className="mt-auto border-t border-gray-100 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-baseline gap-2">
            <span className="font-price text-xl font-bold text-primary">
              {finalPrice} {t('products.currency')}
            </span>
            {hasDiscount && (
              <span className="font-price text-xs line-through text-gray-400">
                {product.price} {t('products.currency')}
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            className="flex-1 sm:flex-initial rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-primary-hover active:scale-[0.98] select-none text-center"
          >
            {t('products.addToCart')}
          </button>
        </div>
      </div>
    </div>
  );
};

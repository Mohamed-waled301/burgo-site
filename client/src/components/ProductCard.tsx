import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

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
  active?: boolean;
  discount?: {
    type: 'percent' | 'fixed';
    value: number;
    expiryDate?: string;
  } | null;
}

interface ProductCardProps {
  product: Product;
  onClick?: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  const { t } = useTranslation();

  return (
    <motion.div
      onClick={onClick}
      whileHover={{ scale: 1.03, rotateY: 6, rotateX: -3 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className="product-card blob-card-wrapper h-full group/card cursor-pointer shadow-premium-glow shadow-premium-glow-hover select-none"
      style={{ perspective: 1000 }}
    >
      {/* Animated blob background element */}
      <div className="absolute z-0 top-1/2 left-1/2 w-36 h-36 rounded-full bg-primary/15 filter blur-xl opacity-60 animate-blob-bounce select-none pointer-events-none" />

      {/* Inner glass face */}
      <div className="blob-card-face h-full flex flex-col justify-between">
        {/* Product Image Area (object-contain with padding & dark bg) */}
        <div className="relative h-[240px] flex items-center justify-center bg-zinc-950 p-6 border-b border-zinc-900 group select-none overflow-hidden">
          {product.image.startsWith('/') || product.image.startsWith('http') ? (
            <img
              src={product.image}
              className="product-card-image w-full h-full object-contain transition-transform duration-500 ease-out group-hover/card:scale-105"
              alt={product.name}
              loading="lazy"
            />
          ) : (
            <span className="product-card-image text-8xl block transition-transform duration-500 ease-out group-hover/card:scale-110 drop-shadow-lg select-none">
              {product.image}
            </span>
          )}
        </div>

        {/* Info Body (Name only, centered or aligned) */}
        <div className="p-5 text-center flex items-center justify-center flex-1">
          <h3 className="font-display text-base sm:text-lg font-black leading-snug text-white transition-colors duration-300 group-hover/card:text-primary">
            {t(`products.box_${product.id}.name`, { defaultValue: product.name })}
          </h3>
        </div>
      </div>
    </motion.div>
  );
};

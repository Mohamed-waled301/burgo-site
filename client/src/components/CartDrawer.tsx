import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';

export const CartDrawer: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const { 
    items, 
    isCartOpen, 
    setCartOpen, 
    removeItem, 
    updateQuantity, 
    getCartTotal 
  } = useCartStore();

  const handleCheckoutClick = () => {
    setCartOpen(false);
    navigate('/checkout');
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={() => setCartOpen(false)}
            className="fixed inset-0 z-50 bg-black"
          />

          {/* Cart Sidebar panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            // Force LTR/RTL layout alignments inside the drawer
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-white shadow-2xl h-full border-l border-gray-100"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
              <h2 className="text-lg font-bold font-display flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-primary" />
                <span>{t('cart.title')}</span>
              </h2>
              <button
                onClick={() => setCartOpen(false)}
                className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* List of Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <span className="text-5xl mb-4">🛒</span>
                  <p className="text-gray-500 font-medium max-w-xs">{t('cart.empty')}</p>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between gap-4 p-3 rounded-xl bg-gray-50 border border-gray-100 transition hover:bg-gray-100/70">
                    {/* Product visual / emoji */}
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-cream text-3xl shadow-inner border border-gray-200">
                      {item.image}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm text-gray-900 truncate leading-snug">{item.name}</h4>
                      <p className="mt-1 font-price font-bold text-primary text-sm">
                        {item.price} {t('products.currency')}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col items-end gap-2">
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-gray-400 hover:text-red-500 transition text-xs"
                      >
                        <X className="h-4 w-4" />
                      </button>
                      
                      {/* Quantity Toggler */}
                      <div className="flex items-center border border-gray-200 bg-white rounded-md">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 hover:bg-gray-100 text-gray-500 hover:text-gray-700"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="px-2.5 text-xs font-semibold text-gray-900 font-price">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 hover:bg-gray-100 text-gray-500 hover:text-gray-700"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Subtotal & Checkout */}
            {items.length > 0 && (
              <div className="border-t border-gray-100 px-6 py-6 bg-gray-50 space-y-4">
                <div className="flex items-center justify-between text-base font-bold text-gray-900">
                  <span>{t('cart.subtotal')}</span>
                  <span className="font-price text-lg text-primary">
                    {getCartTotal()} {t('products.currency')}
                  </span>
                </div>
                
                <button
                  onClick={handleCheckoutClick}
                  className="flex w-full items-center justify-center rounded-xl bg-primary px-6 py-3.5 text-base font-bold text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary-hover hover:scale-[1.01] active:scale-[0.99]"
                >
                  {t('cart.checkout')}
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '../store/useCartStore';
import { LanguageSwitcher } from './LanguageSwitcher';

export const Navbar: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const getCartCount = useCartStore((state) => state.getCartCount);
  const toggleCart = useCartStore((state) => state.toggleCart);
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [badgeBump, setBadgeBump] = useState(false);
  
  const cartCount = getCartCount();

  // Bump cart animation when count changes
  useEffect(() => {
    if (cartCount === 0) return;
    setBadgeBump(true);
    const timer = setTimeout(() => setBadgeBump(false), 300);
    return () => clearTimeout(timer);
  }, [cartCount]);

  return (
    <nav className="sticky top-0 z-50 bg-zinc-950/80 backdrop-blur-md text-zinc-100 border-b border-zinc-900 shadow-lg select-none">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2.5 font-display text-xl font-bold tracking-tight transition hover:opacity-90">
              <img
                src="/ref/IMG-20260615-WA0025.jpg"
                alt="Burgo Logo"
                className="h-9 w-9 rounded-xl object-cover border border-zinc-800 shadow-sm"
              />
              <span className="font-display font-black tracking-tight text-lg uppercase bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Burgo
              </span>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className={`text-sm font-semibold transition-colors hover:text-primary relative py-1 ${
                location.pathname === '/' ? 'text-primary' : 'text-zinc-400'
              }`}
            >
              {t('nav.home')}
              {location.pathname === '/' && (
                <motion.div
                  layoutId="navUnderline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </Link>
            <Link
              to="/products"
              className={`text-sm font-semibold transition-colors hover:text-primary relative py-1 ${
                location.pathname === '/products' ? 'text-primary' : 'text-zinc-400'
              }`}
            >
              {t('nav.products')}
              {location.pathname === '/products' && (
                <motion.div
                  layoutId="navUnderline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </Link>
            <Link
              to="/contact"
              className={`text-sm font-semibold transition-colors hover:text-primary relative py-1 ${
                location.pathname === '/contact' ? 'text-primary' : 'text-zinc-400'
              }`}
            >
              {t('nav.contact')}
              {location.pathname === '/contact' && (
                <motion.div
                  layoutId="navUnderline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </Link>
          </div>

          {/* Controls & Cart Button */}
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="hidden sm:block">
              <LanguageSwitcher />
            </div>

            {/* Cart Button */}
            <motion.button
              onClick={toggleCart}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="cart-btn-icon relative rounded-xl p-2.5 bg-zinc-900 border border-zinc-800 text-zinc-100 hover:text-primary transition-colors focus:outline-none shadow-md shadow-black/10 flex items-center justify-center cursor-pointer"
              aria-label="Open Cart"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span
                  className={`absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-black text-white shadow-lg shadow-primary/30 ${
                    badgeBump ? 'animate-cart-bounce' : ''
                  }`}
                >
                  {cartCount}
                </span>
              )}
            </motion.button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-xl p-2.5 text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100 md:hidden transition-colors cursor-pointer border border-transparent hover:border-zinc-800"
            >
              {mobileMenuOpen ? <X className="h-5.5 w-5.5" /> : <Menu className="h-5.5 w-5.5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="md:hidden border-t border-zinc-900 bg-zinc-950 px-4 py-4 space-y-2 overflow-hidden"
          >
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`block rounded-xl px-4 py-2.5 text-base font-semibold transition-colors ${
                location.pathname === '/'
                  ? 'bg-primary/10 text-primary'
                  : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100'
              }`}
            >
              {t('nav.home')}
            </Link>
            <Link
              to="/products"
              onClick={() => setMobileMenuOpen(false)}
              className={`block rounded-xl px-4 py-2.5 text-base font-semibold transition-colors ${
                location.pathname === '/products'
                  ? 'bg-primary/10 text-primary'
                  : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100'
              }`}
            >
              {t('nav.products')}
            </Link>
            <Link
              to="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className={`block rounded-xl px-4 py-2.5 text-base font-semibold transition-colors ${
                location.pathname === '/contact'
                  ? 'bg-primary/10 text-primary'
                  : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100'
              }`}
            >
              {t('nav.contact')}
            </Link>
            <div className="flex items-center justify-between border-t border-zinc-900 pt-4 mt-2 px-4">
              <span className="text-sm font-medium text-zinc-400">اللغة / Language</span>
              <LanguageSwitcher />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

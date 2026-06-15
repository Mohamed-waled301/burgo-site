import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ShoppingCart, Menu, X, ShieldAlert } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../store/useAuthStore';
import { LanguageSwitcher } from './LanguageSwitcher';

export const Navbar: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const getCartCount = useCartStore((state) => state.getCartCount);
  const toggleCart = useCartStore((state) => state.toggleCart);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  
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

  const scrollToFooter = (e: React.MouseEvent) => {
    e.preventDefault();
    const footer = document.getElementById('footer');
    if (footer) {
      footer.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };


  return (
    <nav className="sticky top-0 z-50 bg-dark text-white border-b border-gray-800 shadow-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 font-display text-xl font-bold tracking-tight text-white transition hover:opacity-90">
              <span className="text-2xl">🍔</span>
              <span>{t('brandName')}</span>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                location.pathname === '/' ? 'text-primary' : 'text-gray-300'
              }`}
            >
              {t('nav.home')}
            </Link>
            <Link
              to="/products"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                location.pathname === '/products' ? 'text-primary' : 'text-gray-300'
              }`}
            >
              {t('nav.products')}
            </Link>
            <a
              href="#footer"
              onClick={scrollToFooter}
              className="text-sm font-medium text-gray-300 transition-colors hover:text-primary"
            >
              {t('nav.contact')}
            </a>
            {isAuthenticated && (
              <Link
                to="/admin/dashboard"
                className="flex items-center gap-1 text-sm font-semibold text-accent transition-colors hover:text-accent/80"
              >
                <ShieldAlert className="h-4 w-4" />
                {t('nav.admin')}
              </Link>
            )}
          </div>

          {/* Cart & Switcher & Mobile Menu Button */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:block">
              <LanguageSwitcher />
            </div>

            {/* Cart Button */}
            <button
              onClick={toggleCart}
              className="relative rounded-full p-2 text-gray-300 hover:bg-gray-800 hover:text-white transition-all focus:outline-none"
              aria-label="Open Cart"
            >
              <ShoppingCart className="h-6 w-6" />
              {cartCount > 0 && (
                <span
                  className={`absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white ${
                    badgeBump ? 'animate-cart-bounce' : ''
                  }`}
                >
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-full p-2 text-gray-300 hover:bg-gray-800 hover:text-white md:hidden"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-800 bg-dark px-4 py-3 space-y-3">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className={`block rounded-md px-3 py-2 text-base font-medium transition-colors ${
              location.pathname === '/' ? 'bg-gray-800 text-primary' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
            }`}
          >
            {t('nav.home')}
          </Link>
          <Link
            to="/products"
            onClick={() => setMobileMenuOpen(false)}
            className={`block rounded-md px-3 py-2 text-base font-medium transition-colors ${
              location.pathname === '/products' ? 'bg-gray-800 text-primary' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
            }`}
          >
            {t('nav.products')}
          </Link>
          <a
            href="#footer"
            onClick={scrollToFooter}
            className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-800 hover:text-white"
          >
            {t('nav.contact')}
          </a>
          {isAuthenticated && (
            <Link
              to="/admin/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="block rounded-md px-3 py-2 text-base font-semibold text-accent hover:bg-gray-800"
            >
              {t('nav.admin')}
            </Link>
          )}
          <div className="flex items-center justify-between border-t border-gray-800 pt-3 px-3">
            <span className="text-sm text-gray-400">اللغة / Language</span>
            <LanguageSwitcher />
          </div>
        </div>
      )}
    </nav>
  );
};

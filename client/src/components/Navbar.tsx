import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ShoppingCart, Menu, X, LogOut, PackageSearch, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '../store/useCartStore';
import { useCustomerAuthStore } from '../store/useCustomerAuthStore';
import { useAuthModalStore } from '../store/useAuthModalStore';
import { LanguageSwitcher } from './LanguageSwitcher';

export const Navbar: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const location = useLocation();
  const getCartCount = useCartStore((state) => state.getCartCount);
  const toggleCart = useCartStore((state) => state.toggleCart);
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [badgeBump, setBadgeBump] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  
  const cartCount = getCartCount();
  const { user, isAuthenticated, logout } = useCustomerAuthStore();
  const openAuthModal = useAuthModalStore((s) => s.open);

  // Bump cart animation when count changes
  useEffect(() => {
    if (cartCount === 0) return;
    setBadgeBump(true);
    const timer = setTimeout(() => setBadgeBump(false), 300);
    return () => clearTimeout(timer);
  }, [cartCount]);

  // Close user menu on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Initials for avatar
  const initials = user?.fullName
    ? user.fullName.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
    : '?';

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
            <Link
              to="/my-orders"
              className={`text-sm font-semibold transition-colors hover:text-primary relative py-1 ${
                location.pathname === '/my-orders' ? 'text-primary' : 'text-zinc-400'
              }`}
            >
              {t('nav.myOrders')}
              {location.pathname === '/my-orders' && (
                <motion.div
                  layoutId="navUnderline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </Link>
          </div>

          {/* Controls & Cart */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden sm:block">
              <LanguageSwitcher />
            </div>

            {/* Customer User Chip (desktop) */}
            {isAuthenticated && user ? (
              <div className="relative hidden sm:block" ref={userMenuRef}>
                <button
                  id="user-menu-btn"
                  onClick={() => setUserMenuOpen((v) => !v)}
                  className="flex items-center gap-2 rounded-xl px-2.5 py-1.5 bg-zinc-900 border border-zinc-800 hover:border-primary/40 transition-all cursor-pointer"
                >
                  <div className="h-7 w-7 rounded-lg bg-primary flex items-center justify-center text-[10px] font-black text-white shadow">
                    {initials}
                  </div>
                  <span className="text-xs font-bold text-zinc-300 max-w-[80px] truncate">
                    {user.fullName.split(' ')[0]}
                  </span>
                  <ChevronDown className={`h-3.5 w-3.5 text-zinc-500 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                      className={`absolute top-full mt-2 w-48 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden z-50 ${isRTL ? 'left-0' : 'right-0'}`}
                    >
                      <div className="px-4 py-3 border-b border-zinc-800">
                        <p className="text-xs text-zinc-500 font-medium">
                          {isRTL ? 'مرحباً' : 'Signed in as'}
                        </p>
                        <p className="text-sm font-black text-white truncate mt-0.5">{user.fullName}</p>
                      </div>
                      <Link
                        to="/my-orders"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-3 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white transition"
                      >
                        <PackageSearch className="h-4 w-4 text-primary" />
                        {isRTL ? 'طلباتي' : 'My Orders'}
                      </Link>
                      <button
                        id="sign-out-btn"
                        onClick={() => { logout(); setUserMenuOpen(false); }}
                        className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-red-400 hover:bg-zinc-800 hover:text-red-300 transition cursor-pointer border-0 bg-transparent border-t border-zinc-800"
                      >
                        <LogOut className="h-4 w-4" />
                        {isRTL ? 'تسجيل الخروج' : 'Sign Out'}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button
                id="nav-signin-btn"
                onClick={openAuthModal}
                className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-zinc-500 hover:text-primary transition cursor-pointer border-0 bg-transparent"
              >
                {isRTL ? 'تسجيل الدخول' : 'Sign In'}
              </button>
            )}

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
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
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
            <Link to="/" onClick={() => setMobileMenuOpen(false)} className={`block rounded-xl px-4 py-2.5 text-base font-semibold transition-colors ${location.pathname === '/' ? 'bg-primary/10 text-primary' : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100'}`}>
              {t('nav.home')}
            </Link>
            <Link to="/products" onClick={() => setMobileMenuOpen(false)} className={`block rounded-xl px-4 py-2.5 text-base font-semibold transition-colors ${location.pathname === '/products' ? 'bg-primary/10 text-primary' : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100'}`}>
              {t('nav.products')}
            </Link>
            <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className={`block rounded-xl px-4 py-2.5 text-base font-semibold transition-colors ${location.pathname === '/contact' ? 'bg-primary/10 text-primary' : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100'}`}>
              {t('nav.contact')}
            </Link>
            <Link to="/my-orders" onClick={() => setMobileMenuOpen(false)} className={`block rounded-xl px-4 py-2.5 text-base font-semibold transition-colors ${location.pathname === '/my-orders' ? 'bg-primary/10 text-primary' : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100'}`}>
              {t('nav.myOrders')}
            </Link>

            {isAuthenticated && user ? (
              <div className="border-t border-zinc-900 pt-3 mt-2 space-y-2">
                <div className="flex items-center gap-3 px-4 py-2">
                  <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-xs font-black text-white">
                    {initials}
                  </div>
                  <div>
                    <p className="text-sm font-black text-white">{user.fullName}</p>
                    <p className="text-[10px] text-zinc-500">@{user.username}</p>
                  </div>
                </div>
                <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="w-full flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-red-400 hover:bg-zinc-900 transition cursor-pointer border-0 bg-transparent">
                  <LogOut className="h-4 w-4" />
                  {isRTL ? 'تسجيل الخروج' : 'Sign Out'}
                </button>
              </div>
            ) : (
              <div className="border-t border-zinc-900 pt-3 mt-2">
                <button onClick={() => { openAuthModal(); setMobileMenuOpen(false); }} className="w-full flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold bg-primary/10 text-primary hover:bg-primary/20 transition cursor-pointer border-0">
                  {isRTL ? 'تسجيل الدخول / إنشاء حساب' : 'Sign In / Sign Up'}
                </button>
              </div>
            )}

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

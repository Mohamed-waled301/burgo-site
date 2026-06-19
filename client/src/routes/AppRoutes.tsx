import { useEffect } from 'react';
import { Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../store/useAuthStore';
import { useLanguageStore } from '../store/useLanguageStore';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { CartDrawer } from '../components/CartDrawer';
import { AuthModal } from '../components/AuthModal';

// Lazy loading/direct imports of page views
import { Home } from '../pages/Home';
import { Products } from '../pages/Products';
import { Contact } from '../pages/Contact';
import { Checkout } from '../pages/Checkout';
import { PaymentSimulator } from '../pages/PaymentSimulator';
import { OrderSuccess } from '../pages/OrderSuccess';
import { MyOrders } from '../pages/MyOrders';
import { Login as AdminLogin } from '../pages/admin/Login';
import { AdminLayout } from '../layouts/AdminLayout';
import { Dashboard as AdminDashboard } from '../pages/admin/Dashboard';
import { Products as AdminProducts } from '../pages/admin/Products';
import { Orders as AdminOrders } from '../pages/admin/Orders';
import { Analytics as AdminAnalytics } from '../pages/admin/Analytics';

// Router Wrapper for Public Pages
const PublicLayout: React.FC = () => {
  const location = useLocation();
  const { i18n } = useTranslation();
  const { language } = useLanguageStore();
  const isRTL = i18n.language === 'ar';
  const hasReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language, location.pathname, i18n]);

  return (
    <div className="min-h-screen flex flex-col bg-background text-charcoal transition-colors duration-300" dir={isRTL ? 'rtl' : 'ltr'}>
      <Navbar />
      <main className="flex-1 flex flex-col relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={hasReducedMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
            animate={hasReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
            exit={hasReducedMotion ? { opacity: 1 } : { opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: [0.25, 1, 0.5, 1] }}
            className="flex-1 flex flex-col w-full"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
      <CartDrawer />
      {/* Global AuthModal — triggered by useAuthModalStore from anywhere */}
      <AuthModal />
      <Footer />
    </div>
  );
};

// Router Guard to check Admin session
const ProtectedAdminRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated ? children : <Navigate to="/admin/login" replace />;
};

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Customer / Public Routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/checkout/payment-simulator" element={<PaymentSimulator />} />
        <Route path="/checkout/success" element={<OrderSuccess />} />
        <Route path="/my-orders" element={<MyOrders />} />
      </Route>

      {/* Admin Login Gateway (Standalone) */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Admin Panel (Protected) */}
      <Route
        path="/admin"
        element={
          <ProtectedAdminRoute>
            <AdminLayout />
          </ProtectedAdminRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="analytics" element={<AdminAnalytics />} />
      </Route>

      {/* 404 Fallback redirects to Home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

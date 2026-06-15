import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { CartDrawer } from '../components/CartDrawer';

// Lazy loading/direct imports of page views
import { Home } from '../pages/Home';
import { Products } from '../pages/Products';
import { Checkout } from '../pages/Checkout';
import { PaymentSimulator } from '../pages/PaymentSimulator';
import { OrderSuccess } from '../pages/OrderSuccess';
import { Login as AdminLogin } from '../pages/admin/Login';
import { AdminLayout } from '../layouts/AdminLayout';
import { Dashboard as AdminDashboard } from '../pages/admin/Dashboard';
import { Products as AdminProducts } from '../pages/admin/Products';
import { Orders as AdminOrders } from '../pages/admin/Orders';
import { Analytics as AdminAnalytics } from '../pages/admin/Analytics';

// Router Wrapper for Public Pages
const PublicLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <Navbar />
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>
      <CartDrawer />
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
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/checkout/payment-simulator" element={<PaymentSimulator />} />
        <Route path="/checkout/success" element={<OrderSuccess />} />
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

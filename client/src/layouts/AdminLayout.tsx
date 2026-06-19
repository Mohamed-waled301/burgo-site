import React, { useEffect, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { LogOut, LayoutDashboard, Utensils, ClipboardList, TrendingUp } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useOrderStore } from '../store/useOrderStore';
import { LanguageSwitcher } from '../components/LanguageSwitcher';
import { useLanguageStore } from '../store/useLanguageStore';
import api from '../services/api';

interface StatsSummary {
  totalOrders: number;
  pendingOrders: number;
  revenue: number;
}

export const AdminLayout: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const navigate = useNavigate();
  const location = useLocation();
  
  const logout = useAuthStore((state) => state.logout);
  const checkNewOrderFlag = useOrderStore((state) => state.checkNewOrderFlag);
  const clearNewOrderFlag = useOrderStore((state) => state.clearNewOrderFlag);
  const { adminLanguage } = useLanguageStore();

  useEffect(() => {
    i18n.changeLanguage(adminLanguage);
  }, [adminLanguage, i18n]);

  const [stats, setStats] = useState<StatsSummary>({ totalOrders: 0, pendingOrders: 0, revenue: 0 });
  const [flashBadge, setFlashBadge] = useState(false);

  // Fetch quick stats on load
  const fetchQuickStats = async () => {
    try {
      const res = await api.get('/analytics');
      setStats({
        totalOrders: res.data.totalOrders,
        pendingOrders: res.data.pendingOrders,
        revenue: res.data.revenue
      });
    } catch (err) {
      console.error('Error fetching admin summary stats:', err);
    }
  };

  useEffect(() => {
    fetchQuickStats();
    // Refresh quick stats every 15 seconds
    const interval = setInterval(fetchQuickStats, 15000);
    return () => clearInterval(interval);
  }, []);

  // Web Audio API beep generator
  const triggerNotificationSound = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, audioCtx.currentTime); // High-pitched clean chime
      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.3); // 300ms beep duration
    } catch (e) {
      console.warn('Audio Context beep play blocked by browser policies.', e);
    }
  };

  // 5-second polling for new orders
  useEffect(() => {
    const pollInterval = setInterval(async () => {
      const status = await checkNewOrderFlag();
      if (status.hasNew) {
        // Trigger visual and auditory alerts
        triggerNotificationSound();
        setFlashBadge(true);
        
        const orderId = status.orderId || 'XXXXX';
        const msg = t('admin.orders.newOrderToast');
        
        toast.warning(`${msg} ${orderId}`, {
          duration: 6000,
        });

        // Reset flash badge after 10 seconds
        setTimeout(() => setFlashBadge(false), 10000);

        // Instantly reload stats & orders
        fetchQuickStats();
        
        // Acknowledge/clear the flag on the server
        await clearNewOrderFlag();
      }
    }, 5000);

    return () => clearInterval(pollInterval);
  }, [checkNewOrderFlag, clearNewOrderFlag, t]);

  const handleLogout = () => {
    logout();
    navigate('/');
    toast.success(isRTL ? 'تم تسجيل الخروج بنجاح' : 'Logged out successfully');
  };

  const menuItems = [
    { path: '/admin/dashboard', label: t('admin.nav.dashboard'), icon: LayoutDashboard },
    { path: '/admin/products', label: t('admin.nav.products'), icon: Utensils },
    { path: '/admin/orders', label: t('admin.nav.orders'), icon: ClipboardList, badge: flashBadge },
    { path: '/admin/analytics', label: isRTL ? 'التقارير التفصيلية' : 'Detailed Reports', icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-950 text-gray-100">
      {/* Top Navbar */}
      <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-40 shadow-lg px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4 flex-wrap sm:flex-nowrap">
          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-lg text-white">
              {t('admin.nav.title')}
            </span>
          </div>

          {/* Stats bar */}
          <div className="flex items-center gap-3 md:gap-6 text-xs md:text-sm font-semibold select-none flex-wrap">
            <div className="bg-gray-800 px-3 py-1.5 rounded-lg border border-gray-700">
              <span className="text-gray-400">{t('admin.dashboard.totalOrders')}: </span>
              <span className="text-white font-price">{stats.totalOrders}</span>
            </div>
            <div className="bg-gray-800 px-3 py-1.5 rounded-lg border border-gray-700">
              <span className="text-gray-400">{t('admin.dashboard.pendingOrders')}: </span>
              <span className="text-accent font-price">{stats.pendingOrders}</span>
            </div>
            <div className="bg-gray-800 px-3 py-1.5 rounded-lg border border-gray-700">
              <span className="text-gray-400">{t('admin.dashboard.revenue')}: </span>
              <span className="text-primary font-price">{stats.revenue} {t('products.currency')}</span>
            </div>
          </div>

          {/* Logout & Lang */}
          <div className="flex items-center gap-3">
            <LanguageSwitcher isAdmin={true} />
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 text-xs md:text-sm text-red-400 hover:text-red-300 font-bold bg-red-950/30 hover:bg-red-950/50 px-3 py-1.5 rounded-lg border border-red-900/40 transition"
            >
              <LogOut className="h-4 w-4" />
              <span>{t('admin.nav.logout')}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container Layout */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 sm:px-6 lg:px-8 flex flex-col md:flex-row gap-6">
        {/* Navigation Tabs List */}
        <aside className="w-full md:w-64 shrink-0 flex md:flex-col gap-1 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0 scrollbar-none border-b md:border-b-0 md:border-inline-end border-gray-800">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl transition-all shrink-0 md:shrink ${
                  isActive
                    ? 'bg-primary text-white shadow-lg shadow-primary/20'
                    : 'text-gray-400 hover:bg-gray-900 hover:text-gray-200'
                } ${item.badge ? 'ring-2 ring-accent ring-offset-2 ring-offset-gray-950 animate-pulse' : ''}`}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
                {item.badge && (
                  <span className="h-2.5 w-2.5 rounded-full bg-accent animate-ping" />
                )}
              </Link>
            );
          })}
        </aside>

        {/* Content Outlet */}
        <main className="flex-1 min-w-0 bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-inner">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

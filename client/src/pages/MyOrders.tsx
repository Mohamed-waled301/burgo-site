import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ClipboardList, ChefHat, Truck, CheckCircle2, Search, ShoppingBag, Calendar, CreditCard, Wallet, CircleDollarSign } from 'lucide-react';
import api from '../services/api';

interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface Order {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  governorate: string;
  notes: string;
  items: OrderItem[];
  total: number;
  paymentMethod: 'card' | 'wallet' | 'cod';
  status: 'pending' | 'preparing' | 'shipping' | 'delivered' | 'cancelled';
  createdAt: string;
}

export const MyOrders: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isRTL = i18n.language === 'ar';

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchId, setSearchId] = useState('');
  const [searchError, setSearchError] = useState<string | null>(null);

  const fetchOrdersFromLocal = async () => {
    setLoading(true);
    setSearchError(null);
    try {
      const storedIdsRaw = localStorage.getItem('bb_placed_order_ids');
      const ids: string[] = storedIdsRaw ? JSON.parse(storedIdsRaw) : [];

      if (ids.length === 0) {
        setOrders([]);
        setLoading(false);
        return;
      }

      const requests = ids.map(id => api.get<Order>(`/orders/${id}`).catch(() => null));
      const responses = await Promise.all(requests);
      const fetchedOrders = responses
        .map(res => res?.data)
        .filter((o): o is Order => !!o)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      setOrders(fetchedOrders);
    } catch (err) {
      console.error('Failed to load orders list', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrdersFromLocal();

    // Poll status updates every 10 seconds for active orders
    const interval = setInterval(() => {
      fetchOrdersFromLocal();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchId.trim()) return;

    setSearchError(null);
    try {
      const trimmedId = searchId.trim().replace('#', '');
      const res = await api.get<Order>(`/orders/${trimmedId}`);
      
      if (res.data) {
        // Save the found ID to local list
        const storedIdsRaw = localStorage.getItem('bb_placed_order_ids');
        const ids: string[] = storedIdsRaw ? JSON.parse(storedIdsRaw) : [];
        if (!ids.includes(trimmedId)) {
          ids.push(trimmedId);
          localStorage.setItem('bb_placed_order_ids', JSON.stringify(ids));
        }
        setSearchId('');
        fetchOrdersFromLocal();
      }
    } catch (err) {
      setSearchError(t('myOrders.noOrders'));
    }
  };

  const getPaymentIcon = (method: Order['paymentMethod']) => {
    switch (method) {
      case 'card': return <CreditCard className="h-4 w-4" />;
      case 'wallet': return <Wallet className="h-4 w-4" />;
      case 'cod': return <CircleDollarSign className="h-4 w-4" />;
    }
  };

  const getPaymentLabel = (method: Order['paymentMethod']) => {
    switch (method) {
      case 'card': return t('checkout.payCard');
      case 'wallet': return t('checkout.payWallet');
      case 'cod': return t('checkout.payCod');
    }
  };

  const steps = [
    { key: 'pending', icon: ClipboardList, label: t('success.steps.pending') },
    { key: 'preparing', icon: ChefHat, label: t('success.steps.preparing') },
    { key: 'shipping', icon: Truck, label: t('success.steps.shipping') },
    { key: 'delivered', icon: CheckCircle2, label: t('success.steps.delivered') },
  ];

  const statusStages = ['pending', 'preparing', 'shipping', 'delivered'];

  return (
    <div className="flex-1 w-full bg-zinc-950 flex flex-col items-center py-16 px-4 relative select-none" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Background radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full filter blur-[120px] pointer-events-none z-0" />

      <div className="w-full max-w-4xl space-y-8 relative z-10">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <span className="inline-flex items-center gap-1.5 text-primary text-xs font-black tracking-widest uppercase bg-primary/10 border border-primary/20 rounded-full px-3 py-1 animate-pulse-glow">
            <ShoppingBag className="h-3.5 w-3.5" />
            {isRTL ? 'تتبع فوري لطلباتك' : 'Live Order Tracking'}
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-white font-display">
            {t('myOrders.title')}
          </h1>
          <p className="text-zinc-450 text-sm font-medium leading-relaxed max-w-md mx-auto">
            {t('myOrders.subtitle')}
          </p>
        </div>

        {/* Lookup Search Bar */}
        <form onSubmit={handleSearchSubmit} className="max-w-md mx-auto relative flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute top-1/2 left-4 -translate-y-1/2 h-5 w-5 text-zinc-500" />
            <input
              type="text"
              placeholder={t('myOrders.searchPlaceholder')}
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              className={`w-full rounded-2xl border px-4 py-3 pl-12 text-sm bg-zinc-900 text-white focus:outline-none focus:ring-2 transition duration-200 ${
                searchError 
                  ? 'border-red-500/50 focus:ring-red-500/20' 
                  : 'border-zinc-800 focus:border-primary focus:ring-primary/20'
              }`}
            />
          </div>
          <button
            type="submit"
            className="h-12 rounded-2xl bg-primary hover:bg-primary-hover text-white text-xs font-black px-6 transition duration-250 cursor-pointer border-0 shadow-md shadow-primary/20 shrink-0"
          >
            {t('myOrders.searchBtn')}
          </button>
        </form>

        {searchError && (
          <p className="text-center text-xs text-red-500 font-bold animate-badge-pop">{searchError}</p>
        )}

        {/* Orders list container */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="h-12 w-12 rounded-full border-4 border-zinc-800 border-t-primary animate-spinner" />
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-16 bg-zinc-900/40 border border-zinc-850 rounded-3xl p-8 max-w-xl mx-auto space-y-6">
            <ShoppingBag className="h-16 w-16 text-zinc-700 mx-auto animate-pulse" />
            <div>
              <p className="text-zinc-400 font-bold text-base">{t('myOrders.emptyList')}</p>
              <p className="text-zinc-550 text-xs mt-2 leading-relaxed">{t('myOrders.viewOnHomepage')}</p>
            </div>
            <button
              onClick={() => navigate('/products')}
              className="h-12 rounded-xl bg-primary hover:bg-primary-hover text-white px-8 text-xs font-black transition-all cursor-pointer border-0 shadow-md shadow-primary/10"
            >
              {t('hero.cta')}
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {orders.map((order) => {
              const activeIndex = statusStages.indexOf(order.status);
              const isCancelled = order.status === 'cancelled';
              
              return (
                <div 
                  key={order.id}
                  className="bg-zinc-900 border border-zinc-850 rounded-[28px] overflow-hidden shadow-xl"
                >
                  {/* Order header banner */}
                  <div className="bg-zinc-950/60 border-b border-zinc-850/80 p-5 sm:p-6 flex flex-col sm:flex-row justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="text-start">
                        <span className="text-[10px] text-zinc-500 font-black block uppercase tracking-wider mb-0.5">Order ID</span>
                        <span className="text-lg font-black font-mono text-primary">#{order.id}</span>
                      </div>
                      <div className="h-8 w-px bg-zinc-800 hidden sm:block" />
                      <div className="text-start">
                        <span className="text-[10px] text-zinc-500 font-black block uppercase tracking-wider mb-0.5">{t('myOrders.date')}</span>
                        <span className="text-xs font-bold text-zinc-350 flex items-center gap-1.5 font-price">
                          <Calendar className="h-3.5 w-3.5 text-zinc-500" />
                          {new Date(order.createdAt).toLocaleDateString(isRTL ? 'ar-EG' : 'en-US')}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 self-end sm:self-center">
                      <div className="text-start sm:text-end">
                        <span className="text-[10px] text-zinc-500 font-black block uppercase tracking-wider mb-0.5">{t('myOrders.total')}</span>
                        <span className="text-base font-black text-white font-price">{order.total} {t('products.currency')}</span>
                      </div>
                      <div className="h-8 w-px bg-zinc-800" />
                      <div className="text-start sm:text-end">
                        <span className="text-[10px] text-zinc-500 font-black block uppercase tracking-wider mb-0.5">{isRTL ? 'الدفع' : 'Payment'}</span>
                        <span className="text-xs font-bold text-zinc-350 flex items-center gap-1.5">
                          {getPaymentIcon(order.paymentMethod)}
                          {getPaymentLabel(order.paymentMethod)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Stepper Timeline content */}
                  {!isCancelled ? (
                    <div className="p-6 border-b border-zinc-850/50 bg-zinc-950/20">
                      {/* Horizontal Desktop stepper */}
                      <div className="hidden sm:flex items-center justify-between relative w-full px-4 mb-2">
                        {/* Connecting Line */}
                        <div className="absolute top-6 left-10 right-10 h-0.5 bg-zinc-800 -translate-y-1/2 z-0 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-primary"
                            initial={{ width: '0%' }}
                            animate={{
                              width: activeIndex >= 0 ? `${(activeIndex / (steps.length - 1)) * 100}%` : '0%',
                            }}
                            transition={{ duration: 0.8, ease: 'easeInOut' }}
                          />
                        </div>

                        {steps.map((step, idx) => {
                          const Icon = step.icon;
                          const isCompleted = idx < activeIndex;
                          const isActive = idx === activeIndex;

                          return (
                            <div key={step.key} className="flex flex-col items-center relative z-10 w-24">
                              <motion.div
                                className={`h-11 w-11 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                                  isCompleted
                                    ? 'bg-primary border-primary text-white shadow-md shadow-primary/20'
                                    : isActive
                                    ? 'bg-zinc-900 border-primary text-primary shadow-lg shadow-primary/35'
                                    : 'bg-zinc-950 border-zinc-850 text-zinc-700'
                                }`}
                                animate={isActive ? { scale: [1, 1.05, 1] } : {}}
                                transition={isActive ? { repeat: Infinity, duration: 2.2 } : {}}
                              >
                                <Icon className="h-4.5 w-4.5" />
                              </motion.div>
                              <span
                                className={`mt-2.5 text-[10px] font-black tracking-tight whitespace-nowrap ${
                                  isCompleted || isActive ? 'text-white' : 'text-zinc-650'
                                }`}
                              >
                                {step.label}
                              </span>
                            </div>
                          );
                        })}
                      </div>

                      {/* Vertical Mobile stepper */}
                      <div className="flex sm:hidden flex-col items-start space-y-6 relative pl-6 pr-6 w-full text-start py-2">
                        <div className={`absolute top-4 bottom-4 w-0.5 bg-zinc-800 z-0 rounded-full overflow-hidden ${isRTL ? 'right-[33px]' : 'left-[33px]'}`}>
                          <motion.div
                            className="w-full bg-primary origin-top"
                            initial={{ height: '0%' }}
                            animate={{
                              height: activeIndex >= 0 ? `${(activeIndex / (steps.length - 1)) * 100}%` : '0%',
                            }}
                            transition={{ duration: 0.8, ease: 'easeInOut' }}
                            style={{ transformOrigin: 'top' }}
                          />
                        </div>

                        {steps.map((step, idx) => {
                          const Icon = step.icon;
                          const isCompleted = idx < activeIndex;
                          const isActive = idx === activeIndex;

                          return (
                            <div
                              key={step.key}
                              className={`flex items-center gap-4 relative z-10 w-full ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}
                            >
                              <motion.div
                                className={`h-9 w-9 rounded-full border flex items-center justify-center shrink-0 transition-all duration-300 ${
                                  isCompleted
                                    ? 'bg-primary border-primary text-white'
                                    : isActive
                                    ? 'bg-zinc-900 border-primary text-primary shadow-lg shadow-primary/35'
                                    : 'bg-zinc-950 border-zinc-850 text-zinc-700'
                                }`}
                              >
                                <Icon className="h-4 w-4" />
                              </motion.div>
                              <div className="flex flex-col">
                                <span className={`text-xs font-bold ${isCompleted || isActive ? 'text-white' : 'text-zinc-550'}`}>
                                  {step.label}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="p-5 border-b border-zinc-850/50 bg-red-950/10 text-start flex items-center gap-3 text-red-400 text-xs">
                      <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse shrink-0" />
                      <span className="font-bold">{isRTL ? 'الطلب ملغي' : 'Order Cancelled'}</span>
                    </div>
                  )}

                  {/* Items list summary */}
                  <div className="p-5 sm:p-6 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {order.items.map((item, i) => (
                        <div key={i} className="flex items-center gap-3 bg-zinc-950/30 border border-zinc-850/50 rounded-2xl p-3">
                          <div className="h-10 w-10 bg-zinc-950 border border-zinc-850 rounded-xl overflow-hidden shrink-0 flex items-center justify-center select-none text-xl">
                            {item.image && (item.image.startsWith('/') || item.image.startsWith('http')) ? (
                              <img src={item.image} alt={item.name} className="w-full h-full object-contain p-1" />
                            ) : (
                              item.image || '🍔'
                            )}
                          </div>
                          <div className="text-start">
                            <span className="text-xs font-bold text-white block leading-snug">{item.name}</span>
                            <span className="text-[10px] text-zinc-500 font-bold block font-price mt-0.5">{item.quantity} × {item.price} {t('products.currency')}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ClipboardList, ChefHat, Truck, CheckCircle2, AlertCircle } from 'lucide-react';
import api from '../services/api';

export const OrderSuccess: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('order_id') || '00000';
  const isRTL = i18n.language === 'ar';

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId || orderId === '00000') {
      setLoading(false);
      return;
    }

    let isMounted = true;

    const fetchOrder = async () => {
      try {
        const response = await api.get(`/orders/${orderId}`);
        if (isMounted) {
          setOrder(response.data);
          setLoading(false);
        }
      } catch (err) {
        console.error('Failed to fetch order status', err);
        // Silently fail and stop loading to preserve fallback state
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchOrder();

    // Poll status updates every 5 seconds
    const interval = setInterval(() => {
      fetchOrder();
    }, 5000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [orderId]);

  const steps = [
    { key: 'pending', icon: ClipboardList, label: t('success.steps.pending' as any) },
    { key: 'preparing', icon: ChefHat, label: t('success.steps.preparing' as any) },
    { key: 'shipping', icon: Truck, label: t('success.steps.shipping' as any) },
    { key: 'delivered', icon: CheckCircle2, label: t('success.steps.delivered' as any) },
  ];

  const statusStages = ['pending', 'preparing', 'shipping', 'delivered'];
  const activeStatus = order?.status || 'pending';
  const activeIndex = statusStages.indexOf(activeStatus);
  const isCancelled = order?.status === 'cancelled';

  if (loading) {
    return (
      <div className="flex-1 flex flex-col justify-center items-center py-20 px-4 bg-zinc-950 text-zinc-100">
        <div className="h-12 w-12 rounded-full border-4 border-zinc-800 border-t-primary animate-spinner" />
        <p className="mt-4 text-zinc-400 font-bold text-sm">
          {isRTL ? 'جاري تحميل تفاصيل الطلب...' : 'Loading order details...'}
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col justify-center items-center py-16 px-4 text-center select-none bg-zinc-950 transition-colors duration-300">
      <div className="bg-surface p-8 sm:p-12 rounded-[30px] border border-border/40 shadow-2xl max-w-2xl w-full flex flex-col items-center">
        
        {/* Animated Checkmark SVG */}
        <div className="h-20 w-20 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mb-6">
          <svg className="h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <motion.path
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-black font-display text-white leading-tight">
          {t('success.title')}
        </h1>

        {/* Description message */}
        <p className="mt-3 text-sm text-zinc-450 max-w-md leading-relaxed font-medium">
          {t('success.message')}
        </p>

        {/* Order Number Box */}
        <div className="mt-6 p-4 bg-zinc-950/60 border border-border/40 rounded-2xl w-full flex flex-col sm:flex-row items-center justify-between gap-3 px-6">
          <div className="text-center sm:text-start">
            <span className="text-[10px] text-zinc-500 font-bold uppercase block tracking-wider mb-0.5">
              {t('success.orderNumber')}
            </span>
            <span className="text-2xl font-black font-mono text-primary select-text">
              #{orderId}
            </span>
          </div>
          {order?.customerName && (
            <div className="text-center sm:text-end border-t sm:border-t-0 sm:border-l border-zinc-800 pt-3 sm:pt-0 sm:pl-6">
              <span className="text-[10px] text-zinc-500 font-bold uppercase block tracking-wider mb-0.5">
                {isRTL ? 'اسم العميل' : 'Customer Name'}
              </span>
              <span className="text-sm font-black text-white">
                {order.customerName}
              </span>
            </div>
          )}
        </div>

        {/* Stepper Timeline */}
        {!isCancelled ? (
          <div className="mt-10 w-full border-t border-zinc-850 pt-8">
            <h3 className="text-xs font-black text-zinc-500 mb-8 uppercase tracking-widest">
              {isRTL ? 'حالة تحضير وتوصيل الطلب' : 'Order Progress Status'}
            </h3>
            {/* Desktop Horizontal Stepper */}
            <div className="hidden sm:flex items-center justify-between relative w-full px-4 mb-8">
              {/* Timeline Connector Bar */}
              <div className="absolute top-6 left-10 right-10 h-1 bg-zinc-800 -translate-y-1/2 z-0 rounded-full overflow-hidden">
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
                      className={`h-12 w-12 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                        isCompleted
                          ? 'bg-primary border-primary text-white shadow-lg shadow-primary/25'
                          : isActive
                          ? 'bg-zinc-900 border-primary text-primary shadow-lg shadow-primary/45'
                          : 'bg-zinc-950 border-zinc-850 text-zinc-650'
                      }`}
                      animate={
                        isActive
                          ? {
                              scale: [1, 1.08, 1],
                              boxShadow: [
                                '0 0 0 0px rgba(251, 146, 60, 0.4)',
                                '0 0 0 8px rgba(251, 146, 60, 0)',
                                '0 0 0 0px rgba(251, 146, 60, 0.4)',
                              ],
                            }
                          : {}
                      }
                      transition={
                        isActive
                          ? {
                              repeat: Infinity,
                              duration: 2,
                              ease: 'easeInOut',
                            }
                          : {}
                      }
                    >
                      <Icon className="h-5 w-5" />
                    </motion.div>
                    <span
                      className={`mt-3 text-xs font-black tracking-tight whitespace-nowrap ${
                        isCompleted || isActive ? 'text-white' : 'text-zinc-500'
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Mobile Vertical Stepper */}
            <div className="flex sm:hidden flex-col items-start space-y-8 relative pl-6 pr-6 w-full text-start mb-6">
              {/* Vertical connector line */}
              <div
                className={`absolute top-6 bottom-6 w-1 bg-zinc-800 z-0 rounded-full overflow-hidden ${
                  isRTL ? 'right-12' : 'left-12'
                }`}
              >
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
                    className={`flex items-center gap-6 relative z-10 w-full ${
                      isRTL ? 'flex-row-reverse' : 'flex-row'
                    }`}
                  >
                    <motion.div
                      className={`h-12 w-12 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-300 ${
                        isCompleted
                          ? 'bg-primary border-primary text-white shadow-lg shadow-primary/25'
                          : isActive
                          ? 'bg-zinc-900 border-primary text-primary shadow-lg shadow-primary/45'
                          : 'bg-zinc-950 border-zinc-850 text-zinc-650'
                      }`}
                      animate={
                        isActive
                          ? {
                              scale: [1, 1.08, 1],
                              boxShadow: [
                                '0 0 0 0px rgba(251, 146, 60, 0.4)',
                                '0 0 0 8px rgba(251, 146, 60, 0)',
                                '0 0 0 0px rgba(251, 146, 60, 0.4)',
                              ],
                            }
                          : {}
                      }
                      transition={
                        isActive
                          ? {
                              repeat: Infinity,
                              duration: 2,
                              ease: 'easeInOut',
                            }
                          : {}
                      }
                    >
                      <Icon className="h-5 w-5" />
                    </motion.div>
                    <div className="flex flex-col">
                      <span
                        className={`text-sm font-black ${
                          isCompleted || isActive ? 'text-white' : 'text-zinc-555'
                        }`}
                      >
                        {step.label}
                      </span>
                      {isActive && (
                        <span className="text-[10px] text-primary font-bold uppercase tracking-wider mt-0.5 animate-pulse">
                          {isRTL ? 'جاري الآن' : 'In Progress'}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="mt-8 p-5 bg-red-500/10 border border-red-500/20 rounded-2xl w-full flex items-center gap-4 text-start">
            <div className="h-11 w-11 rounded-xl bg-red-500/20 flex items-center justify-center text-red-500 shrink-0">
              <AlertCircle className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-sm font-black text-white animate-pulse">
                {isRTL ? 'تم إلغاء الطلب' : 'Order Cancelled'}
              </h4>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                {isRTL
                  ? 'عذراً، لقد تم إلغاء هذا الطلب من قبل فريق العمل. يرجى التواصل معنا للاستفسار.'
                  : 'Sorry, this order has been cancelled by the team. Please contact us for more information.'}
              </p>
            </div>
          </div>
        )}

        {/* Return Button */}
        <button
          onClick={() => navigate('/')}
          className="mt-10 w-full h-13 rounded-xl bg-primary hover:bg-primary-hover text-white font-black shadow-lg shadow-primary/20 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer border-0 flex items-center justify-center text-sm"
        >
          {t('success.btnHome')}
        </button>
      </div>
    </div>
  );
};

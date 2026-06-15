import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, AreaChart, Area } from 'recharts';
import { CalendarRange, TrendingUp, ShoppingCart, Landmark } from 'lucide-react';
import api from '../../services/api';

interface AnalyticsData {
  totalOrders: number;
  pendingOrders: number;
  revenue: number;
  averageOrderValue: number;
  topProduct: string;
  chartData: Array<{
    date: string;
    dayAr: string;
    dayEn: string;
    orders: number;
    revenue: number;
  }>;
}

export const Analytics: React.FC = () => {
  const { t } = useTranslation();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAnalytics = async () => {
    try {
      const res = await api.get('/analytics');
      setData(res.data);
    } catch (err) {
      console.error('Failed to load analytics details:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const lang = t('language');

  if (isLoading || !data) {
    return (
      <div className="flex flex-col items-center justify-center py-20 min-h-[400px]">
        <div className="h-10 w-10 rounded-full border-4 border-gray-800 border-t-primary animate-spinner" />
        <p className="mt-4 text-xs text-gray-400 font-semibold">{t('language') === 'en' ? 'Compiling reports...' : 'جاري جمع التقارير...'}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 select-none">
      
      {/* Header */}
      <div className="border-b border-gray-850 pb-4">
        <h2 className="text-xl font-bold font-display text-white">
          {lang === 'en' ? 'Detailed Reports' : 'التقارير التفصيلية'}
        </h2>
        <p className="text-xs text-gray-500 mt-1">
          {lang === 'en' ? 'Weekly analysis of sales distribution, order counts, and averages' : 'تحليلات المبيعات الأسبوعية وحجم الطلبات ومتوسط الفاتورة'}
        </p>
      </div>

      {/* Analytics breakdown columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Chart 1: Revenue Over Time */}
        <div className="bg-gray-950 p-6 rounded-2xl border border-gray-850 space-y-4">
          <div className="flex items-center justify-between border-b border-gray-850 pb-3">
            <span className="text-xs font-bold text-gray-400 flex items-center gap-1.5">
              <Landmark className="h-4 w-4 text-primary" />
              {lang === 'en' ? 'Daily Sales Revenue' : 'إيرادات المبيعات اليومية'}
            </span>
          </div>

          <div className="h-72 w-full" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="revenueGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EA580C" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#EA580C" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" vertical={false} />
                <XAxis dataKey="date" stroke="#6B7280" fontSize={11} tickLine={false} />
                <YAxis stroke="#6B7280" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#1F2937', color: '#fff', borderRadius: '12px' }} />
                <Area type="monotone" dataKey="revenue" name={t('admin.dashboard.chartRevenue')} stroke="#EA580C" strokeWidth={3} fillOpacity={1} fill="url(#revenueGlow)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Order Counts */}
        <div className="bg-gray-950 p-6 rounded-2xl border border-gray-850 space-y-4">
          <div className="flex items-center justify-between border-b border-gray-850 pb-3">
            <span className="text-xs font-bold text-gray-400 flex items-center gap-1.5">
              <ShoppingCart className="h-4 w-4 text-accent" />
              {lang === 'en' ? 'Daily Transactions Volume' : 'حجم المعاملات اليومي'}
            </span>
          </div>

          <div className="h-72 w-full" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" vertical={false} />
                <XAxis dataKey="date" stroke="#6B7280" fontSize={11} tickLine={false} />
                <YAxis stroke="#6B7280" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#1F2937', color: '#fff', borderRadius: '12px' }} />
                <Bar dataKey="orders" name={t('admin.dashboard.chartOrders')} fill="#FBBF24" radius={[6, 6, 0, 0]} maxBarSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Summary insights bar */}
      <div className="p-5 bg-gradient-to-r from-gray-950 to-gray-900 border border-gray-850 rounded-2xl flex items-center justify-between gap-4 flex-wrap sm:flex-nowrap">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
            <TrendingUp className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">{lang === 'en' ? 'Performance Summary' : 'ملخص الكفاءة'}</h4>
            <p className="text-[10px] text-gray-500 mt-0.5">
              {lang === 'en' 
                ? `Top performing menu item is "${data.topProduct}" with standard average checks of ${data.averageOrderValue} EGP.`
                : `المنتج الأكثر مبيعاً هو "${data.topProduct}" بمتوسط فاتورة طلب قيمتها ${data.averageOrderValue} جنيه.`}
            </p>
          </div>
        </div>
        <span className="text-xs font-semibold text-accent flex items-center gap-1 bg-accent/5 px-3 py-1.5 rounded-lg border border-accent/10 whitespace-nowrap shrink-0">
          <CalendarRange className="h-4 w-4" />
          {lang === 'en' ? 'Last 7 Days Analysis' : 'تحليل آخر 7 أيام'}
        </span>
      </div>

    </div>
  );
};

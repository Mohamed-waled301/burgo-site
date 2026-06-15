import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, AreaChart, Area } from 'recharts';
import { ShoppingBag, TrendingUp, Landmark, Award, Calendar } from 'lucide-react';
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

export const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAnalytics = async () => {
    try {
      const res = await api.get('/analytics');
      setData(res.data);
    } catch (err) {
      console.error('Failed to load analytics data:', err);
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
        <p className="mt-4 text-xs text-gray-400 font-semibold">
          {lang === 'en' ? 'Calculating metrics...' : 'جاري حساب المؤشرات...'}
        </p>
      </div>
    );
  }

  const cards = [
    {
      title: t('admin.dashboard.totalOrders'),
      value: data.totalOrders,
      icon: ShoppingBag,
      color: 'text-blue-500 bg-blue-500/10 border-blue-500/20'
    },
    {
      title: t('admin.dashboard.revenue'),
      value: `${data.revenue} ${t('products.currency')}`,
      icon: Landmark,
      color: 'text-primary bg-primary/10 border-primary/20'
    },
    {
      title: t('admin.dashboard.aov'),
      value: `${data.averageOrderValue} ${t('products.currency')}`,
      icon: TrendingUp,
      color: 'text-green-500 bg-green-500/10 border-green-500/20'
    },
    {
      title: t('admin.dashboard.bestSeller'),
      value: data.topProduct,
      icon: Award,
      color: 'text-accent bg-accent/10 border-accent/20'
    }
  ];

  return (
    <div className="space-y-8 select-none">
      
      {/* Page Title */}
      <div>
        <h2 className="text-xl font-bold font-display text-white">
          {lang === 'en' ? 'Quick Overview' : 'نظرة عامة سريعة'}
        </h2>
        <p className="text-xs text-gray-500 mt-1">
          {lang === 'en' ? 'Key performance indexes and daily charts' : 'مؤشرات الأداء الرئيسية والرسوم البيانية اليومية'}
        </p>
      </div>

      {/* Grid of Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div key={i} className="bg-gray-950 p-5 rounded-2xl border border-gray-850 flex items-center justify-between gap-4 shadow-sm hover:border-gray-800 transition">
              <div className="space-y-1.5 flex-1 min-w-0">
                <span className="text-[10px] text-gray-500 font-bold block uppercase tracking-wider">{card.title}</span>
                <span className="text-lg sm:text-xl font-extrabold text-white truncate block font-price">{card.value}</span>
              </div>
              <div className={`h-11 w-11 rounded-xl flex items-center justify-center border shrink-0 ${card.color}`}>
                <Icon className="h-5 w-5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Weekly Area Chart */}
      <div className="bg-gray-950 p-6 rounded-2xl border border-gray-850">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-display font-bold text-sm text-gray-200 flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            <span>{t('admin.dashboard.chartTitle')}</span>
          </h3>
        </div>

        <div className="h-80 w-full" dir="ltr">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F97316" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#F97316" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" vertical={false} />
              <XAxis 
                dataKey={lang === 'en' ? 'dayEn' : 'dayAr'} 
                stroke="#6B7280" 
                fontSize={11}
                tickLine={false}
              />
              <YAxis 
                stroke="#6B7280" 
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#111827', borderColor: '#1F2937', color: '#fff', borderRadius: '12px' }}
                labelStyle={{ fontWeight: 'bold' }}
              />
              <Area 
                type="monotone" 
                dataKey="revenue" 
                name={t('admin.dashboard.chartRevenue')} 
                stroke="#F97316" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorRevenue)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};

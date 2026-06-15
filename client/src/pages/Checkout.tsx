import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { CreditCard, Wallet, CircleDollarSign, AlertCircle } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { useOrderStore } from '../store/useOrderStore';
import api from '../services/api';

const GOVERNORATES_AR = [
  'القاهرة', 'الجيزة', 'الإسكندرية', 'القليوبية', 'الدقهلية', 
  'الشرقية', 'الغربية', 'المنوفية', 'البحيرة', 'دمياط', 
  'بورسعيد', 'السويس', 'الإسماعيلية', 'الفيوم', 'بني سويف', 
  'المنيا', 'أسيوط', 'سوهاج', 'قنا', 'الأقصر', 'أسوان'
];

const GOVERNORATES_EN = [
  'Cairo', 'Giza', 'Alexandria', 'Qalyubia', 'Dakahlia', 
  'Sharqia', 'Gharbia', 'Monufia', 'Beheira', 'Damietta', 
  'Port Said', 'Suez', 'Ismailia', 'Fayoum', 'Beni Suef', 
  'Minya', 'Asyut', 'Sohag', 'Qena', 'Luxor', 'Aswan'
];

export const Checkout: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const { items, getCartTotal, clearCart } = useCartStore();
  const placeOrder = useOrderStore((state) => state.placeOrder);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const totalAmount = getCartTotal();

  // Zod Validation Schema
  const schema = z.object({
    customerName: z.string().min(3, { message: t('checkout.validation.nameRequired') }),
    phone: z.string()
      .min(1, { message: t('checkout.validation.phoneRequired') })
      .regex(/^01[0125][0-9]{8}$/, { message: t('checkout.validation.phoneFormat') }),
    address: z.string().min(5, { message: t('checkout.validation.addressRequired') }),
    governorate: z.string().min(1, { message: t('checkout.validation.governorateRequired') }),
    notes: z.string().optional(),
    paymentMethod: z.enum(['card', 'wallet', 'cod']),
  });

  type FormData = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      customerName: '',
      phone: '',
      address: '',
      governorate: '',
      notes: '',
      paymentMethod: 'cod',
    }
  });

  const selectedPayment = watch('paymentMethod');
  const lang = t('language');

  const onSubmit = async (data: FormData) => {
    if (items.length === 0) return;
    setIsSubmitting(true);
    setCheckoutError(null);

    try {
      // 1. If COD, create order directly on backend and redirect
      if (data.paymentMethod === 'cod') {
        const orderData = {
          customerName: data.customerName,
          phone: data.phone,
          address: data.address,
          governorate: data.governorate,
          notes: data.notes || '',
          paymentMethod: 'cod' as const,
          items: items.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image
          }))
        };

        const res = await placeOrder(orderData);
        clearCart();
        navigate(`/checkout/success?order_id=${res.id}`);
      } else {
        // 2. If card or wallet, initiate Paymob gateway via backend
        // Create order placeholder first to get unique orderId
        const orderPlaceholderData = {
          customerName: data.customerName,
          phone: data.phone,
          address: data.address,
          governorate: data.governorate,
          notes: data.notes || '',
          paymentMethod: data.paymentMethod,
          items: items.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image
          }))
        };

        // Post order details to database first
        const dbOrder = await placeOrder(orderPlaceholderData);

        // Initiate payment request
        const paymentRes = await api.post('/payment/paymob-checkout', {
          orderId: dbOrder.id,
          amount: totalAmount,
          customerInfo: {
            name: data.customerName,
            phone: data.phone,
            address: data.address,
            governorate: data.governorate
          }
        });

        const iframeUrl = paymentRes.data.iframeUrl;

        // Clear cart now as payment details are logged
        clearCart();

        if (paymentRes.data.simulated) {
          // Internal simulation route redirection
          navigate(iframeUrl);
        } else {
          // Real Paymob external redirect
          window.location.href = iframeUrl;
        }
      }
    } catch (err: any) {
      console.error('Checkout error:', err);
      setCheckoutError(err.message || 'حدث خطأ غير متوقع أثناء معالجة الطلب');
    } finally {
      setIsSubmitting(false);
    }
  };

  const governorateList = lang === 'en' ? GOVERNORATES_EN : GOVERNORATES_AR;

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center flex-1 flex flex-col justify-center select-none">
        <span className="text-6xl mb-6">🛒</span>
        <h2 className="text-2xl font-bold font-display text-gray-900">{t('cart.empty')}</h2>
        <button
          onClick={() => navigate('/products')}
          className="mt-6 mx-auto rounded-xl bg-primary hover:bg-primary-hover text-white px-8 py-3 font-semibold shadow transition duration-300"
        >
          {t('hero.cta')}
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl w-full px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-extrabold font-display text-gray-900 mb-8 border-b border-gray-200 pb-4">
        {t('checkout.title')}
      </h1>

      {checkoutError && (
        <div className="mb-6 flex items-center gap-3 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{checkoutError}</span>
        </div>
      )}

      {/* Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Right side - Forms (col span 7) */}
        <form onSubmit={handleSubmit(onSubmit)} className="lg:col-span-7 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <h2 className="text-lg font-bold font-display text-gray-900 border-b border-gray-100 pb-3 mb-2">
              {t('checkout.formTitle')}
            </h2>

            {/* Name input */}
            <div>
              <label htmlFor="customerName" className="block text-xs font-bold text-gray-700 mb-1.5">
                {t('checkout.name')}
              </label>
              <input
                id="customerName"
                type="text"
                placeholder={t('checkout.namePlaceholder')}
                {...register('customerName')}
                className={`w-full rounded-xl border px-4 py-3 text-sm transition duration-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 ${
                  errors.customerName 
                    ? 'border-red-300 focus:ring-red-200' 
                    : 'border-gray-200 focus:border-primary focus:ring-primary/20'
                }`}
              />
              {errors.customerName && (
                <p className="mt-1 text-xs text-red-500 font-semibold">{errors.customerName.message}</p>
              )}
            </div>

            {/* Phone & Governorate layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Phone input */}
              <div>
                <label htmlFor="phone" className="block text-xs font-bold text-gray-700 mb-1.5">
                  {t('checkout.phone')}
                </label>
                {/* LTR alignment for inputs */}
                <input
                  id="phone"
                  type="tel"
                  placeholder={t('checkout.phonePlaceholder')}
                  dir="ltr"
                  {...register('phone')}
                  className={`w-full rounded-xl border px-4 py-3 text-sm transition duration-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 text-start ${
                    errors.phone 
                      ? 'border-red-300 focus:ring-red-200' 
                      : 'border-gray-200 focus:border-primary focus:ring-primary/20'
                  }`}
                />
                {errors.phone && (
                  <p className="mt-1 text-xs text-red-500 font-semibold">{errors.phone.message}</p>
                )}
              </div>

              {/* Governorate selection */}
              <div>
                <label htmlFor="governorate" className="block text-xs font-bold text-gray-700 mb-1.5">
                  {t('checkout.governorate')}
                </label>
                <select
                  id="governorate"
                  {...register('governorate')}
                  className={`w-full rounded-xl border px-4 py-3 text-sm transition duration-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 ${
                    errors.governorate 
                      ? 'border-red-300 focus:ring-red-200' 
                      : 'border-gray-200 focus:border-primary focus:ring-primary/20'
                  }`}
                >
                  <option value="">
                    {lang === 'en' ? 'Select governorate' : 'اختر المحافظة'}
                  </option>
                  {governorateList.map((gov) => (
                    <option key={gov} value={gov}>
                      {gov}
                    </option>
                  ))}
                </select>
                {errors.governorate && (
                  <p className="mt-1 text-xs text-red-500 font-semibold">{errors.governorate.message}</p>
                )}
              </div>
            </div>

            {/* Address Input */}
            <div>
              <label htmlFor="address" className="block text-xs font-bold text-gray-700 mb-1.5">
                {t('checkout.address')}
              </label>
              <input
                id="address"
                type="text"
                placeholder={t('checkout.addressPlaceholder')}
                {...register('address')}
                className={`w-full rounded-xl border px-4 py-3 text-sm transition duration-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 ${
                  errors.address 
                    ? 'border-red-300 focus:ring-red-200' 
                    : 'border-gray-200 focus:border-primary focus:ring-primary/20'
                }`}
              />
              {errors.address && (
                <p className="mt-1 text-xs text-red-500 font-semibold">{errors.address.message}</p>
              )}
            </div>

            {/* Notes input */}
            <div>
              <label htmlFor="notes" className="block text-xs font-bold text-gray-700 mb-1.5">
                {t('checkout.notes')}
              </label>
              <textarea
                id="notes"
                rows={3}
                placeholder={t('checkout.notesPlaceholder')}
                {...register('notes')}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm transition duration-200 bg-gray-50 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none resize-none"
              />
            </div>
          </div>

          {/* Payment Method Cards */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <h2 className="text-lg font-bold font-display text-gray-900 border-b border-gray-100 pb-3 mb-2">
              {t('checkout.paymentMethod')}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Card option */}
              <button
                type="button"
                onClick={() => setValue('paymentMethod', 'card')}
                className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 text-center transition ${
                  selectedPayment === 'card'
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-gray-200 hover:border-gray-300 text-gray-500 bg-white'
                }`}
              >
                <CreditCard className="h-6 w-6 mb-2 shrink-0" />
                <span className="text-sm font-bold block">{lang === 'en' ? 'Credit Card' : 'بطاقة بنكية'}</span>
                <span className="text-[10px] text-gray-400 mt-1 block">Visa/MasterCard</span>
              </button>

              {/* Wallet option */}
              <button
                type="button"
                onClick={() => setValue('paymentMethod', 'wallet')}
                className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 text-center transition ${
                  selectedPayment === 'wallet'
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-gray-200 hover:border-gray-300 text-gray-500 bg-white'
                }`}
              >
                <Wallet className="h-6 w-6 mb-2 shrink-0" />
                <span className="text-sm font-bold block">{lang === 'en' ? 'Mobile Wallet' : 'محفظة إلكترونية'}</span>
                <span className="text-[10px] text-gray-400 mt-1 block">Vodafone Cash</span>
              </button>

              {/* COD option */}
              <button
                type="button"
                onClick={() => setValue('paymentMethod', 'cod')}
                className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 text-center transition ${
                  selectedPayment === 'cod'
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-gray-200 hover:border-gray-300 text-gray-500 bg-white'
                }`}
              >
                <CircleDollarSign className="h-6 w-6 mb-2 shrink-0" />
                <span className="text-sm font-bold block">{lang === 'en' ? 'Cash on Delivery' : 'الدفع عند الاستلام'}</span>
                <span className="text-[10px] text-gray-400 mt-1 block">Cash on Delivery</span>
              </button>
            </div>
          </div>

          {/* Checkout CTA */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex h-14 items-center justify-center rounded-xl bg-primary hover:bg-primary-hover text-base font-bold text-white shadow-lg shadow-primary/20 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
          >
            {isSubmitting ? (
              <div className="h-5 w-5 rounded-full border-2 border-white border-t-transparent animate-spinner" />
            ) : selectedPayment === 'cod' ? (
              t('checkout.btnSubmitCod')
            ) : (
              t('checkout.btnPayNow')
            )}
          </button>
        </form>

        {/* Left side - Order Summary (col span 5) */}
        <aside className="lg:col-span-5 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
          <h2 className="text-lg font-bold font-display text-gray-900 border-b border-gray-100 pb-3">
            {t('checkout.orderSummary')}
          </h2>

          <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto pr-1">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-4 py-3 first:pt-0 last:pb-0">
                <div className="h-12 w-12 rounded-lg bg-cream flex items-center justify-center border border-gray-100 text-2xl shrink-0">
                  {item.image}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-semibold text-gray-900 truncate leading-snug">{item.name}</h4>
                  <p className="mt-1 text-xs text-gray-400 font-price">
                    {item.quantity} × {item.price} {t('products.currency')}
                  </p>
                </div>
                <span className="font-price font-bold text-xs text-gray-900 shrink-0">
                  {item.price * item.quantity} {t('products.currency')}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-100 pt-4 space-y-3">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>{t('language') === 'en' ? 'Subtotal' : 'الإجمالي الفرعي'}</span>
              <span className="font-price font-medium">{totalAmount} {t('products.currency')}</span>
            </div>
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>{t('language') === 'en' ? 'Delivery Fees' : 'رسوم التوصيل'}</span>
              <span className="text-green-600 font-bold">{t('language') === 'en' ? 'FREE' : 'مجاني'}</span>
            </div>
            <div className="flex items-center justify-between text-base font-bold text-gray-900 border-t border-gray-100 pt-3">
              <span>{t('language') === 'en' ? 'Total' : 'الإجمالي الكلي'}</span>
              <span className="font-price text-lg text-primary">{totalAmount} {t('products.currency')}</span>
            </div>
          </div>
        </aside>

      </div>
    </div>
  );
};

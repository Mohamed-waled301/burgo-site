import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { CreditCard, Wallet, CircleDollarSign, AlertCircle, Home } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '../store/useCartStore';
import { useOrderStore } from '../store/useOrderStore';
import { useCustomerAuthStore } from '../store/useCustomerAuthStore';
import { useAuthModalStore } from '../store/useAuthModalStore';
import api from '../services/api';

const GOVERNORATES_AR = [
  'الإسكندرية'
];

const GOVERNORATES_EN = [
  'Alexandria'
];

export const Checkout: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const navigate = useNavigate();
  
  const { items, getCartTotal, clearCart } = useCartStore();
  const placeOrder = useOrderStore((state) => state.placeOrder);
  const { user, isAuthenticated } = useCustomerAuthStore();
  const openAuthModal = useAuthModalStore((s) => s.open);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const totalAmount = getCartTotal();

  // ── Auth guard: if not authenticated, send back and open modal ────────────
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/products', { replace: true });
      openAuthModal();
    }
  }, [isAuthenticated, navigate, openAuthModal]);

  // Zod Validation Schema
  const schema = z.object({
    customerName: z.string().min(3, { message: t('checkout.validation.nameRequired') }),
    phone: z.string()
      .min(1, { message: t('checkout.validation.phoneRequired') })
      .regex(/^01[0125][0-9]{8}$/, { message: t('checkout.validation.phoneFormat') }),
    useDifferentAddress: z.boolean().default(false),
    address: z.string().optional(),
    governorate: z.string().min(1, { message: t('checkout.validation.governorateRequired') }),
    notes: z.string().optional(),
    paymentMethod: z.enum(['card', 'wallet', 'cod']),
  }).refine((data) => {
    if (data.useDifferentAddress || !user?.address) {
      return !!data.address && data.address.trim().length >= 5;
    }
    return true;
  }, {
    message: t('checkout.validation.addressRequired'),
    path: ['address'],
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
      // Pre-fill from saved user profile
      customerName: user?.fullName || '',
      phone: user?.phoneNumber || '',
      useDifferentAddress: !user?.address,
      address: '',
      governorate: isRTL ? 'الإسكندرية' : 'Alexandria',
      notes: '',
      paymentMethod: 'cod',
    }
  });

  const selectedPayment = watch('paymentMethod');
  const useDifferentAddress = watch('useDifferentAddress');
  const governorateList = isRTL ? GOVERNORATES_AR : GOVERNORATES_EN;

  const onSubmit = async (data: FormData) => {
    if (items.length === 0) return;
    setIsSubmitting(true);
    setCheckoutError(null);

    const finalAddress = data.useDifferentAddress ? (data.address || '') : (user?.address || '');

    try {
      // 1. If COD, create order directly on backend and redirect
      if (data.paymentMethod === 'cod') {
        const orderData = {
          customerName: data.customerName,
          phone: data.phone,
          address: finalAddress,
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
        try {
          const existing = localStorage.getItem('bb_placed_order_ids');
          const list = existing ? JSON.parse(existing) : [];
          if (!list.includes(res.id)) {
            list.push(res.id);
            localStorage.setItem('bb_placed_order_ids', JSON.stringify(list));
          }
        } catch (e) {
          console.error('Failed to save order ID to local storage', e);
        }

        // WhatsApp click-to-chat redirection
        const whatsappNumber = '201284838592';
        let message = '';
        if (isRTL) {
          message = `🍔 *طلب جديد من بورجو (Burgo)* 🍔\n` +
            `------------------------------------\n` +
            `*رقم الطلب:* #${res.id}\n` +
            `*العميل:* ${data.customerName}\n` +
            `*رقم الهاتف:* ${data.phone}\n` +
            `*المحافظة:* ${data.governorate}\n` +
            `*العنوان:* ${finalAddress}\n` +
            (data.notes ? `*ملاحظات:* ${data.notes}\n` : '') +
            `------------------------------------\n` +
            `*الطلبات:*\n` +
            items.map(item => `- ${item.name} × ${item.quantity} (${item.price} ج.م)`).join('\n') + '\n' +
            `------------------------------------\n` +
            `*طريقة الدفع:* الدفع عند الاستلام (COD)\n` +
            `*الإجمالي الكلي:* ${res.total} ج.م\n` +
            `------------------------------------\n` +
            `شكراً لاختيارك بورجو! 🍟🥤`;
        } else {
          message = `🍔 *New Order from Burgo* 🍔\n` +
            `------------------------------------\n` +
            `*Order ID:* #${res.id}\n` +
            `*Customer Name:* ${data.customerName}\n` +
            `*Phone Number:* ${data.phone}\n` +
            `*Governorate:* ${data.governorate}\n` +
            `*Delivery Address:* ${finalAddress}\n` +
            (data.notes ? `*Notes:* ${data.notes}\n` : '') +
            `------------------------------------\n` +
            `*Items:*\n` +
            items.map(item => `- ${item.name} x ${item.quantity} (${item.price} EGP)`).join('\n') + '\n' +
            `------------------------------------\n` +
            `*Payment Method:* Cash on Delivery (COD)\n` +
            `*Grand Total:* ${res.total} EGP\n` +
            `------------------------------------\n` +
            `Thank you for choosing Burgo! 🍟🥤`;
        }

        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
        
        clearCart();
        
        try {
          window.open(whatsappUrl, '_blank');
        } catch (e) {
          console.error('Failed to open WhatsApp window', e);
        }

        navigate(`/checkout/success?order_id=${res.id}`);
      } else {
        // 2. If card or wallet, initiate Paymob gateway via backend
        // Create order placeholder first to get unique orderId
        const orderPlaceholderData = {
          customerName: data.customerName,
          phone: data.phone,
          address: finalAddress,
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
        try {
          const existing = localStorage.getItem('bb_placed_order_ids');
          const list = existing ? JSON.parse(existing) : [];
          if (!list.includes(dbOrder.id)) {
            list.push(dbOrder.id);
            localStorage.setItem('bb_placed_order_ids', JSON.stringify(list));
          }
        } catch (e) {
          console.error('Failed to save order ID to local storage', e);
        }

        // Initiate payment request
        const paymentRes = await api.post('/payment/paymob-checkout', {
          orderId: dbOrder.id,
          amount: totalAmount,
          customerInfo: {
            name: data.customerName,
            phone: data.phone,
            address: finalAddress,
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

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center flex-1 flex flex-col justify-center select-none">
        <span className="text-6xl mb-6">🛒</span>
        <h2 className="text-2xl font-bold font-display text-white">{t('cart.empty')}</h2>
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
    <div className="mx-auto max-w-7xl w-full px-4 py-12 sm:px-6 lg:px-8 text-charcoal transition-colors duration-300">
      <h1 className="text-3xl font-black font-display text-charcoal mb-8 border-b border-border/40 pb-4">
        {t('checkout.title')}
      </h1>

      {checkoutError && (
        <div className="mb-6 flex items-center gap-3 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-semibold animate-badge-pop">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{checkoutError}</span>
        </div>
      )}

      {/* Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Right side - Forms (col span 7) */}
        <form onSubmit={handleSubmit(onSubmit)} className="lg:col-span-7 space-y-6">
          <div className="bg-surface p-6 rounded-3xl border border-border/30 shadow-sm space-y-4">
            <h2 className="text-lg font-black font-display text-charcoal border-b border-border/30 pb-3 mb-2">
              {t('checkout.formTitle')}
            </h2>

            {/* Name input */}
            <div>
              <label htmlFor="customerName" className="block text-xs font-bold text-text-muted mb-1.5 uppercase tracking-wide">
                {t('checkout.name')}
              </label>
              <input
                id="customerName"
                type="text"
                placeholder={t('checkout.namePlaceholder')}
                {...register('customerName')}
                className={`w-full rounded-xl border px-4 py-3 text-sm transition duration-200 bg-background text-charcoal focus:bg-surface focus:outline-none focus:ring-2 ${
                  errors.customerName 
                    ? 'border-red-500/50 focus:ring-red-500/20' 
                    : 'border-border/60 focus:border-primary focus:ring-primary/20'
                }`}
              />
              {errors.customerName && (
                <p className="mt-1.5 text-xs text-red-500 font-bold">{errors.customerName.message}</p>
              )}
            </div>

            {/* Phone & Governorate layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Phone input */}
              <div>
                <label htmlFor="phone" className="block text-xs font-bold text-text-muted mb-1.5 uppercase tracking-wide">
                  {t('checkout.phone')}
                </label>
                <input
                  id="phone"
                  type="tel"
                  placeholder={t('checkout.phonePlaceholder')}
                  dir="ltr"
                  {...register('phone')}
                  className={`w-full rounded-xl border px-4 py-3 text-sm transition duration-200 bg-background text-charcoal focus:bg-surface focus:outline-none focus:ring-2 text-start ${
                    errors.phone 
                      ? 'border-red-500/50 focus:ring-red-500/20' 
                      : 'border-border/60 focus:border-primary focus:ring-primary/20'
                  }`}
                />
                {errors.phone && (
                  <p className="mt-1.5 text-xs text-red-500 font-bold">{errors.phone.message}</p>
                )}
              </div>

              {/* Governorate selection */}
              <div>
                <label htmlFor="governorate" className="block text-xs font-bold text-text-muted mb-1.5 uppercase tracking-wide">
                  {t('checkout.governorate')}
                </label>
                <select
                  id="governorate"
                  {...register('governorate')}
                  className={`w-full rounded-xl border px-4 py-3 text-sm transition duration-200 bg-background text-charcoal focus:bg-surface focus:outline-none focus:ring-2 cursor-pointer ${
                    errors.governorate 
                      ? 'border-red-500/50 focus:ring-red-500/20' 
                      : 'border-border/60 focus:border-primary focus:ring-primary/20'
                  }`}
                >
                  <option value="">
                    {isRTL ? 'اختر المحافظة' : 'Select governorate'}
                  </option>
                  {governorateList.map((gov) => (
                    <option key={gov} value={gov} className="bg-surface text-charcoal">
                      {gov}
                    </option>
                  ))}
                </select>
                {errors.governorate && (
                  <p className="mt-1.5 text-xs text-red-500 font-bold">{errors.governorate.message}</p>
                )}
              </div>
            </div>

            {/* Address Section */}
            <div className="space-y-4">
              {/* Checkbox for Different Address */}
              {user?.address && (
                <div className="flex items-center gap-3 p-4 bg-background/50 rounded-2xl border border-border/30 hover:border-border transition duration-200">
                  <input
                    type="checkbox"
                    id="useDifferentAddress"
                    {...register('useDifferentAddress')}
                    className="w-5 h-5 text-primary border-border/60 rounded focus:ring-primary/20 bg-background cursor-pointer accent-primary"
                  />
                  <label htmlFor="useDifferentAddress" className="text-sm font-black text-charcoal cursor-pointer select-none">
                    {isRTL ? 'الشحن إلى عنوان مختلف؟' : 'Ship to a different address?'}
                  </label>
                </div>
              )}

              {/* Saved Address Display Card */}
              {!useDifferentAddress && user?.address && (
                <div className="p-4 bg-primary/5 border border-primary/20 rounded-2xl flex items-start gap-3.5">
                  <div className="p-2.5 bg-primary/10 rounded-xl text-primary shrink-0">
                    <Home className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-primary uppercase tracking-wide">
                      {isRTL ? 'العنوان المحفوظ' : 'Saved Delivery Address'}
                    </h4>
                    <p className="mt-1.5 text-sm font-bold text-charcoal select-text">
                      {user.address}
                    </p>
                    <p className="mt-1 text-[10px] text-text-muted/80">
                      {isRTL ? 'سيتم التوصيل إلى عنوانك المسجل في الملف الشخصي.' : 'Your order will be shipped to your registered profile address.'}
                    </p>
                  </div>
                </div>
              )}

              {/* Custom Address Input (Animated with AnimatePresence) */}
              <AnimatePresence mode="wait">
                {(useDifferentAddress || !user?.address) && (
                  <motion.div
                    key="different-address-input"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4 overflow-hidden"
                  >
                    <div>
                      <label htmlFor="address" className="block text-xs font-bold text-text-muted mb-1.5 uppercase tracking-wide">
                        {t('checkout.address')}
                      </label>
                      <input
                        id="address"
                        type="text"
                        placeholder={t('checkout.addressPlaceholder')}
                        {...register('address')}
                        className={`w-full rounded-xl border px-4 py-3 text-sm transition duration-200 bg-background text-charcoal focus:bg-surface focus:outline-none focus:ring-2 ${
                          errors.address 
                            ? 'border-red-500/50 focus:ring-red-500/20' 
                            : 'border-border/60 focus:border-primary focus:ring-primary/20'
                        }`}
                      />
                      {errors.address && (
                        <p className="mt-1.5 text-xs text-red-500 font-bold">{errors.address.message}</p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Notes input */}
            <div>
              <label htmlFor="notes" className="block text-xs font-bold text-text-muted mb-1.5 uppercase tracking-wide">
                {t('checkout.notes')}
              </label>
              <textarea
                id="notes"
                rows={3}
                placeholder={t('checkout.notesPlaceholder')}
                {...register('notes')}
                className="w-full rounded-xl border border-border/50 px-4 py-3 text-sm transition duration-200 bg-background text-charcoal focus:bg-surface focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none resize-none"
              />
            </div>
          </div>

          {/* Payment Method Cards */}
          <div className="bg-surface p-6 rounded-3xl border border-border/30 shadow-sm space-y-4">
            <h2 className="text-lg font-black font-display text-charcoal border-b border-border/30 pb-3 mb-2">
              {t('checkout.paymentMethod')}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Card option */}
              <button
                type="button"
                onClick={() => setValue('paymentMethod', 'card')}
                className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 text-center transition focus:outline-none cursor-pointer ${
                  selectedPayment === 'card'
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border/60 hover:border-border text-text-muted bg-background hover:bg-border/20'
                }`}
              >
                <CreditCard className="h-6 w-6 mb-2 shrink-0" />
                <span className="text-sm font-extrabold block">{isRTL ? 'بطاقة بنكية' : 'Credit Card'}</span>
                <span className="text-[10px] text-text-muted/65 mt-1 block">Visa/MasterCard</span>
              </button>

              {/* Wallet option */}
              <button
                type="button"
                onClick={() => setValue('paymentMethod', 'wallet')}
                className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 text-center transition focus:outline-none cursor-pointer ${
                  selectedPayment === 'wallet'
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border/60 hover:border-border text-text-muted bg-background hover:bg-border/20'
                }`}
              >
                <Wallet className="h-6 w-6 mb-2 shrink-0" />
                <span className="text-sm font-extrabold block">{isRTL ? 'محفظة إلكترونية' : 'Mobile Wallet'}</span>
                <span className="text-[10px] text-text-muted/65 mt-1 block">Vodafone Cash</span>
              </button>

              {/* COD option */}
              <button
                type="button"
                onClick={() => setValue('paymentMethod', 'cod')}
                className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 text-center transition focus:outline-none cursor-pointer ${
                  selectedPayment === 'cod'
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border/60 hover:border-border text-text-muted bg-background hover:bg-border/20'
                }`}
              >
                <CircleDollarSign className="h-6 w-6 mb-2 shrink-0" />
                <span className="text-sm font-extrabold block">{isRTL ? 'الدفع عند الاستلام' : 'Cash on Delivery'}</span>
                <span className="text-[10px] text-text-muted/65 mt-1 block">Cash on Delivery</span>
              </button>
            </div>
          </div>

          {/* Checkout CTA */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex h-14 items-center justify-center rounded-2xl bg-primary hover:bg-primary-hover text-base font-bold text-white shadow-lg shadow-primary/20 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none cursor-pointer border-0"
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
        <aside className="lg:col-span-5 bg-surface p-6 rounded-3xl border border-border/30 shadow-sm space-y-6">
          <h2 className="text-lg font-black font-display text-charcoal border-b border-border/30 pb-3">
            {t('checkout.orderSummary')}
          </h2>

          <div className="divide-y divide-border/30 max-h-96 overflow-y-auto pr-1">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-4 py-3 first:pt-0 last:pb-0">
                <div className="h-12 w-12 rounded-xl bg-background flex items-center justify-center border border-border/40 text-2xl shrink-0 overflow-hidden select-none bg-zinc-950">
                  {item.image && (item.image.startsWith('/') || item.image.startsWith('http')) ? (
                    <img src={item.image} alt={item.name} className="w-full h-full object-contain p-1" />
                  ) : (
                    item.image || '🍔'
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-charcoal truncate leading-snug">{item.name}</h4>
                  <p className="mt-1 text-xs text-text-muted font-price font-bold">
                    {item.quantity} × {item.price} {t('products.currency')}
                  </p>
                </div>
                <span className="font-price font-extrabold text-xs text-charcoal shrink-0">
                  {item.price * item.quantity} {t('products.currency')}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-border/30 pt-4 space-y-3">
            <div className="flex items-center justify-between text-xs text-text-muted font-medium">
              <span>{isRTL ? 'الإجمالي الفرعي' : 'Subtotal'}</span>
              <span className="font-price font-bold">{totalAmount} {t('products.currency')}</span>
            </div>
            <div className="flex items-center justify-between text-xs text-text-muted font-medium">
              <span>{isRTL ? 'رسوم التوصيل' : 'Delivery Fees'}</span>
              <span className="text-green-500 font-extrabold">{isRTL ? 'مجاني' : 'FREE'}</span>
            </div>
            <div className="flex items-center justify-between text-base font-black text-charcoal border-t border-border/30 pt-3">
              <span>{isRTL ? 'الإجمالي الكلي' : 'Total'}</span>
              <span className="font-price text-lg text-primary">{totalAmount} {t('products.currency')}</span>
            </div>
          </div>
        </aside>

      </div>
    </div>
  );
};

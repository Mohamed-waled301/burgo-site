import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ShieldCheck, ArrowLeft, CreditCard, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

export const PaymentSimulator: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const orderId = searchParams.get('order_id') || '00000';
  const amount = searchParams.get('amount') || '0';
  const token = searchParams.get('payment_token') || 'sim_token_empty';

  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Format Card Number (adds space every 4 digits)
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    const matches = value.match(/.{1,4}/g);
    const formatted = matches ? matches.join(' ') : '';
    setCardNumber(formatted.slice(0, 19));
  };

  // Format Expiry (MM/YY)
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    let formatted = value;
    if (value.length > 2) {
      formatted = `${value.slice(0, 2)}/${value.slice(2, 4)}`;
    }
    setExpiry(formatted.slice(0, 5));
  };

  const handlePaySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cardNumber.length < 19 || expiry.length < 5 || cvv.length < 3) {
      toast.error(isRTL ? 'يرجى ملء جميع بيانات البطاقة بشكل صحيح' : 'Please fill in all card details');
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      toast.success(t('success.paymentSuccess'));
      navigate(`/checkout/success?order_id=${orderId}&token=${token}`);
    }, 1800);
  };

  return (
    <div className="min-h-screen bg-cream flex flex-col justify-center items-center py-12 px-4 select-none text-charcoal transition-colors duration-300" dir="ltr">
      
      {/* Sandbox warning banner */}
      <div className="w-full max-w-md bg-amber-500/10 border border-amber-500/25 text-amber-600 dark:text-amber-400 p-4 rounded-2xl mb-6 text-sm flex gap-3 items-start shadow-sm animate-badge-pop">
        <Sparkles className="h-5 w-5 shrink-0 text-amber-500 animate-pulse" />
        <div>
          <span className="font-bold block">Paymob Sandbox Mode Active</span>
          <span className="font-medium text-xs leading-relaxed">No actual money will be charged. Use any valid dummy data to test. Example card: 4111 1111 1111 1111</span>
        </div>
      </div>

      {/* Main card box */}
      <div className="w-full max-w-md bg-surface rounded-3xl border border-border/40 shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-background/80 border-b border-border/30 p-6 relative text-charcoal">
          <button
            onClick={() => navigate('/checkout')}
            className="absolute left-6 top-6 text-text-muted hover:text-charcoal transition"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          
          <div className="flex items-center gap-2 mb-2">
            <img src="/ref/IMG-20260615-WA0025.jpg" alt="Burgo Logo" className="h-6 w-6 rounded-full object-cover border border-border" />
            <span className="font-display font-black text-lg text-primary uppercase">Burgo Gateway</span>
          </div>
          <p className="text-xs text-text-muted">Secure simulated Paymob checkout frame</p>

          <div className="mt-6 flex justify-between items-end">
            <div>
              <span className="text-[10px] text-text-muted block uppercase font-bold tracking-wider">Order ID</span>
              <span className="text-sm font-bold font-mono">#{orderId}</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-text-muted block uppercase font-bold tracking-wider">Total Amount</span>
              <span className="text-2xl font-black font-display text-primary">{amount} <span className="text-xs font-bold">EGP</span></span>
            </div>
          </div>
        </div>

        {/* Card visualization panel */}
        <div className="p-6 bg-background border-b border-border/30 flex justify-center">
          <div className="w-full max-w-xs h-40 bg-gradient-to-r from-primary to-accent rounded-2xl p-4 text-white flex flex-col justify-between shadow-lg shadow-primary/20 relative overflow-hidden select-none">
            {/* Chip */}
            <div className="flex justify-between items-start">
              <div className="h-8 w-10 bg-yellow-300/30 rounded-md border border-yellow-300/40 relative">
                <div className="absolute inset-y-1 inset-x-2 border-r border-b border-yellow-300/20" />
              </div>
              <CreditCard className="h-6 w-6 text-white/80" />
            </div>

            {/* Card Number */}
            <div className="font-mono text-lg tracking-widest text-center py-2 select-text">
              {cardNumber || '•••• •••• •••• ••••'}
            </div>

            {/* Name & Expiry */}
            <div className="flex justify-between text-xs font-mono uppercase">
              <div className="truncate max-w-[160px]">{cardName || 'Card Holder'}</div>
              <div>{expiry || 'MM/YY'}</div>
            </div>
          </div>
        </div>

        {/* Inputs Form */}
        <form onSubmit={handlePaySubmit} className="p-6 space-y-4">
          {/* Holder Name */}
          <div>
            <label className="block text-[10px] font-bold uppercase text-text-muted mb-1.5 tracking-wider">Cardholder Name</label>
            <input
              type="text"
              placeholder="e.g. John Doe"
              value={cardName}
              onChange={(e) => setCardName(e.target.value.replace(/[^a-zA-Z\s]/g, ''))}
              required
              className="w-full border border-border/50 rounded-xl px-4 py-2.5 text-sm bg-background text-charcoal focus:outline-none focus:border-primary focus:bg-surface focus:ring-2 focus:ring-primary/10 transition duration-200"
            />
          </div>

          {/* Card Number Input */}
          <div>
            <label className="block text-[10px] font-bold uppercase text-text-muted mb-1.5 tracking-wider">Card Number</label>
            <input
              type="text"
              placeholder="4111 1111 1111 1111"
              value={cardNumber}
              onChange={handleCardNumberChange}
              required
              className="w-full border border-border/50 rounded-xl px-4 py-2.5 text-sm font-mono bg-background text-charcoal focus:outline-none focus:border-primary focus:bg-surface focus:ring-2 focus:ring-primary/10 transition duration-200"
            />
          </div>

          {/* Expiry & CVV */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold uppercase text-text-muted mb-1.5 tracking-wider">Expiration</label>
              <input
                type="text"
                placeholder="MM/YY"
                value={expiry}
                onChange={handleExpiryChange}
                required
                className="w-full border border-border/50 rounded-xl px-4 py-2.5 text-sm font-mono text-center bg-background text-charcoal focus:outline-none focus:border-primary focus:bg-surface focus:ring-2 focus:ring-primary/10 transition duration-200"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase text-text-muted mb-1.5 tracking-wider">CVV / Security Code</label>
              <input
                type="password"
                placeholder="•••"
                maxLength={3}
                value={cvv}
                onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                required
                className="w-full border border-border/50 rounded-xl px-4 py-2.5 text-sm font-mono text-center bg-background text-charcoal focus:outline-none focus:border-primary focus:bg-surface focus:ring-2 focus:ring-primary/10 transition duration-200"
              />
            </div>
          </div>

          {/* Actions */}
          <button
            type="submit"
            disabled={isProcessing}
            className="w-full flex h-12 mt-6 items-center justify-center rounded-xl bg-primary hover:bg-primary-hover text-white text-sm font-bold shadow-lg shadow-primary/20 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 cursor-pointer border-0"
          >
            {isProcessing ? (
              <div className="h-5 w-5 rounded-full border-2 border-white border-t-transparent animate-spinner" />
            ) : (
              `Pay ${amount} EGP`
            )}
          </button>

          <div className="flex items-center justify-center gap-1.5 text-[10px] text-text-muted mt-4">
            <ShieldCheck className="h-4 w-4 text-green-500 shrink-0" />
            <span>Secured SSL encryption. Powered by Paymob Mock Iframe.</span>
          </div>
        </form>
      </div>
    </div>
  );
};

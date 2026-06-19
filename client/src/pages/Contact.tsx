import React from 'react';
import { useTranslation } from 'react-i18next';
import { MessageSquare, Phone, Clock, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

export const Contact: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  // Validation Schema
  const schema = z.object({
    name: z.string().min(3, { message: t('contactPage.form.validation.name') }),
    phone: z.string()
      .min(1, { message: t('contactPage.form.validation.phone') })
      .regex(/^01[0125][0-9]{8}$/, { message: t('contactPage.form.validation.phone') }),
    message: z.string().min(10, { message: t('contactPage.form.validation.message') }),
  });

  type FormData = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    formState: { errors, isValid }
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      phone: '',
      message: '',
    }
  });

  const onSubmit = (data: FormData) => {
    const messageTemplate = isRTL
      ? `الاسم: ${data.name}\nالهاتف: ${data.phone}\nالرسالة:\n${data.message}`
      : `Name: ${data.name}\nPhone: ${data.phone}\nMessage:\n${data.message}`;

    const encodedText = encodeURIComponent(messageTemplate);
    const whatsappUrl = `https://wa.me/201221542589?text=${encodedText}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="flex-1 w-full bg-zinc-950 flex flex-col items-center justify-center py-16 px-4 relative select-none" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Background radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full filter blur-[120px] pointer-events-none z-0" />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="blob-card-wrapper w-full max-w-xl shadow-2xl relative z-10"
      >
        {/* Animated background blob */}
        <div className="absolute z-0 top-1/2 left-1/2 w-48 h-48 rounded-full bg-primary/10 filter blur-2xl opacity-60 animate-blob-bounce select-none pointer-events-none" />

        {/* Inner glass face */}
        <div className="blob-card-face p-6 sm:p-10 items-center text-center space-y-6">
          {/* Header */}
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 text-primary text-xs font-black tracking-widest uppercase bg-primary/10 border border-primary/20 rounded-full px-3 py-1 animate-pulse-glow">
              <Sparkles className="h-3.5 w-3.5" />
              {isRTL ? 'بورجو معك دائماً' : 'Burgo is always with you'}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white font-display pt-2">
              {t('contactPage.title')}
            </h1>
            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed max-w-md mx-auto font-medium">
              {t('contactPage.subtitle')}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4 text-start relative z-10">
            {/* Name Input */}
            <div>
              <label htmlFor="name" className="block text-xs font-bold text-zinc-400 mb-1.5 uppercase tracking-wide">
                {t('contactPage.form.name')}
              </label>
              <input
                id="name"
                type="text"
                placeholder={t('contactPage.form.namePlaceholder')}
                {...register('name')}
                className={`w-full rounded-xl border px-4 py-3 text-sm transition duration-200 bg-zinc-950 text-white focus:outline-none focus:ring-2 ${
                  errors.name 
                    ? 'border-red-500/50 focus:ring-red-500/20' 
                    : 'border-zinc-800 focus:border-primary focus:ring-primary/20'
                }`}
              />
              {errors.name && (
                <p className="mt-1.5 text-xs text-red-500 font-semibold">{errors.name.message}</p>
              )}
            </div>

            {/* Phone Input */}
            <div>
              <label htmlFor="phone" className="block text-xs font-bold text-zinc-400 mb-1.5 uppercase tracking-wide">
                {t('contactPage.form.phone')}
              </label>
              <input
                id="phone"
                type="tel"
                placeholder={t('contactPage.form.phonePlaceholder')}
                dir="ltr"
                {...register('phone')}
                className={`w-full rounded-xl border px-4 py-3 text-sm transition duration-200 bg-zinc-950 text-white focus:outline-none focus:ring-2 text-start ${
                  errors.phone 
                    ? 'border-red-500/50 focus:ring-red-500/20' 
                    : 'border-zinc-800 focus:border-primary focus:ring-primary/20'
                }`}
              />
              {errors.phone && (
                <p className="mt-1.5 text-xs text-red-500 font-semibold">{errors.phone.message}</p>
              )}
            </div>

            {/* Message Input */}
            <div>
              <label htmlFor="message" className="block text-xs font-bold text-zinc-400 mb-1.5 uppercase tracking-wide">
                {t('contactPage.form.message')}
              </label>
              <textarea
                id="message"
                rows={3}
                placeholder={t('contactPage.form.messagePlaceholder')}
                {...register('message')}
                className={`w-full rounded-xl border px-4 py-3 text-sm transition duration-200 bg-zinc-950 text-white focus:outline-none focus:ring-2 resize-none ${
                  errors.message 
                    ? 'border-red-500/50 focus:ring-red-500/20' 
                    : 'border-zinc-800 focus:border-primary focus:ring-primary/20'
                }`}
              />
              {errors.message && (
                <p className="mt-1.5 text-xs text-red-500 font-semibold">{errors.message.message}</p>
              )}
            </div>

            {/* Submit Action */}
            <button
              type="submit"
              disabled={!isValid}
              className="w-full h-13 rounded-xl bg-primary hover:bg-primary-hover text-white text-sm font-black transition-all duration-350 flex items-center justify-center gap-2.5 shadow-lg shadow-primary/20 hover:shadow-primary/35 disabled:opacity-50 disabled:pointer-events-none cursor-pointer border-0 mt-6"
            >
              <MessageSquare className="h-4.5 w-4.5 fill-current" />
              <span>{t('contactPage.form.send')}</span>
            </button>
          </form>

          {/* Quick info badges */}
          <div className="w-full grid grid-cols-2 gap-4 pt-6 border-t border-zinc-850 text-xs">
            <div className="flex items-center gap-3 bg-zinc-950/40 border border-zinc-850/50 rounded-xl p-3">
              <Phone className="h-4.5 w-4.5 text-primary shrink-0" />
              <div className="text-start">
                <span className="text-[10px] text-zinc-500 font-bold uppercase block tracking-wider">
                  {isRTL ? 'رقم الهاتف' : 'Phone Number'}
                </span>
                <span className="font-bold text-white tracking-wide font-price">
                  {t('contactPage.phone')}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-zinc-950/40 border border-zinc-850/50 rounded-xl p-3">
              <Clock className="h-4.5 w-4.5 text-primary shrink-0" />
              <div className="text-start">
                <span className="text-[10px] text-zinc-500 font-bold uppercase block tracking-wider">
                  {isRTL ? 'ساعات العمل' : 'Working Hours'}
                </span>
                <span className="font-bold text-white">
                  {t('contactPage.hours')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

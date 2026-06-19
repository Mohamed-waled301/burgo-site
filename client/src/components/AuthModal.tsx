import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useTranslation } from 'react-i18next';
import { X, User, Lock, Phone, MapPin, Eye, EyeOff, LogIn, UserPlus } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useCustomerAuthStore } from '../store/useCustomerAuthStore';
import { useAuthModalStore } from '../store/useAuthModalStore';

// ─── Zod schemas ──────────────────────────────────────────────────────────────
const signInSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

const signUpSchema = z.object({
  fullName: z.string().min(3, 'Full name must be at least 3 characters'),
  phoneNumber: z
    .string()
    .regex(/^01[0125][0-9]{8}$/, 'Enter a valid Egyptian phone number (01xxxxxxxxx)')
    .or(z.literal('')),
  address: z.string().optional(),
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((d) => d.password === d.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type SignInForm = z.infer<typeof signInSchema>;
type SignUpForm = z.infer<typeof signUpSchema>;

// ─── Shared input wrapper ─────────────────────────────────────────────────────
const Field: React.FC<{
  label: string;
  error?: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}> = ({ label, error, icon, children }) => (
  <div>
    <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1.5">
      {label}
    </label>
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none">
        {icon}
      </span>
      {children}
    </div>
    {error && <p className="mt-1 text-[11px] text-red-400 font-bold">{error}</p>}
  </div>
);

// ─── Main Modal ───────────────────────────────────────────────────────────────
export const AuthModal: React.FC = () => {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const navigate = useNavigate();
  const { isOpen, close } = useAuthModalStore();
  const { login } = useCustomerAuthStore();

  const [tab, setTab] = useState<'signin' | 'signup'>('signin');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ── Sign In form ────────────────────────────────────────────────────────────
  const {
    register: siReg,
    handleSubmit: siSubmit,
    formState: { errors: siErrors },
    reset: siReset,
  } = useForm<SignInForm>({ resolver: zodResolver(signInSchema) });

  // ── Sign Up form ────────────────────────────────────────────────────────────
  const {
    register: suReg,
    handleSubmit: suSubmit,
    formState: { errors: suErrors },
    reset: suReset,
  } = useForm<SignUpForm>({ resolver: zodResolver(signUpSchema) });

  const handleClose = () => {
    siReset();
    suReset();
    setShowPassword(false);
    setShowConfirm(false);
    close();
  };

  const onSignIn = async (data: SignInForm) => {
    setIsSubmitting(true);
    try {
      const res = await api.post('/customer/login', data);
      login(res.data.token, res.data.user);
      toast.success(isRTL ? `أهلاً بعودتك، ${res.data.user.fullName}! 🎉` : `Welcome back, ${res.data.user.fullName}! 🎉`);
      handleClose();
      navigate('/checkout');
    } catch (err: any) {
      const msg = err.response?.data?.error || (isRTL ? 'حدث خطأ، حاول مجدداً' : 'Something went wrong. Please try again.');
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSignUp = async (data: SignUpForm) => {
    setIsSubmitting(true);
    try {
      const payload = {
        fullName: data.fullName,
        username: data.username,
        password: data.password,
        phoneNumber: data.phoneNumber || '',
        address: data.address || '',
      };
      const res = await api.post('/customer/register', payload);
      login(res.data.token, res.data.user);
      toast.success(isRTL ? `مرحباً بك يا ${res.data.user.fullName}! 🍔` : `Welcome to Burgo, ${res.data.user.fullName}! 🍔`);
      handleClose();
      navigate('/checkout');
    } catch (err: any) {
      const msg = err.response?.data?.error || (isRTL ? 'حدث خطأ، حاول مجدداً' : 'Something went wrong. Please try again.');
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = (hasError?: boolean) =>
    `w-full pl-10 pr-4 py-3 rounded-xl border text-sm bg-zinc-950 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 transition duration-200 ${
      hasError
        ? 'border-red-500/50 focus:ring-red-500/20'
        : 'border-zinc-800 focus:border-primary focus:ring-primary/20'
    }`;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" dir={isRTL ? 'rtl' : 'ltr'}>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/75 backdrop-blur-md"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ y: 40, opacity: 0, scale: 0.96 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 40, opacity: 0, scale: 0.96 }}
            transition={{ type: 'spring', damping: 28, stiffness: 260 }}
            className="relative w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden z-10"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-800 bg-zinc-950/60">
              <div>
                <h2 className="text-lg font-black text-white font-display">
                  {tab === 'signin'
                    ? (isRTL ? 'تسجيل الدخول' : 'Sign In')
                    : (isRTL ? 'إنشاء حساب' : 'Create Account')}
                </h2>
                <p className="text-[11px] text-zinc-500 mt-0.5 font-medium">
                  {isRTL ? 'لإتمام طلبك واستخدام بياناتك مرة أخرى' : 'To complete your order and save your info'}
                </p>
              </div>
              <button
                onClick={handleClose}
                className="text-zinc-500 hover:text-white transition rounded-xl p-1.5 hover:bg-zinc-800 cursor-pointer border-0"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Tab switcher */}
            <div className="flex gap-1 mx-6 mt-5 bg-zinc-950 rounded-2xl p-1 border border-zinc-800">
              {(['signin', 'signup'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all duration-200 cursor-pointer border-0 ${
                    tab === t
                      ? 'bg-primary text-white shadow-md shadow-primary/25'
                      : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  {t === 'signin'
                    ? (isRTL ? 'تسجيل الدخول' : 'Sign In')
                    : (isRTL ? 'حساب جديد' : 'Sign Up')}
                </button>
              ))}
            </div>

            {/* Forms */}
            <div className="px-6 pb-6 pt-4">
              <AnimatePresence mode="wait">
                {/* ── SIGN IN ── */}
                {tab === 'signin' && (
                  <motion.form
                    key="signin"
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 16 }}
                    transition={{ duration: 0.18 }}
                    onSubmit={siSubmit(onSignIn)}
                    className="space-y-4"
                  >
                    <Field
                      label={isRTL ? 'اسم المستخدم' : 'Username'}
                      error={siErrors.username?.message}
                      icon={<User className="h-4 w-4" />}
                    >
                      <input
                        type="text"
                        autoComplete="username"
                        placeholder={isRTL ? 'اسم المستخدم' : 'your_username'}
                        {...siReg('username')}
                        className={inputClass(!!siErrors.username)}
                        dir="ltr"
                      />
                    </Field>

                    <Field
                      label={isRTL ? 'كلمة المرور' : 'Password'}
                      error={siErrors.password?.message}
                      icon={<Lock className="h-4 w-4" />}
                    >
                      <input
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="current-password"
                        placeholder="••••••••"
                        {...siReg('password')}
                        className={`${inputClass(!!siErrors.password)} pr-10`}
                        dir="ltr"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition border-0 bg-transparent cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </Field>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-12 rounded-2xl bg-primary hover:bg-primary-hover text-white font-black text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20 disabled:opacity-50 disabled:pointer-events-none cursor-pointer border-0 mt-2"
                    >
                      {isSubmitting ? (
                        <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spinner" />
                      ) : (
                        <>
                          <LogIn className="h-4 w-4" />
                          {isRTL ? 'تسجيل الدخول' : 'Sign In'}
                        </>
                      )}
                    </button>

                    <p className="text-center text-xs text-zinc-500">
                      {isRTL ? 'ليس لديك حساب؟ ' : "Don't have an account? "}
                      <button
                        type="button"
                        onClick={() => setTab('signup')}
                        className="text-primary hover:underline font-bold border-0 bg-transparent cursor-pointer"
                      >
                        {isRTL ? 'أنشئ حساباً' : 'Sign Up'}
                      </button>
                    </p>
                  </motion.form>
                )}

                {/* ── SIGN UP ── */}
                {tab === 'signup' && (
                  <motion.form
                    key="signup"
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -16 }}
                    transition={{ duration: 0.18 }}
                    onSubmit={suSubmit(onSignUp)}
                    className="space-y-3"
                  >
                    <Field
                      label={isRTL ? 'الاسم الكامل' : 'Full Name'}
                      error={suErrors.fullName?.message}
                      icon={<User className="h-4 w-4" />}
                    >
                      <input
                        type="text"
                        autoComplete="name"
                        placeholder={isRTL ? 'الاسم الكامل' : 'John Doe'}
                        {...suReg('fullName')}
                        className={inputClass(!!suErrors.fullName)}
                      />
                    </Field>

                    <div className="grid grid-cols-2 gap-3">
                      <Field
                        label={isRTL ? 'رقم الموبايل' : 'Phone'}
                        error={suErrors.phoneNumber?.message}
                        icon={<Phone className="h-4 w-4" />}
                      >
                        <input
                          type="tel"
                          placeholder="01xxxxxxxxx"
                          {...suReg('phoneNumber')}
                          className={inputClass(!!suErrors.phoneNumber)}
                          dir="ltr"
                        />
                      </Field>

                      <Field
                        label={isRTL ? 'اسم المستخدم' : 'Username'}
                        error={suErrors.username?.message}
                        icon={<User className="h-4 w-4" />}
                      >
                        <input
                          type="text"
                          autoComplete="username"
                          placeholder="username"
                          {...suReg('username')}
                          className={inputClass(!!suErrors.username)}
                          dir="ltr"
                        />
                      </Field>
                    </div>

                    <Field
                      label={isRTL ? 'عنوان التوصيل' : 'Delivery Address'}
                      error={suErrors.address?.message}
                      icon={<MapPin className="h-4 w-4" />}
                    >
                      <input
                        type="text"
                        placeholder={isRTL ? 'مثال: 12 شارع الملك، القاهرة' : 'e.g. 12 Main St, Cairo'}
                        {...suReg('address')}
                        className={inputClass(!!suErrors.address)}
                      />
                    </Field>

                    <div className="grid grid-cols-2 gap-3">
                      <Field
                        label={isRTL ? 'كلمة المرور' : 'Password'}
                        error={suErrors.password?.message}
                        icon={<Lock className="h-4 w-4" />}
                      >
                        <input
                          type={showPassword ? 'text' : 'password'}
                          autoComplete="new-password"
                          placeholder="••••••"
                          {...suReg('password')}
                          className={`${inputClass(!!suErrors.password)} pr-10`}
                          dir="ltr"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((v) => !v)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition border-0 bg-transparent cursor-pointer"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </Field>

                      <Field
                        label={isRTL ? 'تأكيد المرور' : 'Confirm'}
                        error={suErrors.confirmPassword?.message}
                        icon={<Lock className="h-4 w-4" />}
                      >
                        <input
                          type={showConfirm ? 'text' : 'password'}
                          autoComplete="new-password"
                          placeholder="••••••"
                          {...suReg('confirmPassword')}
                          className={`${inputClass(!!suErrors.confirmPassword)} pr-10`}
                          dir="ltr"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirm((v) => !v)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition border-0 bg-transparent cursor-pointer"
                        >
                          {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </Field>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-12 rounded-2xl bg-primary hover:bg-primary-hover text-white font-black text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20 disabled:opacity-50 disabled:pointer-events-none cursor-pointer border-0 mt-1"
                    >
                      {isSubmitting ? (
                        <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spinner" />
                      ) : (
                        <>
                          <UserPlus className="h-4 w-4" />
                          {isRTL ? 'إنشاء الحساب' : 'Create Account'}
                        </>
                      )}
                    </button>

                    <p className="text-center text-xs text-zinc-500">
                      {isRTL ? 'لديك حساب بالفعل؟ ' : 'Already have an account? '}
                      <button
                        type="button"
                        onClick={() => setTab('signin')}
                        className="text-primary hover:underline font-bold border-0 bg-transparent cursor-pointer"
                      >
                        {isRTL ? 'سجّل دخولك' : 'Sign In'}
                      </button>
                    </p>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ShieldAlert, AlertCircle, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { useAuthStore } from '../../store/useAuthStore';
import api from '../../services/api';

export const Login: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isRTL = i18n.language === 'ar';
  
  const login = useAuthStore((state) => state.login);
  
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.post('/auth/login', {
        username: usernameInput,
        password: passwordInput
      });

      const { token, username } = response.data;
      login(token, username);
      
      toast.success(isRTL ? 'أهلاً بك مجدداً في لوحة التحكم!' : 'Welcome back, Admin!');
      navigate('/admin/dashboard');
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.response?.data?.error || t('admin.login.error'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col justify-center items-center py-12 px-4 select-none relative">
      
      {/* Return home absolute button */}
      <button
        onClick={() => navigate('/')}
        className="absolute top-6 left-6 flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-white transition"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>{t('success.btnHome')}</span>
      </button>

      {/* Login Card */}
      <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        
        {/* Glow glow */}
        <div className="absolute -top-10 -left-10 h-32 w-32 bg-primary/10 rounded-full blur-2xl" />
        <div className="absolute -bottom-10 -right-10 h-32 w-32 bg-primary/5 rounded-full blur-2xl" />

        {/* Title */}
        <div className="text-center mb-8 relative z-10">
          <div className="mx-auto h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 border border-primary/20">
            <ShieldAlert className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold font-display text-white">
            {t('admin.login.title')}
          </h1>
          <p className="text-xs text-gray-500 mt-2">
            {t('admin.login.subtitle')}
          </p>
        </div>

        {/* Errors banner */}
        {error && (
          <div className="mb-6 flex items-center gap-3 p-4 rounded-xl bg-red-950/40 border border-red-900/40 text-red-400 text-sm">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span className="font-semibold">{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
          {/* Username */}
          <div>
            <label htmlFor="username" className="block text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-wide">
              {t('admin.login.username')}
            </label>
            <input
              id="username"
              type="text"
              required
              value={usernameInput}
              onChange={(e) => setUsernameInput(e.target.value)}
              className="w-full rounded-xl border border-gray-850 bg-gray-950 px-4 py-3 text-sm text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition"
              placeholder="e.g. admin"
              dir="ltr"
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-wide">
              {t('admin.login.password')}
            </label>
            <input
              id="password"
              type="password"
              required
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              className="w-full rounded-xl border border-gray-850 bg-gray-950 px-4 py-3 text-sm text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition"
              placeholder="••••••••••••"
              dir="ltr"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex h-12 mt-6 items-center justify-center rounded-xl bg-primary hover:bg-primary-hover text-white text-sm font-bold shadow-lg shadow-primary/20 transition hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? (
              <div className="h-5 w-5 rounded-full border-2 border-white border-t-transparent animate-spinner" />
            ) : (
              t('admin.login.btn')
            )}
          </button>
        </form>

        {/* Default credentials indicator for demo purposes */}
        <div className="mt-6 border-t border-gray-800 pt-4 text-center">
          <p className="text-[10px] text-gray-500">
            Demo credentials: <span className="font-mono text-gray-400 select-text">admin</span> / <span className="font-mono text-gray-400 select-text">BurgerBox2025!</span>
          </p>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

export const OrderSuccess: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const orderId = searchParams.get('order_id') || '00000';

  return (
    <div className="flex-1 flex flex-col justify-center items-center py-20 px-4 text-center select-none bg-cream">
      <div className="bg-white p-8 sm:p-12 rounded-[30px] border border-gray-100 shadow-xl max-w-lg w-full flex flex-col items-center">
        
        {/* Animated Checkmark SVG */}
        <div className="h-28 w-28 rounded-full bg-green-50 border border-green-100 flex items-center justify-center mb-8">
          <svg className="h-16 w-16 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
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
        <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-gray-900 leading-tight">
          {t('success.title')}
        </h1>

        {/* Description message */}
        <p className="mt-4 text-sm sm:text-base text-gray-500 max-w-sm leading-relaxed">
          {t('success.message')}
        </p>

        {/* Order Number Box */}
        <div className="mt-8 p-4 bg-gray-50 border border-gray-100 rounded-2xl w-full">
          <span className="text-xs text-gray-400 font-bold uppercase block tracking-wider mb-1">
            {t('success.orderNumber')}
          </span>
          <span className="text-3xl font-extrabold font-mono text-primary select-text">
            #{orderId}
          </span>
        </div>

        {/* Return Button */}
        <button
          onClick={() => navigate('/')}
          className="mt-8 w-full h-12 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold shadow-lg shadow-primary/20 transition hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
        >
          {t('success.btnHome')}
        </button>
      </div>
    </div>
  );
};

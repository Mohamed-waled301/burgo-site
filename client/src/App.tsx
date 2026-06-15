import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AppRoutes } from './routes/AppRoutes';
import { useLanguageStore } from './store/useLanguageStore';

const App: React.FC = () => {
  const { language } = useLanguageStore();
  const dir = language === 'ar' ? 'rtl' : 'ltr';

  return (
    <BrowserRouter>
      {/* Global Toast Provider */}
      <Toaster 
        position={dir === 'rtl' ? 'top-left' : 'top-right'} 
        dir={dir} 
        richColors
        closeButton
      />
      <AppRoutes />
    </BrowserRouter>
  );
};

export default App;

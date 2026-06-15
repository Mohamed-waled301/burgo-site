import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AppRoutes } from './routes/AppRoutes';
import { useLanguageStore } from './store/useLanguageStore';
import { ErrorBoundary } from './components/ErrorBoundary';

const App: React.FC = () => {
  const { language } = useLanguageStore();
  const dir = language === 'ar' ? 'rtl' : 'ltr';

  return (
    <ErrorBoundary>
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
    </ErrorBoundary>
  );
};

export default App;

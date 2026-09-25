import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import { useAuthStore } from './store/authStore';

export default function App() {
  const { setUser, setLoadingAuth } = useAuthStore();

  useEffect(() => {
    // Check Telegram WebApp initData or initialize mock session fallback for desktop testing
    const initTelegramAuth = async () => {
      try {
        setLoadingAuth(true);
        const tg = window.Telegram?.WebApp;
        
        if (tg && tg.initData) {
          // Real Telegram WebApp Data present
          setUser({
            id: tg.initDataUnsafe?.user?.id || 'HOBA-214695',
            username: tg.initDataUnsafe?.user?.username || 'trader',
            subscription: 'Trialing',
            onboarding_completed: true,
          });
        } else {
          // Fallback for Telegram Desktop / local testing mode
          setUser({
            id: 'HOBA-214695',
            username: 'mock_trader',
            subscription: 'Trialing',
            onboarding_completed: true,
          });
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
      } finally {
        setLoadingAuth(false);
      }
    };

    initTelegramAuth();
  }, [setUser, setLoadingAuth]);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-orange-500 selection:text-slate-950">
        <AppRoutes />
      </div>
    </BrowserRouter>
  );
}
import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import { useAuthStore } from './store/authStore';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

export default function App() {
  const { setUser, setLoadingAuth } = useAuthStore();

  useEffect(() => {
    const initTelegramAuth = async () => {
      try {
        setLoadingAuth(true);
        const tg = window.Telegram?.WebApp;
        
        if (tg && tg.initDataUnsafe?.user?.id) {
          // Real Telegram WebApp: Check backend if this Telegram ID is linked
          const telegramId = tg.initDataUnsafe.user.id;
          const response = await axios.post('http://localhost:5000/api/auth/telegram-login', {
            telegram_id: telegramId
          });

          if (response.data.success) {
            setUser(response.data.user);
          }
        } else {
          // If running normally on the web browser, let them log in via Web Login or Link page
          console.log('Web browser mode: Awaiting login or telegram link.');
        }
      } catch (err) {
        console.error('Telegram auth sync error or account not linked yet:', err);
        // If 404 (not linked), user remains unauthenticated so they can link or login
      } finally {
        setLoadingAuth(false);
      }
    };

    initTelegramAuth();
  }, [setUser, setLoadingAuth]);

  return (
    <BrowserRouter>
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        theme="dark"
      />
      <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-orange-500 selection:text-slate-950">
        <AppRoutes />
      </div>
    </BrowserRouter>
  );
}
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuthStore } from '../store/authStore';
import { loginApi, linkTelegramApi } from '../services/api';

function LinkTelegram() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, token, login } = useAuthStore();

  const telegramId = searchParams.get('telegram_id');
  const telegramUsername = searchParams.get('username') || '';

  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Links Telegram to whichever account the caller currently has a session for
  // (linkTelegramApi reads the token from the store automatically when present).
  const executeLinking = async (extra = {}) => {
    try {
      const response = await linkTelegramApi({
        telegramId,
        username: telegramUsername,
        ...extra,
      });

      if (response.success) {
        login(response.user, response.token);
        toast.success('Telegram account successfully linked! 🚀');
        setTimeout(() => navigate('/dashboard'), 1500);
      }
    } catch (err) {
      console.error('Error linking telegram:', err);
      toast.error(err.message || 'Failed to link Telegram account.');
    }
  };

  // Auto-link if user is already logged in when arriving from Telegram
  useEffect(() => {
    if (telegramId && user && token) {
      executeLinking();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [telegramId, user, token]);

  // Handle manual login submission for unauthenticated users
  const handleLoginAndLink = async (e) => {
    e.preventDefault();
    if (!phone || !password) {
      toast.error('Please enter your phone number and password');
      return;
    }

    try {
      setLoading(true);

      const loginRes = await loginApi({ phone, password });

      if (loginRes.success) {
        // Save the session first so the follow-up link call is authenticated.
        login(loginRes.user, loginRes.token);

        if (telegramId) {
          await executeLinking();
        } else {
          toast.success('Logged in successfully!');
          navigate('/dashboard');
        }
      }
    } catch (err) {
      console.error('Login error during linking:', err);
      toast.error(err.message || 'Invalid credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl">
        <div className="text-center mb-6">
          <span className="bg-orange-500/10 text-orange-400 text-xs font-semibold px-3 py-1 rounded-full border border-orange-500/20">
            Secure Integration
          </span>
          <h2 className="text-2xl font-bold text-white mt-3">Link Your Telegram</h2>
          <p className="text-slate-400 text-sm mt-1">
            {telegramId
              ? `Binding Telegram account (@${telegramUsername || telegramId}) to your Hoba Labs web profile.`
              : 'Link your Telegram for instant passwordless trading alerts.'}
          </p>
        </div>

        {user && token ? (
          <div className="text-center py-4">
            <p className="text-emerald-400 font-medium mb-4">✓ Logged in as: {user.phone || user.email}</p>
            <p className="text-slate-400 text-sm animate-pulse">Syncing your Telegram ID with your account...</p>
          </div>
        ) : (
          <form onSubmit={handleLoginAndLink} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter your web account phone"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition text-sm"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 text-slate-950 font-bold py-3 rounded-xl hover:bg-orange-400 transition shadow-lg shadow-orange-500/10 disabled:opacity-50 text-sm mt-2"
            >
              {loading ? 'Linking Account...' : 'Login & Link Telegram'}
            </button>

            <div className="text-center mt-4">
              <p className="text-xs text-slate-500">
                Don't have a web account yet?{' '}
                <Link to="/register" className="text-orange-400 hover:underline">
                  Register here
                </Link>
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default LinkTelegram;

import React, { useState, useEffect } from 'react';

function ProfileSetup() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [whatsapp, setWhatsapp] = useState('');
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    async function authenticateUser() {
      try {
        const tg = window.Telegram?.WebApp;
        
        // Grab live Telegram initData if available, otherwise safely fallback for desktop testing
        let initData = 'mock_test_init_data_string';
        if (tg && tg.initData && tg.initData.length > 0) {
          tg.ready();
          initData = tg.initData;
        }

        const response = await fetch(`${API_URL}/auth/sync`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${initData}`
          }
        });

        const data = await response.json();
        
        if (!response.ok) throw new Error(data.error || 'Failed to authenticate');

        setUser(data.user);
        setSubscription(data.subscription);
        if (data.user?.whatsapp_number) {
          setWhatsapp(data.user.whatsapp_number);
        }
      } catch (err) {
        console.error('Auth sync error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    authenticateUser();
  }, [API_URL]);

  const handleUpdateWhatsapp = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setError(null);

    try {
      const tg = window.Telegram?.WebApp;
      let initData = (tg && tg.initData && tg.initData.length > 0) ? tg.initData : 'mock_test_init_data_string';

      const response = await fetch(`${API_URL}/user/update-whatsapp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${initData}`
        },
        body: JSON.stringify({ whatsapp_number: whatsapp })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to update');

      setUser(data.user);
      alert('WhatsApp number saved successfully!');
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-hobaDark text-white">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-hobaAccent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400 font-medium">Initializing Hoba Labs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-hobaDark text-white p-4 flex flex-col items-center justify-between">
      <div className="w-full max-w-md bg-hobaCard border border-slate-800 rounded-2xl p-6 shadow-xl mt-4">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-hobaAccent to-blue-700 flex items-center justify-center font-bold text-lg shadow-lg">
            HL
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-wide">Hoba Labs</h1>
            <p className="text-xs text-slate-400">Automated Forex Signal Engine</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm p-3 rounded-xl mb-4">
            {error} <br /><span className="text-xs opacity-75">(Make sure your backend is running on port 5000)</span>
          </div>
        )}

        {user && (
          <div className="space-y-4">
            {/* Account Profile Card showing unique Client ID */}
            <div className="bg-slate-900/60 rounded-xl p-4 border border-slate-800 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-400 uppercase tracking-wider">Terminal ID</span>
                <span className="text-xs font-mono px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                  {user.client_id || 'HOBA-SYNCING'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-400 uppercase tracking-wider">Subscription</span>
                <span className="text-xs px-2.5 py-1 rounded-full bg-sky-500/10 text-hobaAccent border border-sky-500/20 capitalize font-medium">
                  {subscription?.status || 'Active'}
                </span>
              </div>
              <div className="pt-2 border-t border-slate-800/80">
                <p className="font-semibold text-base">{user.first_name || user.username || 'Trader'}</p>
                <p className="text-xs text-slate-400 font-mono">Telegram ID: {user.telegram_id}</p>
              </div>
            </div>

            <form onSubmit={handleUpdateWhatsapp} className="space-y-3 pt-2">
              <label className="block text-xs font-medium text-slate-300">
                WhatsApp Phone Number (for alerts)
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="+2348012345678"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-hobaAccent transition-colors"
                  required
                />
                <button
                  type="submit"
                  disabled={updating}
                  className="bg-hobaAccent text-hobaDark font-semibold px-4 py-2.5 rounded-xl text-sm hover:bg-sky-400 transition-all disabled:opacity-50"
                >
                  {updating ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      <footer className="text-center text-xs text-slate-500 py-4">
        &copy; 2026 Hoba Labs. All rights reserved.
      </footer>
    </div>
  );
}

export default ProfileSetup;
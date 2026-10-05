import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { linkTelegramApi } from '../services/api';
import BarLoader from '../components/common/BarLoader';
import { ArrowRight } from 'lucide-react';
import { toast } from 'react-toastify';
import logo from '../assets/images/hoba-labs-logo-horizontal.png';

function LinkTelegram() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, token, login } = useAuthStore();

  const telegramId = searchParams.get('telegram_id');
  const telegramUsername = searchParams.get('username') || '';

  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Guard reference to prevent duplicate execution loops
  const hasAttemptedLink = useRef(false);

  // Links Telegram to whichever account the caller currently has a session for
  const executeLinking = async (extra = {}) => {
    if (hasAttemptedLink.current) return;
    hasAttemptedLink.current = true;

    try {
      const response = await linkTelegramApi({
        telegramId,
        username: telegramUsername,
        ...extra,
      });

      if (response.success) {
        login(response.user, response.token);
        toast.success('Linked Successfully!');
        setTimeout(() => navigate('/dashboard'), 1500);
      }
    } catch (err) {
      console.error('Error linking telegram:', err);
      toast.error(err.message || 'Failed to link Telegram account.');
      hasAttemptedLink.current = false; // Allow retry on failure if needed
    }
  };

  // Auto-link if user is already logged in when arriving from Telegram
  useEffect(() => {
    if (telegramId && user && token && !hasAttemptedLink.current) {
      executeLinking();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [telegramId, user, token]);

  // Handle manual login submission for unauthenticated users linking Telegram
  const handleLoginAndLink = async (e) => {
    e.preventDefault();
    if (!phone || !password) {
      toast.error('Please enter your credentials');
      return;
    }

    try {
      setLoading(true);

      const response = await linkTelegramApi({
        telegramId,
        username: telegramUsername,
        phone,
        password,
      });

      if (response.success) {
        login(response.user, response.token);
        toast.success('Account linked successfully!');
        setTimeout(() => navigate('/dashboard'), 1500);
      }
    } catch (err) {
      console.error('Login error during linking:', err);
      toast.error(err.message || 'Failed to authenticate and link.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl">
        <div className="text-center mb-6">
          <img
            src={logo}
            alt="Hobalabs Logo"
            className="mx-auto h-16 md:h-20 w-auto"
          />
          <h2 className="text-2xl font-bold text-white mt-3">Link Your Telegram</h2>
          <p className="text-slate-400 text-sm mt-1">
            {telegramId
              ? `Binding Telegram account (@${telegramUsername}) to profile.`
              : 'Link Account for Instant Trading Alerts.'}
          </p>
        </div>

        {user && token && telegramId ? (
          <div className="text-center py-4">
            <p className="text-slate-400 text-sm animate-pulse">Syncing your Telegram ID with your account...</p>
          </div>
        ) : (
          <form onSubmit={handleLoginAndLink} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-2">Phone Number or Email</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter your web account phone or email"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-2">Password</label>
              <input
                type="password"
                value={password}
                autoComplete="current-password"
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition text-sm"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 rounded-xl font-semibold bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 hover:opacity-95 active:scale-[0.98] transition-all flex items-center justify-center space-x-2 shadow-lg shadow-orange-500/20 disabled:opacity-50 text-sm"
            >
              {loading ? (
                <BarLoader />
              ) : (
                <>
                  <span>Link & Enter</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default LinkTelegram;


// import React, { useEffect, useState } from 'react';
// import { useSearchParams, useNavigate } from 'react-router-dom';
// import { useAuthStore } from '../store/authStore';
// import { linkTelegramApi } from '../services/api';
// import BarLoader from '../components/common/BarLoader';
// import { ArrowRight } from 'lucide-react';
// import { toast } from 'react-toastify'; // <-- Added missing import
// import logo from '../assets/images/hoba-labs-logo-horizontal.png';

// function LinkTelegram() {
//   const [searchParams] = useSearchParams();
//   const navigate = useNavigate();
//   const { user, token, login } = useAuthStore();

//   const telegramId = searchParams.get('telegram_id');
//   const telegramUsername = searchParams.get('username') || '';

//   const [phone, setPhone] = useState('');
//   const [password, setPassword] = useState('');
//   const [loading, setLoading] = useState(false);

//   // Links Telegram to whichever account the caller currently has a session for
//   const executeLinking = async (extra = {}) => {
//     try {
//       const response = await linkTelegramApi({
//         telegramId,
//         username: telegramUsername,
//         ...extra,
//       });

//       if (response.success) {
//         login(response.user, response.token);
//         toast.success('Linked Successfully!');
//         setTimeout(() => navigate('/dashboard'), 1500);
//       }
//     } catch (err) {
//       console.error('Error linking telegram:', err);
//       toast.error(err.message || 'Failed to link Telegram account.');
//     }
//   };

//   // Auto-link if user is already logged in when arriving from Telegram
//   useEffect(() => {
//     if (telegramId && user && token) {
//       executeLinking();
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [telegramId, user, token]);

//   // Handle manual login submission for unauthenticated users linking Telegram
//   const handleLoginAndLink = async (e) => {
//     e.preventDefault();
//     if (!phone || !password) {
//       toast.error('Please enter your credentials');
//       return;
//     }

//     try {
//       setLoading(true);

//       // Directly call linkTelegramApi with credentials + telegram info
//       const response = await linkTelegramApi({
//         telegramId,
//         username: telegramUsername,
//         phone, // Passed as loginIdentifier in api.js
//         password,
//       });

//       if (response.success) {
//         login(response.user, response.token);
//         toast.success('Account linked successfully!');
//         setTimeout(() => navigate('/dashboard'), 1500);
//       }
//     } catch (err) {
//       console.error('Login error during linking:', err);
//       toast.error(err.message || 'Failed to authenticate and link.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
//       <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl">
//         <div className="text-center mb-6">
//           <img
//             src={logo}
//             alt="Hobalabs Logo"
//             className="mx-auto h-16 md:h-20 w-auto"
//           />
//           <h2 className="text-2xl font-bold text-white mt-3">Link Your Telegram</h2>
//           <p className="text-slate-400 text-sm mt-1">
//             {telegramId
//               ? `Binding Telegram account (@${telegramUsername}) to profile.`
//               : 'Link Account for Instant Trading Alerts.'}
//           </p>
//         </div>

//         {user && token && telegramId ? (
//           <div className="text-center py-4">
//             <p className="text-slate-400 text-sm animate-pulse">Syncing your Telegram ID with your account...</p>
//           </div>
//         ) : (
//           <form onSubmit={handleLoginAndLink} className="space-y-4">
//             <div>
//               <label className="block text-xs font-medium text-slate-400 mb-2">Phone Number or Email</label>
//               <input
//                 type="text"
//                 value={phone}
//                 onChange={(e) => setPhone(e.target.value)}
//                 placeholder="Enter your web account phone or email"
//                 className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition text-sm"
//                 required
//               />
//             </div>

//             <div>
//               <label className="block text-xs font-medium text-slate-400 mb-2">Password</label>
//               <input
//                 type="password"
//                 value={password}
//                 autoComplete="current-password"
//                 onChange={(e) => setPassword(e.target.value)}
//                 placeholder="••••••••"
//                 className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition text-sm"
//                 required
//               />
//             </div>

//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full mt-2 py-3 px-4 rounded-xl font-semibold bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 hover:opacity-95 active:scale-[0.98] transition-all flex items-center justify-center space-x-2 shadow-lg shadow-orange-500/20 disabled:opacity-50 text-sm"
//             >
//               {loading ? (
//                 <BarLoader />
//               ) : (
//                 <>
//                   <span>Link & Enter</span>
//                   <ArrowRight className="w-4 h-4" />
//                 </>
//               )}
//             </button>
//           </form>
//         )}
//       </div>
//     </div>
//   );
// }

// export default LinkTelegram;
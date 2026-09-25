import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Phone, Lock, ShieldCheck, ArrowRight } from 'lucide-react';

function Login() {
  const [formData, setFormData] = useState({
    phone: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const { setUser } = useAuthStore();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Simulate backend authentication request via Supabase
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      setUser({
        id: 'HOBA-214695',
        phone: formData.phone,
        subscription: 'Trialing',
        onboarding_completed: true,
      });

      navigate('/dashboard');
    } catch (err) {
      console.error('Login failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-center px-6 py-12 select-none">
      <div className="max-w-md mx-auto w-full space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 text-orange-600 mx-auto flex items-center justify-center">
            <svg fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <rect x="4" y="4" width="6" height="6" rx="1">
                <animate id="spinner_w36s" begin="0;spinner_5GfT.end-0.25s" attributeName="x" dur="0.75s" values="4;14;4"></animate>
                <animate begin="0;spinner_5GfT.end-0.25s" attributeName="y" dur="0.75s" values="4;14;4"></animate>
              </rect>
              <rect x="4" y="14" width="6" height="6" rx="1">
                <animate begin="spinner_w36s.end-0.5s" attributeName="x" dur="0.75s" values="4;14;4"></animate>
                <animate begin="spinner_w36s.end-0.5s" attributeName="y" dur="0.75s" values="14;4;14"></animate>
              </rect>
              <rect x="14" y="4" width="6" height="6" rx="1">
                <animate begin="spinner_w36s.end-0.625s" attributeName="x" dur="0.75s" values="14;4;14"></animate>
                <animate begin="spinner_w36s.end-0.625s" attributeName="y" dur="0.75s" values="4;14;4"></animate>
              </rect>
              <rect x="14" y="14" width="6" height="6" rx="1">
                <animate id="spinner_5GfT" begin="spinner_w36s.end-0.375s" attributeName="x" dur="0.75s" values="14;4;14"></animate>
                <animate begin="spinner_w36s.end-0.375s" attributeName="y" dur="0.75s" values="14;4;14"></animate>
              </rect>
            </svg>
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Welcome Back</h2>
          <p className="text-xs text-slate-400">Log in to your Hoba Labs Terminal</p>
        </div>

        <form onSubmit={handleLogin} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl backdrop-blur-md">
          <div className="space-y-1">
            <label className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">WhatsApp Phone Number</label>
            <div className="relative flex items-center">
              <Phone className="absolute left-3 w-4 h-4 text-slate-500" />
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="09057973810"
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-orange-500 font-mono transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">Password</label>
            <div className="relative flex items-center">
              <Lock className="absolute left-3 w-4 h-4 text-slate-500" />
              <input
                type="password"
                name="password"
                autoComplete="new-password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-orange-500 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 px-4 rounded-xl font-semibold bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 hover:opacity-95 active:scale-[0.98] transition-all flex items-center justify-center space-x-2 shadow-lg shadow-orange-500/20 disabled:opacity-50 text-sm"
          >
            {loading ? (
              <span className="inline-block w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Access Terminal</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <div className="text-center pt-2">
            <p className="text-xs text-slate-400">
              Don't have an account?{' '}
              <Link to="/register" className="text-orange-500 font-semibold hover:underline">
                Register here
              </Link>
            </p>
          </div>
        </form>

        <div className="flex items-center justify-center space-x-2 text-xs text-slate-500">
          <ShieldCheck className="w-4 h-4 text-orange-500" />
          <span>Hoba Labs Secure Portal</span>
        </div>
      </div>
    </div>
  );
}

export default Login;
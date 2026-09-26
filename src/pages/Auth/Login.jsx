import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { loginApi } from '../../services/api';
import { Phone, Lock, ShieldCheck, ArrowRight } from 'lucide-react';
import logo from '../../assets/images/hoba-labs-logo-horizontal.png';
import { toast } from 'react-toastify';

function Login() {
  const [formData, setFormData] = useState({
    phone: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const response = await loginApi(formData);

      // Save both the user profile and the session token — everything from
      // here on (onboarding, linking Telegram) needs the token to prove who's asking.
      login(
        {
          id: response.user.id,
          firstName: response.user.firstName,
          lastName: response.user.lastName,
          phone: response.user.phone,
          subscription: response.user.subscriptionPlan,
          onboarding_completed: response.user.onboarding_completed,
        },
        response.token
      );

      if (response.user.onboarding_completed) {
        navigate('/dashboard');
      } else {
        navigate('/onboarding');
      }
    } catch (err) {
      console.error('Login failed:', err);
      setErrorMsg(err.message || 'Invalid phone number or password.');
      // toast.error(err.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-center px-6 py-12 select-none">
      <div className="max-w-md mx-auto w-full space-y-1">
        <div className="text-center space-y-1">
          <img src={logo} alt="Hoba Labs Logo" className="mx-auto h-28" />
        </div>

        <form onSubmit={handleLogin} className="bg-slate-900/60 border border-slate-800 rounded-2xl pb-6 px-6 space-y-4 shadow-xl backdrop-blur-md">
          <div className="space-y-2">
            <h2 className="text-2xl text-center font-bold tracking-tight pb-4 pt-4">Welcome Back</h2>

            {errorMsg && (
              <div className="p-3  animate-pulse ease-in-out rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center font-mono">
                {errorMsg}
              </div>
            )}

            <label className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">Phone Number (WhatsApp)</label>
            <div className="relative flex items-center">
              <Phone className="absolute left-3 w-4 h-4 text-slate-500" />
              <input
                type="text"
                name="phone"
                autoComplete="off"
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
                autoComplete="current-password"
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
                <span>Login</span>
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

        <div className="flex items-center justify-center space-x-2 pt-1 text-xs text-slate-500">
          <ShieldCheck className="w-4 h-4 text-orange-500" />
          <span>Hoba Labs Secure Portal</span>
        </div>
      </div>
    </div>
  );
}

export default Login;

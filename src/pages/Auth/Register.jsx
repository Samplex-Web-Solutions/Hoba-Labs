import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { registerApi } from '../../services/api';
import { Link } from 'react-router-dom';
import logo from '../../assets/images/hoba-labs-logo-horizontal.png';
import { User, Phone, Lock, ShieldCheck, ArrowRight } from 'lucide-react';
import { toast } from 'react-toastify';   
import BarLoader from '../../components/common/BarLoader';

function Register() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await registerApi(formData);

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

      navigate('/onboarding');
    } catch (err) {
      console.error('Registration failed:', err.message);
      toast.error(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-center px-6 py-12 select-none">
      <div className="max-w-md mx-auto w-full space-y-2">
        <div className="text-center space-y-1">
          <img src={logo} alt="Hoba Labs Logo" className="mx-auto h-28" />
        </div>
        <form onSubmit={handleRegister} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl backdrop-blur-md">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">First Name</label>
              <div className="relative flex items-center">
                <User className="absolute left-3 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="John"
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-orange-500 transition-colors"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">Last Name</label>
              <div className="relative flex items-center">
                <User className="absolute left-3 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Doe"
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-orange-500 transition-colors"
                />
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">WhatsApp Phone Number</label>
            <div className="relative flex items-center">
              <Phone className="absolute left-3 w-4 h-4 text-slate-500" />
              <input
                type="text"
                name="phone"
                autoComplete="off"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+2340901234578"
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
              <BarLoader />
            ) : (
              <>
                <span>Create Account</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
          <div className="text-center pt-2">
            <p className="text-xs text-slate-400">
              Already have an account?{' '}
              <Link to="/login" className="text-orange-500 font-semibold hover:underline">
                Log in here
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

export default Register;

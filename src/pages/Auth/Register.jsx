import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { registerApi } from '../../services/api';
import { Link } from 'react-router-dom';
import logo from '../../assets/images/hoba-labs-logo-horizontal.png';
import { User, Mail, Phone, Lock, ShieldCheck, ArrowRight, Gift, Check, Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-toastify';   
import BarLoader from '../../components/common/BarLoader';

function Register() {
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    refCode: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuthStore();
  const navigate = useNavigate();

  // Automatically extract 'ref' from URL query parameters on mount
  useEffect(() => {
    const refParam = searchParams.get('ref');
    if (refParam) {
      setFormData(prev => ({ ...prev, refCode: refParam.toUpperCase() }));
    }
  }, [searchParams]);

  // Password Validation Rules
  const passwordCriteria = [
    { label: 'At least 8 characters', met: formData.password.length >= 8 },
    { label: 'At least one lowercase letter', met: /[a-z]/.test(formData.password) },
    { label: 'At least one uppercase letter', met: /[A-Z]/.test(formData.password) },
    { label: 'At least one number', met: /\d/.test(formData.password) },
    { label: 'At least one special character', met: /[^A-Za-z0-9]/.test(formData.password) },
  ];

  const metCriteriaCount = passwordCriteria.filter(c => c.met).length;

  // Determine strength label & bar colors
  const getStrengthInfo = () => {
    if (metCriteriaCount === 0) return { label: '', color: 'bg-slate-800' };
    if (metCriteriaCount <= 2) return { label: 'Weak', color: 'bg-red-500' };
    if (metCriteriaCount <= 4) return { label: 'Medium', color: 'bg-amber-500' };
    return { label: 'Strong', color: 'bg-emerald-500' };
  };

  const strength = getStrengthInfo();

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'phone') {
      const sanitized = value.replace(/[^0-9+]/g, '');
      if (sanitized.indexOf('+') > 0 || sanitized.match(/\+/g)?.length > 1) {
        return;
      }
      setFormData({ ...formData, phone: sanitized });
      return;
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (metCriteriaCount < 5) {
      toast.error('Please meet all password requirements.');
      return;
    }

    setLoading(true);
    try {
      const response = await registerApi(formData);

      login(
        {
          id: response.user.id,
          firstName: response.user.firstName,
          lastName: response.user.lastName,
          email: response.user.email,
          phone: response.user.phone,
          subscription: response.user.subscriptionPlan,
          onboarding_completed: response.user.onboarding_completed,
          referralCode: response.user.referralCode,
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
            <label className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">Email Address (For Billing)</label>
            <div className="relative flex items-center">
              <Mail className="absolute left-3 w-4 h-4 text-slate-500" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john.doe@example.com"
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-orange-500 transition-colors"
              />
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
                placeholder="+2349057973810"
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-orange-500 font-mono transition-colors"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">Password</label>
            <div className="relative flex items-center">
              <Lock className="absolute left-3 w-4 h-4 text-slate-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                autoComplete="new-password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-10 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-orange-500 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 text-slate-500 hover:text-slate-300"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Password Strength Indicator Bars */}
            {formData.password && (
              <div className="space-y-3 pt-2">
                <div className="grid grid-cols-5 gap-1.5">
                  {[1, 2, 3, 4, 5].map((index) => (
                    <div
                      key={index}
                      className={`h-1 rounded-full transition-all duration-300 ${
                        index <= metCriteriaCount ? strength.color : 'bg-slate-800'
                      }`}
                    />
                  ))}
                </div>

                {strength.label && (
                  <p className={`text-xs font-semibold ${
                    strength.label === 'Strong' ? 'text-emerald-400' : strength.label === 'Medium' ? 'text-amber-400' : 'text-red-400'
                  }`}>
                    {strength.label}
                  </p>
                )}

                {/* Password Criteria Checklist */}
                <div className="space-y-1.5 pt-1 text-xs">
                  {passwordCriteria.map((criterion, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center ${criterion.met ? 'text-emerald-400' : 'text-slate-600'}`}>
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span className={criterion.met ? 'text-slate-300' : 'text-slate-500'}>
                        {criterion.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-1 pt-1">
            <label className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">Referral Code (Optional)</label>
            <div className="relative flex items-center">
              <Gift className="absolute left-3 w-4 h-4 text-slate-500" />
              <input
                type="text"
                name="refCode"
                value={formData.refCode}
                onChange={handleChange}
                placeholder="HOBA-XXX0000"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-orange-500 font-mono uppercase transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || metCriteriaCount < 5}
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
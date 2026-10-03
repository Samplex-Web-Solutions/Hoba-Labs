import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import SubscriptionModal from '../../components/common/SubcriptionModal';
import { verifySubscriptionPaymentApi } from '../../services/api';
import {
  User, Phone, TrendingUp, Bot, Users, Copy, Check, Crown,
  BotIcon
} from 'lucide-react';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [botcopied, setBotCopied] = useState(false);
  const frontendUrl = import.meta.env.VITE_FRONTEND_URL;
  const referralCode = user?.referralCode;
  const referralLink = `${frontendUrl}?ref=${referralCode}`;
  const bot_url = import.meta.env.VITE_BOT_URL;

  // Automatically catch and verify payment when Paystack redirects back
  useEffect(() => {
    const paymentStatus = searchParams.get('payment');
    const reference = searchParams.get('reference');

    if (paymentStatus === 'verified' && reference) {
      const verifyPayment = async () => {
        try {
          const data = await verifySubscriptionPaymentApi(reference);
          if (data.success) {
            toast.success('Subscription verified and activated successfully!');
            setSearchParams({});
            window.location.reload(); // Refresh to pull latest user subscription state
          }
        } catch (err) {
          console.error('Verification error:', err);
          toast.error(err.message || 'Payment verification failed.');
        }
      };

      verifyPayment();
    }
  }, [searchParams, setSearchParams]);

  const handleCopyReferral = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast.success('Referral link copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyBotLink = () => {
    navigator.clipboard.writeText(bot_url);
    setBotCopied(true);
    toast.success('Link copied!');
    setTimeout(() => setBotCopied(false), 2000);
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto p-4 md:p-4">

        {/* Top Navigation / Header Bar */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center bg-slate-900 border border-slate-800 rounded-md p-6 mb-8 shadow-xl gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Welcome back, {user?.firstName || user?.first_name || 'Trader'}!
            </h1>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsSubModalOpen(true)}
              className="flex items-center space-x-2 bg-orange-500 hover:bg-orange-600 text-slate-950 font-bold px-4 py-2.5 rounded-md text-xs transition-all shadow-lg shadow-orange-500/10"
            >
              <Crown className="w-4 h-4" />
              <span>{user?.subscription_status === 'Active' ? 'Active Plan' : 'Upgrade Plan'}</span>
            </button>
          </div>
        </header>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left Column: User Profile Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-md p-6 shadow-lg flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
                <h2 className="text-lg font-semibold flex items-center gap-2 text-orange-500">
                  <User className="w-5 h-5" />
                  <span>Profile Details</span>
                </h2>
              </div>

              <div className="space-y-4">
                <div>
                  <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Full Name</span>
                  <p className="text-base font-medium text-slate-200 mt-0.5">
                    {user?.firstName || user?.first_name || ''} {user?.lastName || user?.last_name || ''}
                  </p>
                </div>

                <div>
                  <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Phone Number</span>
                  <p className="text-base font-medium text-slate-200 mt-0.5 flex items-center gap-2">
                    <Phone className="w-4 h-4 text-slate-400" />
                    {user?.phone || 'Not provided'}
                  </p>
                </div>

                <div>
                  <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Subscription Status</span>
                  <p className="text-base font-medium text-orange-400 mt-0.5 capitalize">
                    {user?.subscription_status === 'Active' ? user?.subscription_plan : 'Free Trial'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right 2 Columns: Quick Stats & Referral Banner */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">

            {/* Stat Card 1 */}
            <div className="bg-slate-900 border border-slate-800 rounded-md p-6 shadow-lg relative overflow-hidden group hover:border-orange-500/40 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-orange-500/10 border border-orange-500/20 rounded-md text-orange-500">
                  <Bot className="w-6 h-6" />
                </div>
                <span className="text-emerald-400 text-xs bg-emerald-500/10 px-2 py-0.5 rounded flex items-center gap-1">
                  Active
                </span>
              </div>
              <h3 className="text-slate-400 text-sm font-medium">Telegram Bot Status</h3>
              <p className="text-2xl font-bold text-slate-100 mt-1">{`24/7`}</p>
            </div>

            {/* Stat Card 2 */}
            <div className="bg-slate-900 border border-slate-800 rounded-md p-6 shadow-lg relative overflow-hidden group hover:border-orange-500/40 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-md text-blue-400">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <span className="text-blue-400 text-xs bg-blue-500/10 px-2 py-0.5 rounded">Live Signals</span>
              </div>
              <h3 className="text-slate-400 text-sm font-medium">Active Strategy</h3>
              <p className="text-2xl font-bold text-slate-100 mt-1">Smart Money</p>
              <Link to="/signals">
                <p className="text-xs text-slate-500 mt-2 hover:text-orange-400 transition-colors">View Signals History</p>
              </Link>
            </div>

            {/* Referral Banner Card */}
            <div className="sm:col-span-2 bg-gradient-to-r from-orange-950/40 via-slate-900 to-slate-900 border border-orange-500/20 rounded-md p-6 shadow-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="text-lg font-semibold text-orange-400 flex items-center gap-2">
                  <Users className="w-5 h-5" /> Referral Program ($3 Bonus)
                </h3>
                <p className="text-slate-400 text-sm mt-1">
                  Share your link. Earn $3 automatically when your referral upgrades.
                </p>
              </div>
              <div className="flex flex-col md:flex-row justify-center items-center gap-2 space-y-2 w-full sm:w-auto">
                <input
                  type="text"
                  readOnly
                  value={referralLink}
                  className="bg-slate-950 border border-slate-800 px-3 py-3 rounded-md text-xs font-mono text-slate-300 w-full sm:w-48 focus:outline-none"
                />
                <button
                  onClick={handleCopyReferral}
                  className="bg-orange-500 w-max hover:bg-orange-600 text-slate-950 px-3 py-3 rounded-md text-xs font-bold transition-colors flex items-center space-x-1 shrink-0"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

          </div>
        </div>

        <div className="md:mt-6">
          <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-orange-950/40 border border-orange-500/20 rounded-md p-6 shadow-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="text-lg font-semibold text-orange-400 flex items-center gap-2">
                <BotIcon className="w-5 h-5 md:w-8 md:h-8" /> Telegram Notification
              </h3>
              <p className="text-slate-400 text-sm mt-1">
                Join Our Telegram Bot for Signals Notification
              </p>
            </div>

            <div className="flex py-4 flex-col md:flex-row space-y-2 w-full sm:w-auto">
              <div className="flex flex-col justify-center items-center gap-2 md:flex-row space-y-2 w-full sm:w-auto">
                <input
                  type="text"
                  readOnly
                  value={bot_url}
                  className="bg-slate-950 border border-slate-800 px-3 py-3 rounded-md text-xs font-mono text-slate-300 w-full sm:w-48 focus:outline-none"
                />
                <button
                  onClick={handleCopyBotLink}
                  className="bg-orange-500 w-max hover:bg-orange-600 text-slate-950 px-3 py-3 rounded-md text-xs font-bold transition-colors flex items-center space-x-1 shrink-0"
                >
                  {botcopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{botcopied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

      </main>

      {/* Subscription Modal Integration */}
      <SubscriptionModal
        isOpen={isSubModalOpen}
        onClose={() => setIsSubModalOpen(false)}
      />
    </div>
  );
};

export default Dashboard;
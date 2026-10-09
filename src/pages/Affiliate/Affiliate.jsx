import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Copy, 
  Check, 
  DollarSign, 
  Share2, 
  Award, 
  Loader2, 
  AlertCircle 
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import axios from 'axios';

const Affiliate = () => {
  const { user, token } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [stats, setStats] = useState({
    referralCode: user?.referral_code || '---',
    totalEarnings: 0,
    pendingEarnings: 0,
    referredUsers: []
  });

  // Fetch referral details & referred users list
  useEffect(() => {
    const fetchAffiliateData = async () => {
      try {
        setLoading(true);
        const baseURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api';
        const response = await axios.get(`${baseURL}/affiliate/stats`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true
        });

        if (response.data && response.data.success) {
          setStats(response.data.data);
        }
      } catch (err) {
        console.error('Failed to load affiliate stats:', err.message);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchAffiliateData();
    } else {
      setLoading(false);
    }
  }, [token]);

const referralLink = `${import.meta.env.VITE_FRONTEND_URL}/register?ref=${user?.referralCode}`;
  const handleCopy = (textToCopy) => {
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto text-left">
      {/* Header */}
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-2xl font-semibold text-white flex items-center gap-2">
          <Users className="w-6 h-6 text-orange-500" />
          Affiliate Dashboard
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Invite traders to Hoba Labs and earn $3.00 for every active referral subscription.
        </p>
      </div>

      {loading ? (
        <div className="p-16 text-center text-slate-500 flex flex-col items-center justify-center space-y-3">
          <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
          <p className="text-xs font-mono">Loading affiliate stats...</p>
        </div>
      ) : (
        <>
          {/* Stats Overview Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-md shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs uppercase tracking-wider text-slate-400 font-medium">Total Earned</span>
                <h3 className="text-2xl font-bold text-emerald-400 mt-1">
                  ${Number(stats.totalEarnings || 0).toFixed(2)}
                </h3>
              </div>
              <div className="p-3 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-md">
                <DollarSign className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-5 rounded-md shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs uppercase tracking-wider text-slate-400 font-medium">Pending Earnings</span>
                <h3 className="text-2xl font-bold text-amber-400 mt-1">
                  ${Number(stats.pendingEarnings || 0).toFixed(2)}
                </h3>
              </div>
              <div className="p-3 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-md">
                <Award className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-5 rounded-md shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs uppercase tracking-wider text-slate-400 font-medium">Total Referred</span>
                <h3 className="text-2xl font-bold text-white mt-1">
                  {stats.referredUsers?.length || 0} Traders
                </h3>
              </div>
              <div className="p-3 bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded-md">
                <Users className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Referral Link Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-md p-6 space-y-4 shadow-sm">
            <h2 className="text-base font-semibold text-white flex items-center gap-2">
              <Share2 className="w-5 h-5 text-orange-400" />
              Your Shareable Referral Link
            </h2>
            <p className="text-xs text-slate-400">
              Share this link with friends or inside your trading communities.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="w-full bg-slate-950 border border-slate-800 px-4 py-3 rounded-md font-mono text-xs text-slate-300 truncate">
                {referralLink}
              </div>
              <button
                onClick={() => handleCopy(referralLink)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-slate-950 font-semibold text-xs rounded-md transition shadow-lg shadow-orange-500/10 shrink-0"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied!' : 'Copy Link'}
              </button>
            </div>
          </div>

          {/* Referred Users Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-md overflow-hidden shadow-sm">
            <div className="p-6 border-b border-slate-800">
              <h2 className="text-base font-semibold text-white">Referred Users History</h2>
            </div>

            {stats.referredUsers.length === 0 ? (
              <div className="p-12 text-center text-slate-500">
                <AlertCircle className="w-10 h-10 mx-auto mb-3 opacity-40 text-orange-400" />
                <p className="text-sm font-medium">No referrals yet.</p>
                <p className="text-xs text-slate-600 mt-1">Share your link to start earning rewards!</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-800">
                {stats.referredUsers.map((refUser, idx) => (
                  <div key={idx} className="p-4 flex items-center justify-between hover:bg-slate-850/50 transition">
                    <div className="space-y-0.5">
                      <h4 className="text-sm font-semibold text-white">
                        @{refUser.username || 'Anonymous Trader'}
                      </h4>
                      <p className="text-xs text-slate-400 font-mono">
                        Joined: {new Date(refUser.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="px-2.5 py-1 text-xs font-mono font-medium rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      +$3.00 Earned
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default Affiliate;
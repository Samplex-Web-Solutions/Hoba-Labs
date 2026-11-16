import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../../store/authStore';
import {
  fetchEADashboardStatsApi,
  redeemEALicenseApi,
} from '../../services/api';
import BrokerConnectionModal from '../../components/common/BrokerConnectionModal';
import {
  Activity,
  ArrowUpRight,
  ChevronRight,
  CircleDollarSign,
  Cpu,
  KeyRound,
  LockKeyhole,
  RefreshCw,
  Server,
  ShieldCheck,
  ShoppingBag,
  Wallet,
  Zap,
} from 'lucide-react';
import { toast } from 'react-toastify';
import SubscriptionModal from '../../components/common/SubcriptionModal';

const pageVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.04 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
};

const formatMoney = (value) =>
  `$${Number(value || 0).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

function StatCard({ title, value, caption, icon: Icon, accent = 'orange', valueClass = '' }) {
  const accents = {
    orange: 'bg-orange-500/10 text-orange-400 ring-orange-500/15',
    blue: 'bg-sky-500/10 text-sky-400 ring-sky-500/15',
    green: 'bg-emerald-500/10 text-emerald-400 ring-emerald-500/15',
    violet: 'bg-violet-500/10 text-violet-400 ring-violet-500/15',
  };

  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -3 }}
      className="group rounded-2xl border p-5 border-slate-800/90 bg-slate-900/80 shadow-[0_12px_35px_-24px_rgba(0,0,0,0.8)] transition-colors hover:border-slate-700"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium tracking-wide text-slate-400">{title}</p>
          <p className={`mt-3 text-2xl font-semibold tracking-tight text-white sm:text-[1.7rem] ${valueClass}`}>
            {value}
          </p>
          <p className="mt-1.5 text-[11px] text-slate-500">{caption}</p>
        </div>
        <div className={`rounded-xl p-3 ring-1 ${accents[accent]}`}>
          <Icon size={19} strokeWidth={1.8} />
        </div>
      </div>
    </motion.div>
  );
}

export default function EADashboard() {
  const { user, updateUser } = useAuthStore();

  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(user?.ea_access || false);
  const [stats, setStats] = useState({
    balance: 0,
    equity: 0,
    floating_pnl: 0,
    connection_status: 'DISCONNECTED',
  });
  const [brokerAcc, setBrokerAcc] = useState(null);

  const [licenseKeyInput, setLicenseKeyInput] = useState('');
  const [redeemingKey, setRedeemingKey] = useState(false);

  const [showBrokerModal, setShowBrokerModal] = useState(false);
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);

  const fetchStats = async () => {
    try {
      const data = await fetchEADashboardStatsApi();
      if (data.success) {
        setHasAccess(data.hasEaAccess);
        setStats(data.stats || {
          balance: 0,
          equity: 0,
          floating_pnl: 0,
          connection_status: 'DISCONNECTED',
        });
        setBrokerAcc(data.account || null);
      }
    } catch (err) {
      console.error('Failed to fetch EA stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleRedeemKey = async (e) => {
    e.preventDefault();
    if (!licenseKeyInput.trim()) return;

    setRedeemingKey(true);
    try {
      const res = await redeemEALicenseApi(licenseKeyInput.trim());
      if (res.success) {
        toast.success(res.message);
        setHasAccess(true);
        if (updateUser) updateUser({ ...user, ea_access: true });
        setLicenseKeyInput('');
        setShowBrokerModal(true);
      }
    } catch (err) {
      toast.error(err.message || 'Invalid or already redeemed license key.');
    } finally {
      setRedeemingKey(false);
    }
  };

  const isConnected = stats.connection_status === 'CONNECTED';

  if (loading) {
    return (
      <div className="flex min-h-[55vh] flex-col items-center justify-center gap-3 text-slate-400">
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
          <RefreshCw className="h-6 w-6 animate-spin text-orange-400" />
        </div>
        <p className="text-sm">Preparing your trading dashboard...</p>
      </div>
    );
  }

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      className="mx-auto w-full max-w-6xl space-y-6 pb-12"
    >
      <motion.section
        variants={itemVariants}
        className="relative isolate overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-[#21170f] p-6 sm:p-8"
      >
        <div className="pointer-events-none absolute -right-16 -top-24 -z-10 h-72 w-72 rounded-full bg-orange-500/10 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 right-1/4 -z-10 h-32 w-32 rounded-full bg-amber-400/5 blur-3xl" />

        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div className="max-w-2xl">
            <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              EA Control Centre
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">
              Monitor your MetaTrader 5 account, manage your connection and keep track of your trading activity.
            </p>
          </div>

          <div className={`inline-flex w-fit items-center gap-2 rounded-xl border px-4 py-3 text-xs font-semibold ${
            hasAccess
              ? 'border-emerald-400/20 bg-emerald-400/10 text-emerald-300'
              : 'border-rose-400/20 bg-rose-400/10 text-rose-300'
          }`}>
            {hasAccess ? <ShieldCheck size={17} /> : <LockKeyhole size={17} />}
            {hasAccess ? 'EA access active' : 'EA access locked'}
          </div>
        </div>
      </motion.section>

      <motion.section variants={itemVariants} className="space-y-3">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-sm font-semibold text-white">Account overview</h2>
            <p className="mt-1 text-xs text-slate-500">Your latest connected account metrics</p>
          </div>
          <button
            type="button"
            onClick={fetchStats}
            className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-slate-400 transition hover:bg-slate-800 hover:text-white"
          >
            <RefreshCw size={13} />
            Refresh data
          </button>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Account balance"
            value={formatMoney(stats.balance)}
            caption="Available account funds"
            icon={Wallet}
            accent="orange"
          />
          <StatCard
            title="Account equity"
            value={formatMoney(stats.equity)}
            caption="Balance including open positions"
            icon={CircleDollarSign}
            accent="blue"
          />
          <StatCard
            title="Floating P&L"
            value={formatMoney(stats.floating_pnl)}
            caption="Unrealised profit or loss"
            icon={Activity}
            accent={stats.floating_pnl >= 0 ? 'green' : 'violet'}
            valueClass={stats.floating_pnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}
          />
          <StatCard
            title="Connection status"
            value={isConnected ? 'Connected' : 'Offline'}
            caption={isConnected ? 'Your MT5 account is linked' : 'No active MT5 connection'}
            icon={Server}
            accent={isConnected ? 'green' : 'violet'}
            valueClass={isConnected ? 'text-emerald-400' : 'text-slate-200'}
          />
        </div>
      </motion.section>

      {!hasAccess ? (
        <motion.section
          variants={itemVariants}
          className="mx-auto grid w-full max-w-4xl overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/90 lg:grid-cols-[0.9fr_1.1fr]"
        >
          <div className="relative flex flex-col justify-between overflow-hidden bg-gradient-to-br from-orange-500/15 via-orange-500/5 to-transparent p-6 sm:p-8">
            <div className="pointer-events-none absolute -bottom-16 -left-12 h-48 w-48 rounded-full bg-orange-500/10 blur-3xl" />
            <div>
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-orange-400/20 bg-orange-400/10 text-orange-300">
                <Zap size={23} />
              </div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-orange-300">Get started</p>
              <h2 className="mt-2 text-xl font-semibold leading-snug text-white">
                Put your trading strategy to work.
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-400">
                Activate your Hoba Labs EA plan to connect an MT5 account and access automated execution.
              </p>
            </div>
            <div className="mt-8 flex items-center gap-2 text-xs text-slate-500">
              <ShieldCheck size={15} className="text-emerald-400" />
              Secure account connection
            </div>
          </div>

          <div className="space-y-6 p-6 sm:p-8">
            <div>
              <h3 className="text-sm font-semibold text-white">Activate your EA access</h3>
              <p className="mt-1 text-xs leading-5 text-slate-500">
                Choose a plan or redeem a license key you already have.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsSubModalOpen(true)}
              className="group flex w-full items-center justify-between rounded-2xl bg-gradient-to-r from-orange-500 to-amber-400 px-5 py-4 text-left text-slate-950 shadow-lg shadow-orange-500/10 transition hover:-translate-y-0.5 hover:shadow-orange-500/20"
            >
              <span className="flex items-center gap-3">
                <span className="rounded-xl bg-black/10 p-2.5">
                  <ShoppingBag size={19} />
                </span>
                <span>
                  <span className="block text-sm font-bold">Explore EA plans</span>
                  <span className="mt-0.5 block text-[11px] font-medium text-slate-900/70">Choose the plan that suits you</span>
                </span>
              </span>
              <ArrowUpRight size={19} className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-slate-800" />
              <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-slate-600">or use a license key</span>
              <div className="h-px flex-1 bg-slate-800" />
            </div>

            <form onSubmit={handleRedeemKey} className="space-y-3">
              <label className="block">
                <span className="mb-2 block text-xs font-medium text-slate-300">License key</span>
                <div className="relative">
                  <KeyRound size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    value={licenseKeyInput}
                    onChange={(e) => setLicenseKeyInput(e.target.value)}
                    placeholder="HOBA-EA-XXXX-XXXX-XXXX"
                    required
                    className="w-full rounded-xl border border-slate-700/80 bg-slate-950/80 py-3 pl-11 pr-4 font-mono text-xs tracking-wide text-white outline-none transition placeholder:text-slate-600 focus:border-orange-400 focus:ring-4 focus:ring-orange-400/10"
                  />
                </div>
              </label>
              <button
                type="submit"
                disabled={redeemingKey}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:border-slate-600 hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {redeemingKey ? <RefreshCw size={15} className="animate-spin" /> : <KeyRound size={15} />}
                {redeemingKey ? 'Verifying license...' : 'Activate license'}
              </button>
            </form>
            <p className="text-center text-[11px] leading-5 text-slate-600">
              Need help? Contact the Hoba Labs support team for assistance.
            </p>
          </div>
        </motion.section>
      ) : (
        <motion.section
          variants={itemVariants}
          className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 sm:p-6"
        >
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
            <div className="flex items-start gap-4">
              <div className={`rounded-2xl p-3 ${
                brokerAcc ? 'bg-emerald-400/10 text-emerald-300' : 'bg-orange-400/10 text-orange-300'
              }`}>
                <Cpu size={22} />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-sm font-semibold text-white">MetaTrader 5 connection</h2>
                  <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                    brokerAcc
                      ? 'bg-emerald-400/10 text-emerald-300'
                      : 'bg-slate-800 text-slate-400'
                  }`}>
                    {brokerAcc ? 'ACCOUNT LINKED' : 'NOT CONFIGURED'}
                  </span>
                </div>
                <p className="mt-1.5 text-xs leading-5 text-slate-400">
                  {brokerAcc
                    ? `Account ${brokerAcc.account_login} · ${brokerAcc.server_name}`
                    : 'Connect your MT5 trading account to get your EA environment ready.'}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowBrokerModal(true)}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-xs font-bold text-slate-950 transition hover:bg-orange-400"
            >
              {brokerAcc ? 'Update connection' : 'Connect MT5 account'}
              <ChevronRight size={15} />
            </button>
          </div>
        </motion.section>
      )}

      {/* Standalone Broker Connection Modal Component */}
      <BrokerConnectionModal
        isOpen={showBrokerModal}
        onClose={() => setShowBrokerModal(false)}
        onSuccess={fetchStats}
        user={user}
      />

      <SubscriptionModal
        isOpen={isSubModalOpen}
        onClose={() => setIsSubModalOpen(false)}
        mode="ea"
      />
    </motion.div>
  );
}
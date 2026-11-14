import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import SubscriptionModal from '../../components/common/SubcriptionModal';
import { verifySubscriptionPaymentApi } from '../../services/api';
import DashboardHeader from '../../components/common/DashboardHeader';
import {
  User,
  Phone,
  TrendingUp,
  Bot,
  Users,
  Copy,
  Check,
  Crown,
  ArrowUpRight,
  ShieldCheck,
  Zap,
  Sparkles,
  CalendarDays,
  ExternalLink,
  Link2,
  Activity,
} from 'lucide-react';
import { showToast } from '../../utils/toast.js';

const ease = [0.22, 1, 0.36, 1];

const pageVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.09, delayChildren: 0.06 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 22, filter: 'blur(5px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.55, ease },
  },
};

const MotionCard = ({ children, className = '', delay = 0 }) => {
  const reduceMotion = useReducedMotion();

  return (
    <motion.section
      variants={itemVariants}
      whileHover={reduceMotion ? undefined : { y: -4, transition: { duration: 0.2 } }}
      className={className}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </motion.section>
  );
};

const Dashboard = ({ onOpenSubscriptionModal }) => {
  const { user } = useAuthStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [botcopied, setBotCopied] = useState(false);
  const reduceMotion = useReducedMotion();

  const sub = user?.subscription || {};
  const subStatus = sub.status || 'inactive';
  const isPaid = ['active', 'monthly', 'annual'].includes(subStatus);
  const isTrialing = subStatus === 'trialing';

  const formattedTrialDate = sub?.trialEndsAt
    ? new Date(sub.trialEndsAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : '';

  const planDisplay = isPaid
    ? sub.planType || 'Pro Plan'
    : isTrialing
      ? `Free Trial${formattedTrialDate ? ` · Ends ${formattedTrialDate}` : ''}`
      : 'Free Tier';

  const referralLink = `${import.meta.env.VITE_FRONTEND_URL}/register?ref=${user?.referralCode || ''}`;
  const botUrl = import.meta.env.VITE_BOT_URL || '';

  useEffect(() => {
    const paymentStatus = searchParams.get('payment');
    const reference = searchParams.get('reference');

    if (paymentStatus === 'verified' && reference) {
      const verifyPayment = async () => {
        try {
          const data = await verifySubscriptionPaymentApi(reference);
          if (data.success) {
            showToast.success('Subscription verified and activated successfully!');
            setSearchParams({});
            window.location.reload();
          }
        } catch (err) {
          console.error('Verification error:', err);
          showToast.error(err.message || 'Payment verification failed.');
        }
      };

      verifyPayment();
    } else if (paymentStatus === 'crypto_success') {
      showToast.success('Crypto payment received! Updating subscription...');
      setSearchParams({});
      const timer = setTimeout(() => window.location.reload(), 2000);
      return () => clearTimeout(timer);
    } else if (paymentStatus === 'cancelled') {
      showToast.error('Payment session was cancelled.');
      setSearchParams({});
    }
  }, [searchParams, setSearchParams]);

  const copyToClipboard = async (value, setCopiedState, successMessage) => {
    if (!value) {
      showToast.error('Link is not available yet.');
      return;
    }

    try {
      await navigator.clipboard.writeText(value);
      setCopiedState(true);
      showToast.success(successMessage);
      setTimeout(() => setCopiedState(false), 2000);
    } catch {
      showToast.error('Unable to copy link. Please copy it manually.');
    }
  };

  const firstName = user?.firstName || user?.first_name || 'Trader';
  const fullName = `${user?.firstName || user?.first_name || ''} ${user?.lastName || user?.last_name || ''}`.trim();

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#080b12] text-slate-100">
      {/* Ambient background */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-48 right-[-8rem] h-[28rem] w-[28rem] rounded-full bg-orange-500/[0.09] blur-[110px]" />
        <div className="absolute left-[-12rem] top-[38%] h-[25rem] w-[25rem] rounded-full bg-amber-500/[0.05] blur-[120px]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.018)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.018)_1px,transparent_1px)] bg-[size:52px_52px] [mask-image:linear-gradient(to_bottom,black,transparent_78%)]" />
      </div>

      <motion.main
        variants={pageVariants}
        initial={reduceMotion ? false : 'hidden'}
        animate="visible"
        className="relative z-10 mx-auto flex w-full max-w-[1600px] flex-col gap-7 px-4 py-5 sm:px-6 lg:px-8 lg:py-8"
      >
        {/* Top bar */}
        <motion.header
          variants={itemVariants}
          className="flex flex-col gap-5 rounded-2xl border border-white/[0.07] bg-slate-900/65 p-5 shadow-2xl shadow-black/10 backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between sm:p-6"
        >
          <div className="min-w-0">
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Welcome back, {firstName}
              <motion.span
                aria-hidden="true"
                className="ml-1 inline-block origin-bottom"
                animate={reduceMotion ? undefined : { rotate: [0, 16, -7, 0] }}
                transition={{ duration: 1.1, delay: 0.5 }}
              >
                👋
              </motion.span>
            </h1>
            <p className="mt-1.5 text-sm text-slate-400">
              Your trading workspace is ready. Here&apos;s your account overview.
            </p>
          </div>
          <div className="w-full sm:w-auto">
            <DashboardHeader />
          </div>
        </motion.header>

        {/* Overview heading */}
        <motion.div variants={itemVariants} className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Overview</p>
            <h2 className="mt-1 text-xl font-semibold text-white">Account summary</h2>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/15 bg-emerald-400/[0.07] px-3 py-1.5 text-xs font-medium text-emerald-300">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-50" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            Account connected
          </div>
        </motion.div>

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
          {/* Profile */}
          <MotionCard className="xl:col-span-4">
            <div className="relative h-full overflow-hidden rounded-2xl border border-white/[0.08] bg-slate-900/75 p-6 shadow-xl shadow-black/10 backdrop-blur-xl">
              <div className="absolute right-0 top-0 h-36 w-36 rounded-full bg-orange-500/[0.08] blur-3xl" />
              <div className="relative">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-semibold text-white">
                    <span className="rounded-xl border border-orange-400/20 bg-orange-400/10 p-2 text-orange-300">
                      <User size={17} />
                    </span>
                    Profile details
                  </div>
                  <span className="rounded-full border border-white/[0.08] bg-white/[0.04] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    Account
                  </span>
                </div>

                <div className="mt-7 flex items-center gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-400 to-amber-600 text-xl font-bold text-slate-950 shadow-lg shadow-orange-500/20">
                    {(firstName?.[0] || 'T').toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <h3 className="truncate text-lg font-semibold text-white">{fullName || 'Trader account'}</h3>
                    <p className="mt-0.5 text-xs text-slate-500">Hoba Labs member</p>
                  </div>
                </div>

                <div className="mt-7 space-y-4">
                  <div className="flex items-start gap-3 border-b border-white/[0.06] pb-4">
                    <Phone size={16} className="mt-0.5 text-slate-500" />
                    <div className="min-w-0">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">Phone number</p>
                      <p className="mt-1 break-words text-sm font-medium text-slate-200">{user?.phone || 'Not provided'}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <ShieldCheck size={16} className="mt-0.5 text-slate-500" />
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">Subscription</p>
                      <div className="mt-1 flex flex-wrap items-center gap-2">
                        <p className="text-sm font-semibold capitalize text-orange-300">{planDisplay}</p>
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${isPaid ? 'bg-emerald-400/10 text-emerald-300' : isTrialing ? 'bg-blue-400/10 text-blue-300' : 'bg-slate-700/60 text-slate-300'}`}>
                          {isPaid ? 'Active' : isTrialing ? 'Trial' : 'Free'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (onOpenSubscriptionModal) onOpenSubscriptionModal();
                    else setIsSubModalOpen(true);
                  }}
                  className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-400 to-amber-500 px-4 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-orange-500/15 transition duration-200 hover:-translate-y-0.5 hover:shadow-orange-500/25 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:ring-offset-2 focus:ring-offset-slate-900"
                >
                  {isPaid ? <Crown size={16} /> : <Zap size={16} />}
                  {isPaid ? 'Manage subscription' : 'Upgrade your plan'}
                  <ArrowUpRight size={16} />
                </button>
              </div>
            </div>
          </MotionCard>

          {/* Status and strategy cards */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:col-span-8">
            <MotionCard>
              <div className="group relative h-full overflow-hidden rounded-2xl border border-white/[0.08] bg-slate-900/75 p-6 backdrop-blur-xl transition-colors hover:border-emerald-400/30">
                <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-emerald-400/[0.07] blur-2xl transition-transform duration-500 group-hover:scale-125" />
                <div className="relative flex items-start justify-between">
                  <div className="rounded-xl border border-emerald-400/15 bg-emerald-400/[0.08] p-3 text-emerald-300">
                    <Bot size={22} />
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/15 bg-emerald-400/[0.07] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    Active
                  </span>
                </div>
                <p className="relative mt-7 text-sm font-medium text-slate-400">Telegram bot status</p>
                <div className="relative mt-1 flex items-end justify-between gap-3">
                  <h3 className="text-3xl font-bold tracking-tight text-white">24/7</h3>
                  <Activity className="mb-1 text-emerald-300/70" size={22} />
                </div>
                <p className="relative mt-2 text-xs text-slate-500">Signal notifications around the clock</p>
              </div>
            </MotionCard>

            <MotionCard>
              <div className="group relative h-full overflow-hidden rounded-2xl border border-white/[0.08] bg-slate-900/75 p-6 backdrop-blur-xl transition-colors hover:border-orange-400/30">
                <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-orange-400/[0.07] blur-2xl transition-transform duration-500 group-hover:scale-125" />
                <div className="relative flex items-start justify-between">
                  <div className="rounded-xl border border-orange-400/15 bg-orange-400/[0.08] p-3 text-orange-300">
                    <TrendingUp size={22} />
                  </div>
                  <span className="rounded-full border border-blue-400/15 bg-blue-400/[0.07] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-blue-300">
                    Live signals
                  </span>
                </div>
                <p className="relative mt-7 text-sm font-medium text-slate-400">Active strategy</p>
                <h3 className="relative mt-1 text-xl font-bold tracking-tight text-white">HOBA LABS ENGINE</h3>
                <Link
                  to="/signals"
                  className="relative mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-orange-300 transition-colors hover:text-orange-200"
                >
                  View signals history <ArrowUpRight size={14} />
                </Link>
              </div>
            </MotionCard>

            {/* Referral */}
            <MotionCard className="sm:col-span-2">
              <div className="relative overflow-hidden rounded-2xl border border-orange-400/20 bg-gradient-to-br from-orange-500/[0.13] via-slate-900/90 to-slate-900 p-6 shadow-xl shadow-black/10 sm:p-7">
                <div className="absolute -right-12 -top-16 h-56 w-56 rounded-full border border-orange-300/[0.08]" />
                <div className="absolute -right-3 -top-7 h-40 w-40 rounded-full border border-orange-300/[0.08]" />
                <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                  <div className="max-w-md">
                    <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-orange-300/15 bg-orange-300/[0.08] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-orange-200">
                      <Users size={13} /> Referral rewards
                    </div>
                    <h3 className="text-xl font-bold text-white sm:text-2xl">Invite traders. Earn $3.</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-400">
                      Share your referral link and earn a $3 bonus automatically when someone you refer upgrades.
                    </p>
                  </div>
                  <div className="flex w-full flex-col gap-2 sm:flex-row lg:max-w-[430px]">
                    <div className="relative min-w-0 flex-1">
                      <Link2 size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input
                        type="text"
                        readOnly
                        aria-label="Your referral link"
                        value={referralLink}
                        className="h-12 w-full rounded-xl border border-white/[0.09] bg-slate-950/70 pl-9 pr-3 text-xs text-slate-300 outline-none ring-orange-400/30 transition focus:ring-2"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(referralLink, setCopied, 'Referral link copied!')}
                      className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-orange-400 px-5 text-sm font-bold text-slate-950 transition duration-200 hover:-translate-y-0.5 hover:bg-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-200"
                    >
                      {copied ? <Check size={16} /> : <Copy size={16} />}
                      {copied ? 'Copied' : 'Copy link'}
                    </button>
                  </div>
                </div>
              </div>
            </MotionCard>
          </div>
        </div>

        {/* Telegram connection */}
        <MotionCard>
          <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-slate-900/75 p-6 shadow-xl shadow-black/10 backdrop-blur-xl sm:p-7">
            <div className="absolute -right-10 -top-20 h-56 w-56 rounded-full bg-blue-500/[0.07] blur-3xl" />
            <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-start gap-4">
                <div className="rounded-2xl border border-blue-400/15 bg-blue-400/[0.08] p-3.5 text-blue-300">
                  <Bot size={24} />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-bold text-white">Telegram notifications</h3>
                    <span className="rounded-full bg-blue-400/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-blue-300">Stay connected</span>
                  </div>
                  <p className="mt-1.5 max-w-lg text-sm leading-6 text-slate-400">
                    Connect with the Hoba Labs Telegram bot to receive trading signal notifications directly.
                  </p>
                </div>
              </div>

              <div className="flex w-full flex-col gap-2 sm:flex-row lg:max-w-[430px]">
                <div className="relative min-w-0 flex-1">
                  <ExternalLink size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    readOnly
                    aria-label="Telegram bot link"
                    value={botUrl}
                    className="h-12 w-full rounded-xl border border-white/[0.09] bg-slate-950/70 pl-9 pr-3 text-xs text-slate-300 outline-none ring-blue-400/30 transition focus:ring-2"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard(botUrl, setBotCopied, 'Telegram bot link copied!')}
                  className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-xl border border-blue-300/20 bg-blue-400/10 px-5 text-sm font-bold text-blue-200 transition duration-200 hover:-translate-y-0.5 hover:bg-blue-400/20 focus:outline-none focus:ring-2 focus:ring-blue-300"
                >
                  {botcopied ? <Check size={16} /> : <Copy size={16} />}
                  {botcopied ? 'Copied' : 'Copy link'}
                </button>
              </div>
            </div>
          </div>
        </MotionCard>

        <motion.footer
          variants={itemVariants}
          className="flex flex-col items-center justify-between gap-2 border-t border-white/[0.06] pt-5 text-center text-xs text-slate-600 sm:flex-row sm:text-left"
        >
          <p>© {new Date().getFullYear()} Hoba Labs. Trade with clarity.</p>
          <p className="inline-flex items-center gap-1.5"><CalendarDays size={13} /> Your trading journey, one setup at a time.</p>
        </motion.footer>
      </motion.main>

      <SubscriptionModal
        isOpen={isSubModalOpen}
        onClose={() => setIsSubModalOpen(false)}
      />
    </div>
  );
};

export default Dashboard;

// src/components/modals/SubscriptionModal.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  X,
  CheckCircle2,
  Loader2,
  LayersPlus,
  CreditCard,
  Coins,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Clock3,
  BadgeCheck,
  LockKeyhole,
  Cpu,
  Radio,
} from 'lucide-react';
import {
  getSubscriptionPlansApi,
  initializeSubscriptionPaymentApi,
  initializeCryptoPaymentApi,
} from '../../services/api';
import { toast } from 'react-toastify';

const ease = [0.22, 1, 0.36, 1];

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.22 } },
  exit: { opacity: 0, transition: { duration: 0.18 } },
};

const panelVariants = {
  hidden: { opacity: 0, y: 28, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.32, ease } },
  exit: { opacity: 0, y: 20, scale: 0.98, transition: { duration: 0.2, ease: 'easeIn' } },
};

const contentVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.28, ease } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.16 } },
};

/**
 * @param {Object} props
 * @param {boolean} props.isOpen
 * @param {Function} props.onClose
 * @param {'all' | 'ea' | 'signals'} [props.mode='all'] - Filter plans by type
 */
const SubscriptionModal = ({ isOpen, onClose, mode = 'all' }) => {
  const [plans, setPlans] = useState([]);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [selectedPlanKey, setSelectedPlanKey] = useState('');
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!isOpen) return undefined;

    let cancelled = false;

    const loadPlans = async () => {
      setLoading(true);
      try {
        const data = await getSubscriptionPlansApi();
        if (!cancelled && data.success && data.plans?.length > 0) {
          // Explicitly filter plans based on mode prop
          let filteredPlans = data.plans;
          const targetMode = (mode || 'all').toLowerCase();

          if (targetMode === 'ea') {
            filteredPlans = data.plans.filter((p) => p.plan_key.toLowerCase().includes('ea'));
          } else if (targetMode === 'signals') {
            filteredPlans = data.plans.filter((p) => !p.plan_key.toLowerCase().includes('ea'));
          }

          setPlans(filteredPlans);

          if (filteredPlans.length > 0) {
            setSelectedPlanKey((current) =>
              filteredPlans.some((plan) => plan.plan_key === current)
                ? current
                : filteredPlans[0].plan_key
            );
          }
        } else if (!cancelled) {
          setPlans([]);
        }
      } catch (err) {
        if (!cancelled) {
          console.error('Failed to load plans:', err);
          toast.error(err.message || 'Could not load subscription packages.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadPlans();
    return () => {
      cancelled = true;
    };
  }, [isOpen, mode]); // <-- Added 'mode' here so it re-filters correctly when changed

  useEffect(() => {
    if (!isOpen) {
      setSelectedMethod(null);
      setProcessing(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && !processing) onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, processing]);

  const handleCheckout = async () => {
    if (!selectedPlanKey || !selectedMethod) {
      toast.error('Please select a payment method and plan.');
      return;
    }

    setProcessing(true);
    try {
      if (selectedMethod === 'paystack') {
        const data = await initializeSubscriptionPaymentApi(selectedPlanKey);
        if (data.success && data.authorization_url) {
          window.location.href = data.authorization_url;
          return;
        }
      } else if (selectedMethod === 'crypto') {
        const data = await initializeCryptoPaymentApi(selectedPlanKey);
        if (data.success && data.invoice_url) {
          window.location.href = data.invoice_url;
          return;
        }
      }

      toast.error('Unable to create your payment session. Please try again.');
      setProcessing(false);
    } catch (err) {
      console.error('Checkout error:', err);
      toast.error(err.message || 'Failed to start payment session.');
      setProcessing(false);
    }
  };

  if (!isOpen) return null;

  const activePlan = plans.find((plan) => plan.plan_key === selectedPlanKey);
  const isEaMode = mode === 'ea' || (activePlan && activePlan.plan_key.toLowerCase().includes('ea'));

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-end justify-center bg-black/75 p-0 backdrop-blur-md sm:items-center sm:p-4"
          variants={backdropVariants}
          initial={reduceMotion ? false : 'hidden'}
          animate="visible"
          exit="exit"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !processing) onClose();
          }}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="subscription-modal-title"
            variants={reduceMotion ? undefined : panelVariants}
            initial={reduceMotion ? false : 'hidden'}
            animate="visible"
            exit="exit"
            className="relative flex max-h-[94vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-[28px] border border-white/10 bg-[#0b101b] shadow-[0_30px_100px_rgba(0,0,0,0.6)] sm:max-h-[90vh] sm:rounded-[28px]"
          >
            {/* Ambient highlights */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
              <div className={`absolute -right-20 -top-24 h-64 w-64 rounded-full blur-[90px] ${isEaMode ? 'bg-orange-500/15' : 'bg-blue-500/15'}`} />
              <div className="absolute -bottom-28 -left-20 h-64 w-64 rounded-full bg-amber-500/[0.06] blur-[90px]" />
            </div>

            {/* Modal Header */}
            <div className="relative flex items-center justify-between border-b border-white/[0.07] px-5 py-4 sm:px-7">
              <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl border ${
                  isEaMode 
                    ? 'border-orange-400/20 bg-orange-400/10 text-orange-300' 
                    : 'border-blue-400/20 bg-blue-400/10 text-blue-300'
                }`}>
                  {isEaMode ? <Cpu size={19} /> : <Radio size={19} />}
                </div>
                <div>
                  <p className={`text-[10px] font-bold uppercase tracking-[0.2em] ${isEaMode ? 'text-orange-300' : 'text-blue-300'}`}>
                    {isEaMode ? 'EA Auto-Execution' : 'Signal Subscriptions'}
                  </p>
                  <p className="mt-0.5 text-sm font-semibold text-white">
                    {isEaMode ? 'Automated Trading Checkout' : 'Signal Broadcast Access'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                disabled={processing}
                aria-label="Close subscription modal"
                className="rounded-xl border border-white/[0.08] bg-white/[0.04] p-2.5 text-slate-400 transition hover:border-white/20 hover:bg-white/[0.08] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                <X size={17} />
              </button>
            </div>

            <div className="relative overflow-y-auto px-5 py-6 sm:px-7 sm:py-7">
              <div className="mb-6">
                <div className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
                  <span className={`h-1.5 w-1.5 rounded-full ${selectedMethod ? 'bg-emerald-400' : isEaMode ? 'bg-orange-400' : 'bg-blue-400'}`} />
                  Step {selectedMethod ? '2' : '1'} of 2
                </div>
                <div className="mb-4 h-1 overflow-hidden rounded-full bg-white/[0.07]">
                  <motion.div
                    className={`h-full rounded-full bg-gradient-to-r ${
                      isEaMode ? 'from-orange-400 to-amber-300' : 'from-blue-400 to-cyan-300'
                    }`}
                    initial={false}
                    animate={{ width: selectedMethod ? '100%' : '50%' }}
                    transition={{ duration: reduceMotion ? 0 : 0.35, ease }}
                  />
                </div>
              </div>

              <AnimatePresence mode="wait">
                {loading ? (
                  <motion.div
                    key="loading"
                    variants={contentVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="flex min-h-[280px] flex-col items-center justify-center text-center"
                  >
                    <div className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border ${
                      isEaMode ? 'border-orange-400/20 bg-orange-400/10 text-orange-300' : 'border-blue-400/20 bg-blue-400/10 text-blue-300'
                    }`}>
                      <Loader2 className="animate-spin" size={24} />
                    </div>
                    <h2 className="text-base font-semibold text-white">Preparing packages</h2>
                    <p className="mt-1 text-xs text-slate-500">Loading {isEaMode ? 'EA auto-execution' : 'signal'} plans...</p>
                  </motion.div>
                ) : plans.length === 0 ? (
                  <motion.div
                    key="empty"
                    variants={contentVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="flex min-h-[280px] flex-col items-center justify-center text-center"
                  >
                    <div className="mb-4 rounded-2xl border border-amber-400/20 bg-amber-400/10 p-4 text-amber-300">
                      <LayersPlus size={24} />
                    </div>
                    <h2 className="text-base font-semibold text-white">No plans found</h2>
                    <p className="mt-1 max-w-xs text-sm leading-6 text-slate-400">
                      No {isEaMode ? 'EA execution' : 'signal'} plans are available at the moment.
                    </p>
                  </motion.div>
                ) : !selectedMethod ? (
                  /* Step 1: Select Payment Method */
                  <motion.div
                    key="method"
                    variants={contentVariants}
                    initial={reduceMotion ? false : 'hidden'}
                    animate="visible"
                    exit="exit"
                  >
                    <div className="mb-6 text-center">
                      <h2 id="subscription-modal-title" className="text-2xl font-bold tracking-tight text-white">
                        Choose payment method
                      </h2>
                      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">
                        Select how you would like to complete your {isEaMode ? 'EA subscription' : 'signal subscription'}.
                      </p>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <motion.button
                        type="button"
                        whileHover={reduceMotion ? undefined : { y: -3 }}
                        whileTap={reduceMotion ? undefined : { scale: 0.99 }}
                        onClick={() => setSelectedMethod('paystack')}
                        className={`group rounded-2xl border border-white/[0.09] bg-white/[0.025] p-5 text-left transition-colors focus:outline-none focus:ring-2 ${
                          isEaMode 
                            ? 'hover:border-orange-400/40 hover:bg-orange-400/[0.05] focus:ring-orange-300/50' 
                            : 'hover:border-blue-400/40 hover:bg-blue-400/[0.05] focus:ring-blue-300/50'
                        }`}
                      >
                        <div className="mb-5 flex items-center justify-between">
                          <div className={`rounded-xl border p-3 ${
                            isEaMode ? 'border-orange-400/20 bg-orange-400/10 text-orange-300' : 'border-blue-400/20 bg-blue-400/10 text-blue-300'
                          }`}>
                            <CreditCard size={23} />
                          </div>
                          <ArrowRight size={18} className="text-slate-600 transition group-hover:translate-x-1 group-hover:text-white" />
                        </div>
                        <h3 className="text-sm font-bold text-white">Bank transfer / Card</h3>
                        <p className={`mt-1 text-xs font-medium ${isEaMode ? 'text-orange-200' : 'text-blue-200'}`}>Paystack · Nigerian Naira</p>
                        <p className="mt-3 text-xs leading-5 text-slate-500">
                          Instant activation via card or direct bank transfer.
                        </p>
                      </motion.button>

                      <motion.button
                        type="button"
                        whileHover={reduceMotion ? undefined : { y: -3 }}
                        whileTap={reduceMotion ? undefined : { scale: 0.99 }}
                        onClick={() => setSelectedMethod('crypto')}
                        className="group rounded-2xl border border-white/[0.09] bg-white/[0.025] p-5 text-left transition-colors hover:border-amber-300/40 hover:bg-amber-300/[0.05] focus:outline-none focus:ring-2 focus:ring-amber-300/50"
                      >
                        <div className="mb-5 flex items-center justify-between">
                          <div className="rounded-xl border border-amber-300/20 bg-amber-300/10 p-3 text-amber-200">
                            <Coins size={23} />
                          </div>
                          <ArrowRight size={18} className="text-slate-600 transition group-hover:translate-x-1 group-hover:text-amber-200" />
                        </div>
                        <h3 className="text-sm font-bold text-white">Cryptocurrency</h3>
                        <p className="mt-1 text-xs font-medium text-amber-200">NOWPayments · USD</p>
                        <p className="mt-3 text-xs leading-5 text-slate-500">
                          Pay using USDT, BTC, ETH, or supported crypto.
                        </p>
                      </motion.button>
                    </div>
                  </motion.div>
                ) : (
                  /* Step 2: Select Specific Plan */
                  <motion.div
                    key="plans"
                    variants={contentVariants}
                    initial={reduceMotion ? false : 'hidden'}
                    animate="visible"
                    exit="exit"
                  >
                    <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                      <button
                        type="button"
                        onClick={() => setSelectedMethod(null)}
                        className="inline-flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs font-semibold text-slate-400 transition hover:bg-white/[0.05] hover:text-white"
                      >
                        <ArrowLeft size={15} /> Change payment method
                      </button>
                      <span className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-300">
                        {selectedMethod === 'paystack' ? <CreditCard size={13} className={isEaMode ? 'text-orange-300' : 'text-blue-300'} /> : <Coins size={13} className="text-amber-200" />}
                        {selectedMethod === 'paystack' ? 'Paystack · NGN' : 'Crypto · USD'}
                      </span>
                    </div>

                    <div className="mb-5">
                      <h2 id="subscription-modal-title" className="text-2xl font-bold tracking-tight text-white">
                        Select your {isEaMode ? 'EA' : 'signal'} plan
                      </h2>
                      <p className="mt-1.5 text-sm text-slate-400">
                        {isEaMode 
                          ? 'Includes dedicated MetaApi cloud container execution & 1-to-1 license key.' 
                          : 'Includes 24/7 web dashboard signal access & Telegram alerts.'}
                      </p>
                    </div>

                    <div className={`grid gap-3 ${plans.length > 2 ? 'sm:grid-cols-3' : 'sm:grid-cols-2'}`}>
                      {plans.map((plan, index) => {
                        const isSelected = selectedPlanKey === plan.plan_key;
                        const price = selectedMethod === 'paystack'
                          ? `₦${Number(plan.naira_price || 0).toLocaleString()}`
                          : `$${Number(plan.amount || 0).toFixed(2)}`;

                        return (
                          <motion.button
                            key={plan.plan_key}
                            type="button"
                            onClick={() => setSelectedPlanKey(plan.plan_key)}
                            whileHover={reduceMotion ? undefined : { y: -3 }}
                            whileTap={reduceMotion ? undefined : { scale: 0.985 }}
                            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.25, delay: index * 0.06, ease }}
                            aria-pressed={isSelected}
                            className={`relative flex min-h-[150px] flex-col rounded-2xl border p-4 text-left transition-all focus:outline-none focus:ring-2 ${
                              isSelected
                                ? isEaMode 
                                  ? 'border-orange-400/70 bg-orange-400/[0.09] shadow-lg shadow-orange-500/[0.08] focus:ring-orange-300/50' 
                                  : 'border-blue-400/70 bg-blue-400/[0.09] shadow-lg shadow-blue-500/[0.08] focus:ring-blue-300/50'
                                : 'border-white/[0.08] bg-white/[0.025] hover:border-white/20 hover:bg-white/[0.045]'
                            }`}
                          >
                            {isSelected && (
                              <motion.span
                                layoutId="selected-plan-indicator"
                                className={`absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full text-slate-950 ${
                                  isEaMode ? 'bg-orange-400' : 'bg-blue-400'
                                }`}
                              >
                                <CheckCircle2 size={13} />
                              </motion.span>
                            )}
                            <span className={`pr-6 text-xs font-semibold ${isSelected ? (isEaMode ? 'text-orange-200' : 'text-blue-200') : 'text-slate-300'}`}>
                              {plan.name}
                            </span>
                            <span className="mt-5 text-2xl font-bold tracking-tight text-white">{price}</span>
                            <span className="mt-1 inline-flex items-center gap-1.5 text-[11px] text-slate-500">
                              <Clock3 size={12} /> {plan.days} days
                            </span>
                          </motion.button>
                        );
                      })}
                    </div>

                    {/* Features checklist based on mode */}
                    <div className="mt-5 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4">
                      <div className="mb-3 flex items-center gap-2 text-xs font-semibold text-white">
                        <BadgeCheck size={16} className="text-emerald-300" />
                        Included features
                      </div>
                      <div className="space-y-2.5 text-xs leading-5 text-slate-400">
                        {isEaMode ? (
                          <>
                            <div className="flex items-start gap-2.5">
                              <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-emerald-400" />
                              <span>Dedicated MetaApi Cloud Container & Auto Execution</span>
                            </div>
                            <div className="flex items-start gap-2.5">
                              <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-emerald-400" />
                              <span>Single-Use EA License Key (Emailed automatically)</span>
                            </div>
                            <div className="flex items-start gap-2.5">
                              <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-emerald-400" />
                              <span>Live MT5 Balance, Equity & PnL Performance Dashboard</span>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="flex items-start gap-2.5">
                              <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-emerald-400" />
                              <span>Full Access to Live & Historical XAU/USD Signals</span>
                            </div>
                            <div className="flex items-start gap-2.5">
                              <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-emerald-400" />
                              <span>24/7 Telegram Broadcast Channel & Web App Alerts</span>
                            </div>
                            <div className="flex items-start gap-2.5">
                              <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-emerald-400" />
                              <span>Structural Market Engine Analysis & Economic Calendar</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    <div className={`mt-5 rounded-2xl border p-4 ${
                      isEaMode 
                        ? 'border-orange-400/15 bg-gradient-to-r from-orange-400/[0.08] to-transparent' 
                        : 'border-blue-400/15 bg-gradient-to-r from-blue-400/[0.08] to-transparent'
                    }`}>
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">Selected plan</p>
                          <p className="mt-1 text-sm font-semibold text-white">{activePlan?.name || 'Select a plan'}</p>
                        </div>
                        <p className={`text-xl font-bold ${isEaMode ? 'text-orange-200' : 'text-blue-200'}`}>
                          {activePlan
                            ? selectedMethod === 'paystack'
                              ? `₦${Number(activePlan.naira_price || 0).toLocaleString()}`
                              : `$${Number(activePlan.amount || 0).toFixed(2)}`
                            : '—'}
                        </p>
                      </div>
                    </div>

                    <motion.button
                      type="button"
                      onClick={handleCheckout}
                      disabled={processing || !activePlan}
                      whileHover={reduceMotion || processing ? undefined : { y: -2 }}
                      whileTap={reduceMotion || processing ? undefined : { scale: 0.99 }}
                      className={`mt-4 flex w-full items-center justify-center gap-2 rounded-xl px-5 py-4 text-sm font-bold text-slate-950 shadow-lg transition disabled:cursor-not-allowed disabled:opacity-60 ${
                        isEaMode 
                          ? 'bg-gradient-to-r from-orange-400 to-amber-400 shadow-orange-500/15 hover:from-orange-300 hover:to-amber-300' 
                          : 'bg-gradient-to-r from-blue-400 to-cyan-400 shadow-blue-500/15 hover:from-blue-300 hover:to-cyan-300'
                      }`}
                    >
                      {processing ? (
                        <>
                          <Loader2 size={17} className="animate-spin" />
                          Connecting to {selectedMethod === 'paystack' ? 'Paystack' : 'NOWPayments'}...
                        </>
                      ) : (
                        <>
                          <LockKeyhole size={16} />
                          Continue to secure payment
                          <ArrowRight size={16} />
                        </>
                      )}
                    </motion.button>
                    <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-[10px] text-slate-500">
                      <ShieldCheck size={12} /> Payment is processed securely by {selectedMethod === 'paystack' ? 'Paystack' : 'NOWPayments'}.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="relative flex items-center justify-center gap-2 border-t border-white/[0.06] px-5 py-3 text-[10px] text-slate-600">
              <ShieldCheck size={12} />
              Secure checkout · Hoba Labs
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SubscriptionModal;
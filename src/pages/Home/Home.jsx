import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  motion,
  useReducedMotion,
} from 'framer-motion';
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Bot,
  Check,
  ChevronDown,
  Cpu,
  Menu,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  Star,
  Wallet,
  X,
  Zap,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

/*
 * Hoba Labs landing page
 * Animation note:
 * Reveal uses Framer Motion's whileInView (Intersection Observer underneath).
 * viewport.once is false so sections can animate again when they re-enter view.
 */

const ease = [0.22, 1, 0.36, 1];

const reveal = {
  hidden: { opacity: 0, y: 34 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, ease },
  },
};

const stagger = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.06,
    },
  },
};

const Reveal = ({
  children,
  className = '',
  delay = 0,
  amount = 0.18,
  once = false,
}) => {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      variants={reveal}
      initial={reduceMotion ? false : 'hidden'}
      whileInView="visible"
      viewport={{ once, amount, margin: '0px 0px -8% 0px' }}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
};

const TradingViewLiveTicker = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    container.innerHTML = '';

    const script = document.createElement('script');
    script.src =
      'https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js';
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbols: [
        { proName: 'FOREXCOM:XAUUSD', title: 'XAU/USD' },
        { proName: 'FX_IDC:EURUSD', title: 'EUR/USD' },
        { proName: 'FX_IDC:GBPUSD', title: 'GBP/USD' },
        { proName: 'FX_IDC:USDJPY', title: 'USD/JPY' },
        { proName: 'BITSTAMP:BTCUSD', title: 'BTC/USD' },
        { proName: 'BITSTAMP:ETHUSD', title: 'ETH/USD' },
      ],
      showSymbolLogo: true,
      colorTheme: 'dark',
      isTransparent: true,
      displayMode: 'adaptive',
      locale: 'en',
    });

    container.appendChild(script);

    return () => {
      if (container) container.innerHTML = '';
    };
  }, []);

  return (
    <div className="w-full overflow-hidden border-y border-white/[0.06] bg-[#080b10] py-1">
      <div className="tradingview-widget-container" ref={containerRef}>
        <div className="tradingview-widget-container__widget" />
      </div>
    </div>
  );
};

const SectionHeading = ({ eyebrow, title, description, align = 'center' }) => (
  <div
    className={`mx-auto mb-14 max-w-3xl space-y-4 ${
      align === 'left' ? 'text-left' : 'text-center'
    }`}
  >
    <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-orange-400">
      <span className="h-px w-6 bg-orange-500" />
      {eyebrow}
    </span>
    <h2 className="text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-[46px]">
      {title}
    </h2>
    {description && (
      <p className="mx-auto max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
        {description}
      </p>
    )}
  </div>
);

const features = [
  {
    icon: Cpu,
    tone: 'orange',
    title: 'Intelligent Market Analysis',
    description:
      'Bring structure to your chart analysis with a multi-timeframe approach built around market structure, liquidity and price action.',
    tag: 'Market intelligence',
  },
  {
    icon: Bot,
    tone: 'blue',
    title: 'Real-time Telegram Signals',
    description:
      'Stay informed with structured trade alerts and clear entry, stop-loss and take-profit information delivered through Telegram.',
    tag: 'Signal delivery',
  },
  {
    icon: ShieldCheck,
    tone: 'emerald',
    title: 'Risk-first Trading Tools',
    description:
      'Make more deliberate trading decisions with position-sizing support and risk-management tools built into the workflow.',
    tag: 'Trade management',
  },
];

const steps = [
  {
    number: '01',
    title: 'Read the market',
    description:
      'Start with the higher timeframe to understand direction, key structure and important price areas.',
  },
  {
    number: '02',
    title: 'Wait for confirmation',
    description:
      'Allow price to correct and look for a lower-timeframe confirmation before considering an entry.',
  },
  {
    number: '03',
    title: 'Manage the trade',
    description:
      'Use clear trade levels and position-sizing information to approach execution with a defined plan.',
  },
];

const testimonials = [
  {
    quote:
      'Precision meets simplicity. The multi-timeframe scanner and Telegram bot alerts save me hours of chart analysis.',
    initials: 'SO',
    name: 'Samuel Ojiemen',
    role: 'Lead Frontend Developer',
    tone: 'orange',
  },
  {
    quote:
      'The risk-management tools help me stay disciplined and pay closer attention to how I manage my trades.',
    initials: 'ON',
    name: 'Okechukwu N.',
    role: 'Algorithmic Trader',
    tone: 'blue',
  },
  {
    quote:
      'Having a structured approach to market analysis makes it easier to plan and review my trading decisions.',
    initials: 'FU',
    name: 'Favour Uzoga',
    role: 'Pro Plan Member',
    tone: 'emerald',
  },
];

const iconTone = {
  orange: 'border-orange-400/20 bg-orange-400/10 text-orange-300',
  blue: 'border-sky-400/20 bg-sky-400/10 text-sky-300',
  emerald: 'border-emerald-400/20 bg-emerald-400/10 text-emerald-300',
};

const Home = () => {
  const { user } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!mobileMenuOpen) return undefined;
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setMobileMenuOpen(false);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [mobileMenuOpen]);

  const closeMenu = () => setMobileMenuOpen(false);

  const primaryLink = user ? '/dashboard' : '/register';
  const primaryLabel = user ? 'Open trading terminal' : 'Get started';

  return (
    <div className="min-h-screen overflow-hidden bg-[#07090d] font-sans text-slate-100 selection:bg-orange-400 selection:text-black">
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 -z-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -left-48 top-32 h-[28rem] w-[28rem] rounded-full bg-orange-500/[0.07] blur-[130px]" />
        <div className="absolute -right-48 top-[38rem] h-[30rem] w-[30rem] rounded-full bg-amber-500/[0.05] blur-[140px]" />
        <div className="absolute inset-0 opacity-[0.025] [background-image:linear-gradient(rgba(255,255,255,.7)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.7)_1px,transparent_1px)] [background-size:72px_72px]" />
      </div>

      {/* Navigation */}
      <header className="sticky top-0 z-50 border-b border-white/[0.07] bg-[#080a0f]/85 backdrop-blur-2xl">
        <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 sm:px-8">
          <Link to="/" className="group flex items-center gap-3" aria-label="Hoba Labs home">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-orange-400/30 bg-orange-400/10 text-lg font-black text-orange-300 shadow-[0_0_28px_rgba(249,115,22,0.12)] transition duration-300 group-hover:rotate-6 group-hover:scale-105">
              H
            </div>
            <span className="text-base font-extrabold tracking-[0.12em] text-white">
              HOBA <span className="text-orange-400">LABS</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-8 text-[13px] font-medium text-slate-400 lg:flex">
            <a href="#platform" className="transition hover:text-orange-300">Platform</a>
            <a href="#how-it-works" className="transition hover:text-orange-300">How it works</a>
            <a href="#testimonials" className="transition hover:text-orange-300">Testimonials</a>
            <Link to="/news" className="transition hover:text-orange-300">Market news</Link>
            <Link to="/contact" className="transition hover:text-orange-300">Contact</Link>
          </nav>

          <div className="hidden items-center gap-3 sm:flex">
            {user ? (
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 rounded-full bg-orange-400 px-5 py-2.5 text-xs font-bold text-[#17100a] shadow-lg shadow-orange-500/10 transition hover:-translate-y-0.5 hover:bg-orange-300"
              >
                Go to terminal <ArrowUpRight size={15} />
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="rounded-full px-4 py-2.5 text-xs font-semibold text-slate-300 transition hover:text-white"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 rounded-full bg-orange-400 px-5 py-2.5 text-xs font-bold text-[#17100a] shadow-lg shadow-orange-500/10 transition hover:-translate-y-0.5 hover:bg-orange-300"
                >
                  Get started <ArrowUpRight size={15} />
                </Link>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((open) => !open)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-slate-200 transition hover:border-orange-400/40 hover:text-orange-300 sm:hidden"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-white/[0.07] bg-[#090c12] px-5 py-5 sm:hidden"
          >
            <div className="mx-auto flex max-w-7xl flex-col gap-1">
              {[
                ['Platform', '#platform'],
                ['How it works', '#how-it-works'],
                ['Testimonials', '#testimonials'],
              ].map(([label, href]) => (
                <a
                  key={label}
                  href={href}
                  onClick={closeMenu}
                  className="rounded-lg px-3 py-3 text-sm text-slate-300 transition hover:bg-white/[0.04] hover:text-orange-300"
                >
                  {label}
                </a>
              ))}
              <Link to="/news" onClick={closeMenu} className="rounded-lg px-3 py-3 text-sm text-slate-300 hover:bg-white/[0.04] hover:text-orange-300">Market news</Link>
              <Link to="/contact" onClick={closeMenu} className="rounded-lg px-3 py-3 text-sm text-slate-300 hover:bg-white/[0.04] hover:text-orange-300">Contact</Link>
              <div className="mt-3 grid grid-cols-2 gap-3 border-t border-white/[0.07] pt-4">
                {user ? (
                  <Link to="/dashboard" onClick={closeMenu} className="col-span-2 rounded-full bg-orange-400 px-4 py-3 text-center text-sm font-bold text-black">Open terminal</Link>
                ) : (
                  <>
                    <Link to="/login" onClick={closeMenu} className="rounded-full border border-white/10 px-4 py-3 text-center text-sm font-semibold text-white">Log in</Link>
                    <Link to="/register" onClick={closeMenu} className="rounded-full bg-orange-400 px-4 py-3 text-center text-sm font-bold text-black">Get started</Link>
                  </>
                )}
              </div>
            </div>
          </motion.nav>
        )}
      </header>

      <main className="relative z-10">
        {/* Hero */}
        <section className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 pb-20 pt-20 sm:px-8 sm:pt-28 lg:grid-cols-2 lg:gap-16 lg:pb-28 lg:pt-32">
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="relative z-10"
          >
            <motion.div variants={reveal} className="mb-7 inline-flex items-center gap-2 rounded-full border border-orange-400/20 bg-orange-400/[0.07] px-4 py-2 text-[11px] font-semibold tracking-wide text-orange-200">
              <Sparkles size={14} className="text-orange-300" />
              A smarter approach to trading
              <span className="ml-1 h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,.8)]" />
            </motion.div>

            <motion.h1 variants={reveal} className="max-w-2xl text-[clamp(2.8rem,6vw,5.6rem)] font-extrabold leading-[1.02] tracking-[-0.055em] text-white">
              Trade with
              <br />
              <span className="bg-gradient-to-r from-orange-300 via-amber-400 to-orange-500 bg-clip-text text-transparent">
                clarity.
              </span>{' '}
              Move with
              <br className="hidden sm:block" />
              confidence.
            </motion.h1>

            <motion.p variants={reveal} className="mt-7 max-w-xl text-sm leading-8 text-slate-400 sm:text-base">
              Hoba Labs brings market analysis, structured trading signals and practical risk-management tools into one focused trading experience.
            </motion.p>

            <motion.div variants={reveal} className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                to={primaryLink}
                className="group inline-flex items-center justify-center gap-3 rounded-full bg-orange-400 px-7 py-4 text-sm font-bold text-[#17100a] shadow-[0_12px_40px_rgba(249,115,22,0.18)] transition duration-300 hover:-translate-y-1 hover:bg-orange-300"
              >
                {primaryLabel}
                <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <a
                href="#platform"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.025] px-7 py-4 text-sm font-semibold text-slate-200 transition hover:border-orange-300/30 hover:bg-white/[0.05]"
              >
                Explore the platform <ChevronDown size={16} />
              </a>
            </motion.div>

            <motion.div variants={reveal} className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-3 border-t border-white/[0.08] pt-7 text-xs text-slate-500">
              <span className="inline-flex items-center gap-2"><Check size={14} className="text-orange-300" /> Structured market analysis</span>
              <span className="inline-flex items-center gap-2"><Check size={14} className="text-orange-300" /> Risk-aware workflow</span>
            </motion.div>
          </motion.div>

          {/* Product preview */}
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 35, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.25, ease }}
            className="relative mx-auto w-full max-w-[570px]"
          >
            <motion.div
              aria-hidden="true"
              animate={reduceMotion ? undefined : { y: [0, -12, 0], rotate: [0, 1, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -inset-5 rounded-[2.5rem] bg-gradient-to-br from-orange-500/15 via-transparent to-amber-300/[0.06] blur-2xl"
            />
            <div className="relative overflow-hidden rounded-[1.7rem] border border-white/[0.12] bg-[#0d1119]/95 p-4 shadow-[0_35px_100px_rgba(0,0,0,0.55)] backdrop-blur-xl sm:p-6">
              <div className="flex items-center justify-between border-b border-white/[0.07] pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-400/10 text-orange-300"><BarChart3 size={18} /></div>
                  <div>
                    <p className="text-xs font-bold text-white">Hoba trading workspace</p>
                    <p className="mt-0.5 text-[10px] text-slate-500">Market overview</p>
                  </div>
                </div>
                <span className="rounded-full border border-emerald-400/20 bg-emerald-400/[0.08] px-2.5 py-1 text-[9px] font-semibold text-emerald-300">● MARKET WATCH</span>
              </div>

              <div className="grid grid-cols-2 gap-3 py-5">
                <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4">
                  <p className="text-[10px] text-slate-500">Selected market</p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-400/10 text-[10px] font-bold text-amber-300">Au</span>
                    <span className="text-sm font-bold text-white">XAU / USD</span>
                  </div>
                  <p className="mt-3 text-[10px] text-slate-500">Gold spot</p>
                </div>
                <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4">
                  <p className="text-[10px] text-slate-500">Analysis bias</p>
                  <p className="mt-2 text-sm font-bold text-emerald-300">Bullish structure</p>
                  <p className="mt-3 text-[10px] text-slate-500">Illustrative preview</p>
                </div>
              </div>

              <div className="rounded-2xl border border-white/[0.07] bg-[#090d14] p-4">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-white">Market structure</p>
                    <p className="mt-1 text-[10px] text-slate-500">Multi-timeframe overview</p>
                  </div>
                  <span className="rounded-lg border border-orange-300/20 bg-orange-300/[0.08] px-2 py-1 text-[9px] text-orange-200">4H · 1H · 15M</span>
                </div>
                <div className="relative h-36 overflow-hidden rounded-xl bg-[linear-gradient(rgba(148,163,184,.07)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,.07)_1px,transparent_1px)] bg-[size:28px_28px]">
                  <svg viewBox="0 0 500 150" className="h-full w-full" preserveAspectRatio="none" role="img" aria-label="Illustrative market movement chart">
                    <defs>
                      <linearGradient id="chartFill" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#fb923c" stopOpacity=".25" />
                        <stop offset="100%" stopColor="#fb923c" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path d="M0 112 C25 108 30 85 55 93 S90 120 112 83 S148 90 170 65 S205 82 225 58 S260 75 282 45 S320 61 340 39 S370 52 395 25 S440 43 465 16 L500 22 L500 150 L0 150 Z" fill="url(#chartFill)" />
                    <path d="M0 112 C25 108 30 85 55 93 S90 120 112 83 S148 90 170 65 S205 82 225 58 S260 75 282 45 S320 61 340 39 S370 52 395 25 S440 43 465 16 L500 22" fill="none" stroke="#fb923c" strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
                    <path d="M0 105 H500" stroke="#64748b" strokeDasharray="5 6" opacity=".4" />
                    <path d="M0 66 H500" stroke="#64748b" strokeDasharray="5 6" opacity=".25" />
                    <circle cx="395" cy="25" r="4" fill="#fdba74" />
                  </svg>
                  <div className="absolute left-3 top-3 rounded-md border border-orange-300/20 bg-[#17120e]/90 px-2 py-1 text-[9px] text-orange-200">Structure break</div>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2">
                  {[
                    ['Direction', 'Bullish'],
                    ['Timeframe', '4H'],
                    ['Setup', 'Monitoring'],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-xl bg-white/[0.035] px-3 py-2.5">
                      <p className="text-[9px] text-slate-500">{label}</p>
                      <p className="mt-1 text-[11px] font-semibold text-slate-200">{value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between rounded-xl border border-orange-300/15 bg-orange-300/[0.06] px-4 py-3">
                <div className="flex items-center gap-2.5">
                  <MessageSquare size={16} className="text-orange-300" />
                  <div>
                    <p className="text-[10px] font-semibold text-white">Telegram signal updates</p>
                    <p className="mt-0.5 text-[9px] text-slate-500">Stay connected to your trading workflow</p>
                  </div>
                </div>
                <ArrowUpRight size={16} className="text-orange-300" />
              </div>
              <p className="mt-3 text-center text-[9px] text-slate-600">Illustrative product preview · Not live account or performance data</p>
            </div>
          </motion.div>
        </section>

        <TradingViewLiveTicker />

        {/* Platform features */}
        <section id="platform" className="scroll-mt-24 px-5 py-24 sm:px-8 lg:py-28">
          <div className="mx-auto max-w-7xl">
            <Reveal>
              <SectionHeading
                eyebrow="The Hoba Labs edge"
                title={<>A more structured way to<br className="hidden sm:block" /> approach the markets.</>}
                description="Tools and insights designed to help traders make informed decisions, stay organised and approach every setup with a plan."
              />
            </Reveal>

            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.15 }}
              className="grid gap-5 md:grid-cols-3"
            >
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.article
                    key={feature.title}
                    variants={reveal}
                    whileHover={reduceMotion ? undefined : { y: -8, transition: { duration: 0.25 } }}
                    className="group relative overflow-hidden rounded-3xl border border-white/[0.08] bg-[#0d1119] p-7 transition-colors duration-300 hover:border-orange-300/25 sm:p-8"
                  >
                    <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-orange-400/[0.04] blur-3xl transition duration-500 group-hover:bg-orange-400/[0.10]" />
                    <div className={`relative flex h-12 w-12 items-center justify-center rounded-2xl border ${iconTone[feature.tone]}`}>
                      <Icon size={22} />
                    </div>
                    <p className="relative mt-7 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">{feature.tag}</p>
                    <h3 className="relative mt-3 text-xl font-bold tracking-tight text-white">{feature.title}</h3>
                    <p className="relative mt-4 text-sm leading-7 text-slate-400">{feature.description}</p>
                    <div className="relative mt-8 flex items-center gap-2 text-xs font-semibold text-orange-300">
                      Built for your workflow <ArrowUpRight size={14} />
                    </div>
                  </motion.article>
                );
              })}
            </motion.div>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="scroll-mt-24 border-y border-white/[0.06] bg-[#0a0d13] px-5 py-24 sm:px-8 lg:py-28">
          <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
            <Reveal amount={0.25}>
              <SectionHeading
                align="left"
                eyebrow="A clear process"
                title={<>From market context to a considered trade.</>}
                description="Hoba Labs is built around a disciplined workflow: understand the bigger picture, wait for confirmation and manage risk with intention."
              />
              <Link to="/register" className="inline-flex items-center gap-2 rounded-full border border-orange-300/25 px-5 py-3 text-xs font-bold text-orange-200 transition hover:bg-orange-300/10">
                Explore Hoba Labs <ArrowRight size={15} />
              </Link>
            </Reveal>

            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.2 }}
              className="space-y-4"
            >
              {steps.map((step, index) => (
                <motion.div
                  key={step.number}
                  variants={reveal}
                  className="group flex gap-5 rounded-2xl border border-white/[0.07] bg-[#0e131c] p-6 transition hover:border-orange-300/25 sm:gap-7 sm:p-7"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-orange-300/20 bg-orange-300/[0.07] font-mono text-sm font-bold text-orange-300">
                    {step.number}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-white sm:text-lg">{step.title}</h3>
                    <p className="mt-2 text-sm leading-7 text-slate-400">{step.description}</p>
                  </div>
                  <ArrowUpRight size={18} className="mt-1 shrink-0 text-slate-600 transition group-hover:text-orange-300" />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ICC / methodology feature */}
        <section className="px-5 py-24 sm:px-8 lg:py-28">
          <div className="mx-auto max-w-7xl">
            <Reveal>
              <div className="relative overflow-hidden rounded-[2rem] border border-orange-300/15 bg-gradient-to-br from-[#1b140f] via-[#11131a] to-[#0d1119] p-8 sm:p-12 lg:p-16">
                <div className="absolute -right-20 -top-24 h-80 w-80 rounded-full bg-orange-500/[0.10] blur-[90px]" />
                <div className="relative grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center">
                  <div className="max-w-2xl">
                    <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] text-orange-300"><Zap size={14} /> Strategy-led thinking</span>
                    <h2 className="mt-5 text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
                      Structure first.
                      <span className="block text-orange-300">Execution with purpose.</span>
                    </h2>
                    <p className="mt-5 max-w-xl text-sm leading-8 text-slate-400">
                      The Hoba Labs approach is centred on understanding market direction, allowing price to correct and waiting for continuation confirmation before considering a trade.
                    </p>
                  </div>
                  <div className="grid grid-cols-3 gap-2 sm:gap-3">
                    {[
                      ['I', 'Indication'],
                      ['C', 'Correction'],
                      ['C', 'Continuation'],
                    ].map(([letter, label], index) => (
                      <div key={`${letter}-${label}`} className="flex min-w-0 flex-col items-center rounded-2xl border border-white/10 bg-black/20 px-3 py-5 text-center sm:px-5 sm:py-7">
                        <span className="text-3xl font-black text-orange-300 sm:text-4xl">{letter}</span>
                        <span className="mt-3 text-[9px] font-semibold text-slate-300 sm:text-[10px]">{label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="scroll-mt-24 border-t border-white/[0.06] bg-[#0a0d13] px-5 py-24 sm:px-8 lg:py-28">
          <div className="mx-auto max-w-7xl">
            <Reveal>
              <SectionHeading
                eyebrow="Trader experiences"
                title="Built around the trader."
                description="A focused trading experience should make it easier to understand the market, follow a process and stay consistent with your plan."
              />
            </Reveal>
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.15 }}
              className="grid gap-5 md:grid-cols-3"
            >
              {testimonials.map((item) => (
                <motion.article
                  key={item.name}
                  variants={reveal}
                  whileHover={reduceMotion ? undefined : { y: -6 }}
                  className="flex h-full flex-col rounded-3xl border border-white/[0.07] bg-[#0e131c] p-7 transition hover:border-white/15"
                >
                  <div className="flex gap-1 text-amber-300">
                    {Array.from({ length: 5 }).map((_, index) => <Star key={index} size={13} fill="currentColor" />)}
                  </div>
                  <p className="mt-6 flex-1 text-sm leading-7 text-slate-300">“{item.quote}”</p>
                  <div className="mt-7 flex items-center gap-3 border-t border-white/[0.07] pt-5">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-full border text-xs font-bold ${iconTone[item.tone]}`}>{item.initials}</div>
                    <div>
                      <p className="text-xs font-bold text-white">{item.name}</p>
                      <p className="mt-1 text-[10px] text-slate-500">{item.role}</p>
                    </div>
                  </div>
                </motion.article>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="px-5 py-24 sm:px-8 lg:py-28">
          <div className="mx-auto max-w-7xl">
            <Reveal>
              <div className="relative overflow-hidden rounded-[2rem] border border-orange-300/20 bg-[#11141b] px-7 py-16 text-center sm:px-12">
                <div className="pointer-events-none absolute left-1/2 top-0 h-64 w-[34rem] -translate-x-1/2 rounded-full bg-orange-500/[0.10] blur-[100px]" />
                <div className="relative mx-auto max-w-2xl">
                  <span className="inline-flex items-center gap-2 rounded-full border border-orange-300/20 bg-orange-300/[0.07] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-orange-200">
                    <Sparkles size={12} /> Your next step starts here
                  </span>
                  <h2 className="mt-6 text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
                    Make your trading process more intentional.
                  </h2>
                  <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-slate-400">
                    Explore the Hoba Labs platform and bring more structure to the way you approach the markets.
                  </p>
                  <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                    <Link to={primaryLink} className="inline-flex items-center justify-center gap-2 rounded-full bg-orange-400 px-7 py-4 text-sm font-bold text-[#17100a] transition hover:-translate-y-1 hover:bg-orange-300">
                      {primaryLabel} <ArrowRight size={16} />
                    </Link>
                    <Link to="/contact" className="inline-flex items-center justify-center rounded-full border border-white/10 px-7 py-4 text-sm font-semibold text-white transition hover:border-orange-300/30 hover:bg-white/[0.04]">
                      Talk to our team
                    </Link>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/[0.07] bg-[#06080c] px-5 pb-8 pt-14 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 border-b border-white/[0.07] pb-12 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
            <div className="max-w-sm">
              <Link to="/" className="inline-flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-orange-400/30 bg-orange-400/10 text-lg font-black text-orange-300">H</span>
                <span className="text-base font-extrabold tracking-[0.12em] text-white">HOBA <span className="text-orange-400">LABS</span></span>
              </Link>
              <p className="mt-5 text-sm leading-7 text-slate-500">
                A focused trading technology experience built to bring market analysis, signals and risk-aware tools closer together.
              </p>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-white">Platform</h3>
              <div className="mt-5 flex flex-col gap-3 text-sm text-slate-500">
                <a href="#platform" className="transition hover:text-orange-300">Features</a>
                <a href="#how-it-works" className="transition hover:text-orange-300">How it works</a>
                <Link to="/news" className="transition hover:text-orange-300">Market news</Link>
                <Link to="/dashboard" className="transition hover:text-orange-300">Trading terminal</Link>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-white">Get started</h3>
              <div className="mt-5 flex flex-col gap-3 text-sm text-slate-500">
                <Link to="/register" className="transition hover:text-orange-300">Create account</Link>
                <Link to="/login" className="transition hover:text-orange-300">Log in</Link>
                <Link to="/contact" className="transition hover:text-orange-300">Contact support</Link>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-white">Stay connected</h3>
              <p className="mt-5 text-sm leading-6 text-slate-500">Questions about the platform? Our team is here to help.</p>
              <Link to="/contact" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-orange-300 transition hover:text-orange-200">
                Get in touch <ArrowUpRight size={15} />
              </Link>
            </div>
          </div>

          <div className="flex flex-col gap-4 pt-7 text-[11px] text-slate-600 sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} Hoba Labs. All rights reserved.</p>
            <p className="max-w-2xl leading-6 sm:text-right">
              Trading involves risk. Market information and tools are provided for informational purposes and are not a guarantee of trading results.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;

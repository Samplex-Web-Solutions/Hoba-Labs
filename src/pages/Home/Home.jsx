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
import logo from '../../assets/images/hoba-labs-logo-horizontal.png';


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
    className={`mx-auto mb-14 max-w-3xl space-y-4 ${align === 'left' ? 'text-left' : 'text-center'
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
    icon: Bot,
    tone: 'orange',
    title: 'Real-Time Trading Signals',
    description:
      'Receive lightning-fast structural signals and instant Telegram alerts for order fills, TP/SL hits, breakeven updates, and canceled invalid trades.',
    tag: 'Signal delivery',
  },
  {
    icon: Zap,
    tone: 'blue',
    title: 'EA Automated Trading',
    description:
      'Deploy robust MetaTrader Expert Advisors (EAs) engineered to execute strategies autonomously and manage risk 24/7 without emotional interference.',
    tag: 'Automation & execution',
  },
  {
    icon: ShieldCheck,
    tone: 'emerald',
    title: 'Prop-Safe Risk Management',
    description:
      'Protect your capital with built-in position sizing support, micro-lot calibration, and strict adherence to institutional and prop firm rules.',
    tag: 'Trade management',
  },
];

const testimonials = [
  {
    quote:
      'The Telegram bot delivers signals ridiculously fast, and the built-in risk calculator makes position sizing effortless. Hoba Labs provides way more value than what it costs.',
    initials: 'CI',
    name: 'Caris Imala',
    role: 'Pro Plan User',
    tone: 'orange',
  },
  {
    quote:
      'As a beginner in forex, this bot lets me trade freely without the fear of blowing my account. Hoba Labs made trading simple for me, and I’m currently enjoying steady profits on my live account!',
    initials: 'AM',
    name: 'Akinkumi Matthew',
    role: 'EA Bot Trader',
    tone: 'orange',
  },
  {
    quote:
      'Ever since I started using Hoba Labs, my win rate has jumped to 78%! The built-in risk management tools make it completely prop-firm friendly.',
    initials: 'MO',
    name: 'Mary Oluwatomilayo',
    role: 'Pro Plan User',
    tone: 'orange',
  },
  {
    quote:
      'Precision meets simplicity. Getting instant alerts for order fills, hit TP and SL, breakeven updates, and canceled invalid trades saves me hours of manual chart monitoring.',
    initials: 'EO',
    name: 'Emmanuel Ojiemen',
    role: 'Pro Plan User',
    tone: 'orange',
  },
  {
    quote:
      'The risk-management tools help me stay disciplined and pay closer attention to how I manage my trades.',
    initials: 'ON',
    name: 'Okechukwu N.',
    role: 'EA Bot Trader',
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

const faqs = [
  {
    question: 'What is Hoba Labs and how does it work?',
    answer:
      'Hoba Labs is an institutional forex trading signal platform and EA automated trading ecosystem. It combines multi-timeframe market structure scanning, automated instant Telegram alerts for orders and risk calculations, and user-friendly risk management tools designed to streamline your trading workflow.',
  },
  {
    question: 'How do I receive trading signals and EA updates?',
    answer:
      'Signals and instant execution alerts—including order fills, take-profit (TP), stop-loss (SL), breakeven (BE) updates, and canceled invalid trades—are streamed directly to you in real-time through our integrated Telegram bot and your platform dashboard.',
  },
  {
    question: 'Is Hoba Labs friendly for proprietary (prop) firms?',
    answer:
      'Yes! Hoba Labs is built with strict risk-management and position-sizing frameworks specifically tailored to respect daily drawdown limits, micro-lot sizing, and consistency metrics required by top prop firms.',
  },
  {
    question: 'How do I subscribe and access the platform?',
    answer:
      'You can easily sign up and choose a subscription plan through our platform. We support dual-payment options, including Paystack for fiat currency (NGN) and NOWPayments for cryptocurrency, ensuring instant automated activation upon successful payment.',
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
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
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
    <div className="min-h-screen overflow-x-hidden bg-[#07090d] font-sans text-slate-100 selection:bg-orange-400 selection:text-black">
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 -z-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -left-48 top-32 h-[28rem] w-[28rem] rounded-full bg-orange-500/[0.07] blur-[130px]" />
        <div className="absolute -right-48 top-[38rem] h-[30rem] w-[30rem] rounded-full bg-amber-500/[0.05] blur-[140px]" />
        <div className="absolute inset-0 opacity-[0.025] [background-image:linear-gradient(rgba(255,255,255,.7)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.7)_1px,transparent_1px)] [background-size:72px_72px]" />
      </div>

      {/* Navigation - Sticky Header */}
      <header className="sticky top-0 z-50 border-b border-white/[0.07] bg-[#080a0f]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-[76px] max-w-8xl items-center justify-between px-5 sm:px-8">
          <Link to="/" className="group flex items-center gap-3" aria-label="Hoba Labs home">
            <div className="text-center space-y-1">
              <img src={logo} alt="Hoba Labs Logo" className="mx-auto h-14" />
            </div>
          </Link>

          <nav className="hidden items-center gap-8 text-[13px] font-medium text-slate-400 lg:flex">
            <a href="#platform" className="transition hover:text-orange-300">Platform</a>
            <a href="#about" className="transition hover:text-orange-300">About Us</a>
            <a href="#testimonials" className="transition hover:text-orange-300">Testimonials</a>
            <a href="#faq" className="transition hover:text-orange-300">FAQ</a>
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
                ['About Us', '#about'],
                ['Testimonials', '#testimonials'],
                ['FAQ', '#faq'],
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
        <section className="relative mx-auto grid max-w-8xl items-center gap-14 px-5 pb-10 pt-10 sm:px-4 sm:pt-20 lg:grid-cols-2 lg:gap-16 lg:pb-10 lg:pt-8">
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="relative z-10"
          >

            <motion.h1 variants={reveal} className="max-w-2xl text-[clamp(2.8rem,6vw,5.6rem)] font-sans font-bold leading-[1.02] tracking-[-0.055em] text-white">
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
              Hoba Labs brings high-accuracy trading signals, EA automated trading, and practical risk-management tools into one unified platform.
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
            </div>
          </motion.div>
        </section>

        <TradingViewLiveTicker />

        {/* Platform features */}
        <section id="platform" className="scroll-mt-24 px-5 py-24 sm:px-8 lg:py-20">
          <div className="mx-auto max-w-7xl">
            <Reveal>
              <SectionHeading
                eyebrow="The Hoba Labs edge"
                title={<>Built for peak performance.</>}
              />
            </Reveal>

            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.15 }}
              className="grid gap-5 md:grid-cols-3"
            >
              {features.map((feature) => {
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

        {/* About Us Section */}
        <section id="about" className="scroll-mt-24 border-t border-white/[0.06] bg-[#080b11] px-5 py-24 sm:px-8 lg:py-28">
          <div className="mx-auto max-w-7xl">
            <Reveal>
              <SectionHeading
                eyebrow="Who we are"
                title="Engineered for traders, driven by precision."
                description="Hoba Labs was built to bridge the gap between complex market analytics, high-frequency signals, and automated execution. We empower traders of all levels with institutional signals and robust EA technology."
              />
            </Reveal>

            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.15 }}
              className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mt-12"
            >
              <motion.div variants={reveal} className="rounded-3xl border border-white/[0.08] bg-[#0d1119] p-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-orange-400/20 bg-orange-400/10 text-orange-300 mb-6">
                  <Sparkles size={22} />
                </div>
                <h3 className="text-lg font-bold text-white">Our Mission</h3>
                <p className="mt-3 text-sm leading-7 text-slate-400">
                  To simplify forex market navigation by delivering lightning-fast, high-accuracy structural signals and automated trade lifecycle management tools that foster consistency and discipline.
                </p>
              </motion.div>

              <motion.div variants={reveal} className="rounded-3xl border border-white/[0.08] bg-[#0d1119] p-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-sky-400/20 bg-sky-400/10 text-sky-300 mb-6">
                  <BarChart3 size={22} />
                </div>
                <h3 className="text-lg font-bold text-white">Advanced Technology</h3>
                <p className="mt-3 text-sm leading-7 text-slate-400">
                  Powered by custom automation algorithms and MetaTrader integration, our platform monitors multi-timeframe price action, order fills, take-profits, and stop-losses seamlessly around the clock.
                </p>
              </motion.div>

              <motion.div variants={reveal} className="rounded-3xl border border-white/[0.08] bg-[#0d1119] p-8 md:col-span-2 lg:col-span-1">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10 text-emerald-300 mb-6">
                  <ShieldCheck size={22} />
                </div>
                <h3 className="text-lg font-bold text-white">Prop-Firm Friendly</h3>
                <p className="mt-3 text-sm leading-7 text-slate-400">
                  With rigorous risk calculators and precision micro-lot sizing configurations, Hoba Labs is optimized to help traders pass evaluations and protect capital safely within institutional rules.
                </p>
              </motion.div>
            </motion.div>
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

        {/* FAQ Section */}
        <section id="faq" className="scroll-mt-24 border-t border-white/[0.06] bg-[#07090d] px-5 py-24 sm:px-8 lg:py-28">
          <div className="mx-auto max-w-4xl">
            <Reveal>
              <SectionHeading
                eyebrow="Got questions?"
                title="Frequently Asked Questions"
                description="Find answers to common inquiries about Hoba Labs, our subscription options, signal delivery, and trading features."
              />
            </Reveal>

            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.1 }}
              className="mt-10 space-y-4"
            >
              {faqs.map((faq, index) => {
                const isOpen = openFaqIndex === index;
                return (
                  <motion.div
                    key={faq.question}
                    variants={reveal}
                    className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0d1119] transition-colors hover:border-orange-300/20"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                      className="flex w-full items-center justify-between px-6 py-5 text-left text-base font-bold text-white transition hover:text-orange-300"
                      aria-expanded={isOpen}
                    >
                      <span>{faq.question}</span>
                      <ChevronDown
                        size={18}
                        className={`text-orange-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                      />
                    </button>
                    {isOpen && (
                      <div className="border-t border-white/[0.06] px-6 py-4 text-sm leading-7 text-slate-400">
                        {faq.answer}
                      </div>
                    )}
                  </motion.div>
                );
              })}
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
                  <h2 className="mt-6 text-3xl font-sans font-bold tracking-tight text-white sm:text-5xl">
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
               <div className="text-center space-y-1">
              <img src={logo} alt="Hoba Labs Logo" className="mx-auto h-16" />
            </div>
              </Link>
              <p className="mt-5 text-sm leading-7 text-slate-500">
                A focused trading technology experience built to bring market analysis, signals and risk-aware tools closer together.
              </p>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-white">Platform</h3>
              <div className="mt-5 flex flex-col gap-3 text-sm text-slate-500">
                <a href="#platform" className="transition hover:text-orange-300">Features</a>
                <a href="#about" className="transition hover:text-orange-300">About Us</a>
                <a href="#faq" className="transition hover:text-orange-300">FAQ</a>
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
import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  Bot, ShieldCheck, Zap, ArrowRight, Cpu, Star, Wallet, CreditCard, MessageSquare 
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

// TradingView Live Ticker Tape Component
const TradingViewLiveTicker = () => {
  const containerRef = useRef();

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = '';

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js';
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbols: [
        { proName: "FOREXCOM:XAUUSD", title: "XAU/USD" },
        { proName: "FX_IDC:EURUSD", title: "EUR/USD" },
        { proName: "FX_IDC:GBPUSD", title: "GBP/USD" },
        { proName: "FX_IDC:USDJPY", title: "USD/JPY" },
        { proName: "BITSTAMP:BTCUSD", title: "BTC/USD" },
        { proName: "BITSTAMP:ETHUSD", title: "ETH/USD" }
      ],
      showSymbolLogo: true,
      colorTheme: "dark",
      isTransparent: true,
      displayMode: "adaptive",
      locale: "en"
    });

    containerRef.current.appendChild(script);
  }, []);

  return (
    <div className="w-full bg-slate-950 border-b border-slate-900 py-1 overflow-hidden">
      <div className="tradingview-widget-container" ref={containerRef}>
        <div className="tradingview-widget-container__widget"></div>
      </div>
    </div>
  );
};

const Home = () => {
  const { user } = useAuthStore();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-orange-500 selection:text-slate-950 font-sans overflow-x-hidden">
      
      {/* 1. REAL-TIME LIVE PRICE MARQUEE */}

      {/* 2. NAVIGATION BAR */}
      <header className="px-6 py-5 max-w-7xl mx-auto w-full flex items-center justify-between z-50 sticky top-0 bg-slate-950/80 backdrop-blur-md border-b border-slate-900">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-orange-500/10 border border-orange-500/30 rounded-xl flex items-center justify-center text-orange-400 font-bold text-lg shadow-lg shadow-orange-500/20">
            H
          </div>
          <span className="text-lg font-bold tracking-tight text-white font-mono">
            HOBA <span className="text-orange-500">LABS</span>
          </span>
        </div>

        {/* Central Pill Nav */}
        <nav className="hidden md:flex items-center gap-6 bg-slate-900/80 border border-slate-800 rounded-full px-6 py-2 text-xs font-medium text-slate-300">
          <a href="#features" className="hover:text-orange-400 transition-colors">Platform</a>
          <a href="#testimonials" className="hover:text-orange-400 transition-colors">Testimonials</a>
          <Link to="/news" className="hover:text-orange-400 transition-colors">Market News</Link>
          <Link to="/contact" className="hover:text-orange-400 transition-colors">Contact</Link>
        </nav>

        {/* Auth Buttons */}
        <div className="flex items-center gap-3">
          {user ? (
            <Link
              to="/dashboard"
              className="text-xs sm:text-sm font-semibold bg-orange-500 hover:bg-orange-600 text-slate-950 px-5 py-2 rounded-lg transition-all shadow-lg shadow-orange-500/20"
            >
              Go to Terminal
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="text-xs sm:text-sm font-medium text-slate-300 hover:text-orange-400 px-3 py-2 transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="text-xs sm:text-sm font-semibold bg-orange-500 hover:bg-orange-600 text-slate-950 px-5 py-2 rounded-lg transition-all shadow-lg shadow-orange-500/20"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </header>

      {/* 3. HERO SECTION */}
     <div className="hero flex-col">
         <section className="max-w-7xl mx-auto px-6 pt-16 pb-20 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Column Text */}
        <div className="lg:col-span-7 text-left space-y-6">
          <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-full px-4 py-1 text-xs font-mono text-orange-400">
            <Zap className="w-3.5 h-3.5" /> Institutional SMC / ICT Engine
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
            Turning Passion <br />
            Into A Trading <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-500">
              Career
            </span>
          </h1>

          <p className="text-slate-400 text-sm sm:text-base max-w-lg leading-relaxed font-light">
            Master multi-timeframe Top-Down confluence, automated risk management, and instant Telegram signaling to pass funded accounts.
          </p>

          <div className="pt-2 flex items-center gap-4">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-slate-950 font-bold px-8 py-3.5 rounded-lg text-sm transition-all shadow-xl shadow-orange-500/20"
            >
              <span>Start 7-Day Trial</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 font-semibold px-6 py-3.5 rounded-lg text-sm transition-colors"
            >
              Contact Support
            </Link>
          </div>
        </div>

        {/* Right Column Glassmorphism Card */}
        <div className="lg:col-span-5 relative flex justify-center">
          <div className="absolute -top-10 -right-10 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl text-left relative z-10 space-y-6">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
              <span className="flex items-center gap-2">
                <Wallet className="w-4 h-4 text-orange-400" /> Account Balance
              </span>
              <span className="text-slate-500 font-mono">···</span>
            </div>

            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-white font-mono tracking-tight">
                $24,600.00
              </div>
              <div className="inline-flex items-center gap-1.5 mt-2 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full text-emerald-400 text-xs font-semibold">
                +1.5% <span className="text-slate-400 text-[10px] font-normal">From last month</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="py-2.5 bg-orange-500 text-slate-950 font-bold text-xs rounded-lg flex items-center justify-center gap-1">
                <span>↑ Active Trade</span>
              </div>
              <div className="py-2.5 bg-slate-800 text-slate-200 font-semibold text-xs rounded-lg flex items-center justify-center gap-1">
                <span>↓ Telegram Bot</span>
              </div>
            </div>

            <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-4 mt-4 space-y-3">
              <div className="flex justify-between items-center text-slate-300 text-xs font-mono">
                <CreditCard className="w-4 h-4 text-orange-400" />
                <span>•••• •••• 6552</span>
              </div>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider">Trader</p>
                  <p className="text-xs font-semibold text-white mt-0.5">Samuel Ojiemen</p>
                </div>
                <span className="text-xs font-bold text-orange-400 font-mono">HOBA PRO</span>
              </div>
            </div>
          </div>
        </div>

      </section>
            <TradingViewLiveTicker />

     </div>

      {/* 4. METHODOLOGY & FEATURES */}
      <section id="features" className="py-20 px-6 max-w-7xl mx-auto w-full border-t border-slate-900">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs uppercase tracking-widest text-orange-400 font-mono font-semibold">
            Institutional Confluence Engine
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Designed for Funded & Prop Traders
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            Eliminate emotional execution with automated multi-timeframe Top-Down analysis and strict 2% Prop-Safe risk management guardrails.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-left space-y-4 shadow-xl">
            <div className="w-12 h-12 bg-orange-500/10 border border-orange-500/20 rounded-xl flex items-center justify-center text-orange-400">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Hybrid SMC / ICT Logic</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Automated detection of Liquidity Sweeps, Order Blocks, and Fair Value Gaps (FVG) across Gold and major FX pairs.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-left space-y-4 shadow-xl">
            <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center justify-center text-blue-400">
              <Bot className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Interactive Telegram Signals</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Receive real-time pending order notifications with built-in position size calculators and TP/BE profit breakdowns.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-left space-y-4 shadow-xl">
            <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Prop-Safe Guardrails</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Built-in 2% risk caps and gap limit enforcement ensure account compliance during high volatility sessions.
            </p>
          </div>
        </div>
      </section>

      {/* 5. TESTIMONIALS SECTION */}
      <section id="testimonials" className="py-20 px-6 max-w-7xl mx-auto w-full border-t border-slate-900">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs uppercase tracking-widest text-orange-400 font-mono font-semibold">Testimonials</span>
          <h2 className="text-3xl font-bold tracking-tight text-white">What Our Traders Say</h2>
          <p className="text-slate-400 text-sm">Discover how Hoba Labs helps traders build strategies, eliminate bias, and pass evaluations.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-left shadow-lg space-y-4">
            <div className="flex gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => (<Star key={i} className="w-4 h-4 fill-amber-400" />))}
            </div>
            <p className="text-xs text-slate-300 leading-relaxed italic">
              "Precision Meets Simplicity. The multi-timeframe SMC scanner and Telegram bot alerts saved me hours of chart analysis every single day."
            </p>
            <div className="pt-4 border-t border-slate-800 flex items-center gap-3">
              <div className="w-9 h-9 bg-orange-500/20 text-orange-400 rounded-full flex items-center justify-center font-bold text-xs">SO</div>
              <div>
                <p className="text-xs font-bold text-white">Samuel Ojiemen</p>
                <p className="text-[10px] text-slate-500">Lead Frontend Developer</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-left shadow-lg space-y-4">
            <div className="flex gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => (<Star key={i} className="w-4 h-4 fill-amber-400" />))}
            </div>
            <p className="text-xs text-slate-300 leading-relaxed italic">
              "The Prop-Safe risk management guardrails keep my drawdowns strictly controlled. It's an indispensable tool for funded traders."
            </p>
            <div className="pt-4 border-t border-slate-800 flex items-center gap-3">
              <div className="w-9 h-9 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center font-bold text-xs">ON</div>
              <div>
                <p className="text-xs font-bold text-white">Okechukwu N.</p>
                <p className="text-[10px] text-slate-500">Algorithmic Trader</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-left shadow-lg space-y-4">
            <div className="flex gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => (<Star key={i} className="w-4 h-4 fill-amber-400" />))}
            </div>
            <p className="text-xs text-slate-300 leading-relaxed italic">
              "Executing pending limit orders based on 1D to 5m confluence has completely transformed my win rate on XAU/USD."
            </p>
            <div className="pt-4 border-t border-slate-800 flex items-center gap-3">
              <div className="w-9 h-9 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center font-bold text-xs">FU</div>
              <div>
                <p className="text-xs font-bold text-white">Favour Uzoga</p>
                <p className="text-[10px] text-slate-500">Pro Plan Member</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FOOTER */}
      <footer className="border-t border-slate-900 bg-slate-950 py-10 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-500">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-orange-500/10 border border-orange-500/30 rounded-lg flex items-center justify-center text-orange-400 font-bold">
              H
            </div>
            <span className="font-bold text-white text-sm">HOBA LABS TERMINAL</span>
          </div>

          <div className="flex items-center gap-6">
            <Link to="/login" className="hover:text-slate-300 transition-colors">Login</Link>
            <Link to="/register" className="hover:text-slate-300 transition-colors">Register</Link>
            <Link to="/contact" className="hover:text-slate-300 transition-colors">Contact</Link>
            <Link to="/dashboard" className="hover:text-slate-300 transition-colors">Dashboard</Link>
          </div>

          <div>
            © {new Date().getFullYear()} Hoba Labs. All rights reserved.
          </div>
        </div>
      </footer>

    </div>
  );
};

export default Home;
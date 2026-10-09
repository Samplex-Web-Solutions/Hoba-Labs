import React, { useState, useEffect, useRef } from 'react';
import { BarChart2, Globe } from 'lucide-react';

const SYMBOLS = [
  { label: 'XAU/USD', value: 'OANDA:XAUUSD' },
  { label: 'EUR/USD', value: 'FX:EURUSD' },
  { label: 'GBP/USD', value: 'FX:GBPUSD' },
  { label: 'AUD/USD', value: 'FX:AUDUSD' },
  { label: 'NZD/USD', value: 'FX:NZDUSD' },
  { label: 'USDCAD', value: 'FX:USDCAD' },
  { label: 'US30', value: 'CAPITALCOM:US30' },
  { label: 'USD/JPY', value: 'FX:USDJPY' }
];

function Charts() {
  const [selectedSymbol, setSelectedSymbol] = useState(SYMBOLS[0].value);
  const containerRef = useRef(null);

  useEffect(() => {
    // Clear previous widget script if any
    if (containerRef.current) {
      containerRef.current.innerHTML = '';
    }

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    script.onload = () => {
      if (typeof window.TradingView !== 'undefined' && containerRef.current) {
        new window.TradingView.widget({
          autosize: true,
          symbol: selectedSymbol,
          interval: '15',
          timezone: 'Etc/UTC',
          theme: 'dark',
          style: '1',
          locale: 'en',
          toolbar_bg: '#090d16',
          enable_publishing: false,
          hide_side_toolbar: false,
          allow_symbol_change: true,
          container_id: 'tradingview_widget_container',
        });
      }
    };
    document.head.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [selectedSymbol]);

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <div className="p-4 space-y-6 max-w-7xl w-full mx-auto text-left">
          
          {/* Header & Symbol Selector Toolbar */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 p-4 rounded-md shadow-xl">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-md bg-orange-500/10 text-orange-400 border border-orange-500/20">
                <BarChart2 className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-100">Live Market Charts</h2>
                <p className="text-xs text-slate-400">Institutional price action & liquidity tracking</p>
              </div>
            </div>

            {/* Quick Asset Switcher */}
            <div className="flex items-center space-x-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
              {SYMBOLS.map((item) => (
                <button
                  key={item.value}
                  onClick={() => setSelectedSymbol(item.value)}
                  className={`px-3 py-2 rounded-md text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedSymbol === item.value
                      ? 'bg-orange-500 text-slate-950 shadow-md shadow-orange-500/20'
                      : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Chart Wrapper Container */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-md overflow-hidden shadow-2xl h-[700px] relative">
            <div id="tradingview_widget_container" ref={containerRef} className="w-full h-full" />
          </div>

        </div>
      </main>
    </div>
  );
}

export default Charts;
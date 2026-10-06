import React, { useState } from 'react';
import { Bell, TrendingUp, Clock, ArrowRight } from 'lucide-react';

const DashboardHeader = () => {
  const [showNotifications, setShowNotifications] = useState(false);

  // Today's signals dropped for the marquee & dropdown
  const todaysSignals = [
    { id: 1, pair: 'XAUUSD', type: 'BUY LIMIT', timeframe: '15m', time: '14:30', status: 'Active' },
    { id: 2, pair: 'EURUSD', type: 'SELL STOP', timeframe: '1H', time: '11:15', status: 'Hit TP' },
    { id: 3, pair: 'GBPUSD', type: 'ORDER BLOCK', timeframe: '4H', time: '09:00', status: 'Pending' },
    { id: 4, pair: 'US30', type: 'BUY STOP', timeframe: '30m', time: '08:15', status: 'Active' },
  ];

  return (
    <header className="flex flex-col lg:flex-row items-center justify-between bg-slate-900 border-b border-slate-800 px-6 py-3 gap-4 relative">
      
      {/* Left: Date Display */}
      <div className="text-sm text-slate-400 font-medium flex items-center space-x-2 shrink-0">
        <Clock className="w-4 h-4 text-orange-400" />
        <span>
          {new Date().toLocaleDateString(undefined, {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </span>
      </div>

      {/* Center: Live Signals Marquee Ticker */}
      <div className="w-full lg:max-w-xl overflow-hidden bg-slate-950 border border-slate-800/80 rounded-lg py-1.5 px-3 flex items-center relative shadow-inner">
        <div className="flex items-center space-x-2 mr-3 shrink-0 text-orange-400 text-xs font-bold uppercase tracking-wider border-r border-slate-800 pr-3">
          <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
          <span>Live:</span>
        </div>
        
        {/* Marquee Container */}
        <div className="overflow-hidden relative w-full flex whitespace-nowrap">
          <div className="flex space-x-8 animate-marquee items-center text-xs font-medium text-slate-300">
            {todaysSignals.map((signal) => (
              <span key={signal.id} className="inline-flex items-center space-x-2 bg-slate-900/80 border border-slate-800 px-2.5 py-1 rounded-md">
                <span className="text-orange-400 font-bold">{signal.pair}</span>
                <span className="text-slate-400">({signal.timeframe})</span>
                <span className="text-emerald-400 font-semibold">{signal.type}</span>
                <span className="text-[10px] text-slate-500">[{signal.time}]</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Right: Notification Bell & Dropdown */}
      <div className="relative shrink-0">
        <button 
          onClick={() => setShowNotifications(!showNotifications)}
          className="relative p-2 rounded-lg bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-colors focus:outline-none"
          aria-label="View notifications"
        >
          {todaysSignals.length > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-orange-500 text-slate-950 font-bold text-xs rounded-full h-5 w-5 flex items-center justify-center shadow-md shadow-orange-500/20">
              {todaysSignals.length}
            </span>
          )}
          <Bell className="w-5 h-5" />
        </button>

        {/* Signals Dropdown Menu */}
        {showNotifications && (
          <div className="absolute right-0 mt-3 w-80 bg-slate-900 border border-slate-800 rounded-lg shadow-2xl z-50 overflow-hidden">
            <div className="px-4 py-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Today's Signals ({todaysSignals.length})
              </span>
              <span className="text-[10px] text-orange-400 font-medium">Smart Money Bot</span>
            </div>

            <div className="divide-y divide-slate-800/60 max-h-72 overflow-y-auto">
              {todaysSignals.length > 0 ? (
                todaysSignals.map((signal) => (
                  <div key={signal.id} className="p-3 hover:bg-slate-800/40 transition-colors flex items-start space-x-3">
                    <div className="p-2 rounded bg-orange-500/10 text-orange-400 mt-0.5">
                      <TrendingUp className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-bold text-slate-200">{signal.pair} ({signal.timeframe})</p>
                        <span className="text-[10px] text-slate-400">{signal.time}</span>
                      </div>
                      <p className="text-xs text-orange-400 font-medium mt-0.5">{signal.type}</p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                          Status: {signal.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-xs text-slate-500">
                  No signals dropped for today yet.
                </div>
              )}
            </div>

            <div className="p-2 bg-slate-950 border-t border-slate-800 text-center">
              <a 
                href="/signals" 
                className="text-xs text-orange-400 hover:text-orange-300 font-semibold flex items-center justify-center space-x-1 py-1"
              >
                <span>View All Signals</span>
                <ArrowRight className="w-3 h-3" />
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default DashboardHeader;
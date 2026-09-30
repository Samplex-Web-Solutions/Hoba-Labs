import React, { useState, useMemo } from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import SubscriptionModal from '../../components/common/SubcriptionModal';
import { 
  Bell, 
  Search, 
  ArrowUpRight, 
  ArrowDownRight, 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  ShieldAlert,
  Zap,
  Target,
  Shield
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

// Mock signals matching your exact Supabase SQL schema columns
const MOCK_SIGNALS = [
  { id: '1', pair: 'EURUSD', direction: 'BUY', entry_price: 1.0850, stop_loss: 1.0820, take_profit: 1.0920, aoi_id: 'testaoi999', status: 'PENDING', created_at: '2026-09-29T10:30:00Z' },
  { id: '2', pair: 'XAUUSD', direction: 'SELL', entry_price: 2328.50, stop_loss: 2335.00, take_profit: 2310.00, aoi_id: 'testaoi888', status: 'ACTIVE', created_at: '2026-09-29T09:15:00Z' },
  { id: '3', pair: 'BTCUSD', direction: 'BUY', entry_price: 64200.00, stop_loss: 63500.00, take_profit: 66500.00, aoi_id: 'testaoi777', status: 'COMPLETED', created_at: '2026-09-29T06:00:00Z' },
  { id: '4', pair: 'GBPUSD', direction: 'SELL', entry_price: 1.2710, stop_loss: 1.2760, take_profit: 1.2650, aoi_id: 'testaoi666', status: 'COMPLETED', created_at: '2026-09-28T18:45:00Z' },
  { id: '5', pair: 'ETHUSD', direction: 'BUY', entry_price: 3450.00, stop_loss: 3400.00, take_profit: 3580.00, aoi_id: 'testaoi555', status: 'PENDING', created_at: '2026-09-28T14:20:00Z' },
  { id: '6', pair: 'USDJPY', direction: 'SELL', entry_price: 155.80, stop_loss: 156.30, take_profit: 154.90, aoi_id: 'testaoi444', status: 'EXPIRED', created_at: '2026-09-28T10:00:00Z' }
];

export default function Signals() {
  const { user } = useAuthStore();
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [directionFilter, setDirectionFilter] = useState('ALL'); // ALL, BUY, SELL
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Filter signals based on search query (pair or aoi_id) and direction
  const filteredSignals = useMemo(() => {
    return MOCK_SIGNALS.filter(sig => {
      const matchesSearch = sig.pair.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            sig.aoi_id?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDirection = directionFilter === 'ALL' || sig.direction === directionFilter;
      return matchesSearch && matchesDirection;
    });
  }, [searchQuery, directionFilter]);

  // Pagination calculations (5 items per page)
  const totalPages = Math.ceil(filteredSignals.length / itemsPerPage) || 1;
  const paginatedSignals = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredSignals.slice(start, start + itemsPerPage);
  }, [filteredSignals, currentPage]);

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      {/* Sidebar Navigation */}
      <Sidebar onOpenSubscriptionModal={() => setIsSubModalOpen(true)} />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* Header Bar */}
        <header className="h-20 border-b border-slate-800 px-8 flex items-center justify-between bg-slate-900/50 backdrop-blur-md sticky top-0 z-20">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-100 flex items-center gap-2">
              <Bell className="w-5 h-5 text-orange-400" />
              <span>🚨 ICC Strategy Signal Feed</span>
            </h1>
            <p className="text-xs text-slate-400">
              Institutional algorithmic signals structured directly from database telemetry.
            </p>
          </div>

          <button 
            onClick={() => setIsSubModalOpen(true)}
            className="flex items-center space-x-2 bg-orange-500 hover:bg-orange-600 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs transition-all shadow-lg shadow-orange-500/10"
          >
            <Zap className="w-4 h-4" />
            <span>{user?.subscription_status === 'Active' ? 'Active Tier' : 'Upgrade Plan'}</span>
          </button>
        </header>

        {/* Content Body */}
        <div className="p-8 space-y-6 max-w-7xl w-full mx-auto">

          {/* Search and Filters Control Bar */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
            
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input 
                type="text"
                placeholder="Search pair or Zone ID..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full bg-slate-950 border border-slate-800 pl-10 pr-4 py-2 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-orange-500 transition-colors"
              />
            </div>

            {/* Direction Filters */}
            <div className="flex items-center space-x-2 w-full md:w-auto">
              {['ALL', 'BUY', 'SELL'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => {
                    setDirectionFilter(filter);
                    setCurrentPage(1);
                  }}
                  className={`flex-1 md:flex-initial px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    directionFilter === filter
                      ? 'bg-orange-500 text-slate-950 shadow-md shadow-orange-500/20'
                      : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

          </div>

          {/* Signals Table / Cards Container */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-100">Database Signals Registry</h2>
                <p className="text-xs text-slate-400">Showing {paginatedSignals.length} of {filteredSignals.length} signals</p>
              </div>
              <span className="text-xs font-mono text-slate-400 bg-slate-950 px-3 py-1 rounded-lg border border-slate-800">
                Page {currentPage} of {totalPages}
              </span>
            </div>

            {paginatedSignals.length === 0 ? (
              <div className="p-12 text-center text-slate-500">
                <ShieldAlert className="w-10 h-10 mx-auto mb-3 opacity-40 text-orange-400" />
                <p className="text-sm font-medium">No signals found matching your filter criteria.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-800">
                {paginatedSignals.map((signal) => (
                  <div key={signal.id} className="p-5 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 hover:bg-slate-800/30 transition-colors">
                    
                    {/* Asset & Direction */}
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-xl font-black text-xs flex items-center justify-center w-16 ${
                        signal.direction === 'BUY' 
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}>
                        {signal.direction === 'BUY' ? '🟢 BUY' : '🔴 SELL'}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-bold text-slate-100 text-sm tracking-wide">{signal.pair}</h4>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-orange-400 border border-orange-500/20">
                            AOI: {signal.aoi_id}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5 font-mono">ID: {signal.id.slice(0, 8)}...</p>
                      </div>
                    </div>

                    {/* Pricing Matrix (Entry, Stop Loss, Take Profit) */}
                    <div className="grid grid-cols-3 gap-6 text-xs font-mono w-full lg:w-auto">
                      <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                        <span className="text-slate-500 block text-[10px] uppercase font-semibold">Entry Price</span>
                        <span className="text-slate-200 font-bold mt-0.5 block">{signal.entry_price}</span>
                      </div>
                      <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                        <span className="text-rose-400/80 block text-[10px] uppercase font-semibold">Stop Loss</span>
                        <span className="text-rose-400 font-bold mt-0.5 block">{signal.stop_loss}</span>
                      </div>
                      <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                        <span className="text-emerald-400/80 block text-[10px] uppercase font-semibold">Take Profit</span>
                        <span className="text-emerald-400 font-bold mt-0.5 block">{signal.take_profit}</span>
                      </div>
                    </div>

                    {/* Status & Timestamp */}
                    <div className="flex items-center justify-between w-full lg:w-auto space-x-4 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-800">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                        signal.status === 'PENDING' 
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse'
                          : signal.status === 'ACTIVE'
                          ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                          : signal.status === 'COMPLETED'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-slate-800 text-slate-400'
                      }`}>
                        {signal.status}
                      </span>
                      <span className="text-xs text-slate-500 flex items-center gap-1 font-mono">
                        <Clock className="w-3.5 h-3.5" />
                        {new Date(signal.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                  </div>
                ))}
              </div>
            )}

            {/* Pagination Footer */}
            <div className="p-4 border-t border-slate-800 bg-slate-950/40 flex items-center justify-between">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="flex items-center space-x-1 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-medium text-slate-300 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <span className="text-xs text-slate-400 font-medium">
                Page <strong className="text-slate-200">{currentPage}</strong> of <strong className="text-slate-200">{totalPages}</strong>
              </span>

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="flex items-center space-x-1 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-medium text-slate-300 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>
      </main>

      {/* Subscription Modal */}
      <SubscriptionModal 
        isOpen={isSubModalOpen} 
        onClose={() => setIsSubModalOpen(false)} 
      />
    </div>
  );
}
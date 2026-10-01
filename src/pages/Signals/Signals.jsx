import React, { useState, useEffect, useMemo } from 'react';
import SubscriptionModal from '../../components/common/SubcriptionModal';
import { 
  Search, 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  ShieldAlert,
  Loader2
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { fetchSignalsApi } from '../../services/api';

export default function Signals() {
  const { token } = useAuthStore();
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);
  
  const [signals, setSignals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const [searchQuery, setSearchQuery] = useState('');
  const [directionFilter, setDirectionFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    loadSignals();
  }, []);

  const loadSignals = async () => {
    try {
      setLoading(true);
      const data = await fetchSignalsApi(token);
      setSignals(data || []);
    } catch (err) {
      console.error('Error loading signals:', err.message);
      setErrorMsg(err.message || 'Failed to load live signals.');
    } finally {
      setLoading(false);
    }
  };

  // Filter signals based on search query (pair or aoi_id) and direction
  const filteredSignals = useMemo(() => {
    return signals.filter(sig => {
      const matchesSearch = sig.pair.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesDirection = directionFilter === 'ALL' || sig.direction === directionFilter;
      return matchesSearch && matchesDirection;
    });
  }, [signals, searchQuery, directionFilter]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredSignals.length / itemsPerPage) || 1;
  const paginatedSignals = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredSignals.slice(start, start + itemsPerPage);
  }, [filteredSignals, currentPage]);

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <div className="p-4 space-y-6 max-w-7xl w-full mx-auto">

          {/* Search and Filters Control Bar */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
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

          {/* Signals Table Container */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-bold text-slate-100">Live Signals</h2>
                <p className="text-xs text-slate-400">
                  {loading ? 'Loading...' : `Showing ${paginatedSignals.length} of ${filteredSignals.length} signals`}
                </p>
              </div>
            </div>

            {loading ? (
              <div className="p-16 text-center text-slate-500 flex flex-col items-center justify-center space-y-3">
                <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
                <p className="text-xs font-mono">Fetching latest market signals...</p>
              </div>
            ) : errorMsg ? (
              <div className="p-12 text-center text-red-400 font-mono text-xs">
                {errorMsg}
              </div>
            ) : paginatedSignals.length === 0 ? (
              <div className="p-12 text-center text-slate-500">
                <ShieldAlert className="w-10 h-10 mx-auto mb-3 opacity-40 text-orange-400" />
                <p className="text-sm font-medium">No signals found matching your filter criteria.</p>
              </div>
            ) : (
              <div className="divide-y-2 divide-slate-800">
                {paginatedSignals.map((signal) => (
                  <div key={signal.id} className="p-5 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 hover:bg-slate-800/30 transition-colors">
                    
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-xl justify-center font-black text-xs flex items-center w-20 ${
                        signal.direction === 'BUY' 
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}>
                        {signal.direction === 'BUY' ? (
                          <span className='flex gap-1 justify-center'><span>🟢</span><span>BUY</span></span>
                        ) : (
                          <span className='flex gap-1 justify-center'><span>🔴</span><span>SELL</span></span>
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-100 text-sm tracking-wide">{signal.pair}</h4>
                      </div>
                    </div>

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

                    <div className="flex items-center justify-between w-full lg:w-auto space-x-4 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-800">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium uppercase ${
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

            {!loading && filteredSignals.length > 0 && (
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
            )}

          </div>

        </div>
      </main>

      <SubscriptionModal 
        isOpen={isSubModalOpen} 
        onClose={() => setIsSubModalOpen(false)} 
      />
    </div>
  );
}





// import React, { useState, useMemo } from 'react';
// import SubscriptionModal from '../../components/common/SubcriptionModal';
// import { 
//   Bell, 
//   Search, 
//   ArrowUpRight, 
//   ArrowDownRight, 
//   Clock, 
//   ChevronLeft, 
//   ChevronRight, 
//   ShieldAlert,
//   Zap,
//   Target,
//   Shield
// } from 'lucide-react';
// import { useAuthStore } from '../../store/authStore';

// // Mock signals matching your exact Supabase SQL schema columns
// const MOCK_SIGNALS = [
//   { id: '1', pair: 'EURUSD', direction: 'BUY', entry_price: 1.0850, stop_loss: 1.0820, take_profit: 1.0920, aoi_id: 'testaoi999', status: 'PENDING', created_at: '2026-09-29T10:30:00Z' },
//   { id: '2', pair: 'XAUUSD', direction: 'SELL', entry_price: 2328.50, stop_loss: 2335.00, take_profit: 2310.00, aoi_id: 'testaoi888', status: 'ACTIVE', created_at: '2026-09-29T09:15:00Z' },
//   { id: '3', pair: 'BTCUSD', direction: 'BUY', entry_price: 64200.00, stop_loss: 63500.00, take_profit: 66500.00, aoi_id: 'testaoi777', status: 'COMPLETED', created_at: '2026-09-29T06:00:00Z' },
//   { id: '4', pair: 'GBPUSD', direction: 'SELL', entry_price: 1.2710, stop_loss: 1.2760, take_profit: 1.2650, aoi_id: 'testaoi666', status: 'COMPLETED', created_at: '2026-09-28T18:45:00Z' },
//   { id: '5', pair: 'ETHUSD', direction: 'BUY', entry_price: 3450.00, stop_loss: 3400.00, take_profit: 3580.00, aoi_id: 'testaoi555', status: 'PENDING', created_at: '2026-09-28T14:20:00Z' },
//   { id: '6', pair: 'USDJPY', direction: 'SELL', entry_price: 155.80, stop_loss: 156.30, take_profit: 154.90, aoi_id: 'testaoi444', status: 'EXPIRED', created_at: '2026-09-28T10:00:00Z' }
// ];

// export default function Signals() {
//   const { user } = useAuthStore();
//   const [isSubModalOpen, setIsSubModalOpen] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [directionFilter, setDirectionFilter] = useState('ALL'); // ALL, BUY, SELL
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 5;

//   // Filter signals based on search query (pair or aoi_id) and direction
//   const filteredSignals = useMemo(() => {
//     return MOCK_SIGNALS.filter(sig => {
//       const matchesSearch = sig.pair.toLowerCase().includes(searchQuery.toLowerCase()) ||
//                             sig.aoi_id?.toLowerCase().includes(searchQuery.toLowerCase());
//       const matchesDirection = directionFilter === 'ALL' || sig.direction === directionFilter;
//       return matchesSearch && matchesDirection;
//     });
//   }, [searchQuery, directionFilter]);

//   // Pagination calculations (5 items per page)
//   const totalPages = Math.ceil(filteredSignals.length / itemsPerPage) || 1;
//   const paginatedSignals = useMemo(() => {
//     const start = (currentPage - 1) * itemsPerPage;
//     return filteredSignals.slice(start, start + itemsPerPage);
//   }, [filteredSignals, currentPage]);

//   return (
//     <div className="flex min-h-screen bg-slate-950 text-slate-100">
//       {/* Main Content Area */}
//       <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">

//         {/* Content Body */}
//         <div className="p-4 space-y-6 max-w-7xl w-full mx-auto">

//           {/* Search and Filters Control Bar */}
//           <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
            
//             {/* Search Input */}
//             <div className="relative w-full md:w-80">
//               <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
//               <input 
//                 type="text"
//                 placeholder="Search pair or Zone ID..."
//                 value={searchQuery}
//                 onChange={(e) => {
//                   setSearchQuery(e.target.value);
//                   setCurrentPage(1);
//                 }}
//                 className="w-full bg-slate-950 border border-slate-800 pl-10 pr-4 py-2 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-orange-500 transition-colors"
//               />
//             </div>

//             {/* Direction Filters */}
//             <div className="flex items-center space-x-2 w-full md:w-auto">
//               {['ALL', 'BUY', 'SELL'].map((filter) => (
//                 <button
//                   key={filter}
//                   onClick={() => {
//                     setDirectionFilter(filter);
//                     setCurrentPage(1);
//                   }}
//                   className={`flex-1 md:flex-initial px-4 py-2 rounded-xl text-xs font-bold transition-all ${
//                     directionFilter === filter
//                       ? 'bg-orange-500 text-slate-950 shadow-md shadow-orange-500/20'
//                       : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200'
//                   }`}
//                 >
//                   {filter}
//                 </button>
//               ))}
//             </div>

//           </div>

//           {/* Signals Table / Cards Container */}
//           <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
//             <div className="p-6 border-b border-slate-800 flex items-center justify-between">
//               <div className="flex items-center space-x-2">
//                 <h2 className="text-base font-bold text-slate-100">Recent Signals</h2>
//                 <p className="text-xs text-slate-400">Showing {paginatedSignals.length} of {filteredSignals.length} signals</p>
//               </div>
              
//             </div>

//             {paginatedSignals.length === 0 ? (
//               <div className="p-12 text-center text-slate-500">
//                 <ShieldAlert className="w-10 h-10 mx-auto mb-3 opacity-40 text-orange-400" />
//                 <p className="text-sm font-medium">No signals found matching your filter criteria.</p>
//               </div>
//             ) : (
//               <div className="divide-y-2 divide-slate-800 ">
//                 {paginatedSignals.map((signal) => (
//                   <div key={signal.id} className="p-5 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 hover:bg-slate-800/30 transition-colors">
                    
//                     {/* Asset & Direction */}
//                     <div className="flex items-center space-x-4">
//                       <div className={`p-3 rounded-xl justify-center font-black text-xs flex items-center w-16 ${
//                         signal.direction === 'BUY' 
//                           ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
//                           : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
//                       }`}>
//                         {signal.direction === 'BUY' ? <span className='flex gap-1 justify-center'><span>🟢 </span><span>BUY</span></span> : <span className='flex gap-1 justify-center'><span>🔴</span> <span>SELL</span></span>}
//                       </div>
//                       <div>
//                         <div className="flex items-center space-x-2">
//                           <h4 className="font-bold text-slate-100 text-sm tracking-wide">{signal.pair}</h4>
//                         </div>
//                                               </div>
//                     </div>

//                     {/* Pricing Matrix (Entry, Stop Loss, Take Profit) */}
//                     <div className="grid grid-cols-3 gap-6 text-xs font-mono w-full lg:w-auto">
//                       <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
//                         <span className="text-slate-500 block text-[10px] uppercase font-semibold">Entry Price</span>
//                         <span className="text-slate-200 font-bold mt-0.5 block">{signal.entry_price}</span>
//                       </div>
//                       <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
//                         <span className="text-rose-400/80 block text-[10px] uppercase font-semibold">Stop Loss</span>
//                         <span className="text-rose-400 font-bold mt-0.5 block">{signal.stop_loss}</span>
//                       </div>
//                       <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
//                         <span className="text-emerald-400/80 block text-[10px] uppercase font-semibold">Take Profit</span>
//                         <span className="text-emerald-400 font-bold mt-0.5 block">{signal.take_profit}</span>
//                       </div>
//                     </div>

//                     {/* Status & Timestamp */}
//                     <div className="flex items-center justify-between w-full lg:w-auto space-x-4 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-800">
//                       <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
//                         signal.status === 'PENDING' 
//                           ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse'
//                           : signal.status === 'ACTIVE'
//                           ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
//                           : signal.status === 'COMPLETED'
//                           ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
//                           : 'bg-slate-800 text-slate-400'
//                       }`}>
//                         {signal.status}
//                       </span>
//                       <span className="text-xs text-slate-500 flex items-center gap-1 font-mono">
//                         <Clock className="w-3.5 h-3.5" />
//                         {new Date(signal.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//                       </span>
//                     </div>

//                   </div>
//                 ))}
//               </div>
//             )}

//             {/* Pagination Footer */}
//             <div className="p-4 border-t border-slate-800 bg-slate-950/40 flex items-center justify-between">
//               <button
//                 onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
//                 disabled={currentPage === 1}
//                 className="flex items-center space-x-1 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-medium text-slate-300 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
//               >
//                 <ChevronLeft className="w-4 h-4" />
//                 <span>Previous</span>
//               </button>

//               <span className="text-xs text-slate-400 font-medium">
//                 Page <strong className="text-slate-200">{currentPage}</strong> of <strong className="text-slate-200">{totalPages}</strong>
//               </span>

//               <button
//                 onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
//                 disabled={currentPage === totalPages}
//                 className="flex items-center space-x-1 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-medium text-slate-300 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
//               >
//                 <span>Next</span>
//                 <ChevronRight className="w-4 h-4" />
//               </button>
//             </div>

//           </div>

//         </div>
//       </main>

//       {/* Subscription Modal */}
//       <SubscriptionModal 
//         isOpen={isSubModalOpen} 
//         onClose={() => setIsSubModalOpen(false)} 
//       />
//     </div>
//   );
// }
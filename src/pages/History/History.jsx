import React, { useEffect, useState } from 'react';
import { fetchSubscriptionHistoryApi } from '../../services/api.js';

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const loadHistory = async () => {
      try {
        setLoading(true);
        const data = await fetchSubscriptionHistoryApi();
        if (data && data.success) {
          setHistory(data.history || []);
        } else {
          setErrorMsg('Failed to load subscription history.');
        }
      } catch (err) {
        setErrorMsg(err.message || 'An error occurred while fetching history.');
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 text-xs text-slate-400 animate-pulse">
        Loading transaction ledger...
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="flex flex-col items-center justify-center p-8 my-6 rounded-xl bg-[#0d1527] border border-red-500/30 max-w-md mx-auto shadow-lg">
        <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h4 className="mb-1 text-sm font-semibold tracking-wider text-red-400 uppercase">System Alert</h4>
        <p className="text-xs text-center text-slate-400 leading-relaxed">{errorMsg}</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 text-slate-200">
      {/* Header Section */}
      <div className=" p-2 py-4 flex items-center justify-between border-b border-slate-800  gap-2 md:gap-4">
        <div className='mb-4 md:mb-0'>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            Subscription History
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Track your past plan renewals, transaction amounts, and active dates.
          </p>
        </div>

        <span className="px-3 py-2 hidden md:block rounded-md bg-[#162035] text-slate-300 text-xs border border-slate-700 font-medium">
          {history.length} Record{history.length === 1 ? '' : 's'}
        </span>
      </div>

      {/* Main Table Card Container */}
      {history.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 bg-[#0d1527] rounded-xl border border-slate-800/80 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-[#162238] border border-slate-700/60 flex items-center justify-center text-slate-400 text-lg font-bold">
            !
          </div>
          <p className="text-sm font-medium text-slate-300">No subscriptions yet.</p>
          <p className="text-xs text-slate-500 max-w-sm">
            Your transaction and plan renewal records will show up here once activated.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-800/80 bg-[#0d1527]">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#131d33] text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-800">
              <tr>
                <th className="px-5 py-3.5 font-semibold">Plan</th>
                <th className="px-5 py-3.5 font-semibold">Amount</th>
                <th className="px-5 py-3.5 font-semibold">Status</th>
                <th className="px-5 py-3.5 font-semibold">Validity Period</th>
                <th className="px-5 py-3.5 font-semibold">Reference</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {history.map((item) => (
                <tr key={item.id} className="hover:bg-[#131d33]/50 transition-colors">
                  <td className="px-5 py-4 font-semibold text-white uppercase tracking-wider">
                    {item.plan_key}
                  </td>
                  <td className="px-5 py-4 text-[#10b981] font-bold text-sm">
                    ${Number(item.amount).toFixed(2)}
                  </td>
                  <td className="px-5 py-4">
                    <span className="px-2.5 py-1 rounded-md text-[10px] uppercase font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {item.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-slate-400">
                    {new Date(item.period_start).toLocaleDateString()} ➔ {new Date(item.period_end).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-4 text-slate-400 font-mono text-[11px] truncate max-w-[140px]" title={item.reference}>
                    {item.reference || 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default History;
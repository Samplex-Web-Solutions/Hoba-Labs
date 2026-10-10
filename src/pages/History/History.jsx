import React, { useEffect, useState } from 'react';
import { fetchSubscriptionHistoryApi } from '../../services/api';

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
      <div className="flex items-center justify-center p-12 font-mono text-xs text-zinc-500 animate-pulse">
        Loading transaction ledger...
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="flex flex-col items-center justify-center p-8 my-6 rounded-2xl bg-zinc-900/80 border border-red-500/30 backdrop-blur-md shadow-2xl shadow-red-950/20 max-w-md mx-auto">
        <div className="relative flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-red-500/10 border border-red-500/20 text-red-400">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h4 className="mb-1 text-sm font-semibold tracking-wider text-red-400 uppercase font-mono">System Alert</h4>
        <p className="text-xs text-center text-zinc-400 font-mono leading-relaxed">{errorMsg}</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-6 space-y-6 font-mono">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
        <div>
          <h2 className="text-lg font-bold text-zinc-100 tracking-wider">SUBSCRIPTION LEDGER</h2>
          <p className="text-xs text-zinc-500 mt-1">Track your past plan renewals and payment history.</p>
        </div>
        <span className="px-3 py-1 rounded-full bg-zinc-800 text-zinc-300 text-xs border border-zinc-700">
          {history.length} Record{history.length === 1 ? '' : 's'}
        </span>
      </div>

      {history.length === 0 ? (
        <div className="text-center py-12 bg-zinc-900/40 rounded-xl border border-zinc-800/60 text-zinc-500 text-xs">
          No subscription history found.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-900/60 backdrop-blur-sm">
          <table className="w-full text-left text-xs text-zinc-300">
            <thead className="bg-zinc-800/50 text-zinc-400 uppercase tracking-wider border-b border-zinc-800">
              <tr>
                <th className="px-4 py-3">Plan</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Period</th>
                <th className="px-4 py-3">Reference</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {history.map((item) => (
                <tr key={item.id} className="hover:bg-zinc-800/20 transition-colors">
                  <td className="px-4 py-3 font-semibold text-zinc-200 uppercase">{item.plan_key}</td>
                  <td className="px-4 py-3 text-emerald-400 font-bold">${Number(item.amount).toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {item.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-zinc-400">
                    {new Date(item.period_start).toLocaleDateString()} ➔ {new Date(item.period_end).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-zinc-500 truncate max-w-[120px]" title={item.reference}>
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
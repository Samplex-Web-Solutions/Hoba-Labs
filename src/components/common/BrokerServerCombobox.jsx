import React, { useState, useEffect } from 'react';
import { searchBrokerServersApi } from '../services/api'; // Adjust path to your api.js file if necessary
import { Server } from 'lucide-react';

export default function BrokerServerCombobox({ value, onChange, theme = 'dark' }) {
  const [isManual, setIsManual] = useState(false);
  const [searchTerm, setSearchTerm] = useState(value || '');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isManual || searchTerm.trim().length < 2) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await searchBrokerServersApi(searchTerm.trim(), 'mt5');
        if (data.success) {
          setSuggestions(data.servers || []);
          setIsOpen(true);
        }
      } catch (err) {
        console.error('[SERVER_SEARCH_ERROR]:', err);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchTerm, isManual]);

  const handleSelect = (serverName) => {
    setSearchTerm(serverName);
    onChange(serverName);
    setIsOpen(false);
  };

  const isDark = theme === 'dark';

  return (
    <div className="space-y-1.5 w-full">
      <div className="flex justify-between items-center text-xs">
        <span className={`font-medium ${isDark ? 'text-slate-300' : 'text-gray-600 uppercase tracking-wider font-semibold'}`}>
          Broker / Prop Firm Server
        </span>
        <button
          type="button"
          onClick={() => {
            setIsManual(!isManual);
            setIsOpen(false);
          }}
          className="text-orange-400 hover:text-orange-300 text-[11px] font-medium underline"
        >
          {isManual ? '← Search server list' : 'Enter server manually'}
        </button>
      </div>

      {isManual ? (
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            onChange(e.target.value);
          }}
          placeholder="e.g. Exness-MT5Trial11 or FundedNext-Server 2"
          required
          className={
            isDark
              ? 'w-full rounded-xl border border-slate-700/80 bg-slate-950/80 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-orange-400 focus:ring-4 focus:ring-orange-400/10'
              : 'w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-sm text-gray-800 transition-all'
          }
        />
      ) : (
        <div className="relative w-full">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                onChange(e.target.value);
              }}
              onFocus={() => suggestions.length > 0 && setIsOpen(true)}
              placeholder="Search server (e.g. FTMO, Exness, FundedNext)"
              required
              className={
                isDark
                  ? 'w-full rounded-xl border border-slate-700/80 bg-slate-950/80 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-orange-400 focus:ring-4 focus:ring-orange-400/10'
                  : 'w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-sm text-gray-800 transition-all'
              }
            />
          </div>

          {isOpen && (
            <div
              className={`absolute z-30 w-full mt-1.5 rounded-xl border shadow-xl max-h-56 overflow-y-auto ${
                isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-gray-200 text-gray-800'
              }`}
            >
              {loading ? (
                <div className="p-3 text-xs text-slate-400">Searching servers...</div>
              ) : suggestions.length === 0 ? (
                <div
                  onClick={() => setIsManual(true)}
                  className="p-3 text-xs text-slate-400 hover:bg-slate-800/50 cursor-pointer"
                >
                  No match found. Click here to enter server string manually.
                </div>
              ) : (
                suggestions.map((item) => (
                  <div
                    key={item.server_name}
                    onClick={() => handleSelect(item.server_name)}
                    className={`p-3 border-b flex items-center justify-between cursor-pointer transition ${
                      isDark
                        ? 'border-slate-800 hover:bg-slate-800/70'
                        : 'border-gray-100 hover:bg-gray-50'
                    }`}
                  >
                    <div>
                      <div className="text-sm font-semibold">{item.server_name}</div>
                      <div className={`text-xs ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                        {item.company_name}
                      </div>
                    </div>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-mono uppercase ${
                        item.type === 'prop_firm'
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                          : item.type === 'evaluation'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      }`}
                    >
                      {item.type.replace('_', ' ')}
                    </span>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
import React, { useEffect, useState } from 'react';
import { fetchTodayCalendar } from '../../services/api';
import { Calendar as CalendarIcon, RefreshCw, Clock } from 'lucide-react';

const Calendar = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [importanceFilter, setImportanceFilter] = useState('all');

  const loadCalendar = async () => {
    setLoading(true);
    try {
      const res = await fetchTodayCalendar();
      if (res && res.success) {
        const data = res.data || [];
        setEvents(data);
        setFilteredEvents(data);
      }
    } catch (err) {
      console.error('Failed to load today\'s calendar events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCalendar();
  }, []);

  const handleFilterChange = (level) => {
    setImportanceFilter(level);
    if (level === 'all') {
      setFilteredEvents(events);
    } else {
      setFilteredEvents(events.filter(ev => ev.importance?.toLowerCase() === level));
    }
  };

  const getImportanceBadge = (importance) => {
    switch (importance?.toLowerCase()) {
      case 'high':
        return <span className="px-2 py-0.5 text-xs font-bold uppercase bg-red-950/60 text-red-400 rounded border border-red-800/50">High</span>;
      case 'medium':
        return <span className="px-2 py-0.5 text-xs font-bold uppercase bg-amber-950/60 text-amber-400 rounded border border-amber-800/50">Medium</span>;
      case 'low':
        return <span className="px-2 py-0.5 text-xs font-bold uppercase bg-slate-800 text-slate-400 rounded border border-slate-700">Low</span>;
      default:
        return <span className="px-2 py-0.5 text-xs font-bold uppercase bg-slate-900 text-slate-500 rounded border border-slate-800">None</span>;
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <CalendarIcon className="w-6 h-6 text-amber-400" />
            Today's Economic Releases
          </h1>
          <p className="text-sm text-slate-400 mt-1 flex items-center gap-1.5">
            Showing scheduled macro indicators and speeches for today.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-slate-900 p-1 rounded-lg border border-slate-800">
            {['all', 'high', 'medium', 'low'].map((lvl) => (
              <button
                key={lvl}
                onClick={() => handleFilterChange(lvl)}
                className={`px-3 py-1.5 text-xs font-medium capitalize rounded-md transition ${
                  importanceFilter === lvl 
                    ? 'bg-cyan-600 text-white' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>

          <button
            onClick={loadCalendar}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium rounded-lg transition border border-slate-700"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Content Feed */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-20 bg-slate-900 border border-slate-800 rounded-xl animate-pulse"></div>
          ))}
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/40 border border-slate-800 rounded-xl">
          <p className="text-slate-400">No events scheduled for today matching this filter.</p>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
          <div className="divide-y divide-slate-800">
            {filteredEvents.map((ev, idx) => (
              <div key={idx} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-850/50 transition">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 bg-slate-800/80 text-cyan-400 border border-slate-700 rounded-lg mt-0.5 flex flex-col items-center justify-center min-w-[55px]">
                    <span className="text-xs font-bold uppercase">{ev.countryCode || 'GL'}</span>
                    <span className="text-[10px] text-slate-400">{ev.currency || ''}</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-white font-semibold text-base">{ev.name}</h3>
                      {getImportanceBadge(ev.importance)}
                      <span className="text-xs text-slate-500 capitalize px-2 py-0.5 bg-slate-950 rounded">
                        {ev.type}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">
                      {ev.time ? new Date(ev.time).toLocaleTimeString([], { timeStyle: 'short' }) : 'Scheduled'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 text-xs bg-slate-950 px-4 py-2.5 rounded-lg border border-slate-800/80 self-start md:self-auto">
                  <div className="text-center px-2">
                    <span className="text-slate-500 block mb-0.5">Forecast</span>
                    <span className="text-slate-200 font-medium">{ev.forecast ?? 'N/A'}</span>
                  </div>
                  <div className="h-6 w-px bg-slate-800"></div>
                  <div className="text-center px-2">
                    <span className="text-slate-500 block mb-0.5">Previous</span>
                    <span className="text-slate-200 font-medium">{ev.previous ?? 'N/A'}</span>
                  </div>
                  <div className="h-6 w-px bg-slate-800"></div>
                  <div className="text-center px-2">
                    <span className="text-slate-500 block mb-0.5">Actual</span>
                    <span className={`font-bold ${ev.actual !== null ? 'text-emerald-400' : 'text-slate-500'}`}>
                      {ev.actual ?? 'Pending'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;
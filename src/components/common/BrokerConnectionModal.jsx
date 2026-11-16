import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Server, X, LockKeyhole, RefreshCw } from 'lucide-react';
import { connectBrokerApi } from '../../services/api';
import BrokerServerCombobox from './BrokerServerCombobox';
import { toast } from 'react-toastify';

function Field({ label, ...props }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-medium text-slate-300">{label}</span>
      <input
        {...props}
        className="w-full rounded-xl border border-slate-700/80 bg-slate-950/80 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 hover:border-slate-600 focus:border-orange-400 focus:ring-4 focus:ring-orange-400/10"
      />
    </label>
  );
}

export default function BrokerConnectionModal({ isOpen, onClose, onSuccess, user }) {
  const [brokerData, setBrokerData] = useState({ login: '', password: '', server: '', broker: 'mt5' });
  const [connectingBroker, setConnectingBroker] = useState(false);

  if (!isOpen) return null;

  const handleConnectBroker = async (e) => {
    e.preventDefault();
    if (!brokerData.login || !brokerData.password || !brokerData.server) {
      toast.error('Please fill in all required broker credentials.');
      return;
    }

    setConnectingBroker(true);

    try {
      const response = await connectBrokerApi({
        userId: user?.id,
        email: user?.email,
        login: brokerData.login,
        password: brokerData.password,
        server: brokerData.server,
        broker: brokerData.broker,
        magic: 897691,
      });

      if (response.success) {
        toast.success('Broker account connected successfully via TickerAll!');
        setBrokerData({ login: '', password: '', server: '', broker: 'mt5' });
        if (onSuccess) onSuccess();
        onClose();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to connect broker account. Check credentials.');
    } finally {
      setConnectingBroker(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/80 p-4 backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onMouseDown={(e) => {
          if (e.target === e.currentTarget && !connectingBroker) onClose();
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.98 }}
          transition={{ duration: 0.22 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="broker-modal-title"
          className="relative my-8 w-full max-w-lg rounded-3xl border border-slate-700/80 bg-slate-900 p-6 shadow-2xl shadow-black/40 sm:p-8"
        >
          <button
            type="button"
            onClick={onClose}
            disabled={connectingBroker}
            aria-label="Close dialog"
            className="absolute right-5 top-5 rounded-lg p-2 text-slate-500 transition hover:bg-slate-800 hover:text-white disabled:opacity-50"
          >
            <X size={18} />
          </button>

          <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl border border-orange-400/20 bg-orange-400/10 text-orange-300">
            <Server size={22} />
          </div>
          <h2 id="broker-modal-title" className="text-xl font-semibold text-white">
            Connect MetaTrader Account
          </h2>
          <p className="mt-2 max-w-sm text-sm leading-6 text-slate-400">
            Link your MT5 demo or live broker account to enable automated signal execution.
          </p>

          <form onSubmit={handleConnectBroker} className="mt-7 space-y-5">
            <Field
              label="MT5 Account Login"
              type="text"
              inputMode="numeric"
              value={brokerData.login}
              onChange={(e) => setBrokerData({ ...brokerData, login: e.target.value })}
              required
              placeholder="e.g. 84930211"
              autoComplete="off"
            />
            <Field
              label="Trading Password"
              type="password"
              value={brokerData.password}
              onChange={(e) => setBrokerData({ ...brokerData, password: e.target.value })}
              required
              placeholder="Enter your MT5 trading password"
              autoComplete="new-password"
            />

            {/* Searchable Server Combobox with Manual Fallback */}
            <BrokerServerCombobox
              value={brokerData.server}
              onChange={(serverName) => setBrokerData({ ...brokerData, server: serverName })}
              theme="dark"
            />

            <div className="flex items-start gap-2 rounded-xl border border-slate-800 bg-slate-950/60 p-3">
              <LockKeyhole size={15} className="mt-0.5 shrink-0 text-emerald-400" />
              <p className="text-[11px] leading-5 text-slate-500">
                Your credentials establish a secure bridge via TickerAll. Only submit details for the account you want to link.
              </p>
            </div>

            <button
              type="submit"
              disabled={connectingBroker}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-3.5 text-sm font-bold text-slate-950 transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {connectingBroker && <RefreshCw size={16} className="animate-spin" />}
              {connectingBroker ? 'Establishing TickerAll Session...' : 'Save and Connect Account'}
            </button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
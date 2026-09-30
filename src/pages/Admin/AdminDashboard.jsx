import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabaseClient';
import { Shield, DollarSign, RefreshCw, Save, Clock } from 'lucide-react';
import { toast } from 'react-toastify';

export default function AdminDashboard() {
  const [plans, setPlans] = useState([]);
  const [exchangeRate, setExchangeRate] = useState('1500');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    // Fetch Exchange Rate
    const { data: settingsData } = await supabase.from('app_settings').select('*');
    if (settingsData) {
      const rateSetting = settingsData.find(s => s.key === 'naira_exchange_rate');
      if (rateSetting) setExchangeRate(rateSetting.value);
    }

    // Fetch Subscription Plans
    const { data: plansData } = await supabase.from('subscription_plans').select('*');
    if (plansData) {
      // Sort in logical order
      const order = ['monthly', 'quarterly', 'biannual', 'annual'];
      plansData.sort((a, b) => order.indexOf(a.plan_key) - order.indexOf(b.plan_key));
      setPlans(plansData);
    }
  };

  const handlePriceChange = (planKey, newAmount) => {
    setPlans(plans.map(p => p.plan_key === planKey ? { ...p, amount: newAmount } : p));
  };

  const handleSaveAll = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Update exchange rate
      await supabase.from('app_settings').upsert([
        { key: 'naira_exchange_rate', value: exchangeRate, updated_at: new Date() }
      ], { onConflict: 'key' });

      // Update plan prices
      for (const plan of plans) {
        await supabase.from('subscription_plans').update({
          amount: plan.amount,
          updated_at: new Date()
        }).eq('plan_key', plan.plan_key);
      }

      toast.success('Admin pricing & exchange rate updated successfully!');
    } catch (err) {
      toast.error('Failed to update configuration.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
          <Shield className="w-6 h-6 text-orange-400" />
          <span>Hoba Labs Admin Portal</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">Manage subscription plan prices ($USD) and exchange rate.</p>
      </div>

      <form onSubmit={handleSaveAll} className="space-y-6">
        
        {/* Exchange Rate Setting */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl space-y-4">
          <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-orange-400" />
            <span>Exchange Rate Conversion</span>
          </h2>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">NGN per $1 USD</label>
            <input 
              type="number"
              value={exchangeRate}
              onChange={(e) => setExchangeRate(e.target.value)}
              className="w-full md:w-80 bg-slate-950 border border-slate-800 px-4 py-2.5 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-orange-500 font-mono"
            />
          </div>
        </div>

        {/* 4 Subscription Plans Grid */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl space-y-6">
          <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-orange-400" />
            <span>Subscription Tiers</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {plans.map((plan) => {
              const nairaTotal = Number(plan.amount) * Number(exchangeRate);
              return (
                <div key={plan.plan_key} className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-slate-100 text-sm">{plan.name}</h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-orange-400 border border-orange-500/20 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {plan.days} Days
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">USD Price ($)</label>
                    <input 
                      type="number"
                      step="0.01"
                      value={plan.amount}
                      onChange={(e) => handlePriceChange(plan.plan_key, e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-orange-500 font-mono"
                    />
                  </div>

                  <div className="text-xs text-slate-400 flex items-center justify-between pt-2 border-t border-slate-900">
                    <span>Paystack NGN Total:</span>
                    <span className="text-emerald-400 font-bold font-mono">
                      ₦{nairaTotal.toLocaleString()}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center space-x-2 bg-orange-500 hover:bg-orange-600 text-slate-950 font-bold px-6 py-3 rounded-xl text-xs transition-all shadow-lg shadow-orange-500/20 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{loading ? 'Saving Changes...' : 'Save Plan Configurations'}</span>
          </button>
        </div>

      </form>
    </div>
  );
}
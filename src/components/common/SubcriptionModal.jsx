import React, { useState, useEffect } from 'react';
import { getSubscriptionPlansApi, initializeSubscriptionPaymentApi } from '../../services/api';
import { X, Crown, CheckCircle2, Loader2, LayersPlus, Terminal, ShieldCheck } from 'lucide-react';
import { toast } from 'react-toastify';

const SubscriptionModal = ({ isOpen, onClose }) => {
  const [plans, setPlans] = useState([]);
  const [selectedPlanKey, setSelectedPlanKey] = useState('');
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadPlans();
    }
  }, [isOpen]);

  const loadPlans = async () => {
    setLoading(true);
    try {
      const data = await getSubscriptionPlansApi();
      if (data.success && data.plans?.length > 0) {
        setPlans(data.plans);
        // Default to the first plan if none selected or if previous selection isn't in fetched plans
        setSelectedPlanKey(data.plans[0].plan_key);
      }
    } catch (err) {
      console.error('Failed to load plans:', err);
      toast.error(err.message || 'Could not load subscription packages.');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = async () => {
    if (!selectedPlanKey) {
      toast.error('Please select a subscription plan.');
      return;
    }

    setProcessing(true);
    try {
      const data = await initializeSubscriptionPaymentApi(selectedPlanKey);

      if (data.success && data.authorization_url) {
        window.location.href = data.authorization_url;
      }
    } catch (err) {
      console.error('Checkout error:', err);
      toast.error(err.message || 'Failed to start payment session.');
      setProcessing(false);
    }
  };

  if (!isOpen) return null;

  const activePlan = plans.find(p => p.plan_key === selectedPlanKey);
  const isEaPlan = selectedPlanKey.includes('ea') || selectedPlanKey.includes('bundle');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-md max-w-2xl w-full p-6 relative shadow-2xl">
        
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-100 bg-slate-800/50 p-2 rounded-full transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-orange-500/10 border border-orange-500/20 text-orange-400 rounded-md flex items-center justify-center mx-auto mb-3">
            <LayersPlus className="w-6 h-6"/>
          </div>
          <h2 className="text-xl font-semibold text-slate-100">Upgrade Hoba Labs Access</h2>
          <p className="text-xs text-slate-400 mt-1">Choose between manual Telegram Signal streams or 100% automated MT5 EA execution.</p>
        </div>

        {loading ? (
          <div className="py-12 flex items-center justify-center space-x-2 text-slate-400 text-xs">
            <Loader2 className="w-5 h-5 animate-spin text-orange-400" />
            <span>Fetching secure plans...</span>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {plans.map((plan) => {
                const isSelected = selectedPlanKey === plan.plan_key;
                const planIsEa = plan.plan_key.includes('ea') || plan.plan_key.includes('bundle');
                
                return (
                  <div
                    key={plan.plan_key}
                    onClick={() => setSelectedPlanKey(plan.plan_key)}
                    className={`p-4 rounded-md border cursor-pointer transition-all flex flex-col justify-between ${
                      isSelected 
                        ? 'bg-orange-500/10 border-orange-500 text-slate-100 shadow-lg shadow-orange-500/10' 
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-xs font-semibold ${isSelected ? 'text-orange-400' : 'text-slate-200'}`}>
                        {plan.name}
                      </span>
                      <span className={`text-[9px] px-2 py-0.5 rounded font-mono uppercase ${planIsEa ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : 'bg-slate-900 text-slate-300 border border-slate-800'}`}>
                        {planIsEa ? 'Auto EA' : 'Signals'}
                      </span>
                    </div>

                    <div>
                      <div className="text-sm font-semibold text-slate-100">${Number(plan.amount).toFixed(2)}</div>
                      <div className="text-[11px] text-emerald-400 font-mono mt-0.5">
                        ₦{plan.naira_price?.toLocaleString()}
                      </div>
                      <div className="text-[10px] text-slate-500 mt-1 font-mono">Duration: {plan.days} days</div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="bg-slate-950 p-4 rounded-md border border-slate-800 space-y-2 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{isEaPlan ? 'Includes Automated MT5 Client Bridge & API Token Access' : '24/7 Access to Telegram Signal Broadcast Channel'}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Elite v4.15 Gold (XAUUSD) Structural Engine Setups</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={processing || !activePlan}
              className="w-full py-3.5 bg-orange-500 hover:bg-orange-600 text-slate-950 font-semibold rounded-md text-sm transition-all shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {processing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Preparing secure checkout...</span>
                </>
              ) : (
                <span>Pay ₦{activePlan?.naira_price?.toLocaleString()} — {activePlan?.name}</span>
              )}
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default SubscriptionModal;


// import React, { useState, useEffect } from 'react';
// import { getSubscriptionPlansApi, initializeSubscriptionPaymentApi } from '../../services/api';
// import { X, Crown, CheckCircle2, Loader2, LayersPlus } from 'lucide-react';
// import { toast } from 'react-toastify';

// const SubscriptionModal = ({ isOpen, onClose }) => {
//   const [plans, setPlans] = useState([]);
//   const [selectedPlanKey, setSelectedPlanKey] = useState('monthly');
//   const [loading, setLoading] = useState(true);
//   const [processing, setProcessing] = useState(false);

//   useEffect(() => {
//     if (isOpen) {
//       loadPlans();
//     }
//   }, [isOpen]);

//   const loadPlans = async () => {
//     setLoading(true);
//     try {
//       const data = await getSubscriptionPlansApi();
//       if (data.success) {
//         setPlans(data.plans);
//       }
//     } catch (err) {
//       console.error('Failed to load plans:', err);
//       toast.error(err.message || 'Could not load subscription packages.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCheckout = async () => {
//     setProcessing(true);
//     try {
//       const data = await initializeSubscriptionPaymentApi(selectedPlanKey);

//       if (data.success && data.authorization_url) {
//         // Redirect user directly to Paystack's secure checkout page
//         window.location.href = data.authorization_url;
//       }
//     } catch (err) {
//       console.error('Checkout error:', err);
//       toast.error(err.message || 'Failed to start payment session.');
//       setProcessing(false);
//     }
//   };

//   if (!isOpen) return null;

//   const activePlan = plans.find(p => p.plan_key === selectedPlanKey);

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
//       <div className="bg-slate-900 border border-slate-800 rounded-md max-w-xl w-full p-6 relative shadow-2xl">
        
//         <button 
//           onClick={onClose}
//           className="absolute top-5 right-5 text-slate-400 hover:text-slate-100 bg-slate-800/50 p-2 rounded-full transition-colors"
//         >
//           <X className="w-4 h-4" />
//         </button>

//         <div className="text-center mb-6">
//           <div className="w-12 h-12 bg-orange-500/10 border border-orange-500/20 text-orange-400 rounded-md flex items-center justify-center mx-auto mb-3">
//             <LayersPlus className="w-6 h-6"/>
//           </div>
//           <h2 className="text-xl font-semibold text-slate-100">Upgrade to Hoba Labs Pro</h2>
//           <p className="text-xs text-slate-400 mt-1">Select a billing cycle to unlock automated trading signals</p>
//         </div>

//         {loading ? (
//           <div className="py-12 flex items-center justify-center space-x-2 text-slate-400 text-xs">
//             <Loader2 className="w-5 h-5 animate-spin text-orange-400" />
//             <span>Fetching secure plans...</span>
//           </div>
//         ) : (
//           <div className="space-y-4">
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//               {plans.map((plan) => {
//                 const isSelected = selectedPlanKey === plan.plan_key;
                
//                 return (
//                   <div
//                     key={plan.plan_key}
//                     onClick={() => setSelectedPlanKey(plan.plan_key)}
//                     className={`p-4 rounded-md border cursor-pointer transition-all flex flex-col justify-between ${
//                       isSelected 
//                         ? 'bg-orange-500/10 border-orange-500 text-slate-100 shadow-lg shadow-orange-500/10' 
//                         : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
//                     }`}
//                   >
//                     <div className="flex items-center justify-between mb-2">
//                       <span className={`text-xs font-semibold ${isSelected ? 'text-orange-400' : 'text-slate-200'}`}>
//                         {plan.name}
//                       </span>
//                       <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">
//                         {plan.days}d
//                       </span>
//                     </div>

//                     <div>
//                       <div className="text-sm font-semibold text-slate-100">${Number(plan.amount).toFixed(2)}</div>
//                       <div className="text-[11px] text-emerald-400 font-mono mt-0.5">
//                         ₦{plan.naira_price?.toLocaleString()}
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>

//             <div className="bg-slate-950 p-4 rounded-md border border-slate-800 space-y-2 text-xs text-slate-300">
//               <div className="flex items-center gap-2">
//                 <CheckCircle2 className="w-4 h-4 text-emerald-400" />
//                                 <span>24/7 Access Telegram Bot</span>

//               </div>
//               <div className="flex items-center gap-2">
//                 <CheckCircle2 className="w-4 h-4 text-emerald-400" />
//                               <span>Real-Time Automated Multi-Asset Signal Stream</span>

//               </div>
//             </div>

//             <button
//               onClick={handleCheckout}
//               disabled={processing}
//               className="w-full py-3.5 bg-orange-500 hover:bg-orange-600 text-slate-950 font-semibold rounded-md text-sm transition-all shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
//             >
//               {processing ? (
//                 <>
//                   <Loader2 className="w-4 h-4 animate-spin" />
//                   <span>Preparing secure checkout...</span>
//                 </>
//               ) : (
//                 <span>Pay ₦{activePlan?.naira_price?.toLocaleString()} ({activePlan?.name})</span>
//               )}
//             </button>
//           </div>
//         )}

//       </div>
//     </div>
//   );
// }

// export default SubscriptionModal;
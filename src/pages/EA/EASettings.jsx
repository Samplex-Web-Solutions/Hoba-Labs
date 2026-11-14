import React, { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { Copy, Check, Download, Terminal, ShieldAlert } from 'lucide-react';
import { toast } from 'react-toastify';

export default function EABridgeSettings() {
  const { user } = useAuthStore();
  const [copied, setCopied] = useState(false);

  // user.client_id serves as their unique EA API Token
  const apiToken = user?.client_id || 'Generating token...';

  const handleCopyToken = () => {
    navigator.clipboard.writeText(apiToken);
    setCopied(true);
    toast.success('API Token copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadEA = () => {
    // Generates and triggers download of the compiled/source file client bridge script
    const eaCode = `//+------------------------------------------------------------------+\n` +
                   `//|                               HobaLabs_Client_Bridge.mq5 |\n` +
                   `//|               API Token: ${apiToken}                    |\n` +
                   `//+------------------------------------------------------------------+\n` +
                   `#property strict\ninput string InpApiToken = "${apiToken}";\n` +
                   `input string InpServerURL = "https://hobalabs-api.absg-ohos.cloud/api/execution/gold-signals";\n` +
                   `// ... rest of execution bridge code ...`;
                   
    const blob = new Blob([eaCode], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'HobaLabs_Client_Bridge.mq5';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Client EA file downloaded successfully!');
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-md p-6 space-y-6 text-slate-100">
      <div className="flex items-center space-x-3">
        <div className="p-3 bg-orange-500/10 border border-orange-500/20 text-orange-400 rounded-md">
          <Terminal className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-lg font-semibold">MetaTrader 5 Auto-Execution Bridge</h2>
          <p className="text-xs text-slate-400">Configure your personal EA bridge to receive automated v4.15 Gold signals.</p>
        </div>
      </div>

      {/* API Token Box */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-slate-300">Your Unique API Token (Secret)</label>
        <div className="flex items-center space-x-2">
          <input 
            type="text" 
            readOnly 
            value={apiToken} 
            className="w-full bg-slate-950 border border-slate-800 rounded-md px-4 py-2.5 text-sm font-mono text-orange-400 select-all"
          />
          <button 
            onClick={handleCopyToken}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2.5 rounded-md text-sm font-medium transition-colors flex items-center space-x-1.5 shrink-0"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
        <p className="text-[11px] text-slate-500">Never share this token. It links your MetaTrader 5 terminal directly to your Hoba Labs subscriber account.</p>
      </div>

      {/* Download EA Button */}
      <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-medium">Download Client Bridge EA</h4>
          <p className="text-xs text-slate-400 mt-0.5">Drop this file into your MT5 `MQL5/Experts/` folder and attach to XAUUSD.</p>
        </div>
        <button 
          onClick={handleDownloadEA}
          className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-slate-950 px-5 py-2.5 rounded-md text-sm font-semibold transition-all shadow-lg shadow-orange-500/20 flex items-center justify-center space-x-2"
        >
          <Download className="w-4 h-4" />
          <span>Download .mq5 Bridge</span>
        </button>
      </div>

      {/* Setup Guide Warning Note */}
      <div className="bg-slate-950 border border-slate-800 p-4 rounded-md flex items-start space-x-3 text-xs text-slate-400">
        <ShieldAlert className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-slate-200 block mb-1">Important MT5 Terminal Setting:</strong>
          Make sure to enable automated web requests in MetaTrader 5 by going to
           <code className="text-orange-400 bg-slate-900 px-1 py-0.5 rounded">Tools -&gt; Options -&gt; Expert Advisors</code>
            and checking <code className="text-orange-400 bg-slate-900 px-1 py-0.5 rounded">Allow WebRequest for listed URL
              </code>, then add your Hostinger VPS domain: <code className="text-emerald-400 bg-slate-900 px-1 py-0.5 rounded">
                https://hobalabs.......</code>.
        </div>
      </div>
    </div>
  );
}
import React, { useState } from 'react';
import { connectBrokerApi } from '../services/api'; // Import your api helper
import { useAuthStore } from '../store/authStore';  // Import your auth store

export default function BrokerConnect() {
  const { user } = useAuthStore(); // Get active user details from your Zustand store
  
  const [formData, setFormData] = useState({
    login: '',
    password: '',
    server: '',
    magic: 897691,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      // Call the clean API wrapper
      const response = await connectBrokerApi({
        userId: user?.id,
        email: user?.email,
        login: formData.login,
        password: formData.password,
        server: formData.server
      });

      if (response.success) {
        setMessage('Broker account successfully connected and provisioned on MetaApi!');
        setFormData({ login: '', password: '', server: '' }); // Reset form
      }
    } catch (err) {
      setError(err.message || 'Failed to provision broker account. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">Connect MetaTrader 5 Broker</h2>
        <p className="text-sm text-gray-500 mt-1">
          Link your demo or live broker account to enable automated Hoba Labs signal execution.
        </p>
      </div>

      {message && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl">
          {message}
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
            MT5 Account Login newly sent
          </label>
          <input
            type="text"
            name="login"
            value={formData.login}
            onChange={handleChange}
            required
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-sm text-gray-800 transition-all"
            placeholder="e.g. 84930211"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
            Master / Trading Password
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-sm text-gray-800 transition-all"
            placeholder="••••••••"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
            Broker Server Name
          </label>
          <input
            type="text"
            name="server"
            value={formData.server}
            onChange={handleChange}
            required
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-sm text-gray-800 transition-all"
            placeholder="e.g. Deriv-Demo or ICMarketsSC-Demo"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-2 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors text-sm shadow-sm disabled:opacity-50 flex items-center justify-center"
        >
          {loading ? (
            <span className="flex items-center space-x-2">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Provisioning Container...
            </span>
          ) : (
            'Connect Broker Account'
          )}
        </button>
      </form>
    </div>
  );
}
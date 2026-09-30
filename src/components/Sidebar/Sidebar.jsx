import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  TrendingUp, 
  LineChart, 
  Bell, 
  History, 
  Settings, 
  LogOut, 
  Crown 
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

const Sidebar = ({ onOpenSubscriptionModal }) => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Markets', path: '/markets', icon: TrendingUp },
    { name: 'Analysis', path: '/analysis', icon: LineChart },
    { name: 'Signals', path: '/signals', icon: Bell },
    { name: 'Backtest', path: '/backtest', icon: History },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-screen sticky top-0">
      {/* Brand Header */}
      <div className="p-6 border-b border-slate-800 flex items-center space-x-3">
        <div className="bg-orange-500 text-slate-950 p-2 rounded-lg font-bold text-xl">
          HL
        </div>
        <div>
          <h1 className="font-bold text-slate-100 tracking-wide">Hoba Labs</h1>
          <p className="text-xs text-slate-400">Signal Intelligence</p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`
              }
            >
              <Icon className="w-5 h-5" />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Subscription Status Card inside Sidebar */}
      <div className="p-4 mx-4 mb-4 rounded-xl bg-slate-950 border border-slate-800">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Plan Status
          </span>
          <Crown className="w-4 h-4 text-orange-400" />
        </div>
        <div className="text-sm font-medium text-slate-200 mb-3 capitalize">
          {user?.subscription_status === 'Active' ? user?.subscription_plan : 'Free Trial'}
        </div>
        <button
          onClick={onOpenSubscriptionModal}
          className="w-full py-2 px-3 bg-orange-500 hover:bg-orange-600 text-slate-950 font-semibold rounded-lg text-xs transition-colors shadow-lg shadow-orange-500/10"
        >
          Upgrade / Renew
        </button>
      </div>

      {/* User Footer / Logout */}
      <div className="p-4 border-t border-slate-800 flex items-center justify-between">
        <div className="truncate pr-2">
          <p className="text-sm font-medium text-slate-200 truncate">
            {user?.firstName || user?.first_name ? `${user.firstName || user.first_name} ${user.lastName || user.last_name || ''}` : 'Trader'}
          </p>
          <p className="text-xs text-slate-500 truncate">{user?.email || user?.phone || 'Connected'}</p>
        </div>
        <button
          onClick={handleLogout}
          className="text-slate-400 hover:text-red-400 p-2 rounded-lg hover:bg-slate-800/50 transition-colors"
          title="Logout"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
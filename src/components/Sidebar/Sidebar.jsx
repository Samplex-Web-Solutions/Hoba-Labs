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
  Crown,
  X ,
  ChartLine
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import Logo from '../../assets/images/hoba-labs-logo-horizontal.png';

const Sidebar = ({ onOpenSubscriptionModal, isMobileOpen, onCloseMobile }) => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Charts', path: '/charts', icon: ChartLine },
    { name: 'Analysis', path: '/analysis', icon: LineChart },
    { name: 'Signals', path: '/signals', icon: Bell },
    { name: 'Backtest', path: '/backtest', icon: History },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Determine subscription display status
  const subStatus = (user?.subscription).toLowerCase();
  const isPaid = subStatus === 'active' || subStatus === 'monthly' || subStatus === 'annual';
  const planDisplay = isPaid ? (user?.subscription || 'Pro Plan') : 'Free Trial';

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div 
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 md:hidden transition-opacity"
        />
      )}

      {/* Sidebar Slide-out Drawer */}
      <aside className={`
        fixed md:sticky top-0 left-0 h-screen z-50 w-64 
        bg-slate-900 border-r border-slate-800 
        flex flex-col transition-transform duration-300 ease-in-out shrink-0
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Brand Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img src={Logo} alt="Hoba Labs" className="h-16 md:h-20 lg:h-16 w-auto" />
          </div>
          {/* Close Button on Mobile */}
          <button 
            onClick={onCloseMobile}
            className="md:hidden text-slate-400 hover:text-white p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-3 md:py-6 lg:py-3 rounded-md text-sm md:text-lg lg:text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`
                }
              >
                <Icon className="w-5 h-5 md:w-8 md:h-8 lg:w-5 lg:h-5" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {isPaid ? ''
         : <div className="p-4 mx-4 mb-4 rounded-md bg-slate-950 border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Plan Status
            </span>
            <Crown className="w-4 h-4 text-orange-400" />
          </div>
          <div className="text-sm font-medium text-slate-200 mb-3 capitalize">
            {planDisplay}
          </div>
          <button
            onClick={() => {
              onOpenSubscriptionModal?.();
              onCloseMobile?.();
            }}
            className="w-full py-2 px-3 bg-orange-500 hover:bg-orange-600 text-slate-950 font-semibold rounded-lg text-xs transition-colors shadow-lg shadow-orange-500/10"
          >
            {isPaid ? 'Manage Subscription' : 'Upgrade'}
          </button>
        </div>}

        {/* User Footer / Logout */}
        <div className="p-4 mb-2 md:mb-2 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={handleLogout}
            className="text-slate-400 group w-full hover:text-red-400 p-3 flex gap-2 rounded-md hover:bg-red-900/30 transition-colors"
            title="Logout"
          >
            <LogOut className="w-5 h-5 group-hover:rotate-12 duration-200 ease-in-out" />
            <span className="text-sm font-medium">Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
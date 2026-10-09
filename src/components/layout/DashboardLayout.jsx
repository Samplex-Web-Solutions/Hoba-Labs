import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';
import SubscriptionModal from '../../components/common/SubcriptionModal';
import { Menu } from 'lucide-react';
import Logo from '../../assets/images/hoba-labs-logo-horizontal.png';

const DashboardLayout = () => {
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="h-screen w-screen relative bg-slate-950 font-sans flex text-slate-100 overflow-hidden">
      
      {/* Mobile Header Bar with Hamburger */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-slate-900 border-b border-slate-800 z-30 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <img src={Logo} alt="Hoba Labs" className="h-14 w-auto" />
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-slate-400 hover:text-white bg-slate-800/50 rounded-lg"
          aria-label="Toggle Menu"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Sidebar Component */}
      <Sidebar 
        onOpenSubscriptionModal={() => setIsSubModalOpen(true)}
        isMobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Area (Scrolls independently) */}
      <main className="flex-1 h-full pt-20 md:pt-0 overflow-y-auto min-w-0">
        <Outlet />
      </main>

      {/* Global Subscription Modal */}
      <SubscriptionModal 
        isOpen={isSubModalOpen} 
        onClose={() => setIsSubModalOpen(false)} 
      />
    </div>
  );
};

export default DashboardLayout;
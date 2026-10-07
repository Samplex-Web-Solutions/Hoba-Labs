import React, { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import SubscriptionModal from '../../components/common/SubcriptionModal';
import { 
  User, Lock, Crown, Bell, Shield, 
  Check, AlertCircle, Save, Loader2 
} from 'lucide-react';
import { toast } from 'react-toastify';

const Settings = () => {
  const { user } = useAuthStore();
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);

  // Profile Form State
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || user?.first_name || '',
    lastName: user?.lastName || user?.last_name || '',
    phone: user?.phone || '',
  });

  // Password Form State
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Notification Preferences State
  const [notifications, setNotifications] = useState({
    emailSignals: true,
    telegramAlerts: true,
    marketingEmails: false,
  });

  // Determine subscription display status
  const subStatus = (user?.subscription).toLowerCase();
  const isPaid = subStatus === 'active' || subStatus === 'monthly' || subStatus === 'annual';
  const planDisplay = isPaid ? (user?.subscription || 'Pro Plan') : 'Free Trial';

  const handleProfileChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoadingProfile(true);
    try {
      // Simulate API call to update profile
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success('Profile details updated successfully!');
    } catch (err) {
      toast.error('Failed to update profile.');
    } finally {
      setLoadingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match.');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters long.');
      return;
    }

    setLoadingPassword(true);
    try {
      // Simulate API call to update password
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success('Password changed successfully!');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error('Failed to change password.');
    } finally {
      setLoadingPassword(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto p-4 md:p-2 max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="mb-8 border-b border-slate-800 pb-4">
          <h1 className="text-2xl font-bold tracking-tight text-slate-100">Account Settings</h1>
          <p className="text-slate-400 text-sm mt-1">Manage your profile, security preferences, and subscription plan.</p>
        </div>

        <div className="space-y-8">

          {/* SECTION 1: Plan & Subscription Management */}
          <div className="bg-slate-900 border border-slate-800 rounded-md p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-orange-400 font-semibold text-lg">
                <Crown className="w-5 h-5" />
                <span>Subscription</span>
              </div>
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${
                isPaid 
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                  : 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
              }`}>
                {isPaid ? 'Active Plan' : 'Free Trial'}
              </span>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <p className="text-sm text-slate-300 font-medium">
                  Current Plan: <span className="text-orange-400 font-bold capitalize">{planDisplay}</span>
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Enjoying automated Smart Money signals and 24/7 Telegram bot access.
                </p>
              </div>
             {isPaid ? "" :  <button
                onClick={() => setIsSubModalOpen(true)}
                className="bg-orange-500 hover:bg-orange-600 text-slate-950 font-bold px-4 py-2.5 rounded-md text-xs transition-colors shadow-lg shadow-orange-500/10"
              >
                {isPaid ? 'Manage Subscription' : 'Upgrade / Renew Plan'}
              </button>}
            </div>
          </div>

          {/* SECTION 2: Profile Name & Details */}
          <div className="bg-slate-900 border border-slate-800 rounded-md p-6 shadow-lg">
            <div className="flex items-center gap-2 text-orange-500 font-semibold text-lg mb-4 pb-3 border-b border-slate-800">
              <User className="w-5 h-5" />
              <span>Personal Information</span>
            </div>

            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={profileData.firstName}
                    onChange={handleProfileChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-md px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-orange-500/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={profileData.lastName}
                    onChange={handleProfileChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-md px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-orange-500/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Phone Number</label>
                <input
                  type="text"
                  name="phone"
                  value={profileData.phone}
                  onChange={handleProfileChange}
                  className="w-full bg-slate-950 border border-slate-800 rounded-md px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-orange-500/50"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={loadingProfile}
                  className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-md text-xs font-semibold transition-colors border border-slate-700"
                >
                  {loadingProfile ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>

          {/* SECTION 3: Change Password */}
          <div className="bg-slate-900 border border-slate-800 rounded-md p-6 shadow-lg">
            <div className="flex items-center gap-2 text-orange-500 font-semibold text-lg mb-4 pb-3 border-b border-slate-800">
              <Lock className="w-5 h-5" />
              <span>Security & Password</span>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Current Password</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  placeholder="••••••••"
                  className="w-full bg-slate-950 border border-slate-800 rounded-md px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-orange-500/50"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">New Password</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    placeholder="••••••••"
                    className="w-full bg-slate-950 border border-slate-800 rounded-md px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-orange-500/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    placeholder="••••••••"
                    className="w-full bg-slate-950 border border-slate-800 rounded-md px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-orange-500/50"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={loadingPassword}
                  className="flex items-center space-x-2 bg-orange-500 hover:bg-orange-600 text-slate-950 px-4 py-2 rounded-md text-xs font-bold transition-colors shadow-lg shadow-orange-500/10"
                >
                  {loadingPassword ? <Loader2 className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4" />}
                  <span>Update Password</span>
                </button>
              </div>
            </form>
          </div>

          {/* SECTION 4: Notification Preferences */}
          <div className="bg-slate-900 border border-slate-800 rounded-md p-6 shadow-lg">
            <div className="flex items-center gap-2 text-orange-500 font-semibold text-lg mb-4 pb-3 border-b border-slate-800">
              <Bell className="w-5 h-5" />
              <span>Notification Preferences</span>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-200">Email Signal Alerts</p>
                  <p className="text-xs text-slate-500">Receive instant email notifications for new Smart Money setups.</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={notifications.emailSignals} 
                  onChange={() => setNotifications({...notifications, emailSignals: !notifications.emailSignals})}
                  className="w-4 h-4 accent-orange-500 cursor-pointer" 
                />
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800/60">
                <div>
                  <p className="text-sm font-medium text-slate-200">Telegram Bot Notifications</p>
                  <p className="text-xs text-slate-500">Get automated trade execution updates directly in your Telegram.</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={notifications.telegramAlerts} 
                  onChange={() => setNotifications({...notifications, telegramAlerts: !notifications.telegramAlerts})}
                  className="w-4 h-4 accent-orange-500 cursor-pointer" 
                />
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Subscription Modal Integration */}
      <SubscriptionModal
        isOpen={isSubModalOpen}
        onClose={() => setIsSubModalOpen(false)}
      />
    </div>
  );
};

export default Settings;
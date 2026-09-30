import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

export default function ProtectedRoute({ children, requireOnboarding = true }) {
  const { user, loadingAuth } = useAuthStore();

  // Show loading spinner while checking Telegram or browser session storage
  if (loadingAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950 text-slate-100">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-orange-500"></div>
      </div>
    );
  }

  // 1. If user is not logged in at all, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 2. If the route requires onboarding to be finished, but it isn't -> redirect to onboarding
  if (requireOnboarding && !user.onboarding_completed) {
    return <Navigate to="/onboarding" replace />;
  }

  // 3. If they try to access onboarding AFTER they have already completed it -> redirect to dashboard
  if (!requireOnboarding && user.onboarding_completed) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
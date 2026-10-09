import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/protectedRoute/ProtectedRoute';
import Register from '../pages/Auth/Register';
import Login from '../pages/Auth/Login';
import Onboarding from '../pages/Onboarding/Onboarding';
import Dashboard from '../pages/Dashboard/Dashboard';
import Markets from '../pages/Markets/Markets';
import Analysis from '../pages/Analysis/Analysis';
import Signals from '../pages/Signals/Signals';
import Backtest from '../pages/Backtest/Backtest';
import News from '../pages/News/News';
import Settings from '../pages/Settings/Settings';
import Charts from '../pages/Charts/Charts';
import LinkTelegram from '../pages/LinkTelegram';
import { useAuthStore } from '../store/authStore';
import DashboardLayout from '../components/layout/DashboardLayout';

export default function AppRoutes() {
  const { user, completeOnboarding } = useAuthStore();

  return (
    <Routes>
      {/* Smart Root Redirect */}
      <Route
        path="/"
        element={user ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />}
      />

      {/* Public Auth & Linking Routes */}
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/link-telegram" element={<LinkTelegram />} />

      {/* Onboarding Flow: Requires login, but ensures onboarding_completed is false */}
      <Route
        path="/onboarding"
        element={
          <ProtectedRoute requireOnboarding={false}>
            <Onboarding
              onComplete={() => {
                completeOnboarding();
                window.location.href = '/dashboard';
              }}
            />
          </ProtectedRoute>
        }
      />

      <Route element={<DashboardLayout />}>
        {/* Protected Terminal Routes: Requires login AND completed onboarding */}
        <Route path="/dashboard" element={<ProtectedRoute requireOnboarding={true}><Dashboard /></ProtectedRoute>} />
        <Route path="/charts" element={<ProtectedRoute requireOnboarding={true}><Charts /></ProtectedRoute>} />
        <Route path="/analysis" element={<ProtectedRoute><Analysis /></ProtectedRoute>} />
        <Route path="/signals" element={<ProtectedRoute><Signals /></ProtectedRoute>} />
        <Route path="/news" element={<ProtectedRoute><News/></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      </Route>

      {/* Smart Fallback Catch-All */}
      <Route
        path="*"
        element={user ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />}
      />
    </Routes>
  );
}
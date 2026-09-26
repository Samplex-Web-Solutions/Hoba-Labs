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
import Settings from '../pages/Settings/Settings';
import LinkTelegram from '../pages/LinkTelegram';
import { useAuthStore } from '../store/authStore';

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

      {/* Onboarding Flow */}
      <Route 
        path="/onboarding" 
        element={
          <Onboarding 
            onComplete={() => {
              completeOnboarding();
              window.location.href = '/dashboard';
            }} 
          />
        } 
      />
      
      {/* Protected Terminal Routes */}
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/markets" element={<ProtectedRoute><Markets /></ProtectedRoute>} />
      <Route path="/analysis" element={<ProtectedRoute><Analysis /></ProtectedRoute>} />
      <Route path="/signals" element={<ProtectedRoute><Signals /></ProtectedRoute>} />
      <Route path="/backtest" element={<ProtectedRoute><Backtest /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />

      {/* Smart Fallback Catch-All */}
      <Route 
        path="*" 
        element={user ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />} 
      />
    </Routes>
  );
}
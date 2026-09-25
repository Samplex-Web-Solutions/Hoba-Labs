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
import { useAuthStore } from '../store/authStore';

export default function AppRoutes() {
  const { completeOnboarding } = useAuthStore();
  const navigate = useNavigateHelper(); // or standard router hooks

  return (
    <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route  path="/onboarding" 
        element={ <Onboarding onComplete={() => {
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

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

function useNavigateHelper() {
  return {};
}
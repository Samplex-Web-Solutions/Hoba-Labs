import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import Loading from '../common/Loading';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, user, isLoadingAuth } = useAuthStore();

  if (isLoadingAuth) return <Loading />

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user && !user.onboarding_completed) {
    return <Navigate to="/onboarding" replace />;
  }

  return children;
}
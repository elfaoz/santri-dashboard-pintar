import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  guestAllowed?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, guestAllowed = false }) => {
  const { isAuthenticated, isGuest } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Guest users can only access pages where guestAllowed is true
  if (isGuest && !guestAllowed) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
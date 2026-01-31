import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  guestAllowed?: boolean;
}

// Role-based protected routes configuration
const roleProtectedRoutes: { [role: string]: string[] } = {
  student: ['/profile', '/event', '/user-management', '/settings', '/backup'],
  teacher: ['/event', '/user-management', '/settings', '/backup'],
  parent: ['/profile', '/attendance', '/halaqah', '/activities', '/finance', '/event', '/add-student', '/user-management', '/settings'],
  admin: [], // Admin has access to everything
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, guestAllowed = false }) => {
  const { isAuthenticated, isGuest, username } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Guest users can only access pages where guestAllowed is true
  if (isGuest && !guestAllowed) {
    return <Navigate to="/dashboard" replace />;
  }

  // Check role-based access from stored users
  const usersWithRoles = JSON.parse(localStorage.getItem('kdm_users_roles') || '[]');
  const currentUser = usersWithRoles.find((u: any) => u.username === username);
  
  if (currentUser && currentUser.role !== 'admin') {
    const protectedRoutes = roleProtectedRoutes[currentUser.role] || [];
    const currentPath = window.location.pathname;
    
    if (protectedRoutes.includes(currentPath)) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;

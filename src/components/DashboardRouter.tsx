import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const DashboardRouter: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Redirect to role-specific dashboard
  switch (user.role) {
    case 'broker':
      return <Navigate to="/broker/dashboard" replace />;
    case 'client':
      return <Navigate to="/client/dashboard" replace />;
    case 'admin':
      return <Navigate to="/admin/dashboard" replace />;
    default:
      return <Navigate to="/" replace />;
  }
};

export default DashboardRouter;
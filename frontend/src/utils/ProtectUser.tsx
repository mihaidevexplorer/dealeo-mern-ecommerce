
// src\utils\ProtectUser.tsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthState } from '../hooks/useAuth';

const ProtectUser: React.FC = () => {
  const { isAuthenticated } = useAuthState();
  
  if (isAuthenticated) {
    return <Outlet />;
  } else {
    return <Navigate to="/login" replace={true} />;
  }
};

export default ProtectUser;
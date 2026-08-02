import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import Loader from './Loader';

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <Loader fullScreen text="Authenticating..." />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div className="glass-card p-8 rounded-2xl max-w-lg mx-auto my-12 text-center space-y-4">
        <h3 className="text-xl font-bold text-rose-400">Access Restricted</h3>
        <p className="text-slate-300 text-sm">
          Your role <span className="font-semibold text-white">({user.role})</span> does not have authorization to view this module.
        </p>
      </div>
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;

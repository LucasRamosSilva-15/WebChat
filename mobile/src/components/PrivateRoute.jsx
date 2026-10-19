import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

export default function PrivateRoute({ children }) {
  const token = localStorage.getItem('chat_token');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children ? children : <Outlet />;
}

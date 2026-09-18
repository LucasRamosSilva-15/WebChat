import { Navigate } from 'react-router-dom';

const AdminRoute = ({ children }) => {
  const adminToken = localStorage.getItem('admin_token');
  
  if (!adminToken) {
    return <Navigate to="/admin-login" replace />;
  }
  
  return children;
};

export default AdminRoute;
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
    const isLoggedIn = localStorage.getItem('chat_isLoggedIn') === 'true';

    if (!isLoggedIn) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default PrivateRoute;

import { Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { socket } from '../socket';

const PrivateRoute = ({ children }) => {
    const isLoggedIn = localStorage.getItem('chat_isLoggedIn') === 'true';

    useEffect(() => {
        if (isLoggedIn && !socket.connected) {
            socket.auth = { token: localStorage.getItem('chat_token') };
            socket.connect();
        }
    }, [isLoggedIn]);

    if (!isLoggedIn) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default PrivateRoute;

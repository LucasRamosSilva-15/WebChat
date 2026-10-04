import { Navigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { socket } from '../socket';

const PrivateRoute = ({ children }) => {
    const location = useLocation();
    const [isLoggedIn, setIsLoggedIn] = useState(() => {
        return localStorage.getItem('chat_isLoggedIn') === 'true' && (!!localStorage.getItem('chat_token') || socket.connected);
    });

    useEffect(() => {
        const handleAuthChange = () => {
            const hasAuth = localStorage.getItem('chat_isLoggedIn') === 'true' && (!!localStorage.getItem('chat_token') || socket.connected);
            setIsLoggedIn(hasAuth);
        };

        window.addEventListener('profileUpdated', handleAuthChange);
        window.addEventListener('sessionExpired', handleAuthChange);

        return () => {
            window.removeEventListener('profileUpdated', handleAuthChange);
            window.removeEventListener('sessionExpired', handleAuthChange);
        };
    }, []);

    useEffect(() => {
        if (isLoggedIn && !socket.connected) {
            socket.auth = { token: localStorage.getItem('chat_token') };
            socket.connect();
        }
    }, [isLoggedIn]);

    if (!isLoggedIn) {
        return <Navigate to="/login" state={{ from: location, sessionExpired: true }} replace />;
    }

    return children;
};

export default PrivateRoute;

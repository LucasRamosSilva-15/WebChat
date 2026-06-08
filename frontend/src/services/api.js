export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
export const API_URL = import.meta.env.VITE_API_URL || `${BACKEND_URL}/api`;

export const getAuthToken = () => {
    return localStorage.getItem('chat_token');
};

export const setAuthToken = (token) => {
    localStorage.setItem('chat_token', token);
};

export const removeAuthToken = () => {
    localStorage.removeItem('chat_token');
};

export const apiRequest = async (endpoint, options = {}) => {
    const token = getAuthToken();

    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        let errorMessage = 'Ocorreu um erro inesperado.';
        try {
            const errorData = await response.json();
            errorMessage = errorData.error || errorMessage;
        } catch (e) {
            errorMessage = response.statusText;
        }
        throw new Error(errorMessage);
    }

    return response.json();
};

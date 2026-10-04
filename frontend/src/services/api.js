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

export const clearAuthSession = () => {
    removeAuthToken();
    localStorage.removeItem('chat_isLoggedIn');
    if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('profileUpdated'));
        window.dispatchEvent(new CustomEvent('sessionExpired'));
    }
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

        // Tratamento automático de 401 (Token Inválido ou Sessão Expirada)
        if (response.status === 401) {
            const isAuthEndpoint = endpoint.startsWith('/auth/') || endpoint.startsWith('/admin/login') || endpoint === '/login';
            if (!isAuthEndpoint && (token || errorMessage.toLowerCase().includes('token') || errorMessage.toLowerCase().includes('acesso negado'))) {
                clearAuthSession();
            }
        }

        throw new Error(errorMessage);
    }

    return response.json();
};

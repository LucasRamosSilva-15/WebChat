import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
            const response = await fetch(apiUrl + '/admin/auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password })
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('admin_token', data.token);
                navigate('/admin');
            } else {
                setError(data.error || 'Senha incorreta.');
            }
        } catch (err) {
            setError('Erro ao conectar com o servidor.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="reveal flex-1 flex items-center justify-center px-6">
            <div className="skeuo-card p-10 w-full text-center max-w-[400px]">
                <div className="flex flex-col items-center mb-10">
                    <h2 className="hero-title font-semibold text-[40px] mb-2">Admin</h2>
                    <p className="text-[#86868b] dark:text-[#94a3b8] font-normal text-[17px] tracking-tight">Acesso Restrito</p>
                </div>
                
                <form onSubmit={handleLogin} className="text-left space-y-6">
                    {error && (
                        <div className="p-3 text-sm rounded-lg font-medium bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900">
                            {error}
                        </div>
                    )}
                    
                    <div>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="skeuo-input w-full px-4 py-3"
                            placeholder="Senha Mestra"
                            required
                        />
                    </div>
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="skeuo-btn w-full py-3 text-[17px] mt-4"
                    >
                        {loading ? 'Acessando...' : 'Entrar no Painel'}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <a
                        href="/"
                        className="text-sm text-[#0066cc] dark:text-blue-400 hover:underline"
                    >
                        Voltar para o Início
                    </a>
                </div>
            </div>
        </main>
    );
};

export default AdminLogin;

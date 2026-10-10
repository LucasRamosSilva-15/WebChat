import React, { useState, useEffect } from 'react';
import {
    FaDownload, FaGavel, FaExclamationCircle, FaUserSlash, FaBan,
    FaCommentDots, FaSearch, FaEye, FaHammer, FaBullhorn,
    FaExclamationTriangle, FaMousePointer, FaInfoCircle, FaChartLine, FaUser, FaImage, FaTimes, FaUsers, FaDoorOpen, FaTrash, FaShieldAlt,
    FaCopy, FaCheck, FaEdit
} from 'react-icons/fa';

const Admin = () => {
    const [activeTab, setActiveTab] = useState('denuncias');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedItem, setSelectedItem] = useState(null);
    const [showMessageModal, setShowMessageModal] = useState(false);
    const [showImageModal, setShowImageModal] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [filterSeverity, setFilterSeverity] = useState('Todas');
    const [filterTime, setFilterTime] = useState('Todos');

    const [adminData, setAdminData] = useState({ salas: [], usuarios: [], denuncias: [], banimentos: [], feedbacks: [] });
    const [globalStats, setGlobalStats] = useState({ total_users: 0, active_rooms: 0, pending_reports: 0, active_bans: 0 });
    const [loading, setLoading] = useState(false);
    const [copiedReason, setCopiedReason] = useState(false);
    const [isEditingReason, setIsEditingReason] = useState(false);
    const [editedReason, setEditedReason] = useState('');
    const [isSavingStatus, setIsSavingStatus] = useState(false);

    React.useEffect(() => {
        const fetchStats = async () => {
            const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
            const token = localStorage.getItem('admin_token') || localStorage.getItem('token');
            try {
                const res = await fetch(`${apiBaseUrl}/stats`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setGlobalStats(data);
                }
            } catch (err) {
                console.error("Erro ao buscar estatísticas:", err);
            }
        };
        fetchStats();
    }, []);

    React.useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const token = localStorage.getItem('admin_token') || localStorage.getItem('token');
            const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

            let endpoint = activeTab;
            if (activeTab === 'denuncias') endpoint = 'reports';
            if (activeTab === 'usuarios') endpoint = 'users';
            if (activeTab === 'salas') endpoint = 'rooms';
            if (activeTab === 'feedbacks') endpoint = 'feedbacks';
            if (activeTab === 'banimentos') endpoint = 'users';

            try {
                const response = await fetch(`${apiBaseUrl}/admin/${endpoint}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                
                if (response.ok) {
                    let data = await response.json();
                    console.log('--- ADMIN DATA DEBUG ---');
                    console.log('Tab:', activeTab);
                    console.log('Data Recebida:', data);

                    if (activeTab === 'banimentos') {
                        data = data.filter(u => u.status === 'Banido').map(u => ({ ...u, user: u.name, type: 'banimento', date: u.created_at }));
                    } else if (activeTab === 'usuarios') {
                        data = data.map(u => ({ ...u, user: u.name, type: 'usuario', date: u.created_at }));
                    } else if (activeTab === 'denuncias') {
                        data = data.map(d => ({ ...d, date: d.created_at, type: 'denuncia', user: d.user?.displayName || d.user?.name || 'Desconhecido' }));
                    } else if (activeTab === 'feedbacks') {
                        data = data.map(f => ({ ...f, date: f.created_at, type: 'feedback', user: f.user?.displayName || f.user?.name || 'Desconhecido' }));
                    } else if (activeTab === 'salas') {
                        data = data.map(s => ({ ...s, date: s.created_at, usersCount: 0, type: 'sala' }));
                    }

                    setAdminData(prev => ({ ...prev, [activeTab]: data }));
                } else if (response.status === 401 || response.status === 403) {
                    console.error('--- ADMIN FETCH ERROR ---', response.status, await response.text());
                    localStorage.removeItem('admin_token');
                    alert('Sua sessão de administrador expirou (limite de 8 horas) ou é inválida. Por favor, faça login novamente para continuar.');
                    window.location.href = '/admin-login';
                } else {
                    console.error('--- ADMIN FETCH ERROR ---', response.status, await response.text());
                }
            } catch (err) {
                console.error("Erro ao buscar dados:", err);
            }
            setLoading(false);
        };
        fetchData();
    }, [activeTab]);

    const handleAction = async () => {
        if (!selectedItem) return;
        const token = localStorage.getItem('admin_token') || localStorage.getItem('token');
        const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

        try {
            if (selectedItem.type === 'usuario' || selectedItem.type === 'banimento') {
                const newStatus = selectedItem.status === 'Banido' ? 'Ativo' : 'Banido';
                const idToBan = selectedItem.type === 'banimento' ? selectedItem.user_id || selectedItem.id : selectedItem.id;

                const res = await fetch(`${apiBaseUrl}/admin/users/${idToBan}/status`, {
                    method: 'PUT',
                    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                    body: JSON.stringify({ status: newStatus })
                });

                if (res.ok) {
                    setAdminData(prev => {
                        const newData = { ...prev };
                        if (newData.usuarios) newData.usuarios = newData.usuarios.map(u => u.id === idToBan ? { ...u, status: newStatus } : u);
                        if (newData.banimentos && newStatus === 'Ativo') {
                            newData.banimentos = newData.banimentos.filter(u => u.id !== idToBan);
                        }
                        return newData;
                    });
                    setSelectedItem(prev => ({ ...prev, status: newStatus }));
                }
            } else if (selectedItem.type === 'sala') {
                if (window.confirm('Tem certeza que deseja apagar esta sala? Esta ação não pode ser desfeita.')) {
                    const res = await fetch(`${apiBaseUrl}/admin/rooms/${selectedItem.id}`, {
                        method: 'DELETE',
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    
                    if (res.ok) {
                        setAdminData(prev => {
                            const newData = { ...prev };
                            if (newData.salas) {
                                newData.salas = newData.salas.filter(s => s.id !== selectedItem.id);
                            }
                            return newData;
                        });
                        setSelectedItem(null);
                    } else {
                        alert('Erro ao apagar sala.');
                    }
                }
            }
        } catch (err) {
            console.error('Erro na ação:', err);
        }
    };
    useEffect(() => {
        if (selectedItem) {
            setEditedReason(selectedItem.reason || '');
            setIsEditingReason(false);
            setCopiedReason(false);
        }
    }, [selectedItem?.id]);

    const handleCopyReason = (text) => {
        if (!text) return;
        navigator.clipboard.writeText(text);
        setCopiedReason(true);
        setTimeout(() => setCopiedReason(false), 2000);
    };

    const handleSaveReason = async () => {
        if (!selectedItem || !editedReason.trim()) return;
        const newReason = editedReason.trim();
        const token = localStorage.getItem('admin_token') || localStorage.getItem('token');
        const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

        try {
            if (selectedItem.type === 'denuncia') {
                await fetch(`${apiBaseUrl}/admin/reports/${selectedItem.id}`, {
                    method: 'PUT',
                    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                    body: JSON.stringify({ reason: newReason })
                });
            }
        } catch (err) {
            console.error('Erro ao salvar motivo:', err);
        }

        setSelectedItem(prev => ({ ...prev, reason: newReason }));
        setAdminData(prev => {
            const tabKey = activeTab;
            if (!prev[tabKey]) return prev;
            return {
                ...prev,
                [tabKey]: prev[tabKey].map(item => item.id === selectedItem.id ? { ...item, reason: newReason } : item)
            };
        });
        setIsEditingReason(false);
    };

    const handleStatusChange = async (newStatus) => {
        if (!selectedItem) return;
        setIsSavingStatus(true);
        const token = localStorage.getItem('admin_token') || localStorage.getItem('token');
        const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

        try {
            if (selectedItem.type === 'denuncia') {
                const apiStatus = newStatus === 'Resolvido' ? 'resolved' : newStatus === 'Descartado' ? 'dismissed' : 'pending';
                const res = await fetch(`${apiBaseUrl}/admin/reports/${selectedItem.id}`, {
                    method: 'PUT',
                    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                    body: JSON.stringify({ status: apiStatus })
                });
                if (res.ok) {
                    setAdminData(prev => ({
                        ...prev,
                        denuncias: (prev.denuncias || []).map(d => d.id === selectedItem.id ? { ...d, status: newStatus } : d)
                    }));
                    setSelectedItem(prev => ({ ...prev, status: newStatus }));
                }
            } else if (selectedItem.type === 'feedback') {
                const apiStatus = newStatus === 'Resolvido' ? 'resolved' : 'pending';
                const res = await fetch(`${apiBaseUrl}/admin/feedbacks/${selectedItem.id}`, {
                    method: 'PUT',
                    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                    body: JSON.stringify({ status: apiStatus })
                });
                if (res.ok) {
                    setAdminData(prev => ({
                        ...prev,
                        feedbacks: (prev.feedbacks || []).map(f => f.id === selectedItem.id ? { ...f, status: newStatus } : f)
                    }));
                    setSelectedItem(prev => ({ ...prev, status: newStatus }));
                }
            } else if (selectedItem.type === 'usuario' || selectedItem.type === 'banimento') {
                const idToUpdate = selectedItem.type === 'banimento' ? selectedItem.user_id || selectedItem.id : selectedItem.id;
                const res = await fetch(`${apiBaseUrl}/admin/users/${idToUpdate}/status`, {
                    method: 'PUT',
                    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                    body: JSON.stringify({ status: newStatus })
                });
                if (res.ok) {
                    setAdminData(prev => ({
                        ...prev,
                        usuarios: (prev.usuarios || []).map(u => u.id === idToUpdate ? { ...u, status: newStatus } : u),
                        banimentos: newStatus === 'Ativo'
                            ? (prev.banimentos || []).filter(u => u.id !== idToUpdate)
                            : (prev.banimentos || [])
                    }));
                    setSelectedItem(prev => ({ ...prev, status: newStatus }));
                }
            }
        } catch (err) {
            console.error('Erro ao atualizar status:', err);
        } finally {
            setIsSavingStatus(false);
        }
    };

    const handleSeverityChange = (newSeverity) => {
        if (!selectedItem) return;
        setSelectedItem(prev => ({ ...prev, severity: newSeverity }));
        setAdminData(prev => {
            const tabKey = activeTab;
            if (!prev[tabKey]) return prev;
            return {
                ...prev,
                [tabKey]: prev[tabKey].map(item => item.id === selectedItem.id ? { ...item, severity: newSeverity } : item)
            };
        });
    };

    const normalizeReportStatus = (status) => {
        if (!status) return 'Pendente';
        const s = String(status).trim().toLowerCase();
        if (s === 'resolved' || s === 'resolvido') return 'Resolvido';
        if (s === 'dismissed' || s === 'descartado') return 'Descartado';
        return 'Pendente';
    };

    const tabTitles = {
        salas: 'Salas',
        usuarios: 'Usuários',
        denuncias: 'Denúncias',
        banimentos: 'Banimentos',
        feedbacks: 'Feedbacks'
    };

    const normalizeStatus = (status) => {
        if (!status) return 'Ativo';
        const s = String(status).trim().toLowerCase();
        if (s === 'active' || s === 'ativo') return 'Ativo';
        if (s === 'ativa') return 'Ativa';
        if (s === 'banned' || s === 'banido') return 'Banido';
        if (s === 'inativa' || s === 'inactive') return 'Inativa';
        if (s === 'pendente' || s === 'pending') return 'Pendente';
        if (s === 'resolvido' || s === 'resolved') return 'Resolvido';
        return status;
    };

    const formatRole = (role) => {
        if (!role) return '-';
        const r = String(role).trim().toLowerCase();
        if (r === 'user' || r === 'usuario' || r === 'usuário') return 'Usuário';
        if (r === 'admin' || r === 'administrador') return 'Administrador';
        if (r === 'moderator' || r === 'moderador') return 'Moderador';
        return role;
    };

    const formatType = (type) => {
        if (!type) return '';
        const t = String(type).trim().toLowerCase();
        if (t === 'usuario') return 'Usuário';
        if (t === 'denuncia') return 'Denúncia';
        if (t === 'sala') return 'Sala';
        if (t === 'banimento') return 'Banimento';
        if (t === 'feedback') return 'Feedback';
        return type;
    };

    const renderStatusBadge = (rawStatus) => {
        const status = normalizeStatus(rawStatus);
        const isPositive = status === 'Ativo' || status === 'Ativa' || status === 'Resolvido';
        const isNegative = status === 'Banido' || status === 'Inativa';

        if (isPositive) {
            return (
                <span className="bg-emerald-50 text-emerald-700 border border-emerald-200/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60 text-[10px] font-bold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    {status}
                </span>
            );
        }

        if (isNegative) {
            return (
                <span className="bg-red-50 text-red-600 border border-red-200/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] dark:bg-red-950/40 dark:text-red-400 dark:border-red-800/60 text-[10px] font-bold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                    {status}
                </span>
            );
        }

        return (
            <span className="bg-amber-50 text-amber-700 border border-amber-200/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60 text-[10px] font-bold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                {status}
            </span>
        );
    };

    const currentData = adminData[activeTab] || [];
    let filteredData = currentData.filter(item => {
        if (!searchTerm) return true;
        const s = searchTerm.toLowerCase();
        const nameMatch = item.user && item.user.toLowerCase().includes(s);
        const emailMatch = item.email && item.email.toLowerCase().includes(s);
        const roomNameMatch = item.name && item.name.toLowerCase().includes(s);
        return nameMatch || emailMatch || roomNameMatch;
    });

    if (filterSeverity !== 'Todas') {
        filteredData = filteredData.filter(item => item.severity === filterSeverity);
    }

    if (filterTime !== 'Todos') {
        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        filteredData = filteredData.filter(item => {
            if (!item.date) return true;
            const itemDate = new Date(item.date);

            if (filterTime === 'Hoje') {
                return itemDate >= startOfToday;
            }
            if (filterTime === 'Última Semana') {
                const sevenDaysAgo = new Date(startOfToday);
                sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
                return itemDate >= sevenDaysAgo;
            }
            if (filterTime === 'Último Mês') {
                const thirtyDaysAgo = new Date(startOfToday);
                thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                return itemDate >= thirtyDaysAgo;
            }
            return true;
        });
    }

    return (
        <div className="flex-1 w-full flex flex-col items-center bg-gray-50/50 dark:bg-transparent">
            <div className="w-full max-w-[1200px] px-4 py-8 md:py-10 animate-fade-in-up-1">

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h1 className="hero-title text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-50">
                                Painel Administrativo
                            </h1>
                            <span className="bg-gradient-to-br from-sky-500 to-sky-600 text-white shadow-sm text-[11px] font-semibold px-2.5 py-1 rounded-xl uppercase tracking-wide">
                                Admin Global
                            </span>
                        </div>
                        <p className="text-[14px] text-gray-500 dark:text-gray-400">
                            Gerencie denúncias, usuários, salas e feedbacks do sistema.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button className="btn-secondary-glossy text-sm px-4 py-2 inline-flex items-center justify-center gap-2 cursor-pointer">
                            <FaDownload size={12} className="text-slate-600 dark:text-slate-300" /> Exportar relatório
                        </button>
                        <button
                            onClick={() => { setActiveTab('denuncias'); setFilterSeverity('Todas'); }}
                            className="skeuo-btn text-sm px-4 py-2.5 inline-flex items-center justify-center gap-2 cursor-pointer"
                        >
                            <FaGavel size={12} /> Revisar denúncias
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 animate-fade-in-up-2">
                    <div className="bg-white/90 backdrop-blur-md border border-white/60 shadow-[0_10px_30px_rgba(0,102,204,0.08)] rounded-2xl p-5 relative overflow-hidden flex flex-col dark:bg-slate-900/80 dark:border-slate-800 dark:shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-8 h-8 rounded-xl bg-sky-100 text-blue-500 dark:bg-blue-500/20 flex items-center justify-center">
                                <FaUsers size={14} />
                            </div>
                            <span className="bg-red-50 text-red-600 border border-red-200/80 dark:bg-red-500/20 dark:border-red-500/30 text-[10px] font-semibold px-2 py-0.5 rounded-lg flex items-center gap-1 shadow-xs">
                                <FaChartLine size={8} /> +12%
                            </span>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-50 mb-1">{globalStats.total_users}</h2>
                        <p className="text-[12px] text-gray-500 dark:text-gray-400 font-medium">Usuários Totais</p>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400/5 dark:bg-blue-400/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
                    </div>

                    <div className="bg-white/90 backdrop-blur-md border border-white/60 shadow-[0_10px_30px_rgba(0,102,204,0.08)] rounded-2xl p-5 relative overflow-hidden flex flex-col dark:bg-slate-900/80 dark:border-slate-800 dark:shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-500 dark:bg-purple-500/20 flex items-center justify-center">
                                <FaDoorOpen size={14} />
                            </div>
                            <span className="bg-red-50 text-red-600 border border-red-200/80 dark:bg-red-500/20 dark:border-red-500/30 text-[10px] font-semibold px-2 py-0.5 rounded-lg flex items-center gap-1 shadow-xs">
                                <FaChartLine size={8} /> +5
                            </span>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-50 mb-1">{globalStats.active_rooms}</h2>
                        <p className="text-[12px] text-gray-500 dark:text-gray-400 font-medium">Salas Ativas</p>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-400/5 dark:bg-purple-400/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
                    </div>

                    <div className="bg-white/90 backdrop-blur-md border border-white/60 shadow-[0_10px_30px_rgba(0,102,204,0.08)] rounded-2xl p-5 relative overflow-hidden flex flex-col dark:bg-slate-900/80 dark:border-slate-800 dark:shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-8 h-8 rounded-xl bg-red-100 text-red-500 dark:bg-red-500/20 flex items-center justify-center">
                                <FaExclamationCircle size={14} />
                            </div>
                            <span className="bg-red-50 text-red-600 border border-red-200/80 dark:bg-red-500/20 dark:border-red-500/30 text-[10px] font-semibold px-2 py-0.5 rounded-lg flex items-center gap-1 shadow-xs">
                                <FaChartLine size={8} /> 15%
                            </span>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-50 mb-1">{globalStats.pending_reports}</h2>
                        <p className="text-[12px] text-gray-500 dark:text-gray-400 font-medium">Denúncias pendentes</p>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-red-400/5 dark:bg-red-400/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
                    </div>

                    <div className="bg-white/90 backdrop-blur-md border border-white/60 shadow-[0_10px_30px_rgba(0,102,204,0.08)] rounded-2xl p-5 relative overflow-hidden flex flex-col dark:bg-slate-900/80 dark:border-slate-800 dark:shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-500 dark:bg-emerald-500/20 flex items-center justify-center">
                                <FaBan size={14} />
                            </div>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-50 mb-1">{globalStats.active_bans}</h2>
                        <p className="text-[12px] text-gray-500 dark:text-gray-400 font-medium">Banimentos ativos</p>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-400/5 dark:bg-emerald-400/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
                    </div>
                </div>

                <div className="skeuo-segmented-track mb-6 overflow-x-auto max-w-full animate-fade-in-up-3">
                    {['Salas', 'Usuários', 'Denúncias', 'Banimentos', 'Feedbacks'].map((tab) => {
                        const tabId = tab.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
                        const isActive = activeTab === tabId;
                        return (
                            <button
                                key={tabId}
                                onClick={() => { setActiveTab(tabId); setSelectedItem(null); setSearchTerm(''); setFilterSeverity('Todas'); setFilterTime('Todos'); }}
                                className={`skeuo-segmented-item w-28 sm:w-32 ${
                                    isActive ? 'skeuo-segmented-item-active' : ''
                                }`}
                            >
                                {tab}
                            </button>
                        );
                    })}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6 animate-fade-in-up-4">

                    <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-6">
                        <div className="bg-white/90 backdrop-blur-md border border-white/60 shadow-[0_10px_30px_rgba(0,102,204,0.08)] rounded-2xl p-6 flex flex-col h-full dark:bg-slate-900/80 dark:border-slate-800 dark:shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
                            <div className="flex flex-col 2xl:flex-row 2xl:items-center justify-between gap-4 mb-6">
                                <h3 className="text-[16px] font-bold text-gray-900 dark:text-gray-50 whitespace-nowrap">
                                    Fila de {tabTitles[activeTab] || activeTab}
                                </h3>
                                <div className="flex flex-col sm:flex-row flex-wrap items-center gap-3 w-full 2xl:w-auto 2xl:justify-end">
                                    {(activeTab === 'denuncias' || activeTab === 'banimentos' || activeTab === 'feedbacks') && (
                                        <>
                                            <select
                                                value={filterTime}
                                                onChange={(e) => setFilterTime(e.target.value)}
                                                className="bg-white/95 border border-slate-200/90 rounded-xl px-3.5 py-2 text-slate-800 text-sm shadow-[inset_0_1px_3px_rgba(0,0,0,0.06)] focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all dark:bg-slate-800/90 dark:border-slate-700 dark:text-slate-200 dark:shadow-[inset_0_1px_3px_rgba(0,0,0,0.3)] cursor-pointer"
                                            >
                                                <option value="Todos">Tempo: Todos</option>
                                                <option value="Hoje">Hoje</option>
                                                <option value="Última Semana">Última Semana</option>
                                                <option value="Último Mês">Último Mês</option>
                                            </select>

                                            <select
                                                value={filterSeverity}
                                                onChange={(e) => setFilterSeverity(e.target.value)}
                                                className="bg-white/95 border border-slate-200/90 rounded-xl px-3.5 py-2 text-slate-800 text-sm shadow-[inset_0_1px_3px_rgba(0,0,0,0.06)] focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all dark:bg-slate-800/90 dark:border-slate-700 dark:text-slate-200 dark:shadow-[inset_0_1px_3px_rgba(0,0,0,0.3)] cursor-pointer"
                                            >
                                                <option value="Todas">Gravidade: Todas</option>
                                                <option value="Extrema">Extrema</option>
                                                <option value="Alta">Alta</option>
                                                <option value="Média">Média</option>
                                                <option value="Baixa">Baixa</option>
                                            </select>
                                        </>
                                    )}

                                    <div className="relative">
                                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={13} />
                                        <input
                                            type="text"
                                            placeholder="Buscar..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="bg-white/95 border border-slate-200/90 rounded-xl pl-9 pr-4 py-2 text-slate-800 text-sm shadow-[inset_0_1px_3px_rgba(0,0,0,0.06)] focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all w-full sm:w-[220px] dark:bg-slate-800/90 dark:border-slate-700 dark:text-slate-200 dark:shadow-[inset_0_1px_3px_rgba(0,0,0,0.3)]"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="overflow-x-auto overflow-y-auto max-h-[420px] skeuo-scrollbar rounded-xl border border-gray-100 dark:border-gray-800">
                                <table className="w-full min-w-[580px] text-left border-collapse">
                                    <thead className="sticky top-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xs z-10 border-b-2 border-gray-200 dark:border-gray-700">
                                        <tr className="text-gray-600 dark:text-gray-400">
                                            {activeTab === 'salas' && (
                                                <>
                                                    <th className="py-3 px-3 text-[12px] font-bold">Sala</th>
                                                    <th className="py-3 px-3 text-[12px] font-bold">Dono</th>
                                                    <th className="py-3 px-3 text-[12px] font-bold">Membros</th>
                                                    <th className="py-3 px-3 text-[12px] font-bold">Status</th>
                                                    <th className="py-3 px-3 text-[12px] font-bold text-right">Criada em</th>
                                                </>
                                            )}
                                            {activeTab === 'usuarios' && (
                                                <>
                                                    <th className="py-3 px-3 text-[12px] font-bold">Usuário</th>
                                                    <th className="py-3 px-3 text-[12px] font-bold">E-mail</th>
                                                    <th className="py-3 px-3 text-[12px] font-bold">Cargo</th>
                                                    <th className="py-3 px-3 text-[12px] font-bold">Status</th>
                                                    <th className="py-3 px-3 text-[12px] font-bold text-right">Cadastrado</th>
                                                </>
                                            )}
                                            {(activeTab === 'denuncias' || activeTab === 'banimentos' || activeTab === 'feedbacks') && (
                                                <>
                                                    <th className="py-3 px-3 text-[12px] font-bold">Usuário</th>
                                                    <th className="py-3 px-3 text-[12px] font-bold">Motivo</th>
                                                    <th className="py-3 px-3 text-[12px] font-bold">Gravidade</th>
                                                    <th className="py-3 px-3 text-[12px] font-bold">Status</th>
                                                    <th className="py-3 px-3 text-[12px] font-bold text-right">Data / Hora</th>
                                                </>
                                            )}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredData.length > 0 ? filteredData.map((item) => (
                                            <tr
                                                key={item.id}
                                                onClick={() => setSelectedItem(item)}
                                                className={`border-b border-gray-100 hover:bg-gray-50/80 dark:border-gray-800 dark:hover:bg-gray-800/40 transition-colors duration-150 cursor-pointer ${selectedItem?.id === item.id ? 'bg-sky-50/70 dark:bg-sky-950/30' : ''}`}
                                            >
                                                {activeTab === 'salas' && (
                                                    <>
                                                        <td className="py-3 px-3">
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-slate-700 flex items-center justify-center shrink-0">
                                                                    <FaDoorOpen className="text-gray-500 dark:text-gray-400" size={10} />
                                                                </div>
                                                                <div>
                                                                    <span className="text-[13px] font-bold text-gray-700 dark:text-gray-300 block">{item.name}</span>
                                                                    <span className="text-[10px] text-gray-500">{item.category}</span>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="py-3 px-3 text-[13px] text-blue-500 font-medium">{item.user}</td>
                                                        <td className="py-3 px-3 text-[13px] text-gray-700 dark:text-gray-300">{item.usersCount} online</td>
                                                        <td className="py-3 px-3">
                                                            {renderStatusBadge(item.status)}
                                                        </td>
                                                        <td className="py-3 px-3 text-right text-[12px] text-gray-500 font-medium">
                                                            {item.date ? new Date(item.date).toLocaleDateString() : '-'}
                                                        </td>
                                                    </>
                                                )}

                                                {activeTab === 'usuarios' && (
                                                    <>
                                                        <td className="py-3 px-3">
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-slate-700 flex items-center justify-center shrink-0">
                                                                    <FaUser className="text-gray-500 dark:text-gray-400" size={10} />
                                                                </div>
                                                                <span className="text-[13px] font-bold text-gray-700 dark:text-gray-300">{item.user}</span>
                                                            </div>
                                                        </td>
                                                        <td className="py-3 px-3 text-[13px] text-gray-700 dark:text-gray-300">{item.email}</td>
                                                        <td className="py-3 px-3 text-[13px] text-gray-700 dark:text-gray-300">{formatRole(item.role)}</td>
                                                        <td className="py-3 px-3">
                                                            {renderStatusBadge(item.status)}
                                                        </td>
                                                        <td className="py-3 px-3 text-right text-[12px] text-gray-500 font-medium">
                                                            {item.date ? new Date(item.date).toLocaleDateString() : '-'}
                                                        </td>
                                                    </>
                                                )}

                                                {(activeTab === 'denuncias' || activeTab === 'banimentos' || activeTab === 'feedbacks') && (
                                                    <>
                                                        <td className="py-3 px-3">
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-slate-700 flex items-center justify-center shrink-0">
                                                                    <FaUser className="text-gray-500 dark:text-gray-400" size={10} />
                                                                </div>
                                                                <span className="text-[13px] font-bold text-gray-700 dark:text-gray-300">{item.user}</span>
                                                            </div>
                                                        </td>
                                                        <td className="py-3 px-3 text-[13px] text-gray-700 dark:text-gray-300">{item.reason}</td>
                                                        <td className="py-3 px-3">
                                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex w-max items-center gap-1 ${item.severity === 'Alta' || item.severity === 'Extrema' ? 'bg-red-100 text-red-600 border border-red-200 dark:bg-red-600/20 dark:border-red-400/30' : 'bg-gray-100 text-gray-600 border border-gray-200 dark:bg-slate-800/20 dark:text-gray-400 dark:border-gray-500/30'}`}>
                                                                {(item.severity === 'Alta' || item.severity === 'Extrema') && <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>}
                                                                {item.severity}
                                                            </span>
                                                        </td>
                                                        <td className="py-3 px-3">
                                                            {renderStatusBadge(item.status)}
                                                        </td>
                                                        <td className="py-3 px-3 text-right text-[12px] text-gray-500 font-medium">
                                                            {item.date ? new Date(item.date).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) : '-'}
                                                        </td>
                                                    </>
                                                )}
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan="5" className="py-12 text-center">
                                                    <div className="flex flex-col items-center justify-center">
                                                        <div className="w-12 h-12 rounded-2xl bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 shadow-[inset_0_1px_1px_rgba(255,255,255,0.9),0_2px_6px_rgba(0,0,0,0.04)] flex items-center justify-center text-slate-400 dark:text-slate-500 mb-3">
                                                            <FaInfoCircle size={20} />
                                                        </div>
                                                        <p className="text-[13px] font-medium text-slate-600 dark:text-slate-300 mb-1">
                                                            {activeTab === 'denuncias' ? 'Nenhuma denúncia registrada de momento.' :
                                                             activeTab === 'usuarios' ? 'Nenhum usuário registrado de momento.' :
                                                             activeTab === 'salas' ? 'Nenhuma sala registrada de momento.' :
                                                             activeTab === 'banimentos' ? 'Nenhum banimento registrado de momento.' :
                                                             'Nenhum feedback registrado de momento.'}
                                                        </p>
                                                        <p className="text-[11px] text-slate-400 dark:text-slate-500">
                                                            Os novos registros aparecerão automaticamente nesta fila.
                                                        </p>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-6">
                        <div className="bg-white/90 backdrop-blur-md border border-white/60 shadow-[0_10px_30px_rgba(0,102,204,0.08)] rounded-2xl p-6 flex flex-col min-h-[360px] dark:bg-slate-900/80 dark:border-slate-800 dark:shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-[16px] font-bold text-gray-900 dark:text-gray-50">Detalhes da Seleção</h3>
                                {selectedItem && (
                                    <button
                                        onClick={() => setSelectedItem(null)}
                                        className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 p-1 rounded-md transition-colors cursor-pointer"
                                        title="Limpar seleção"
                                        aria-label="Limpar seleção"
                                    >
                                        <FaTimes size={14} />
                                    </button>
                                )}
                            </div>

                            {selectedItem ? (
                                <div className="flex-1 flex flex-col pt-1 animate-fade-in-up-1">
                                    <div className="flex items-center justify-between gap-3 mb-4 border-b border-gray-100 dark:border-gray-800 pb-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-slate-700 flex items-center justify-center shrink-0">
                                                {selectedItem.type === 'sala' ? <FaDoorOpen className="text-gray-500 dark:text-gray-400" size={16} /> : <FaUser className="text-gray-500 dark:text-gray-400" size={16} />}
                                            </div>
                                            <div>
                                                <h4 className="text-[16px] font-bold text-gray-900 dark:text-gray-50 leading-tight">
                                                    {selectedItem.name || selectedItem.user}
                                                </h4>
                                                <span className="text-[11px] text-gray-500 dark:text-gray-400">
                                                    {formatType(selectedItem.type)} #{selectedItem.id}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="text-right text-[11px] text-gray-500 bg-slate-50/80 border border-slate-200/80 rounded-xl px-2.5 py-1 shadow-xs dark:bg-slate-800/50 dark:border-slate-700/80">
                                            <span className="block font-bold text-[9px] uppercase tracking-wider text-gray-400">Registro</span>
                                            {selectedItem.date ? new Date(selectedItem.date).toLocaleDateString() : '-'}
                                        </div>
                                    </div>

                                    {(selectedItem.type === 'denuncia' || selectedItem.type === 'banimento' || selectedItem.type === 'feedback') && (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[12px] text-gray-700 dark:text-gray-300 mb-4">
                                            <div className="sm:col-span-2 bg-slate-50/80 border border-slate-200/80 rounded-xl p-3 shadow-xs dark:bg-slate-800/50 dark:border-slate-700/80">
                                                <div className="flex items-center justify-between mb-1.5">
                                                    <strong className="block text-[10px] text-gray-400 uppercase tracking-wide">Motivo / Assunto</strong>
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={() => handleCopyReason(selectedItem.reason)}
                                                            className="inline-flex items-center gap-1 text-[11px] text-slate-500 hover:text-sky-600 dark:text-slate-400 dark:hover:text-sky-400 font-medium transition-colors cursor-pointer"
                                                            title="Copiar motivo"
                                                        >
                                                            {copiedReason ? <FaCheck size={10} className="text-emerald-500" /> : <FaCopy size={10} />}
                                                            <span>{copiedReason ? 'Copiado!' : 'Copiar'}</span>
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                if (isEditingReason) {
                                                                    setIsEditingReason(false);
                                                                } else {
                                                                    setEditedReason(selectedItem.reason || '');
                                                                    setIsEditingReason(true);
                                                                }
                                                            }}
                                                            className="inline-flex items-center gap-1 text-[11px] text-slate-500 hover:text-sky-600 dark:text-slate-400 dark:hover:text-sky-400 font-medium transition-colors cursor-pointer"
                                                        >
                                                            <FaEdit size={10} />
                                                            <span>{isEditingReason ? 'Cancelar' : 'Editar'}</span>
                                                        </button>
                                                    </div>
                                                </div>
                                                {isEditingReason ? (
                                                    <div className="mt-1 flex flex-col gap-2">
                                                        <textarea
                                                            value={editedReason}
                                                            onChange={(e) => setEditedReason(e.target.value)}
                                                            rows={2}
                                                            className="bg-white/95 border border-slate-200/90 rounded-xl px-3.5 py-2 text-slate-800 text-sm shadow-[inset_0_1px_3px_rgba(0,0,0,0.06)] focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all w-full resize-none dark:bg-slate-800/90 dark:border-slate-700 dark:text-slate-200 dark:shadow-[inset_0_1px_3px_rgba(0,0,0,0.3)]"
                                                            placeholder="Editar motivo..."
                                                        />
                                                        <div className="flex justify-end gap-2">
                                                            <button
                                                                type="button"
                                                                onClick={() => setIsEditingReason(false)}
                                                                className="btn-secondary-glossy text-xs px-2.5 py-1 cursor-pointer"
                                                            >
                                                                Cancelar
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={handleSaveReason}
                                                                className="skeuo-btn text-xs px-3 py-1.5 inline-flex items-center justify-center gap-1 cursor-pointer"
                                                            >
                                                                Salvar
                                                            </button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <p className="font-medium text-slate-800 dark:text-slate-200 text-[12px] break-words leading-relaxed">
                                                        {selectedItem.reason || 'Sem motivo informado'}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="bg-slate-50/80 border border-slate-200/80 rounded-xl p-3 shadow-xs dark:bg-slate-800/50 dark:border-slate-700/80 flex flex-col justify-between">
                                                <div className="flex items-center justify-between mb-1">
                                                    <strong className="block text-[10px] text-gray-400 uppercase tracking-wide">Status</strong>
                                                    {isSavingStatus && <span className="text-[10px] text-sky-500 animate-pulse font-medium">Salvando...</span>}
                                                </div>
                                                <select
                                                    value={normalizeReportStatus(selectedItem.status)}
                                                    onChange={(e) => handleStatusChange(e.target.value)}
                                                    disabled={isSavingStatus}
                                                    className={`w-full text-xs font-semibold rounded-xl py-2 px-3 border border-slate-200/90 shadow-[inset_0_1px_3px_rgba(0,0,0,0.06)] cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all ${
                                                        normalizeReportStatus(selectedItem.status) === 'Resolvido'
                                                            ? 'bg-emerald-50/90 text-emerald-800 border-emerald-300/80 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60'
                                                            : normalizeReportStatus(selectedItem.status) === 'Descartado'
                                                            ? 'bg-red-50/90 text-red-800 border-red-300/80 dark:bg-red-950/40 dark:text-red-300 dark:border-red-800/60'
                                                            : 'bg-amber-50/90 text-amber-800 border-amber-300/80 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60'
                                                    }`}
                                                >
                                                    <option value="Pendente">Pendente</option>
                                                    <option value="Resolvido">Resolvido</option>
                                                    <option value="Descartado">Descartado</option>
                                                </select>
                                            </div>

                                            <div className="bg-slate-50/80 border border-slate-200/80 rounded-xl p-3 shadow-xs dark:bg-slate-800/50 dark:border-slate-700/80 flex flex-col justify-between">
                                                <div className="flex items-center justify-between mb-1">
                                                    <strong className="block text-[10px] text-gray-400 uppercase tracking-wide">Gravidade</strong>
                                                    <span className={`w-2 h-2 rounded-full ${
                                                        selectedItem.severity === 'Extrema' ? 'bg-red-500 animate-ping' :
                                                        selectedItem.severity === 'Alta' ? 'bg-orange-500' :
                                                        selectedItem.severity === 'Baixa' ? 'bg-emerald-500' : 'bg-amber-500'
                                                    }`} />
                                                </div>
                                                <select
                                                    value={selectedItem.severity || 'Média'}
                                                    onChange={(e) => handleSeverityChange(e.target.value)}
                                                    className={`w-full text-xs font-semibold rounded-xl py-2 px-3 border border-slate-200/90 shadow-[inset_0_1px_3px_rgba(0,0,0,0.06)] cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all ${
                                                        selectedItem.severity === 'Extrema'
                                                            ? 'bg-red-50/90 text-red-700 border-red-300/80 dark:bg-red-950/40 dark:text-red-300 dark:border-red-800/60'
                                                            : selectedItem.severity === 'Alta'
                                                            ? 'bg-orange-50/90 text-orange-700 border-orange-300/80 dark:bg-orange-950/40 dark:text-orange-300 dark:border-orange-800/60'
                                                            : selectedItem.severity === 'Baixa'
                                                            ? 'bg-emerald-50/90 text-emerald-700 border-emerald-300/80 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60'
                                                            : 'bg-amber-50/90 text-amber-700 border-amber-300/80 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60'
                                                    }`}
                                                >
                                                    <option value="Baixa">Baixa</option>
                                                    <option value="Média">Média</option>
                                                    <option value="Alta">Alta</option>
                                                    <option value="Extrema">Extrema</option>
                                                </select>
                                            </div>
                                        </div>
                                    )}

                                    {selectedItem.type === 'usuario' && (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[12px] text-gray-700 dark:text-gray-300 mb-4">
                                            <div className="sm:col-span-2 bg-slate-50/80 border border-slate-200/80 rounded-xl p-3 shadow-xs dark:bg-slate-800/50 dark:border-slate-700/80">
                                                <strong className="block text-[10px] text-gray-400 uppercase tracking-wide mb-1">E-mail</strong>
                                                <span className="font-medium text-slate-800 dark:text-slate-200 break-all">{selectedItem.email}</span>
                                            </div>
                                            <div className="bg-slate-50/80 border border-slate-200/80 rounded-xl p-3 shadow-xs dark:bg-slate-800/50 dark:border-slate-700/80">
                                                <strong className="block text-[10px] text-gray-400 uppercase tracking-wide mb-1">Cargo</strong>
                                                <span className="font-medium text-slate-800 dark:text-slate-200">{formatRole(selectedItem.role)}</span>
                                            </div>
                                            <div className="bg-slate-50/80 border border-slate-200/80 rounded-xl p-3 shadow-xs dark:bg-slate-800/50 dark:border-slate-700/80">
                                                <strong className="block text-[10px] text-gray-400 uppercase tracking-wide mb-1">Status da Conta</strong>
                                                {renderStatusBadge(selectedItem.status)}
                                            </div>
                                        </div>
                                    )}

                                    {selectedItem.type === 'sala' && (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[12px] text-gray-700 dark:text-gray-300 mb-4">
                                            <div className="bg-slate-50/80 border border-slate-200/80 rounded-xl p-3 shadow-xs dark:bg-slate-800/50 dark:border-slate-700/80">
                                                <strong className="block text-[10px] text-gray-400 uppercase tracking-wide mb-1">Dono</strong>
                                                <span className="font-medium text-slate-800 dark:text-slate-200">{selectedItem.user}</span>
                                            </div>
                                            <div className="bg-slate-50/80 border border-slate-200/80 rounded-xl p-3 shadow-xs dark:bg-slate-800/50 dark:border-slate-700/80">
                                                <strong className="block text-[10px] text-gray-400 uppercase tracking-wide mb-1">Categoria</strong>
                                                <span className="font-medium text-slate-800 dark:text-slate-200">{selectedItem.category}</span>
                                            </div>
                                            <div className="sm:col-span-2 bg-slate-50/80 border border-slate-200/80 rounded-xl p-3 shadow-xs dark:bg-slate-800/50 dark:border-slate-700/80">
                                                <strong className="block text-[10px] text-gray-400 uppercase tracking-wide mb-1">Status</strong>
                                                {renderStatusBadge(selectedItem.status)}
                                            </div>
                                        </div>
                                    )}

                                    <div className="mt-auto pt-3 border-t border-gray-100 dark:border-gray-800 flex flex-col gap-2">
                                        {(selectedItem.type === 'denuncia' || selectedItem.type === 'feedback') && (
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => setShowMessageModal(true)}
                                                    className="btn-secondary-glossy text-sm px-4 py-2 flex-1 inline-flex items-center justify-center gap-2 cursor-pointer"
                                                >
                                                    <FaCommentDots size={12} className="text-sky-500" /> Mensagem
                                                </button>
                                                <button
                                                    onClick={() => { setCurrentImageIndex(0); setShowImageModal(true); }}
                                                    className="btn-secondary-glossy text-sm px-4 py-2 flex-1 inline-flex items-center justify-center gap-2 cursor-pointer"
                                                >
                                                    <FaImage size={12} className="text-purple-500" /> Imagens
                                                </button>
                                            </div>
                                        )}

                                        <div className="flex gap-2">
                                            {selectedItem.type === 'sala' ? (
                                                <>
                                                    <button className="skeuo-btn text-sm px-4 py-2.5 flex-1 inline-flex items-center justify-center gap-2 cursor-pointer">
                                                        <FaEye size={12} /> Inspecionar
                                                    </button>
                                                    <button
                                                        onClick={handleAction}
                                                        className="skeuo-btn-danger text-sm px-4 py-2.5 flex-1 inline-flex items-center justify-center gap-2 cursor-pointer"
                                                    >
                                                        <FaTrash size={12} /> Apagar Sala
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <button className="skeuo-btn text-sm px-4 py-2.5 flex-1 inline-flex items-center justify-center gap-2 cursor-pointer">
                                                        <FaEye size={12} /> Inspecionar
                                                    </button>
                                                    <button
                                                        onClick={handleAction}
                                                        className="skeuo-btn-danger text-sm px-4 py-2.5 flex-1 inline-flex items-center justify-center gap-2 cursor-pointer"
                                                    >
                                                        <FaHammer size={12} /> {selectedItem.status === 'Banido' ? 'Desbanir' : (selectedItem.type === 'usuario' ? 'Banir Usuário' : 'Punir')}
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex-1 flex flex-col items-center justify-center text-center py-10 px-4">
                                    <div className="w-14 h-14 rounded-2xl bg-white/90 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 shadow-[0_4px_12px_rgba(0,0,0,0.05)] flex items-center justify-center text-sky-500 dark:text-sky-400 mb-3">
                                        <FaInfoCircle size={22} />
                                    </div>
                                    <h4 className="text-[14px] font-bold text-slate-700 dark:text-slate-200 mb-1">
                                        Nenhum item selecionado
                                    </h4>
                                    <p className="text-[12px] text-slate-500 dark:text-slate-400 max-w-[260px] leading-relaxed">
                                        Selecione uma linha da fila ao lado para inspecionar os detalhes e executar ações administrativas.
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="bg-white/90 backdrop-blur-md border border-white/60 shadow-[0_10px_30px_rgba(0,102,204,0.08)] rounded-2xl p-5 flex flex-col dark:bg-slate-900/80 dark:border-slate-800 dark:shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
                            <h3 className="text-[15px] font-bold text-gray-900 dark:text-gray-50 mb-3">Ações Rápidas</h3>
                            <div className="flex flex-col gap-2.5">
                                <button className="btn-secondary-glossy text-sm p-3.5 flex items-center gap-3 cursor-pointer text-left w-full group">
                                    <div className="w-7 h-7 rounded-xl bg-blue-50 dark:bg-slate-700 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
                                        <FaBullhorn className="text-blue-500" size={12} />
                                    </div>
                                    <span className="text-[13px] font-bold text-gray-700 dark:text-gray-300">Criar aviso global</span>
                                </button>

                                <button
                                    onClick={() => { setActiveTab('denuncias'); setFilterSeverity('Alta'); }}
                                    className="btn-secondary-glossy text-sm p-3.5 flex items-center gap-3 cursor-pointer text-left w-full group"
                                >
                                    <div className="w-7 h-7 rounded-xl bg-red-50 dark:bg-slate-700 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
                                        <FaExclamationTriangle className="text-red-500" size={12} />
                                    </div>
                                    <span className="text-[13px] font-bold text-gray-700 dark:text-gray-300">Denúncias críticas</span>
                                </button>
                            </div>
                        </div>
                    </div>

                </div>

                <div className="border-t border-gray-200 text-gray-500 dark:border-gray-700 dark:text-gray-400 pt-4 flex flex-col sm:flex-row justify-between items-center gap-2 text-[11px] animate-fade-in-up-5">
                    <p>Administrador: <span className="font-bold text-gray-900 dark:text-gray-50">SkyMaster</span></p>
                    <p className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-[#0ea5e9]"></span> Status: Online</p>
                    <p>Última atualização: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                </div>

            </div>

            {showMessageModal && selectedItem && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in-up-1">
                    <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-white/60 dark:border-slate-800 shadow-[0_10px_30px_rgba(0,102,204,0.12)] rounded-2xl w-full max-w-lg p-6 flex flex-col gap-4 relative">
                        <button
                            onClick={() => setShowMessageModal(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors cursor-pointer"
                        >
                            <FaTimes size={18} />
                        </button>

                        <div className="flex items-center gap-3 border-b border-gray-100 dark:border-gray-800 pb-4">
                            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-slate-800 flex items-center justify-center">
                                <FaCommentDots className="text-blue-500" size={16} />
                            </div>
                            <div>
                                <h3 className="text-[18px] font-bold text-gray-900 dark:text-gray-50">Mensagem Original</h3>
                                <p className="text-[12px] text-gray-500 dark:text-gray-400">Referente a <span className="font-bold">{selectedItem.name || selectedItem.user}</span></p>
                            </div>
                        </div>

                        <div className="bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 p-5 rounded-xl max-h-[300px] overflow-y-auto">
                            <p className="text-[14px] text-gray-800 dark:text-gray-200 whitespace-pre-wrap italic">
                                "{selectedItem.message || 'Nenhuma mensagem de texto registrada para este caso.'}"
                            </p>
                        </div>

                        <div className="flex justify-end mt-2">
                            <button
                                onClick={() => setShowMessageModal(false)}
                                className="skeuo-btn text-sm px-6 py-2.5 inline-flex items-center justify-center gap-2 cursor-pointer"
                            >
                                Fechar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showImageModal && selectedItem && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in-up-1">
                    <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-white/60 dark:border-slate-800 shadow-[0_10px_30px_rgba(0,102,204,0.12)] rounded-2xl w-full max-w-4xl p-6 flex flex-col gap-4 relative">
                        <button
                            onClick={() => setShowImageModal(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors z-10 cursor-pointer"
                        >
                            <FaTimes size={18} />
                        </button>

                        <div className="flex items-center gap-3 border-b border-gray-100 dark:border-gray-800 pb-4">
                            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-slate-800 flex items-center justify-center">
                                <FaImage className="text-purple-500" size={16} />
                            </div>
                            <div>
                                <h3 className="text-[18px] font-bold text-gray-900 dark:text-gray-50">
                                    {selectedItem.type === 'feedback' ? 'Imagens Anexadas' : 'Evidências em Imagem'}
                                </h3>
                                <p className="text-[12px] text-gray-500 dark:text-gray-400">
                                    {selectedItem.type === 'feedback' 
                                        ? <span>Anexadas no feedback enviado por <span className="font-bold">{selectedItem.user || 'Anônimo'}</span></span>
                                        : <span>Anexadas na denúncia contra <span className="font-bold">{selectedItem.user || 'Desconhecido'}</span></span>
                                    }
                                </p>
                            </div>
                        </div>

                        {selectedItem.images && selectedItem.images.length > 0 ? (
                            <div className="flex flex-col gap-4">
                                <div className="w-full h-[50vh] min-h-[300px] bg-black/5 border border-gray-200 dark:bg-black/40 dark:border-slate-800 rounded-xl overflow-hidden flex items-center justify-center">
                                    <img src={selectedItem.images[currentImageIndex]} alt="Evidência Principal" className="max-w-full max-h-full object-contain" />
                                </div>

                                <div className="flex gap-3 overflow-x-auto py-2 px-1">
                                    {selectedItem.images.map((img, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setCurrentImageIndex(idx)}
                                            className={`w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all shadow-sm ${currentImageIndex === idx ? 'border-sky-500 scale-105 opacity-100' : 'border-transparent opacity-60 hover:opacity-100'}`}
                                        >
                                            <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="w-full h-[40vh] flex items-center justify-center bg-gray-50 border border-dashed border-gray-300 dark:bg-slate-800/50 dark:border-slate-700 rounded-xl">
                                <p className="text-[14px] text-gray-500 dark:text-gray-400">
                                    {selectedItem.type === 'feedback' ? 'Nenhuma imagem anexada a este feedback.' : 'Nenhuma imagem anexada a esta denúncia.'}
                                </p>
                            </div>
                        )}

                        <div className="flex justify-end mt-2">
                            <button
                                onClick={() => setShowImageModal(false)}
                                className="skeuo-btn text-sm px-6 py-2.5 inline-flex items-center justify-center gap-2 cursor-pointer"
                            >
                                Fechar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Admin;

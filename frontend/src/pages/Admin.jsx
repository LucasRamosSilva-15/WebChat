import React, { useState } from 'react';
import {
    FaDownload, FaGavel, FaExclamationCircle, FaUserSlash, FaBan,
    FaCommentDots, FaSearch, FaEye, FaHammer, FaBullhorn,
    FaExclamationTriangle, FaMousePointer, FaInfoCircle, FaChartLine, FaUser, FaImage, FaTimes
} from 'react-icons/fa';
import '../styles/admin.css';

const Admin = () => {
    const [activeTab, setActiveTab] = useState('denuncias');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedItem, setSelectedItem] = useState(null);
    const [showMessageModal, setShowMessageModal] = useState(false);
    const [showImageModal, setShowImageModal] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [filterSeverity, setFilterSeverity] = useState('Todas');
    const [filterTime, setFilterTime] = useState('Todos');

    const today = new Date();
    const yesterday = new Date(today); yesterday.setDate(yesterday.getDate() - 1);
    const lastWeek = new Date(today); lastWeek.setDate(lastWeek.getDate() - 8);

    const mockData = {
        denuncias: [
            { id: 1, type: 'denuncia', user: '@toxic_user99', reason: 'Linguagem ofensiva', severity: 'Alta', status: 'Pendente', message: 'Seu lixo, vai aprender a jogar! Vocês são todos uns perdedores hahahaha', images: ['https://picsum.photos/seed/evid1/800/600', 'https://picsum.photos/seed/evid2/800/600', 'https://picsum.photos/seed/evid3/800/600'], date: today.toISOString() },
            { id: 2, type: 'denuncia', user: '@spambot_01', reason: 'Spam excessivo', severity: 'Média', status: 'Em análise', message: 'Ganhe 10.000 moedas grátis acessando www.scamsite.com agora mesmo!!!', date: yesterday.toISOString() },
            { id: 3, type: 'denuncia', user: '@troll_master', reason: 'Assédio', severity: 'Alta', status: 'Pendente', message: 'Eu vou descobrir onde você mora, seu inútil.', date: lastWeek.toISOString() }
        ],
        banimentos: [
            { id: 4, type: 'banimento', user: '@hackr_boy', reason: 'Uso de exploit', severity: 'Extrema', status: 'Ativo' },
        ],
        usuarios: [
            { id: 5, type: 'usuario', user: '@user123', reason: '-', severity: '-', status: 'Regular' },
        ],
        feedbacks: [
            { id: 6, type: 'feedback', user: '@joao_dev', reason: 'Sugestão de cor', severity: 'Baixa', status: 'Lido' },
        ]
    };

    const currentData = mockData[activeTab] || [];
    let filteredData = currentData.filter(item => item.user.toLowerCase().includes(searchTerm.toLowerCase()));

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
        <div className="flex-1 w-full flex flex-col items-center admin-page-bg">
            <div className="w-full max-w-[1200px] px-4 py-8 md:py-10 animate-fade-in-up-1">

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h1 className="hero-title text-2xl md:text-3xl font-bold admin-hero-title">
                                Painel Administrativo
                            </h1>
                            <span className="admin-badge-global text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">
                                Admin Global
                            </span>
                        </div>
                        <p className="text-[14px] admin-text-muted">
                            Gerencie denúncias, usuários e feedbacks do sistema.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button className="btn-white-glossy px-4 py-2 text-[13px] admin-btn-blue-outline flex items-center gap-2">
                            <FaDownload size={12} className="text-[#0ea5e9]" /> Exportar relatório
                        </button>
                        <button className="skeuo-btn px-4 py-2 text-[13px] flex items-center gap-2">
                            <FaGavel size={12} /> Revisar denúncias
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 animate-fade-in-up-2">

                    <div className="skeuo-card p-5 relative overflow-hidden flex flex-col">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-8 h-8 rounded-full admin-icon-wrap-red flex items-center justify-center">
                                <FaExclamationCircle size={14} />
                            </div>
                            <span className="admin-badge-trend-up text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                                <FaChartLine size={8} /> 15%
                            </span>
                        </div>
                        <h2 className="text-3xl font-bold admin-hero-title mb-1">12</h2>
                        <p className="text-[12px] admin-text-muted font-medium">Denúncias pendentes</p>
                        <div className="absolute top-0 right-0 w-32 h-32 admin-card-glow-red rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
                    </div>

                    <div className="skeuo-card p-5 relative overflow-hidden flex flex-col">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-8 h-8 rounded-full admin-icon-wrap-blue flex items-center justify-center">
                                <FaUserSlash size={14} />
                            </div>
                        </div>
                        <h2 className="text-3xl font-bold admin-hero-title mb-1">5</h2>
                        <p className="text-[12px] admin-text-muted font-medium">Usuários sinalizados</p>
                        <div className="absolute top-0 right-0 w-32 h-32 admin-card-glow-blue rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
                    </div>

                    <div className="skeuo-card p-5 relative overflow-hidden flex flex-col">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-8 h-8 rounded-full admin-icon-wrap-green flex items-center justify-center">
                                <FaBan size={14} />
                            </div>
                        </div>
                        <h2 className="text-3xl font-bold admin-hero-title mb-1">34</h2>
                        <p className="text-[12px] admin-text-muted font-medium">Banimentos ativos</p>
                        <div className="absolute top-0 right-0 w-32 h-32 admin-card-glow-green rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
                    </div>

                    <div className="skeuo-card p-5 relative overflow-hidden flex flex-col">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-8 h-8 rounded-full admin-icon-wrap-purple flex items-center justify-center">
                                <FaCommentDots size={14} />
                            </div>
                            <span className="admin-badge-trend-neutral text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                                <FaCommentDots size={8} /> +8
                            </span>
                        </div>
                        <h2 className="text-3xl font-bold admin-hero-title mb-1">89</h2>
                        <p className="text-[12px] admin-text-muted font-medium">Feedbacks recebidos</p>
                        <div className="absolute top-0 right-0 w-32 h-32 admin-card-glow-purple rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
                    </div>

                </div>

                <div className="skeuo-card p-1.5 flex items-center gap-1 mb-6 overflow-x-auto w-max max-w-full animate-fade-in-up-3">
                    {['Denúncias', 'Banimentos', 'Usuários', 'Feedbacks'].map((tab) => {
                        const tabId = tab.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
                        return (
                            <button
                                key={tabId}
                                onClick={() => { setActiveTab(tabId); setSelectedItem(null); setSearchTerm(''); setFilterSeverity('Todas'); setFilterTime('Todos'); }}
                                className={`px-5 py-2 text-[13px] font-bold rounded-[10px] whitespace-nowrap admin-tab ${activeTab === tabId ? 'admin-tab-active' : ''}`}
                            >
                                {tab}
                            </button>
                        );
                    })}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6 animate-fade-in-up-4">

                    <div className="lg:col-span-8 flex flex-col gap-6">
                        <div className="skeuo-panel p-6 flex flex-col h-full">
                            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 mb-6">
                                <h3 className="text-[16px] font-bold admin-hero-title capitalize">Fila de {activeTab}</h3>
                                <div className="flex flex-wrap items-center gap-3">
                                    <select 
                                        value={filterTime}
                                        onChange={(e) => setFilterTime(e.target.value)}
                                        className="skeuo-input py-2 px-3 text-[12px] admin-select-bg"
                                    >
                                        <option value="Todos">Tempo: Todos</option>
                                        <option value="Hoje">Hoje</option>
                                        <option value="Última Semana">Última Semana</option>
                                        <option value="Último Mês">Último Mês</option>
                                    </select>
                                    
                                    <select 
                                        value={filterSeverity}
                                        onChange={(e) => setFilterSeverity(e.target.value)}
                                        className="skeuo-input py-2 px-3 text-[12px] admin-select-bg"
                                    >
                                        <option value="Todas">Gravidade: Todas</option>
                                        <option value="Extrema">Extrema</option>
                                        <option value="Alta">Alta</option>
                                        <option value="Média">Média</option>
                                        <option value="Baixa">Baixa</option>
                                    </select>

                                    <div className="relative">
                                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={12} />
                                        <input
                                            type="text"
                                            placeholder="Buscar por usuário..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="skeuo-input py-2 pl-8 pr-4 text-[13px] w-full sm:w-[220px]"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[600px] text-left border-collapse">
                                    <thead>
                                        <tr className="admin-table-header">
                                            <th className="pb-3 text-[12px] font-bold">Usuário</th>
                                            <th className="pb-3 text-[12px] font-bold">Motivo</th>
                                            <th className="pb-3 text-[12px] font-bold">Gravidade</th>
                                            <th className="pb-3 text-[12px] font-bold">Status</th>
                                            <th className="pb-3 text-[12px] font-bold text-right">Data / Hora</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredData.length > 0 ? filteredData.map((report) => (
                                            <tr 
                                                key={report.id} 
                                                onClick={() => setSelectedItem(report)}
                                                className={`admin-table-row cursor-pointer ${selectedItem?.id === report.id ? 'admin-empty-icon-bg' : ''}`}
                                            >
                                                <td className="py-3">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-6 h-6 rounded-full admin-avatar-bg flex items-center justify-center">
                                                            <FaUser className="admin-text-muted" size={10} />
                                                        </div>
                                                        <span className="text-[13px] font-bold admin-table-text">{report.user}</span>
                                                    </div>
                                                </td>
                                                <td className="py-3 text-[13px] admin-table-text">{report.reason}</td>
                                                <td className="py-3">
                                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex w-max items-center gap-1 ${report.severity === 'Alta' || report.severity === 'Extrema' ? 'admin-status-high' : 'admin-status-pending'}`}>
                                                        {(report.severity === 'Alta' || report.severity === 'Extrema') && <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>}
                                                        {report.severity}
                                                    </span>
                                                </td>
                                                <td className="py-3">
                                                    <span className="admin-status-pending text-[10px] font-bold px-2 py-0.5 rounded-full w-max">
                                                        {report.status}
                                                    </span>
                                                </td>
                                                <td className="py-3 text-right text-[12px] text-gray-500 font-medium">
                                                    {report.date ? new Date(report.date).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) : '-'}
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan="5" className="py-8 text-center text-[13px] text-gray-500">Nenhum registro encontrado.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-4 flex flex-col gap-6">
                        <div className="skeuo-panel p-6 flex flex-col h-full">
                            <h3 className="text-[16px] font-bold admin-hero-title mb-5">Ações Rápidas</h3>

                            <div className="flex flex-col gap-3">
                                <button className="admin-quick-action p-4 rounded-[12px] flex items-center gap-3 cursor-pointer text-left w-full group">
                                    <div className="w-8 h-8 rounded-full admin-icon-box-blue flex items-center justify-center group-hover:scale-105 transition-transform">
                                        <FaBullhorn className="text-blue-500" size={12} />
                                    </div>
                                    <span className="text-[13px] font-bold admin-table-text">Criar aviso global</span>
                                </button>

                                <button className="admin-quick-action p-4 rounded-[12px] flex items-center gap-3 cursor-pointer text-left w-full group">
                                    <div className="w-8 h-8 rounded-full admin-icon-box-red flex items-center justify-center group-hover:scale-105 transition-transform">
                                        <FaExclamationTriangle className="text-red-500" size={12} />
                                    </div>
                                    <span className="text-[13px] font-bold admin-table-text">Denúncias críticas</span>
                                </button>
                            </div>
                        </div>
                    </div>

                </div>

                <div className="skeuo-panel p-6 flex flex-col min-h-[200px] mb-6 animate-fade-in-up-5">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-[16px] font-bold admin-hero-title">Detalhes da Seleção</h3>
                        <FaInfoCircle className="text-gray-400 cursor-pointer hover:text-gray-600 transition-colors" />
                    </div>

                    {selectedItem ? (
                        <div className="flex-1 flex flex-col pt-2 animate-fade-in-up-1">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 border-b admin-border-muted pb-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full admin-avatar-bg flex items-center justify-center">
                                        <FaUser className="admin-text-muted" size={20} />
                                    </div>
                                    <div>
                                        <h4 className="text-[18px] font-bold admin-hero-title">{selectedItem.user}</h4>
                                        <span className="text-[12px] admin-text-muted capitalize">{selectedItem.type} #{selectedItem.id}</span>
                                    </div>
                                </div>
                                <div className="text-left sm:text-right text-[12px] text-gray-500 admin-details-box px-3 py-1.5 rounded-lg w-max">
                                    <span className="block font-bold mb-0.5 uppercase tracking-wide text-[10px]">Data e Hora do Registro</span>
                                    {selectedItem.date ? new Date(selectedItem.date).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) : 'Data não registrada'}
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-[13px] admin-table-text">
                                <div className="p-3 admin-details-box rounded-[10px]">
                                    <strong className="block text-[11px] text-gray-400 uppercase tracking-wide mb-1">Motivo / Assunto:</strong>
                                    {selectedItem.reason}
                                </div>
                                <div className="p-3 admin-details-box rounded-[10px]">
                                    <strong className="block text-[11px] text-gray-400 uppercase tracking-wide mb-1">Status:</strong>
                                    {selectedItem.status}
                                </div>
                                <div className="p-3 admin-details-box rounded-[10px]">
                                    <strong className="block text-[11px] text-gray-400 uppercase tracking-wide mb-1">Gravidade:</strong>
                                    <span className={`inline-block ${selectedItem.severity === 'Alta' || selectedItem.severity === 'Extrema' ? 'text-red-500 font-bold' : ''}`}>
                                        {selectedItem.severity}
                                    </span>
                                </div>
                            </div>
                            <div className="mt-6 flex flex-col lg:flex-row justify-between items-center gap-3">
                                <div className="flex w-full lg:w-auto items-center gap-2">
                                    <button 
                                        onClick={() => setShowMessageModal(true)}
                                        className="btn-white-glossy flex-1 lg:flex-none px-3 py-2 text-[12px] admin-btn-blue-outline flex items-center justify-center gap-2"
                                    >
                                        <FaCommentDots size={10} /> Mensagem Original
                                    </button>
                                    <button 
                                        onClick={() => { setCurrentImageIndex(0); setShowImageModal(true); }}
                                        className="btn-white-glossy flex-1 lg:flex-none px-3 py-2 text-[12px] admin-btn-purple-outline flex items-center justify-center gap-2"
                                    >
                                        <FaImage size={10} /> Imagens/Anexos
                                    </button>
                                </div>
                                <div className="flex w-full lg:w-auto items-center gap-2">
                                    <button className="skeuo-btn flex-1 lg:flex-none px-4 py-2 text-[12px] flex items-center justify-center gap-2">
                                        <FaEye size={10} /> Inspecionar Perfil
                                    </button>
                                    <button className="btn-white-glossy flex-1 lg:flex-none px-4 py-2 text-[12px] admin-btn-danger-outline flex items-center justify-center gap-2 ">
                                        <FaHammer size={10} /> Punir / Restringir
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
                            <div className="w-12 h-12 rounded-full admin-empty-icon-bg flex items-center justify-center mb-4">
                                <FaMousePointer className="text-gray-400 dark:text-gray-500" size={20} />
                            </div>
                            <p className="text-[13px] admin-text-muted max-w-[300px]">
                                Selecione um item na lista acima para ver mais detalhes e realizar ações administrativas.
                            </p>
                        </div>
                    )}
                </div>

                <div className="admin-bottom-bar pt-4 flex flex-col sm:flex-row justify-between items-center gap-2 text-[11px] animate-fade-in-up-5">
                    <p>Administrador: <span className="font-bold admin-hero-title">SkyMaster</span></p>
                    <p className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-[#0ea5e9]"></span> Status: Online</p>
                    <p>Última atualização: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                </div>

            </div>

            {showMessageModal && selectedItem && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 admin-modal-overlay animate-fade-in-up-1">
                    <div className="skeuo-panel w-full max-w-lg p-6 flex flex-col gap-4 shadow-2xl relative">
                        <button 
                            onClick={() => setShowMessageModal(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                        >
                            <FaTimes size={18} />
                        </button>
                        
                        <div className="flex items-center gap-3 border-b admin-border-muted pb-4">
                            <div className="w-10 h-10 rounded-full admin-icon-box-blue flex items-center justify-center">
                                <FaCommentDots className="text-blue-500" size={16} />
                            </div>
                            <div>
                                <h3 className="text-[18px] font-bold admin-hero-title">Mensagem Original</h3>
                                <p className="text-[12px] admin-text-muted">Enviada por <span className="font-bold">{selectedItem.user}</span></p>
                            </div>
                        </div>
                        
                        <div className="admin-msg-box p-5 rounded-[12px] max-h-[300px] overflow-y-auto shadow-inner">
                            <p className="text-[14px] text-gray-800 dark:text-gray-200 whitespace-pre-wrap italic">
                                "{selectedItem.message || 'Nenhuma mensagem de texto registrada para este caso.'}"
                            </p>
                        </div>
                        
                        <div className="flex justify-end mt-2">
                            <button 
                                onClick={() => setShowMessageModal(false)}
                                className="skeuo-btn px-6 py-2 text-[13px] font-bold"
                            >
                                Fechar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showImageModal && selectedItem && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 admin-modal-overlay-dark animate-fade-in-up-1">
                    <div className="skeuo-panel w-full max-w-4xl p-6 flex flex-col gap-4 shadow-2xl relative admin-modal-panel">
                        <button 
                            onClick={() => setShowImageModal(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors z-10"
                        >
                            <FaTimes size={18} />
                        </button>
                        
                        <div className="flex items-center gap-3 border-b admin-border-muted pb-4">
                            <div className="w-10 h-10 rounded-full admin-icon-box-purple flex items-center justify-center">
                                <FaImage className="text-purple-500" size={16} />
                            </div>
                            <div>
                                <h3 className="text-[18px] font-bold admin-hero-title">Evidências em Imagem</h3>
                                <p className="text-[12px] admin-text-muted">Anexadas na denúncia contra <span className="font-bold">{selectedItem.user}</span></p>
                            </div>
                        </div>
                        
                        {selectedItem.images && selectedItem.images.length > 0 ? (
                            <div className="flex flex-col gap-4">
                                <div className="w-full h-[50vh] min-h-[300px] admin-media-main rounded-[12px] overflow-hidden flex items-center justify-center">
                                    <img src={selectedItem.images[currentImageIndex]} alt="Evidência Principal" className="max-w-full max-h-full object-contain" />
                                </div>
                                
                                <div className="flex gap-3 overflow-x-auto py-2 px-1">
                                    {selectedItem.images.map((img, idx) => (
                                        <button 
                                            key={idx} 
                                            onClick={() => setCurrentImageIndex(idx)}
                                            className={`w-20 h-20 flex-shrink-0 rounded-[12px] overflow-hidden border-2 transition-all shadow-sm ${currentImageIndex === idx ? 'border-[#0ea5e9] scale-105 opacity-100' : 'border-transparent opacity-60 hover:opacity-100'}`}
                                        >
                                            <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="w-full h-[40vh] flex items-center justify-center admin-media-empty rounded-[12px]">
                                <p className="text-[14px] admin-text-muted">Nenhuma imagem anexada a esta denúncia.</p>
                            </div>
                        )}
                        
                        <div className="flex justify-end mt-2">
                            <button 
                                onClick={() => setShowImageModal(false)}
                                className="skeuo-btn px-6 py-2 text-[13px] font-bold"
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

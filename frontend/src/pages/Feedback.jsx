import React, { useState, useRef, useEffect } from 'react';
import { FaLightbulb, FaExclamationTriangle, FaSmile, FaStar, FaCloudUploadAlt, FaPlay, FaCheckCircle, FaTimes } from 'react-icons/fa';
import SkeuoLoading from '../components/SkeuoLoading';

const Feedback = () => {
    const [selectedType, setSelectedType] = useState('sugestao');
    const [title, setTitle] = useState('');
    const [details, setDetails] = useState('');
    const [files, setFiles] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const fileInputRef = useRef(null);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 600);
        return () => clearTimeout(timer);
    }, []);

    const feedbackTypes = [
        {
            id: 'sugestao',
            title: 'Sugestão',
            desc: 'Tenho uma ideia de melhoria',
            icon: <FaLightbulb size={18} />,
            colorClass: 'bg-sky-100 text-sky-600 border-sky-200 dark:bg-sky-500/20 dark:text-sky-400 dark:border-sky-400/30'
        },
        {
            id: 'erro',
            title: 'Erro',
            desc: 'Algo não está funcionando',
            icon: <FaExclamationTriangle size={18} />,
            colorClass: 'bg-red-100 text-red-600 border-red-200 dark:bg-red-500/20 dark:text-red-400 dark:border-red-400/30'
        },
        {
            id: 'elogio',
            title: 'Elogio',
            desc: 'Quero elogiar algo',
            icon: <FaSmile size={18} />,
            colorClass: 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-500/20 dark:text-slate-400 dark:border-slate-400/30'
        },
        {
            id: 'ideia',
            title: 'Nova Ideia',
            desc: 'Sugestão de novo recurso',
            icon: <FaStar size={18} />,
            colorClass: 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-400/30'
        }
    ];

    const isValid = title.trim() !== '' && details.trim() !== '';

    const handleFileChange = (e) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            setFiles(prev => [...prev, ...newFiles].slice(0, 3));
        }
    };

    const removeFile = (index) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        if (!isValid || isSubmitting) return;

        setIsSubmitting(true);
        setSuccess(false);

        try {
            const token = localStorage.getItem('chat_token');
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

            const severityMap = {
                'erro': 'Alta',
                'sugestao': 'Média',
                'elogio': 'Baixa',
                'ideia': 'Baixa'
            };

            const toBase64 = file => new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => resolve(reader.result);
                reader.onerror = error => reject(error);
            });
            
            const base64Images = await Promise.all(files.map(f => toBase64(f)));

            const response = await fetch(`${apiUrl}/feedbacks`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    reason: selectedType,
                    message: `Título: ${title}\n\nDetalhes: ${details}`,
                    severity: severityMap[selectedType] || 'Baixa',
                    images: base64Images
                })
            });

            if (response.ok) {
                setSuccess(true);
                setTitle('');
                setDetails('');
                setFiles([]);
                setSelectedType('sugestao');
                setTimeout(() => setSuccess(false), 5000);
            } else {
                const data = await response.json();
                alert(data.error || 'Erro ao enviar feedback.');
            }
        } catch (err) {
            console.error('Erro ao enviar feedback:', err);
            alert('Erro de conexão ao enviar feedback.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return <SkeuoLoading />;
    }

    return (
        <div className="flex-1 w-full flex flex-col items-center">
            <div className="w-full max-w-[980px] px-4 py-8 md:py-12">

                <div className="mb-8 animate-fade-in-up-1">
                    <h1 className="hero-title text-3xl md:text-4xl font-bold text-[#0071e3] dark:text-[#38bdf8] mb-3">
                        Envie seu feedback
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300 max-w-[600px] text-[15px] leading-relaxed font-medium">
                        Sua opinião ajuda a deixar o SkyRipple melhor. Conte-nos o que você achou, o que podemos melhorar ou qualquer problema que encontrou.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    <div className="lg:col-span-8">
                        <div className="skeuo-panel p-6 sm:p-8 flex flex-col h-full relative animate-fade-in-up-2">

                            {success && (
                                <div className="absolute inset-0 z-10 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xs rounded-[22px] flex flex-col items-center justify-center animate-fade-in">
                                    <FaCheckCircle size={48} className="text-emerald-500 mb-4" />
                                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">Feedback Enviado!</h3>
                                    <p className="text-gray-600 dark:text-gray-300 text-center max-w-[300px]">
                                        Muito obrigado pela sua contribuição. Nossa equipe irá analisar em breve.
                                    </p>
                                    <button
                                        onClick={() => setSuccess(false)}
                                        className="mt-6 btn-secondary-glossy px-6 py-2"
                                    >
                                        Enviar outro
                                    </button>
                                </div>
                            )}

                            <div className="mb-6">
                                <label className="block font-bold text-[13px] text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">
                                    Resumo do Feedback
                                </label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Ex: Problema ao carregar imagens no feed"
                                    className="skeuo-input w-full py-3 px-4 text-[15px]"
                                />
                            </div>

                            <div className="mb-6">
                                <label className="block font-bold text-[13px] text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">
                                    Detalhes
                                </label>
                                <textarea
                                    value={details}
                                    onChange={(e) => setDetails(e.target.value)}
                                    placeholder="Descreva o máximo de detalhes possível para podermos entender melhor..."
                                    className="skeuo-input w-full py-3 px-4 min-h-[140px] resize-y text-[15px]"
                                ></textarea>
                            </div>

                            <div className="mb-6">
                                <label className="block font-bold text-[13px] text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">
                                    Anexos (Opcional)
                                </label>

                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    className="hidden"
                                    multiple
                                    accept="image/*"
                                />

                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className="border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-[16px] bg-gray-50 dark:bg-slate-800/50 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors shadow-none flex flex-col items-center justify-center p-8 cursor-pointer skeuo-card"
                                >
                                    <div className="w-12 h-12 rounded-full bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 shadow-xs flex items-center justify-center mb-3">
                                        <FaCloudUploadAlt size={24} className="text-gray-400 dark:text-gray-300" />
                                    </div>
                                    <p className="text-[14px] font-bold text-gray-700 dark:text-gray-200 mb-1">Arraste e solte imagens aqui</p>
                                    <p className="text-[12px]">ou clique para procurar no seu dispositivo</p>
                                </div>

                                {files.length > 0 && (
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        {files.map((file, index) => (
                                            <div key={index} className="flex items-center gap-2 bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-full shadow-xs text-gray-700 dark:text-gray-200 px-3 py-1.5 text-[12px] font-medium">
                                                <span className="truncate max-w-[150px]">{file.name}</span>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); removeFile(index); }}
                                                    className="text-gray-400 hover:text-red-500 transition-colors ml-1"
                                                >
                                                    <FaTimes />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="mt-auto flex justify-end">
                                <button
                                    onClick={handleSubmit}
                                    disabled={!isValid || isSubmitting}
                                    className="skeuo-btn px-6 py-2.5 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? 'Enviando...' : 'Enviar Feedback'} {!isSubmitting && <FaPlay size={10} />}
                                </button>
                            </div>

                        </div>
                    </div>

                    <div className="lg:col-span-4 flex flex-col">
                        <label className="block font-bold text-[13px] text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide animate-fade-in-up-3">
                            Selecione o tipo
                        </label>
                        <div className="flex flex-col gap-3">
                            {feedbackTypes.map((type, index) => (
                                <div
                                    key={type.id}
                                    onClick={() => setSelectedType(type.id)}
                                    className={`skeuo-card p-4 flex items-center gap-4 cursor-pointer transition-all duration-200 hover:scale-[1.01] animate-fade-in-up-${index + 2 <= 5 ? index + 2 : 5} ${selectedType === type.id ? 'ring-2 ring-[#0071e3] dark:ring-[#38bdf8] scale-[1.02] hover:scale-[1.02]' : ''
                                        }`}
                                >
                                    <div className={`w-10 h-10 rounded-full border border-black/5 dark:border-white/5 shadow-inner flex items-center justify-center shrink-0 ${type.colorClass}`}>
                                        {type.icon}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-[15px] text-gray-800 dark:text-gray-100">{type.title}</h4>
                                        <p className="text-[13px] text-gray-500 dark:text-gray-400">{type.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Feedback;

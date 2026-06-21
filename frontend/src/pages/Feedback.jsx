import React, { useState, useRef } from 'react';
import { FaLightbulb, FaExclamationTriangle, FaSmile, FaStar, FaCloudUploadAlt, FaPlay, FaCheckCircle, FaTimes } from 'react-icons/fa';

const Feedback = () => {
    const [selectedType, setSelectedType] = useState('sugestao');
    const [title, setTitle] = useState('');
    const [details, setDetails] = useState('');
    const [files, setFiles] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const fileInputRef = useRef(null);

    const feedbackTypes = [
        {
            id: 'sugestao',
            title: 'Sugestão',
            desc: 'Tenho uma ideia de melhoria',
            icon: <FaLightbulb size={18} />,
            colorClass: 'bg-[#e0f2fe] text-[#0284c7] border-[#bae6fd]'
        },
        {
            id: 'erro',
            title: 'Erro',
            desc: 'Algo não está funcionando',
            icon: <FaExclamationTriangle size={18} />,
            colorClass: 'bg-[#fee2e2] text-[#dc2626] border-[#fecaca]'
        },
        {
            id: 'elogio',
            title: 'Elogio',
            desc: 'Quero elogiar algo',
            icon: <FaSmile size={18} />,
            colorClass: 'bg-[#f1f5f9] text-[#475569] border-[#e2e8f0]'
        },
        {
            id: 'ideia',
            title: 'Nova Ideia',
            desc: 'Sugestão de novo recurso',
            icon: <FaStar size={18} />,
            colorClass: 'bg-[#ecfdf5] text-[#059669] border-[#a7f3d0]'
        }
    ];

    const isValid = title.trim() !== '' && details.trim() !== '';

    const handleFileChange = (e) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            setFiles(prev => [...prev, ...newFiles].slice(0, 3)); // Limite de 3 arquivos para demonstração (Provisório, vamos aumentar no futuro)
        }
    };

    const removeFile = (index) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = () => {
        if (!isValid || isSubmitting) return;

        setIsSubmitting(true);
        setSuccess(false);

        setTimeout(() => {
            setIsSubmitting(false);
            setSuccess(true);
            setTitle('');
            setDetails('');
            setFiles([]);
            setSelectedType('sugestao');

            setTimeout(() => setSuccess(false), 5000);
        }, 1500);
    };

    return (
        <div className="flex-1 w-full flex flex-col items-center">
            <div className="w-full max-w-[980px] px-4 py-8 md:py-12 animate-fade-in">

                <div className="mb-8">
                    <h1 className="hero-title text-3xl md:text-4xl font-bold text-[#0071e3] mb-3">
                        Envie seu feedback
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300 max-w-[600px] text-[15px] leading-relaxed font-medium">
                        Sua opinião ajuda a deixar o SkyRipple melhor. Conte-nos o que você achou, o que podemos melhorar ou qualquer problema que encontrou.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    <div className="lg:col-span-8">
                        <div className="skeuo-panel p-6 sm:p-8 flex flex-col h-full relative">

                            {success && (
                                <div className="absolute inset-0 z-10 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-[22px] flex flex-col items-center justify-center animate-fade-in">
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
                                    className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-[16px] bg-gray-50 dark:bg-slate-800/50 flex flex-col items-center justify-center p-8 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors cursor-pointer text-gray-500 dark:text-gray-400 skeuo-card shadow-none"
                                >
                                    <div className="w-12 h-12 rounded-full bg-white dark:bg-slate-700 shadow-sm border border-gray-200 dark:border-gray-600 flex items-center justify-center mb-3">
                                        <FaCloudUploadAlt size={24} className="text-gray-400 dark:text-gray-300" />
                                    </div>
                                    <p className="text-[14px] font-bold text-gray-700 dark:text-gray-200 mb-1">Arraste e solte imagens aqui</p>
                                    <p className="text-[12px]">ou clique para procurar no seu dispositivo</p>
                                </div>

                                {files.length > 0 && (
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        {files.map((file, index) => (
                                            <div key={index} className="flex items-center gap-2 bg-white dark:bg-slate-700 border border-gray-200 dark:border-gray-600 rounded-full px-3 py-1.5 shadow-sm text-[12px] font-medium text-gray-700 dark:text-gray-200">
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
                                    className={`skeuo-btn px-6 py-2.5 flex items-center gap-2 ${(!isValid || isSubmitting) ? 'opacity-50 cursor-not-allowed' : ''
                                        }`}
                                >
                                    {isSubmitting ? 'Enviando...' : 'Enviar Feedback'} {!isSubmitting && <FaPlay size={10} />}
                                </button>
                            </div>

                        </div>
                    </div>

                    <div className="lg:col-span-4 flex flex-col">
                        <label className="block font-bold text-[13px] text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide">
                            Selecione o tipo
                        </label>
                        <div className="flex flex-col gap-3">
                            {feedbackTypes.map((type) => (
                                <div
                                    key={type.id}
                                    onClick={() => setSelectedType(type.id)}
                                    className={`skeuo-card p-4 flex items-center gap-4 cursor-pointer transition-all ${selectedType === type.id
                                            ? 'ring-2 ring-[#0071e3] dark:ring-[#38bdf8] scale-[1.02]'
                                            : 'hover:scale-[1.01]'
                                        }`}
                                >
                                    <div className={`w-10 h-10 rounded-full border flex items-center justify-center shrink-0 shadow-inner ${type.colorClass}`}>
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

import React, { useState, useRef, useEffect } from 'react';
import { FaLightbulb, FaExclamationTriangle, FaSmile, FaStar, FaCloudUploadAlt, FaPlay, FaCheckCircle, FaTimes } from 'react-icons/fa';
import '../styles/feedback.css';
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
            colorClass: 'feedback-type-sugestao'
        },
        {
            id: 'erro',
            title: 'Erro',
            desc: 'Algo não está funcionando',
            icon: <FaExclamationTriangle size={18} />,
            colorClass: 'feedback-type-erro'
        },
        {
            id: 'elogio',
            title: 'Elogio',
            desc: 'Quero elogiar algo',
            icon: <FaSmile size={18} />,
            colorClass: 'feedback-type-elogio'
        },
        {
            id: 'ideia',
            title: 'Nova Ideia',
            desc: 'Sugestão de novo recurso',
            icon: <FaStar size={18} />,
            colorClass: 'feedback-type-ideia'
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

    if (isLoading) {
        return <SkeuoLoading />;
    }

    return (
        <div className="flex-1 w-full flex flex-col items-center">
            <div className="w-full max-w-[980px] px-4 py-8 md:py-12">

                <div className="mb-8 animate-fade-in-up-1">
                    <h1 className="hero-title text-3xl md:text-4xl font-bold feedback-hero-title mb-3">
                        Envie seu feedback (Em desenvolvimento)
                    </h1>
                    <p className="feedback-subtitle max-w-[600px] text-[15px] leading-relaxed font-medium">
                        Sua opinião ajuda a deixar o SkyRipple melhor. Conte-nos o que você achou, o que podemos melhorar ou qualquer problema que encontrou.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    <div className="lg:col-span-8">
                        <div className="skeuo-panel p-6 sm:p-8 flex flex-col h-full relative animate-fade-in-up-2">

                            {success && (
                                <div className="absolute inset-0 z-10 feedback-success-overlay flex flex-col items-center justify-center animate-fade-in">
                                    <FaCheckCircle size={48} className="feedback-success-icon mb-4" />
                                    <h3 className="text-xl font-bold feedback-success-title mb-2">Feedback Enviado!</h3>
                                    <p className="feedback-success-desc text-center max-w-[300px]">
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
                                <label className="block font-bold text-[13px] feedback-label mb-2 uppercase tracking-wide">
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
                                <label className="block font-bold text-[13px] feedback-label mb-2 uppercase tracking-wide">
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
                                <label className="block font-bold text-[13px] feedback-label mb-2 uppercase tracking-wide">
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
                                    className="feedback-upload-area flex flex-col items-center justify-center p-8 cursor-pointer skeuo-card"
                                >
                                    <div className="w-12 h-12 rounded-full feedback-upload-icon-wrap flex items-center justify-center mb-3">
                                        <FaCloudUploadAlt size={24} className="feedback-upload-icon" />
                                    </div>
                                    <p className="text-[14px] font-bold feedback-upload-title mb-1">Arraste e solte imagens aqui</p>
                                    <p className="text-[12px]">ou clique para procurar no seu dispositivo</p>
                                </div>

                                {files.length > 0 && (
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        {files.map((file, index) => (
                                            <div key={index} className="flex items-center gap-2 feedback-file-chip px-3 py-1.5 text-[12px] font-medium">
                                                <span className="truncate max-w-[150px]">{file.name}</span>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); removeFile(index); }}
                                                    className="feedback-file-remove ml-1"
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
                                    className={`skeuo-btn feedback-submit-btn px-6 py-2.5 flex items-center gap-2`}
                                >
                                    {isSubmitting ? 'Enviando...' : 'Enviar Feedback'} {!isSubmitting && <FaPlay size={10} />}
                                </button>
                            </div>

                        </div>
                    </div>

                    <div className="lg:col-span-4 flex flex-col">
                        <label className="block font-bold text-[13px] feedback-label mb-3 uppercase tracking-wide animate-fade-in-up-3">
                            Selecione o tipo
                        </label>
                        <div className="flex flex-col gap-3">
                            {feedbackTypes.map((type, index) => (
                                <div
                                    key={type.id}
                                    onClick={() => setSelectedType(type.id)}
                                    className={`skeuo-card feedback-type-card p-4 flex items-center gap-4 cursor-pointer animate-fade-in-up-${index + 2 <= 5 ? index + 2 : 5} ${selectedType === type.id ? 'feedback-type-card-active' : ''
                                        }`}
                                >
                                    <div className={`w-10 h-10 rounded-full border flex items-center justify-center shrink-0 feedback-type-icon-wrap ${type.colorClass}`}>
                                        {type.icon}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-[15px] feedback-type-title">{type.title}</h4>
                                        <p className="text-[13px] feedback-type-desc">{type.desc}</p>
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

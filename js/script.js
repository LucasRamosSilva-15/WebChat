document.addEventListener('DOMContentLoaded', () => {
    const chatForm = document.getElementById('chat-form');
    const messageInput = document.getElementById('message-input');
    const chatContainer = document.getElementById('chat-container');

    const addMessage = (text, sender = 'me') => {
        const messageDiv = document.createElement('div');
        
        if (sender === 'me') {
            messageDiv.className = 'flex flex-col items-end animate-fade-in-up';
            messageDiv.innerHTML = `
                <div class="bg-[#0071e3] text-white px-4 py-2 rounded-[18px] max-w-[70%] shadow-sm">
                    <p class="text-[16px] leading-snug">${text}</p>
                </div>
                <span class="text-[11px] text-[#86868b] mr-3 mt-1 uppercase tracking-widest">Enviado</span>
            `;
        } else {
            messageDiv.className = 'flex flex-col items-start animate-fade-in-up';
            messageDiv.innerHTML = `
                <span class="text-[12px] text-[#86868b] ml-3 mb-1 font-medium">${sender}</span>
                <div class="bg-white/70 backdrop-blur-sm text-[#1d1d1f] px-4 py-2 rounded-[18px] max-w-[70%] shadow-sm border border-white/20">
                    <p class="text-[16px] leading-snug">${text}</p>
                </div>
            `;
        }

        chatContainer.appendChild(messageDiv);
        
        chatContainer.scrollTo({
            top: chatContainer.scrollHeight,
            behavior: 'smooth'
        });
    };


    chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const msg = messageInput.value.trim();

        if (msg) {
            addMessage(msg, 'me');
            messageInput.value = '';
            
            setTimeout(() => {
                addMessage('Mensagem recebida! (Simulação provisória)', 'Sistema');
            }, 1000);
        }
    });
});
import io from 'socket.io-client';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
export const socket = io(BACKEND_URL);

socket.on('connect', () => {
    try {
        let userId = localStorage.getItem('chat_uniqueUserId');
        if (!userId) {
            userId = 'user_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('chat_uniqueUserId', userId);
        }

        const joinedRooms = JSON.parse(localStorage.getItem('chat_joinedRooms') || '[]');
        joinedRooms.forEach(room => {
            socket.emit("join_room", { room, userId });
        });
    } catch (e) {
        console.error("Erro ao recuperar salas salvas");
    }
});

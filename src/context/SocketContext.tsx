import { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';

interface SocketContextType {
    socket: Socket | null;
}

const SocketContext = createContext<SocketContextType>({ socket: null });

export const useSocket = () => {
    return useContext(SocketContext);
};

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    // Usamos 'user' como señal de que el usuario está autenticado
    const { user } = useAuth();

    useEffect(() => {
        // Solo intentaremos conectar si hay un usuario logueado.
        if (user) {
            // 2. Leemos el token directamente desde las cookies.
            // Asegúrate de que el nombre de la cookie sea 'token'.
            const newSocket = io("http://localhost:3000/", {
                withCredentials: true
            });

            setSocket(newSocket);

            newSocket.on('connect', () => {
                console.log('Socket conectado exitosamente:', newSocket.id);
            });

            return () => {
                newSocket.disconnect();
                console.log('Socket desconectado.');
            };
        } else {
            // Si el usuario cierra sesión (user es null), nos aseguramos de desconectar el socket.
            if (socket) {
                socket.disconnect();
                setSocket(null);
            }
        }
        // 3. El efecto depende del estado del 'user'.
        // Se ejecutará cuando el usuario inicie o cierre sesión.
    }, [user]);

    return (
        <SocketContext.Provider value={{ socket }}>
            {children}
        </SocketContext.Provider>
    );
};
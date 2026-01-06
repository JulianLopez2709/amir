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
    const { user, activeCompanyId } = useAuth();

    useEffect(() => {
        if (!user || !activeCompanyId) {
            if (socket) {
                socket.disconnect();
                setSocket(null);
            }
            return;
        }

        // 🔥 FORZAR reconexión al cambiar company
        if (socket) {
            socket.disconnect();
        }
        const token = localStorage.getItem("ws_token");
        
        const newSocket = io("https://api.amincolombia.com", {
            auth: {
                token, // 👈 AQUÍ
            },
        });

        newSocket.on("connect", () => {
            console.log("🟢 Socket conectado:", newSocket.id, "Company:", activeCompanyId);
        });

        newSocket.on("disconnect", () => {
            console.log("🔴 Socket desconectado");
        });

        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, [user, activeCompanyId]);

    return (
        <SocketContext.Provider value={{ socket }}>
            {children}
        </SocketContext.Provider>
    );
};
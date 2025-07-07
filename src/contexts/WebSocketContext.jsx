import { createContext, useContext, useEffect, useState } from 'react';
import { useWebSocket } from '../hooks/useWebSocket'

const WebSocketContext = createContext();

export const useWebSocketContext = () => {
    const context = useContext(WebSocketContext);
    if (!context) {
        throw new Error('useWebSocketContext must be used within WebSocketProvider');
    }
    return context;
};

export const WebSocketProvider = ({ children, accessToken, wsUrl }) => {
    const { connect, disconnect, isConnected, manager } = useWebSocket();
    const [connectionStatus, setConnectionStatus] = useState('disconnected');

    useEffect(() => {
        if (accessToken) {
            connect(accessToken, wsUrl);
            setConnectionStatus('connected');
        }

        return () => {
            disconnect();
            setConnectionStatus('disconnected');
        };
    }, [accessToken, wsUrl, connect, disconnect]);

    const value = {
        manager,
        isConnected,
        connectionStatus,
        connect,
        disconnect
    };

    return (
        <WebSocketContext.Provider value={value}>
            {children}
        </WebSocketContext.Provider>
    );
};

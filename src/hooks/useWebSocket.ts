import { useEffect, useCallback, useRef } from 'react';
import webSocketManager from '../utils/webSocketManager';

export const useWebSocket = () => {
    const isConnected = useRef(false);

    const connect = useCallback((wsUrl) => {
        console.log('🎯 useWebSocket.connect called');
        console.log('   - WebSocket URL present:', !!wsUrl);
        console.log('   - Already connected:', isConnected.current);

        if (!isConnected.current) {
            console.log('🔌 Initiating new connection...');
            isConnected.current = !!webSocketManager.connect(wsUrl);
        } else {
            console.log('ℹ️ Connection already established, skipping');
        }
    }, []);

    // Disconnect from WebSocket
    const disconnect = useCallback(() => {
        console.log('🔌 useWebSocket.disconnect called');
        if (isConnected.current) {
            webSocketManager.disconnect();
            isConnected.current = false;
        }
    }, []);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            // Optional: keep connection alive across components
            // disconnect();
        };
    }, []);

    return {
        connect,
        disconnect,
        isConnected: () => isConnected.current && webSocketManager.isConnected(),
        manager: webSocketManager
    };
};

// Hook for user notifications
export const useUserNotifications = (callbacks = {}) => {
    const { manager } = useWebSocket();

    useEffect(() => {
        const subscription = manager.subscribeToUserNotifications(callbacks);

        return () => {
            manager.unsubscribeFromUserNotifications();
        };
    }, [manager, callbacks]);

    return { manager };
};

// Hook for conversation messages
export const useConversationMessages = (conversationId, callbacks = {}) => {
    const { manager } = useWebSocket();

    useEffect(() => {
        if (conversationId) {
            const subscription = manager.subscribeToConversation(conversationId, callbacks);

            return () => {
                manager.unsubscribeFromConversation(conversationId);
            };
        }
    }, [manager, conversationId, callbacks]);

    return { manager };
};

// Hook for project space messages
export const useProjectSpaceMessages = (projectSpaceId, callbacks = {}) => {
    const { manager } = useWebSocket();

    useEffect(() => {
        if (projectSpaceId) {
            const subscription = manager.subscribeToProjectSpace(projectSpaceId, callbacks);

            return () => {
                manager.unsubscribeFromProjectSpace(projectSpaceId);
            };
        }
    }, [manager, projectSpaceId, callbacks]);

    return { manager };
};
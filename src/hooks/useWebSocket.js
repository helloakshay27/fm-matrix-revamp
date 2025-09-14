import { useEffect, useCallback, useRef } from 'react';
import webSocketManager from '../utils/webSocketManager';

export const useWebSocket = () => {
    const isConnected = useRef(false);

    const connect = useCallback((accessToken, wsUrl) => {
        if (!isConnected.current) {
            webSocketManager.connect(accessToken, wsUrl);
            isConnected.current = true;
        }
    }, []);

    // Disconnect from WebSocket
    const disconnect = useCallback(() => {
        if (isConnected.current) {
            webSocketManager.disconnect();
            isConnected.current = false;
        }
    }, []);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            disconnect();
        };
    }, [disconnect]);

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

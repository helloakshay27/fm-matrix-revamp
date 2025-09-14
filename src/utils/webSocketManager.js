import { createConsumer } from "@rails/actioncable";

class WebSocketManager {
    constructor() {
        this.cable = null;
        this.subscriptions = new Map();
        this.token = null;
    }

    // Initialize connection with access token
    connect(accessToken, wsUrl = '/cable') {
        this.token = accessToken;

        // Create the WebSocket URL with token
        const fullWsUrl = wsUrl.includes('?')
            ? `${wsUrl}&token=${accessToken}`
            : `${wsUrl}?token=${accessToken}`;

        console.log('Connecting to WebSocket URL:', fullWsUrl);

        // Create cable connection with token in URL params
        this.cable = createConsumer(fullWsUrl);

        // Add connection monitoring
        this.cable.connection.monitor.visibilityDidChange = () => {
            console.log('WebSocket visibility changed:', document.visibilityState);
        };

        console.log('WebSocket connection initialized');
        return this.cable;
    }

    // Disconnect from WebSocket
    disconnect() {
        if (this.cable) {
            this.cable.disconnect();
            this.cable = null;
            this.subscriptions.clear();
            console.log('WebSocket disconnected');
        }
    }

    // Subscribe to user notifications
    subscribeToUserNotifications(callbacks = {}) {
        if (!this.cable) {
            console.error('WebSocket not connected. Call connect() first.');
            return null;
        }

        const subscription = this.cable.subscriptions.create(
            { channel: 'UserChannel' },
            {
                connected: () => {
                    console.log('Connected to UserChannel');
                    callbacks.onConnected?.();
                },

                disconnected: () => {
                    console.log('Disconnected from UserChannel');
                    callbacks.onDisconnected?.();
                },

                received: (data) => {
                    console.log('Received user notification:', data);

                    switch (data.type) {
                        case 'new_conversation':
                            callbacks.onNewConversation?.(data.conversation);
                            break;
                        case 'message_notification':
                            callbacks.onMessageNotification?.(data.message, data.context);
                            break;
                        default:
                            console.log('Unknown notification type:', data.type);
                    }
                }
            }
        );

        this.subscriptions.set('user_notifications', subscription);
        return subscription;
    }

    // Subscribe to a specific conversation
    subscribeToConversation(conversationId, callbacks = {}) {
        if (!this.cable) {
            console.error('WebSocket not connected. Call connect() first.');
            return null;
        }

        const channelKey = `conversation_${conversationId}`;

        // Unsubscribe from previous conversation if exists
        this.unsubscribeFromConversation(conversationId);

        const subscription = this.cable.subscriptions.create(
            {
                channel: 'ConversationChannel',
                conversation_id: conversationId
            },
            {
                connected: () => {
                    console.log(`✅ Connected to conversation ${conversationId}`);
                    console.log(`📡 Expected stream: conversation_${conversationId}`);
                    callbacks.onConnected?.();
                },

                disconnected: () => {
                    console.log(`❌ Disconnected from conversation ${conversationId}`);
                    callbacks.onDisconnected?.();
                },

                received: (data) => {
                    console.log('📨 Received conversation data:', data);
                    console.log(`📨 Stream should be: conversation_${conversationId}`);

                    switch (data.type) {
                        case 'new_message':
                            console.log('📨 New message received:', data.message);
                            callbacks.onNewMessage?.(data.message);
                            break;
                        default:
                            console.log('❓ Unknown message type:', data.type);
                    }
                }
            }
        );

        this.subscriptions.set(channelKey, subscription);
        return subscription;
    }

    // Subscribe to a specific project space
    subscribeToProjectSpace(projectSpaceId, callbacks = {}) {
        if (!this.cable) {
            console.error('WebSocket not connected. Call connect() first.');
            return null;
        }

        const channelKey = `project_space_${projectSpaceId}`;

        // Unsubscribe from previous project space if exists
        this.unsubscribeFromProjectSpace(projectSpaceId);

        const subscription = this.cable.subscriptions.create(
            {
                channel: 'ProjectSpaceChannel',
                project_space_id: projectSpaceId
            },
            {
                connected: () => {
                    console.log(`Connected to project space ${projectSpaceId}`);
                    callbacks.onConnected?.();
                },

                disconnected: () => {
                    console.log(`Disconnected from project space ${projectSpaceId}`);
                    callbacks.onDisconnected?.();
                },

                received: (data) => {
                    console.log('Received project space data:', data);

                    switch (data.type) {
                        case 'new_message':
                            callbacks.onNewMessage?.(data.message);
                            break;
                        default:
                            console.log('Unknown message type:', data.type);
                    }
                }
            }
        );

        this.subscriptions.set(channelKey, subscription);
        return subscription;
    }

    // Unsubscribe from conversation
    unsubscribeFromConversation(conversationId) {
        const channelKey = `conversation_${conversationId}`;
        const subscription = this.subscriptions.get(channelKey);

        if (subscription) {
            subscription.unsubscribe();
            this.subscriptions.delete(channelKey);
            console.log(`Unsubscribed from conversation ${conversationId}`);
        }
    }

    // Unsubscribe from project space
    unsubscribeFromProjectSpace(projectSpaceId) {
        const channelKey = `project_space_${projectSpaceId}`;
        const subscription = this.subscriptions.get(channelKey);

        if (subscription) {
            subscription.unsubscribe();
            this.subscriptions.delete(channelKey);
            console.log(`Unsubscribed from project space ${projectSpaceId}`);
        }
    }

    // Unsubscribe from user notifications
    unsubscribeFromUserNotifications() {
        const subscription = this.subscriptions.get('user_notifications');

        if (subscription) {
            subscription.unsubscribe();
            this.subscriptions.delete('user_notifications');
            console.log('Unsubscribed from user notifications');
        }
    }

    // Get current connection status
    isConnected() {
        return this.cable && this.cable.connection.isOpen();
    }

    // Get all active subscriptions
    getActiveSubscriptions() {
        return Array.from(this.subscriptions.keys());
    }
}

// Create singleton instance
const webSocketManager = new WebSocketManager();

export default webSocketManager;

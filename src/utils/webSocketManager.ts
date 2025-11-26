import { createConsumer } from "@rails/actioncable";

interface CallbacksConfig {
    onConnected?: () => void;
    onDisconnected?: () => void;
    onNewMessage?: (message: any) => void;
    onNewConversation?: (conversation: any) => void;
    onMessageNotification?: (message: any, context: any) => void;
}

class WebSocketManager {
    private cable: any = null;
    private subscriptions: Map<string, any> = new Map();
    private token: string | null = null;

    constructor() {
        this.cable = null;
        this.subscriptions = new Map();
        this.token = null;
    }

    // Initialize connection with access token
    connect(accessToken: string, wsUrl: string = '/cable'): any {
        // Prevent duplicate connections
        if (this.cable && this.token === accessToken) {
            console.log('✅ WebSocket already connected with same token');
            return this.cable;
        }

        // Disconnect existing connection if token changed
        if (this.cable && this.token !== accessToken) {
            console.log('🔄 Token changed, reconnecting...');
            this.disconnect();
        }

        this.token = accessToken;

        // Create the WebSocket URL with token
        const fullWsUrl = wsUrl.includes('?')
            ? `${wsUrl}&token=${accessToken}`
            : `${wsUrl}?token=${accessToken}`;

        console.log('🔌 Connecting to WebSocket URL:', fullWsUrl);

        try {
            // Create cable connection with token in URL params
            this.cable = createConsumer(fullWsUrl);

            // Add connection monitoring
            if (this.cable.connection) {
                this.cable.connection.monitor.visibilityDidChange = () => {
                    console.log('👁️ WebSocket visibility changed:', document.visibilityState);
                };
            }

            console.log('✅ WebSocket connection initialized');
            return this.cable;
        } catch (error) {
            console.error('❌ Error creating WebSocket connection:', error);
            return null;
        }
    }

    // Disconnect from WebSocket
    disconnect(): void {
        if (this.cable) {
            console.log('🔌 Disconnecting WebSocket...');

            // Unsubscribe all channels first
            this.subscriptions.forEach((subscription, key) => {
                try {
                    subscription.unsubscribe();
                    console.log(`✅ Unsubscribed from ${key}`);
                } catch (error) {
                    console.error(`❌ Error unsubscribing from ${key}:`, error);
                }
            });

            this.subscriptions.clear();

            try {
                this.cable.disconnect();
                console.log('✅ WebSocket disconnected');
            } catch (error) {
                console.error('❌ Error disconnecting WebSocket:', error);
            }

            this.cable = null;
        }
    }

    // Subscribe to user notifications
    subscribeToUserNotifications(callbacks: CallbacksConfig = {}): any {
        if (!this.cable) {
            console.error('❌ WebSocket not connected. Call connect() first.');
            return null;
        }

        // Check if already subscribed
        if (this.subscriptions.has('user_notifications')) {
            console.log('ℹ️ Already subscribed to user notifications');
            return this.subscriptions.get('user_notifications');
        }

        console.log('📡 Subscribing to UserChannel...');

        try {
            const subscription = this.cable.subscriptions.create(
                { channel: 'UserChannel' },
                {
                    connected() {
                        console.log('✅ Connected to UserChannel');
                        callbacks.onConnected?.();
                    },

                    disconnected() {
                        console.log('❌ Disconnected from UserChannel');
                        callbacks.onDisconnected?.();
                    },

                    received(data) {
                        console.log('📨 Received user notification:', data);

                        switch (data.type) {
                            case 'new_conversation':
                                callbacks.onNewConversation?.(data.conversation);
                                break;
                            case 'new_message':
                                callbacks.onMessageNotification?.(data.message, data.context);
                                break;
                            default:
                                console.log('❓ Unknown notification type:', data.type);
                        }
                    },

                    rejected() {
                        console.error('❌ UserChannel subscription REJECTED');
                    }
                }
            );

            this.subscriptions.set('user_notifications', subscription);
            console.log('✅ UserChannel subscription created');
            return subscription;
        } catch (error) {
            console.error('❌ Error subscribing to UserChannel:', error);
            return null;
        }
    }

    // Subscribe to a specific conversation
    subscribeToConversation(conversationId: string | number, callbacks: CallbacksConfig = {}): any {
        if (!this.cable) {
            console.error('❌ WebSocket not connected. Call connect() first.');
            return null;
        }

        const channelKey = `conversation_${conversationId}`;

        // Check if already subscribed
        if (this.subscriptions.has(channelKey)) {
            console.log(`ℹ️ Already subscribed to conversation ${conversationId}`);
            return this.subscriptions.get(channelKey);
        }

        console.log(`📡 Subscribing to conversation ${conversationId}...`);

        try {
            const subscription = this.cable.subscriptions.create(
                {
                    channel: 'ConversationChannel',
                    conversation_id: conversationId
                },
                {
                    connected() {
                        console.log('='.repeat(60));
                        console.log(`✅ CONNECTED to conversation ${conversationId}`);
                        console.log(`📡 Stream: conversation_${conversationId}`);
                        console.log(`⏰ Time: ${new Date().toISOString()}`);
                        console.log('='.repeat(60));
                        callbacks.onConnected?.();
                    },

                    disconnected() {
                        console.log(`❌ Disconnected from conversation ${conversationId}`);
                        callbacks.onDisconnected?.();
                    },

                    received(data) {
                        console.log('='.repeat(60));
                        console.log('📨 RAW MESSAGE RECEIVED FROM BACKEND');
                        console.log('⏰ Timestamp:', new Date().toISOString());
                        console.log('📦 Full Data:', JSON.stringify(data, null, 2));
                        console.log('🔍 Message Type:', data.type);
                        console.log('='.repeat(60));

                        console.log(data)

                        if (data.type === 'new_message') {
                            console.log('✅ Message type confirmed: new_message');
                            console.log('📝 Message Details:');
                            console.log('   - ID:', data.message?.id);
                            console.log('   - Body:', data.message?.body);
                            console.log('   - User ID:', data.message?.user_id);
                            console.log('   - User Name:', data.message?.user_name);
                            console.log('   - Created At:', data.message?.created_at);

                            callbacks.onNewMessage?.(data.message);
                            console.log('✅ onNewMessage callback executed');
                        } else {
                            console.warn('⚠️ Unknown message type:', data.type);
                        }
                        console.log('='.repeat(60));
                    },

                    rejected() {
                        console.error('='.repeat(60));
                        console.error(`❌ SUBSCRIPTION REJECTED: conversation ${conversationId}`);
                        console.error('This means backend refused the subscription');
                        console.error('Check backend logs for authorization issues');
                        console.error('='.repeat(60));
                    }
                }
            );

            this.subscriptions.set(channelKey, subscription);
            console.log(`✅ Subscription object created for: ${channelKey}`);
            return subscription;
        } catch (error) {
            console.error(`❌ Error subscribing to conversation ${conversationId}:`, error);
            return null;
        }
    }

    // Subscribe to a specific project space
    subscribeToProjectSpace(projectSpaceId: string | number, callbacks: CallbacksConfig = {}): any {
        if (!this.cable) {
            console.error('❌ WebSocket not connected. Call connect() first.');
            return null;
        }

        const channelKey = `project_space_${projectSpaceId}`;

        // Check if already subscribed
        if (this.subscriptions.has(channelKey)) {
            console.log(`ℹ️ Already subscribed to project space ${projectSpaceId}`);
            return this.subscriptions.get(channelKey);
        }

        console.log(`📡 Subscribing to project space ${projectSpaceId}...`);

        try {
            const subscription = this.cable.subscriptions.create(
                {
                    channel: 'ProjectSpaceChannel',
                    project_space_id: projectSpaceId
                },
                {
                    connected() {
                        console.log('='.repeat(60));
                        console.log(`✅ CONNECTED to project space ${projectSpaceId}`);
                        console.log(`📡 Stream: project_space_${projectSpaceId}`);
                        console.log(`⏰ Time: ${new Date().toISOString()}`);
                        console.log('='.repeat(60));
                        callbacks.onConnected?.();
                    },

                    disconnected() {
                        console.log(`❌ Disconnected from project space ${projectSpaceId}`);
                        callbacks.onDisconnected?.();
                    },

                    received(data) {
                        console.log('='.repeat(60));
                        console.log('📨 RAW MESSAGE RECEIVED FROM BACKEND');
                        console.log('⏰ Timestamp:', new Date().toISOString());
                        console.log('📦 Full Data:', JSON.stringify(data, null, 2));
                        console.log('🔍 Message Type:', data.type);
                        console.log('='.repeat(60));

                        if (data.type === 'new_message') {
                            console.log('✅ Message type confirmed: new_message');
                            console.log('📝 Message Details:');
                            console.log('   - ID:', data.message?.id);
                            console.log('   - Body:', data.message?.body);
                            console.log('   - User ID:', data.message?.user_id);
                            console.log('   - User Name:', data.message?.user_name);
                            console.log('   - Created At:', data.message?.created_at);

                            callbacks.onNewMessage?.(data.message);
                            console.log('✅ onNewMessage callback executed');
                        } else {
                            console.warn('⚠️ Unknown message type:', data.type);
                        }
                        console.log('='.repeat(60));
                    },

                    rejected() {
                        console.error('='.repeat(60));
                        console.error(`❌ SUBSCRIPTION REJECTED: project space ${projectSpaceId}`);
                        console.error('This means backend refused the subscription');
                        console.error('Check backend logs for authorization issues');
                        console.error('='.repeat(60));
                    }
                }
            );

            this.subscriptions.set(channelKey, subscription);
            console.log(`✅ Subscription object created for: ${channelKey}`);
            return subscription;
        } catch (error) {
            console.error(`❌ Error subscribing to project space ${projectSpaceId}:`, error);
            return null;
        }
    }

    // Unsubscribe from conversation
    unsubscribeFromConversation(conversationId: string | number): void {
        const channelKey = `conversation_${conversationId}`;
        const subscription = this.subscriptions.get(channelKey);

        if (subscription) {
            try {
                subscription.unsubscribe();
                this.subscriptions.delete(channelKey);
                console.log(`✅ Unsubscribed from conversation ${conversationId}`);
            } catch (error) {
                console.error(`❌ Error unsubscribing from conversation ${conversationId}:`, error);
            }
        }
    }

    // Unsubscribe from project space
    unsubscribeFromProjectSpace(projectSpaceId: string | number): void {
        const channelKey = `project_space_${projectSpaceId}`;
        const subscription = this.subscriptions.get(channelKey);

        if (subscription) {
            try {
                subscription.unsubscribe();
                this.subscriptions.delete(channelKey);
                console.log(`✅ Unsubscribed from project space ${projectSpaceId}`);
            } catch (error) {
                console.error(`❌ Error unsubscribing from project space ${projectSpaceId}:`, error);
            }
        }
    }

    // Unsubscribe from user notifications
    unsubscribeFromUserNotifications(): void {
        const subscription = this.subscriptions.get('user_notifications');

        if (subscription) {
            try {
                subscription.unsubscribe();
                this.subscriptions.delete('user_notifications');
                console.log('✅ Unsubscribed from user notifications');
            } catch (error) {
                console.error('❌ Error unsubscribing from user notifications:', error);
            }
        }
    }

    // Get current connection status
    isConnected(): boolean {
        const connected = this.cable &&
            this.cable.connection &&
            this.cable.connection.isOpen &&
            this.cable.connection.isOpen();
        return connected;
    }

    // Get all active subscriptions
    getActiveSubscriptions(): string[] {
        const subs = Array.from(this.subscriptions.keys());
        console.log('📋 Active subscriptions:', subs);
        return subs;
    }
}

// Create singleton instance
const webSocketManager = new WebSocketManager();

export default webSocketManager;
import { useEffect, useRef } from "react";
import cable from "../utils/cable";

const useChatSubscription = ({ type, id, onMessage }) => {
    const subscriptionRef = useRef(null);

    useEffect(() => {
        if (!id) return;

        const channelParams = type === "group"
            ? { channel: "ProjectSpaceChannel", project_space_id: id }
            : { channel: "ConversationChannel", conversation_id: id };

        const subscription = cable.subscriptions.create(channelParams, {
            connected() {
                console.log(`Connected to ${type} channel with ID: ${id}`);
            },
            received(data) {
                if (data?.message) onMessage(data.message);
            },
            disconnected() {
                console.log(`Disconnected from ${type} channel with ID: ${id}`);
            },
        });

        subscriptionRef.current = subscription;

        return () => {
            if (subscriptionRef.current) {
                cable.subscriptions.remove(subscriptionRef.current);
            }
        };
    }, [type, id, onMessage]);
};

export default useChatSubscription;
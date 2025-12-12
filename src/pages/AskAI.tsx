import React from "react";

/**
 * AskAI Component
 * 
 * Displays an iframe with the AI chat interface from lockated.com
 * Provides a full-screen, seamless integration of the AI assistant
 */
export const AskAI: React.FC = () => {
    return (
        <div className="h-[calc(100vh-4rem)] w-full bg-white">
            <iframe
                src="https://ai.lockated.com/chats/"
                className="w-full h-full border-0"
                title="Ask AI Assistant"
                allow="camera; microphone; clipboard-read; clipboard-write"
                loading="lazy"
            />
        </div>
    );
};

export default AskAI;

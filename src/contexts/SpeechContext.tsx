import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode, useRef } from 'react';
import { toast } from 'sonner';

// Define the Window interface to include SpeechRecognition
declare global {
    interface Window {
        SpeechRecognition: any;
        webkitSpeechRecognition: any;
    }
}

interface SpeechState {
    isListening: boolean;
    transcript: string;
    error: string | null;
    supported: boolean;
    activeId: string | null;
}

interface SpeechContextType extends SpeechState {
    startListening: (id: string) => void;
    stopListening: () => void;
    resetTranscript: () => void;
}

const SpeechContext = createContext<SpeechContextType | undefined>(undefined);

export const SpeechProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [supported, setSupported] = useState(false);
    const [activeId, setActiveId] = useState<string | null>(null);
    const recognitionRef = useRef<any>(null);
    const isListeningIntent = useRef(false);

    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            setSupported(false);
            return;
        }

        setSupported(true);
        const instance = new SpeechRecognition();
        instance.continuous = true;
        instance.interimResults = true;
        instance.lang = 'en-US';

        instance.onstart = () => {
            console.log('Speech recognition started');
            setIsListening(true);
            setError(null);
        };

        instance.onend = () => {
            console.log('Speech recognition ended');
            setIsListening(false);

            // If we intended to keep listening (continuous mode sometimes stops on silence)
            // we can attempt a restart if the browser stopped it prematurely.
            if (isListeningIntent.current) {
                console.log('Attempting to restart speech recognition...');
                try {
                    instance.start();
                } catch (err) {
                    console.error('Failed to restart speech recognition:', err);
                }
            }
        };

        instance.onerror = (event: any) => {
            console.error('Speech recognition error:', event.error);
            setError(event.error);

            if (event.error === 'not-allowed') {
                toast.error('Microphone access denied. Please check your browser settings.');
                isListeningIntent.current = false;
            } else if (event.error === 'network') {
                const message = window.navigator.onLine
                    ? 'Network error: The speech service is unreachable. This can happen if a firewall or VPN is blocking it.'
                    : 'You are offline. Speech recognition requires an internet connection.';
                toast.error(message);
                isListeningIntent.current = false;
            } else if (event.error === 'no-speech') {
                console.log('No speech detected.');
            }
        };

        instance.onresult = (event: any) => {
            let fullTranscript = '';
            for (let i = 0; i < event.results.length; i++) {
                fullTranscript += event.results[i][0].transcript;
            }
            setTranscript(fullTranscript);
        };

        recognitionRef.current = instance;

        return () => {
            isListeningIntent.current = false;
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
    }, []);

    const startListening = useCallback((id: string) => {
        if (!window.navigator.onLine) {
            toast.error('You are offline. Speech recognition requires an internet connection.');
            return;
        }

        if (recognitionRef.current) {
            setTranscript(''); // Clear previous transcript on new start
            setActiveId(id);
            isListeningIntent.current = true;
            try {
                recognitionRef.current.start();
            } catch (err: any) {
                if (err.name !== 'InvalidStateError') {
                    console.error('Speech recognition start error:', err);
                }
            }
        } else {
            toast.error('Speech recognition is not supported or initialized.');
        }
    }, []);

    const stopListening = useCallback(() => {
        isListeningIntent.current = false;
        setActiveId(null);
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }
    }, []);

    const resetTranscript = useCallback(() => {
        setTranscript('');
    }, []);

    const value = {
        isListening,
        transcript,
        error,
        supported,
        activeId,
        startListening,
        stopListening,
        resetTranscript,
    };

    return <SpeechContext.Provider value={value}>{children}</SpeechContext.Provider>;
};

export const useSpeechContext = () => {
    const context = useContext(SpeechContext);
    if (context === undefined) {
        throw new Error('useSpeechContext must be used within a SpeechProvider');
    }
    return context;
};

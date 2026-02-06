import React, { useEffect, useState } from 'react';
import { TextField, InputAdornment, IconButton, TextFieldProps } from '@mui/material';
import { Mic, MicOff } from 'lucide-react';
import { useSpeechToText } from '../hooks/useSpeechToText';

interface SpeechInputProps extends Omit<TextFieldProps, 'onChange'> {
    speechEnabled?: boolean;
    onChange?: (value: string) => void;
    onSpeechResult?: (transcript: string) => void;
}

/**
 * A reusable SpeechInput component that extends MUI TextField.
 * Shows a mic button when `speechEnabled` is true.
 * Automatically updates the input value using speech-to-text when the mic is clicked.
 */
export const SpeechInput: React.FC<SpeechInputProps> = ({
    speechEnabled = true,
    onChange,
    onSpeechResult,
    value,
    ...props
}) => {
    const { isListening, activeId, transcript, supported, startListening, stopListening } = useSpeechToText();
    const [inputValue, setInputValue] = useState<string>((value as string) || '');

    // Use the id prop or name prop as a unique identifier for this field
    const fieldId = props.id || props.name || 'speech-input-default';
    const isActive = isListening && activeId === fieldId;

    // Update input value when transcript changes during listening for THIS field
    useEffect(() => {
        if (isActive && transcript) {
            setInputValue(transcript);
            if (onChange) onChange(transcript);
            if (onSpeechResult) onSpeechResult(transcript);
        }
    }, [transcript, isActive, onChange, onSpeechResult]);

    // Sync with prop value if it changes from outside
    useEffect(() => {
        if (!isActive) {
            setInputValue((value as string) || '');
        }
    }, [value, isActive]);

    const handleToggleListening = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (isActive) {
            stopListening();
        } else {
            startListening(fieldId);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
        if (onChange) onChange(e.target.value);
    };

    return (
        <TextField
            {...props}
            value={inputValue}
            onChange={handleInputChange}
            InputProps={{
                ...props.InputProps,
                endAdornment: speechEnabled && supported ? (
                    <InputAdornment position="end">
                        <IconButton
                            onClick={handleToggleListening}
                            color={isActive ? 'secondary' : 'default'}
                            size="small"
                            sx={{
                                color: isActive ? '#C72030' : 'inherit',
                                animation: isActive ? 'pulse 1.5s infinite' : 'none',
                                '@keyframes pulse': {
                                    '0%': { transform: 'scale(1)', opacity: 1 },
                                    '50%': { transform: 'scale(1.2)', opacity: 0.7 },
                                    '100%': { transform: 'scale(1)', opacity: 1 },
                                },
                            }}
                        >
                            {isActive ? <Mic size={16} /> : <MicOff size={16} />}
                        </IconButton>
                    </InputAdornment>
                ) : props.InputProps?.endAdornment,
            }}
        />
    );
};

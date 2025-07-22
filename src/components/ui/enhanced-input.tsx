
import React from 'react';
import { TextField, TextFieldProps } from '@mui/material';
import { cn } from '@/lib/utils';

interface EnhancedInputProps extends Omit<TextFieldProps, 'variant'> {
  helperText?: string;
}

export const EnhancedInput: React.FC<EnhancedInputProps> = ({
  className,
  error = false,
  helperText,
  ...props
}) => {
  const fieldStyles = {
    height: { xs: 36, sm: 40, md: 45 },
    '& .MuiInputBase-input': {
      padding: { xs: '10px 12px', sm: '12px 14px', md: '14px 16px' },
      fontSize: '14px',
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: error ? '#ef4444' : '#e2e8f0',
        transition: 'border-color 0.2s ease-in-out',
      },
      '&:hover fieldset': {
        borderColor: error ? '#ef4444' : '#64748b',
      },
      '&.Mui-focused fieldset': {
        borderColor: error ? '#ef4444' : '#0ea5e9',
        borderWidth: '2px',
      },
    },
    '& .MuiInputLabel-root': {
      color: error ? '#ef4444' : '#64748b',
      fontSize: '14px',
      '&.Mui-focused': {
        color: error ? '#ef4444' : '#0ea5e9',
      },
      '&.MuiInputLabel-shrink': {
        transform: 'translate(14px, -9px) scale(0.75)',
        backgroundColor: '#ffffff',
        padding: '0 4px',
      },
    },
  };

  return (
    <div className={cn("w-full", className)}>
      <TextField
        variant="outlined"
        fullWidth
        InputLabelProps={{ shrink: true }}
        sx={fieldStyles}
        error={error}
        {...props}
      />
      {helperText && (
        <p className={cn("text-xs mt-1", error ? "text-red-500" : "text-muted-foreground")}>
          {helperText}
        </p>
      )}
    </div>
  );
};

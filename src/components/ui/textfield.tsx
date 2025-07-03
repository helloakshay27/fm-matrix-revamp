
import React from 'react';
import { TextField as MuiTextField, TextFieldProps } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledTextField = styled(MuiTextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    backgroundColor: 'white',
    '& fieldset': {
      borderColor: '#D1D5DB',
    },
    '&:hover fieldset': {
      borderColor: '#9CA3AF',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#C72030',
      borderWidth: '2px',
    },
  },
  '& .MuiInputLabel-root': {
    color: '#6B7280',
    '&.Mui-focused': {
      color: '#C72030',
    },
  },
  '& .MuiOutlinedInput-input': {
    padding: '8px 12px',
    fontSize: '14px',
  },
}));

export interface CustomTextFieldProps extends Omit<TextFieldProps, 'variant'> {
  className?: string;
}

export const TextField: React.FC<CustomTextFieldProps> = ({ 
  className = '', 
  ...props 
}) => {
  return (
    <StyledTextField
      variant="outlined"
      fullWidth
      className={className}
      {...props}
    />
  );
};

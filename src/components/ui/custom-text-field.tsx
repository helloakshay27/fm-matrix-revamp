
import React from 'react';
import { TextField, TextFieldProps, createTheme, ThemeProvider } from '@mui/material';
import { styled } from '@mui/material/styles';

// Custom theme for text fields to match the design reference
const textFieldTheme = createTheme({
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '6px',
            backgroundColor: '#FFFFFF',
            boxShadow: 'none',
            '& fieldset': {
              borderColor: '#4A90E2',
              borderWidth: '1px',
              borderRadius: '6px',
            },
            '&:hover fieldset': {
              borderColor: '#4A90E2',
              borderWidth: '1px',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#4A90E2',
              borderWidth: '2px',
            },
            '&.Mui-disabled': {
              backgroundColor: '#F9F9F9',
              '& fieldset': {
                borderColor: '#E0E0E0',
              },
            },
            '&.MuiOutlinedInput-multiline': {
              paddingTop: '16px',
            },
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: '#4A90E2',
          fontWeight: 400,
          fontSize: '14px',
          '&.Mui-focused': {
            color: '#4A90E2',
          },
          '&.MuiInputLabel-shrink': {
            transform: 'translate(14px, -9px) scale(0.85)',
            backgroundColor: '#FFFFFF',
            padding: '0 6px',
            fontWeight: 400,
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        input: {
          color: '#333333',
          fontSize: '14px',
          padding: '12px 14px',
          '&::placeholder': {
            color: '#999999',
            opacity: 1,
          },
        },
      },
    },
  },
});

// Styled component for responsive text field
const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    // Desktop (default)
    width: '316px',
    height: '48px',
    '& input': {
      fontSize: '14px',
      fontWeight: 400,
      padding: '12px 14px',
    },
    '& textarea': {
      fontSize: '14px',
      fontWeight: 400,
      padding: '12px 14px',
    },
    '& .MuiInputLabel-root': {
      fontSize: '14px',
      fontWeight: 400,
    },
  },
  
  // Tablet breakpoint
  [theme.breakpoints.down('lg')]: {
    '& .MuiOutlinedInput-root': {
      width: '254px',
      height: '45px',
      '& input': {
        fontSize: '13px',
        padding: '10px 14px',
      },
      '& textarea': {
        fontSize: '13px',
        padding: '12px 14px',
      },
      '& .MuiInputLabel-root': {
        fontSize: '13px',
      },
    },
  },
  
  // Mobile breakpoint
  [theme.breakpoints.down('md')]: {
    '& .MuiOutlinedInput-root': {
      width: '128px',
      height: '36px',
      '& input': {
        fontSize: '12px',
        padding: '8px 12px',
      },
      '& textarea': {
        fontSize: '12px',
        padding: '8px 12px',
      },
      '& .MuiInputLabel-root': {
        fontSize: '12px',
      },
    },
  },
}));

// Custom TextField component interface
interface CustomTextFieldProps extends Omit<TextFieldProps, 'variant'> {
  state?: 'default' | 'focus' | 'disabled' | 'error' | 'success';
}

// Main Custom TextField Component
export const CustomTextField: React.FC<CustomTextFieldProps> = ({
  state = 'default',
  multiline,
  rows,
  ...props
}) => {
  const getStateProps = () => {
    switch (state) {
      case 'disabled':
        return { disabled: true };
      case 'error':
        return { error: true };
      case 'success':
        return { 
          sx: { 
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: '#4CAF50',
              },
            },
          },
        };
      default:
        return {};
    }
  };

  const rowsValue = typeof rows === 'number' ? rows : 4;

  return (
    <ThemeProvider theme={textFieldTheme}>
      <StyledTextField
        variant="outlined"
        InputLabelProps={{
          shrink: true,
        }}
        multiline={multiline}
        rows={rows}
        sx={{
          width: '100%',
          ...(multiline && {
            '& .MuiOutlinedInput-root': {
              minHeight: `${(rowsValue * 24) + 32}px`,
            }
          })
        }}
        {...getStateProps()}
        {...props}
      />
    </ThemeProvider>
  );
};

// Preset text field variants for common use cases
export const DesktopTextField: React.FC<CustomTextFieldProps> = (props) => (
  <CustomTextField
    sx={{
      '& .MuiOutlinedInput-root': {
        width: '316px',
        height: '48px',
        '& input': {
          fontSize: '14px',
          padding: '12px 14px',
        },
      },
    }}
    {...props}
  />
);

export const TabletTextField: React.FC<CustomTextFieldProps> = (props) => (
  <CustomTextField
    sx={{
      '& .MuiOutlinedInput-root': {
        width: '254px',
        height: '45px',
        '& input': {
          fontSize: '13px',
          padding: '10px 14px',
        },
      },
    }}
    {...props}
  />
);

export const MobileTextField: React.FC<CustomTextFieldProps> = (props) => (
  <CustomTextField
    sx={{
      '& .MuiOutlinedInput-root': {
        width: '128px',
        height: '36px',
        '& input': {
          fontSize: '12px',
          padding: '8px 12px',
        },
        '& .MuiInputLabel-root': {
          fontSize: '12px',
        },
      },
    }}
    {...props}
  />
);

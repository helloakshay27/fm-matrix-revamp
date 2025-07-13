import React from 'react';
import { TextField, TextFieldProps, createTheme, ThemeProvider } from '@mui/material';
import { styled } from '@mui/material/styles';

// Custom theme for text fields
const textFieldTheme = createTheme({
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '6px', // rounded-md equivalent
            backgroundColor: '#FFFFFF',
            boxShadow: 'none',
            '& fieldset': {
              borderColor: '#E0E0E0',
              borderRadius: '6px', // rounded-md equivalent
            },
            '&:hover fieldset': {
              borderColor: '#1A1A1A',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#C72030',
              borderWidth: 2,
            },
            '&.Mui-disabled': {
              opacity: 0.5,
            },
            '&.MuiOutlinedInput-multiline': {
              paddingTop: '20px',
            },
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: '#1A1A1A',
          fontWeight: 500,
          '&.Mui-focused': {
            color: '#C72030',
          },
          '&.MuiInputLabel-shrink': {
            transform: 'translate(14px, -9px) scale(0.75)',
            backgroundColor: '#FFFFFF',
            padding: '0 4px',
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        input: {
          color: '#1A1A1A',
          opacity: 0.54,
          '&::placeholder': {
            color: '#1A1A1A',
            opacity: 0.54,
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
    height: '45px',
    '& input': {
      fontSize: '14px',
      fontWeight: 400,
      padding: '12px 20px 20px 12px',
    },
    '& textarea': {
      fontSize: '14px',
      fontWeight: 400,
      padding: '12px',
    },
    '& .MuiInputLabel-root': {
      fontSize: '14px',
      fontWeight: 500,
    },
  },
  
  // Tablet breakpoint
  [theme.breakpoints.down('lg')]: {
    '& .MuiOutlinedInput-root': {
      width: '254px',
      height: '45px',
      '& input': {
        fontSize: '12px',
        padding: '4px 12px 12px 12px',
      },
      '& textarea': {
        fontSize: '12px',
        padding: '12px',
      },
      '& .MuiInputLabel-root': {
        fontSize: '14px',
      },
    },
  },
  
  // Mobile breakpoint
  [theme.breakpoints.down('md')]: {
    '& .MuiOutlinedInput-root': {
      width: '128px',
      height: '36px',
      '& input': {
        fontSize: '8px',
        padding: '8px',
      },
      '& textarea': {
        fontSize: '8px',
        padding: '8px',
      },
      '& .MuiInputLabel-root': {
        fontSize: '10px',
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
        height: '45px',
        '& input': {
          fontSize: '14px',
          padding: '12px 20px 20px 12px',
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
          fontSize: '12px',
          padding: '4px 12px 12px 12px',
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
          fontSize: '8px',
          padding: '8px',
        },
        '& .MuiInputLabel-root': {
          fontSize: '10px',
        },
      },
    }}
    {...props}
  />
);

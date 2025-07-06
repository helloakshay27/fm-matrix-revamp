
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
            borderRadius: 0,
            backgroundColor: '#FFFFFF',
            boxShadow: 'none',
            '& fieldset': {
              borderColor: '#E0E0E0',
              borderRadius: 0,
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
    height: '56px',
    '& input': {
      fontSize: '14px',
      fontWeight: 400,
      padding: '12px 20px 20px 12px',
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
      height: '44px',
      '& input': {
        fontSize: '12px',
        padding: '4px 12px 12px 12px',
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
      height: '28px',
      '& input': {
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

  return (
    <ThemeProvider theme={textFieldTheme}>
      <StyledTextField
        variant="outlined"
        InputLabelProps={{
          shrink: true,
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
        height: '56px',
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
        height: '44px',
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
        height: '28px',
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

import { createTheme, ThemeProvider } from '@mui/material/styles';
import React from 'react';

// Global MUI theme with enhanced select styles built-in
export const enhancedSelectTheme = createTheme({
  components: {
    // Enhanced FormControl styling
    MuiFormControl: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            height: '36px',
            backgroundColor: 'white',
            '@media (min-width: 640px)': {
              height: '40px',
            },
            '@media (min-width: 768px)': {
              height: '45px',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#1976d2',
              borderWidth: '2px',
            },
          },
          '& .MuiInputBase-input, & .MuiSelect-select': {
            padding: '8px 12px',
            display: 'flex',
            alignItems: 'center',
            '@media (min-width: 640px)': {
              padding: '10px 14px',
            },
            '@media (min-width: 768px)': {
              padding: '12px 14px',
            },
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: '#1976d2',
          },
        },
      },
    },

    // Enhanced Select styling
    MuiSelect: {
      defaultProps: {
        MenuProps: {
          disablePortal: true,
          PaperProps: {
            sx: {
              mt: 0.5,
              maxHeight: 200, // Short height control
              overflow: 'auto', // Internal scroll
              zIndex: 9999,
              boxShadow: 3,
            },
          },
        },
      },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            height: '36px',
            '@media (min-width: 640px)': {
              height: '40px',
            },
            '@media (min-width: 768px)': {
              height: '45px',
            },
          },
        },
      },
    },

    // Enhanced MenuItem styling
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontSize: '14px',
          padding: '8px 12px',
          minHeight: 'auto',
          '@media (min-width: 768px)': {
            fontSize: '16px',
            padding: '10px 16px',
          },
          '&:hover': {
            backgroundColor: '#f5f5f5',
          },
          '&.Mui-selected': {
            backgroundColor: '#e3f2fd',
            '&:hover': {
              backgroundColor: '#bbdefb',
            },
          },
        },
      },
    },

    // Enhanced Menu/Popover styling
    MuiMenu: {
      defaultProps: {
        disablePortal: true,
        PaperProps: {
          sx: {
            maxHeight: 200,
            overflow: 'auto',
            zIndex: 9999,
          },
        },
      },
    },

    MuiPopover: {
      defaultProps: {
        disablePortal: true,
        PaperProps: {
          sx: {
            maxHeight: 200,
            overflow: 'auto',
            zIndex: 9999,
          },
        },
      },
    },

    // Enhanced Autocomplete styling
    MuiAutocomplete: {
      defaultProps: {
        disablePortal: true,
        ListboxProps: {
          style: {
            maxHeight: 200,
            overflow: 'auto',
          },
        },
      },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            height: '36px',
            padding: 0,
            '@media (min-width: 640px)': {
              height: '40px',
            },
            '@media (min-width: 768px)': {
              height: '45px',
            },
          },
          '& .MuiInputBase-input': {
            padding: '8px 12px',
            '@media (min-width: 640px)': {
              padding: '10px 14px',
            },
            '@media (min-width: 768px)': {
              padding: '12px 14px',
            },
          },
        },
        listbox: {
          maxHeight: '200px',
          overflow: 'auto',
        },
        option: {
          fontSize: '14px',
          padding: '8px 12px',
          '@media (min-width: 768px)': {
            fontSize: '16px',
            padding: '10px 16px',
          },
        },
      },
    },

    // Enhanced TextField styling (for consistency)
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            height: '36px',
            '@media (min-width: 640px)': {
              height: '40px',
            },
            '@media (min-width: 768px)': {
              height: '45px',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#1976d2',
              borderWidth: '2px',
            },
          },
          '& .MuiInputBase-input': {
            padding: '8px 12px',
            '@media (min-width: 640px)': {
              padding: '10px 14px',
            },
            '@media (min-width: 768px)': {
              padding: '12px 14px',
            },
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: '#1976d2',
          },
        },
      },
    },
  },
});

// Global Enhanced Select Theme Provider
interface EnhancedSelectProviderProps {
  children: React.ReactNode;
}

export const EnhancedSelectProvider: React.FC<EnhancedSelectProviderProps> = ({ 
  children 
}) => {
  return (
    <ThemeProvider theme={enhancedSelectTheme}>
      {children}
    </ThemeProvider>
  );
};

export default EnhancedSelectProvider;

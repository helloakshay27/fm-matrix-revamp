import { useMemo } from 'react';

// Enhanced Select styling configurations that can be applied globally
export const useEnhancedSelectStyles = () => {
  // Standard field styles with short height control
  const fieldStyles = useMemo(() => ({
    height: { xs: 36, sm: 40, md: 45 },
    '& .MuiInputBase-input, & .MuiSelect-select': {
      padding: { xs: '8px 12px', sm: '10px 14px', md: '12px 14px' },
    },
    '& .MuiOutlinedInput-root': {
      backgroundColor: 'white',
    },
  }), []);

  // Menu props with internal scroll and short height
  const menuProps = useMemo(() => ({
    disablePortal: true,
    PaperProps: {
      sx: {
        mt: 0.5,
        maxHeight: 200, // Short height control
        overflow: 'auto', // Internal scroll
        zIndex: 9999,
        boxShadow: 3,
        '& .MuiMenuItem-root': {
          fontSize: { xs: '14px', md: '16px' },
          padding: { xs: '8px 12px', md: '10px 16px' },
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
  }), []);

  // Autocomplete props for searchable functionality
  const autocompleteProps = useMemo(() => ({
    disablePortal: true,
    ListboxProps: {
      style: {
        maxHeight: 200, // Short height control with internal scroll
        overflow: 'auto',
      },
    },
    PaperComponent: {
      sx: {
        zIndex: 9999,
        maxHeight: 200,
        overflow: 'auto',
      },
    },
  }), []);

  // Form control styles for consistent appearance
  const formControlStyles = useMemo(() => ({
    '& .MuiInputLabel-root': {
      fontSize: { xs: '14px', md: '16px' },
      '&.Mui-focused': {
        color: '#1976d2',
      },
    },
    '& .MuiOutlinedInput-root': {
      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: '#1976d2',
        borderWidth: '2px',
      },
    },
  }), []);

  return {
    fieldStyles,
    menuProps,
    autocompleteProps,
    formControlStyles,
  };
};

import { SelectProps, MenuProps } from '@mui/material';

/**
 * Global utility to get enhanced MUI Select props with:
 * 1. Short Height Control
 * 2. Internal Scroll 
 * 3. Consistent styling
 */
export const getEnhancedSelectProps = (overrides?: Partial<SelectProps>): Partial<SelectProps> => {
  const defaultSx = {
    height: { xs: 36, sm: 40, md: 45 },
    '& .MuiInputBase-input, & .MuiSelect-select': {
      padding: { xs: '8px 12px', sm: '10px 14px', md: '12px 14px' },
    },
    '& .MuiOutlinedInput-root': {
      backgroundColor: 'white',
    },
  };

  const defaultMenuProps: MenuProps = {
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
  };

  return {
    sx: { ...defaultSx, ...overrides?.sx },
    MenuProps: { ...defaultMenuProps, ...overrides?.MenuProps },
    displayEmpty: true,
    ...overrides,
  };
};

/**
 * Global utility to get enhanced Autocomplete props for searchable functionality
 */
export const getEnhancedAutocompleteProps = (overrides?: any) => {
  const defaultSx = {
    '& .MuiOutlinedInput-root': {
      height: { xs: 36, sm: 40, md: 45 },
      padding: 0,
    },
    '& .MuiInputBase-input': {
      padding: { xs: '8px 12px', sm: '10px 14px', md: '12px 14px' },
    },
  };

  return {
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
    sx: { ...defaultSx, ...overrides?.sx },
    ...overrides,
  };
};

/**
 * Apply enhanced styling classes to existing MUI components
 */
export const getEnhancedSelectClassNames = () => ({
  select: 'enhanced-select-global',
  menu: 'enhanced-select-menu',
  autocomplete: 'enhanced-autocomplete-global',
});

/**
 * Common options format for consistent option structure
 */
export interface EnhancedSelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
  group?: string;
}

/**
 * Utility to convert simple arrays to enhanced option format
 */
export const createEnhancedOptions = (
  items: string[] | { value: string | number; label: string; disabled?: boolean }[]
): EnhancedSelectOption[] => {
  if (typeof items[0] === 'string') {
    return (items as string[]).map(item => ({
      value: item,
      label: item,
    }));
  }
  return items as EnhancedSelectOption[];
};

/**
 * Quick application of enhanced props to existing FormControl/Select
 */
export const enhanceExistingSelect = (selectElement: any) => {
  const enhancedProps = getEnhancedSelectProps();
  const classNames = getEnhancedSelectClassNames();
  
  return {
    ...selectElement.props,
    sx: { ...enhancedProps.sx, ...selectElement.props.sx },
    MenuProps: { ...enhancedProps.MenuProps, ...selectElement.props.MenuProps },
    className: `${selectElement.props.className || ''} ${classNames.select}`.trim(),
  };
};

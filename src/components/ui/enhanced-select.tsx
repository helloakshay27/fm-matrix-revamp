import React, { useState } from 'react';
import {
  FormControl,
  InputLabel,
  Select as MuiSelect,
  MenuItem,
  Autocomplete,
  TextField,
  SelectChangeEvent,
  FormControlProps,
  SelectProps,
  AutocompleteProps,
} from '@mui/material';

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

interface BaseEnhancedSelectProps {
  label: string;
  value: string | number | '';
  onChange: (value: string | number) => void;
  options: SelectOption[];
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  variant?: 'outlined' | 'filled' | 'standard';
  error?: boolean;
  helperText?: string;
  shrinkLabel?: boolean;
  displayEmpty?: boolean;
  className?: string;
}

interface EnhancedSelectProps extends BaseEnhancedSelectProps {
  searchable?: false;
  // Standard Select specific props
  MenuProps?: SelectProps['MenuProps'];
}

interface SearchableSelectProps extends BaseEnhancedSelectProps {
  searchable: true;
  // Autocomplete specific props
  freeSolo?: boolean;
  multiple?: boolean;
}

type EnhancedSelectUnionProps = EnhancedSelectProps | SearchableSelectProps;

const defaultFieldStyles = {
  height: { xs: 36, sm: 40, md: 45 },
  '& .MuiInputBase-input, & .MuiSelect-select': {
    padding: { xs: '8px 12px', sm: '10px 14px', md: '12px 14px' },
  },
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'white',
  },
};

const defaultMenuProps = {
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
      },
    },
  },
};

export const EnhancedSelect: React.FC<EnhancedSelectUnionProps> = ({
  label,
  value,
  onChange,
  options,
  placeholder = 'Select an option',
  required = false,
  disabled = false,
  fullWidth = true,
  variant = 'outlined',
  error = false,
  helperText,
  shrinkLabel = true,
  displayEmpty = true,
  className,
  ...props
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Handle change event for standard select
  const handleSelectChange = (event: SelectChangeEvent<unknown>) => {
    onChange(event.target.value as string | number);
  };

  // Handle change event for autocomplete
  const handleAutocompleteChange = (
    event: React.SyntheticEvent,
    newValue: SelectOption | null
  ) => {
    onChange(newValue ? newValue.value : '');
  };

  // Check if this is a searchable select
  const isSearchable = 'searchable' in props && props.searchable;

  if (isSearchable) {
    const autocompleteProps = props as SearchableSelectProps;
    
    // Filter options based on search term
    const filteredOptions = options.filter(option =>
      option.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const selectedOption = options.find(option => option.value === value) || null;

    return (
      <Autocomplete
        value={selectedOption}
        onChange={handleAutocompleteChange}
        options={filteredOptions}
        getOptionLabel={(option) => option.label}
        isOptionEqualToValue={(option, value) => option.value === value.value}
        disabled={disabled}
        fullWidth={fullWidth}
        freeSolo={autocompleteProps.freeSolo}
        disablePortal
        ListboxProps={{
          style: {
            maxHeight: 200, // Short height control with internal scroll
          },
        }}
        PaperComponent={({ children, ...paperProps }) => (
          <div {...paperProps} style={{ ...paperProps.style, zIndex: 9999 }}>
            {children}
          </div>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            label={label}
            placeholder={placeholder}
            variant={variant}
            required={required}
            error={error}
            helperText={helperText}
            InputLabelProps={{
              shrink: shrinkLabel,
            }}
            sx={defaultFieldStyles}
            className={className}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        )}
        renderOption={(props, option) => (
          <li {...props} key={option.value}>
            {option.label}
          </li>
        )}
      />
    );
  }

  // Standard select (non-searchable)
  const selectProps = props as EnhancedSelectProps;
  
  return (
    <FormControl
      fullWidth={fullWidth}
      variant={variant}
      required={required}
      disabled={disabled}
      error={error}
      className={className}
    >
      <InputLabel shrink={shrinkLabel}>{label}</InputLabel>
      <MuiSelect
        value={value}
        onChange={handleSelectChange}
        label={label}
        displayEmpty={displayEmpty}
        sx={defaultFieldStyles}
        MenuProps={{
          ...defaultMenuProps,
          ...selectProps.MenuProps,
        }}
      >
        {displayEmpty && (
          <MenuItem value="">
            <em>{placeholder}</em>
          </MenuItem>
        )}
        {options.map((option) => (
          <MenuItem
            key={option.value}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </MenuItem>
        ))}
      </MuiSelect>
      {helperText && (
        <div style={{ fontSize: '12px', color: error ? '#d32f2f' : '#666', marginTop: '4px' }}>
          {helperText}
        </div>
      )}
    </FormControl>
  );
};

// Convenience component for searchable select
export const SearchableSelect: React.FC<Omit<SearchableSelectProps, 'searchable'>> = (props) => {
  return <EnhancedSelect {...props} searchable />;
};

// Export default as standard select
export default EnhancedSelect;

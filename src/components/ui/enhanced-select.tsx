
import React from 'react';
import { FormControl, InputLabel, Select as MuiSelect, MenuItem, SelectProps } from '@mui/material';
import { cn } from '@/lib/utils';

interface EnhancedSelectProps extends Omit<SelectProps, 'variant'> {
  label: string;
  options: { value: string; label: string }[];
  placeholder?: string;
  required?: boolean;
  error?: boolean;
  helperText?: string;
}

export const EnhancedSelect: React.FC<EnhancedSelectProps> = ({
  label,
  options,
  placeholder,
  required = false,
  error = false,
  helperText,
  className,
  ...props
}) => {
  const fieldStyles = {
    height: { xs: 36, sm: 40, md: 45 },
    '& .MuiInputBase-input, & .MuiSelect-select': {
      padding: { xs: '10px 12px', sm: '12px 14px', md: '14px 16px' },
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
      '&.Mui-focused': {
        color: error ? '#ef4444' : '#0ea5e9',
      },
    },
  };

  return (
    <div className={cn("w-full", className)}>
      <FormControl fullWidth variant="outlined" error={error}>
        <InputLabel shrink>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </InputLabel>
        <MuiSelect
          label={label}
          displayEmpty
          sx={fieldStyles}
          MenuProps={{
            PaperProps: {
              sx: {
                bgcolor: 'background.paper',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                mt: 1,
                '& .MuiMenuItem-root': {
                  fontSize: '14px',
                  '&:hover': {
                    bgcolor: '#f1f5f9',
                  },
                  '&.Mui-selected': {
                    bgcolor: '#e0f2fe',
                    '&:hover': {
                      bgcolor: '#bae6fd',
                    },
                  },
                },
              },
            },
          }}
          {...props}
        >
          {placeholder && (
            <MenuItem value="">
              <em>{placeholder}</em>
            </MenuItem>
          )}
          {options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </MuiSelect>
      </FormControl>
      {helperText && (
        <p className={cn("text-xs mt-1", error ? "text-red-500" : "text-muted-foreground")}>
          {helperText}
        </p>
      )}
    </div>
  );
};

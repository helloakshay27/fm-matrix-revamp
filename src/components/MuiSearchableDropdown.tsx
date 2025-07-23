import React, { useState, useMemo } from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Box,
  Typography,
  ListSubheader,
  SelectChangeEvent
} from '@mui/material';
import { Search } from 'lucide-react';

interface Option {
  id: string | number;
  label: string;
  value: string | number;
}

interface MuiSearchableDropdownProps {
  label: string;
  value: string | number;
  onChange: (value: string | number) => void;
  options: Option[];
  placeholder?: string;
  disabled?: boolean;
  loading?: boolean;
  loadingText?: string;
  fullWidth?: boolean;
  error?: boolean;
  helperText?: string;
}

export const MuiSearchableDropdown: React.FC<MuiSearchableDropdownProps> = ({
  label,
  value,
  onChange,
  options,
  placeholder = "Select an option",
  disabled = false,
  loading = false,
  loadingText = "Loading...",
  fullWidth = true,
  error = false,
  helperText = ""
}) => {
  const [searchText, setSearchText] = useState('');
  const [open, setOpen] = useState(false);

  // Filter and sort options based on search text
  const filteredOptions = useMemo(() => {
    if (!searchText.trim()) {
      return options;
    }

    const searchLower = searchText.toLowerCase();
    
    // Separate exact matches, starts with matches, and contains matches
    const exactMatches: Option[] = [];
    const startsWithMatches: Option[] = [];
    const containsMatches: Option[] = [];

    options.forEach(option => {
      const labelLower = option.label.toLowerCase();
      
      if (labelLower === searchLower) {
        exactMatches.push(option);
      } else if (labelLower.startsWith(searchLower)) {
        startsWithMatches.push(option);
      } else if (labelLower.includes(searchLower)) {
        containsMatches.push(option);
      }
    });

    // Return in priority order: exact -> starts with -> contains
    return [...exactMatches, ...startsWithMatches, ...containsMatches];
  }, [options, searchText]);

  const handleSelectChange = (event: SelectChangeEvent<string | number>) => {
    onChange(event.target.value);
    setOpen(false);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
  };

  const handleOpen = () => {
    setOpen(true);
    setSearchText('');
  };

  const handleClose = () => {
    setOpen(false);
    setSearchText('');
  };

  return (
    <FormControl fullWidth={fullWidth} error={error}>
      <InputLabel>{label}</InputLabel>
      <Select
        value={value}
        onChange={handleSelectChange}
        disabled={disabled || loading}
        open={open}
        onOpen={handleOpen}
        onClose={handleClose}
        MenuProps={{
          PaperProps: {
            style: {
              maxHeight: 300,
            },
          },
        }}
      >
        {/* Search Input */}
        <ListSubheader>
          <TextField
            size="small"
            autoFocus
            placeholder="Search..."
            fullWidth
            InputProps={{
              startAdornment: <Search size={16} style={{ marginRight: 8, color: '#666' }} />
            }}
            value={searchText}
            onChange={handleSearchChange}
            onKeyDown={(e) => {
              if (e.key !== 'Escape') {
                e.stopPropagation();
              }
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#E0E0E0',
                },
                '&:hover fieldset': {
                  borderColor: '#C72030',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#C72030',
                },
              },
            }}
          />
        </ListSubheader>

        {/* Default/Placeholder Option */}
        <MenuItem value="">
          <em>{placeholder}</em>
        </MenuItem>

        {/* Loading State */}
        {loading && (
          <MenuItem disabled>
            <Typography variant="caption" color="textSecondary">
              {loadingText}
            </Typography>
          </MenuItem>
        )}

        {/* No Results */}
        {!loading && searchText && filteredOptions.length === 0 && (
          <MenuItem disabled>
            <Typography variant="caption" color="textSecondary">
              No results found for "{searchText}"
            </Typography>
          </MenuItem>
        )}

        {/* Filtered Options */}
        {!loading && filteredOptions.map((option) => (
          <MenuItem key={option.id} value={option.value}>
            {/* Highlight matching text */}
            {searchText ? (
              <Box>
                {option.label.split(new RegExp(`(${searchText})`, 'gi')).map((part, index) =>
                  part.toLowerCase() === searchText.toLowerCase() ? (
                    <span key={index} style={{ backgroundColor: '#FFD700', fontWeight: 'bold' }}>
                      {part}
                    </span>
                  ) : (
                    part
                  )
                )}
              </Box>
            ) : (
              option.label
            )}
          </MenuItem>
        ))}
      </Select>
      
      {helperText && (
        <Typography variant="caption" color={error ? "error" : "textSecondary"} sx={{ mt: 0.5 }}>
          {helperText}
        </Typography>
      )}
    </FormControl>
  );
};

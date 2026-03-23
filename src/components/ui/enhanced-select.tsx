import React, { useState } from "react";
import {
  FormControl,
  InputLabel,
  Select as MuiSelect,
  MenuItem,
  Autocomplete,
  TextField,
  InputAdornment,
  ListSubheader,
  SelectChangeEvent,
  FormControlProps,
  SelectProps,
  AutocompleteProps,
  SxProps,
  Theme,
} from "@mui/material";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Search, ChevronDown } from "lucide-react";

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

interface BaseEnhancedSelectProps {
  label: React.ReactNode;
  value: string | number | "";
  onChange: (value: string | number) => void;
  options: SelectOption[];
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  variant?: "outlined" | "filled" | "standard";
  error?: boolean;
  helperText?: string;
  shrinkLabel?: boolean;
  displayEmpty?: boolean;
  className?: string;
  sx?: SxProps<Theme>;
}

interface EnhancedSelectProps extends BaseEnhancedSelectProps {
  searchable?: false;
  // Standard Select specific props
  MenuProps?: SelectProps["MenuProps"];
}

interface SearchableSelectProps extends BaseEnhancedSelectProps {
  searchable: true;
  // Autocomplete specific props
  freeSolo?: boolean;
  multiple?: boolean;
}

type EnhancedSelectUnionProps = EnhancedSelectProps | SearchableSelectProps;

const defaultFieldStyles = {
  height: { xs: 40, md: 45 },
  backgroundColor: "white",
  "& .MuiInputBase-input, & .MuiSelect-select": {
    padding: { xs: "8px 12px", sm: "10px 14px", md: "12px 14px" },
    height: "auto !important",
  },
  "& .MuiOutlinedInput-root": {
    height: { xs: 40, md: 45 },
    backgroundColor: "white",
    "& fieldset": {
      borderColor: "#e2e8f0", // slate-200
    },
    "&:hover fieldset": {
      borderColor: "#3b82f6",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#3b82f6",
    },
  },
  "& .MuiInputLabel-root": {
    color: "#64748b",
    "&.Mui-focused": {
      color: "#3b82f6",
    },
  },
};

const defaultMenuProps: Partial<SelectProps["MenuProps"]> = {
  disableScrollLock: true,
  anchorOrigin: {
    vertical: "bottom",
    horizontal: "left",
  },
  transformOrigin: {
    vertical: "top",
    horizontal: "left",
  },
  PaperProps: {
    sx: {
      backgroundColor: "white !important",
      mt: 1,
      maxHeight: 300,
      overflow: "auto",
      zIndex: 99999,
      boxShadow:
        "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1) !important",
      border: "1px solid #e2e8f0",
      "& .MuiMenuItem-root": {
        fontSize: { xs: "14px", md: "16px" },
        padding: { xs: "8px 12px", md: "10px 16px" },
      },
    },
  },
};

// --- Radix UI Searchable Select Implementation ---
export const SearchableSelect: React.FC<
  Omit<SearchableSelectProps, "searchable">
> = ({
  label,
  value,
  onChange,
  options,
  placeholder = "Select an option",
  disabled = false,
  error = false,
  helperText,
  fullWidth = true,
  sx,
}) => {
  const [open, setOpen] = useState(false);
  const selectedOption = options.find(
    (opt) => opt.value === value || opt.value.toString() === value?.toString()
  );

  return (
    <div className={`flex flex-col w-full`} style={sx as any}>
      {label && (
        <div className="mb-2 text-sm font-semibold text-slate-700">{label}</div>
      )}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            disabled={disabled}
            className={`flex min-h-[45px] w-full items-center justify-between rounded-md border bg-white px-3 py-2 text-[15px] shadow-sm ring-offset-background transition-colors focus:outline-none focus:ring-1 focus:ring-[#3b82f6] disabled:cursor-not-allowed disabled:opacity-50
              ${error ? "border-red-500" : "border-slate-200 hover:border-[#3b82f6]"}
            `}
          >
            <span
              className={`block text-left ${
                selectedOption ? "text-slate-900" : "text-slate-500 text-[14px]"
              }`}
            >
              {selectedOption ? selectedOption.label : placeholder}
            </span>
            <ChevronDown className="h-4 w-4 shrink-0 opacity-50 ml-2" />
          </button>
        </PopoverTrigger>
        <PopoverContent
          className="w-[var(--radix-popover-trigger-width)] p-0 shadow-lg border-slate-200 rounded-lg bg-white pointer-events-auto z-[99999]"
          align="start"
          sideOffset={8}
          onWheel={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
        >
          <Command 
            className="w-full bg-white overflow-hidden" 
            onWheel={(e) => e.stopPropagation()}
          >
            <CommandInput
              placeholder="Type to search..."
              className="h-10 text-[14px]"
            />
            <CommandList 
              className="max-h-[300px] overflow-y-auto w-full scrollbar-thin scrollbar-thumb-gray-300 touch-pan-y"
              style={{ overflowY: 'auto' }}
            >
              <CommandEmpty className="py-3 text-center text-sm text-slate-500">
                No results found.
              </CommandEmpty>
              <CommandGroup className="w-full p-1.5">
                {options.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.label}
                    onSelect={() => {
                      onChange(option.value);
                      setOpen(false);
                    }}
                    disabled={option.disabled}
                    className="cursor-pointer rounded-md px-2.5 py-2 text-[14px] whitespace-normal break-words leading-tight aria-selected:bg-blue-50 aria-selected:text-blue-700 w-full"
                  >
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {helperText && (
        <span
          className={`text-[12px] mt-1 ${error ? "text-[#d32f2f]" : "text-[#666]"}`}
        >
          {helperText}
        </span>
      )}
    </div>
  );
};

// --- Standard Material UI Select Implementation ---
export const EnhancedSelect: React.FC<EnhancedSelectUnionProps> = (props) => {
  const isSearchable = "searchable" in props && props.searchable;

  if (isSearchable) {
    const { searchable, ...searchableProps } = props as SearchableSelectProps;
    return <SearchableSelect {...searchableProps} />;
  }

  const {
    label,
    value,
    onChange,
    options,
    placeholder = "Select an option",
    required = false,
    disabled = false,
    fullWidth = true,
    variant = "outlined",
    error = false,
    helperText,
    shrinkLabel = true,
    displayEmpty = true,
    className,
    sx,
    ...restProps
  } = props as EnhancedSelectProps;

  // Handle change event for standard select
  const handleSelectChange = (event: SelectChangeEvent<unknown>) => {
    onChange(event.target.value as string | number);
  };

  return (
    <FormControl
      fullWidth={fullWidth}
      variant={variant}
      required={required}
      disabled={disabled}
      error={error}
      className={className}
    >
      {label && <InputLabel shrink={shrinkLabel}>{label}</InputLabel>}
      <MuiSelect
        value={value}
        onChange={handleSelectChange}
        label={label}
        displayEmpty={displayEmpty}
        sx={{
          ...defaultFieldStyles,
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#3b82f6 !important", // Blue like image
          },
          ...sx,
        }}
        MenuProps={{
          ...defaultMenuProps,
          autoFocus: false,
          ...restProps.MenuProps,
        }}
      >
        {displayEmpty && (
          <MenuItem value="">
            <em>{placeholder}</em>
          </MenuItem>
        )}

        {options.length > 0 ? (
          options.map((option) => (
            <MenuItem
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </MenuItem>
          ))
        ) : (
          <MenuItem disabled>No results found</MenuItem>
        )}
      </MuiSelect>
      {helperText && (
        <div
          style={{
            fontSize: "12px",
            color: error ? "#d32f2f" : "#666",
            marginTop: "4px",
          }}
        >
          {helperText}
        </div>
      )}
    </FormControl>
  );
};

// Export default as standard select
export default EnhancedSelect;

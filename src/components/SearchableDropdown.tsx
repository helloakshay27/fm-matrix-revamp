
import React from 'react';
import Select, { components, StylesConfig, GroupBase } from 'react-select';
import { Search } from 'lucide-react';

interface Option {
  value: string;
  label: string;
}

interface SearchableDropdownProps {
  placeholder?: string;
  options: Option[];
  value?: Option | null;
  onChange?: (selectedOption: Option | null) => void;
  onInputChange?: (inputValue: string) => void;
  isLoading?: boolean;
  className?: string;
  isSearchable?: boolean;
  isClearable?: boolean;
  noOptionsMessage?: string;
}

const CustomDropdownIndicator = (props: any) => {
  return (
    <components.DropdownIndicator {...props}>
      <Search className="w-4 h-4 text-gray-400" />
    </components.DropdownIndicator>
  );
};

export const SearchableDropdown: React.FC<SearchableDropdownProps> = ({
  placeholder = "Search...",
  options,
  value,
  onChange,
  onInputChange,
  isLoading = false,
  className = "",
  isSearchable = true,
  isClearable = true,
  noOptionsMessage = "No options found"
}) => {
  const customStyles: StylesConfig<Option, false, GroupBase<Option>> = {
    control: (provided, state) => ({
      ...provided,
      border: '1px solid #A8A8A8',
      borderRadius: '8px',
      backgroundColor: '#FFFFFF',
      minHeight: '36px',
      height: '36px',
      boxShadow: state.isFocused ? '0 0 0 2px rgba(59, 130, 246, 0.5)' : 'none',
      '&:hover': {
        border: '1px solid #A8A8A8',
      },
      fontSize: '14px',
      cursor: 'text',
    }),
    valueContainer: (provided) => ({
      ...provided,
      padding: '0 12px',
      height: '34px',
    }),
    input: (provided) => ({
      ...provided,
      margin: 0,
      padding: 0,
      color: '#1f2937',
    }),
    placeholder: (provided) => ({
      ...provided,
      color: '#6b7280',
      fontSize: '14px',
    }),
    singleValue: (provided) => ({
      ...provided,
      color: '#1f2937',
      fontSize: '14px',
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: '#FFFFFF',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      zIndex: 9999,
      marginTop: '4px',
    }),
    menuList: (provided) => ({
      ...provided,
      maxHeight: '160px',
      padding: 0,
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? '#f3f4f6' : '#FFFFFF',
      color: state.isFocused ? '#1f2937' : '#374151',
      padding: '12px 16px',
      fontSize: '14px',
      cursor: 'pointer',
      '&:hover': {
        backgroundColor: '#f3f4f6',
      },
      '&:active': {
        backgroundColor: '#e5e7eb',
      },
    }),
    indicatorSeparator: () => ({
      display: 'none',
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      padding: '0 8px',
      color: '#6b7280',
    }),
    clearIndicator: (provided) => ({
      ...provided,
      padding: '0 8px',
      color: '#6b7280',
      '&:hover': {
        color: '#374151',
      },
    }),
    loadingIndicator: (provided) => ({
      ...provided,
      color: '#6b7280',
    }),
  };

  const responsiveStyles = {
    '@media (max-width: 768px)': {
      control: {
        minHeight: '32px',
        height: '32px',
        fontSize: '13px',
      },
      valueContainer: {
        padding: '0 8px',
        height: '30px',
      },
      option: {
        padding: '10px 12px',
        fontSize: '13px',
      },
    },
  };

  return (
    <div className={`relative ${className}`}>
      <Select
        options={options}
        value={value}
        onChange={onChange}
        onInputChange={onInputChange}
        placeholder={placeholder}
        isSearchable={isSearchable}
        isClearable={isClearable}
        isLoading={isLoading}
        styles={customStyles}
        components={{
          DropdownIndicator: CustomDropdownIndicator,
        }}
        noOptionsMessage={() => noOptionsMessage}
        loadingMessage={() => "Loading..."}
        classNamePrefix="react-select"
        menuPortalTarget={document.body}
        menuPosition="fixed"
      />
    </div>
  );
};

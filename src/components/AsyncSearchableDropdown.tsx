
import React, { useState, useCallback, useMemo } from 'react';
import { SearchableDropdown } from './SearchableDropdown';
import { debounce } from 'lodash';

interface Option {
  value: string;
  label: string;
}

interface AsyncSearchableDropdownProps {
  placeholder?: string;
  onSearch: (searchTerm: string) => Promise<Option[]> | Option[];
  onChange?: (selectedOption: Option | null) => void;
  className?: string;
  isSearchable?: boolean;
  isClearable?: boolean;
  noOptionsMessage?: string;
  debounceDelay?: number;
  defaultOptions?: Option[];
}

export const AsyncSearchableDropdown: React.FC<AsyncSearchableDropdownProps> = ({
  placeholder = "Search...",
  onSearch,
  onChange,
  className = "",
  isSearchable = true,
  isClearable = true,
  noOptionsMessage = "No options found",
  debounceDelay = 300,
  defaultOptions = []
}) => {
  const [options, setOptions] = useState<Option[]>(defaultOptions);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedValue, setSelectedValue] = useState<Option | null>(null);

  const debouncedSearch = useMemo(
    () => debounce(async (searchTerm: string) => {
      if (!searchTerm.trim()) {
        setOptions(defaultOptions);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const results = await onSearch(searchTerm);
        setOptions(results);
      } catch (error) {
        console.error('Search error:', error);
        setOptions([]);
      } finally {
        setIsLoading(false);
      }
    }, debounceDelay),
    [onSearch, debounceDelay, defaultOptions]
  );

  const handleInputChange = useCallback((inputValue: string) => {
    debouncedSearch(inputValue);
  }, [debouncedSearch]);

  const handleChange = useCallback((selectedOption: Option | null) => {
    setSelectedValue(selectedOption);
    onChange?.(selectedOption);
  }, [onChange]);

  return (
    <SearchableDropdown
      placeholder={placeholder}
      options={options}
      value={selectedValue}
      onChange={handleChange}
      onInputChange={handleInputChange}
      isLoading={isLoading}
      className={className}
      isSearchable={isSearchable}
      isClearable={isClearable}
      noOptionsMessage={noOptionsMessage}
    />
  );
};

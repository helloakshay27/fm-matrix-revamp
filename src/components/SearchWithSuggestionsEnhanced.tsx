
import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface SearchWithSuggestionsEnhancedProps {
  placeholder?: string;
  onSearch?: (value: string) => void;
  suggestions?: string[];
  className?: string;
  variant?: 'default' | 'compact' | 'large';
  showIcon?: boolean;
  borderRadius?: number;
  shadowLevel?: 'none' | 'sm' | 'md' | 'lg';
  width?: number;
  height?: number;
}

export const SearchWithSuggestionsEnhanced = ({
  placeholder = "Search...",
  onSearch,
  suggestions = [],
  className = "",
  variant = 'default',
  showIcon = true,
  borderRadius = 8,
  shadowLevel = 'sm',
  width,
  height = 36,
}: SearchWithSuggestionsEnhancedProps) => {
  const [searchValue, setSearchValue] = useState('');
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (searchValue.length > 0) {
      const filtered = suggestions
        .filter((s) => s.toLowerCase().includes(searchValue.toLowerCase()))
        .slice(0, 8);
      setFilteredSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setFilteredSuggestions([]);
      setShowSuggestions(false);
    }
    setActiveSuggestion(-1);
  }, [searchValue, suggestions]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    onSearch?.(value);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchValue(suggestion);
    setShowSuggestions(false);
    onSearch?.(suggestion);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveSuggestion((prev) => (prev < filteredSuggestions.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveSuggestion((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeSuggestion >= 0) {
        handleSuggestionClick(filteredSuggestions[activeSuggestion]);
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      setActiveSuggestion(-1);
    }
  };

  const handleInputFocus = () => {
    if (filteredSuggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleInputBlur = (e: React.FocusEvent) => {
    setTimeout(() => {
      setShowSuggestions(false);
      setActiveSuggestion(-1);
    }, 150);
  };

  const getSuggestionBoxPosition = () => {
    const rect = inputRef.current?.getBoundingClientRect();
    if (!rect) return { top: 0, left: 0, width: 0 };
    return {
      top: rect.bottom + window.scrollY,
      left: rect.left + window.scrollX,
      width: rect.width,
    };
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'compact':
        return 'px-2 py-1 text-sm';
      case 'large':
        return 'px-6 py-3 text-lg';
      default:
        return 'px-4 py-2';
    }
  };

  const getShadowClass = () => {
    switch (shadowLevel) {
      case 'none':
        return '';
      case 'sm':
        return 'shadow-sm';
      case 'md':
        return 'shadow-md';
      case 'lg':
        return 'shadow-lg';
      default:
        return 'shadow-sm';
    }
  };

  const inputStyles = {
    borderRadius: `${borderRadius}px`,
    height: `${height}px`,
    width: width ? `${width}px` : undefined,
  };

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <div className="relative">
        {showIcon && (
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10" />
        )}
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={searchValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          className={`
            w-full border border-[#A8A8A8] bg-white text-gray-900 
            placeholder:text-gray-500 focus:outline-none focus:ring-2 
            focus:ring-blue-500 focus:border-blue-500 transition-all
            ${getVariantStyles()} ${getShadowClass()}
            ${showIcon ? 'pl-10' : ''}
          `}
          style={inputStyles}
        />
      </div>

      {showSuggestions &&
        filteredSuggestions.length > 0 &&
        createPortal(
          <div
            className="absolute bg-white border border-gray-300 rounded-lg shadow-xl z-[9999] max-h-48 overflow-y-auto"
            style={{
              position: 'absolute',
              top: `${getSuggestionBoxPosition().top + 4}px`,
              left: `${getSuggestionBoxPosition().left}px`,
              width: `${getSuggestionBoxPosition().width}px`,
              borderRadius: `${borderRadius}px`,
            }}
          >
            {filteredSuggestions.map((suggestion, index) => (
              <div
                key={index}
                onMouseDown={() => handleSuggestionClick(suggestion)}
                className={`px-4 py-3 cursor-pointer text-sm transition-colors ${
                  index === activeSuggestion 
                    ? 'bg-blue-50 text-blue-900' 
                    : 'text-gray-700 hover:bg-gray-50'
                } ${index === 0 ? 'rounded-t-lg' : ''} ${
                  index === filteredSuggestions.length - 1
                    ? 'rounded-b-lg'
                    : 'border-b border-gray-100'
                }`}
              >
                {suggestion}
              </div>
            ))}
          </div>,
          document.body
        )}
    </div>
  );
};

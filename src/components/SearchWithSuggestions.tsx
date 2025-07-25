
import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Search } from 'lucide-react';

interface SearchWithSuggestionsProps {
  placeholder?: string;
  onSearch?: (value: string) => void;
  suggestions?: string[];
  className?: string;
}

export const SearchWithSuggestions = ({
  placeholder = "Search",
  onSearch,
  suggestions = [],
  className = "",
}: SearchWithSuggestionsProps) => {
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
        .slice(0, 5);
      setFilteredSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setFilteredSuggestions(suggestions.slice(0, 5));
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
    if (suggestions.length > 0) {
      setFilteredSuggestions(suggestions.slice(0, 5));
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

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] z-10" />
      <input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        value={searchValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        className="w-full h-[36px] pl-10 pr-3 border border-[#D1D5DB] bg-white text-[#374151] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-1 focus:ring-[#6B7280] focus:border-[#6B7280] text-sm"
        style={{
          borderRadius: '0px',
          fontSize: '14px',
          height: '36px'
        }}
      />

      {showSuggestions &&
        filteredSuggestions.length > 0 &&
        createPortal(
          <div
            className="absolute bg-white border border-[#D1D5DB] z-[9999] overflow-hidden"
            style={{
              position: 'absolute',
              top: `${getSuggestionBoxPosition().top + 1}px`,
              left: `${getSuggestionBoxPosition().left}px`,
              width: `${getSuggestionBoxPosition().width}px`,
              borderRadius: '0px',
              boxShadow: '0px 4px 8px rgba(0,0,0,0.1)',
              maxHeight: '160px'
            }}
          >
            {filteredSuggestions.map((suggestion, index) => (
              <div
                key={index}
                onMouseDown={() => handleSuggestionClick(suggestion)}
                className={`px-3 py-2 cursor-pointer text-sm transition-colors ${
                  index === activeSuggestion 
                    ? 'bg-[#F3F4F6] text-[#374151]' 
                    : 'text-[#374151] hover:bg-[#F9FAFB] bg-white'
                }`}
                style={{
                  height: '32px',
                  fontSize: '14px',
                  fontWeight: '400',
                  display: 'flex',
                  alignItems: 'center',
                  paddingLeft: '12px',
                  paddingRight: '12px'
                }}
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

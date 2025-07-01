import React, { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface SearchWithSuggestionsProps {
  placeholder?: string;
  onSearch?: (value: string) => void;
  suggestions?: string[];
  className?: string;
}

export const SearchWithSuggestions = ({
  placeholder = "Search...",
  onSearch,
  suggestions = [],
  className = ""
}: SearchWithSuggestionsProps) => {
  const [searchValue, setSearchValue] = useState('');
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (searchValue.length > 0) {
      const filtered = suggestions
        .filter(suggestion =>
          suggestion.toLowerCase().includes(searchValue.toLowerCase())
        )
        .slice(0, 5); // Limit to 5
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
      setActiveSuggestion(prev =>
        prev < filteredSuggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveSuggestion(prev => (prev > 0 ? prev - 1 : -1));
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
      if (!suggestionsRef.current?.contains(e.relatedTarget as Node)) {
        setShowSuggestions(false);
        setActiveSuggestion(-1);
      }
    }, 150);
  };

  return (
    <div className={`relative ${className}`}>
      {/* Input with Search Icon */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-[#AAB9C5]" />
        <Input
          ref={inputRef}
          type="search"
          placeholder={placeholder}
          value={searchValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          className="peer pl-10 pr-4 py-2 border border-[#AAB9C5] rounded-lg bg-white text-[#1F2937] placeholder:text-[#AAB9C5] focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-transparent"
        />
      </div>

      {/* Suggestion Box */}
      {showSuggestions && filteredSuggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute w-full bg-white border border-[#AAB9C5] rounded-lg shadow-xl z-[9999] mt-1 max-h-48 overflow-y-auto"
        >
          {filteredSuggestions.map((suggestion, index) => (
            <div
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                index === activeSuggestion
                  ? 'bg-[#C72030] text-white'
                  : 'text-gray-700'
              } ${index === 0 ? 'rounded-t-lg' : ''} ${
                index === filteredSuggestions.length - 1
                  ? 'rounded-b-lg'
                  : 'border-b border-gray-100'
              }`}
            >
              {suggestion}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

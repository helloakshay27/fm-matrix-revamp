
import React, { useState, useRef, useEffect } from 'react';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchSuggestion {
  id: string;
  title: string;
  category: string;
  type: 'asset' | 'ticket' | 'user' | 'location' | 'general';
}

interface SearchWithSuggestionsProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  onSuggestionSelect?: (suggestion: SearchSuggestion) => void;
  className?: string;
  suggestions?: SearchSuggestion[];
}

export const SearchWithSuggestions = ({
  placeholder = "Search...",
  onSearch,
  onSuggestionSelect,
  className,
  suggestions = []
}: SearchWithSuggestionsProps) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<SearchSuggestion[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Default suggestions when no search query
  const defaultSuggestions: SearchSuggestion[] = [
    { id: '1', title: 'Assets', category: 'Navigate to', type: 'asset' },
    { id: '2', title: 'Tickets', category: 'Navigate to', type: 'ticket' },
    { id: '3', title: 'Users', category: 'Navigate to', type: 'user' },
    { id: '4', title: 'Locations', category: 'Navigate to', type: 'location' },
    { id: '5', title: 'Dashboard', category: 'Navigate to', type: 'general' },
    { id: '6', title: 'Settings', category: 'Navigate to', type: 'general' },
    { id: '7', title: 'Reports', category: 'Navigate to', type: 'general' },
    { id: '8', title: 'Maintenance', category: 'Navigate to', type: 'general' },
    ...suggestions
  ];

  useEffect(() => {
    if (query.trim()) {
      const filtered = defaultSuggestions.filter(suggestion =>
        suggestion.title.toLowerCase().includes(query.toLowerCase()) ||
        suggestion.category.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredSuggestions(filtered);
    } else {
      setFilteredSuggestions(defaultSuggestions.slice(0, 8));
    }
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setIsOpen(true);
  };

  const handleInputFocus = () => {
    setIsOpen(true);
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setQuery(suggestion.title);
    setIsOpen(false);
    onSuggestionSelect?.(suggestion);
  };

  const handleSearch = () => {
    if (query.trim()) {
      onSearch?.(query);
      setIsOpen(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const getCategoryIcon = (type: string) => {
    switch (type) {
      case 'asset': return '🏢';
      case 'ticket': return '🎫';
      case 'user': return '👤';
      case 'location': return '📍';
      default: return '🔍';
    }
  };

  return (
    <div ref={searchRef} className={cn("relative", className)}>
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
          className="pl-10 pr-4 py-2 border border-[#D5DbDB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-transparent w-full"
        />
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
          {filteredSuggestions.length > 0 ? (
            <div className="py-2">
              {filteredSuggestions.map((suggestion) => (
                <button
                  key={suggestion.id}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none flex items-center gap-3"
                >
                  <span className="text-lg">{getCategoryIcon(suggestion.type)}</span>
                  <div>
                    <div className="text-sm font-medium text-gray-900">{suggestion.title}</div>
                    <div className="text-xs text-gray-500">{suggestion.category}</div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="px-4 py-6 text-sm text-gray-500 text-center">
              No suggestions found
            </div>
          )}
        </div>
      )}
    </div>
  );
};

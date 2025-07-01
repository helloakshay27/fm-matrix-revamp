
import { useMemo } from 'react';

interface UseSearchSuggestionsProps {
  data: any[];
  searchFields: string[];
}

export const useSearchSuggestions = ({ data, searchFields }: UseSearchSuggestionsProps) => {
  const suggestions = useMemo(() => {
    const allValues = new Set<string>();
    
    data.forEach(item => {
      searchFields.forEach(field => {
        const value = item[field];
        if (value && typeof value === 'string' && value.trim()) {
          allValues.add(value.trim());
        }
      });
    });
    
    return Array.from(allValues).sort();
  }, [data, searchFields]);

  return suggestions;
};

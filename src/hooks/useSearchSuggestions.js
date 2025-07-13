
import { useMemo } from 'react';

export const useSearchSuggestions = ({ data, searchFields }) => {
  const suggestions = useMemo(() => {
    const allValues = new Set();
    
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

import React, { useEffect } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// Global theme that adds search functionality to all MUI Select components
const enhancedSelectTheme = createTheme({
  components: {
    MuiSelect: {
      defaultProps: {
        // Add search functionality by default
        MenuProps: {
          disablePortal: true,
          PaperProps: {
            sx: {
              mt: 0.5,
              maxHeight: 200, // Short height
              overflow: 'auto', // Internal scroll
              zIndex: 9999,
              boxShadow: 3,
              '& .MuiMenuItem-root': {
                fontSize: { xs: '14px', md: '16px' },
                padding: { xs: '8px 12px', md: '10px 16px' },
                '&:hover': {
                  backgroundColor: '#f5f5f5',
                },
                '&.Mui-selected': {
                  backgroundColor: '#e3f2fd',
                  '&:hover': {
                    backgroundColor: '#bbdefb',
                  },
                },
              },
            },
          },
        },
      },
      styleOverrides: {
        root: {
          // Short height control
          height: { xs: 36, sm: 40, md: 45 },
          '& .MuiInputBase-input, & .MuiSelect-select': {
            padding: { xs: '8px 12px', sm: '10px 14px', md: '12px 14px' },
          },
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'white',
          },
        },
      },
    },
    MuiFormControl: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            height: { xs: 36, sm: 40, md: 45 },
          },
        },
      },
    },
  },
});

// Global search functionality injector
export const GlobalSelectSearchEnhancer: React.FC = () => {
  useEffect(() => {
    // Function to add search functionality to existing select elements
    const enhanceSelectElements = () => {
      const selectElements = document.querySelectorAll('[role="combobox"][aria-haspopup="listbox"]');
      
      selectElements.forEach((selectElement) => {
        // Check if already enhanced
        if (selectElement.getAttribute('data-search-enhanced') === 'true') return;
        
        // Mark as enhanced
        selectElement.setAttribute('data-search-enhanced', 'true');
        
        // Add search input to the dropdown when it opens
        const observer = new MutationObserver((mutations) => {
          mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
              if (node.nodeType === Node.ELEMENT_NODE) {
                const element = node as Element;
                
                // Check if this is a MUI Select dropdown
                if (element.querySelector('[role="listbox"]') || element.getAttribute('role') === 'listbox') {
                  addSearchToDropdown(element);
                }
              }
            });
          });
        });
        
        observer.observe(document.body, {
          childList: true,
          subtree: true,
        });
        
        // Store observer for cleanup
        (selectElement as any).__searchObserver = observer;
      });
    };
    
    // Function to add search input to dropdown
    const addSearchToDropdown = (dropdownElement: Element) => {
      const listbox = dropdownElement.querySelector('[role="listbox"]') || 
                     (dropdownElement.getAttribute('role') === 'listbox' ? dropdownElement : null);
      
      if (!listbox || listbox.querySelector('.search-input-container')) return;
      
      // Create search input container
      const searchContainer = document.createElement('div');
      searchContainer.className = 'search-input-container';
      searchContainer.style.cssText = `
        position: sticky;
        top: 0;
        z-index: 1;
        background: white;
        padding: 8px 12px;
        border-bottom: 1px solid #e0e0e0;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      `;
      
      // Create search input
      const searchInput = document.createElement('input');
      searchInput.type = 'text';
      searchInput.placeholder = 'Search options...';
      searchInput.style.cssText = `
        width: 100%;
        padding: 8px 12px;
        border: 1px solid #ccc;
        border-radius: 4px;
        font-size: 14px;
        outline: none;
        background: white;
      `;
      
      // Add focus styling
      searchInput.addEventListener('focus', () => {
        searchInput.style.borderColor = '#1976d2';
        searchInput.style.boxShadow = '0 0 0 2px rgba(25, 118, 210, 0.2)';
      });
      
      searchInput.addEventListener('blur', () => {
        searchInput.style.borderColor = '#ccc';
        searchInput.style.boxShadow = 'none';
      });
      
      // Add search functionality
      const allOptions = Array.from(listbox.querySelectorAll('[role="option"]'));
      
      searchInput.addEventListener('input', (e) => {
        const searchTerm = (e.target as HTMLInputElement).value.toLowerCase();
        
        allOptions.forEach((option) => {
          const optionText = option.textContent?.toLowerCase() || '';
          const shouldShow = optionText.includes(searchTerm);
          
          (option as HTMLElement).style.display = shouldShow ? '' : 'none';
        });
        
        // Handle no results
        const visibleOptions = allOptions.filter(option => 
          (option as HTMLElement).style.display !== 'none'
        );
        
        let noResultsElement = listbox.querySelector('.no-results-message');
        
        if (visibleOptions.length === 0 && searchTerm.trim() !== '') {
          if (!noResultsElement) {
            noResultsElement = document.createElement('div');
            noResultsElement.className = 'no-results-message';
            noResultsElement.style.cssText = `
              padding: 16px 12px;
              text-align: center;
              color: #666;
              font-style: italic;
            `;
            noResultsElement.textContent = 'No options found';
            listbox.appendChild(noResultsElement);
          }
          (noResultsElement as HTMLElement).style.display = '';
        } else if (noResultsElement) {
          (noResultsElement as HTMLElement).style.display = 'none';
        }
      });
      
      // Handle keyboard navigation
      searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          const firstVisibleOption = allOptions.find(option => 
            (option as HTMLElement).style.display !== 'none'
          ) as HTMLElement;
          if (firstVisibleOption) {
            firstVisibleOption.focus();
          }
        } else if (e.key === 'Escape') {
          // Close dropdown
          const backdrop = document.querySelector('.MuiModal-backdrop, .MuiPopover-root .MuiBackdrop-root');
          if (backdrop) {
            (backdrop as HTMLElement).click();
          }
        }
      });
      
      searchContainer.appendChild(searchInput);
      listbox.insertBefore(searchContainer, listbox.firstChild);
      
      // Auto-focus search input
      setTimeout(() => {
        searchInput.focus();
      }, 100);
    };
    
    // Initial enhancement
    enhanceSelectElements();
    
    // Re-enhance when new elements are added
    const globalObserver = new MutationObserver(() => {
      enhanceSelectElements();
    });
    
    globalObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });
    
    return () => {
      globalObserver.disconnect();
      
      // Clean up individual observers
      const enhancedSelects = document.querySelectorAll('[data-search-enhanced="true"]');
      enhancedSelects.forEach((select) => {
        const observer = (select as any).__searchObserver;
        if (observer) {
          observer.disconnect();
        }
      });
    };
  }, []);
  
  return null; // This component doesn't render anything
};

// Theme provider wrapper
export const EnhancedSelectThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ThemeProvider theme={enhancedSelectTheme}>
      <GlobalSelectSearchEnhancer />
      {children}
    </ThemeProvider>
  );
};

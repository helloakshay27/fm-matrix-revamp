// Global MUI Select Search Enhancer
// Provides smooth search functionality for all MUI Select dropdowns

const enhancedDropdowns = new WeakSet();
let globalCleanupInterval: NodeJS.Timeout;

export const initializeGlobalMUISelectSearchEnhancer = () => {
  console.log('🚀 Initializing Global MUI Select Search Enhancer');
  
  // Global cleanup to remove duplicate search inputs
  const removeAllExistingSearchInputs = () => {
    const existingSearchInputs = document.querySelectorAll(
      '.mui-search-input, .search-input-container, [data-search-input="true"], [data-search-container="true"]'
    );
    existingSearchInputs.forEach(input => input.remove());
  };
  
  // Run cleanup immediately and periodically
  removeAllExistingSearchInputs();
  
  // Clear any existing cleanup interval
  if (globalCleanupInterval) {
    clearInterval(globalCleanupInterval);
  }
  
  // Set up periodic cleanup to prevent duplicates
  globalCleanupInterval = setInterval(() => {
    const duplicateSearchInputs = document.querySelectorAll('.mui-search-input');
    if (duplicateSearchInputs.length > 1) {
      console.log('🧹 Removing duplicate search inputs');
      // Keep only the first one, remove the rest
      for (let i = 1; i < duplicateSearchInputs.length; i++) {
        duplicateSearchInputs[i].closest('.mui-search-container')?.remove();
      }
    }
  }, 1000);
  
  // Add search functionality to a dropdown
  const addSearchToDropdown = (dropdown: Element) => {
    // Prevent multiple enhancements on same dropdown
    if (enhancedDropdowns.has(dropdown)) {
      return;
    }
    
    enhancedDropdowns.add(dropdown);
    
    // Find the listbox (where options are)
    const listbox = dropdown.querySelector('[role="listbox"]');
    if (!listbox) {
      return;
    }
    
    // Skip if this is an Autocomplete component (already has search)
    if (dropdown.closest('.MuiAutocomplete-root')) {
      return;
    }
    
    // Skip if search input already exists
    if (listbox.querySelector('.mui-search-input')) {
      return;
    }
    
  // Get initial option elements
  let allOptions = Array.from(listbox.querySelectorAll('[role="option"]'));
  if (allOptions.length === 0) {
      return;
    }
    
    // Create search container with beautiful styling
    const searchContainer = document.createElement('div');
    searchContainer.className = 'mui-search-container';
    searchContainer.setAttribute('data-search-container', 'true');
    
    // Create search input with enhanced design
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = '🔍 Type to search...';
    searchInput.className = 'mui-search-input';
    searchInput.setAttribute('data-search-input', 'true');
    
    // Focus tracking for perfect focus management
    let isSearchFocused = false;
    
    // Enhanced focus handlers
    searchInput.addEventListener('focus', (e) => {
      e.stopImmediatePropagation();
      isSearchFocused = true;
    });
    
    searchInput.addEventListener('blur', (e) => {
      e.stopImmediatePropagation();
      // Only blur if clicking completely outside dropdown
      setTimeout(() => {
        const activeElement = document.activeElement;
        const isClickingInDropdown = dropdown.contains(activeElement) || 
                                   activeElement?.closest('[role="option"]');
        if (!isClickingInDropdown) {
          isSearchFocused = false;
        }
      }, 0);
    });
    
    // Smooth filtering with requestAnimationFrame
    const performSearch = () => {
      const searchTerm = searchInput.value.toLowerCase().trim();
      // Re-evaluate options each time so newly fetched items are included
      allOptions = Array.from(listbox.querySelectorAll('[role="option"]'));
      requestAnimationFrame(() => {
        allOptions.forEach((option) => {
          const optionText = (option.textContent || '').toLowerCase();
          const matches = searchTerm === '' || optionText.includes(searchTerm);
          (option as HTMLElement).style.display = matches ? '' : 'none';
        });
      });
      // Emit global event so pages can trigger server-side search
      document.dispatchEvent(new CustomEvent('muiSelectSearch', { detail: { dropdown, searchTerm } }));
    };
    
    // Maintain focus while typing
    searchInput.addEventListener('keydown', (e: KeyboardEvent) => {
      e.stopImmediatePropagation();
      
      // Ensure focus stays on search
      if (!isSearchFocused) {
        setTimeout(() => searchInput.focus(), 0);
      }
    });
    
    // Single optimized input handler
    searchInput.addEventListener('input', (e) => {
      e.stopImmediatePropagation();
      performSearch();
    });
    
    // Prevent any interference with search input
    searchInput.addEventListener('mousedown', (e) => {
      e.stopImmediatePropagation();
    });
    
    searchInput.addEventListener('click', (e) => {
      e.stopImmediatePropagation();
      // Ensure focus stays on search
      if (!isSearchFocused) {
        searchInput.focus();
      }
    });
    
    // Enhanced keyboard navigation
    searchInput.addEventListener('keydown', (e: KeyboardEvent) => {
      e.stopImmediatePropagation();
      
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const visibleOptions = allOptions.filter(option => 
          (option as HTMLElement).style.display !== 'none'
        );
        if (visibleOptions.length > 0) {
          (visibleOptions[0] as HTMLElement).focus();
          (visibleOptions[0] as HTMLElement).scrollIntoView({ block: 'nearest' });
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const visibleOptions = allOptions.filter(option => 
          (option as HTMLElement).style.display !== 'none'
        );
        if (visibleOptions.length > 0) {
          const lastOption = visibleOptions[visibleOptions.length - 1] as HTMLElement;
          lastOption.focus();
          lastOption.scrollIntoView({ block: 'nearest' });
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        // Close dropdown
        const backdrop = document.querySelector('.MuiModal-backdrop, .MuiBackdrop-root');
        if (backdrop) {
          (backdrop as HTMLElement).click();
        }
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const visibleOptions = allOptions.filter(option => 
          (option as HTMLElement).style.display !== 'none'
        );
        if (visibleOptions.length > 0) {
          (visibleOptions[0] as HTMLElement).click();
        }
      }
      // For all other keys, let them through for normal typing
    });
    
    // Add keyboard navigation back to search from options
    allOptions.forEach((option) => {
      option.addEventListener('keydown', (e: KeyboardEvent) => {
        if (e.key === 'ArrowUp' && option === allOptions.find(opt => 
          (opt as HTMLElement).style.display !== 'none'
        )) {
          e.preventDefault();
          searchInput.focus();
        }
      });
    });
    
    // Add search to dropdown
    searchContainer.appendChild(searchInput);
    listbox.insertBefore(searchContainer, listbox.firstChild);
    
    // Perfect auto-focus with timing
    const attemptFocus = (retries = 3) => {
      try {
        searchInput.focus();
        if (document.activeElement === searchInput) {
          isSearchFocused = true;
          console.log(`✅ Search input focused successfully`);
        } else if (retries > 0) {
          setTimeout(() => attemptFocus(retries - 1), 50);
        }
      } catch (error) {
        if (retries > 0) {
          setTimeout(() => attemptFocus(retries - 1), 50);
        }
      }
    };
    
    // Focus with a slight delay to ensure DOM is ready
    setTimeout(() => attemptFocus(), 100);
    
    console.log(`🔍 Added search functionality to dropdown with ${allOptions.length} options`);
  };
  
  // Create a MutationObserver to watch for new dropdowns
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          const element = node as Element;
          
          // Check if the added element is a dropdown
          if (element.matches('.MuiMenu-paper, .MuiPaper-root')) {
            // Skip Autocomplete components
            if (!element.closest('.MuiAutocomplete-root')) {
              addSearchToDropdown(element);
            }
          }
          
          // Also check any child dropdowns
          const childDropdowns = element.querySelectorAll('.MuiMenu-paper, .MuiPaper-root');
          childDropdowns.forEach(dropdown => {
            if (!dropdown.closest('.MuiAutocomplete-root')) {
              addSearchToDropdown(dropdown);
            }
          });
        }
      });
    });
  });
  
  // Start observing
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
  
  // Also check for any existing dropdowns
  const existingDropdowns = document.querySelectorAll(
    '.MuiMenu-paper, .MuiPaper-root'
  );
  existingDropdowns.forEach(dropdown => {
    if (!dropdown.closest('.MuiAutocomplete-root')) {
      addSearchToDropdown(dropdown);
    }
  });
  
  console.log('✅ Global MUI Select Search Enhancer initialized');
  
  return () => {
    observer.disconnect();
    if (globalCleanupInterval) {
      clearInterval(globalCleanupInterval);
    }
    console.log('🔌 Global MUI Select Search Enhancer disconnected');
  };
};

// Auto-initialize if not in a module context
if (typeof module === 'undefined' || !module.exports) {
  document.addEventListener('DOMContentLoaded', initializeGlobalMUISelectSearchEnhancer);
}

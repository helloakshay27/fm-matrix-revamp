// Global MUI Select Search Enhancement - Auto-activates on all existing selects
console.log('🔍 Loading Global MUI Select Search Enhancement...');

// Global flag to prevent multiple instances
if ((window as any).__muiSelectSearchEnhanced) {
  console.log('⚠️ MUI Select Search Enhancement already loaded, skipping...');
} else {
  (window as any).__muiSelectSearchEnhanced = true;
  
  // Enhanced search functionality for MUI Select dropdowns
  let searchEnhancementActive = false;
  let enhancementCallCount = 0;

const enhanceAllMUISelects = () => {
  if (searchEnhancementActive) return;
  searchEnhancementActive = true;
  
  console.log('🎯 Activating search enhancement for all MUI Select components...');
  
  // Global counter to limit enhancements (for debugging)
  let totalEnhancements = 0;
  const MAX_ENHANCEMENTS = 1; // Temporarily limit to 1 to test
  
  // Global cleanup function to remove ALL search inputs
  const globalCleanup = () => {
    const allSearchContainers = document.querySelectorAll('.mui-search-input-container, [data-search-container="true"]');
    const allSearchInputs = document.querySelectorAll('.mui-search-input, [data-search-input="true"]');
    
    console.log(`🧹 Global cleanup: Removing ${allSearchContainers.length} containers and ${allSearchInputs.length} inputs`);
    
    allSearchContainers.forEach(container => container.remove());
    allSearchInputs.forEach(input => input.remove());
    
    // Reset all enhancement flags
    const allListboxes = document.querySelectorAll('[role="listbox"]');
    allListboxes.forEach(listbox => listbox.removeAttribute('data-search-enhanced'));
  };
  
  // Run global cleanup first
  globalCleanup();
  
  // Function to add search to a specific dropdown
  const addSearchToDropdown = (dropdownElement: Element) => {
    enhancementCallCount++;
    console.log(`🔢 Enhancement call #${enhancementCallCount} for:`, dropdownElement);
    
    // Temporary limit for debugging
    if (totalEnhancements >= MAX_ENHANCEMENTS) {
      console.log('🚫 Maximum enhancements reached, skipping...');
      return;
    }
    
    const listbox = dropdownElement.querySelector('[role="listbox"]') || 
                   (dropdownElement.getAttribute('role') === 'listbox' ? dropdownElement : null);
    
    if (!listbox) return;
    
    // Skip if this is an Autocomplete component (already has search)
    const isAutocomplete = 
      dropdownElement.closest('.MuiAutocomplete-root') ||
      dropdownElement.querySelector('.MuiAutocomplete-input') ||
      dropdownElement.querySelector('.MuiAutocomplete-listbox') ||
      listbox.closest('.MuiAutocomplete-listbox') ||
      listbox.classList.contains('MuiAutocomplete-listbox') ||
      listbox.closest('.MuiAutocomplete-popper') ||
      dropdownElement.classList.contains('MuiAutocomplete-popper') ||
      dropdownElement.querySelector('.MuiChip-root'); // Autocomplete often has chips
    
    if (isAutocomplete) {
      console.log('⏭️ Skipping Autocomplete component (already has search)');
      return;
    }
    
    // ENHANCED CHECK: Look for ANY search input in the entire dropdown area
    const anySearchInput = 
      dropdownElement.querySelector('input[placeholder*="Search"], input[placeholder*="search"]') ||
      dropdownElement.querySelector('.mui-search-input') ||
      dropdownElement.querySelector('[data-search-input="true"]') ||
      listbox.querySelector('input[type="text"]') ||
      listbox.querySelector('.mui-search-input') ||
      listbox.querySelector('[data-search-input="true"]');
    
    if (anySearchInput) {
      console.log('⚠️ Search input already exists, skipping...', anySearchInput);
      return;
    }
    
    // Check if already enhanced
    if (listbox.hasAttribute('data-search-enhanced')) {
      console.log('⚠️ Dropdown already enhanced, skipping...');
      return;
    }
    
    // Mark as enhanced to prevent duplicates
    listbox.setAttribute('data-search-enhanced', 'true');
    dropdownElement.setAttribute('data-dropdown-enhanced', 'true');
    
    console.log('📝 Adding search to dropdown:', listbox);
    
    // Create search input container
    const searchContainer = document.createElement('div');
    searchContainer.className = 'mui-search-input-container';
    searchContainer.setAttribute('data-search-container', 'true');
    searchContainer.setAttribute('data-search-id', `search-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
    searchContainer.style.cssText = `
      position: sticky;
      top: 0;
      z-index: 999;
      background: white;
      padding: 12px;
      border-bottom: 1px solid #e0e0e0;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      margin: 0;
    `;
    
    // Create search input
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = '🔍 Search options...';
    searchInput.className = 'mui-search-input';
    searchInput.setAttribute('data-search-input', 'true');
    searchInput.setAttribute('data-input-id', `input-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
    console.log('🔧 Creating search input with ID:', searchInput.getAttribute('data-input-id'));
    searchInput.style.cssText = `
      width: 100% !important;
      padding: 10px 12px !important;
      border: 1px solid #ddd !important;
      border-radius: 6px !important;
      font-size: 14px !important;
      outline: none !important;
      background: white !important;
      font-family: inherit !important;
      box-sizing: border-box !important;
      transition: all 0.2s ease !important;
      color: #333 !important;
      line-height: 1.4 !important;
      cursor: text !important;
      user-select: text !important;
      pointer-events: auto !important;
      z-index: 1000 !important;
      position: relative !important;
    `;
    
    // Enhanced focus styling and event handling
    const updateInputStyle = (focused: boolean) => {
      if (focused) {
        searchInput.style.borderColor = '#1976d2';
        searchInput.style.boxShadow = '0 0 0 3px rgba(25, 118, 210, 0.1)';
        searchInput.style.backgroundColor = '#fafafa';
      } else {
        searchInput.style.borderColor = '#ddd';
        searchInput.style.boxShadow = 'none';
        searchInput.style.backgroundColor = 'white';
      }
    };
    
    // Force focus and ensure input events work
    searchInput.addEventListener('focus', (e) => {
      console.log('🎯 Search input focused');
      updateInputStyle(true);
      e.stopPropagation();
    });
    
    searchInput.addEventListener('blur', (e) => {
      console.log('😴 Search input blurred');
      updateInputStyle(false);
      e.stopPropagation();
    });
    
    // Enhanced input handling with multiple event types
    const handleSearchInput = (e: Event) => {
      const target = e.target as HTMLInputElement;
      const searchTerm = target.value.toLowerCase().trim();
      console.log('⌨️ Search input changed:', searchTerm);
      
      let visibleCount = 0;
      
      allOptions.forEach((option, index) => {
        const optionText = option.textContent?.toLowerCase() || '';
        const shouldShow = searchTerm === '' || optionText.includes(searchTerm);
        
        if (shouldShow) {
          (option as HTMLElement).style.display = '';
          visibleCount++;
        } else {
          (option as HTMLElement).style.display = 'none';
        }
      });
      
      // Handle no results message
      let noResultsElement = listbox.querySelector('.mui-no-results-message');
      
      if (visibleCount === 0 && searchTerm !== '') {
        if (!noResultsElement) {
          noResultsElement = document.createElement('div');
          noResultsElement.className = 'mui-no-results-message';
          (noResultsElement as HTMLElement).style.cssText = `
            padding: 20px 12px;
            text-align: center;
            color: #666;
            font-style: italic;
            background: #f9f9f9;
            border-radius: 4px;
            margin: 8px;
          `;
          noResultsElement.innerHTML = `
            <div style="font-size: 16px; margin-bottom: 4px;">🔍</div>
            <div>No options found for "${searchTerm}"</div>
            <div style="font-size: 12px; margin-top: 4px; color: #999;">Try different keywords</div>
          `;
          listbox.appendChild(noResultsElement);
        }
        (noResultsElement as HTMLElement).style.display = '';
      } else if (noResultsElement) {
        (noResultsElement as HTMLElement).style.display = 'none';
      }
      
      console.log(`🔍 Search "${searchTerm}": ${visibleCount}/${allOptions.length} results`);
    };
    
    // Get all menu items
    const allOptions = Array.from(listbox.querySelectorAll('[role="option"]'));
    console.log(`📋 Found ${allOptions.length} options to search through`);
    
    // Multiple event listeners to ensure input is captured
    searchInput.addEventListener('input', handleSearchInput);
    searchInput.addEventListener('keyup', handleSearchInput);
    searchInput.addEventListener('paste', (e) => {
      setTimeout(() => handleSearchInput(e), 10); // Small delay for paste to complete
    });
    
    // Prevent event bubbling that might interfere with search
    searchInput.addEventListener('click', (e) => {
      e.stopPropagation();
      console.log('�️ Search input clicked');
    });
    
    searchInput.addEventListener('mousedown', (e) => {
      e.stopPropagation();
    });
    
    // Keyboard navigation
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const firstVisibleOption = allOptions.find(option => 
          (option as HTMLElement).style.display !== 'none'
        ) as HTMLElement;
        if (firstVisibleOption) {
          firstVisibleOption.focus();
          firstVisibleOption.scrollIntoView({ block: 'nearest' });
        }
      } else if (e.key === 'Escape') {
        // Close dropdown
        const closeButton = document.querySelector('[data-testid="CloseIcon"]') ||
                          document.querySelector('.MuiBackdrop-root') ||
                          document.querySelector('[role="presentation"]');
        if (closeButton) {
          (closeButton as HTMLElement).click();
        }
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const firstVisibleOption = allOptions.find(option => 
          (option as HTMLElement).style.display !== 'none'
        ) as HTMLElement;
        if (firstVisibleOption) {
          firstVisibleOption.click();
        }
      }
    });
    
    searchContainer.appendChild(searchInput);
    listbox.insertBefore(searchContainer, listbox.firstChild);
    
    // Verify single search input
    const totalSearchInputs = document.querySelectorAll('.mui-search-input').length;
    console.log(`✅ Search functionality added. Total search inputs in page: ${totalSearchInputs}`);
    
    // Auto-focus search input with multiple attempts to ensure it works
    const focusSearchInput = () => {
      try {
        searchInput.focus();
        searchInput.select();
        console.log('🎯 Search input focused and selected');
        
        // Verify focus
        if (document.activeElement === searchInput) {
          console.log('✅ Focus confirmed on search input');
        } else {
          console.log('⚠️ Focus failed, active element:', document.activeElement);
          // Try again
          setTimeout(() => {
            searchInput.focus();
            console.log('🔄 Retry focus attempt');
          }, 50);
        }
      } catch (error) {
        console.error('❌ Error focusing search input:', error);
      }
    };
    
    // Test input functionality
    setTimeout(() => {
      console.log('🧪 Testing search input functionality...');
      searchInput.value = 'test';
      searchInput.dispatchEvent(new Event('input', { bubbles: true }));
      console.log('🧪 Test input added and event fired');
      
      // Clear test input after 1 second
      setTimeout(() => {
        searchInput.value = '';
        searchInput.dispatchEvent(new Event('input', { bubbles: true }));
        searchInput.focus();
        console.log('🧪 Test input cleared');
      }, 1000);
    }, 500);
    
    // Multiple timing attempts to ensure focus works
    setTimeout(focusSearchInput, 100);
    setTimeout(focusSearchInput, 200);
    setTimeout(focusSearchInput, 300);
    
    // Increment counter after successful enhancement
    totalEnhancements++;
    console.log(`✅ Enhancement completed. Total: ${totalEnhancements}/${MAX_ENHANCEMENTS}`);
  };
  
  // Enhanced MutationObserver to catch all dropdown openings with debouncing
  let debounceTimer: NodeJS.Timeout;
  const pendingDropdowns = new Set<Element>();
  
  const processPendingDropdowns = () => {
    console.log(`🔄 Processing ${pendingDropdowns.size} pending dropdowns`);
    pendingDropdowns.forEach(dropdown => {
      addSearchToDropdown(dropdown);
    });
    pendingDropdowns.clear();
  };
  
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          const element = node as Element;
          
          // Check for MUI Select dropdown patterns (but NOT Autocomplete)
          const isAutocomplete = 
            element.closest('.MuiAutocomplete-root') ||
            element.querySelector('.MuiAutocomplete-input') ||
            element.querySelector('.MuiAutocomplete-listbox') ||
            element.classList.contains('MuiAutocomplete-listbox') ||
            element.classList.contains('MuiAutocomplete-popper') ||
            element.querySelector('.MuiChip-root');
            
          const isDropdown = 
            !isAutocomplete && 
            !element.hasAttribute('data-dropdown-enhanced') && (
              element.querySelector('[role="listbox"]') ||
              element.getAttribute('role') === 'listbox' ||
              element.classList.contains('MuiMenu-root') ||
              element.classList.contains('MuiPopover-root') ||
              element.querySelector('.MuiMenuItem-root')
            );
          
          if (isDropdown) {
            console.log('🎯 Detected new MUI dropdown:', element);
            console.log('🔍 Current pending dropdowns:', pendingDropdowns.size);
            console.log('🔍 Total enhancements so far:', totalEnhancements);
            pendingDropdowns.add(element);
            
            // Debounce processing
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(processPendingDropdowns, 100);
          }
        }
      });
    });
  });
  
  // Start observing
  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
  
  console.log('👀 MutationObserver activated - watching for new MUI Select dropdowns');
  
  // Also check for existing dropdowns
  const existingDropdowns = document.querySelectorAll('[role="listbox"], .MuiMenu-root, .MuiPopover-root');
  existingDropdowns.forEach(dropdown => {
    console.log('🔄 Enhancing existing dropdown:', dropdown);
    addSearchToDropdown(dropdown);
  });
  
  // Cleanup function (optional)
  (window as any).__muiSelectSearchCleanup = () => {
    observer.disconnect();
    globalCleanup();
    console.log('🧹 MUI Select search enhancement cleaned up');
  };
};

// Auto-activate when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', enhanceAllMUISelects);
} else {
  enhanceAllMUISelects();
}

// Also activate after a short delay to catch dynamically loaded components
setTimeout(enhanceAllMUISelects, 1000);

console.log('🚀 Global MUI Select Search Enhancement loaded and ready!');

} // End of if-else block

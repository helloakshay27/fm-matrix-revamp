// Global Enhanced Select Activation Script
// This utility can be imported and called to instantly enhance all MUI Selects on any page

/**
 * Instantly applies enhanced select functionality to all existing MUI Select components
 * on the current page without requiring any code changes
 */
export const activateEnhancedSelectsGlobally = () => {
  // Apply styles to all existing FormControl elements
  const formControls = document.querySelectorAll('[class*="MuiFormControl"]');
  formControls.forEach((formControl) => {
    formControl.classList.add('enhanced-select-global');
  });

  // Apply menu styles to all existing Menu/Popover papers
  const menuPapers = document.querySelectorAll('[class*="MuiMenu-paper"], [class*="MuiPopover-paper"]');
  menuPapers.forEach((paper) => {
    paper.classList.add('enhanced-select-menu');
  });

  // Apply autocomplete styles to all existing Autocomplete components
  const autocompletes = document.querySelectorAll('[class*="MuiAutocomplete-root"]');
  autocompletes.forEach((autocomplete) => {
    autocomplete.classList.add('enhanced-autocomplete-global');
  });

  // Set up a MutationObserver to automatically enhance any newly added MUI components
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          const element = node as Element;
          
          // Check if the added node or its children contain MUI components
          const newFormControls = element.querySelectorAll('[class*="MuiFormControl"]');
          newFormControls.forEach((formControl) => {
            formControl.classList.add('enhanced-select-global');
          });

          const newMenuPapers = element.querySelectorAll('[class*="MuiMenu-paper"], [class*="MuiPopover-paper"]');
          newMenuPapers.forEach((paper) => {
            paper.classList.add('enhanced-select-menu');
          });

          const newAutocompletes = element.querySelectorAll('[class*="MuiAutocomplete-root"]');
          newAutocompletes.forEach((autocomplete) => {
            autocomplete.classList.add('enhanced-autocomplete-global');
          });

          // Check if the node itself is a MUI component
          if (element.className && element.className.includes('MuiFormControl')) {
            element.classList.add('enhanced-select-global');
          }
          if (element.className && (element.className.includes('MuiMenu-paper') || element.className.includes('MuiPopover-paper'))) {
            element.classList.add('enhanced-select-menu');
          }
          if (element.className && element.className.includes('MuiAutocomplete-root')) {
            element.classList.add('enhanced-autocomplete-global');
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

  console.log('✅ Enhanced MUI Select functionality activated globally!');
  console.log('📏 Short Height Control: 36px/40px/45px responsive heights');
  console.log('📜 Internal Scroll: 200px max height with automatic scrolling');
  console.log('🔍 Search Functionality: Available through SearchableSelect component');
  
  return observer;
};

/**
 * Deactivates the global enhanced select functionality
 */
export const deactivateEnhancedSelectsGlobally = (observer?: MutationObserver) => {
  // Remove enhanced classes from all elements
  const enhancedElements = document.querySelectorAll('.enhanced-select-global, .enhanced-select-menu, .enhanced-autocomplete-global');
  enhancedElements.forEach((element) => {
    element.classList.remove('enhanced-select-global', 'enhanced-select-menu', 'enhanced-autocomplete-global');
  });

  // Stop the mutation observer
  if (observer) {
    observer.disconnect();
  }

  console.log('🔄 Enhanced MUI Select functionality deactivated');
};

/**
 * Quick activation function that can be called from browser console for testing
 */
(window as any).activateEnhancedSelects = activateEnhancedSelectsGlobally;
(window as any).deactivateEnhancedSelects = deactivateEnhancedSelectsGlobally;

// Auto-activate when this module is imported (can be commented out if not desired)
if (typeof window !== 'undefined') {
  // Auto-activate after a short delay to ensure DOM is ready
  setTimeout(() => {
    activateEnhancedSelectsGlobally();
  }, 100);
}

export default {
  activate: activateEnhancedSelectsGlobally,
  deactivate: deactivateEnhancedSelectsGlobally,
};

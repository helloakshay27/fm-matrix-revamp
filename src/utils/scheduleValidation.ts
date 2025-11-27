import { fetchCustomForms } from '@/services/customFormsAPI';
import { toast } from 'sonner';

/**
 * Validates if an activity name already exists in the system
 * @param activityName - The activity name to validate
 * @param excludeId - ID to exclude from validation (for edit mode)
 * @returns Promise<boolean> - true if name is available, false if duplicate
 */
export const validateActivityName = async (
  activityName: string,
  excludeId?: string | number
): Promise<boolean> => {
  if (!activityName || !activityName.trim()) {
    toast.error('Activity name is required');
    return false;
  }

  try {
    // Fetch all custom forms to check for duplicates
    const response = await fetchCustomForms();
    
    if (!response?.custom_forms) {
      // If no forms exist, the name is available
      return true;
    }

    // Check for exact match (case-insensitive)
    const normalizedActivityName = activityName.trim().toLowerCase();
    
    const duplicateExists = response.custom_forms.some(form => {
      // Exclude the current form if in edit mode
      if (excludeId && (form.id.toString() === excludeId.toString() || form.custom_form_code === excludeId)) {
        return false;
      }
      
      return form.form_name?.trim().toLowerCase() === normalizedActivityName;
    });

    if (duplicateExists) {
      // Don't show toast here - let the UI handle the error display
      return false;
    }

    // Name is available
    return true;
  } catch (error) {
    console.error('Error validating activity name:', error);
    // Don't show toast here - let the UI handle the error display
    return false;
  }
};

/**
 * Debounced version of activity name validation for real-time checking
 * @param activityName - The activity name to validate
 * @param excludeId - ID to exclude from validation (for edit mode)
 * @param delay - Delay in milliseconds (default: 500ms)
 * @returns Promise<boolean> - true if name is available, false if duplicate
 */
export const validateActivityNameDebounced = (() => {
  let timeoutId: NodeJS.Timeout;
  
  return (
    activityName: string,
    excludeId?: string | number,
    delay: number = 500
  ): Promise<boolean> => {
    return new Promise((resolve) => {
      clearTimeout(timeoutId);
      
      timeoutId = setTimeout(async () => {
        const isValid = await validateActivityName(activityName, excludeId);
        resolve(isValid);
      }, delay);
    });
  };
})();

/**
 * Shows a success message when activity name is available
 * @param activityName - The validated activity name
 */
export const showActivityNameAvailable = (activityName: string) => {
  toast.success(`Activity name "${activityName}" is available!`, {
    duration: 3000,
    position: 'top-center',
    style: {
      background: '#dcfce7',
      border: '1px solid #bbf7d0',
      color: '#166534',
    },
  });
};
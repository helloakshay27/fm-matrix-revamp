import { useState, useEffect, useCallback } from 'react';
import { dashboardConfigService, DashboardConfigPayload, ConfigSection, ConfigItem } from '@/services/dashboardConfigService';
import { toast } from 'sonner';

export interface UseDashboardConfigReturn {
  config: DashboardConfigPayload | null;
  loading: boolean;
  error: string | null;
  saveConfiguration: (config: DashboardConfigPayload) => Promise<boolean>;
  resetToDefault: () => Promise<void>;
  toggleItemVisibility: (sectionName: string, itemName: string) => void;
  toggleSectionVisibility: (sectionName: string, isVisible: boolean) => void;
  getVisibleItemsForSection: (sectionName: string) => ConfigItem[];
  isItemVisible: (sectionName: string, itemName: string) => boolean;
  refreshConfiguration: () => Promise<void>;
}

/**
 * Custom hook for managing dashboard configuration
 * Handles loading, saving, and updating configuration state
 */
export const useDashboardConfig = (): UseDashboardConfigReturn => {
  const [config, setConfig] = useState<DashboardConfigPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Load configuration from API or localStorage
   */
  const loadConfiguration = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Try to load from API first
      const apiConfig = await dashboardConfigService.getDashboardConfig();
      setConfig(apiConfig);
    } catch (apiError) {
      console.warn('Failed to load configuration from API, falling back to localStorage');
      
      // Fallback to localStorage
      const savedConfig = localStorage.getItem('dashboardConfiguration');
      if (savedConfig) {
        try {
          const parsedConfig = JSON.parse(savedConfig);
          if (dashboardConfigService.validateConfiguration(parsedConfig)) {
            setConfig(parsedConfig);
          } else {
            throw new Error('Invalid configuration format');
          }
        } catch (parseError) {
          console.error('Error parsing saved configuration:', parseError);
          setError('Failed to parse saved configuration');
          setConfig(dashboardConfigService.getDefaultConfiguration());
        }
      } else {
        // Use default configuration
        setConfig(dashboardConfigService.getDefaultConfiguration());
      }
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Save configuration to API and localStorage
   */
  const saveConfiguration = useCallback(async (newConfig: DashboardConfigPayload): Promise<boolean> => {
    if (!dashboardConfigService.validateConfiguration(newConfig)) {
      setError('Invalid configuration format');
      return false;
    }

    try {
      // Save to API
      const success = await dashboardConfigService.saveDashboardConfig(newConfig);
      
      if (success) {
        // Also save to localStorage as backup
        localStorage.setItem('dashboardConfiguration', JSON.stringify(newConfig));
        setConfig(newConfig);
        setError(null);
        return true;
      } else {
        // If API fails, still save to localStorage
        localStorage.setItem('dashboardConfiguration', JSON.stringify(newConfig));
        setConfig(newConfig);
        setError('Configuration saved locally only');
        return false;
      }
    } catch (saveError) {
      console.error('Error saving configuration:', saveError);
      
      // Fallback to localStorage
      localStorage.setItem('dashboardConfiguration', JSON.stringify(newConfig));
      setConfig(newConfig);
      setError('Configuration saved locally only');
      return false;
    }
  }, []);

  /**
   * Reset configuration to defaults
   */
  const resetToDefault = useCallback(async (): Promise<void> => {
    try {
      const defaultConfig = await dashboardConfigService.resetToDefaultConfig();
      setConfig(defaultConfig);
      setError(null);
    } catch (resetError) {
      console.error('Error resetting configuration:', resetError);
      const defaultConfig = dashboardConfigService.getDefaultConfiguration();
      setConfig(defaultConfig);
      setError('Reset to local defaults only');
    }
  }, []);

  /**
   * Toggle visibility of a specific item
   */
  const toggleItemVisibility = useCallback((sectionName: string, itemName: string) => {
    if (!config) return;

    const newConfig = {
      ...config,
      sections: config.sections.map(section =>
        section.name === sectionName
          ? {
              ...section,
              items: section.items.map(item =>
                item.name === itemName
                  ? { ...item, isVisible: !item.isVisible }
                  : item
              )
            }
          : section
      )
    };

    setConfig(newConfig);
  }, [config]);

  /**
   * Toggle visibility of all items in a section
   */
  const toggleSectionVisibility = useCallback((sectionName: string, isVisible: boolean) => {
    if (!config) return;

    const newConfig = {
      ...config,
      sections: config.sections.map(section =>
        section.name === sectionName
          ? {
              ...section,
              items: section.items.map(item => ({ ...item, isVisible }))
            }
          : section
      )
    };

    setConfig(newConfig);
  }, [config]);

  /**
   * Get visible items for a specific section
   */
  const getVisibleItemsForSection = useCallback((sectionName: string): ConfigItem[] => {
    if (!config) return [];
    
    return dashboardConfigService.getVisibleItemsForSection(config, sectionName);
  }, [config]);

  /**
   * Check if a specific item is visible
   */
  const isItemVisible = useCallback((sectionName: string, itemName: string): boolean => {
    if (!config) return false;

    const section = config.sections.find(s => s.name === sectionName);
    if (!section) return false;

    const item = section.items.find(i => i.name === itemName);
    return item ? item.isVisible : false;
  }, [config]);

  /**
   * Refresh configuration from the server
   */
  const refreshConfiguration = useCallback(async (): Promise<void> => {
    await loadConfiguration();
  }, [loadConfiguration]);

  // Load configuration on hook initialization
  useEffect(() => {
    loadConfiguration();
  }, [loadConfiguration]);

  return {
    config,
    loading,
    error,
    saveConfiguration,
    resetToDefault,
    toggleItemVisibility,
    toggleSectionVisibility,
    getVisibleItemsForSection,
    isItemVisible,
    refreshConfiguration,
  };
};

export default useDashboardConfig;

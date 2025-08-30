export interface LayoutConfig {
  sidebarComponent: 'default' | 'oman' | 'vi' | 'static';
  headerComponent: 'default' | 'oman' | 'vi' | 'static';
  theme?: {
    primaryColor?: string;
    backgroundColor?: string;
    headerColor?: string;
  };
  features?: {
    enableAdvancedFeatures?: boolean;
    enableBetaFeatures?: boolean;
    customModules?: string[];
  };
}

export const COMPANY_LAYOUTS: Record<number, LayoutConfig> = {
  111: { 
    // Default layout for Company ID 111 (Lockated HO)
    sidebarComponent: 'default',
    headerComponent: 'default',
    theme: {
      primaryColor: '#C72030',
      backgroundColor: '#fafafa',
      headerColor: '#ffffff'
    },
    features: {
      enableAdvancedFeatures: true,
      enableBetaFeatures: false,
      customModules: ['maintenance', 'safety', 'finance', 'crm', 'utility', 'security', 'transitioning']
    }
  },
  193: { 
    // Static layout for Company ID 193 (Panchshil)
    sidebarComponent: 'static',
    headerComponent: 'static',
    theme: {
      primaryColor: '#C72030',
      backgroundColor: '#fafafa',
      headerColor: '#ffffff'
    },
    features: {
      enableAdvancedFeatures: false,
      enableBetaFeatures: false,
      customModules: ['maintenance', 'safety']
    }
  },
  199: { 
    // Default layout for Company ID 199 (Customer Support)
    sidebarComponent: 'default',
    headerComponent: 'default',
    theme: {
      primaryColor: '#C72030',
      backgroundColor: '#fafafa',
      headerColor: '#ffffff'
    },
    features: {
      enableAdvancedFeatures: true,
      enableBetaFeatures: false,
      customModules: ['maintenance', 'safety', 'finance']
    }
  },
  204: { 
    // Static layout for Company ID 204 (GoPhygital.work)
    sidebarComponent: 'static',
    headerComponent: 'static',
    theme: {
      primaryColor: '#C72030',
      backgroundColor: '#fafafa',
      headerColor: '#ffffff'
    },
    features: {
      enableAdvancedFeatures: false,
      enableBetaFeatures: false,
      customModules: ['maintenance', 'safety', 'finance']
    }
  }
};

export const DEFAULT_LAYOUT: LayoutConfig = {
  sidebarComponent: 'static',
  headerComponent: 'static',
  theme: {
    primaryColor: '#C72030',
    backgroundColor: '#fafafa',
    headerColor: '#ffffff'
  },
  features: {
    enableAdvancedFeatures: false,
    enableBetaFeatures: false,
    customModules: ['maintenance']
  }
};

/**
 * Get layout configuration for a specific company ID
 * @param companyId - The company ID to get layout for
 * @returns LayoutConfig object
 */
export const getCompanyLayout = (companyId: number | null): LayoutConfig => {
  if (!companyId) {
    return DEFAULT_LAYOUT;
  }
  
  return COMPANY_LAYOUTS[companyId] || DEFAULT_LAYOUT;
};

/**
 * Check if a company has access to a specific feature
 * @param companyId - The company ID
 * @param feature - The feature to check
 * @returns boolean indicating if the feature is enabled
 */
export const hasCompanyFeature = (companyId: number | null, feature: 'enableAdvancedFeatures' | 'enableBetaFeatures'): boolean => {
  const layout = getCompanyLayout(companyId);
  return Boolean(layout.features?.[feature]);
};

/**
 * Check if a company has access to a specific module
 * @param companyId - The company ID
 * @param module - The module to check
 * @returns boolean indicating if the module is available
 */
export const hasCompanyModule = (companyId: number | null, module: string): boolean => {
  const layout = getCompanyLayout(companyId);
  return layout.features?.customModules?.includes(module) || false;
};
